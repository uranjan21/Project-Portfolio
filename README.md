# Utsav Ranjan — Portfolio

A marketing-first personal site for a software engineer & freelancer: React 18 + TypeScript + Vite + react-router on the front, Express + TypeScript on the back. Warm professional design — cream canvas, forest-green bands, amber accents.

## Pages

Home · Services (+ per-service details) · About · Projects (+ per-project details) · Blog (+ articles) · Testimonials · Contact (with form) · FAQs · 404 · Coming Soon

## Features

- **Audience-targeted pitch** — visitors pick who they are (hiring for a team / need
  something built / fellow engineer) and the hero headline, pitch, value props and
  primary CTA retarget instantly. Shareable deep links: `/?for=recruiter`,
  `/?for=client`, `/?for=engineer`.
- **Admin mode everywhere** — log in from the footer (*Admin access*, or
  `Ctrl/Cmd+Shift+A`) and every section grows an ✎ Edit chip. Content persists
  server-side and is instantly live for all visitors: profile, services, pricing,
  projects, blog posts, testimonials, skills, experience, education, FAQs.
- **Two admin inboxes** — visitor questions the chat assistant couldn't answer
  (answer once → optionally auto-added to FAQ) and contact-form messages, both with
  unread badges and optional email notifications.
- **Chat assistant** — answers as me, grounded in the site's own content: curated FAQ
  first (free), then OpenAI (optional), then "I've forwarded this to Utsav".
- **One-page PDF resume** — generated live from current content at `/api/resume.pdf`.
- **SEO engineered per route** — the server injects route-aware titles, descriptions,
  canonical URLs, Open Graph/Twitter cards and JSON-LD (Person + WebSite everywhere,
  FAQPage on /faqs, BlogPosting on articles), plus a dynamic `sitemap.xml` that
  includes every service, project and blog URL.
- **Honest by default** — pricing and testimonials stay hidden from visitors until you
  publish real plans and real quotes from admin mode.

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
| `SITE_URL` | recommended (prod) | Public URL for canonical links, OG tags, sitemap |
| `SESSION_SECRET` | recommended | Signs admin session tokens |
| `OPENAI_API_KEY` | no | Enables free-form AI answers in the chat assistant |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini` |
| `NOTIFY_EMAIL` + `SMTP_*` | no | Email notifications for questions & contact messages |
| `PORT` | no | API port, default `5177` |

Content lives in `data/db.json` (created on first boot from `server/seed.ts`) — edit it
through the admin UI, not by hand. Deleting the file resets to seed content.

## Admin workflow

1. Footer → **Admin access** → password.
2. ✎ Edit chips appear on every section of every page.
3. The floating admin bar (bottom-left) has **Questions** (chat) and **Messages**
   (contact form) inboxes with unread badges.
4. Publish real **pricing plans** and **testimonials** when ready — those sections stay
   hidden from visitors until they contain real content.
5. Blog posts: title, slug, date, tags, excerpt, and content with light markup
   (blank line = paragraph, `## ` heading, `- ` bullets).

## Ranking for your name on Google

The site ships the on-page half: your name in every title, per-route metadata,
Person/WebSite/FAQPage/BlogPosting structured data, canonical URLs, a dynamic sitemap
and indexable content pages. The off-page half is yours:

1. Deploy on a domain containing your name (e.g. `utsavranjan.dev`) and set `SITE_URL`.
2. Verify in [Google Search Console](https://search.google.com/search-console) and
   submit `sitemap.xml`.
3. Link the site from profiles Google already trusts — GitHub, LinkedIn, X,
   Stack Overflow — and add those URLs to your profile links so they appear in
   `sameAs` structured data.
4. Publish articles occasionally — each blog post is a new indexable page that can
   rank for its own queries and strengthens the whole domain.
