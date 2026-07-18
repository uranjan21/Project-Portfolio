import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const { data, error, isAdmin, refresh } = usePortfolio();
  const [loginOpen, setLoginOpen] = useState(false);
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // On route change, scroll to top *and* move focus into <main>. Without the
  // focus move a keyboard/screen-reader user stays parked on the old page's
  // link and gets no signal that the page changed.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
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

  // On a fast connection the fetch resolves in well under 200ms, so showing the
  // spinner immediately just produces a flash. Hold it back; render nothing
  // until the wait is long enough to be worth acknowledging.
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (data) return;
    const t = setTimeout(() => setShowSpinner(true), 200);
    return () => clearTimeout(t);
  }, [data]);

  const editFor = useCallback(
    (section: SectionKey) => (isAdmin ? () => setEditing(section) : undefined),
    [isAdmin],
  );
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const adminUI = useMemo(() => ({ editFor, openLogin }), [editFor, openLogin]);

  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-brand">
          <span className="loading-logo">
            {data?.profile.name.split(' ')[0] ?? 'Portfolio'}
            <em>.</em>
          </span>
          <p role="alert">Couldn’t load the site — {error}</p>
          <button className="btn primary" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!data) {
    if (!showSpinner) return null;
    return (
      <div className="loading-screen" role="status" aria-live="polite">
        <div className="loading-brand">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <AdminUIContext.Provider value={adminUI}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <ScrollProgress />
      <div className="ambient a1" aria-hidden="true" />
      <div className="ambient a2" aria-hidden="true" />
      <Nav />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
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
