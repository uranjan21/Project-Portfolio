"""Curated resume content, independent of what the website displays.

The website shows everything in the portfolio; the resume is a recruiter-facing
document with its own rules: degree-level education only, pronoun-free summary,
ordered keyword-dense skills, capped bullets, and awards split from
certifications. Both the PDF and DOCX renderers consume this one model so the
two downloads never drift apart.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from app.services.portfolio import get_portfolio

# ATS parsers are most reliable with plain ASCII; normalize typographic chars.
_ASCII_MAP = str.maketrans({
    "—": "-",
    "–": "-",
    "·": "|",
    "•": "-",
    "‘": "'",
    "’": "'",
    "“": '"',
    "”": '"',
    " ": " ",
})

# Resume-facing section order for skills; unknown categories go last.
_SKILL_ORDER = [
    "frontend",
    "backend",
    "databases",
    "cloud & devops",
    "ai & llm tooling",
    "data visualization",
    "styling",
    "design",
]

# Only degree-level education belongs on a professional resume.
_DEGREE_RE = re.compile(r"b\.?\s?tech|m\.?\s?tech|bachelor|master|mca|bca|ph\.?d|diploma", re.I)

_CERT_RE = re.compile(r"certif", re.I)


def ascii_clean(text: str) -> str:
    return (text or "").translate(_ASCII_MAP).strip()


@dataclass
class ResumeExperience:
    role: str
    company: str
    location: str
    period: str
    bullets: list[str]
    tech: list[str]


@dataclass
class ResumeProject:
    title: str
    tech: list[str]
    description: str


@dataclass
class ResumeEducation:
    degree: str
    institution: str
    period: str


@dataclass
class ResumeItem:
    title: str
    year: str
    description: str


@dataclass
class ResumeContent:
    name: str
    title: str
    contact_line: str
    links: list[str]
    summary: str
    keywords: str
    skills: list[tuple[str, str]] = field(default_factory=list)
    experiences: list[ResumeExperience] = field(default_factory=list)
    projects: list[ResumeProject] = field(default_factory=list)
    education: list[ResumeEducation] = field(default_factory=list)
    awards: list[ResumeItem] = field(default_factory=list)
    certifications: list[ResumeItem] = field(default_factory=list)


def _resume_summary(bio: str, name: str) -> str:
    """Turn the website's first-person bio into pronoun-free resume voice."""
    text = ascii_clean(bio)
    text = re.sub(rf"^I'?a?m {re.escape(name)}\s*-\s*", "", text)
    sentences = re.split(r"(?<=\.)\s+", text)
    out = []
    for s in sentences:
        s = re.sub(r"^I'?a?m\s+", "", s)
        s = re.sub(r"^I\s+", "", s)
        if s:
            out.append(s[0].upper() + s[1:])
    return " ".join(out)


def _skills(skills) -> list[tuple[str, str]]:
    # Group case-insensitively (DB has e.g. "Frontend" and "frontend"),
    # but display the original casing so acronyms like "AI & LLM" survive.
    by_cat: dict[str, tuple[str, list[str]]] = {}
    for s in skills:
        cat = s.category.strip()
        key = cat.lower()
        if key not in by_cat:
            by_cat[key] = (cat if cat != key else cat.title(), [])
        by_cat[key][1].append(s.name.replace(" / ", ", "))

    def order(key: str) -> int:
        return _SKILL_ORDER.index(key) if key in _SKILL_ORDER else len(_SKILL_ORDER)

    return [
        (display, ascii_clean(", ".join(names)))
        for key, (display, names) in sorted(by_cat.items(), key=lambda kv: order(kv[0]))
    ]


def build_resume_content() -> ResumeContent:
    data = get_portfolio()
    p = data.profile

    contact_bits = [b for b in [p.phone, p.email, p.location] if b]
    links = [l for l in [p.links.linkedin, p.links.github, p.links.website] if l]

    experiences = [
        ResumeExperience(
            role=ascii_clean(e.role),
            company=ascii_clean(e.company),
            location=ascii_clean(e.location),
            period=ascii_clean(e.period),
            bullets=[ascii_clean(h) for h in e.highlights[:6]],
            tech=[ascii_clean(t) for t in e.tech],
        )
        for e in data.experiences
    ]

    projects = [
        ResumeProject(
            title=ascii_clean(pr.title),
            tech=[ascii_clean(t) for t in pr.tech],
            description=ascii_clean(pr.description[:220]),
        )
        for pr in data.projects[:3]
    ]

    education = [
        ResumeEducation(
            degree=ascii_clean(ed.degree),
            institution=ascii_clean(ed.institution),
            period=ascii_clean(ed.period),
        )
        for ed in data.education
        if _DEGREE_RE.search(ed.degree)
    ]

    awards: list[ResumeItem] = []
    certifications: list[ResumeItem] = []
    for a in data.achievements:
        item = ResumeItem(
            title=ascii_clean(a.title),
            year=ascii_clean(a.year),
            description=ascii_clean(a.description),
        )
        (certifications if _CERT_RE.search(f"{a.title} {a.description}") else awards).append(item)

    return ResumeContent(
        name=ascii_clean(p.name),
        title=ascii_clean(p.title),
        contact_line=" | ".join(ascii_clean(b) for b in contact_bits),
        links=[ascii_clean(l) for l in links],
        summary=_resume_summary(p.bio, p.name),
        keywords=", ".join(p.keywords) if getattr(p, "keywords", None) else ascii_clean(p.title),
        skills=_skills(data.skills),
        experiences=experiences,
        projects=projects,
        education=education,
        awards=awards,
        certifications=certifications,
    )
