import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RESUME_URL } from '../api/client';
import { BlogCard } from '../components/cards/BlogCard';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { CtaBand } from '../components/sections/CtaBand';
import { JourneyCards } from '../components/sections/JourneyCards';
import { PricingBand } from '../components/sections/PricingBand';
import { ToolsGrid } from '../components/sections/ToolsGrid';
import { Pill } from '../components/ui/Pill';
import { Reveal } from '../components/ui/Reveal';
import { SectionHead } from '../components/ui/SectionHead';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useAudience } from '../hooks/useAudience';
import { usePageMeta } from '../hooks/usePageMeta';

function SpinBadge() {
  return (
    <Link to="/contact" className="spin-badge" aria-label="Hire me — go to contact page">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id="badge-circle" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
        </defs>
        <text>
          {/* textLength = circle circumference (2π·34) so the text tiles evenly */}
          <textPath href="#badge-circle" textLength="213" lengthAdjust="spacingAndGlyphs">
            HIRE ME • HIRE ME • HIRE ME •{' '}
          </textPath>
        </text>
      </svg>
      <span className="middle-arrow">↗</span>
    </Link>
  );
}

export function HomePage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const { audience, select } = useAudience(data?.audiences ?? []);
  usePageMeta(
    data ? `${data.profile.name} — ${data.profile.title}` : 'Portfolio',
    data?.profile.seo.metaDescription,
  );
  if (!data) return null;

  const { profile } = data;
  const firstName = profile.name.split(' ')[0];
  const orbitChips = data.skills.slice(0, 4).map((s) => s.name.split(' /')[0]);
  const ctaIsResume = audience?.ctaHref === RESUME_URL;
  const latestPosts = [...data.blogPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="container hero">
        <div>
          <span className="hero-badge">Hello There! 👋</span>
          <h1>
            I’m <span className="accent">{profile.name}</span>,<br />
            {profile.title} based in {profile.location.split('·')[0].trim()}.
          </h1>

          {data.audiences.length > 0 && (
            <div className="audience-switcher" role="group" aria-label="Choose what you're here for">
              <span className="switch-label">You are…</span>
              {data.audiences.map((a) => (
                <button
                  key={a.id}
                  className={`audience-btn${a.id === audience?.id ? ' active' : ''}`}
                  onClick={() => select(a.id)}
                >
                  {a.label}
                </button>
              ))}
              {editFor('audiences') && (
                <button className="edit-chip" onClick={editFor('audiences')}>
                  ✎
                </button>
              )}
            </div>
          )}

          {audience ? (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="pitch-line">{audience.headline}</p>
              <p className="lede">{audience.pitch}</p>
              <div className="cta-row">
                {audience.ctaHref.startsWith('/') && !audience.ctaHref.startsWith('/api') ? (
                  <Pill to={audience.ctaHref} variant="amber">
                    {audience.ctaLabel}
                  </Pill>
                ) : (
                  <Pill href={audience.ctaHref} variant="amber" download={ctaIsResume} newTab={audience.ctaHref.startsWith('http')}>
                    {audience.ctaLabel}
                  </Pill>
                )}
                {!ctaIsResume && (
                  <Pill href={RESUME_URL} variant="outline" download>
                    Download CV
                  </Pill>
                )}
                {editFor('profile') && (
                  <button className="edit-chip" onClick={editFor('profile')}>
                    ✎ Edit profile
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <p className="lede">{profile.bio}</p>
              <div className="cta-row">
                <Pill href={RESUME_URL} variant="amber" download>
                  Download CV
                </Pill>
              </div>
            </>
          )}
        </div>

        <div className="hero-visual">
          <div className="blob">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} />
            ) : (
              <span className="monogram">
                {profile.name
                  .split(/\s+/)
                  .map((w) => w[0])
                  .join('')}
              </span>
            )}
          </div>
          <SpinBadge />
          {orbitChips.map((chip, i) => (
            <span
              key={chip}
              className={`orbit-chip${i % 2 ? ' light' : ''}`}
              style={{
                top: `${[68, 14, 82, 38][i]}%`,
                left: `${[4, 8, 56, 72][i]}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {data.services.map((s) => (
                <span key={s.id}>{s.title}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Services ---------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHead
              eyebrow="Services"
              title={
                <>
                  Services <span className="accent">I Provide</span>
                </>
              }
              action={
                <Pill to="/services" variant="dark" small>
                  View All Services
                </Pill>
              }
              onEdit={editFor('services')}
            />
            <div className="grid-3">
              {data.services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- About band ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="band about-band">
              <div className="hero-visual" style={{ minHeight: 300 }}>
                <div className="blob" style={{ width: 'min(260px, 90%)' }}>
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={profile.name} />
                  ) : (
                    <span className="monogram" style={{ fontSize: '4.5rem' }}>
                      {profile.name
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join('')}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="eyebrow">About Me</span>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '0.6rem 0 1rem' }}>
                  Who is <span className="accent">{profile.name}?</span>
                </h2>
                <p>{profile.bio}</p>
                <div className="stats-row">
                  {profile.stats.map((stat) => (
                    <div className="stat" key={stat.label}>
                      <div className="value">{stat.value}</div>
                      <div className="label">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="cta-row" style={{ marginTop: 0, alignItems: 'center' }}>
                  <Pill href={RESUME_URL} variant="amber" download>
                    Download CV
                  </Pill>
                  <span className="signature">{firstName}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Why Me (audience value props) ---------- */}
      {audience && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <SectionHead
                eyebrow="Why Me"
                title={
                  <>
                    What you get <span className="accent">that others don’t</span>
                  </>
                }
                onEdit={editFor('audiences')}
              />
              <div className="grid-2">
                {audience.valueProps.map((prop, i) => {
                  const sep = prop.indexOf(' — ');
                  const title = sep === -1 ? '' : prop.slice(0, sep);
                  const detail = sep === -1 ? prop : prop.slice(sep + 3);
                  return (
                    <div className="card value-card" key={`${audience.id}-${i}`}>
                      <div className="value-index">No. {String(i + 1).padStart(2, '0')}</div>
                      {title && <h4>{title}</h4>}
                      <p>{detail}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Tools ---------- */}
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

      {/* ---------- Latest projects ---------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <SectionHead
              eyebrow="My Portfolio"
              title={
                <>
                  My Latest <span className="accent">Projects</span>
                </>
              }
              action={
                <Pill to="/projects" variant="dark" small>
                  View All Projects
                </Pill>
              }
              onEdit={editFor('projects')}
            />
            <div className="grid-2">
              {data.projects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Journey ---------- */}
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
            <JourneyCards education={data.education} experiences={data.experiences} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Pricing (hidden until plans are published) ---------- */}
      <PricingBand pricing={data.pricing} />

      {/* ---------- Testimonials ---------- */}
      {(data.testimonials.length > 0 || editFor('testimonials')) && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <SectionHead
                eyebrow="Clients Testimonials"
                title={
                  <>
                    The Impact of My Work: <span className="accent">Client Testimonials</span>
                  </>
                }
                action={
                  data.testimonials.length > 3 ? (
                    <Pill to="/testimonials" variant="dark" small>
                      View All
                    </Pill>
                  ) : undefined
                }
                onEdit={editFor('testimonials')}
              />
              {data.testimonials.length === 0 ? (
                <div className="empty-note">
                  No testimonials yet — add real client quotes from the Edit button. Visitors won’t
                  see this section until you do.
                </div>
              ) : (
                <div className="grid-3">
                  {data.testimonials.slice(0, 3).map((t) => (
                    <TestimonialCard key={t.id} testimonial={t} />
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Blog ---------- */}
      {latestPosts.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <SectionHead
                eyebrow="News & Blogs"
                title={
                  <>
                    My Latest <span className="accent">Articles</span>
                  </>
                }
                action={
                  <Pill to="/blog" variant="dark" small>
                    View All Articles
                  </Pill>
                }
                onEdit={editFor('blogPosts')}
              />
              <div className="grid-3">
                {latestPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
