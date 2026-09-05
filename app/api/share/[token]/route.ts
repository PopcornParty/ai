import { store } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const item = store.getByShareToken(token);
  if (!item) return Response.json({ error: "This share link is invalid or has been revoked." }, { status: 404 });
  const messages = store.listMessages(item.id).map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.createdAt,
    sources: m.sources,
  }));
  return Response.json({
    title: item.title,
    createdAt: item.createdAt,
    messages,
  });
}
