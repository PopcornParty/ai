import { MAX_CONTEXT_TOKENS_GUARD } from "./config";
import type { ChatTurn } from "./providers";
import type { AttachmentMeta, MemoryItem, Project } from "./types";
import { estimateTokens } from "./utils";

export function buildSystemPrompt(opts: {
  base: string;
  project?: Project | null;
  memories: MemoryItem[];
  memoryEnabled: boolean;
  toolNotes?: string;
}): string {
  const parts = [opts.base.trim()];
  if (opts.project) {
    parts.push(`Project: ${opts.project.name}.\n${opts.project.instructions}`.trim());
    if (opts.project.knowledge.trim()) {
      parts.push(`Project knowledge:\n${opts.project.knowledge.slice(0, 8000)}`);
    }
  }
  if (opts.memoryEnabled && opts.memories.length) {
    parts.push(
      `Remembered preferences (non-sensitive only):\n${opts.memories
        .slice(0, 30)
        .map((m) => `- ${m.content}`)
        .join("\n")}`,
    );
  }
  if (opts.toolNotes) parts.push(opts.toolNotes);
  parts.push("Never invent sources or citations. If tools were not used, do not claim they were.");
  return parts.filter(Boolean).join("\n\n");
}

export function trimTurns(turns: ChatTurn[], budget = MAX_CONTEXT_TOKENS_GUARD): ChatTurn[] {
  if (turns.length === 0) return turns;
  const last = turns[turns.length - 1];
  const kept: ChatTurn[] = [last];
  let used = estimateTokens(last.content) + attachmentTokens(last.attachments);
  for (let i = turns.length - 2; i >= 0; i--) {
    const t = turns[i];
    const cost = estimateTokens(t.content) + attachmentTokens(t.attachments);
    if (used + cost > budget) {
      const summary = summarizeDropped(turns.slice(0, i + 1));
      return [{ role: "system", content: summary }, ...kept];
    }
    kept.unshift(t);
    used += cost;
  }
  return kept;
}

function attachmentTokens(atts?: AttachmentMeta[]): number {
  if (!atts) return 0;
  return atts.reduce((n, a) => n + estimateTokens(a.extractedText || a.excerpt || a.name), 0);
}

function summarizeDropped(turns: ChatTurn[]): string {
  const userBits = turns
    .filter((t) => t.role === "user")
    .map((t) => t.content.replace(/\s+/g, " ").slice(0, 120))
    .slice(-8);
  return `Earlier conversation summary (truncated for context limits):\n${userBits
    .map((b, i) => `${i + 1}. ${b}`)
    .join("\n")}`;
}

export function attachmentContext(atts?: AttachmentMeta[]): string {
  if (!atts?.length) return "";
  return atts
    .map((a) => {
      if (a.kind === "image") return `[Image attached: ${a.name}]`;
      const body = (a.extractedText || a.excerpt || "").slice(0, 12000);
      return `[File: ${a.name}]\n${body}`;
    })
    .join("\n\n");
}
