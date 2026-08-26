'use client';

import { useEffect, useMemo, useState } from 'react';
import { contentSections, defaultSiteContent, type SiteContent } from './site-content';
import { loadSiteContent, saveSiteContent } from './site-content-store';

// This route is local-only; plain anchors avoid a Vinext dev-runtime hook error.
/* eslint-disable @next/next/no-html-link-for-pages */

type Field = { path: string; label: string; value: string };
function fieldsFor(value: unknown, path = ''): Field[] {
  if (typeof value === 'string') return [{ path, label: path.split('.').pop()?.replace(/([A-Z])/g, ' $1') || path, value }];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => fieldsFor(child, path ? `${path}.${key}` : key));
}
function setAt(content: SiteContent, path: string, value: string): SiteContent {
  const next = structuredClone(content) as SiteContent; let target: Record<string, unknown> = next as Record<string, unknown>;
  const parts = path.split('.'); const last = parts.pop()!;
  for (const part of parts) target = target[part] as Record<string, unknown>;
  target[last] = value; return next;
}

export function SiteEditor() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [saved, setSaved] = useState(false);
  const [publishToken, setPublishToken] = useState('');
  const [publishState, setPublishState] = useState('');
  const fields = useMemo(() => fieldsFor(content), [content]);
  useEffect(() => {
    const timer = window.setTimeout(() => setContent(loadSiteContent()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  function update(path: string, value: string) { setContent((current) => setAt(current, path, value)); setSaved(false); }
  function save() { saveSiteContent(content); setSaved(true); }
  function reset() { setContent(defaultSiteContent); saveSiteContent(defaultSiteContent); setSaved(true); }
  function exportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'andy-kumeda-site-content.json'; link.click(); URL.revokeObjectURL(url);
  }
  async function publish() {
    if (!publishToken || !window.confirm('Run lint, build, commit, push to GitHub, and deploy this site to production?')) return;
    setPublishState('Publishing…');
    try {
      const response = await fetch('/__site_publish', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-site-publish-token': publishToken }, body: JSON.stringify({ content }) });
      const result = await response.json() as { ok?: boolean; branch?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'Publish failed.');
      setPublishState(`Published from ${result.branch}.`);
    } catch (error) { setPublishState(error instanceof Error ? error.message : 'Publish failed.'); }
  }
  return <main className="editor-shell">
    <header className="editor-header"><div><p className="eyebrow">Site editor</p><h1>Shape the words.</h1><p>Edit the visible copy, save a local draft, and preview the result on the site.</p></div><div className="editor-actions"><a href="/">View site ↗</a><button onClick={exportJson}>Export JSON</button><button className="editor-save" onClick={save}>{saved ? 'Saved locally' : 'Save draft'}</button><label className="editor-token"><span>Local publish token</span><input type="password" value={publishToken} onChange={(event) => setPublishToken(event.target.value)} autoComplete="off" placeholder="SITE_PUBLISH_TOKEN" /></label><button className="editor-publish" onClick={publish} disabled={!publishToken || publishState === 'Publishing…'}>Push to production</button>{publishState && <small className="editor-publish-status" role="status">{publishState}</small>}</div></header>
    <div className="editor-layout"><section className="editor-fields" aria-label="Editable website copy">{contentSections.map((section) => <div className="editor-section" key={section.id}><div className="editor-section-heading"><span>{section.label}</span><small>{fields.filter((field) => field.path.startsWith(`${section.id}.`)).length} fields</small></div>{fields.filter((field) => field.path.startsWith(`${section.id}.`)).map((field) => <label className="editor-field" key={field.path}><span>{field.label}</span><textarea value={field.value} onChange={(event) => update(field.path, event.target.value)} rows={field.value.length > 100 ? 4 : 2} /></label>)}</div>)}<button className="editor-reset" onClick={reset}>Reset all copy to the published defaults</button></section><aside className="editor-preview"><div className="preview-window"><div className="preview-bar"><span>Live copy preview</span><span className="preview-dot" /></div><div className="preview-card"><p className="eyebrow">{content.hero.eyebrow}</p><h2>{content.hero.name.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{content.hero.deck}</p><a href="/">Open the site ↗</a></div><div className="preview-copy"><p className="eyebrow">{content.running.eyebrow}</p><h3>{content.running.heading}</h3><p>{content.running.bodyOne}</p></div></div><p className="editor-help">Changes are stored in this browser only. Export the JSON when you want to hand the copy back to the site source.</p></aside></div>
  </main>;
}
