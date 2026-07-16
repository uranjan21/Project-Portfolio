import type { CSSProperties } from 'react';
import type { Skill } from '../../../shared/types';
import { useReveal } from '../../hooks/useReveal';
import { SectionHeader } from '../hud/SectionHeader';

interface SkillsSectionProps {
  skills: Skill[];
  onEdit?: () => void;
}

export function SkillsSection({ skills, onEdit }: SkillsSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section reveal" id="skills" ref={ref}>
      <SectionHeader index="03" title="Skill Matrix" onEdit={onEdit} />
      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill-row" key={skill.id}>
            <div className="skill-label">
              <span>{skill.name}</span>
              <span className="cat">{skill.category} · {skill.level}%</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ '--level': skill.level / 100 } as CSSProperties} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
