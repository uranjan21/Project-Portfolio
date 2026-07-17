import { CtaBand } from '../components/sections/CtaBand';
import { Reveal } from '../components/ui/Reveal';
import { useAdminUI } from '../context/AdminUIContext';
import { usePortfolio } from '../context/PortfolioContext';
import { usePageMeta } from '../hooks/usePageMeta';

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
          <Reveal>
            <div className="faq-list">
              {data.faqs.map((faq, i) => (
                <details className="faq-item" key={faq.id} open={i === 0}>
                  <summary>{faq.question}</summary>
                  <div className="faq-answer">{faq.answer}</div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
