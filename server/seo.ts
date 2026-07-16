import type { PortfolioData } from '../shared/types';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON.stringify safe for embedding in a <script> tag.
const jsonForScript = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c');

/**
 * Structured data for search engines: Person (knowledge-panel signals),
 * WebSite (site identity for name queries) and FAQPage (rich results).
 * All generated from the live portfolio content, so admin edits keep it fresh.
 */
function buildJsonLd(data: PortfolioData, baseUrl: string): string {
  const { profile } = data;
  const sameAs = Object.values(profile.links).filter(Boolean);

  const person = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: profile.name,
    url: baseUrl,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    address: profile.location,
    sameAs,
    knowsAbout: data.skills.map((s) => s.name),
    alumniOf: data.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: `${profile.name} — Portfolio`,
    description: profile.seo.metaDescription,
    about: { '@id': `${baseUrl}/#person` },
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${baseUrl}/#faq`,
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return jsonForScript({ '@context': 'https://schema.org', '@graph': [person, website, faqPage] });
}

/**
 * Renders the full <head> SEO block: title, meta, canonical, Open Graph,
 * Twitter card, JSON-LD, and a <noscript> summary for non-JS crawlers.
 * Replaces the `<!-- seo:start -->…<!-- seo:end -->` block in index.html.
 */
export function renderSeoTags(data: PortfolioData, baseUrl: string): string {
  const { profile } = data;
  const title = `${profile.name} — ${profile.title}`;
  const description = profile.seo.metaDescription || profile.bio;

  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="keywords" content="${esc(profile.seo.keywords.join(', '))}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${esc(baseUrl)}/" />`,
    // Open Graph
    '<meta property="og:type" content="profile" />',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(baseUrl)}/" />`,
    `<meta property="og:site_name" content="${esc(profile.name)} — Portfolio" />`,
    // Twitter
    `<meta name="twitter:card" content="${profile.seo.ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  ];
  if (profile.seo.ogImage) {
    lines.push(`<meta property="og:image" content="${esc(profile.seo.ogImage)}" />`);
    lines.push(`<meta name="twitter:image" content="${esc(profile.seo.ogImage)}" />`);
  }
  lines.push(`<script type="application/ld+json">${buildJsonLd(data, baseUrl)}</script>`);
  lines.push(
    `<noscript><p>${esc(profile.name)} — ${esc(profile.title)}. ${esc(description)} Contact: ${esc(profile.email)}.</p></noscript>`,
  );
  return lines.join('\n    ');
}

export function renderRobotsTxt(baseUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

export function renderSitemapXml(baseUrl: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `  <url><loc>${baseUrl}/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    '</urlset>\n'
  );
}
