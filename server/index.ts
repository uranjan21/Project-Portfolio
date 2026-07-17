import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request } from 'express';
import type { AnswerQuestionRequest, ChatRequest, LoginRequest, UpdateSectionRequest } from '../shared/types';
import { SECTION_KEYS } from '../shared/types';
import { issueToken, requireAdmin, verifyPassword } from './auth';
import { answerQuestion } from './chat';
import { addFaq, addMessage, getMessages, getPortfolio, getQuestions, markMessageRead, resolveQuestion, updateSection } from './db';
import { notifyOwner } from './notify';
import { streamResumePdf } from './resume';
import { renderRobotsTxt, renderSeoTags, renderSitemapXml } from './seo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 5177);

const app = express();
app.use(express.json({ limit: '1mb' }));

// --- Public API ---

app.get('/api/portfolio', (_req, res) => {
  res.json(getPortfolio());
});

app.get('/api/resume.pdf', (_req, res) => {
  streamResumePdf(res);
});

// Naive per-IP throttle (protects the OpenAI budget and the contact inbox).
function makeThrottle(maxPerMinute: number) {
  const hits = new Map<string, { count: number; windowStart: number }>();
  return (ip: string): boolean => {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.windowStart > 60_000) {
      hits.set(ip, { count: 1, windowStart: now });
      return true;
    }
    return ++entry.count <= maxPerMinute;
  };
}

const allowChat = makeThrottle(10);
const allowContact = makeThrottle(3);

app.post('/api/chat', async (req, res) => {
  if (!allowChat(req.ip ?? 'unknown')) {
    res.status(429).json({ error: 'Too many messages — give it a minute.' });
    return;
  }

  const { message } = req.body as ChatRequest;
  if (typeof message !== 'string' || !message.trim() || message.length > 1000) {
    res.status(400).json({ error: 'message must be a non-empty string (max 1000 chars)' });
    return;
  }
  res.json(await answerQuestion(message.trim()));
});

app.post('/api/contact', (req, res) => {
  if (!allowContact(req.ip ?? 'unknown')) {
    res.status(429).json({ error: 'Too many submissions — give it a minute.' });
    return;
  }

  const { name, email, phone, interest, budget, message } = req.body as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const cleanName = str(name, 120);
  const cleanEmail = str(email, 200);
  const cleanMessage = str(message, 4000);
  if (!cleanName || !cleanMessage || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400).json({ error: 'name, a valid email, and message are required' });
    return;
  }

  const entry = addMessage({
    name: cleanName,
    email: cleanEmail,
    phone: str(phone, 40) || undefined,
    interest: str(interest, 120) || undefined,
    budget: str(budget, 60) || undefined,
    message: cleanMessage,
  });
  void notifyOwner(
    `Portfolio contact: ${cleanName}`,
    `New message from your portfolio contact form.\n\nFrom: ${cleanName} <${cleanEmail}>${entry.phone ? `\nPhone: ${entry.phone}` : ''}${entry.interest ? `\nInterested in: ${entry.interest}` : ''}${entry.budget ? `\nBudget: ${entry.budget}` : ''}\n\n${cleanMessage}`,
  );
  res.json({ ok: true });
});

// --- Admin API ---

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body as LoginRequest;
  if (typeof password === 'string' && verifyPassword(password)) {
    res.json({ token: issueToken() });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.put('/api/admin/portfolio', requireAdmin, (req, res) => {
  const { section, value } = req.body as UpdateSectionRequest;
  if (!SECTION_KEYS.includes(section)) {
    res.status(400).json({ error: `Unknown section "${section}"` });
    return;
  }
  const isValidShape = section === 'profile' ? typeof value === 'object' && value !== null && !Array.isArray(value) : Array.isArray(value);
  if (!isValidShape) {
    res.status(400).json({ error: `Invalid value shape for section "${section}"` });
    return;
  }
  updateSection(section, value);
  res.json(getPortfolio());
});

app.get('/api/admin/questions', requireAdmin, (_req, res) => {
  res.json(getQuestions());
});

app.post('/api/admin/questions/:id/answer', requireAdmin, (req, res) => {
  const { answer, addToFaq } = req.body as AnswerQuestionRequest;
  if (typeof answer !== 'string' || !answer.trim()) {
    res.status(400).json({ error: 'answer must be a non-empty string' });
    return;
  }
  const entry = resolveQuestion(req.params.id, 'answered', answer.trim());
  if (!entry) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  if (addToFaq) addFaq(entry.question, answer.trim());
  res.json(entry);
});

app.post('/api/admin/questions/:id/dismiss', requireAdmin, (req, res) => {
  const entry = resolveQuestion(req.params.id, 'dismissed');
  if (!entry) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(entry);
});

app.get('/api/admin/messages', requireAdmin, (_req, res) => {
  res.json(getMessages());
});

app.post('/api/admin/messages/:id/read', requireAdmin, (req, res) => {
  const entry = markMessageRead(req.params.id);
  if (!entry) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json(entry);
});

// --- Static client + SEO (production build) ---

// Prefer an explicit SITE_URL for canonical links; fall back to the request host.
function siteUrl(req: Request): string {
  return (process.env.SITE_URL ?? `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(renderRobotsTxt(siteUrl(req)));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(renderSitemapXml(getPortfolio(), siteUrl(req)));
});

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '../dist');
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

  app.use(express.static(distDir, { index: false }));
  // SPA fallback for any non-API route, with route-aware SEO tags rendered
  // from live content.
  app.get('*', (req, res) => {
    res.type('html').send(template.replace(SEO_BLOCK, renderSeoTags(getPortfolio(), siteUrl(req), req.path)));
  });
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
