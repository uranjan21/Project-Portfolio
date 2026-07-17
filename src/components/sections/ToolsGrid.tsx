import type { Skill } from '../../../shared/types';

const CATEGORY_EMOJI: Record<string, string> = {
  frontend: '🎨',
  backend: '⚙️',
  data: '🗄️',
  infrastructure: '☁️',
};

/** Circular skill tiles with proficiency, in the reference's "tools" style. */
export function ToolsGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="tools-grid">
      {skills.map((skill) => (
        <div className="tool-tile" key={skill.id}>
          <div className="tool-emoji">{skill.emoji ?? CATEGORY_EMOJI[skill.category.toLowerCase()] ?? '🛠️'}</div>
          <div className="tool-level">{skill.level}%</div>
          <div className="tool-name">{skill.name}</div>
        </div>
      ))}
    </div>
  );
}
