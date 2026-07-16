import PDFDocument from 'pdfkit';
import type { Response } from 'express';
import { getPortfolio } from './db';

const ACCENT = '#0e7490';
const INK = '#1e293b';
const MUTED = '#64748b';

// Streams a one-page A4 resume rendered from the live portfolio data.
export function streamResumePdf(res: Response): void {
  const data = getPortfolio();
  const { profile } = data;

  const doc = new PDFDocument({ size: 'A4', margin: 42 });
  const fileName = `${profile.name.replace(/\s+/g, '_')}_Resume.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  doc.pipe(res);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const sectionTitle = (title: string) => {
    doc.moveDown(0.7);
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(ACCENT).text(title.toUpperCase(), { characterSpacing: 1.5 });
    doc
      .moveTo(doc.page.margins.left, doc.y + 2)
      .lineTo(doc.page.margins.left + pageWidth, doc.y + 2)
      .lineWidth(0.7)
      .strokeColor(ACCENT)
      .stroke();
    doc.moveDown(0.4);
  };

  // --- Header ---
  doc.font('Helvetica-Bold').fontSize(24).fillColor(INK).text(profile.name);
  doc.font('Helvetica').fontSize(12).fillColor(ACCENT).text(profile.title);
  const contactLine = [profile.email, profile.location, profile.links.github, profile.links.linkedin]
    .filter(Boolean)
    .join('  |  ');
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(contactLine);

  // --- Summary ---
  sectionTitle('Summary');
  doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(profile.bio, { lineGap: 1.5 });

  // --- Experience ---
  if (data.experiences.length > 0) {
    sectionTitle('Experience');
    for (const exp of data.experiences) {
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(`${exp.role} — ${exp.company}`, { continued: true });
      doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(`  ${exp.period}`, { align: 'right' });
      for (const highlight of exp.highlights) {
        doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(`•  ${highlight}`, { indent: 8, lineGap: 1 });
      }
      if (exp.tech.length > 0) {
        doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(MUTED).text(exp.tech.join(' · '), { indent: 8 });
      }
      doc.moveDown(0.35);
    }
  }

  // --- Projects (top 3 keeps it to one page) ---
  if (data.projects.length > 0) {
    sectionTitle('Selected Projects');
    for (const project of data.projects.slice(0, 3)) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text(project.title, { continued: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(MUTED).text(`  ${project.tech.join(' · ')}`);
      doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(project.description, { lineGap: 1 });
      doc.moveDown(0.3);
    }
  }

  // --- Skills ---
  if (data.skills.length > 0) {
    sectionTitle('Skills');
    const byCategory = new Map<string, string[]>();
    for (const skill of data.skills) {
      const list = byCategory.get(skill.category) ?? [];
      list.push(skill.name);
      byCategory.set(skill.category, list);
    }
    for (const [category, names] of byCategory) {
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK).text(`${category}:  `, { continued: true });
      doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(names.join(', '));
    }
  }

  // --- Education ---
  if (data.education.length > 0) {
    sectionTitle('Education');
    for (const edu of data.education) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text(edu.degree, { continued: true });
      doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(`  ${edu.period}`, { align: 'right' });
      doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(edu.institution);
      doc.moveDown(0.25);
    }
  }

  // --- Achievements ---
  if (data.achievements.length > 0) {
    sectionTitle('Achievements');
    for (const achievement of data.achievements) {
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(INK)
        .text(`•  ${achievement.title} (${achievement.year})`, { indent: 8, lineGap: 1 });
    }
  }

  doc.end();
}
