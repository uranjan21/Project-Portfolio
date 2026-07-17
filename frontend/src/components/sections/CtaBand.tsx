import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';
import { Reveal } from '../ui/Reveal';

// Deterministic pseudo-random scatter per index (rotation, drift delay).
const ROTATIONS = [-8, 5, -4, 9, -11, 3, 7, -6, 10, -3, 6, -9];

/** Centered CTA with scattered tag "confetti", per the reference design. */
export function CtaBand() {
  const { data } = usePortfolio();
  if (!data) return null;

  const tags = [
    ...data.services.map((s) => s.title),
    ...data.skills.slice(0, 6).map((s) => s.name.split(' /')[0]),
  ].slice(0, 12);

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="cta-scatter">
            <h2>
              Let’s Create an <span className="accent">Amazing Project</span> Together!
            </h2>
            <div className="cta-row" style={{ justifyContent: 'center', marginTop: '1.6rem' }}>
              <Pill to="/contact" variant="amber">
                Contact Us Now
              </Pill>
            </div>
            <div className="tag-confetti" aria-hidden="true">
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className={i % 2 ? 'confetti amber' : 'confetti'}
                  style={{
                    transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                    animationDelay: `${(i % 6) * 0.5}s`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
