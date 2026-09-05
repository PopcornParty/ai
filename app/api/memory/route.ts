import { store } from "@/lib/db";
import { nid as nanoid } from "@/lib/id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ items: store.listMemories() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { content?: string };
  const content = body.content?.trim();
  if (!content) return Response.json({ error: "Memory content is required." }, { status: 400 });
  const item = store.addMemory({ id: nanoid(), content, createdAt: Date.now() });
  return Response.json({ item });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  const id = url.searchParams.get("id");
  if (all) store.clearMemories();
  else if (id) store.deleteMemory(id);
  else return Response.json({ error: "Specify id or all=1." }, { status: 400 });
  return Response.json({ ok: true });
}
