import { Link } from 'react-router-dom';
import type { Project } from '../../types/portfolio';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card project-card">
      <Link to={`/projects/${project.id}`} className="project-cover">
        {project.coverUrl ? (
          <img src={project.coverUrl} alt={project.title} loading="lazy" decoding="async" />
        ) : (
          <span className="cover-title">{project.title}</span>
        )}
      </Link>
      <div className="project-body">
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
          View project <span className="tick">→</span>
        </Link>
      </div>
    </div>
  );
}
