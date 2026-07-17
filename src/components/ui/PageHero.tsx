import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Marquee } from '../sections/Marquee';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  title: ReactNode;
  /** Breadcrumb trail after the implicit "Home". */
  crumbs?: Crumb[];
  sub?: ReactNode;
  /** Admin edit chip handler. */
  onEdit?: () => void;
  /** Show the amber services ticker under the hero (reference style). */
  marquee?: boolean;
}

/** Centered inner-page hero: title, "Home / …" breadcrumb, optional marquee. */
export function PageHero({ title, crumbs = [], sub, onEdit, marquee }: PageHeroProps) {
  return (
    <>
      <div className="page-hero-band">
        <h1>{title}</h1>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((crumb, i) => (
            <span key={i}>
              {' / '}
              {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span className="here">{crumb.label}</span>}
            </span>
          ))}
        </nav>
        {sub && <p className="sub">{sub}</p>}
        {onEdit && (
          <button className="edit-chip" onClick={onEdit} style={{ marginTop: '1rem' }}>
            ✎ Edit
          </button>
        )}
      </div>
      {marquee && <Marquee />}
    </>
  );
}
