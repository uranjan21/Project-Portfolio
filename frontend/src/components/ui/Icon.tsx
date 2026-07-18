import type { ReactNode } from 'react';

/**
 * The line-style icon family: 24x24, 1.7 stroke, round caps, `currentColor`.
 *
 * Every glyph inherits its colour from the parent, so icons are theme-agnostic
 * by construction — nothing here needs a dark-mode variant.
 *
 * Two families exist on purpose: this one (line, for concepts and UI affordances)
 * and `SocialIcon` (solid, for brand marks). Don't merge them.
 */

const dot = (cx: number, cy: number) => (
  <circle cx={cx} cy={cy} r="0.7" fill="currentColor" stroke="none" />
);

const STAR_PATH =
  'M12 3.4l2.7 5.48 6.05.88-4.38 4.26 1.04 6.02L12 17.2l-5.41 2.84 1.04-6.02L3.25 9.76l6.05-.88L12 3.4Z';

const ICONS = {
  /* ── UI affordances ─────────────────────────────────────────────── */
  edit: (
    <>
      <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  send: (
    <>
      <path d="M21 3 10.4 13.6" />
      <path d="M21 3l-6.8 18-3.8-7.4L3 9.8 21 3Z" />
    </>
  ),
  'chevron-up': <path d="M6 14.5l6-6 6 6" />,
  'chevron-down': <path d="M6 9.5l6 6 6-6" />,
  'arrow-right': <path d="M4 12h15M13 6l6 6-6 6" />,
  'arrow-left': <path d="M20 12H5M11 6l-6 6 6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8.5 7H17v8.5" />,
  star: <path d={STAR_PATH} fill="currentColor" />,
  'star-outline': <path d={STAR_PATH} />,
  diamond: <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z" />,
  sparkle: <path d="M12 3.5l1.92 5.08L19 10.5l-5.08 1.92L12 17.5l-1.92-5.08L5 10.5l5.08-1.92L12 3.5Z" />,
  asterisk: <path d="M12 4v16M4.7 7.8l14.6 8.4M19.3 7.8 4.7 16.2" />,

  /* ── Journey / résumé ───────────────────────────────────────────── */
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M12 4 22 9l-10 5L2 9l10-5Z" />
      <path d="M6 11.2V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.8" />
    </>
  ),
  // Three fingers, not four: at 16px in the hero badge a fourth stroke closes
  // up the gaps and the whole shape turns into a blob.
  wave: (
    <>
      <path d="M7.6 12.4V7.2a1.7 1.7 0 0 1 3.4 0v4" />
      <path d="M11 11.2V5.4a1.7 1.7 0 0 1 3.4 0v5.8" />
      <path d="M14.4 11.6V7.8a1.7 1.7 0 0 1 3.4 0v6.4a6.2 6.2 0 0 1-6.2 6.2 6.2 6.2 0 0 1-4.4-1.8l-2.5-2.5a1.7 1.7 0 0 1 2.4-2.4l1.5 1.5" />
    </>
  ),

  /* ── Technology concepts (shared with TechIcon) ─────────────────── */
  react: (
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  state: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5.5" cy="17" r="2.2" />
      <circle cx="18.5" cy="17" r="2.2" />
      <path d="M10.2 6.4 6.9 15M13.8 6.4 17.1 15M7.7 17.4h8.6" />
    </>
  ),
  markup: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      {dot(6, 6.7)}
      {dot(8.2, 6.7)}
    </>
  ),
  style: <path d="M12 3c3.5 4 5.5 6.8 5.5 9.5A5.5 5.5 0 0 1 6.5 12.5C6.5 9.8 8.5 7 12 3Z" />,
  code: (
    <>
      <path d="M8.5 8 4.5 12l4 4" />
      <path d="M15.5 8l4 4-4 4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <rect x="6" y="11" width="3" height="7" rx="0.5" />
      <rect x="11" y="7" width="3" height="11" rx="0.5" />
      <rect x="16" y="14" width="3" height="4" rx="0.5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
  cloud: <path d="M7.5 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.2A3.75 3.75 0 0 1 16.5 18Z" />,
  container: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M4 7.5l8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  git: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2v7.6" />
      <path d="M18 11.2c0 3-2.4 4-6 4.8" />
    </>
  ),
  server: (
    <>
      <rect x="3.5" y="5" width="17" height="6" rx="1.5" />
      <rect x="3.5" y="13" width="17" height="6" rx="1.5" />
      {dot(7, 8)}
      {dot(7, 16)}
    </>
  ),
  api: (
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="12" r="2.4" />
      <path d="M8.4 12h7.2" />
    </>
  ),
  chip: (
    <>
      <path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3Z" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** Every key in the registry — used by the admin icon picker. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Keys offered as content icons (services, ventures). Excludes UI affordances. */
export const CONTENT_ICON_NAMES: IconName[] = [
  'react', 'state', 'markup', 'style', 'code', 'chart', 'database',
  'cloud', 'container', 'git', 'server', 'api', 'chip', 'sparkle',
  'briefcase', 'graduation-cap', 'diamond', 'star',
];

export function isIconName(value: string): value is IconName {
  return value in ICONS;
}

interface IconProps {
  name: IconName | (string & {});
  size?: number;
  className?: string;
  /** Set when the icon is the only content of its control and carries meaning. */
  label?: string;
}

export function Icon({ name, size = 18, className, label }: IconProps) {
  // Unknown keys fall back to `chip` so bad CMS data never renders a hole.
  const glyph = ICONS[name as IconName] ?? ICONS.chip;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
