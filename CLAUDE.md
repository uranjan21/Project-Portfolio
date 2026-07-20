# utsavranjan.info

Personal portfolio and professional presence for Utsav Ranjan. Warm professional theme (cream / forest-green / amber). Two-package monorepo: React 18 + TypeScript frontend (Vite) and Python FastAPI backend, with Supabase (hosted PostgreSQL) as the database.

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Only merged into via PRs from `dev` or hotfix branches. |
| `dev` | Integration branch. All feature work merges here first; QA happens here. |
| `feature/<short-name>` | New features. Branch off `dev`. |
| `fix/<short-name>` | Bug fixes. Branch off `dev`. |
| `hotfix/<short-name>` | Urgent production patches. Branch off `main`; merge back into both `main` and `dev`. |

**Workflow:** `feature/*` → PR → `dev` → PR → `main`. Never push directly to `main`.

## Commands

### Frontend (`cd frontend`)

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on :5173; proxies `/api` to FastAPI on :8001 |
| `npm run build` | Typechecks then builds to `dist/` |
| `npm run typecheck` | `tsc --noEmit` |

### Backend (`cd backend`)

| Command | What it does |
|---|---|
| `source venv/bin/activate` | Activate Python virtualenv |
| `uvicorn app.main:app --reload --port 8001` | FastAPI dev server on :8001 |
| `pip install -r requirements.txt` | Install Python dependencies |

There is no test suite yet. Verify changes with frontend `npm run build` + manual/curl checks against the API.

## Architecture

```
frontend/                  React 18 + Vite + TypeScript client
  public/favicon.svg       Brand favicon
  src/
    api/client.ts          API client — VITE_API_BASE_URL prefix, all endpoints
    types/portfolio.ts     All domain + API types (mirrors backend Pydantic schemas)
    context/               PortfolioContext (data fetch + admin token), AudienceContext, ThemeContext, AdminUIContext
    pages/                 One file per route: Home, Services, About, Projects, Blog, etc.
    components/            admin/, cards/, sections/, ui/, chat/, layout/
    hooks/                 usePageMeta, useFocusTrap, useMagnetic
    styles/global.css      Design system — CSS variables on :root, class-based
  index.html               SPA entry point
  vite.config.ts           Proxy /api → localhost:8001

backend/                   Python FastAPI + Supabase
  app/
    main.py                FastAPI app, CORS, rate limiting, mount routers
    config.py              pydantic-settings env vars
    database.py            Supabase client singleton
    dependencies.py        get_current_admin (JWT auth)
    routers/
      public.py            GET /api/portfolio, POST /api/chat, POST /api/contact
      auth.py              POST /api/admin/login
      admin.py             PUT /api/admin/portfolio (generic section update)
      questions.py         Admin questions CRUD
      messages.py          Admin messages + follow-ups + convert-to-client
      resume.py            GET /api/resume.pdf + /api/resume.docx (generated downloads)
      clients.py           Admin clients CRUD
      projects.py          Admin projects CRUD (with status/client)
      blogs.py             Admin blogs CRUD (with draft/publish)
    schemas/               Pydantic models matching frontend TypeScript types
    services/
      portfolio.py         Assembles PortfolioData from Supabase tables
      chat.py              FAQ match → OpenAI → unanswered pipeline
      auth.py              Password verify, JWT issue/decode
      notify.py            SMTP email notifications
      resume_content.py    Curated resume model (recruiter-facing, single source for both renderers)
      resume.py            PDF renderer (reportlab)
      resume_docx.py       DOCX renderer (python-docx)
    migrations/            SQL migration files
  requirements.txt
  .env.example
```

## Database

Supabase project: `utsavranjan-info` (ap-south-1)
Project ID: `djqlpkmvugxkdhfxwviv`

18 PostgreSQL tables: profile, stats, audiences, services, pricing_plans, skills, experiences, education, achievements, ventures, faqs, blog_posts, clients, projects, testimonials, contact_messages, contact_follow_ups, unanswered_questions.

## Key flows

- **Audience targeting**: `AudienceContext` resolves the visitor type — `?for=<id>` query param → localStorage → first configured audience — and a `WelcomeDialog` (in `Layout`) asks first-time visitors. The `audiences` table drives the hero switcher, headline/pitch/CTA, Why Me cards, plus per-audience `about_bio` and `focus_tags` (reorder projects/skills; migration 003).
- **Resume downloads**: `resume_content.py` holds a curated resume model separate from portfolio content; `resume.py` (PDF) and `resume_docx.py` (DOCX) both render from it so the two files never drift.
- **Content editing**: every `PortfolioData` section edits through the schema-driven `EditDialog`. The `PUT /api/admin/portfolio` endpoint with `{section, value}` body handles all generic updates.
- **Contact pipeline**: POST /api/contact → contact_messages table → admin messages inbox → mark read/replied → add follow-ups → convert to client.
- **Projects CRM**: projects linked to clients via client_id. Status: received → in_progress → completed → cancelled.
- **Chat**: POST /api/chat — FAQ token-match → OpenAI (if key set) → unanswered storage + email notify.
- **Auth**: single admin password (env `ADMIN_PASSWORD`) → JWT in `sessionStorage`. All admin routes require Bearer token.

## Conventions

- Types live in `frontend/src/types/portfolio.ts` (TypeScript) and `backend/app/schemas/portfolio.py` (Pydantic). Keep them in sync.
- No CSS-in-JS — one design system in `styles/global.css`, class-based; design tokens are CSS variables on `:root`.
- Server responses are JSON `{"error": "..."}` on failure.
- Env vars documented in `backend/.env.example`; never commit `.env`.
