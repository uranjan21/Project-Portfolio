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
  index.ts           Express app, routes, rate limit, static serving (prod only),
                     robots.txt + sitemap.xml, SEO injection into served HTML
  seo.ts             Renders <head> SEO block (meta, OG/Twitter, JSON-LD Person/
                     WebSite/FAQPage) from live db data; replaces the
                     `<!-- seo:start -->…<!-- seo:end -->` block in index.html
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
  components/sections/  Hero (audience switcher + pitch), WhyMe (value props +
                     testimonials), Experience, Projects, Skills, Records, Contact
  hooks/useAudience.ts  Visitor-type selection: ?for= param → localStorage → first
  components/admin/  schemas.ts (field specs per section) → EditDialog (generic
                     object/collection editor), LoginDialog, AdminBar, QuestionsInbox
  components/chat/   ChatWidget (floating console)
  hooks/             useReveal (scroll reveal), useTilt (card tilt), useTypewriter
  styles/global.css  The entire design system — all HUD styling lives here
```

## Key flows

- **Audience targeting**: `data.audiences` (AudiencePitch[]) drives the hero switcher,
  headline/pitch/CTA, and the Why Me value-prop cards. Selection persists in
  localStorage and is shareable via `/?for=<id>` (seed ids: recruiter, client,
  engineer). Adding an audience in admin automatically adds a switcher button.
- **SEO**: in production the server replaces the `seo:start/seo:end` comment block in
  `dist/index.html` with tags rendered from live content on every request — title,
  description, keywords, canonical (`SITE_URL` env or request host), Open Graph,
  Twitter card, and a JSON-LD `@graph` (Person + WebSite + FAQPage). The FAQ section
  therefore does double duty: chat-assistant knowledge AND Google rich results. Do not
  remove the marker comments from index.html; verify they survive `vite build`.

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
