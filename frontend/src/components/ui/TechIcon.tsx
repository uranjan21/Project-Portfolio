import type { ReactNode } from 'react';

/**
 * Clean line-style SVG icon for a technology, chosen from the skill name.
 * Uses concept icons (not brand logos) so the set stays visually consistent.
 */

function iconKey(name: string): string {
  const n = name.toLowerCase();
  // Specific technologies first, so ".js" file suffixes don't hijack the
  // generic JavaScript icon (e.g. Chart.js -> chart, Node.js -> server).
  if (/react|next/.test(n)) return 'react';
  if (/redux/.test(n)) return 'state';
  if (/chart|recharts|highchart|visuali|dashboard|d3/.test(n)) return 'chart';
  if (/node|express/.test(n)) return 'server';
  if (/fastapi|python|django|flask/.test(n)) return 'server';
  if (/rest|api|microservice|graphql|grpc/.test(n)) return 'api';
  if (/mongo|postgre|mysql|\bsql\b|database|redis/.test(n)) return 'database';
  if (/aws|cloud|lambda|\beks\b|\becr\b|azure|gcp/.test(n)) return 'cloud';
  if (/docker|kubernet|container|helm/.test(n)) return 'container';
  if (/git|jenkins|devops/.test(n)) return 'git';
  if (/html/.test(n)) return 'markup';
  if (/tailwind|styled|scss|sass|\bcss\b/.test(n)) return 'style';
  if (/typescript|javascript/.test(n)) return 'code';
  return 'chip';
}

const dot = (cx: number, cy: number) => (
  <circle cx={cx} cy={cy} r="0.7" fill="currentColor" stroke="none" />
);

const ICONS: Record<string, ReactNode> = {
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
};

export function TechIcon({ name, size = 26 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[iconKey(name)]}
    </svg>
  );
}
