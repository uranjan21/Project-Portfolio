import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PillProps {
  children: ReactNode;
  variant?: 'dark' | 'amber' | 'outline';
  /** Internal route — rendered as a router Link. */
  to?: string;
  /** External / non-router URL — rendered as <a>. */
  href?: string;
  onClick?: MouseEventHandler;
  download?: boolean;
  newTab?: boolean;
  small?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

/** Signature CTA: rounded pill with a trailing circular arrow. */
export function Pill({
  children,
  variant = 'dark',
  to,
  href,
  onClick,
  download,
  newTab,
  small,
  disabled,
  type = 'button',
}: PillProps) {
  const className = `pill ${variant}${small ? ' sm' : ''}`;
  const inner = (
    <>
      <span>{children}</span>
      {variant !== 'outline' && <span className="arrow">→</span>}
    </>
  );

  if (to) {
    return (
      <Link className={className} to={to} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        className={className}
        href={href}
        onClick={onClick}
        {...(download ? { download: true } : {})}
        {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={className} onClick={onClick} disabled={disabled} type={type}>
      {inner}
    </button>
  );
}
