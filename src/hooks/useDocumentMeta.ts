import { useEffect } from 'react';

const SITE_URL = 'https://mushfique-portfolio.vercel.app';

interface DocumentMeta {
  title: string;
  description: string;
  /** Route path, e.g. '/mechanical'. Becomes the canonical and og:url. */
  path: string;
}

/** Upsert a `<meta>` by name or property, creating it if index.html doesn't have one. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets per-page title, description, canonical, and Open Graph tags.
 *
 * index.html is a single static shell, so without this every route would share the
 * home page's title and canonical — which collapses all five URLs into one as far as
 * search engines and link previews are concerned.
 *
 * Deliberately dependency-free: this is a dozen lines of DOM work and does not justify
 * pulling in a head-management library.
 */
export function useDocumentMeta({ title, description, path }: DocumentMeta) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path]);
}
