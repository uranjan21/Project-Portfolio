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
        <p className="sub">{project.description}</p>
        {editFor('projects') && (
          <button className="edit-chip" onClick={editFor('projects')} style={{ marginTop: '1rem' }}>
            ✎ Edit projects
          </button>
        )}
      </div>
      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container detail-layout">
          <div className="prose">
            {project.details ? (
              <RichText text={project.details} />
            ) : (
              <p>{project.description}</p>
            )}
          </div>
          <aside className="card facts-card">
            <h3>At a glance</h3>
            <div className="fact">
              <div className="fact-label">Type</div>
              {project.tag}
            </div>
            <div className="fact">
              <div className="fact-label">Built with</div>
              <div className="tag-chips" style={{ marginTop: '0.35rem' }}>
                {project.tech.map((t) => (
                  <span className="green" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {(project.liveUrl || project.repoUrl) && (
              <div className="fact">
                <div className="fact-label">Links</div>
                <div className="tag-chips" style={{ marginTop: '0.35rem' }}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <span>Live demo ↗</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      <span>Source ↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className="cta-row">
              <Pill to="/contact" variant="amber" small>
                Build something like this
              </Pill>
            </div>
          </aside>
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
