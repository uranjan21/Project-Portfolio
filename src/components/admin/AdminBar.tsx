import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { usePortfolio } from '../../context/PortfolioContext';
import { QuestionsInbox } from './QuestionsInbox';

/** Floating bar shown while in admin mode: inbox with badge + logout. */
export function AdminBar() {
  const { token, logout } = usePortfolio();
  const [openCount, setOpenCount] = useState(0);
  const [inboxOpen, setInboxOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const questions = await api.getQuestions(token);
        if (!cancelled) setOpenCount(questions.filter((q) => q.status === 'open').length);
      } catch {
        // token expired or network hiccup — badge just goes stale
      }
    };
    void poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, inboxOpen]);

  return (
    <>
      <div className="admin-bar">
        <span className="who">◈ ADMIN MODE</span>
        <button onClick={() => setInboxOpen(true)}>
          INBOX{openCount > 0 && <span className="badge">{openCount}</span>}
        </button>
        <button onClick={logout}>LOGOUT</button>
      </div>
      {inboxOpen && <QuestionsInbox onClose={() => setInboxOpen(false)} />}
    </>
  );
}
