import { useEffect } from 'react';

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://utsavranjan.info').replace(/\/$/, '');

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Sets per-route SEO tags: <title>, description, canonical, Open Graph and
 * Twitter Card. Mutations are made directly in <head> so a prerender/crawler
 * captures them in the served HTML (no server render needed).
 */
export function usePageMeta(title: string, description?: string, image?: string) {
  useEffect(() => {
    document.title = title;
    const url = SITE_URL + window.location.pathname;

    upsertLink('canonical', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:url', url);
    upsertMeta('name', 'twitter:title', title);

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }
    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('name', 'twitter:image', image);
      upsertMeta('name', 'twitter:card', 'summary_large_image');
    }
  }, [title, description, image]);
}
