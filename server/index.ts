import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { AnswerQuestionRequest, ChatRequest, LoginRequest, UpdateSectionRequest } from '../shared/types';
import { SECTION_KEYS } from '../shared/types';
import { issueToken, requireAdmin, verifyPassword } from './auth';
import { answerQuestion } from './chat';
import { addFaq, getPortfolio, getQuestions, resolveQuestion, updateSection } from './db';
import { streamResumePdf } from './resume';

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

// Naive per-IP throttle for the chat endpoint (protects the OpenAI budget).
const chatHits = new Map<string, { count: number; windowStart: number }>();
const CHAT_WINDOW_MS = 60_000;
const CHAT_MAX_PER_WINDOW = 10;

app.post('/api/chat', async (req, res) => {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const hits = chatHits.get(ip);
  if (!hits || now - hits.windowStart > CHAT_WINDOW_MS) {
    chatHits.set(ip, { count: 1, windowStart: now });
  } else if (++hits.count > CHAT_MAX_PER_WINDOW) {
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

// --- Static client (production build) ---

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '../dist');
  app.use(express.static(distDir));
  // SPA fallback for any non-API route.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
