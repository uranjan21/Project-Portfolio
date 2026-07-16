import type { SectionKey } from '../../../shared/types';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number' // rendered as input[type=number]
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
      { key: 'links.github', label: 'GitHub URL', type: 'text' },
      { key: 'links.linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'links.twitter', label: 'Twitter/X URL', type: 'text' },
      { key: 'links.website', label: 'Website URL', type: 'text' },
      { key: 'stats', label: 'Hero stats', type: 'pairs', hint: 'One per line: Label | Value (e.g. "Years of experience | 5+")' },
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
      { key: 'description', label: 'Description', type: 'textarea' },
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
