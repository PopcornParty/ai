import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)]">◎</span>
          Lumina
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <a href="#features" className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
            Features
          </a>
          <Link href="/app" className="rounded-full bg-[var(--ink)] px-4 py-2 text-[var(--bg)]">
            Open workspace
          </Link>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:pt-20">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Multi-model assistant</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          A clear place to think with any model you actually have keys for.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
          Lumina is a production-style workspace for conversation, files, research, and projects.
          It does not invent providers, sources, or answers. If a capability is not configured, it says so.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app" className="rounded-full bg-[var(--ink)] px-5 py-3 text-[var(--bg)]">
            Launch Lumina
          </Link>
          <a href="#features" className="rounded-full border border-[var(--line)] px-5 py-3">
            See what is included
          </a>
        </div>
      </section>
      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-5 pb-24 md:grid-cols-3">
        {[
          ["Models, not lock-in", "OpenAI, Anthropic, Gemini, xAI, OpenRouter, and local OpenAI-compatible endpoints through one interface."],
          ["Files and images", "Upload documents and pictures. Text is extracted where possible. Vision models receive images directly."],
          ["Web research", "Optional Tavily, Brave, or Serper search with real source cards. No fabricated citations."],
          ["Projects and memory", "Keep instructions and notes per project. Optional visible memory you can add or delete."],
          ["Serious workspace UX", "Streaming replies, markdown, code copy, regenerate, search, pins, folders, sharing, and export."],
          ["Keys stay on the server", "The browser never sees provider secrets. Missing configuration produces a readable error, not a crash."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
