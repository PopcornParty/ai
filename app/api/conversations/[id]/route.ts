import { store } from "@/lib/db";
import type { Conversation, Message } from "@/lib/types";
import { nid as nanoid } from "@/lib/id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = store.getConversation(id);
  if (!item) return Response.json({ error: "Conversation not found." }, { status: 404 });
  const messages = store.listMessages(id);
  return Response.json({ item, messages });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = store.getConversation(id);
  if (!existing) return Response.json({ error: "Conversation not found." }, { status: 404 });
  const patch = (await req.json()) as Partial<Conversation> & { share?: boolean };
  if (patch.share === true) existing.shareToken = existing.shareToken || nanoid();
  if (patch.share === false) existing.shareToken = null;
  const item = store.upsertConversation({
    ...existing,
    ...patch,
    id,
    updatedAt: Date.now(),
    shareToken: patch.share === true || patch.share === false ? existing.shareToken : patch.shareToken ?? existing.shareToken,
  });
  return Response.json({ item });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  store.deleteConversation(id);
  return Response.json({ ok: true });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = store.getConversation(id);
  if (!existing) return Response.json({ error: "Conversation not found." }, { status: 404 });
  const body = (await req.json()) as { message?: Message; replaceAfter?: { createdAt: number; id?: string } };
  if (body.replaceAfter) {
    store.deleteMessagesAfter(id, body.replaceAfter.createdAt, body.replaceAfter.id);
  }
  if (body.message) {
    store.insertMessage({ ...body.message, conversationId: id });
  }
  return Response.json({ ok: true, messages: store.listMessages(id) });
}
