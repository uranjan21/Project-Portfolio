import { Link } from 'react-router-dom';
import type { Service } from '../../types/portfolio';
import { Icon } from '../ui/Icon';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card service-card">
      <div className="icon-circle">
        <Icon name={service.icon} size={24} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <Link className="more-link" to={`/services/${service.id}`}>
        Learn more
        <span className="tick">
          <Icon name="arrow-right" size={15} />
        </span>
      </Link>
    </div>
  );
}
