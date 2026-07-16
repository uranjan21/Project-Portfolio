import type { Project } from '../../../shared/types';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import { SectionHeader } from '../hud/SectionHeader';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tilt = useTilt(5);

  return (
    <div className="hud-card project-card" {...tilt}>
      <div className="tag-line">
        <span className="ptag">{project.tag}</span>
        <span className="pid">M-{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.tech.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {(project.liveUrl || project.repoUrl) && (
        <div className="links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              LIVE ↗
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              SOURCE ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
  onEdit?: () => void;
}

export function ProjectsSection({ projects, onEdit }: ProjectsSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="section reveal" id="projects" ref={ref}>
      <SectionHeader index="02" title="Missions // Projects" onEdit={onEdit} />
      <div className="projects-grid">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
