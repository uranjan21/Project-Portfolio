import type { PortfolioData } from '../shared/types';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON.stringify safe for embedding in a <script> tag.
const jsonForScript = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c');

function personLd(data: PortfolioData, baseUrl: string) {
  const { profile } = data;
  return {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: profile.name,
    url: baseUrl,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    address: profile.location,
    sameAs: Object.values(profile.links).filter(Boolean),
    knowsAbout: data.skills.map((s) => s.name),
    alumniOf: data.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
  };
}

function websiteLd(data: PortfolioData, baseUrl: string) {
  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: `${data.profile.name} — Portfolio`,
    description: data.profile.seo.metaDescription,
    about: { '@id': `${baseUrl}/#person` },
  };
}

interface PageMeta {
  title: string;
  description: string;
  extraLd: object[];
}

/**
 * Per-route titles, descriptions and extra structured data. Every route gets
 * Person + WebSite; the FAQs page adds FAQPage (rich results) and blog posts
 * add BlogPosting.
 */
function metaForPath(path: string, data: PortfolioData, baseUrl: string): PageMeta {
  const { profile } = data;
  const name = profile.name;
  const fallbackDescription = profile.seo.metaDescription || profile.bio;

  if (path === '/' || path === '/index.html') {
    return { title: `${name} — ${profile.title}`, description: fallbackDescription, extraLd: [] };
  }

  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const service = data.services.find((s) => s.id === serviceMatch[1]);
    if (service) {
      return { title: `${service.title} — ${name}`, description: service.summary, extraLd: [] };
    }
  }
  if (path.startsWith('/services')) {
    return {
      title: `Services — ${name}`,
      description: `Services offered by ${name}: ${data.services.map((s) => s.title.toLowerCase()).join(', ')}.`,
      extraLd: [],
    };
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const project = data.projects.find((p) => p.id === projectMatch[1]);
    if (project) {
      return { title: `${project.title} — ${name}`, description: project.description, extraLd: [] };
    }
  }
  if (path.startsWith('/projects')) {
    return {
      title: `Projects — ${name}`,
      description: `Selected software projects built by ${name} — web apps, AI tools and dashboards.`,
      extraLd: [],
    };
  }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = data.blogPosts.find((p) => p.slug === blogMatch[1]);
    if (post) {
      return {
        title: `${post.title} — ${name}`,
        description: post.excerpt,
        extraLd: [
          {
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@id': `${baseUrl}/#person` },
            url: `${baseUrl}${path}`,
            keywords: post.tags.join(', '),
          },
        ],
      };
    }
  }
  if (path.startsWith('/blog')) {
    return {
      title: `Blog — ${name}`,
      description: `Articles by ${name} on building software, freelancing and shipping products.`,
      extraLd: [],
    };
  }

  if (path.startsWith('/faqs')) {
    return {
      title: `FAQs — ${name}`,
      description: `Answers to common questions about working with ${name}.`,
      extraLd: [
        {
          '@type': 'FAQPage',
          '@id': `${baseUrl}/faqs#faq`,
          mainEntity: data.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    };
  }

  const staticPages: Record<string, { title: string; description: string }> = {
    '/about': {
      title: `About — ${name}`,
      description: `Who is ${name}? Background, experience, education and the tools behind the work.`,
    },
    '/testimonials': {
      title: `Testimonials — ${name}`,
      description: `What clients and teams say about working with ${name}.`,
    },
    '/contact': {
      title: `Contact — ${name}`,
      description: `Start a project or say hello — contact ${name} for freelance work and full-time opportunities.`,
    },
    '/coming-soon': {
      title: `Coming soon — ${name}`,
      description: 'Something new is on the way.',
    },
  };
  const staticPage = staticPages[path];
  if (staticPage) return { ...staticPage, extraLd: [] };

  return { title: `Page not found — ${name}`, description: fallbackDescription, extraLd: [] };
}

/**
 * Renders the full <head> SEO block for a route: title, meta, canonical,
 * Open Graph, Twitter card, JSON-LD and a <noscript> summary. Replaces the
 * `<!-- seo:start -->…<!-- seo:end -->` block in index.html.
 */
export function renderSeoTags(data: PortfolioData, baseUrl: string, path: string): string {
  const { profile } = data;
  const { title, description, extraLd } = metaForPath(path, data, baseUrl);
  const canonical = path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`;
  const graph = { '@context': 'https://schema.org', '@graph': [personLd(data, baseUrl), websiteLd(data, baseUrl), ...extraLd] };

  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="keywords" content="${esc(profile.seo.keywords.join(', '))}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${esc(canonical)}" />`,
    // Open Graph
    '<meta property="og:type" content="profile" />',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
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
  lines.push(`<script type="application/ld+json">${jsonForScript(graph)}</script>`);
  lines.push(
    `<noscript><p>${esc(profile.name)} — ${esc(profile.title)}. ${esc(description)} Contact: ${esc(profile.email)}.</p></noscript>`,
  );
  return lines.join('\n    ');
}

export function renderRobotsTxt(baseUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

/** Sitemap covering all static routes plus dynamic service/project/blog URLs. */
export function renderSitemapXml(data: PortfolioData, baseUrl: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const paths = [
    '/',
    '/services',
    ...data.services.map((s) => `/services/${s.id}`),
    '/about',
    '/projects',
    ...data.projects.map((p) => `/projects/${p.id}`),
    '/blog',
    ...data.blogPosts.map((b) => `/blog/${b.slug}`),
    '/testimonials',
    '/contact',
    '/faqs',
  ];
  const urls = paths
    .map((p) => {
      const loc = p === '/' ? `${baseUrl}/` : `${baseUrl}${p}`;
      const priority = p === '/' ? '1.0' : '0.7';
      return `  <url><loc>${esc(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
