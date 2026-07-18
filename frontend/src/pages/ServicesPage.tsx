import { ServiceCard } from '../components/cards/ServiceCard';
import { ContactBand } from '../components/sections/ContactBand';
import { CtaBand } from '../components/sections/CtaBand';
import { PricingBand } from '../components/sections/PricingBand';
import { PageHero } from '../components/ui/PageHero';
import { Stagger, StaggerItem } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { focusServices, useAudience } from '../context/AudienceContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ServicesPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const { audience } = useAudience();
  usePageMeta(data ? `Services — ${data.profile.name}` : 'Services');
  if (!data) return null;

  return (
    <>
      <PageHero title="Services" crumbs={[{ label: 'Services' }]} onEdit={editFor('services')} marquee />
      <section className="section">
        <div className="container">
          <div className="center" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              Services
            </span>
            <h2 style={{ marginTop: '0.5rem' }}>
              Services <span className="accent">I Provide</span>
            </h2>
          </div>
          <Stagger className="grid-3">
            {focusServices(data.services, audience).map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <PricingBand pricing={data.pricing} />
      <CtaBand />
      <ContactBand />
    </>
  );
}
