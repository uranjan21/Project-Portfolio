import type { Project, Skill } from '../types/portfolio';

export interface SkillEvidence {
  count: number;
  projects: Project[];
}

/** "Node.js" / "node js" / "NodeJS" all collapse to "nodejs". */
function norm(s: string): string {
  return s.toLowerCase().replace(/[.\s_-]+/g, '');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Tech entries are often compound ("Highcharts / Chart.js / Recharts"), so a
 * containment match is needed — but only on word boundaries of the raw strings,
 * otherwise "Java" would match "JavaScript". */
function matches(skillName: string, tech: string): boolean {
  if (norm(tech) === norm(skillName)) return true;
  const [short, long] =
    skillName.length <= tech.length ? [skillName, tech] : [tech, skillName];
  if (short.length < 3) return false;
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(short.toLowerCase())}($|[^a-z0-9])`, 'i').test(long);
}

/** Cross-references each skill against every project's tech list so the UI can
 * show proof ("Used in N projects") instead of self-rated levels. */
export function buildSkillEvidence(skills: Skill[], projects: Project[]): Map<string, SkillEvidence> {
  const evidence = new Map<string, SkillEvidence>();
  for (const skill of skills) {
    const used = projects.filter((p) => p.tech.some((t) => matches(skill.name, t)));
    evidence.set(skill.id, { count: used.length, projects: used });
  }
  return evidence;
}
