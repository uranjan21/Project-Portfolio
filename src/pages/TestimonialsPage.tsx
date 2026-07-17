import { TestimonialCard } from '../components/cards/TestimonialCard';
import { CtaBand } from '../components/sections/CtaBand';
import { PageHero } from '../components/ui/PageHero';
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
      <PageHero
        title="Testimonials"
        crumbs={[{ label: 'Testimonials' }]}
        sub="The impact of my work, in their words."
        onEdit={editFor('testimonials')}
      />
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
