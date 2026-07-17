import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ContactMessage, PortfolioData, SectionKey, UnansweredQuestion } from '../shared/types';
import { SECTION_KEYS } from '../shared/types';
import { seedData } from './seed';

interface Database {
  portfolio: PortfolioData;
  questions: UnansweredQuestion[];
  messages: ContactMessage[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR ?? path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let db: Database;

function load(): Database {
  if (fs.existsSync(DB_FILE)) {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as Database;
    // Backfill sections added after the db file was first written.
    for (const key of SECTION_KEYS) {
      if (parsed.portfolio[key] === undefined) {
        (parsed.portfolio as unknown as Record<string, unknown>)[key] = seedData[key];
      }
    }
    // Nested profile fields added after the db file was first written.
    parsed.portfolio.profile.seo ??= structuredClone(seedData.profile.seo);
    parsed.questions ??= [];
    parsed.messages ??= [];
    return parsed;
  }
  return { portfolio: structuredClone(seedData), questions: [], messages: [] };
}

function persist(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

db = load();
persist();

export function getPortfolio(): PortfolioData {
  return db.portfolio;
}

export function updateSection<K extends SectionKey>(section: K, value: PortfolioData[K]): void {
  db.portfolio[section] = value;
  persist();
}

export function getQuestions(): UnansweredQuestion[] {
  return db.questions;
}

export function addQuestion(question: string): UnansweredQuestion {
  const entry: UnansweredQuestion = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question,
    askedAt: new Date().toISOString(),
    status: 'open',
  };
  db.questions.unshift(entry);
  // Keep the inbox bounded.
  if (db.questions.length > 500) db.questions.length = 500;
  persist();
  return entry;
}

export function resolveQuestion(
  id: string,
  status: 'answered' | 'dismissed',
  answer?: string,
): UnansweredQuestion | undefined {
  const entry = db.questions.find((q) => q.id === id);
  if (!entry) return undefined;
  entry.status = status;
  if (answer) entry.answer = answer;
  persist();
  return entry;
}

export function getMessages(): ContactMessage[] {
  return db.messages;
}

export function addMessage(input: Omit<ContactMessage, 'id' | 'sentAt' | 'read'>): ContactMessage {
  const entry: ContactMessage = {
    ...input,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sentAt: new Date().toISOString(),
    read: false,
  };
  db.messages.unshift(entry);
  if (db.messages.length > 500) db.messages.length = 500;
  persist();
  return entry;
}

export function markMessageRead(id: string): ContactMessage | undefined {
  const entry = db.messages.find((m) => m.id === id);
  if (!entry) return undefined;
  entry.read = true;
  persist();
  return entry;
}

export function addFaq(question: string, answer: string): void {
  db.portfolio.faqs.push({
    id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question,
    answer,
  });
  persist();
}
