import { ServiceCard } from '../components/cards/ServiceCard';
import { CtaBand } from '../components/sections/CtaBand';
import { PricingBand } from '../components/sections/PricingBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ServicesPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `Services — ${data.profile.name}` : 'Services');
  if (!data) return null;

  return (
    <>
      <div className="container page-hero">
        <span className="eyebrow">Services</span>
        <h1>
          What I can <span className="accent">do for you</span>
        </h1>
        <p className="sub">
          Every engagement starts from your goal, not my toolbox — these are the shapes it usually
          takes. Not sure which fits? Just describe the problem on the contact page.
        </p>
        {editFor('services') && (
          <button className="edit-chip" onClick={editFor('services')} style={{ marginTop: '1rem' }}>
            ✎ Edit services
          </button>
        )}
      </div>
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="grid-3">
              {data.services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <PricingBand pricing={data.pricing} />
      <CtaBand />
    </>
  );
}
