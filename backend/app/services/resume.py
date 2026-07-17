from __future__ import annotations

import io

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.services.portfolio import get_portfolio


def generate_resume_pdf() -> bytes:
    data = get_portfolio()
    p = data.profile
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )

    styles = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "Name", parent=styles["Title"], fontSize=18, spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        "Subtitle", parent=styles["Normal"], fontSize=10, textColor="#666666", spaceAfter=6
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Heading2"], fontSize=12, spaceBefore=10, spaceAfter=4,
        textColor="#35422d",
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"], fontSize=9, leading=12, alignment=TA_LEFT,
    )
    bullet_style = ParagraphStyle(
        "Bullet", parent=body_style, leftIndent=12, bulletIndent=0,
    )

    story: list = []

    story.append(Paragraph(p.name, name_style))
    story.append(
        Paragraph(f"{p.title} &nbsp;|&nbsp; {p.location} &nbsp;|&nbsp; {p.email}", subtitle_style)
    )

    links = []
    if p.links.github:
        links.append(p.links.github)
    if p.links.linkedin:
        links.append(p.links.linkedin)
    if links:
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(links), subtitle_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Summary", section_style))
    story.append(Paragraph(p.bio, body_style))

    if data.skills:
        story.append(Paragraph("Skills", section_style))
        by_cat: dict[str, list[str]] = {}
        for s in data.skills:
            by_cat.setdefault(s.category, []).append(s.name)
        for cat, names in by_cat.items():
            story.append(
                Paragraph(f"<b>{cat}:</b> {', '.join(names)}", body_style)
            )

    if data.experiences:
        story.append(Paragraph("Experience", section_style))
        for exp in data.experiences:
            story.append(
                Paragraph(
                    f"<b>{exp.role}</b> at {exp.company} &nbsp;|&nbsp; {exp.period} &nbsp;|&nbsp; {exp.location}",
                    body_style,
                )
            )
            for h in exp.highlights[:4]:
                story.append(Paragraph(f"• {h}", bullet_style))

    if data.projects:
        story.append(Paragraph("Projects", section_style))
        for proj in data.projects[:4]:
            tech = ", ".join(proj.tech)
            story.append(
                Paragraph(
                    f"<b>{proj.title}</b> [{proj.tag}] — {tech}",
                    body_style,
                )
            )
            story.append(Paragraph(proj.description[:200], bullet_style))

    if data.education:
        story.append(Paragraph("Education", section_style))
        for ed in data.education:
            detail = f" — {ed.detail}" if ed.detail else ""
            story.append(
                Paragraph(f"<b>{ed.degree}</b>, {ed.institution} ({ed.period}){detail}", body_style)
            )

    if data.achievements:
        story.append(Paragraph("Achievements", section_style))
        for ach in data.achievements:
            story.append(
                Paragraph(f"• <b>{ach.title}</b> ({ach.year}): {ach.description}", bullet_style)
            )

    doc.build(story)
    return buf.getvalue()
