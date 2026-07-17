import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CtaBand } from '../components/sections/CtaBand';
import { Stagger, StaggerItem } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {question}
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
            <div className="faq-answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqsPage() {
  const { data } = usePortfolio();
  const { editFor } = useAdminUI();
  usePageMeta(data ? `FAQs — ${data.profile.name}` : 'FAQs');
  if (!data) return null;

  return (
    <>
      <div className="container page-hero" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          FAQs
        </span>
        <h1>
          Questions, <span className="accent">answered</span>
        </h1>
        <p className="sub" style={{ margin: '0.8rem auto 0' }}>
          These also power the chat assistant in the corner — if your question isn’t here, ask it
          there and it will reach me directly.
        </p>
        {editFor('faqs') && (
          <button className="edit-chip" onClick={editFor('faqs')} style={{ marginTop: '1rem' }}>
            ✎ Edit FAQs
          </button>
        )}
      </div>
      <section className="section">
        <div className="container">
          <Stagger className="faq-list">
            {data.faqs.map((faq, i) => (
              <StaggerItem key={faq.id}>
                <FaqItem question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
