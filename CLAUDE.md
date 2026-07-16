# Project-Portfolio

Cinematic HUD-style portfolio for Utsav Ranjan. Single npm package containing a React 18 + TypeScript client (Vite) and an Express + TypeScript API server.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Client (Vite, :5173) + server (tsx watch, :5177) together; Vite proxies `/api` |
| `npm run build` | Typechecks both tsconfigs, then builds client to `dist/` |
| `npm start` | Production: server serves API + built `dist/` on :5177 |
| `npm run typecheck` | `tsc --noEmit` for client (`tsconfig.json`) and server (`tsconfig.server.json`) |

There is no test suite yet. Verify changes with `npm run build` plus manual/curl checks against the API.

## Architecture

```
shared/types.ts      All domain + API types. Client and server both import from here —
                     change data shapes HERE first.
server/
  index.ts           Express app, routes, rate limit, static serving (prod only)
  db.ts              JSON-file datastore (data/db.json, gitignored). In-memory object,
                     synchronous atomic writes. Seeded from seed.ts on first boot.
  seed.ts            Initial portfolio content
  auth.ts            ADMIN_PASSWORD check (timing-safe) → 12h JWT; requireAdmin middleware
  chat.ts            Answer pipeline: FAQ token-match → OpenAI (grounded, "UNKNOWN"
                     sentinel) → store in inbox + notify owner
  notify.ts          Optional SMTP email to owner (no-op unless configured)
  resume.ts          One-page PDF (pdfkit) rendered from live db data
src/
  App.tsx            Composition root; admin state gates edit affordances
  context/PortfolioContext.tsx  Data fetch + admin token (sessionStorage) + saveSection
  api/client.ts      Typed fetch wrappers for all endpoints
  components/hud/    Atmosphere: Starfield (canvas parallax), BootScreen, StatusBar,
                     GlitchText, SectionHeader
  components/sections/  Hero, Experience, Projects, Skills, Records, Contact
  components/admin/  schemas.ts (field specs per section) → EditDialog (generic
                     object/collection editor), LoginDialog, AdminBar, QuestionsInbox
  components/chat/   ChatWidget (floating console)
  hooks/             useReveal (scroll reveal), useTilt (card tilt), useTypewriter
  styles/global.css  The entire design system — all HUD styling lives here
```

## Key flows

- **Content editing**: every section of `PortfolioData` is edited through the same
  `EditDialog`, driven by `src/components/admin/schemas.ts`. To add a field: extend the
  type in `shared/types.ts`, add a `FieldSpec` to the schema, render it in the section
  component, add it to `server/resume.ts` if it belongs on the resume.
- **Chat**: `POST /api/chat` — FAQ match is free/instant; OpenAI is only called when the
  FAQ misses and `OPENAI_API_KEY` is set; unanswerable questions are stored
  (`db.questions`) and optionally emailed. Answering one from the admin inbox with
  "add to FAQ" makes the assistant handle it thereafter.
- **Auth**: single admin password (env `ADMIN_PASSWORD`) → JWT in `sessionStorage`.
  All mutating routes go through `requireAdmin`.

## Conventions

- Types live in `shared/types.ts`; never duplicate them per side.
- No CSS-in-JS / modules — one designed system in `styles/global.css`, class-based.
- Server responses are JSON `{ error: string }` on failure; client `api/client.ts`
  throws `Error(error)`.
- Keep the resume to one A4 page — `resume.ts` truncates (e.g. top 3 projects) rather
  than overflowing.
- Env vars documented in `.env.example`; never commit `.env` or `data/`.
