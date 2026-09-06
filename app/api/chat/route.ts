import { NextRequest } from "next/server";
import { nid as nanoid } from "@/lib/id";
import { store } from "@/lib/db";
import { getModel } from "@/lib/models";
import { streamChat, type ChatTurn } from "@/lib/providers";
import {
  analyzeCode,
  calculator,
  dateTimeTool,
  fetchUrl,
  sandboxStatus,
  searchConfigured,
  shouldSearch,
  webSearch,
} from "@/lib/tools";
import { attachmentContext, buildSystemPrompt, trimTurns } from "@/lib/context";
import { rateLimit } from "@/lib/rate-limit";
import type { ChatRequestBody, Source, ToolEvent } from "@/lib/types";
import { estimateTokens, titleFromPrompt } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!rateLimit(req.headers.get("x-forwarded-for") || "local")) {
    return Response.json({ error: "Too many requests. Wait a moment and try again." }, { status: 429 });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "The request body was not valid JSON." }, { status: 400 });
  }

  const model = getModel(body.modelId);
  if (!model) return Response.json({ error: "No models are configured." }, { status: 400 });
  if (!model.configured) {
    return Response.json({
      error: `The selected model (${model.name}) is not available because its provider is not configured.`,
    }, { status: 400 });
  }

  const settings = store.getSettings();
  const project = body.projectId ? store.getProject(body.projectId) : null;
  const memories = settings.memoryEnabled ? store.listMemories() : [];
  const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
  const lastText = lastUser?.content ?? "";

  const encoder = new TextEncoder();
  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort());

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const toolEvents: ToolEvent[] = [];
      const sources: Source[] = [];
      const notes: string[] = [];
      const started = Date.now();
      try {
        send("status", { phase: "preparing" });
        if (body.toolsEnabled?.webSearch && shouldSearch(lastText, true)) {
          if (!searchConfigured()) {
            send("status", { phase: "search-unavailable" });
            notes.push("Web search was requested but is not configured.");
          } else {
            send("status", { phase: "searching" });
            const result = await webSearch(lastText.slice(0, 400));
            toolEvents.push(result.event);
            if (result.sources) sources.push(...result.sources);
            notes.push(`Web search results:\n${result.text}`);
            send("tools", { events: toolEvents, sources });
            send("status", { phase: result.ok ? "reading-sources" : "search-empty" });
          }
        }
        if (body.toolsEnabled?.calculator && /[\d+\-*/]{3,}/.test(lastText)) {
          const expr = lastText.match(/[0-9+\-*/().^\s%]{3,}/)?.[0] ?? lastText;
          const result = calculator(expr);
          toolEvents.push(result.event);
          notes.push(result.text);
          send("tools", { events: toolEvents });
        }
        if (/\b(date|time|timezone|what day)\b/i.test(lastText)) {
          const result = dateTimeTool();
          toolEvents.push(result.event);
          notes.push(result.text);
        }
        const urlMatch = lastText.match(/https?:\/\/[^\s)]+/);
        if (body.toolsEnabled?.urlFetch && urlMatch) {
          send("status", { phase: "fetching-url" });
          const result = await fetchUrl(urlMatch[0]);
          toolEvents.push(result.event);
          notes.push(result.text);
          if (result.sources) sources.push(...result.sources);
          send("tools", { events: toolEvents, sources });
        }
        if (/\b(execute|run this code)\b/i.test(lastText)) {
          const result = sandboxStatus();
          toolEvents.push(result.event);
          notes.push(result.text);
        }
        const codeAtt = lastUser?.attachments?.find((a) => a.kind === "code" || a.kind === "data");
        if (codeAtt?.extractedText) {
          const result = analyzeCode(codeAtt.extractedText, codeAtt.name.split(".").pop());
          toolEvents.push(result.event);
          notes.push(result.text);
        }
        const system = buildSystemPrompt({
          base: body.systemInstructions || settings.systemInstructions,
          project,
          memories,
          memoryEnabled: settings.memoryEnabled,
          toolNotes: notes.length ? notes.join("\n\n") : undefined,
        });
        const turns: ChatTurn[] = body.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role,
            content: m.role === "user" ? [m.content, attachmentContext(m.attachments)].filter(Boolean).join("\n\n") : m.content,
            attachments: m.attachments,
          }));
        const trimmed = trimTurns(turns);
        send("status", { phase: "answering" });
        let full = "";
        await streamChat({
          model,
          messages: trimmed,
          temperature: body.temperature ?? settings.temperature,
          system,
          signal: abort.signal,
          callbacks: {
            onDelta(text) {
              full += text;
              send("delta", { text });
            },
          },
        });
        const inTok = estimateTokens(system + trimmed.map((t) => t.content).join("\n"));
        const outTok = estimateTokens(full);
        send("done", {
          sources,
          toolEvents,
          usage: { inputTokens: inTok, outputTokens: outTok, estimated: true },
          model: model.id,
          provider: model.provider,
        });
        store.addUsage({
          id: nanoid(),
          createdAt: Date.now(),
          model: model.id,
          provider: model.provider,
          inputTokens: inTok,
          outputTokens: outTok,
          estimated: true,
          durationMs: Date.now() - started,
          tools: toolEvents.map((t) => t.name).join(","),
          status: "ok",
        });
        void titleFromPrompt;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.name === "AbortError"
              ? "Generation was stopped."
              : err.message
            : "The request failed.";
        send("error", { message });
        store.addUsage({
          id: nanoid(),
          createdAt: Date.now(),
          model: model.id,
          provider: model.provider,
          estimated: true,
          durationMs: Date.now() - started,
          tools: "",
          status: abort.signal.aborted ? "cancelled" : "error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
