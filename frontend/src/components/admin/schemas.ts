import type { SectionKey } from '../../types/portfolio';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number' // rendered as input[type=number]
  | 'boolean' // rendered as a Yes/No select
  | 'tags' // string[] edited as comma-separated text
  | 'lines' // string[] edited as one-entry-per-line textarea
  | 'pairs'; // {label,value}[] edited as "label | value" lines

export interface FieldSpec {
  /** Dot-path into the edited object, e.g. "links.github". */
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
}

interface BaseSchema {
  section: SectionKey;
  title: string;
  fields: FieldSpec[];
}

export interface ObjectSchema extends BaseSchema {
  kind: 'object';
}

export interface CollectionSchema extends BaseSchema {
  kind: 'collection';
  /** Prefix for generated ids of new items, e.g. "prj". */
  idPrefix: string;
  /** Field whose value labels an item in the list view. */
  labelKey: string;
}

export type SectionSchema = ObjectSchema | CollectionSchema;

export const SECTION_SCHEMAS: Record<SectionKey, SectionSchema> = {
  profile: {
    kind: 'object',
    section: 'profile',
    title: 'Edit Profile',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'title', label: 'Title / Role', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text', hint: 'Optional — shown on the contact page' },
      { key: 'photoUrl', label: 'Portrait photo URL', type: 'text', hint: 'Optional — the hero shows your initials until this is set' },
      { key: 'links.github', label: 'GitHub URL', type: 'text' },
      { key: 'links.linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'links.twitter', label: 'Twitter/X URL', type: 'text' },
      { key: 'links.website', label: 'Website URL', type: 'text' },
      { key: 'stats', label: 'Hero stats', type: 'pairs', hint: 'One per line: Label | Value (e.g. "Years of experience | 5+")' },
      { key: 'seo.metaDescription', label: 'SEO meta description', type: 'textarea', hint: 'Shown in Google results under your name — ~155 characters, lead with who you are and what you offer' },
      { key: 'seo.keywords', label: 'SEO keywords', type: 'tags', hint: 'Comma-separated search phrases, e.g. "Utsav Ranjan, hire full stack developer"' },
      { key: 'seo.ogImage', label: 'Social preview image URL', type: 'text', hint: 'Absolute URL; shown when the site is shared on social media' },
    ],
  },
  audiences: {
    kind: 'collection',
    section: 'audiences',
    title: 'Edit visitor pitches',
    idPrefix: 'aud',
    labelKey: 'label',
    fields: [
      { key: 'label', label: 'Switcher button label', type: 'text', hint: 'e.g. HIRING FOR A TEAM' },
      { key: 'headline', label: 'Headline', type: 'text', hint: 'The one-line promise for this visitor type' },
      { key: 'pitch', label: 'Pitch paragraph', type: 'textarea', hint: 'Answer "why you" for this visitor in 2-3 sentences' },
      { key: 'valueProps', label: 'Value propositions', type: 'lines', hint: 'One per line, format: "Title — supporting detail"' },
      { key: 'ctaLabel', label: 'CTA button text', type: 'text' },
      { key: 'ctaHref', label: 'CTA link', type: 'text', hint: 'e.g. /api/resume.pdf, mailto:…, or https://…' },
    ],
  },
  testimonials: {
    kind: 'collection',
    section: 'testimonials',
    title: 'Edit testimonials',
    idPrefix: 'tst',
    labelKey: 'author',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', hint: 'Real quotes only — specific results beat generic praise' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'role', label: 'Author role / company', type: 'text' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
    ],
  },
  services: {
    kind: 'collection',
    section: 'services',
    title: 'Edit services',
    idPrefix: 'svc',
    labelKey: 'title',
    fields: [
      { key: 'title', label: 'Service title', type: 'text' },
      { key: 'emoji', label: 'Icon emoji', type: 'text', hint: 'One emoji, e.g. 🖥️' },
      { key: 'summary', label: 'Card summary', type: 'textarea', hint: 'One sentence shown on cards and in Google results' },
      { key: 'description', label: 'Details page description', type: 'textarea', hint: 'Blank line = new paragraph' },
      { key: 'deliverables', label: 'What the client gets', type: 'lines', hint: 'One deliverable per line' },
      { key: 'tech', label: 'Tech', type: 'tags', hint: 'Comma-separated' },
    ],
  },
  pricing: {
    kind: 'collection',
    section: 'pricing',
    title: 'Edit pricing plans',
    idPrefix: 'plan',
    labelKey: 'name',
    fields: [
      { key: 'name', label: 'Plan name', type: 'text', hint: 'e.g. Hourly, Per project, Monthly retainer' },
      { key: 'price', label: 'Price', type: 'text', hint: 'e.g. $60 or From $2,500' },
      { key: 'unit', label: 'Unit', type: 'text', hint: 'e.g. / hour, / project, / month' },
      { key: 'features', label: 'What’s included', type: 'lines', hint: 'One per line' },
      { key: 'highlighted', label: 'Highlighted plan?', type: 'boolean', hint: 'The emphasised (amber) card — pick one' },
    ],
  },
  ventures: {
    kind: 'collection',
    section: 'ventures',
    title: 'Edit ventures (Beyond the code)',
    idPrefix: 'vnt',
    labelKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text', hint: 'e.g. The Creator Journey' },
      { key: 'emoji', label: 'Icon emoji', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'live', label: 'Launched?', type: 'boolean', hint: 'Off = shown as “coming soon”' },
      { key: 'url', label: 'Link when live', type: 'text', hint: 'Channel / product URL' },
    ],
  },
  blogPosts: {
    kind: 'collection',
    section: 'blogPosts',
    title: 'Edit blog posts',
    idPrefix: 'post',
    labelKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'slug', label: 'URL slug', type: 'text', hint: 'Lowercase-with-dashes; the post lives at /blog/<slug>' },
      { key: 'date', label: 'Date', type: 'text', hint: 'YYYY-MM-DD' },
      { key: 'tags', label: 'Tags', type: 'tags', hint: 'Comma-separated' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', hint: 'Shown on cards and in Google results' },
      { key: 'content', label: 'Content', type: 'textarea', hint: 'Blank line = paragraph, "## " = heading, "- " = bullet' },
      { key: 'coverUrl', label: 'Cover image URL', type: 'text', hint: 'Optional' },
    ],
  },
  skills: {
    kind: 'collection',
    section: 'skills',
    title: 'Edit Skills',
    idPrefix: 'sk',
    labelKey: 'name',
    fields: [
      { key: 'name', label: 'Skill name', type: 'text' },
      { key: 'emoji', label: 'Emoji', type: 'text', hint: 'Single emoji icon for this skill' },
      { key: 'category', label: 'Category', type: 'text', hint: 'e.g. Frontend, Backend, Data, Infrastructure' },
      { key: 'level', label: 'Level (0-100)', type: 'number' },
    ],
  },
  experiences: {
    kind: 'collection',
    section: 'experiences',
    title: 'Edit Experience',
    idPrefix: 'exp',
    labelKey: 'company',
    fields: [
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'period', label: 'Period', type: 'text', hint: 'e.g. 2021 — Present' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'highlights', label: 'Highlights', type: 'lines', hint: 'One bullet point per line' },
      { key: 'tech', label: 'Tech', type: 'tags', hint: 'Comma-separated' },
    ],
  },
  projects: {
    kind: 'collection',
    section: 'projects',
    title: 'Edit Projects',
    idPrefix: 'prj',
    labelKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tag', label: 'Tag', type: 'text', hint: 'e.g. Web App, AI Tool' },
      { key: 'coverUrl', label: 'Cover image URL', type: 'text', hint: 'Optional — screenshot shown on cards & detail page' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'details', label: 'Details (Markdown)', type: 'textarea', hint: 'Long-form case study. "## " = heading, "- " = bullet' },
      { key: 'tech', label: 'Tech', type: 'tags', hint: 'Comma-separated' },
      { key: 'liveUrl', label: 'Live demo URL', type: 'text' },
      { key: 'repoUrl', label: 'Repository URL', type: 'text' },
    ],
  },
  education: {
    kind: 'collection',
    section: 'education',
    title: 'Edit Education',
    idPrefix: 'edu',
    labelKey: 'institution',
    fields: [
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'detail', label: 'Detail', type: 'textarea' },
    ],
  },
  achievements: {
    kind: 'collection',
    section: 'achievements',
    title: 'Edit Achievements',
    idPrefix: 'ach',
    labelKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  faqs: {
    kind: 'collection',
    section: 'faqs',
    title: 'Edit FAQ (chat assistant knowledge)',
    idPrefix: 'faq',
    labelKey: 'question',
    fields: [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
    ],
  },
};
