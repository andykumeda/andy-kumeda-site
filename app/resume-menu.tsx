'use client';

import { useEffect, useRef } from 'react';

function ExternalArrow() { return <span aria-hidden="true">↗</span>; }

export function ResumeMenu({ label = 'Résumé' }: { label?: string }) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const menu = menuRef.current;
      if (menu?.open && !menu.contains(event.target as Node)) menu.open = false;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !menuRef.current?.open) return;
      menuRef.current.open = false;
      menuRef.current.querySelector('summary')?.focus();
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <details className="resume-menu" ref={menuRef}>
      <summary>{label} <span aria-hidden="true">⌄</span></summary>
      <div className="resume-menu-panel">
        <a href="/andy-kumeda-resume.pdf" target="_blank" rel="noreferrer">View PDF <ExternalArrow /></a>
        <a href="/andy-kumeda-resume.docx" download>Download DOCX ↓</a>
        <a href="/andy-kumeda-resume.md" download>Download Markdown ↓</a>
      </div>
    </details>
  );
}
