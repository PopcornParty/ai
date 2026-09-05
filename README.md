# Lumina

A multi-model AI workspace. Conversations, projects, files, optional web research, memory, and streaming replies — with provider keys kept on the server.

Lumina is the product name for this repository (`PopcornParty/ai`).

## Features

- Chat workspace with sidebar history, search, pin, rename, archive, delete
- Projects with instructions and knowledge notes
- Optional visible memory
- Multi-provider models: OpenAI, Anthropic, Google Gemini, xAI, OpenRouter, local OpenAI-compatible
- Streaming responses and useful provider errors
- Markdown, code blocks, copy/collapse
- File uploads with text extraction and image previews
- Vision routing when the selected model supports images
- Optional web search (Tavily / Brave / Serper) with real source cards
- Browser speech-to-text and read-aloud
- Share links (read-only, revocable)
- Export Markdown, JSON, and plain text
- Command palette (Cmd/Ctrl K) and keyboard shortcuts
- Usage + health developer panel
- Light / dark / system theme
- Responsive desktop, tablet, and mobile layout

Lumina does **not** invent answers, sources, or configured models. If a key is missing, the UI explains what to add.

## Tech stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Node.js built-in SQLite (`node:sqlite`)
- Server-side streaming against native provider APIs
- Local file storage under `data/`

## Architecture

```
app/                 pages + API routes
components/          workspace UI
lib/
  config.ts          env + limits
  models.ts          model catalog
  providers.ts       streaming adapters
  tools.ts           search, calc, url fetch, analysis
  db.ts              SQLite persistence
  context.ts         prompt + truncation
  files.ts           upload validation/extraction
```

API keys never ship to the browser. Chat generation happens in `app/api/chat`.

## Installation

Requires Node.js 22+ (24 recommended, for `node:sqlite`).

```bash
git clone https://github.com/PopcornParty/ai.git
cd ai
npm install
cp .env.example .env.local
```

Add at least one provider key to `.env.local`.

```bash
npm run dev
```

Open http://localhost:3000 and go to the workspace.

```bash
npm run build
npm start
```

## Environment variables

See `.env.example`. Summary:

| Variable | Required for |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI models |
| `ANTHROPIC_API_KEY` | Claude models |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini models |
| `XAI_API_KEY` | Grok models |
| `OPENROUTER_API_KEY` | OpenRouter models |
| `LOCAL_MODEL_BASE_URL` | Local/Ollama-style endpoints |
| `TAVILY_API_KEY` / `BRAVE_SEARCH_API_KEY` / `SERPER_API_KEY` | Web search |
| `SANDBOX_EXEC_URL` | Future isolated code execution |
| `LUMINA_DB_PATH` | Custom SQLite location |
| `EXTRA_MODELS` | JSON list of additional models |

Features work without optional keys. Search, extra providers, and sandbox execution stay disabled instead of faking results.

## Database

SQLite is created automatically at `data/lumina.db` on first request. No separate database server is required.

## Security notes

- Provider secrets stay on the server
- Upload type and size are validated
- URL fetch blocks localhost and private networks
- Arbitrary user code is not executed on the app server
- Shared conversations omit settings and keys
- Basic in-memory rate limiting is applied to chat and uploads

This is a single-workspace deployment. Add authentication in front of `/app` and `/api` before exposing it on a public network.

## Troubleshooting

**Missing API key errors**
The selected model's provider has no env var. Add the key or pick a configured model.

**Model does not support image input**
Switch to a model whose catalog entry includes `vision`.

**Web search unavailable**
No search key is set. Add Tavily, Brave, or Serper.

**Speech input unavailable**
Use a Chromium-based browser and allow the microphone. No cloud STT key is required.

**Build fails on older Node**
Use Node 22+.

## Production

Deploy on any Node host that can write to `data/`. Set environment variables on the host. Do not commit `.env.local`. For multi-user production, put a real auth layer in front and move SQLite to a managed store if you need concurrent horizontal scale.
