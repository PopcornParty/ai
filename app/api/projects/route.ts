import { store } from "@/lib/db";
import type { Project } from "@/lib/types";
import { nid as nanoid } from "@/lib/id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ items: store.listProjects() });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Project>;
  const now = Date.now();
  const item = store.upsertProject({
    id: body.id || nanoid(),
    name: body.name || "Untitled project",
    description: body.description || "",
    instructions: body.instructions || "",
    knowledge: body.knowledge || "",
    createdAt: now,
    updatedAt: now,
    color: body.color || "#c9862a",
  });
  return Response.json({ item });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Project;
  if (!body.id) return Response.json({ error: "Missing project id." }, { status: 400 });
  const item = store.upsertProject({ ...body, updatedAt: Date.now() });
  return Response.json({ item });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });
  store.deleteProject(id);
  return Response.json({ ok: true });
}
