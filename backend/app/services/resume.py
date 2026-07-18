from __future__ import annotations

import io
from xml.sax.saxutils import escape

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

from app.services.resume_content import ResumeItem, build_resume_content


def generate_resume_pdf() -> bytes:
    c = build_resume_content()
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=13 * mm,
        title=f"{c.name} - Resume",
        author=c.name,
        subject=c.title,
        keywords=c.keywords,
    )

    styles = getSampleStyleSheet()
    name_style = ParagraphStyle(
        "Name", parent=styles["Title"], fontName="Helvetica-Bold",
        fontSize=17, leading=20, spaceAfter=1, alignment=TA_LEFT,
    )
    contact_style = ParagraphStyle(
        "Contact", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9, leading=12, textColor="#333333", spaceAfter=1,
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Heading2"], fontName="Helvetica-Bold",
        fontSize=11, leading=13, spaceBefore=8, spaceAfter=2,
        textColor="#1a1a1a",
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9.5, leading=12.5, alignment=TA_LEFT, spaceAfter=1,
    )
    bullet_style = ParagraphStyle(
        "Bullet", parent=body_style, leftIndent=10, bulletIndent=0,
    )
    tech_style = ParagraphStyle(
        "Tech", parent=body_style, leftIndent=10, textColor="#333333", spaceAfter=4,
    )

    story: list = []

    def section(title: str):
        story.append(Paragraph(title, section_style))
        story.append(HRFlowable(width="100%", thickness=0.7, color="#1a1a1a", spaceAfter=3))

    def items(title: str, entries: list[ResumeItem]):
        if not entries:
            return
        section(title)
        for it in entries:
            story.append(
                Paragraph(
                    f"- <b>{escape(it.title)}</b> ({escape(it.year)}): {escape(it.description)}",
                    bullet_style,
                )
            )

    # ---- Header: plain-text contact block (no tables, no images) ----
    story.append(Paragraph(escape(c.name), name_style))
    story.append(Paragraph(escape(c.title), contact_style))
    story.append(Paragraph(escape(c.contact_line), contact_style))
    if c.links:
        story.append(Paragraph(" | ".join(escape(l) for l in c.links), contact_style))
    story.append(Spacer(1, 2))

    section("PROFESSIONAL SUMMARY")
    story.append(Paragraph(escape(c.summary), body_style))

    if c.skills:
        section("TECHNICAL SKILLS")
        for cat, names in c.skills:
            story.append(Paragraph(f"<b>{escape(cat)}:</b> {escape(names)}", body_style))

    if c.experiences:
        section("PROFESSIONAL EXPERIENCE")
        for exp in c.experiences:
            story.append(
                Paragraph(
                    f"<b>{escape(exp.role)}</b>, {escape(exp.company)} | {escape(exp.location)} | {escape(exp.period)}",
                    body_style,
                )
            )
            for h in exp.bullets:
                story.append(Paragraph(f"- {escape(h)}", bullet_style))
            if exp.tech:
                story.append(
                    Paragraph(f"<b>Technologies:</b> {escape(', '.join(exp.tech))}", tech_style)
                )

    if c.projects:
        section("PROJECTS")
        for proj in c.projects:
            story.append(
                Paragraph(
                    f"<b>{escape(proj.title)}</b> | {escape(', '.join(proj.tech))}",
                    body_style,
                )
            )
            story.append(Paragraph(f"- {escape(proj.description)}", bullet_style))

    if c.education:
        section("EDUCATION")
        for ed in c.education:
            story.append(
                Paragraph(
                    f"<b>{escape(ed.degree)}</b>, {escape(ed.institution)} | {escape(ed.period)}",
                    body_style,
                )
            )

    items("ACHIEVEMENTS &amp; AWARDS", c.awards)
    items("CERTIFICATIONS", c.certifications)

    doc.build(story)
    return buf.getvalue()
