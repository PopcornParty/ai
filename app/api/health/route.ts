import { hasAnyLlmKey, providerKeys, searchKeys } from "@/lib/config";
import { listModels } from "@/lib/models";
import { pingProvider } from "@/lib/providers";
import { searchConfigured } from "@/lib/tools";
import { store } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ping = url.searchParams.get("ping") === "1";
  const keys = providerKeys();
  const models = listModels();
  let pings: Record<string, { ok: boolean; message: string }> | undefined;
  if (ping) {
    pings = {};
    for (const id of Object.keys(keys) as Array<keyof typeof keys>) {
      if (keys[id]) pings[id] = await pingProvider(id);
    }
  }
  let dbOk = true;
  try {
    store.getSettings();
  } catch {
    dbOk = false;
  }
  return Response.json({
    ok: true,
    llmConfigured: hasAnyLlmKey(),
    searchConfigured: searchConfigured(),
    providers: Object.fromEntries(Object.entries(keys).map(([k, v]) => [k, Boolean(v)])),
    search: Object.fromEntries(Object.entries(searchKeys()).map(([k, v]) => [k, Boolean(v)])),
    models: models.map((m) => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      configured: m.configured,
      capabilities: m.capabilities,
    })),
    database: dbOk,
    pings,
  });
}
