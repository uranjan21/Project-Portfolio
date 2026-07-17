import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';

/** Closing call-to-action band used across pages. */
export function CtaBand() {
  const { data } = usePortfolio();
  if (!data) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="band center" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Contact
          </span>
          <h2 style={{ margin: '0.6rem auto 1rem', maxWidth: 560 }}>
            Let’s Talk for <span className="accent">Your Next Project</span>
          </h2>
          <p style={{ maxWidth: 520, margin: '0 auto 1.6rem' }}>
            Tell me what you’re building — you’ll get an honest reply, usually within a day. Or ask
            the assistant in the corner anything about me first.
          </p>
          <div className="cta-row" style={{ justifyContent: 'center', marginTop: 0 }}>
            <Pill to="/contact" variant="amber">
              Start the conversation
            </Pill>
            <Pill href={`mailto:${data.profile.email}`} variant="outline">
              {data.profile.email}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
