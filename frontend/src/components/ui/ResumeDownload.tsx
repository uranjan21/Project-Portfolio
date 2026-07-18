import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RESUME_DOCX_URL, RESUME_URL } from '../../api/client';
import { Pill } from './Pill';

interface ResumeDownloadProps {
  children?: ReactNode;
  variant?: 'dark' | 'amber' | 'outline';
}

/**
 * Resume CTA with a format picker: clicking the pill opens a small menu to
 * download the resume as PDF or Word (.docx).
 */
export function ResumeDownload({ children = 'Download CV', variant = 'amber' }: ResumeDownloadProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div className="resume-dl" ref={ref}>
      <Pill variant={variant} onClick={() => setOpen((o) => !o)}>
        {children}
      </Pill>
      {open && (
        <div className="resume-dl-menu" role="menu">
          <a role="menuitem" href={RESUME_URL} download onClick={() => setOpen(false)}>
            PDF (.pdf)
          </a>
          <a role="menuitem" href={RESUME_DOCX_URL} download onClick={() => setOpen(false)}>
            Word (.docx)
          </a>
        </div>
      )}
    </div>
  );
}
