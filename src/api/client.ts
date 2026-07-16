import type {
  AnswerQuestionRequest,
  ChatResponse,
  LoginResponse,
  PortfolioData,
  SectionKey,
  UnansweredQuestion,
} from '../../shared/types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

const jsonHeaders = { 'Content-Type': 'application/json' };
const authHeaders = (token: string) => ({ ...jsonHeaders, Authorization: `Bearer ${token}` });

export const api = {
  getPortfolio: () => request<PortfolioData>('/api/portfolio'),

  chat: (message: string) =>
    request<ChatResponse>('/api/chat', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ message }),
    }),

  login: (password: string) =>
    request<LoginResponse>('/api/admin/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ password }),
    }),

  updateSection: <K extends SectionKey>(token: string, section: K, value: PortfolioData[K]) =>
    request<PortfolioData>('/api/admin/portfolio', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ section, value }),
    }),

  getQuestions: (token: string) =>
    request<UnansweredQuestion[]>('/api/admin/questions', { headers: authHeaders(token) }),

  answerQuestion: (token: string, id: string, payload: AnswerQuestionRequest) =>
    request<UnansweredQuestion>(`/api/admin/questions/${id}/answer`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }),

  dismissQuestion: (token: string, id: string) =>
    request<UnansweredQuestion>(`/api/admin/questions/${id}/dismiss`, {
      method: 'POST',
      headers: authHeaders(token),
    }),
};

export const RESUME_URL = '/api/resume.pdf';
