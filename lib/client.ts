import type {
  AppSettings,
  AttachmentMeta,
  Conversation,
  MemoryItem,
  Message,
  Project,
} from "./types";

async function parse<T>(res: Response | Promise<Response>): Promise<T> {
  res = await res;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  conversations: (q?: string, archived = false) =>
    parse<{ items: Conversation[] }>(
      fetch(`/api/conversations?archived=${archived ? 1 : 0}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
    ),
  createConversation: (body: Partial<Conversation>) =>
    parse<{ item: Conversation }>(
      fetch("/api/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    ),
  conversation: (id: string) =>
    parse<{ item: Conversation; messages: Message[] }>(fetch(`/api/conversations/${id}`)),
  patchConversation: (id: string, body: Partial<Conversation> & { share?: boolean }) =>
    parse<{ item: Conversation }>(
      fetch(`/api/conversations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    ),
  deleteConversation: (id: string) =>
    parse<{ ok: boolean }>(fetch(`/api/conversations/${id}`, { method: "DELETE" })),
  saveMessage: (id: string, message: Message, replaceAfter?: { createdAt: number; id?: string }) =>
    parse<{ ok: boolean; messages: Message[] }>(
      fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, replaceAfter }),
      }),
    ),
  search: (q: string) =>
    parse<{ conversations: Conversation[]; hits: Array<{ conversationId: string; title: string; snippet: string; role: string }> }>(
      fetch(`/api/search?q=${encodeURIComponent(q)}`),
    ),
  models: () =>
    parse<{ configured: boolean; items: Array<import("./types").ModelDef & { providerLabel: string }> }>(fetch("/api/models")),
  health: (ping = false) => fetch(`/api/health${ping ? "?ping=1" : ""}`).then((r) => r.json()),
  settings: () => parse<{ item: AppSettings }>(fetch("/api/settings")),
  saveSettings: (item: Partial<AppSettings>) =>
    parse<{ item: AppSettings }>(
      fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }),
    ),
  projects: () => parse<{ items: Project[] }>(fetch("/api/projects")),
  saveProject: (item: Partial<Project>, method: "POST" | "PUT" = "POST") =>
    parse<{ item: Project }>(
      fetch("/api/projects", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }),
    ),
  deleteProject: (id: string) => parse(fetch(`/api/projects?id=${id}`, { method: "DELETE" })),
  memories: () => parse<{ items: MemoryItem[] }>(fetch("/api/memory")),
  addMemory: (content: string) =>
    parse<{ item: MemoryItem }>(
      fetch("/api/memory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) }),
    ),
  deleteMemory: (id?: string, all = false) =>
    parse(fetch(`/api/memory?${all ? "all=1" : `id=${id}`}`, { method: "DELETE" })),
  usage: () => fetch("/api/usage").then((r) => r.json()),
  upload: async (file: File) => {
    const form = new FormData();
    form.set("file", file);
    return parse<{ item: AttachmentMeta; warning?: string }>(fetch("/api/upload", { method: "POST", body: form }));
  },
};
