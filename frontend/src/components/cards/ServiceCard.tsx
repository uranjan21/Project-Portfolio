import { Link } from 'react-router-dom';
import type { Service } from '../../types/portfolio';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card service-card">
      <div className="icon-circle">{service.emoji}</div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <Link className="more-link" to={`/services/${service.id}`}>
        Learn more <span className="tick">→</span>
      </Link>
    </div>
  );
}
