import { Dialog } from '../admin/Dialog';
import { useAudience } from '../../context/AudienceContext';

/**
 * First-visit prompt: asks who is browsing (recruiter / client / engineer / …)
 * so every page can tailor its copy, projects and skills. The options are the
 * audiences configured in the admin panel. Picking one (or skipping) persists,
 * so the dialog only ever shows once per browser.
 */
export function WelcomeDialog() {
  const { audiences, dialogOpen, select, dismiss } = useAudience();
  if (!dialogOpen) return null;

  return (
    <Dialog title="Before you dive in…" onClose={dismiss}>
      <p className="welcome-sub">
        Tell me what brings you here and I’ll tailor the whole site — headlines, projects,
        skills — to what matters to you.
      </p>
      <div className="welcome-options">
        {audiences.map((a) => (
          <button
            key={a.id}
            className="welcome-option"
            onClick={() => {
              select(a.id);
              dismiss();
            }}
          >
            <span className="welcome-option-label">{a.label}</span>
            <span className="welcome-option-headline">{a.headline}</span>
          </button>
        ))}
      </div>
      <div className="dialog-actions">
        <button className="btn" onClick={dismiss}>
          Just browsing — show me everything
        </button>
      </div>
    </Dialog>
  );
}
