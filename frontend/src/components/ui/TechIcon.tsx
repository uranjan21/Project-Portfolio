import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Picks a concept icon for a technology from its name, so the skills grid stays
 * visually consistent without shipping brand logos. Glyphs live in `Icon`.
 */

function iconKey(name: string): IconName {
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

export function TechIcon({ name, size = 26 }: { name: string; size?: number }) {
  return <Icon name={iconKey(name)} size={size} />;
}
