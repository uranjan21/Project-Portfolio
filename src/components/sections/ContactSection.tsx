import type { Profile } from '../../../shared/types';
import { RESUME_URL } from '../../api/client';
import { useReveal } from '../../hooks/useReveal';
import { SectionHeader } from '../hud/SectionHeader';

export function ContactSection({ profile }: { profile: Profile }) {
  const ref = useReveal<HTMLElement>();
  const links = Object.entries(profile.links).filter(([, url]) => url) as [string, string][];

  return (
    <section className="section reveal" id="contact" ref={ref}>
      <SectionHeader index="06" title="Open Channel" />
      <div className="hud-card contact-panel">
        <h3 style={{ letterSpacing: '0.15em' }}>GET IN TOUCH</h3>
        <p>
          I'm currently open to new opportunities. Whether you have a question or just want to say
          hi, my inbox is always open — or ask the assistant in the corner anything about me.
        </p>
        <div className="cta-row" style={{ justifyContent: 'center' }}>
          <a className="btn primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="btn" href={RESUME_URL} download>
            ↓ Resume (PDF)
          </a>
          {links.map(([name, url]) => (
            <a className="btn" key={name} href={url} target="_blank" rel="noreferrer">
              {name.toUpperCase()} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
