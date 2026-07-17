import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';

const NAV_ITEMS = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/projects', 'Projects'],
  ['/blog', 'Blog'],
  ['/testimonials', 'Testimonials'],
  ['/faqs', 'FAQs'],
] as const;

export function Nav() {
  const { data } = usePortfolio();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const firstName = data?.profile.name.split(' ')[0] ?? 'Portfolio';

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          {firstName}
          <em>.</em>
        </NavLink>
        <ul className="nav-links">
          {NAV_ITEMS.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Pill to="/contact" variant="dark" small>
          Contact Me
        </Pill>
        <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <nav className="nav-mobile" key={location.pathname}>
          {NAV_ITEMS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact Me
          </NavLink>
        </nav>
      )}
    </header>
  );
}
