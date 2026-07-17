import { TestimonialCard } from '../components/cards/TestimonialCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function TestimonialsPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `Testimonials — ${data.profile.name}` : 'Testimonials');
  if (!data) return null;

  return (
    <>
      <div className="container page-hero">
        <span className="eyebrow">Clients Testimonials</span>
        <h1>
          The impact of my work, <span className="accent">in their words</span>
        </h1>
        {editFor('testimonials') && (
          <button className="edit-chip" onClick={editFor('testimonials')} style={{ marginTop: '1rem' }}>
            ✎ Edit testimonials
          </button>
        )}
      </div>
      <section className="section">
        <div className="container">
          <Reveal>
            {data.testimonials.length === 0 ? (
              <div className="empty-note">
                Client stories are on their way — meanwhile, the projects page shows the work
                itself.
              </div>
            ) : (
              <div className="grid-3">
                {data.testimonials.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
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
