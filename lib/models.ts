import { env, providerKeys } from "./config";
import type { ModelCapability, ModelDef, ProviderId } from "./types";

function model(
  partial: Omit<ModelDef, "configured" | "capabilities"> & {
    capabilities?: ModelCapability[];
  },
): ModelDef {
  const keys = providerKeys();
  return {
    ...partial,
    capabilities: partial.capabilities ?? ["streaming"],
    configured: Boolean(keys[partial.provider]),
  };
}

const BUILTIN: Omit<ModelDef, "configured">[] = [
  {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "openai",
    apiModel: "gpt-4o-mini",
    description: "Fast general model with vision and tools.",
    contextWindow: 128000,
    speed: "fast",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    apiModel: "gpt-4o",
    description: "Strong multimodal reasoning for complex work.",
    contextWindow: 128000,
    speed: "balanced",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "anthropic:claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    apiModel: "claude-sonnet-4-5",
    description: "Balanced Anthropic model for writing and code.",
    contextWindow: 200000,
    speed: "balanced",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "anthropic:claude-3-5-haiku-latest",
    name: "Claude Haiku 3.5",
    provider: "anthropic",
    apiModel: "claude-3-5-haiku-latest",
    description: "Quick Anthropic model for everyday tasks.",
    contextWindow: 200000,
    speed: "fast",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "google:gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    apiModel: "gemini-2.0-flash",
    description: "Google's fast multimodal model.",
    contextWindow: 1000000,
    speed: "fast",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "xai:grok-3-mini",
    name: "Grok 3 Mini",
    provider: "xai",
    apiModel: "grok-3-mini",
    description: "xAI's efficient reasoning-capable model.",
    contextWindow: 131072,
    speed: "fast",
    capabilities: ["streaming", "tools", "reasoning"],
  },
  {
    id: "xai:grok-3",
    name: "Grok 3",
    provider: "xai",
    apiModel: "grok-3",
    description: "xAI flagship for analysis and conversation.",
    contextWindow: 131072,
    speed: "balanced",
    capabilities: ["streaming", "tools", "reasoning"],
  },
  {
    id: "openrouter:openai/gpt-4o-mini",
    name: "GPT-4o mini (OpenRouter)",
    provider: "openrouter",
    apiModel: "openai/gpt-4o-mini",
    description: "Routed through OpenRouter.",
    contextWindow: 128000,
    speed: "fast",
    capabilities: ["streaming", "vision", "tools"],
  },
  {
    id: "local:default",
    name: "Local model",
    provider: "local",
    apiModel: env("LOCAL_MODEL_NAME") || "llama3.1",
    description: "Self-hosted OpenAI-compatible endpoint.",
    contextWindow: 8192,
    speed: "balanced",
    capabilities: ["streaming"],
  },
];

export function listModels(): ModelDef[] {
  const extra = env("EXTRA_MODELS");
  const extras: ModelDef[] = [];
  if (extra) {
    try {
      const parsed = JSON.parse(extra) as Array<Partial<ModelDef> & { id: string; apiModel: string; provider: ProviderId }>;
      for (const p of parsed) {
        extras.push(
          model({
            id: p.id,
            name: p.name || p.apiModel,
            provider: p.provider,
            apiModel: p.apiModel,
            description: p.description || "Custom model",
            contextWindow: p.contextWindow || 32000,
            speed: p.speed || "balanced",
            capabilities: p.capabilities || ["streaming"],
          }),
        );
      }
    } catch {
      /* ignore malformed EXTRA_MODELS */
    }
  }
  return [...BUILTIN.map((m) => model(m)), ...extras];
}

export function getModel(id: string | undefined): ModelDef | undefined {
  const models = listModels();
  if (id) {
    const found = models.find((m) => m.id === id);
    if (found) return found;
  }
  return models.find((m) => m.configured) ?? models[0];
}

export function providerLabel(id: ProviderId): string {
  switch (id) {
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    case "google":
      return "Google";
    case "xai":
      return "xAI";
    case "openrouter":
      return "OpenRouter";
    case "local":
      return "Local";
  }
}
