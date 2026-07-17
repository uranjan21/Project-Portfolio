import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdminUI } from '../../context/AdminUIContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Reveal } from '../ui/Reveal';

/** Dark FAQ accordion band for the home page — open item turns amber. */
export function FaqBand({ limit = 5 }: { limit?: number }) {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  const [openId, setOpenId] = useState<string | null>(data?.faqs[0]?.id ?? null);
  if (!data || data.faqs.length === 0) return null;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal>
          <div className="band faq-band">
            <div className="center" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              <span className="eyebrow" style={{ justifyContent: 'center' }}>
                FAQs
              </span>
              <h2 style={{ margin: '0.5rem 0 0' }}>
                Questions? <span className="accent">Look here.</span>
              </h2>
              {editFor('faqs') && (
                <button className="edit-chip" onClick={editFor('faqs')} style={{ marginTop: '0.9rem' }}>
                  ✎ Edit FAQs
                </button>
              )}
            </div>
            <div className="faq-d-list">
              {data.faqs.slice(0, limit).map((faq) => {
                const open = openId === faq.id;
                return (
                  <div className={`faq-d-item${open ? ' open' : ''}`} key={faq.id}>
                    <button
                      className="faq-q"
                      onClick={() => setOpenId(open ? null : faq.id)}
                      aria-expanded={open}
                    >
                      {faq.question}
                      <motion.span className="faq-plus" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="faq-answer">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {data.faqs.length > limit && (
              <div style={{ textAlign: 'center', marginTop: '1.4rem' }}>
                <Link className="more-link" to="/faqs" style={{ color: 'var(--on-dark)' }}>
                  All questions <span className="tick">→</span>
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
