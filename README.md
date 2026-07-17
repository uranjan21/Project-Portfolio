# utsavranjan.info

Personal portfolio, blog, and professional presence. React 18 + TypeScript + Vite frontend, Python FastAPI backend, Supabase (hosted PostgreSQL) database. Warm professional design — cream canvas, forest-green bands, amber accents.

## Quick Start

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your Supabase credentials
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Features

- **Dynamic portfolio** — all content served from Supabase via FastAPI, editable through admin dialogs
- **Admin panel** — single-password login, inline editing of every section (profile, services, skills, projects, blog, FAQs, pricing, testimonials, ventures, education, achievements)
- **Blog system** — full CRUD with draft/publish workflow
- **Contact pipeline** — form submissions → admin inbox → mark read/replied → add follow-ups → convert to client
- **Client CRM** — track clients, link to projects, attach testimonials
- **Project management** — status tracking (received → in progress → completed), client linking, budget tracking
- **AI chat assistant** — FAQ match → OpenAI (grounded in portfolio content) → unanswered question storage + email notification
- **Resume PDF** — one-page PDF generated live from database content
- **Audience targeting** — hero content adapts to visitor type (recruiter / client / fellow engineer)
- **Email notifications** — SMTP alerts for new contacts and unanswered questions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Framer Motion, react-router |
| Backend | Python, FastAPI, Pydantic |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI API (optional) |
| PDF | ReportLab |
| Auth | JWT (python-jose) |

## API Docs

With the backend running, visit http://localhost:8000/docs for the interactive Swagger UI.
