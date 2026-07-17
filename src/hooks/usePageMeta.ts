import { useEffect } from 'react';

/**
 * Sets document.title (and meta description) for client-side navigation.
 * Crawlers get the same values server-rendered by server/seo.ts.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
