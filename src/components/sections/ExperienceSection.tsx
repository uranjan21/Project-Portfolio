import type { Experience } from '../../../shared/types';
import { useReveal } from '../../hooks/useReveal';
import { SectionHeader } from '../hud/SectionHeader';

interface ExperienceSectionProps {
  experiences: Experience[];
  onEdit?: () => void;
}

export function ExperienceSection({ experiences, onEdit }: ExperienceSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section reveal" id="experience" ref={ref}>
      <SectionHeader index="02" title="Experience" onEdit={onEdit} />
      <div className="timeline">
        {experiences.map((exp) => (
          <div className="timeline-item" key={exp.id}>
            <div className="role-line">
              <h3>
                {exp.role} <span className="company">@ {exp.company}</span>
              </h3>
              <span className="period">{exp.period} · {exp.location}</span>
            </div>
            <ul>
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <div className="tags">
              {exp.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
