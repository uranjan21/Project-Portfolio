import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

/** Fades content up when it scrolls into view. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
