import { useState } from 'react';
import { BlogCard } from '../components/cards/BlogCard';
import { CtaBand } from '../components/sections/CtaBand';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function BlogPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const [tag, setTag] = useState<string | null>(null);
  usePageMeta(data ? `Blog — ${data.profile.name}` : 'Blog');
  if (!data) return null;

  const allTags = [...new Set(data.blogPosts.flatMap((p) => p.tags))].sort();
  const posts = [...data.blogPosts]
    .filter((p) => !tag || p.tags.includes(tag))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        title="Blog"
        crumbs={[{ label: 'Blog' }]}
        sub="Notes on building software — process, freelancing and shipping, written from real projects."
        onEdit={editFor('blogPosts')}
      />
      <section className="section">
        <div className="container">
          {allTags.length > 1 && (
            <div className="filter-chips">
              <button className={`filter-chip${tag === null ? ' active' : ''}`}
                onClick={() => setTag(null)}
                aria-pressed={tag === null}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  className={`filter-chip${tag === t ? ' active' : ''}`}
                  onClick={() => setTag(t)}
                  aria-pressed={tag === t}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <Reveal>
            {posts.length === 0 ? (
              <div className="empty-note">No articles yet — the first one is being written.</div>
            ) : (
              <div className="grid-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
