import { store } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return Response.json({ items: [] });
  const conversations = store.listConversations({ q });
  const hits: Array<{ conversationId: string; title: string; snippet: string; role: string }> = [];
  const needle = q.toLowerCase();
  for (const c of conversations.slice(0, 40)) {
    const messages = store.listMessages(c.id);
    for (const m of messages) {
      const idx = m.content.toLowerCase().indexOf(needle);
      if (idx >= 0) {
        const start = Math.max(0, idx - 40);
        hits.push({
          conversationId: c.id,
          title: c.title,
          role: m.role,
          snippet: `${start > 0 ? "\u2026" : ""}${m.content.slice(start, start + 140)}${m.content.length > start + 140 ? "\u2026" : ""}`,
        });
        if (hits.length >= 40) break;
      }
    }
    if (hits.length >= 40) break;
  }
  return Response.json({ conversations, hits });
}
