import { store } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const format = url.searchParams.get("format") || "json";
  if (url.searchParams.get("all") === "1") {
    return Response.json(store.exportAll());
  }
  if (!id) return Response.json({ error: "Missing conversation id." }, { status: 400 });
  const item = store.getConversation(id);
  if (!item) return Response.json({ error: "Conversation not found." }, { status: 404 });
  const messages = store.listMessages(id);
  if (format === "md" || format === "markdown") {
    const md = [`# ${item.title}`, "", ...messages.map((m) => `## ${m.role}\n\n${m.content}\n`)].join("\n");
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${item.title.replace(/\s+/g, "-")}.md"`,
      },
    });
  }
  if (format === "txt") {
    const txt = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    return new Response(txt, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${item.title.replace(/\s+/g, "-")}.txt"`,
      },
    });
  }
  return Response.json({ item, messages });
}

export async function DELETE() {
  store.wipeAllConversations();
  return Response.json({ ok: true });
}

export async function POST(req: Request) {
  const data = (await req.json()) as ReturnType<typeof store.exportAll>;
  if (data.settings) store.saveSettings(data.settings);
  for (const p of data.projects ?? []) store.upsertProject(p);
  for (const c of data.conversations ?? []) store.upsertConversation(c);
  for (const m of data.messages ?? []) {
    try {
      store.insertMessage(m);
    } catch {
      /* skip duplicates */
    }
  }
  return Response.json({ ok: true });
}
