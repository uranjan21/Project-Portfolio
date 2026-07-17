import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import type { SectionKey } from '../../types/portfolio';
import { AdminBar } from '../admin/AdminBar';
import { EditDialog } from '../admin/EditDialog';
import { LoginDialog } from '../admin/LoginDialog';
import { ChatWidget } from '../chat/ChatWidget';
import { ScrollProgress } from '../ui/ScrollProgress';
import { AdminUIContext } from '../../context/AdminUIContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Footer } from './Footer';
import { Nav } from './Nav';

/** App shell: nav, routed page, footer, chat, and the admin dialog layer. */
export function Layout() {
  const { data, error, isAdmin } = usePortfolio();
  const [loginOpen, setLoginOpen] = useState(false);
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const location = useLocation();

  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Ctrl/Cmd+Shift+A opens admin login.
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

  const editFor = useCallback(
    (section: SectionKey) => (isAdmin ? () => setEditing(section) : undefined),
    [isAdmin],
  );
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const adminUI = useMemo(() => ({ editFor, openLogin }), [editFor, openLogin]);

  if (error) {
    return <div className="loading-screen">Couldn’t load the site — {error}</div>;
  }
  if (!data) {
    return <div className="loading-screen">Loading…</div>;
  }

  return (
    <AdminUIContext.Provider value={adminUI}>
      <ScrollProgress />
      <div className="ambient a1" aria-hidden="true" />
      <div className="ambient a2" aria-hidden="true" />
      <Nav />
      <main>
        {/* Re-keying on pathname gives every page an entrance transition. */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />

      {isAdmin && <AdminBar />}
      <ChatWidget />

      <AnimatePresence>
        {loginOpen && <LoginDialog key="login" onClose={() => setLoginOpen(false)} />}
        {editing && isAdmin && (
          <EditDialog key={`edit-${editing}`} section={editing} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>
    </AdminUIContext.Provider>
  );
}
