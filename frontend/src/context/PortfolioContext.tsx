import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { PortfolioData, SectionKey } from '../types/portfolio';
import { api } from '../api/client';

const TOKEN_KEY = 'portfolio-admin-token';

interface PortfolioContextValue {
  data: PortfolioData | null;
  error: string | null;
  /** Admin session token, or null when browsing as a visitor. */
  token: string | null;
  isAdmin: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  /** Persist a section edit to the server and refresh local state. */
  saveSection: <K extends SectionKey>(section: K, value: PortfolioData[K]) => Promise<void>;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));

  const refresh = useCallback(async () => {
    try {
      setData(await api.getPortfolio());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (password: string) => {
    const { token: newToken } = await api.login(password);
    sessionStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const saveSection = useCallback(
    async <K extends SectionKey>(section: K, value: PortfolioData[K]) => {
      if (!token) throw new Error('Not authenticated');
      try {
        const updated = await api.updateSection(token, section, value);
        setData(updated);
      } catch (err) {
        // An expired token surfaces as a 401 — drop back to visitor mode.
        if (err instanceof Error && err.message.includes('authentication')) {
          logout();
        }
        throw err;
      }
    },
    [token, logout],
  );

  return (
    <PortfolioContext.Provider
      value={{ data, error, token, isAdmin: token !== null, login, logout, saveSection, refresh }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside <PortfolioProvider>');
  return ctx;
}
