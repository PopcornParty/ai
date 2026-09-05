import { store } from "@/lib/db";
import type { Conversation } from "@/lib/types";
import { nid as nanoid } from "@/lib/id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const archived = url.searchParams.get("archived") === "1";
  const q = url.searchParams.get("q") || undefined;
  const items = store.listConversations({ archived, q });
  return Response.json({ items });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Partial<Conversation>;
  const now = Date.now();
  const c = store.upsertConversation({
    id: body.id || nanoid(),
    title: body.title || "New conversation",
    createdAt: now,
    updatedAt: now,
    pinned: Boolean(body.pinned),
    archived: false,
    projectId: body.projectId ?? null,
    modelId: body.modelId,
    shareToken: null,
    systemPrompt: body.systemPrompt ?? null,
  });
  return Response.json({ item: c });
}
