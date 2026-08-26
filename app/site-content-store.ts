import { useEffect, useState } from 'react';
import { defaultSiteContent, type SiteContent } from './site-content';

export const SITE_CONTENT_KEY = 'andy-kumeda-site-content';

export function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent;
  try { return { ...defaultSiteContent, ...JSON.parse(window.localStorage.getItem(SITE_CONTENT_KEY) || '{}') }; } catch { return defaultSiteContent; }
}

export function saveSiteContent(content: SiteContent) { window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content)); }

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  useEffect(() => {
    const timer = window.setTimeout(() => setContent(loadSiteContent()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return content;
}
