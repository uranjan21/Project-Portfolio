import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AudiencePitch, Project, Service, Skill } from '../types/portfolio';
import { usePortfolio } from './PortfolioContext';

const STORAGE_KEY = 'portfolio-audience';
const DISMISSED_KEY = 'portfolio-audience-dismissed';

interface AudienceContextValue {
  audiences: AudiencePitch[];
  /** The active pitch — an explicit choice, or the first configured one. */
  audience: AudiencePitch | undefined;
  /** True once the visitor has explicitly picked an audience (via dialog, switcher, or ?for= link). */
  hasChosen: boolean;
  /** Whether the "who's visiting?" dialog should be showing. */
  dialogOpen: boolean;
  /** Reopen the dialog later (e.g. the footer's "Viewing as" control). */
  openDialog: () => void;
  select: (id: string) => void;
  /** Close the welcome dialog without picking; won't be asked again. */
  dismiss: () => void;
}

const AudienceContext = createContext<AudienceContextValue | null>(null);

/**
 * Which visitor type is browsing (recruiter / client / engineer / …).
 * Resolution order: ?for= query param (shareable links like /?for=client),
 * then localStorage, then the first configured audience. Global so every
 * page — not just the Home hero — can tailor its content.
 */
export function AudienceProvider({ children }: { children: ReactNode }) {
  const { data } = usePortfolio();
  const audiences = useMemo(() => data?.audiences ?? [], [data]);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('for');
    if (fromQuery) return fromQuery;
    return localStorage.getItem(STORAGE_KEY);
  });
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) !== null);
  const [manualOpen, setManualOpen] = useState(false);

  const audience = useMemo(
    () => audiences.find((a) => a.id === selectedId) ?? audiences[0],
    [audiences, selectedId],
  );

  const select = useCallback((id: string) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const dismiss = useCallback(() => {
    setManualOpen(false);
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, '1');
  }, []);

  const openDialog = useCallback(() => setManualOpen(true), []);

  // A valid ?for= link or a previous visit counts as an answer.
  const needsChoice =
    audiences.length > 0 && !dismissed && !audiences.some((a) => a.id === selectedId);
  const dialogOpen = manualOpen || needsChoice;

  const hasChosen = selectedId !== null || dismissed;

  const value = useMemo(
    () => ({ audiences, audience, hasChosen, dialogOpen, openDialog, select, dismiss }),
    [audiences, audience, hasChosen, dialogOpen, openDialog, select, dismiss],
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience(): AudienceContextValue {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used inside <AudienceProvider>');
  return ctx;
}

/**
 * Case-insensitive test: does one focus tag appear in any of the haystacks?
 * Short tags ("AI") must match a whole token, otherwise "AI" would hit
 * "Tailwind" and "FastAPI"; longer tags also match as substrings so
 * "Enterprise" hits "Enterprise · UX".
 */
function tagMatches(tag: string, haystacks: string[]): boolean {
  const t = tag.trim().toLowerCase();
  if (!t) return false;
  const tokens = haystacks.flatMap((h) => h.toLowerCase().split(/[^a-z0-9+#.]+/)).filter(Boolean);
  if (tokens.includes(t)) return true;
  return t.length > 3 && haystacks.join(' ').toLowerCase().includes(t);
}

/**
 * Stable rank: items with MORE matching focus tags come first (not a binary
 * hit/miss split — with broad tags everything matches at least one, and the
 * ordering wouldn't differentiate between audiences). Ties keep admin order.
 */
function rankByFocus<T>(items: T[], tags: string[], haystacks: (item: T) => string[]): T[] {
  if (tags.length === 0) return items;
  return items
    .map((item, i) => ({ item, i, score: tags.filter((t) => tagMatches(t, haystacks(item))).length }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.item);
}

/** Projects most relevant to the audience's focus tags come first. */
export function focusProjects(projects: Project[], audience?: AudiencePitch): Project[] {
  return rankByFocus(projects, audience?.focusTags ?? [], (p) => [p.tag, ...p.tech]);
}

/** Services most relevant to the audience's focus tags come first. */
export function focusServices(services: Service[], audience?: AudiencePitch): Service[] {
  return rankByFocus(services, audience?.focusTags ?? [], (s) => [s.title, ...s.tech]);
}

/** Skills most relevant to the audience's focus tags come first. */
export function focusSkills(skills: Skill[], audience?: AudiencePitch): Skill[] {
  return rankByFocus(skills, audience?.focusTags ?? [], (s) => [s.name, s.category]);
}
