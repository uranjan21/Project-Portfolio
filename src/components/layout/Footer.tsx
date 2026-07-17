import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, RESUME_URL } from '../../lib/api';
import { useAdminUI } from '../../context/AdminUIContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';

const SOCIAL_ICONS: Record<string, string> = {
  github: '🐙',
  linkedin: '💼',
  twitter: '𝕏',
  website: '🌐',
};

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === 'sending') return;
    setStatus('sending');
    try {
      // Newsletter signups land in the same admin messages inbox.
      await api.sendContact({
        name: 'Newsletter signup',
        email,
        interest: 'Newsletter',
        message: 'Please add me to the update list.',
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return <p className="newsletter-done">You’re on the list — talk soon. ✓</p>;
  }
  return (
    <form className="newsletter" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address for updates"
      />
      <button type="submit" disabled={status === 'sending'} aria-label="Subscribe">
        {status === 'sending' ? '…' : '➤'}
      </button>
      {status === 'error' && <span className="form-error">Try again in a minute.</span>}
    </form>
  );
}

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
        <div className="footer-connect">
          <h2>
            Let’s <span className="accent">Connect</span> there
          </h2>
          <Pill to="/contact" variant="amber" small>
            Contact Me
          </Pill>
        </div>
        <div className="footer-grid">
          <div>
            <div className="logo">
              {firstName}
              <em>.</em>
            </div>
            <p className="footer-tag">{profile.seo.metaDescription}</p>
            <div className="social-row">
              {links.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} title={name}>
                  {SOCIAL_ICONS[name] ?? '🔗'}
                </a>
              ))}
              <a href={`mailto:${profile.email}`} aria-label="Email" title="Email">
                ✉️
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <nav>
              <Link to="/services">Services</Link>
              <Link to="/about">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/testimonials">Testimonials</Link>
              <Link to="/faqs">FAQs</Link>
            </nav>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <nav>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {profile.phone && <span>{profile.phone}</span>}
              <span>{profile.location}</span>
              <a href={RESUME_URL} download>
                Download resume (PDF)
              </a>
            </nav>
          </div>
          <div className="footer-col">
            <h4>Get the latest information</h4>
            <Newsletter />
            <p className="footer-tag" style={{ fontSize: '0.78rem', marginTop: '0.7rem' }}>
              New projects, articles and launches — no spam.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            Copyright © {new Date().getFullYear()} <em style={{ color: 'var(--amber)', fontStyle: 'normal' }}>{profile.name}</em>. All rights reserved.
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
