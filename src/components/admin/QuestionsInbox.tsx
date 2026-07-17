import { useCallback, useEffect, useState } from 'react';
import type { UnansweredQuestion } from '../../../shared/types';
import { api } from '../../lib/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Dialog } from './Dialog';

/** Admin inbox of visitor questions the assistant couldn't answer. */
export function QuestionsInbox({ onClose }: { onClose: () => void }) {
  const { token, refresh } = usePortfolio();
  const [questions, setQuestions] = useState<UnansweredQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { answer: string; addToFaq: boolean }>>({});

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setQuestions(await api.getQuestions(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = questions?.filter((q) => q.status === 'open') ?? [];

  const submitAnswer = async (id: string) => {
    if (!token) return;
    const draft = drafts[id];
    if (!draft?.answer.trim()) return;
    try {
      await api.answerQuestion(token, id, { answer: draft.answer, addToFaq: draft.addToFaq ?? true });
      await load();
      await refresh(); // FAQ list may have grown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save answer');
    }
  };

  const dismiss = async (id: string) => {
    if (!token) return;
    try {
      await api.dismissQuestion(token, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss');
    }
  };

  return (
    <Dialog title={`Visitor questions (${open.length} open)`} onClose={onClose}>
      {questions === null && !error && <div className="hint">Loading…</div>}
      {error && <div className="error">{error}</div>}
      {questions !== null && open.length === 0 && (
        <div className="hint">Inbox zero — the assistant has answered everything so far.</div>
      )}
      {open.map((q) => (
        <div className="inbox-item" key={q.id}>
          <div className="q">“{q.question}”</div>
          <div className="when">{new Date(q.askedAt).toLocaleString()}</div>
          <div className="answer-row">
            <textarea
              placeholder="Write the answer visitors should get…"
              value={drafts[q.id]?.answer ?? ''}
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [q.id]: { addToFaq: d[q.id]?.addToFaq ?? true, answer: e.target.value } }))
              }
            />
          </div>
          <label className="faq-toggle">
            <input
              type="checkbox"
              checked={drafts[q.id]?.addToFaq ?? true}
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [q.id]: { answer: d[q.id]?.answer ?? '', addToFaq: e.target.checked } }))
              }
            />
            Add to FAQ so the assistant can answer this next time
          </label>
          <div className="dialog-actions">
            <button className="btn" onClick={() => void dismiss(q.id)}>Dismiss</button>
            <button
              className="btn primary"
              disabled={!drafts[q.id]?.answer.trim()}
              onClick={() => void submitAnswer(q.id)}
            >
              Save answer
            </button>
          </div>
        </div>
      ))}
    </Dialog>
  );
}
