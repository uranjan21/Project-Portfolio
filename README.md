# Utsav Ranjan — Portfolio

A cinematic, HUD-styled portfolio: React 18 + TypeScript + Vite on the front, Express + TypeScript on the back.

![stack](https://img.shields.io/badge/stack-React%20%2B%20TS%20%2B%20Express-38bdf8)

## Features

- **Cinematic HUD interface** — canvas starfield with scroll + mouse parallax, boot
  sequence, scanlines, glitch/typewriter text, corner-bracket cards with 3D tilt,
  scroll-reveal sections, live status bar.
- **Admin mode** — log in from the footer (`ADMIN ACCESS`, or `Ctrl/Cmd+Shift+A`) and
  every section grows an **Edit** chip. Edits happen in dialogs and persist server-side,
  instantly visible to all visitors.
- **One-page resume** — visitors download a PDF generated live from the current
  portfolio content (`/api/resume.pdf`).
- **Chat assistant** — answers questions about me, as me. Pipeline: curated FAQ →
  OpenAI (grounded strictly in portfolio content) → if it can't answer, the question is
  stored in my admin inbox and I'm notified by email. Answering it (optionally adding it
  to the FAQ) teaches the assistant for next time.

## Quickstart

```bash
npm install
cp .env.example .env        # set ADMIN_PASSWORD at minimum
npm run dev                 # client on http://localhost:5173, API on :5177
```

Production:

```bash
npm run build
npm start                   # serves app + API on http://localhost:5177
```

## Configuration (`.env`)

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | yes (prod) | Password for admin mode |
| `SESSION_SECRET` | recommended | Signs admin session tokens |
| `OPENAI_API_KEY` | no | Enables free-form AI answers in the chat assistant |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini` |
| `NOTIFY_EMAIL` + `SMTP_*` | no | Email notifications for unanswered questions |
| `PORT` | no | API port, default `5177` |

Content lives in `data/db.json` (created on first boot from `server/seed.ts`) — edit it
through the admin UI, not by hand. Deleting the file resets to seed content.

## Admin workflow

1. Footer → **ADMIN ACCESS** → password.
2. **Edit** chips appear on every section — profile, experience, projects, skills,
   education, achievements, and the FAQ (footer → **EDIT FAQ**).
3. **INBOX** (bottom-left bar) lists visitor questions the assistant couldn't answer.
   Write the answer, tick *Add to FAQ*, save — done.
