import { Link, useParams } from 'react-router-dom';
import { ProjectCard } from '../components/cards/ProjectCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Pill } from '../components/ui/Pill';
import { RichText } from '../components/ui/RichText';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const project = data?.projects.find((p) => p.id === id);
  usePageMeta(project && data ? `${project.title} — ${data.profile.name}` : 'Project', project?.description);
  if (!data) return null;
  if (!project) return <NotFoundPage />;

  const others = data.projects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      <div className="container page-hero">
        <span className="breadcrumb">
          <Link to="/projects">Projects</Link> / {project.title}
        </span>
        <h1>{project.title}</h1>
        <div className="tag-chips" style={{ marginTop: '1rem' }}>
          <span>{project.tag}</span>
          {project.tech.map((t) => (
            <span className="green" key={t}>
              {t}
            </span>
          ))}
        </div>
        {editFor('projects') && (
          <button className="edit-chip" onClick={editFor('projects')} style={{ marginTop: '1rem' }}>
            ✎ Edit projects
          </button>
        )}
      </div>
      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container">
          <div className="prose">
            <p>{project.description}</p>
            {project.details && <RichText text={project.details} />}
            <div className="cta-row">
              {project.liveUrl && (
                <Pill href={project.liveUrl} variant="amber" newTab>
                  View live
                </Pill>
              )}
              {project.repoUrl && (
                <Pill href={project.repoUrl} variant="outline" newTab>
                  Source code ↗
                </Pill>
              )}
              <Pill to="/contact" variant={project.liveUrl ? 'outline' : 'amber'}>
                Build something like this
              </Pill>
            </div>
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow">More Projects</span>
            <div className="grid-2" style={{ marginTop: '1.2rem' }}>
              {others.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
