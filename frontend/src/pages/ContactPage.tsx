import { ContactForm } from '../components/sections/ContactForm';
import { PageHero } from '../components/ui/PageHero';
import { Reveal } from '../components/ui/Reveal';
import { SocialIcon } from '../components/ui/SocialIcon';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function ContactPage() {
  const { data } = usePortfolio();
  usePageMeta(data ? `Contact — ${data.profile.name}` : 'Contact');
  if (!data) return null;
  const { profile } = data;

  return (
    <>
      <PageHero
        title="Contact Me"
        crumbs={[{ label: 'Contact' }]}
        sub="Describe what you need in a paragraph — you’ll get an honest reply with questions and a realistic estimate, usually within a day."
      />
      <section className="section" style={{ paddingTop: '2.6rem' }}>
        <div className="container">
          <Reveal>
            <div className="band contact-band">
              <div>
                <span className="eyebrow">Contact Us</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', margin: '0.6rem 0 1rem' }}>
                  Let’s Talk for <span className="accent">Your Next Project</span>
                </h2>
                <div className="contact-info">
                  <div className="info-row">
                    <span className="icon-circle"><SocialIcon name="mail" size={20} /></span>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </div>
                  {profile.phone && (
                    <div className="info-row">
                      <span className="icon-circle"><SocialIcon name="phone" size={20} /></span>
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="icon-circle"><SocialIcon name="location" size={20} /></span>
                    <span>{profile.location}</span>
                  </div>
                  {Object.entries(profile.links)
                    .filter(([, url]) => url)
                    .map(([name, url]) => (
                      <div className="info-row" key={name}>
                        <span className="icon-circle"><SocialIcon name={name} size={20} /></span>
                        <a href={url as string} target="_blank" rel="noreferrer">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </a>
                      </div>
                    ))}
                </div>
                <p className="form-note" style={{ marginTop: '1rem' }}>
                  Prefer async? The chat assistant in the corner answers most questions about my
                  experience, services and availability instantly.
                </p>
              </div>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
