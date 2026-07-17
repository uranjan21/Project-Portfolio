import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../shared/types';
import { formatDate, readingTime } from '../../utils/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="card blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-cover">
        {post.coverUrl ? <img src={post.coverUrl} alt="" /> : <span>{post.title}</span>}
        <span className="cover-chips">
          {post.tags[0] && <span className="cover-chip">{post.tags[0]}</span>}
          <span className="cover-chip date">{formatDate(post.date)}</span>
        </span>
      </Link>
      <div className="blog-body">
        <span className="blog-date">
          {formatDate(post.date)} · {readingTime(post.content)}
        </span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <Link className="more-link" to={`/blog/${post.slug}`}>
          Read article <span className="tick">→</span>
        </Link>
      </div>
    </div>
  );
}
