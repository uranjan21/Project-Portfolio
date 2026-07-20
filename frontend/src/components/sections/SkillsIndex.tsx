import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Project, Skill } from '../../types/portfolio';
import { buildSkillEvidence } from '../../utils/skillEvidence';
import { Icon } from '../ui/Icon';
import { TechIcon } from '../ui/TechIcon';

/** Groups skills by category, preserving order of first appearance so
 * audience-relevance ranking (see focusSkills) still surfaces the most
 * relevant category first. */
function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const category = skill.category.trim() || 'Other';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(skill);
  }
  return [...groups.entries()];
}

function slug(category: string): string {
  return `skills-cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

/**
 * Editorial skills index: category names pinned as large serif typography on
 * the left, tools on the right, active category tracked by scroll. Each skill
 * expands to show the projects that prove it (from skillEvidence) — no
 * self-rated bars.
 *
 * The sticky rail must never sit inside Reveal/Stagger: a transformed ancestor
 * becomes its containing block and position:sticky stops working.
 */
export function SkillsIndex({ skills, projects }: { skills: Skill[]; projects: Project[] }) {
  const reduced = useReducedMotion();
  const groups = useMemo(() => groupByCategory(skills), [skills]);
  const evidence = useMemo(() => buildSkillEvidence(skills, projects), [skills, projects]);
  const [active, setActive] = useState<string>(groups[0]?.[0] ?? '');
  const [openSkillId, setOpenSkillId] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = bodyRef.current?.querySelectorAll<HTMLElement>('.skills-index-group');
    if (!sections || sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute('data-category') ?? '');
        }
      },
      { rootMargin: '-30% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <div className="skills-index">
      <div className="skills-index-rail">
        <ol className="skills-index-nav">
          {groups.map(([category], i) => (
            <li key={category}>
              <a
                className={`skills-index-link${active === category ? ' is-active' : ''}`}
                href={`#${slug(category)}`}
                aria-current={active === category ? 'true' : undefined}
                onClick={() => setActive(category)}
              >
                <span className="skills-index-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="skills-index-name">{category}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="skills-index-body" ref={bodyRef}>
        {groups.map(([category, items]) => (
          <section
            className="skills-index-group"
            id={slug(category)}
            data-category={category}
            key={category}
          >
            <h3 className="skills-index-group-title">{category}</h3>
            <ul className="skills-index-list">
              {[...items]
                .sort((a, b) => b.level - a.level)
                .map((skill) => {
                  const proof = evidence.get(skill.id);
                  const open = openSkillId === skill.id;
                  const panelId = `skill-evidence-${skill.id}`;
                  if (!proof || proof.count === 0) {
                    return (
                      <li className="skill-row" key={skill.id}>
                        <div className="skill-row-trigger">
                          <span className="skill-row-icon">
                            <TechIcon name={skill.name} size={18} />
                          </span>
                          <span className="skill-row-name">{skill.name}</span>
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li className="skill-row" key={skill.id}>
                      <button
                        className="skill-row-trigger"
                        onClick={() => setOpenSkillId(open ? null : skill.id)}
                        onMouseEnter={() => setOpenSkillId(skill.id)}
                        aria-expanded={open}
                        aria-controls={panelId}
                      >
                        <span className="skill-row-icon">
                          <TechIcon name={skill.name} size={18} />
                        </span>
                        <span className="skill-row-name">{skill.name}</span>
                        <span className="skill-row-count">
                          {proof.count} {proof.count === 1 ? 'project' : 'projects'}
                          <Icon name="arrow-right" size={13} />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={panelId}
                            className="skill-row-evidence"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="skill-row-evidence-inner">
                              {proof.projects.map((p) => (
                                <Link className="skill-evidence-link" to={`/projects/${p.id}`} key={p.id}>
                                  {p.title}
                                  <Icon name="arrow-up-right" size={13} />
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
