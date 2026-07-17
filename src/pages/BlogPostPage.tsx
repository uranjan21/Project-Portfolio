import { Link, useParams } from 'react-router-dom';
import { BlogCard, formatDate } from '../components/cards/BlogCard';
import { CtaBand } from '../components/sections/CtaBand';
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

  const more = data.blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <div className="container page-hero">
        <span className="breadcrumb">
          <Link to="/blog">Blog</Link> / {post.title}
        </span>
        <h1>{post.title}</h1>
        <p className="sub" style={{ fontWeight: 600 }}>
          {formatDate(post.date)} · {post.tags.join(' · ')} · by {data.profile.name}
        </p>
        {editFor('blogPosts') && (
          <button className="edit-chip" onClick={editFor('blogPosts')} style={{ marginTop: '1rem' }}>
            ✎ Edit posts
          </button>
        )}
      </div>
      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container">
          <div className="prose">
            <RichText text={post.content} />
          </div>
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
