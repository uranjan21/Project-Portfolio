from __future__ import annotations

import re

import httpx

from app.config import settings
from app.database import get_supabase
from app.services.notify import notify_owner
from app.services.portfolio import get_portfolio

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "can",
    "could", "will", "would", "you", "your", "yours", "i", "me", "my", "we",
    "us", "our", "it", "of", "in", "on", "at", "to", "for", "and", "or",
    "what", "which", "who", "how", "when", "where", "why", "be", "have",
    "has", "had", "with", "about", "tell",
}


def _tokenize(text: str) -> set[str]:
    words = re.sub(r"[^a-z0-9\s]", " ", text.lower()).split()
    return {w for w in words if len(w) > 1 and w not in STOP_WORDS}


def _score_faq(query_tokens: set[str], question: str, answer: str) -> float:
    if not query_tokens:
        return 0.0
    faq_tokens = _tokenize(question + " " + answer)
    hits = sum(1 for t in query_tokens if t in faq_tokens)
    return hits / len(query_tokens)


def _match_faq(message: str) -> dict | None:
    db = get_supabase()
    faqs = db.table("faqs").select("*").execute().data
    query_tokens = _tokenize(message)
    best = None
    best_score = 0.0
    for faq in faqs:
        score = _score_faq(query_tokens, faq["question"], faq["answer"])
        if score > best_score:
            best = faq
            best_score = score
    return best if best and best_score >= 0.6 else None


def _build_context() -> str:
    data = get_portfolio()
    p = data.profile
    lines = [
        f"Name: {p.name}",
        f"Title: {p.title}",
        f"Location: {p.location}",
        f"Email: {p.email}",
        f"Bio: {p.bio}",
        "",
        "Value proposition by visitor type:",
    ]
    for a in data.audiences:
        lines.append(
            f"- For {a.label.lower()}: {a.headline} {a.pitch} "
            f"Key strengths: {' '.join(a.valueProps)}"
        )
    if data.testimonials:
        lines.append("\nTestimonials:")
        for t in data.testimonials:
            lines.append(f'- "{t.quote}" — {t.author}, {t.role}')
    lines.append(
        "\nSkills: "
        + "; ".join(f"{s.name} ({s.category}, {s.level}/100)" for s in data.skills)
    )
    lines.append("\nExperience:")
    for e in data.experiences:
        lines.append(
            f"- {e.role} at {e.company} ({e.period}, {e.location}). "
            f"{' '.join(e.highlights)} Tech: {', '.join(e.tech)}"
        )
    lines.append("\nServices offered:")
    for s in data.services:
        lines.append(f"- {s.title}: {s.summary} Deliverables: {', '.join(s.deliverables)}.")
    if data.pricing:
        lines.append("\nPricing:")
        for pp in data.pricing:
            lines.append(f"- {pp.name}: {pp.price} {pp.unit} ({', '.join(pp.features)})")
    else:
        lines.append("\nPricing: not published — invite the visitor to email for a quote.")
    lines.append("\nProjects:")
    for proj in data.projects:
        lines.append(f"- {proj.title} [{proj.tag}]: {proj.description} Tech: {', '.join(proj.tech)}")
    lines.append("\nBlog posts:")
    for b in data.blogPosts:
        lines.append(f'- "{b.title}" ({b.date}): {b.excerpt}')
    lines.append("\nBeyond client work (ventures):")
    for v in data.ventures:
        status = "live" if v.live else "coming soon"
        lines.append(f"- {v.title} ({status}): {v.tagline}. {v.description}")
    lines.append("\nEducation:")
    for ed in data.education:
        detail = f". {ed.detail}" if ed.detail else ""
        lines.append(f"- {ed.degree}, {ed.institution} ({ed.period}){detail}")
    lines.append("\nAchievements:")
    for a in data.achievements:
        lines.append(f"- {a.title} ({a.year}): {a.description}")
    lines.append("\nFAQ:")
    for f in data.faqs:
        lines.append(f"Q: {f.question}\nA: {f.answer}")
    return "\n".join(lines)


UNKNOWN_SENTINEL = "UNKNOWN"


async def _ask_ai(message: str) -> str | None:
    if not settings.openai_api_key:
        return None

    data = get_portfolio()
    system_prompt = (
        f"You are {data.profile.name}, speaking in first person on your own portfolio website. "
        f"Answer the visitor's question in a friendly, concise way (2-4 sentences) using ONLY the "
        f"portfolio content below. Never invent facts. If the answer is not clearly contained in "
        f'the content, reply with exactly "{UNKNOWN_SENTINEL}" and nothing else.\n\n'
        f"--- PORTFOLIO CONTENT ---\n{_build_context()}"
    )

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.openai_api_key}",
                },
                json={
                    "model": settings.openai_model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message},
                    ],
                    "max_tokens": 300,
                    "temperature": 0.4,
                },
                timeout=30.0,
            )
            if resp.status_code != 200:
                return None
            reply = resp.json()["choices"][0]["message"]["content"].strip()
            return None if reply == UNKNOWN_SENTINEL else reply
        except Exception:
            return None


async def answer_question(message: str) -> dict:
    faq = _match_faq(message)
    if faq:
        return {"reply": faq["answer"], "source": "faq"}

    ai_reply = await _ask_ai(message)
    if ai_reply:
        return {"reply": ai_reply, "source": "ai"}

    db = get_supabase()
    db.table("unanswered_questions").insert({"question": message}).execute()

    await notify_owner(
        "Portfolio assistant: unanswered visitor question",
        f'A visitor asked a question the assistant could not answer:\n\n"{message}"\n\n'
        "Answer it from the admin inbox on your portfolio to add it to the FAQ.",
    )

    data = get_portfolio()
    first_name = data.profile.name.split(" ")[0]
    return {
        "reply": (
            f"Good question — I don't have that answer on hand yet. I've forwarded it to "
            f"{first_name}, and once answered it will show up here. Meanwhile, feel free to "
            f"email {data.profile.email}."
        ),
        "source": "unanswered",
    }
