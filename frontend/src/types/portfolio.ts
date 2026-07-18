// Types shared between the client (src/) and the server (server/).

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SeoMeta {
  /** <meta name="description"> and og:description. */
  metaDescription: string;
  keywords: string[];
  /** Absolute URL of a social preview image (og:image). Optional. */
  ogImage?: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  /** Optional portrait URL; the hero shows a monogram blob when unset. */
  photoUrl?: string;
  links: SocialLinks;
  stats: Stat[];
  seo: SeoMeta;
}

/**
 * A pitch targeted at one visitor type (recruiter, freelance client, fellow
 * engineer, …). Drives the hero headline, the "Why Me" section, and the
 * primary call to action.
 */
export interface AudiencePitch {
  id: string;
  /** Switcher button text, e.g. "HIRING FOR A TEAM". */
  label: string;
  headline: string;
  pitch: string;
  /** "Title — detail" per entry; title is emphasised in the UI. */
  valueProps: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  /** 1-5 stars; defaults to 5 in the UI when unset. */
  rating?: number;
}

export interface Service {
  id: string;
  title: string;
  /** Emoji shown in the service card icon circle. */
  emoji: string;
  /** One-liner for cards and meta descriptions. */
  summary: string;
  /** Long-form copy for the service details page; blank line = new paragraph. */
  description: string;
  deliverables: string[];
  tech: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  /** e.g. "/ hour", "/ project", "/ month" */
  unit: string;
  features: string[];
  highlighted: boolean;
}

export interface BlogPost {
  id: string;
  /** URL path segment: /blog/<slug> */
  slug: string;
  title: string;
  excerpt: string;
  /**
   * Lightweight markup: blank line = paragraph break, lines starting with
   * "## " = heading, lines starting with "- " = bullet list item.
   */
  content: string;
  date: string; // ISO date
  tags: string[];
  coverUrl?: string;
}

/**
 * A side of life beyond client work — content creation, founding startups,
 * SaaS products. Shown as "Beyond the code" cards; coming-soon until live.
 */
export interface Venture {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  live: boolean;
  /** Destination when live (channel, product site, …). */
  url?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  budget?: string;
  message: string;
  sentAt: string; // ISO timestamp
  read: boolean;
  status: 'new' | 'read' | 'replied' | 'converted' | 'archived';
  clientId?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  /** Emoji shown in the tools grid tile. */
  emoji?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  tech: string[];
}

export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  /** Long-form copy for the project details page; blank line = new paragraph. */
  details?: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  detail?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface PortfolioData {
  profile: Profile;
  audiences: AudiencePitch[];
  services: Service[];
  pricing: PricingPlan[];
  testimonials: Testimonial[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  blogPosts: BlogPost[];
  ventures: Venture[];
  education: Education[];
  achievements: Achievement[];
  faqs: FaqEntry[];
}

export type SectionKey = keyof PortfolioData;

export const SECTION_KEYS: SectionKey[] = [
  'profile',
  'audiences',
  'services',
  'pricing',
  'testimonials',
  'skills',
  'experiences',
  'projects',
  'blogPosts',
  'ventures',
  'education',
  'achievements',
  'faqs',
];

export interface UnansweredQuestion {
  id: string;
  question: string;
  askedAt: string; // ISO timestamp
  status: 'open' | 'answered' | 'dismissed';
  answer?: string;
}

// --- API payloads ---

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  /** Where the answer came from. */
  source: 'faq' | 'ai' | 'unanswered';
}

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UpdateSectionRequest<K extends SectionKey = SectionKey> {
  section: K;
  value: PortfolioData[K];
}

export interface AnswerQuestionRequest {
  answer: string;
  addToFaq: boolean;
}
