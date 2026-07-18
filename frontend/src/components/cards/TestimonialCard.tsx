import type { Testimonial } from '../../types/portfolio';
import { Icon } from '../ui/Icon';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const rating = Math.min(5, Math.max(1, testimonial.rating ?? 5));
  return (
    <div className="card testimonial-card">
      {/* The visible stars are decorative; the rating is announced once, as text. */}
      <div className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon key={n} name={n <= rating ? 'star' : 'star-outline'} size={16} />
        ))}
        <span className="score">{rating.toFixed(1)}</span>
      </div>
      <blockquote>“{testimonial.quote}”</blockquote>
      <div className="who">
        <div className="avatar-dot">{testimonial.author.trim().charAt(0).toUpperCase() || '?'}</div>
        <div>
          <div className="name">{testimonial.author}</div>
          <div className="role">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
