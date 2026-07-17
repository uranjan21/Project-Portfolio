import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RESUME_URL } from '../api/client';
import { BlogCard } from '../components/cards/BlogCard';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { TestimonialCard } from '../components/cards/TestimonialCard';
import { CtaBand } from '../components/sections/CtaBand';
import { FaqBand } from '../components/sections/FaqBand';
import { JourneyCards } from '../components/sections/JourneyCards';
import { Marquee } from '../components/sections/Marquee';
import { PricingBand } from '../components/sections/PricingBand';
import { ToolsGrid } from '../components/sections/ToolsGrid';
import { CountUp } from '../components/ui/CountUp';
import { Pill } from '../components/ui/Pill';
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { SectionHead } from '../components/ui/SectionHead';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useAudience } from '../hooks/useAudience';
import { usePageMeta } from '../hooks/usePageMeta';

const HERO_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const HERO_ITEM = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

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
        <motion.div variants={HERO_STAGGER} initial="hidden" animate="show">
          <motion.span className="hero-badge" variants={HERO_ITEM}>
            Hello There! 👋
          </motion.span>
          <motion.h1 variants={HERO_ITEM}>
            I’m <span className="accent">{profile.name}</span>,<br />
            {profile.title} based in {profile.location.split('·')[0].trim()}.
          </motion.h1>

          {data.audiences.length > 0 && (
            <motion.div
              className="audience-switcher"
              role="group"
              aria-label="Choose what you're here for"
              variants={HERO_ITEM}
            >
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
            </motion.div>
          )}

          {audience ? (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
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
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
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
        </motion.div>
      </section>

      {/* ---------- Marquee ---------- */}
      <Marquee />

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
          </Reveal>
          <Stagger className="grid-3">
            {data.services.slice(0, 3).map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
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
                      <div className="value">
                        <CountUp value={stat.value} />
                      </div>
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
            </Reveal>
            <Stagger className="grid-2" key={audience.id}>
              {audience.valueProps.map((prop, i) => {
                const sep = prop.indexOf(' — ');
                const title = sep === -1 ? '' : prop.slice(0, sep);
                const detail = sep === -1 ? prop : prop.slice(sep + 3);
                return (
                  <StaggerItem key={`${audience.id}-${i}`}>
                    <div className="card value-card">
                      <div className="value-index">No. {String(i + 1).padStart(2, '0')}</div>
                      {title && <h4>{title}</h4>}
                      <p>{detail}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
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
          </Reveal>
          <Stagger className="grid-2">
            {data.projects.slice(0, 2).map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
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

      {/* ---------- Beyond the code (ventures) ---------- */}
      {data.ventures.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <SectionHead
                eyebrow="Beyond the Code"
                title={
                  <>
                    More sides of <span className="accent">the same story</span>
                  </>
                }
                onEdit={editFor('ventures')}
              />
            </Reveal>
            <Stagger className="grid-3">
              {data.ventures.map((venture) => (
                <StaggerItem key={venture.id}>
                  <div className="card venture-card">
                    <span className={`status-chip${venture.live ? ' live' : ''}`}>
                      {venture.live ? 'LIVE' : 'COMING SOON'}
                    </span>
                    <div className="icon-circle">{venture.emoji}</div>
                    <h3>{venture.title}</h3>
                    <p className="venture-tagline">{venture.tagline}</p>
                    <p>{venture.description}</p>
                    {venture.live && venture.url ? (
                      <a className="more-link" href={venture.url} target="_blank" rel="noreferrer">
                        Explore <span className="tick">→</span>
                      </a>
                    ) : (
                      <Link className="more-link" to="/coming-soon">
                        Get notified <span className="tick">→</span>
                      </Link>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

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
            </Reveal>
            {data.testimonials.length === 0 ? (
              <div className="empty-note">
                No testimonials yet — add real client quotes from the Edit button. Visitors won’t
                see this section until you do.
              </div>
            ) : (
              <Stagger className="grid-3">
                {data.testimonials.slice(0, 3).map((t) => (
                  <StaggerItem key={t.id}>
                    <TestimonialCard testimonial={t} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
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
            </Reveal>
            <Stagger className="grid-3">
              {latestPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ---------- FAQ band ---------- */}
      <FaqBand />

      <CtaBand />
    </>
  );
}
