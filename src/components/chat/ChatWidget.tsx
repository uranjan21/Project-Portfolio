import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../api/client';
import { usePortfolio } from '../../context/PortfolioContext';

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

let nextId = 1;

/** Floating HUD chat console that answers questions about the portfolio owner. */
export function ChatWidget() {
  const { data } = usePortfolio();
  const firstName = data?.profile.name.split(' ')[0] ?? 'me';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: nextId++,
          from: 'bot',
          text: `Hi — I'm ${firstName}'s portfolio assistant. Ask me anything about ${firstName}'s experience, projects, or skills.`,
        },
      ]);
    }
  }, [open, messages.length, firstName]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setMessages((m) => [...m, { id: nextId++, from: 'user', text }]);
    setBusy(true);
    try {
      const { reply } = await api.chat(text);
      setMessages((m) => [...m, { id: nextId++, from: 'bot', text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: nextId++,
          from: 'bot',
          text: err instanceof Error ? err.message : 'Transmission failed — try again in a moment.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <div className="chat-head">
              <span className="dot" /> COMM CHANNEL // ASSISTANT
            </div>
            <div className="chat-log" ref={logRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-msg ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
              {busy && <div className="chat-msg bot typing">…</div>}
            </div>
            <div className="chat-input-row">
              <input
                placeholder="Ask about me…"
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void send();
                }}
              />
              <button onClick={() => void send()} disabled={busy || !input.trim()}>
                SEND
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {open ? '×' : '✦'}
      </button>
    </>
  );
}
