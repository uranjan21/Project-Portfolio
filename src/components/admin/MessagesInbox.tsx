import { useCallback, useEffect, useState } from 'react';
import type { ContactMessage } from '../../../shared/types';
import { api } from '../../lib/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Dialog } from './Dialog';

/** Admin inbox for contact-form submissions. */
export function MessagesInbox({ onClose }: { onClose: () => void }) {
  const { token } = usePortfolio();
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setMessages(await api.getMessages(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: string) => {
    if (!token) return;
    try {
      await api.markMessageRead(token, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const unread = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <Dialog title={`Contact messages (${unread} unread)`} onClose={onClose}>
      {messages === null && !error && <div className="hint">Loading…</div>}
      {error && <div className="error">{error}</div>}
      {messages !== null && messages.length === 0 && (
        <div className="hint">No messages yet — they’ll land here when someone uses the contact form.</div>
      )}
      {messages?.map((msg) => (
        <div className="inbox-item" key={msg.id} style={{ opacity: msg.read ? 0.65 : 1 }}>
          <div className="q">
            {msg.name} · <a href={`mailto:${msg.email}`}>{msg.email}</a>
          </div>
          <div className="when">{new Date(msg.sentAt).toLocaleString()}</div>
          <div className="meta-chips tag-chips">
            {msg.interest && <span>{msg.interest}</span>}
            {msg.budget && <span className="green">{msg.budget}</span>}
            {msg.phone && <span className="green">{msg.phone}</span>}
          </div>
          <div className="msg-body">{msg.message}</div>
          <div className="dialog-actions">
            <a
              className="pill outline sm"
              href={`mailto:${msg.email}?subject=Re: your message on my portfolio`}
            >
              Reply by email
            </a>
            {!msg.read && (
              <button className="pill dark sm" onClick={() => void markRead(msg.id)}>
                <span>Mark read</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </Dialog>
  );
}
