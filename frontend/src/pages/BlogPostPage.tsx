import { Link, useParams } from 'react-router-dom';
import { BlogCard, formatDate, readingTime } from '../components/cards/BlogCard';
import { CtaBand } from '../components/sections/CtaBand';
import { PageHero } from '../components/ui/PageHero';
import { RichText } from '../components/ui/RichText';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';

export function BlogPostPage() {
  const { slug } = useParams();
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const post = data?.blogPosts.find((p) => p.slug === slug);
  usePageMeta(post && data ? `${post.title} — ${data.profile.name}` : 'Article', post?.excerpt);
  if (!data) return null;
  if (!post) return <NotFoundPage />;

  const sorted = [...data.blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const index = sorted.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? sorted[index - 1] : undefined;
  const older = index < sorted.length - 1 ? sorted[index + 1] : undefined;
  const more = sorted.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <PageHero
        title={post.title}
        crumbs={[{ label: 'Blog', to: '/blog' }, { label: post.title }]}
        sub={`${formatDate(post.date)} · ${readingTime(post.content)} · by ${data.profile.name}`}
        onEdit={editFor('blogPosts')}
      />
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="tag-chips" style={{ justifyContent: 'center' }}>
          {post.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container">
          <div className="prose">
            <RichText text={post.content} />
          </div>
          {(newer || older) && (
            <nav className="post-nav" aria-label="More articles">
              {older ? (
                <Link to={`/blog/${older.slug}`}>
                  <div className="nav-label">← Older</div>
                  <div className="nav-title">{older.title}</div>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link to={`/blog/${newer.slug}`} className="next">
                  <div className="nav-label">Newer →</div>
                  <div className="nav-title">{newer.title}</div>
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
      {more.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow">More Articles</span>
            <div className="grid-3" style={{ marginTop: '1.2rem' }}>
              {more.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
