// Generates public/sitemap.xml from the static routes plus any dynamic
// project/blog/service routes fetched from the API. Resilient: if the API
// is unreachable at build time, it emits the static routes only.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = (process.env.SITE_URL || 'https://utsavranjan.info').replace(/\/$/, '');
const API = process.env.API_URL || 'http://localhost:8001';

const staticRoutes = [
  '/', '/services', '/about', '/projects', '/blog', '/testimonials', '/faqs', '/contact',
];

let dynamic = [];
try {
  const res = await fetch(`${API}/api/portfolio`);
  if (res.ok) {
    const d = await res.json();
    dynamic = [
      ...(d.services ?? []).map((s) => `/services/${s.id}`),
      ...(d.projects ?? []).map((p) => `/projects/${p.id}`),
      ...(d.blogPosts ?? []).map((b) => `/blog/${b.slug}`),
    ];
  }
} catch {
  console.warn('sitemap: API unreachable — emitting static routes only');
}

const urls = [...staticRoutes, ...dynamic];
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') +
  '\n</urlset>\n';

const out = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url));
writeFileSync(out, xml);
console.log(`sitemap: wrote ${urls.length} urls -> public/sitemap.xml`);
