import type { ReactNode } from 'react';

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  /** Right-aligned action, e.g. a "View All" pill. */
  action?: ReactNode;
  onEdit?: () => void;
}

/** "— Eyebrow" + big heading row, with optional action pill and admin edit chip. */
export function SectionHead({ eyebrow, title, action, onEdit }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {(action || onEdit) && (
        <div className="head-actions">
          {onEdit && (
            <button className="edit-chip" onClick={onEdit}>
              ✎ Edit
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
