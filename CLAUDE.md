# Project-Portfolio

Marketing-first portfolio site for Utsav Ranjan, in a warm professional theme (cream / forest-green / amber). Single npm package: React 18 + TypeScript client (Vite, react-router) and an Express + TypeScript API server.

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
  index.ts           Express app, routes, rate limits, robots.txt + sitemap.xml,
                     static serving with per-route SEO injection (prod only)
  seo.ts             Per-route <head> block (title/meta/OG/Twitter + JSON-LD Person/
                     WebSite everywhere, FAQPage on /faqs, BlogPosting on /blog/:slug)
                     rendered from live db data into index.html's
                     `<!-- seo:start -->…<!-- seo:end -->` markers; dynamic sitemap
  db.ts              JSON-file datastore (data/db.json, gitignored). Sections auto-
                     backfill from seed.ts when new ones are added.
  seed.ts            Initial content, written as marketing copy. Pricing and
                     testimonials seed EMPTY on purpose — never invent those.
  auth.ts            ADMIN_PASSWORD check (timing-safe) → 12h JWT; requireAdmin
  chat.ts            Answer pipeline: FAQ token-match → OpenAI (grounded, "UNKNOWN"
                     sentinel) → store in inbox + notify owner
  notify.ts          notifyOwner(subject, text) — SMTP email, no-op unless configured
  resume.ts          One-page PDF (pdfkit) rendered from live db data
src/
  App.tsx            Router: / /services(/:id) /about /projects(/:id) /blog(/:slug)
                     /testimonials /contact /faqs /coming-soon + 404
  components/layout/ Layout (shell + admin dialog layer + scroll restore), Nav, Footer
  context/PortfolioContext.tsx  Data fetch + admin token (sessionStorage) + saveSection
  context/AdminUIContext.tsx    editFor(section) → edit handler when admin; openLogin
  pages/             One file per route; pages compose cards + sections
  components/ui/     Pill (signature CTA), SectionHead, RichText (blank line =
                     paragraph, "## " heading, "- " bullets), and the motion kit:
                     Reveal/Stagger/StaggerItem (scroll reveals), CountUp (stats),
                     ScrollProgress (top bar). App is wrapped in MotionConfig
                     reducedMotion="user" — all animation respects OS settings.
  components/cards/  ServiceCard, ProjectCard, BlogCard, TestimonialCard
  components/sections/  Shared page sections: JourneyCards, ToolsGrid, PricingBand,
                     Marquee (amber ticker), CtaBand (scatter-confetti CTA), FaqBand
                     (dark home accordion), ContactForm + ContactBand (dark form
                     section embedded at page bottoms)
  components/ui/PageHero.tsx  Centered inner-page hero: title + Home/… breadcrumb +
                     optional marquee. List pages use it; detail pages (project/blog)
                     keep the left-aligned .page-hero style.
  components/admin/  schemas.ts (field specs per section) → EditDialog (generic
                     object/collection editor), LoginDialog, AdminBar,
                     QuestionsInbox (chat), MessagesInbox (contact form)
  components/chat/   ChatWidget (floating assistant)
  hooks/             useReveal, useAudience, usePageMeta (client-side title sync)
  styles/global.css  The entire design system — tokens at :root, class-based
```

## Key flows

- **Audience targeting**: `data.audiences` drives the hero switcher, headline/pitch/CTA
  and the Why Me cards on Home. Persists in localStorage; shareable via `/?for=<id>`
  (seed ids: recruiter, client, engineer).
- **SEO**: the server replaces the `seo:start/seo:end` block in `dist/index.html` per
  request, route-aware (`server/seo.ts`). Sitemap includes dynamic service/project/blog
  URLs. `SITE_URL` env sets canonical origin; falls back to request host. Do not remove
  the marker comments from index.html; verify they survive `vite build`.
- **Content editing**: every `PortfolioData` section edits through the same schema-driven
  `EditDialog`. To add a field: extend `shared/types.ts`, add a `FieldSpec` in
  `schemas.ts`, render it, and add to `server/resume.ts` if it belongs on the resume.
- **Empty-until-real sections**: pricing and testimonials render nothing to visitors
  while empty (admins see an edit prompt). Keep it that way — no fabricated rates or
  quotes.
- **Ventures ("Beyond the Code")**: `data.ventures` seeds the owner's upcoming
  journeys (creator / founder / SaaS) as coming-soon cards on Home. Flipping `live`
  + adding a `url` in admin turns a card into an outbound link — this is the
  extension point for future life chapters.
- **Chat**: `POST /api/chat` — FAQ match → OpenAI (only if `OPENAI_API_KEY`) →
  unanswered questions stored + emailed; answering from the admin inbox can promote to
  FAQ. FAQ also feeds Google rich results on /faqs.
- **Contact**: `POST /api/contact` (rate-limited) → `db.messages` + email notify →
  MessagesInbox in the admin bar. The footer newsletter signup reuses this endpoint
  (interest: "Newsletter"), so subscribers land in the same inbox.
- **Auth**: single admin password (env `ADMIN_PASSWORD`) → JWT in `sessionStorage`.
  All mutating routes go through `requireAdmin`.

## Conventions

- Types live in `shared/types.ts`; never duplicate them per side.
- No CSS-in-JS / modules — one design system in `styles/global.css`, class-based;
  design tokens are CSS variables on `:root`.
- Server responses are JSON `{ error: string }` on failure; client `api/client.ts`
  throws `Error(error)`.
- Keep the resume to one A4 page — `resume.ts` truncates rather than overflowing.
- Env vars documented in `.env.example`; never commit `.env` or `data/`.
