import { BlogCard } from '../components/cards/BlogCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function BlogPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `Blog — ${data.profile.name}` : 'Blog');
  if (!data) return null;

  const posts = [...data.blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="container page-hero">
        <span className="eyebrow">News & Blogs</span>
        <h1>
          Notes on <span className="accent">building software</span>
        </h1>
        <p className="sub">Process, freelancing and shipping — written from real projects.</p>
        {editFor('blogPosts') && (
          <button className="edit-chip" onClick={editFor('blogPosts')} style={{ marginTop: '1rem' }}>
            ✎ Edit posts
          </button>
        )}
      </div>
      <section className="section">
        <div className="container">
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
