import { useParams } from 'react-router-dom';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ContactBand } from '../components/sections/ContactBand';
import { Icon } from '../components/ui/Icon';
import { PageHero } from '../components/ui/PageHero';
import { Pill } from '../components/ui/Pill';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { RichText } from '../components/ui/RichText';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';

// The delivery process is the same regardless of service — shown as the
// numbered cards from the reference layout.
const PROCESS_STEPS = [
  { title: 'Scope', text: 'We define the smallest version worth shipping — and cut everything that can wait.' },
  { title: 'Build', text: 'Typed end-to-end, deployed to real infrastructure from week one.' },
  { title: 'Demo', text: 'Working software every week — estimates stay honest because you see progress.' },
  { title: 'Launch', text: 'Monitoring, analytics and a rollback path — then we ship, and it stays shipped.' },
];

export function ServiceDetailsPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const service = data?.services.find((s) => s.id === id);
  usePageMeta(service && data ? `${service.title} — ${data.profile.name}` : 'Service', service?.summary);
  if (!data) return null;
  if (!service) return <NotFoundPage />;

  const others = data.services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <PageHero
        title="Services"
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
        onEdit={editFor('services')}
        marquee
      />

      <section className="section" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <Reveal>
            <div className="service-media">
              <span className="service-media-icon">
                <Icon name={service.icon} size={44} />
              </span>
              <h1>{service.title}</h1>
              <p>{service.summary}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <h2 className="detail-h">
              About <span className="accent">{service.title}</span>
            </h2>
            <div className="prose" style={{ maxWidth: 780 }}>
              <RichText text={service.description} />
            </div>
          </Reveal>

          <Reveal>
            <h2 className="detail-h" style={{ marginTop: '2.4rem' }}>
              What’s <span className="accent">included</span>
            </h2>
            <div className="check-chips">
              {service.deliverables.map((d, i) => (
                <span className="check-chip" key={i}>
                  <span className="check-dot">
                    <Icon name="check" size={12} />
                  </span> {d}
                </span>
              ))}
              {service.tech.map((t) => (
                <span className="check-chip soft" key={t}>
                  <span className="check-dot">
                    <Icon name="check" size={12} />
                  </span> {t}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="detail-h" style={{ marginTop: '2.4rem' }}>
              How it <span className="accent">works</span>
            </h2>
          </Reveal>
          <Stagger className="grid-2 process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="card process-card">
                  <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="cta-row" style={{ marginTop: '2.2rem' }}>
            <Pill to="/contact" variant="amber">
              Discuss this service
            </Pill>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow">More Services</span>
            <Stagger className="grid-3" >
              {others.map((s) => (
                <StaggerItem key={s.id}>
                  <ServiceCard service={s} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
      <ContactBand />
    </>
  );
}
