import { store } from "@/lib/db";
import type { AppSettings } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ item: store.getSettings() });
}

export async function PUT(req: Request) {
  const patch = (await req.json()) as Partial<AppSettings>;
  const next = store.saveSettings({ ...store.getSettings(), ...patch });
  return Response.json({ item: next });
}
