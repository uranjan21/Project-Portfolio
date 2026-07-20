-- Add Ledgr and AIOS Web projects, plus new skills from both builds.

-- ── Projects ────────────────────────────────────────────────────────────────

INSERT INTO projects (
  title, tag, description, details, tech,
  live_url, repo_url, cover_url,
  status, is_public, sort_order
) VALUES
(
  'Ledgr',
  'SaaS · FinTech',
  'Practice management SaaS for Indian CA firms — built solo. Handles clients, compliance deadlines (GST/TDS/ITR/ROC), tasks, documents, WhatsApp comms, and billing for firms managing 50–500+ clients.',
  E'## What it is\n\nLedgr is a full-stack SaaS platform I''m building solo for Indian CA (Chartered Accountant) firms. The core problem: CA firms manage hundreds of clients across a maze of Indian compliance deadlines, and most still run on spreadsheets and WhatsApp.\n\n## Modules\n\n- **Dashboard** — firm-wide overview, deadline heatmap, overdue alerts\n- **Clients** — full profiles, grouping, notes, document history\n- **Compliance** — deadline engine covering GST / TDS / ITR / ROC with auto-scheduling\n- **Tasks** — assignment, priority, due-date tracking per client and compliance item\n- **Documents** — upload, tag, version, link to clients or tasks\n- **WhatsApp** — WhatsApp Cloud API integration for client reminders and comms\n- **Billing** — invoice generation, payment tracking, aging reports\n- **Admin** — RBAC (Owner / Maintainer / Staff), user management, audit trails\n\n## AI Agents (in development)\n\nSix agents scaffolded on Claude Haiku / Sonnet:\n\n1. **Daily Brief** — morning summary of deadlines, overdue tasks, priority items\n2. **Document Extraction** — structured data from uploaded PDFs and images\n3. **DB Copilot** — natural-language queries over the firm''s own data\n4. **Backlog Planner** — prioritise tasks based on deadlines and workload\n5. **Message Drafter** — draft WhatsApp / email messages to clients in context\n6. **Multi-Doc Analysis** — cross-document reconciliation and anomaly detection\n\n## Architecture\n\n- **Backend**: FastAPI + SQLModel, bcrypt auth, JWT sessions, tenant-isolated row-level security, audit trail hooks\n- **Frontend**: React + TypeScript + Vite\n- **Database**: SQLite (dev) → PostgreSQL (prod), race-condition-safe locking on compliance writes\n- **AI**: Anthropic Claude (Haiku for fast ops, Sonnet for analysis), rate-limited per tenant\n- **Integrations**: WhatsApp Cloud API, custom Indian compliance deadline engine',
  ARRAY[
    'FastAPI', 'SQLModel', 'React', 'TypeScript', 'Vite',
    'SQLite', 'PostgreSQL', 'Anthropic Claude',
    'WhatsApp Cloud API', 'JWT Auth', 'RBAC', 'Multi-tenant'
  ],
  NULL,
  NULL,
  NULL,
  'in_progress',
  true,
  3
),
(
  'AIOS Web',
  'SaaS · AI Platform',
  'Multi-tenant SaaS AI OS — Finance, Health, Business Portfolio, Content CMS, and Career modules on one platform. Features multi-LLM chat (Claude / OpenAI / NVIDIA NIM), background agents, and modular Stripe billing.',
  E'## What it is\n\nAIOS Web is a multi-tenant SaaS that turns a personal AI OS concept into a shareable platform. Each user gets isolated access to AI-powered life-management modules.\n\n## Modules\n\n- **Finance** — budgeting, expense tracking, net-worth snapshots\n- **Health** — workout logging, meal planning, habit tracking\n- **Business Portfolio** — project tracking, client pipeline, revenue overview\n- **Content CMS** — draft and schedule content across channels\n- **Career** — goal tracking, learning plans, interview prep\n\n## Platform features\n\n- **Global command capture** (⌘L) — NLP routing sends any prompt to the right module automatically\n- **Multi-LLM chat** — switch between Claude, OpenAI GPT, and NVIDIA NIM per session\n- **Background scheduled agents** — cron-driven agents that run summaries and alerts without user prompting\n- **Modular billing** — Stripe integration with per-module subscriptions; unlock only what you need\n- **Auth** — JWT sessions + Google OAuth, full tenant isolation\n\n## Status\n\n46 commits, 3+ weeks of active development. Local build — no live deployment yet.\n\n## Stack\n\n- **Backend**: FastAPI + SQLModel, JWT + Google OAuth\n- **Frontend**: React + TypeScript + Vite\n- **AI**: Anthropic Claude, OpenAI, NVIDIA NIM — orchestrated with per-tenant rate limits\n- **Billing**: Stripe (pay-per-module subscriptions)',
  ARRAY[
    'FastAPI', 'SQLModel', 'React', 'TypeScript', 'Vite',
    'Anthropic Claude', 'OpenAI', 'NVIDIA NIM',
    'Stripe', 'Google OAuth', 'JWT Auth', 'Multi-tenant', 'PostgreSQL'
  ],
  NULL,
  NULL,
  NULL,
  'in_progress',
  true,
  4
);

-- ── Skills ───────────────────────────────────────────────────────────────────
-- Uses existing category names from the skills table.
-- "Auth & Security" and "Integrations" are new categories — consistent with
-- how "Cloud & DevOps" and "AI & LLM Tooling" are already named.

INSERT INTO skills (name, category, level, sort_order) VALUES
  -- Existing categories
  ('SQLite',                               'Databases',       80, 20),
  ('SQLModel',                             'Backend',         85, 21),
  ('Vite',                                 'Frontend',        90, 22),
  ('Row-level Locking / Safe Concurrency', 'Backend',         80, 23),
  ('Multi-LLM Orchestration',              'AI & LLM Tooling', 85, 24),
  ('Rate-limited AI Usage Caps',           'AI & LLM Tooling', 80, 25),
  -- New categories
  ('JWT Auth',                             'Auth & Security', 88, 26),
  ('Google OAuth',                         'Auth & Security', 82, 27),
  ('RBAC Design',                          'Auth & Security', 85, 28),
  ('Multi-tenant Architecture',            'Auth & Security', 85, 29),
  ('Stripe Integration',                   'Integrations',    82, 30),
  ('WhatsApp Cloud API',                   'Integrations',    80, 31);
