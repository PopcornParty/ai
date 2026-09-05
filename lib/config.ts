import type { ProviderId } from "./types";

export const APP_NAME = "Lumina";
export const APP_TAGLINE = "A clear place to think.";
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
export const MAX_EXTRACT_CHARS = 24_000;
export const MAX_CONTEXT_TOKENS_GUARD = 24_000;

export const ALLOWED_MIME = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "text/html",
  "application/json",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const ALLOWED_EXT = new Set([
  "txt",
  "md",
  "markdown",
  "csv",
  "json",
  "html",
  "pdf",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "js",
  "ts",
  "tsx",
  "jsx",
  "py",
  "rb",
  "go",
  "rs",
  "java",
  "c",
  "cpp",
  "h",
  "css",
  "yml",
  "yaml",
  "toml",
  "xml",
  "sql",
  "sh",
]);

export function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export function providerKeys(): Record<ProviderId, string | undefined> {
  return {
    openai: env("OPENAI_API_KEY"),
    anthropic: env("ANTHROPIC_API_KEY"),
    google: env("GOOGLE_GENERATIVE_AI_API_KEY") || env("GEMINI_API_KEY"),
    xai: env("XAI_API_KEY"),
    openrouter: env("OPENROUTER_API_KEY"),
    local: env("LOCAL_MODEL_BASE_URL") ? "local" : undefined,
  };
}

export function searchKeys() {
  return {
    tavily: env("TAVILY_API_KEY"),
    brave: env("BRAVE_SEARCH_API_KEY"),
    serper: env("SERPER_API_KEY"),
  };
}

export function hasAnyLlmKey(): boolean {
  const k = providerKeys();
  return Boolean(k.openai || k.anthropic || k.google || k.xai || k.openrouter || k.local);
}

export function openaiCompatibleBase(provider: ProviderId): string | undefined {
  if (provider === "openai") return env("OPENAI_BASE_URL") || "https://api.openai.com/v1";
  if (provider === "xai") return env("XAI_BASE_URL") || "https://api.x.ai/v1";
  if (provider === "openrouter") return "https://openrouter.ai/api/v1";
  if (provider === "local") return env("LOCAL_MODEL_BASE_URL");
  return undefined;
}
