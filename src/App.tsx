import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { SectionKey } from '../shared/types';
import { AdminBar } from './components/admin/AdminBar';
import { EditDialog } from './components/admin/EditDialog';
import { LoginDialog } from './components/admin/LoginDialog';
import { ChatWidget } from './components/chat/ChatWidget';
import { BootScreen } from './components/hud/BootScreen';
import { Starfield } from './components/hud/Starfield';
import { StatusBar } from './components/hud/StatusBar';
import { ContactSection } from './components/sections/ContactSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { Hero } from './components/sections/Hero';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { RecordsSection } from './components/sections/RecordsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

function Site() {
  const { data, error, isAdmin } = usePortfolio();
  const [loginOpen, setLoginOpen] = useState(false);
  const [editing, setEditing] = useState<SectionKey | null>(null);

  // Ctrl/Cmd+Shift+A also opens admin login.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setLoginOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (error) {
    return <div className="loading-screen">SIGNAL LOST — {error}</div>;
  }
  if (!data) {
    return <div className="loading-screen">ESTABLISHING UPLINK…</div>;
  }

  const edit = (section: SectionKey) => (isAdmin ? () => setEditing(section) : undefined);
  const initials = data.profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <BootScreen />
      <Starfield />
      <div className="scanlines" />
      <div className="vignette" />
      <StatusBar initials={initials} />

      <main className="content">
        <Hero profile={data.profile} onEdit={edit('profile')} />
        <ExperienceSection experiences={data.experiences} onEdit={edit('experiences')} />
        <ProjectsSection projects={data.projects} onEdit={edit('projects')} />
        <SkillsSection skills={data.skills} onEdit={edit('skills')} />
        <RecordsSection
          achievements={data.achievements}
          education={data.education}
          onEditAchievements={edit('achievements')}
          onEditEducation={edit('education')}
        />
        <ContactSection profile={data.profile} />
      </main>

      <footer className="footer">
        <span>DESIGNED &amp; BUILT BY {data.profile.name.toUpperCase()} · © {new Date().getFullYear()}</span>
        {isAdmin ? (
          <button className="admin-link" onClick={() => setEditing('faqs')}>
            EDIT FAQ
          </button>
        ) : (
          <button className="admin-link" onClick={() => setLoginOpen(true)}>
            ADMIN ACCESS
          </button>
        )}
      </footer>

      {isAdmin && <AdminBar />}
      <ChatWidget />

      <AnimatePresence>
        {loginOpen && <LoginDialog key="login" onClose={() => setLoginOpen(false)} />}
        {editing && isAdmin && (
          <EditDialog key={`edit-${editing}`} section={editing} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <Site />
    </PortfolioProvider>
  );
}
