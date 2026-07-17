import { ProjectCard } from '../components/cards/ProjectCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ProjectsPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `Projects — ${data.profile.name}` : 'Projects');
  if (!data) return null;

  return (
    <>
      <div className="container page-hero">
        <span className="eyebrow">My Portfolio</span>
        <h1>
          Projects <span className="accent">that shipped</span>
        </h1>
        <p className="sub">
          A selection of things I’ve designed, built and launched — web apps, AI tools and
          dashboards.
        </p>
        {editFor('projects') && (
          <button className="edit-chip" onClick={editFor('projects')} style={{ marginTop: '1rem' }}>
            ✎ Edit projects
          </button>
        )}
      </div>
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="grid-2">
              {data.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
