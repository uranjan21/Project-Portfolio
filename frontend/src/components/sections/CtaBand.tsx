import { usePortfolio } from '../../context/PortfolioContext';
import { Pill } from '../ui/Pill';
import { Reveal } from '../ui/Reveal';

/** Centered CTA with a tidy cluster of service/skill tags underneath. */
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
          <div className="cta-scatter has-photo">
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
                <span key={tag} className={i % 2 ? 'confetti amber' : 'confetti'}>
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
