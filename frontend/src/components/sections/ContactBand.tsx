import { usePortfolio } from '../../context/PortfolioContext';
import { Reveal } from '../ui/Reveal';
import { ContactForm } from './ContactForm';

/** Dark contact section (info + full form) embedded at page bottoms, per the reference. */
export function ContactBand() {
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile } = data;

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="band contact-band">
            <div>
              <span className="eyebrow">Contact Us</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', margin: '0.6rem 0 1rem' }}>
                Let’s Talk for <span className="accent">Your Next Project</span>
              </h2>
              <p style={{ marginBottom: '1.4rem' }}>
                Describe what you need — you’ll get an honest reply with questions and a realistic
                estimate, usually within a day.
              </p>
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
              </div>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
