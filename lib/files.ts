import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ALLOWED_EXT, ALLOWED_MIME, MAX_EXTRACT_CHARS, MAX_UPLOAD_BYTES } from "./config";
import type { AttachmentMeta } from "./types";
import { extOf } from "./utils";
import { nid as nanoid } from "@/lib/id";

const TEXT_EXT = new Set([
  "txt","md","markdown","csv","json","html","js","ts","tsx","jsx","py","rb","go","rs","java","c","cpp","h","css","yml","yaml","toml","xml","sql","sh",
]);

export function classify(name: string, mime: string): AttachmentMeta["kind"] {
  if (mime.startsWith("image/")) return "image";
  const ext = extOf(name);
  if (["js","ts","tsx","jsx","py","rb","go","rs","java","c","cpp","h","css","sql","sh"].includes(ext)) return "code";
  if (["csv","json","yml","yaml","toml","xml"].includes(ext)) return "data";
  if (["pdf","docx"].includes(ext)) return "document";
  if (TEXT_EXT.has(ext) || mime.startsWith("text/")) return "text";
  return "other";
}

export function validateFile(name: string, mime: string, size: number): string | null {
  if (size > MAX_UPLOAD_BYTES) return `The file is too large. Maximum size is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`;
  const ext = extOf(name);
  if (!ALLOWED_EXT.has(ext) && !ALLOWED_MIME.has(mime) && !mime.startsWith("text/") && !mime.startsWith("image/")) {
    return `Files of type "${ext || mime || "unknown"}" are not supported.`;
  }
  return null;
}

export function extractText(name: string, mime: string, buffer: Buffer): string | undefined {
  const ext = extOf(name);
  if (TEXT_EXT.has(ext) || mime.startsWith("text/") || mime === "application/json") {
    return buffer.toString("utf8").slice(0, MAX_EXTRACT_CHARS);
  }
  if (ext === "pdf") {
    const raw = buffer.toString("latin1");
    const pieces = [...raw.matchAll(/\((?:\\\)|[^)]){4,200}\)/g)].map((m) =>
      m[0].slice(1, -1).replace(/\\n/g, "\n").replace(/\\\)/g, ")"),
    );
    const joined = pieces.join(" ").replace(/\s+/g, " ").trim();
    if (joined.length > 80) return joined.slice(0, MAX_EXTRACT_CHARS);
    return undefined;
  }
  if (ext === "docx") {
    const raw = buffer.toString("utf8");
    const xmlChunks = raw.match(/<w:t[^>]*>[^<]+<\/w:t>/g) || [];
    const text = xmlChunks.map((t) => t.replace(/<[^>]+>/g, "")).join(" ").replace(/\s+/g, " ").trim();
    return text ? text.slice(0, MAX_EXTRACT_CHARS) : undefined;
  }
  return undefined;
}

export function persistUpload(name: string, mime: string, buffer: Buffer): AttachmentMeta {
  const id = nanoid();
  const dir = join(process.cwd(), "data", "uploads");
  mkdirSync(dir, { recursive: true });
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = join(dir, `${id}-${safe}`);
  writeFileSync(path, buffer);
  const kind = classify(name, mime);
  const extractedText = extractText(name, mime, buffer);
  const dataUrl = kind === "image" ? `data:${mime};base64,${buffer.toString("base64")}` : undefined;
  return { id, name, mime, size: buffer.length, kind, extractedText, excerpt: extractedText?.slice(0, 280), dataUrl, path };
}
