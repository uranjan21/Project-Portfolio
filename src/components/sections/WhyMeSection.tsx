import { motion } from 'framer-motion';
import type { AudiencePitch, Testimonial } from '../../../shared/types';
import { useReveal } from '../../hooks/useReveal';
import { SectionHeader } from '../hud/SectionHeader';

interface WhyMeSectionProps {
  audience?: AudiencePitch;
  testimonials: Testimonial[];
  onEditAudiences?: () => void;
  onEditTestimonials?: () => void;
}

/** Splits "Title — detail" value props so the title renders emphasised. */
function splitProp(prop: string): { title: string; detail: string } {
  const sep = prop.indexOf(' — ');
  if (sep === -1) return { title: '', detail: prop };
  return { title: prop.slice(0, sep), detail: prop.slice(sep + 3) };
}

export function WhyMeSection({ audience, testimonials, onEditAudiences, onEditTestimonials }: WhyMeSectionProps) {
  const ref = useReveal<HTMLElement>();
  if (!audience) return null;

  return (
    <section className="section reveal" id="why-me" ref={ref}>
      <SectionHeader index="01" title="Why Me" onEdit={onEditAudiences} />
      <motion.div
        key={audience.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="why-grid">
          {audience.valueProps.map((prop, i) => {
            const { title, detail } = splitProp(prop);
            return (
              <div className="hud-card value-card" key={i}>
                <div className="value-index">ADV-{String(i + 1).padStart(2, '0')}</div>
                {title && <h4>{title}</h4>}
                <p>{detail}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {(testimonials.length > 0 || onEditTestimonials) && (
        <div className="testimonials">
          {testimonials.map((t) => (
            <blockquote className="hud-card testimonial" key={t.id}>
              <p>“{t.quote}”</p>
              <footer>
                — {t.author}, <span>{t.role}</span>
              </footer>
            </blockquote>
          ))}
          {onEditTestimonials && (
            <button className="edit-chip" onClick={onEditTestimonials}>
              {testimonials.length > 0 ? 'Edit testimonials' : '+ Add testimonials'}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
