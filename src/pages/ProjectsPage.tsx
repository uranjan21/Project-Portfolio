import { useState } from 'react';
import { ProjectCard } from '../components/cards/ProjectCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ProjectsPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const [tag, setTag] = useState<string | null>(null);
  usePageMeta(data ? `Projects — ${data.profile.name}` : 'Projects');
  if (!data) return null;

  const allTags = [...new Set(data.projects.map((p) => p.tag))].sort();
  const projects = data.projects.filter((p) => !tag || p.tag === tag);

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
          {allTags.length > 1 && (
            <div className="filter-chips">
              <button className={`filter-chip${tag === null ? ' active' : ''}`} onClick={() => setTag(null)}>
                All
              </button>
              {allTags.map((t) => (
                <button key={t} className={`filter-chip${tag === t ? ' active' : ''}`} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
          <Reveal>
            <div className="grid-2">
              {projects.map((project) => (
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
