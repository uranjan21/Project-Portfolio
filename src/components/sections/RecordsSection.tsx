import type { Achievement, Education } from '../../../shared/types';
import { useReveal } from '../../hooks/useReveal';
import { SectionHeader } from '../hud/SectionHeader';

interface RecordsSectionProps {
  achievements: Achievement[];
  education: Education[];
  onEditAchievements?: () => void;
  onEditEducation?: () => void;
}

/** Achievements + education, side by side. */
export function RecordsSection({ achievements, education, onEditAchievements, onEditEducation }: RecordsSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section reveal" id="achievements" ref={ref}>
      <SectionHeader index="05" title="Records" />
      <div className="dual-grid">
        <div className="hud-card">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.85rem' }}>Achievements</h2>
            <span className="rule" />
            {onEditAchievements && (
              <button className="edit-chip" onClick={onEditAchievements}>Edit</button>
            )}
          </div>
          {achievements.map((a) => (
            <div className="list-block" key={a.id} style={{ marginBottom: '1.1rem' }}>
              <h4>{a.title}</h4>
              <div className="meta">{a.year}</div>
              <p>{a.description}</p>
            </div>
          ))}
        </div>
        <div className="hud-card">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.85rem' }}>Education</h2>
            <span className="rule" />
            {onEditEducation && (
              <button className="edit-chip" onClick={onEditEducation}>Edit</button>
            )}
          </div>
          {education.map((e) => (
            <div className="list-block" key={e.id} style={{ marginBottom: '1.1rem' }}>
              <h4>{e.degree}</h4>
              <div className="meta">{e.institution} · {e.period}</div>
              {e.detail && <p>{e.detail}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
