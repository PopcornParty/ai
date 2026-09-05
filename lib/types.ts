export type Role = "system" | "user" | "assistant" | "tool";

export type ThemePreference = "system" | "light" | "dark";

export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "openrouter"
  | "local";

export type ModelCapability = "vision" | "tools" | "reasoning" | "streaming";

export interface ModelDef {
  id: string;
  name: string;
  provider: ProviderId;
  description: string;
  contextWindow: number;
  speed: "fast" | "balanced" | "deliberate";
  capabilities: ModelCapability[];
  apiModel: string;
  configured: boolean;
}

export interface AttachmentMeta {
  id: string;
  name: string;
  mime: string;
  size: number;
  kind: "image" | "text" | "document" | "code" | "data" | "other";
  extractedText?: string;
  excerpt?: string;
  dataUrl?: string;
  path?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: number;
  model?: string;
  provider?: ProviderId;
  attachments?: AttachmentMeta[];
  sources?: Source[];
  toolEvents?: ToolEvent[];
  error?: string;
  usage?: { inputTokens?: number; outputTokens?: number; estimated: boolean };
}

export interface Source {
  title: string;
  url: string;
  domain: string;
  excerpt?: string;
}

export interface ToolEvent {
  id: string;
  name: string;
  status: "running" | "success" | "error";
  detail?: string;
  startedAt: number;
  endedAt?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  archived: boolean;
  projectId?: string | null;
  modelId?: string;
  shareToken?: string | null;
  systemPrompt?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  instructions: string;
  knowledge: string;
  createdAt: number;
  updatedAt: number;
  color: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  createdAt: number;
}

export interface AppSettings {
  theme: ThemePreference;
  language: string;
  animations: boolean;
  compactMode: boolean;
  defaultModel: string;
  temperature: number;
  systemInstructions: string;
  memoryEnabled: boolean;
  ttsEnabled: boolean;
  sttEnabled: boolean;
  voiceName: string;
}

export interface UsageEvent {
  id: string;
  createdAt: number;
  model: string;
  provider: string;
  inputTokens?: number;
  outputTokens?: number;
  estimated: boolean;
  durationMs: number;
  tools: string;
  status: "ok" | "error" | "cancelled";
}

export interface ChatRequestBody {
  conversationId?: string;
  messages: Array<{
    role: Role;
    content: string;
    attachments?: AttachmentMeta[];
  }>;
  modelId: string;
  temperature?: number;
  systemInstructions?: string;
  projectId?: string | null;
  toolsEnabled?: { webSearch?: boolean; calculator?: boolean; urlFetch?: boolean };
  regenerateFrom?: string;
}
