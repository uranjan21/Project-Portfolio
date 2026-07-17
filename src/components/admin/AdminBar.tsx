import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { MessagesInbox } from './MessagesInbox';
import { QuestionsInbox } from './QuestionsInbox';

/** Floating bar shown while in admin mode: inboxes with badges + logout. */
export function AdminBar() {
  const { token, logout } = usePortfolio();
  const [openQuestions, setOpenQuestions] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [panel, setPanel] = useState<'questions' | 'messages' | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const [questions, messages] = await Promise.all([api.getQuestions(token), api.getMessages(token)]);
        if (!cancelled) {
          setOpenQuestions(questions.filter((q) => q.status === 'open').length);
          setUnreadMessages(messages.filter((m) => !m.read).length);
        }
      } catch {
        // token expired or network hiccup — badges just go stale
      }
    };
    void poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, panel]);

  return (
    <>
      <div className="admin-bar">
        <span>◆ ADMIN</span>
        <button onClick={() => setPanel('questions')}>
          Questions{openQuestions > 0 && <span className="badge">{openQuestions}</span>}
        </button>
        <button onClick={() => setPanel('messages')}>
          Messages{unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
        </button>
        <button onClick={logout}>Logout</button>
      </div>
      {panel === 'questions' && <QuestionsInbox onClose={() => setPanel(null)} />}
      {panel === 'messages' && <MessagesInbox onClose={() => setPanel(null)} />}
    </>
  );
}
