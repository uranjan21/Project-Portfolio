import { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import type { Education, Experience } from '../../types/portfolio';
import { useAdminUI } from '../../context/AdminUIContext';
import { Icon } from '../ui/Icon';

interface JourneyTimelineProps {
  education: Education[];
  experiences: Experience[];
  /** Show experience highlight bullets (About page) or keep it compact (Home). */
  detailed?: boolean;
}

interface JourneyEntry {
  id: string;
  kind: 'work' | 'education';
  /** Sortable start date, as months since year 0. */
  start: number;
  period: string;
  meta?: string;
  title: string;
  subtitle: string;
  note?: string;
  bullets: string[];
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Periods come from the CMS as free text — "Sep 2025 — Present" or "2016 — 2020".
 * Parse the start of the range so work and education can interleave chronologically.
 */
function startOf(period: string): number {
  const start = period.split(/[—–-]/)[0].trim();
  const year = Number(start.match(/\d{4}/)?.[0] ?? 0);
  const month = MONTHS.indexOf(start.slice(0, 3).toLowerCase());
  return year * 12 + (month < 0 ? 0 : month);
}

/**
 * Single chronological spine covering both work and education. Education entries
 * are short and experience entries are long, so side-by-side columns left one
 * side mostly empty — one merged column keeps the density even.
 */
export function JourneyTimeline({ education, experiences, detailed }: JourneyTimelineProps) {
  const { editFor } = useAdminUI();
  const editEducation = editFor('education');
  const editExperiences = editFor('experiences');
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const entries: JourneyEntry[] = [
    ...experiences.map((exp) => ({
      id: `exp-${exp.id}`,
      kind: 'work' as const,
      start: startOf(exp.period),
      period: exp.period,
      meta: exp.location,
      title: exp.company,
      subtitle: exp.role,
      bullets: exp.highlights,
    })),
    ...education.map((edu) => ({
      id: `edu-${edu.id}`,
      kind: 'education' as const,
      start: startOf(edu.period),
      period: edu.period,
      title: edu.institution,
      subtitle: edu.degree,
      note: edu.detail,
      bullets: [],
    })),
  ].sort((a, b) => b.start - a.start);

  return (
    <div className="timeline-wrap">
      {(editExperiences || editEducation) && (
        <div className="timeline-actions">
          {editExperiences && (
            <button className="edit-chip" onClick={editExperiences}>
              <Icon name="edit" size={14} /> Edit experience
            </button>
          )}
          {editEducation && (
            <button className="edit-chip" onClick={editEducation}>
              <Icon name="edit" size={14} /> Edit education
            </button>
          )}
        </div>
      )}
      <ol className="timeline" ref={listRef}>
        {/* Amber ink draws down the spine as the timeline scrolls into view */}
        {!reduced && (
          <motion.span className="timeline-ink" aria-hidden="true" style={{ scaleY: scrollYProgress }} />
        )}
        {entries.map((entry) => (
          <motion.li
            className="timeline-item"
            key={entry.id}
            initial={reduced ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <span className="timeline-dot" aria-hidden="true">
              <Icon name={entry.kind === 'work' ? 'briefcase' : 'graduation-cap'} size={15} />
            </span>
            <div className="timeline-body">
              <div className="period">
                {entry.period}
                {entry.meta ? ` · ${entry.meta}` : ''}
              </div>
              <h4>{entry.title}</h4>
              <div className="detail">{entry.subtitle}</div>
              {detailed && entry.note && <p className="detail timeline-note">{entry.note}</p>}
              {detailed && entry.bullets.length > 0 && (
                <ul>
                  {entry.bullets.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
