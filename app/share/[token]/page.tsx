"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Markdown } from "@/components/Markdown";

export default function SharePage() {
  const params = useParams<{ token: string }>();
  const [data, setData] = useState<{ title: string; messages: Array<{ id: string; role: string; content: string }> } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/share/${params.token}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Unavailable");
        setData(json);
      })
      .catch((e) => setError(e.message));
  }, [params.token]);

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-10">
      <a href="/" className="text-sm text-[var(--ink-soft)]">Lumina</a>
      {error && <p className="mt-8">{error}</p>}
      {data && (
        <>
          <h1 className="mt-4 text-3xl font-semibold">{data.title}</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">Read-only shared conversation</p>
          <div className="mt-8 space-y-6">
            {data.messages.map((m) => (
              <section key={m.id}>
                <div className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">{m.role}</div>
                {m.role === "assistant" ? <Markdown content={m.content} /> : <p className="whitespace-pre-wrap">{m.content}</p>}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
