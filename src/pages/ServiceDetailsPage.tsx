import { Link, useParams } from 'react-router-dom';
import { ServiceCard } from '../components/cards/ServiceCard';
import { CtaBand } from '../components/sections/CtaBand';
import { Pill } from '../components/ui/Pill';
import { RichText } from '../components/ui/RichText';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';

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
      <div className="container page-hero">
        <span className="breadcrumb">
          <Link to="/services">Services</Link> / {service.title}
        </span>
        <h1>
          {service.emoji} {service.title}
        </h1>
        <p className="sub">{service.summary}</p>
        {editFor('services') && (
          <button className="edit-chip" onClick={editFor('services')} style={{ marginTop: '1rem' }}>
            ✎ Edit services
          </button>
        )}
      </div>
      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container">
          <div className="prose">
            <RichText text={service.description} />
            <h2>What you get</h2>
            <ul className="check-list">
              {service.deliverables.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="tag-chips" style={{ margin: '1.2rem 0 1.8rem' }}>
              {service.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
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
            <div className="grid-3" style={{ marginTop: '1.2rem' }}>
              {others.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
