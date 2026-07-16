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
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
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
  testimonials: Testimonial[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  achievements: Achievement[];
  faqs: FaqEntry[];
}

export type SectionKey = keyof PortfolioData;

export const SECTION_KEYS: SectionKey[] = [
  'profile',
  'audiences',
  'testimonials',
  'skills',
  'experiences',
  'projects',
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
