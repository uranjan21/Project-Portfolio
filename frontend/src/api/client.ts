import type {
  AnswerQuestionRequest,
  ChatResponse,
  ContactMessage,
  LoginResponse,
  PortfolioData,
  SectionKey,
  UnansweredQuestion,
} from '../types/portfolio';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  budget?: string;
  message: string;
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init);
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

  sendContact: (payload: ContactPayload) =>
    request<{ ok: boolean }>('/api/contact', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),

  getMessages: (token: string) =>
    request<ContactMessage[]>('/api/admin/messages', { headers: authHeaders(token) }),

  markMessageRead: (token: string, id: string) =>
    request<ContactMessage>(`/api/admin/messages/${id}/read`, {
      method: 'POST',
      headers: authHeaders(token),
    }),
};

export const RESUME_URL = '/api/resume.pdf';
