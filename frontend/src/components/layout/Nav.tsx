import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';
import { ThemeToggle } from '../ui/ThemeToggle';

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

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

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
        <div className="nav-end">
          <ThemeToggle />
          <Pill to="/contact" variant="dark" small>
            Contact Me
          </Pill>
          <button
            className="nav-burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="nav-mobile" key={location.pathname}>
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
