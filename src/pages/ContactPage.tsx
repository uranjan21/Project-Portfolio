import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api/client';
import { Pill } from '../components/ui/Pill';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

const BUDGET_OPTIONS = ['Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000+', 'Not sure yet'];

export function ContactPage() {
  const { data } = usePortfolio();
  usePageMeta(data ? `Contact — ${data.profile.name}` : 'Contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', budget: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  if (!data) return null;
  const { profile } = data;

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      await api.sendContact({
        name: form.name,
        email: form.email,
        message: form.message,
        phone: form.phone || undefined,
        interest: form.interest || undefined,
        budget: form.budget || undefined,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong — try again.');
    }
  };

  return (
    <>
      <div className="container page-hero">
        <span className="eyebrow">Contact Us</span>
        <h1>
          Let’s Talk for <span className="accent">Your Next Project</span>
        </h1>
        <p className="sub">
          Describe what you need in a paragraph — you’ll get an honest reply with questions and a
          realistic estimate, usually within a day.
        </p>
      </div>
      <section className="section" style={{ paddingTop: '2.6rem' }}>
        <div className="container contact-layout">
          <div className="contact-info">
            <div className="info-row">
              <span className="icon-circle">✉️</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            {profile.phone && (
              <div className="info-row">
                <span className="icon-circle">📞</span>
                <span>{profile.phone}</span>
              </div>
            )}
            <div className="info-row">
              <span className="icon-circle">📍</span>
              <span>{profile.location}</span>
            </div>
            {Object.entries(profile.links)
              .filter(([, url]) => url)
              .map(([name, url]) => (
                <div className="info-row" key={name}>
                  <span className="icon-circle">🔗</span>
                  <a href={url as string} target="_blank" rel="noreferrer">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </a>
                </div>
              ))}
            <p className="form-note" style={{ marginTop: '0.6rem' }}>
              Prefer async? The chat assistant in the corner can answer most questions about my
              experience, services and availability instantly.
            </p>
          </div>

          {status === 'sent' ? (
            <div className="form-success">
              Message received — thank you, {form.name.split(' ')[0]}! I’ll get back to you at{' '}
              {form.email} shortly.
            </div>
          ) : (
            <form className="form-grid" onSubmit={submit}>
              <div className="field">
                <label htmlFor="c-name">Your Name *</label>
                <input id="c-name" required maxLength={120} value={form.name} onChange={set('name')} placeholder="Ex. John Doe" />
              </div>
              <div className="field">
                <label htmlFor="c-email">Email *</label>
                <input id="c-email" required type="email" maxLength={200} value={form.email} onChange={set('email')} placeholder="example@gmail.com" />
              </div>
              <div className="field">
                <label htmlFor="c-phone">Phone</label>
                <input id="c-phone" maxLength={40} value={form.phone} onChange={set('phone')} placeholder="Optional" />
              </div>
              <div className="field">
                <label htmlFor="c-interest">I’m interested in</label>
                <select id="c-interest" value={form.interest} onChange={set('interest')}>
                  <option value="">Select…</option>
                  {data.services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Full-time role">Hiring full-time</option>
                  <option value="Other">Something else</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-budget">Budget range (USD)</label>
                <select id="c-budget" value={form.budget} onChange={set('budget')}>
                  <option value="">Select…</option>
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field full">
                <label htmlFor="c-message">Your Message *</label>
                <textarea id="c-message" required maxLength={4000} value={form.message} onChange={set('message')} placeholder="What are you building, and when do you need it?" />
              </div>
              {error && <div className="form-error full">{error}</div>}
              <div className="full">
                <Pill variant="amber" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </Pill>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
