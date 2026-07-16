import { motion } from 'framer-motion';
import type { AudiencePitch, Profile } from '../../../shared/types';
import { RESUME_URL } from '../../api/client';
import { useTypewriter } from '../../hooks/useTypewriter';
import { GlitchText } from '../hud/GlitchText';

interface HeroProps {
  profile: Profile;
  audiences: AudiencePitch[];
  audience?: AudiencePitch;
  onSelectAudience: (id: string) => void;
  onEdit?: () => void;
}

export function Hero({ profile, audiences, audience, onSelectAudience, onEdit }: HeroProps) {
  const typedRole = useTypewriter(profile.title, 40, 700);
  const ctaIsResume = audience?.ctaHref === RESUME_URL;

  return (
    <section className="hero" id="top">
      <p className="kicker">// {profile.tagline}</p>
      <h1>
        <GlitchText text={profile.name} />
      </h1>
      <p className="role">
        {typedRole}
        <span className="cursor">▋</span>
      </p>

      {audiences.length > 0 && (
        <div className="audience-switcher" role="group" aria-label="Choose what you're here for">
          <span className="switch-label">YOU ARE… //</span>
          {audiences.map((a) => (
            <button
              key={a.id}
              className={`audience-btn${a.id === audience?.id ? ' active' : ''}`}
              onClick={() => onSelectAudience(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {audience ? (
        <motion.div
          key={audience.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="pitch-headline">{audience.headline}</h2>
          <p className="bio">{audience.pitch}</p>
          <div className="cta-row">
            <a
              className="btn primary"
              href={audience.ctaHref}
              {...(ctaIsResume ? { download: true } : audience.ctaHref.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {audience.ctaLabel}
            </a>
            {!ctaIsResume && (
              <a className="btn" href={RESUME_URL} download>
                ↓ Resume (PDF)
              </a>
            )}
            <a className="btn magenta" href="#projects">
              View missions
            </a>
            {onEdit && (
              <button className="edit-chip" onClick={onEdit}>
                Edit profile
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <p className="bio">{profile.bio}</p>
          <div className="cta-row">
            <a className="btn primary" href={RESUME_URL} download>
              ↓ Download resume
            </a>
            {onEdit && (
              <button className="edit-chip" onClick={onEdit}>
                Edit profile
              </button>
            )}
          </div>
        </>
      )}

      <div className="hero-stats">
        {profile.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <div className="value">{stat.value}</div>
            <div className="label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="scroll-hint">▼ SCROLL</div>
    </section>
  );
}
