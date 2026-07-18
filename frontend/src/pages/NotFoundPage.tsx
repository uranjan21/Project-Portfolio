import { Pill } from '../components/ui/Pill';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <section className="section" style={{ textAlign: 'center', padding: '6rem 1.4rem' }}>
      <img className="not-found-art" src="/images/caricature.png" alt="" decoding="async" />
      <div className="big-404">404</div>
      <h1 style={{ fontSize: '1.6rem', margin: '1rem 0 0.6rem' }}>This page wandered off.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto 1.8rem' }}>
        The link may be old, or the page may have moved. The good stuff is still here:
      </p>
      <div className="cta-row" style={{ justifyContent: 'center', marginTop: 0 }}>
        <Pill to="/" variant="amber">
          Back home
        </Pill>
        <Pill to="/projects" variant="outline">
          See my work
        </Pill>
      </div>
    </section>
  );
}
