import { Pill } from '../components/ui/Pill';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ComingSoonPage() {
  const { data } = usePortfolio();
  usePageMeta('Coming soon');
  return (
    <section className="section" style={{ textAlign: 'center', padding: '6rem 1.4rem' }}>
      <span className="eyebrow" style={{ justifyContent: 'center' }}>
        Coming Soon
      </span>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0.8rem 0' }}>
        Something new is <span className="accent">in the works</span>
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '0 auto 1.8rem' }}>
        This page isn’t ready yet. Want to know the moment it ships? Drop me a line and I’ll keep
        you posted.
      </p>
      <div className="cta-row" style={{ justifyContent: 'center', marginTop: 0 }}>
        <Pill to="/contact" variant="amber">
          Notify me
        </Pill>
        {data && (
          <Pill href={`mailto:${data.profile.email}`} variant="outline">
            {data.profile.email}
          </Pill>
        )}
      </div>
    </section>
  );
}
