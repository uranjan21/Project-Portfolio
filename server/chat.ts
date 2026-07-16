import type { ChatResponse, FaqEntry, PortfolioData } from '../shared/types';
import { addQuestion, getPortfolio } from './db';
import { notifyOwner } from './notify';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could',
  'will', 'would', 'you', 'your', 'yours', 'i', 'me', 'my', 'we', 'us', 'our', 'it',
  'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'what', 'which', 'who', 'how',
  'when', 'where', 'why', 'be', 'have', 'has', 'had', 'with', 'about', 'tell',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w)),
  );
}

/** Score a question against an FAQ entry: fraction of meaningful query tokens found in the entry. */
function scoreFaq(queryTokens: Set<string>, faq: FaqEntry): number {
  if (queryTokens.size === 0) return 0;
  const faqTokens = tokenize(faq.question + ' ' + faq.answer);
  let hits = 0;
  for (const token of queryTokens) {
    if (faqTokens.has(token)) hits++;
  }
  return hits / queryTokens.size;
}

function matchFaq(message: string): FaqEntry | undefined {
  const queryTokens = tokenize(message);
  let best: { faq: FaqEntry; score: number } | undefined;
  for (const faq of getPortfolio().faqs) {
    const score = scoreFaq(queryTokens, faq);
    if (!best || score > best.score) best = { faq, score };
  }
  return best && best.score >= 0.6 ? best.faq : undefined;
}

function buildContext(data: PortfolioData): string {
  const { profile, audiences, testimonials, skills, experiences, projects, education, achievements, faqs } = data;
  return [
    `Name: ${profile.name}`,
    `Title: ${profile.title}`,
    `Location: ${profile.location}`,
    `Email: ${profile.email}`,
    `Bio: ${profile.bio}`,
    `Links: ${Object.entries(profile.links).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
    '',
    'Value proposition by visitor type (use these to answer "why hire you" style questions):',
    ...audiences.map((a) => `- For ${a.label.toLowerCase()}: ${a.headline} ${a.pitch} Key strengths: ${a.valueProps.join(' ')}`),
    ...(testimonials.length > 0
      ? ['', 'Testimonials:', ...testimonials.map((t) => `- "${t.quote}" — ${t.author}, ${t.role}`)]
      : []),
    '',
    'Skills: ' + skills.map((s) => `${s.name} (${s.category}, ${s.level}/100)`).join('; '),
    '',
    'Experience:',
    ...experiences.map((e) => `- ${e.role} at ${e.company} (${e.period}, ${e.location}). ${e.highlights.join(' ')} Tech: ${e.tech.join(', ')}`),
    '',
    'Projects:',
    ...projects.map((p) => `- ${p.title} [${p.tag}]: ${p.description} Tech: ${p.tech.join(', ')}`),
    '',
    'Education:',
    ...education.map((e) => `- ${e.degree}, ${e.institution} (${e.period})${e.detail ? '. ' + e.detail : ''}`),
    '',
    'Achievements:',
    ...achievements.map((a) => `- ${a.title} (${a.year}): ${a.description}`),
    '',
    'FAQ:',
    ...faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  ].join('\n');
}

const UNKNOWN_SENTINEL = 'UNKNOWN';

async function askOpenAi(message: string): Promise<string | undefined> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return undefined;

  const data = getPortfolio();
  const systemPrompt =
    `You are ${data.profile.name}, speaking in first person on your own portfolio website. ` +
    `Answer the visitor's question in a friendly, concise way (2-4 sentences) using ONLY the portfolio ` +
    `content below. Never invent facts. If the answer is not clearly contained in the content, reply with ` +
    `exactly "${UNKNOWN_SENTINEL}" and nothing else.\n\n--- PORTFOLIO CONTENT ---\n${buildContext(data)}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 300,
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      console.error('[chat] OpenAI error:', res.status, await res.text());
      return undefined;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content?.trim();
    if (!reply || reply === UNKNOWN_SENTINEL) return undefined;
    return reply;
  } catch (err) {
    console.error('[chat] OpenAI request failed:', err);
    return undefined;
  }
}

export async function answerQuestion(message: string): Promise<ChatResponse> {
  // 1. Try the curated FAQ first — free and instant.
  const faq = matchFaq(message);
  if (faq) return { reply: faq.answer, source: 'faq' };

  // 2. Ask OpenAI, grounded in the live portfolio content.
  const aiReply = await askOpenAi(message);
  if (aiReply) return { reply: aiReply, source: 'ai' };

  // 3. No answer available: store it for the owner and notify them.
  addQuestion(message);
  void notifyOwner(message);
  const name = getPortfolio().profile.name.split(' ')[0];
  return {
    reply:
      `Good question — I don't have that answer on hand yet. I've forwarded it to ${name}, ` +
      `and once answered it will show up here. Meanwhile, feel free to email ${getPortfolio().profile.email}.`,
    source: 'unanswered',
  };
}
