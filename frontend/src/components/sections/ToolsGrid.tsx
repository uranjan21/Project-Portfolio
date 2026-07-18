import type { Skill } from '../../types/portfolio';
import { TechIcon } from '../ui/TechIcon';
import { Stagger, StaggerItem } from '../ui/Reveal';

/** Uniform skill tiles with a relevant icon and name, revealed one by one. */
export function ToolsGrid({ skills }: { skills: Skill[] }) {
  return (
    <Stagger className="tools-grid">
      {skills.map((skill) => (
        <StaggerItem key={skill.id}>
          <div className="tool-tile">
            <span className="tool-icon">
              <TechIcon name={skill.name} />
            </span>
            <div className="tool-name">{skill.name}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
