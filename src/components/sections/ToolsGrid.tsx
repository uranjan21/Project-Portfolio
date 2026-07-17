import type { Skill } from '../../../shared/types';
import { Stagger, StaggerItem } from '../ui/Reveal';

const CATEGORY_EMOJI: Record<string, string> = {
  frontend: '🎨',
  backend: '⚙️',
  data: '🗄️',
  infrastructure: '☁️',
};

/** Circular skill tiles with proficiency, revealed one by one. */
export function ToolsGrid({ skills }: { skills: Skill[] }) {
  return (
    <Stagger className="tools-grid">
      {skills.map((skill) => (
        <StaggerItem key={skill.id}>
          <div className="tool-tile">
            <div className="tool-emoji">{skill.emoji ?? CATEGORY_EMOJI[skill.category.toLowerCase()] ?? '🛠️'}</div>
            <div className="tool-level">{skill.level}%</div>
            <div className="tool-name">{skill.name}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
