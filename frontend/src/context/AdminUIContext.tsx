import { createContext, useContext } from 'react';
import type { SectionKey } from '../../shared/types';

export interface AdminUIValue {
  /** Returns an edit handler for the section when admin, undefined otherwise. */
  editFor: (section: SectionKey) => (() => void) | undefined;
  openLogin: () => void;
}

export const AdminUIContext = createContext<AdminUIValue>({
  editFor: () => undefined,
  openLogin: () => {},
});

export function useAdminUI(): AdminUIValue {
  return useContext(AdminUIContext);
}
