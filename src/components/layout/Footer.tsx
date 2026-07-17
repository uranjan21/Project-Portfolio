import { Link } from 'react-router-dom';
import { RESUME_URL } from '../../api/client';
import { useAdminUI } from '../../context/AdminUIContext';
import { usePortfolio } from '../../context/PortfolioContext';

export function Footer() {
  const { data, isAdmin, logout } = usePortfolio();
  const { openLogin } = useAdminUI();
  if (!data) return null;
  const { profile } = data;
  const firstName = profile.name.split(' ')[0];
  const links = Object.entries(profile.links).filter(([, url]) => url) as [string, string][];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo">
              {firstName}
              <em>.</em>
            </div>
            <p className="footer-tag">{profile.seo.metaDescription}</p>
          </div>
          <div className="footer-col">
            <h4>Pages</h4>
            <nav>
              <Link to="/services">Services</Link>
              <Link to="/about">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/testimonials">Testimonials</Link>
              <Link to="/faqs">FAQs</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <nav>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {links.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
              ))}
              <a href={RESUME_URL} download>
                Download resume (PDF)
              </a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}. Designed &amp; built by {profile.name}.
          </span>
          {isAdmin ? (
            <button className="admin-link" onClick={logout}>
              Log out of admin
            </button>
          ) : (
            <button className="admin-link" onClick={openLogin}>
              Admin access
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
