import { listModels, providerLabel } from "@/lib/models";
import { hasAnyLlmKey } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const models = listModels();
  return Response.json({
    configured: hasAnyLlmKey(),
    items: models.map((m) => ({
      ...m,
      providerLabel: providerLabel(m.provider),
    })),
  });
}
