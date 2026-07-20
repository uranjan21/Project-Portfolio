import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Project } from '../../types/portfolio';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';

function FeatureRow({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <Reveal>
      <div className={`project-feature${index % 2 === 1 ? ' is-flipped' : ''}`} ref={rowRef}>
        <Link to={`/projects/${project.id}`} className="project-feature-media" aria-label={project.title}>
          {project.coverUrl ? (
            <motion.img
              src={project.coverUrl}
              alt={`Cover image for ${project.title}`}
              loading="lazy"
              decoding="async"
              style={{ y }}
            />
          ) : (
            <span className="cover-title">{project.title}</span>
          )}
        </Link>
        <div className="project-feature-body">
          <span className="project-feature-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="tag-chips">
            <span>{project.tag}</span>
            {project.tech.slice(0, 3).map((t) => (
              <span className="green" key={t}>
                {t}
              </span>
            ))}
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <Link className="more-link" to={`/projects/${project.id}`}>
            View project
            <span className="tick">
              <Icon name="arrow-right" size={15} />
            </span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/** Large alternating editorial rows for the homepage's featured projects —
 * parallax cover, ghost index numeral, full-width presence. ProjectCard stays
 * for the denser grid on /projects. */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="project-showcase">
      {projects.map((project, i) => (
        <FeatureRow project={project} index={i} key={project.id} />
      ))}
    </div>
  );
}
