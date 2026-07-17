import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Shared HUD-styled modal shell: backdrop, entry animation, Escape/backdrop close. */
export function Dialog({ title, onClose, children }: DialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      >
        <button className="close-x" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3>{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
}
