import type { Profile } from '../../../shared/types';
import { RESUME_URL } from '../../api/client';
import { useTypewriter } from '../../hooks/useTypewriter';
import { GlitchText } from '../hud/GlitchText';

interface HeroProps {
  profile: Profile;
  onEdit?: () => void;
}

export function Hero({ profile, onEdit }: HeroProps) {
  const typedRole = useTypewriter(profile.title, 40, 700);

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
      <p className="bio">{profile.bio}</p>
      <div className="cta-row">
        <a className="btn primary" href={RESUME_URL} download>
          ↓ Download resume
        </a>
        <a className="btn" href="#projects">
          View missions
        </a>
        <a className="btn magenta" href={`mailto:${profile.email}`}>
          Open channel
        </a>
        {onEdit && (
          <button className="edit-chip" onClick={onEdit}>
            Edit profile
          </button>
        )}
      </div>
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
