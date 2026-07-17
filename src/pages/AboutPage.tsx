import { RESUME_URL } from '../api/client';
import { CtaBand } from '../components/sections/CtaBand';
import { JourneyCards } from '../components/sections/JourneyCards';
import { ToolsGrid } from '../components/sections/ToolsGrid';
import { CountUp } from '../components/ui/CountUp';
import { PageHero } from '../components/ui/PageHero';
import { Pill } from '../components/ui/Pill';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { SectionHead } from '../components/ui/SectionHead';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `About — ${data.profile.name}` : 'About');
  if (!data) return null;
  const { profile } = data;

  return (
    <>
      <PageHero
        title={
          <>
            Who is <span className="accent">{profile.name}?</span>
          </>
        }
        crumbs={[{ label: 'About' }]}
        sub={profile.tagline}
        onEdit={editFor('profile')}
      />

      <section className="section" style={{ paddingTop: '2.4rem' }}>
        <div className="container">
          <div className="prose">
            <p>{profile.bio}</p>
          </div>
          <div className="stats-row light">
            {profile.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="value">
                  <CountUp value={stat.value} />
                </div>
                <div className="label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: '0.4rem' }}>
            <Pill href={RESUME_URL} variant="amber" download>
              Download my one-page CV
            </Pill>
            <Pill to="/contact" variant="outline">
              Get in touch
            </Pill>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="center">
              <SectionHead
                eyebrow="Education & Work"
                title={
                  <>
                    My <span className="accent">Academic and Professional</span> Journey
                  </>
                }
              />
            </div>
            <JourneyCards education={data.education} experiences={data.experiences} detailed />
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="center">
              <SectionHead
                eyebrow="My Favorite Tools"
                title={
                  <>
                    Exploring the Tools <span className="accent">Behind My Work</span>
                  </>
                }
                onEdit={editFor('skills')}
              />
            </div>
            <ToolsGrid skills={data.skills} />
          </Reveal>
        </div>
      </section>

      {(data.achievements.length > 0 || editFor('achievements')) && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <SectionHead
                eyebrow="Records"
                title={
                  <>
                    Achievements <span className="accent">&amp; Recognition</span>
                  </>
                }
                onEdit={editFor('achievements')}
              />
            </Reveal>
            <Stagger className="grid-3">
              {data.achievements.map((a) => (
                <StaggerItem key={a.id}>
                  <div className="card">
                    <div className="value-index" style={{ color: 'var(--amber-deep)', fontWeight: 700 }}>
                      {a.year}
                    </div>
                    <h4 style={{ margin: '0.3rem 0 0.4rem' }}>{a.title}</h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{a.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
