import { persistUpload, validateFile } from "@/lib/files";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit("upload", 20, 60_000)) {
    return Response.json({ error: "Too many uploads. Try again shortly." }, { status: 429 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file was provided." }, { status: 400 });
  }
  const err = validateFile(file.name, file.type || "application/octet-stream", file.size);
  if (err) return Response.json({ error: err }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const meta = persistUpload(file.name, file.type || "application/octet-stream", buffer);
  if (meta.kind === "document" && !meta.extractedText) {
    return Response.json({
      item: meta,
      warning: meta.name.endsWith(".pdf")
        ? "This PDF could not be fully extracted. Text-based PDFs work best; scanned pages need a vision model."
        : "This document's text could not be fully extracted.",
    });
  }
  return Response.json({ item: meta });
}
