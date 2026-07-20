import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Testimonial } from '../../types/portfolio';
import { Icon } from '../ui/Icon';

const ADVANCE_MS = 7000;

/** One large centered quote at a time, auto-advancing with dot navigation.
 * The grid-stack stage sizes to the tallest quote so nothing reflows. */
export function TestimonialSpotlight({ testimonials }: { testimonials: Testimonial[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = testimonials.length > 1;

  useEffect(() => {
    if (!many || paused || reduced) return;
    const tick = () => {
      if (document.visibilityState === 'visible') {
        setIndex((i) => (i + 1) % testimonials.length);
      }
    };
    const id = window.setInterval(tick, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [many, paused, reduced, testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[index % testimonials.length];
  const rating = Math.min(5, Math.max(1, current.rating ?? 5));

  return (
    <div
      className="testimonial-spotlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="testimonial-spotlight-mark" aria-hidden="true">
        “
      </span>
      <div className="testimonial-spotlight-stage">
        {/* Invisible copies of every quote keep the stage at max height */}
        {testimonials.map((t) => (
          <blockquote className="testimonial-spotlight-quote is-ghost" aria-hidden="true" key={t.id}>
            {t.quote}
          </blockquote>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            className="testimonial-spotlight-quote"
            key={current.id}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -12 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: 'easeOut' }}
          >
            {current.quote}
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="testimonial-spotlight-who">
        <div className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Icon key={n} name={n <= rating ? 'star' : 'star-outline'} size={16} />
          ))}
        </div>
        <div className="name">{current.author}</div>
        <div className="role">{current.role}</div>
      </div>
      {many && (
        <div className="testimonial-spotlight-dots" role="group" aria-label="Choose testimonial">
          {testimonials.map((t, i) => (
            <button
              className="spot-dot"
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1} — ${t.author}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
