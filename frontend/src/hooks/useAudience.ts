import { useCallback, useMemo, useState } from 'react';
import type { AudiencePitch } from '../../shared/types';

const STORAGE_KEY = 'portfolio-audience';

/**
 * Which visitor type is browsing (recruiter / client / engineer / …).
 * Resolution order: ?for= query param (shareable links like /?for=client),
 * then localStorage, then the first configured audience.
 */
export function useAudience(audiences: AudiencePitch[]) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('for');
    if (fromQuery) return fromQuery;
    return localStorage.getItem(STORAGE_KEY);
  });

  const audience = useMemo(() => {
    return audiences.find((a) => a.id === selectedId) ?? audiences[0];
  }, [audiences, selectedId]);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return { audience, select };
}
