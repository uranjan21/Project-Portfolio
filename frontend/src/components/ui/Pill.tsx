import type { MouseEventHandler, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMagnetic } from '../../hooks/useMagnetic';
import { Icon } from './Icon';

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

const MotionLink = motion.create(Link);

/**
 * Signature CTA: rounded pill with a trailing arrow, magnetised to the cursor.
 * The magnetic pull is mouse-only and reduced-motion aware (see `useMagnetic`).
 */
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
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic();
  const className = `pill ${variant}${small ? ' sm' : ''}`;
  const motionProps = { style: { x, y }, onPointerMove, onPointerLeave };

  const inner = (
    <>
      <span>{children}</span>
      {variant !== 'outline' && (
        <span className="arrow">
          <Icon name="arrow-right" size={16} />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <MotionLink
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        to={to}
        onClick={onClick}
        {...motionProps}
      >
        {inner}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        href={href}
        onClick={onClick}
        {...(download ? { download: true } : {})}
        {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
