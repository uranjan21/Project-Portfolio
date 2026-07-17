import type { Testimonial } from '../../types/portfolio';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const rating = Math.min(5, Math.max(1, testimonial.rating ?? 5));
  return (
    <div className="card testimonial-card">
      <div className="stars">
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
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
