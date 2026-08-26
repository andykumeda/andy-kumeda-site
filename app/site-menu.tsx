'use client';

import { useEffect, useRef } from 'react';
import { useSiteContent } from './site-content-store';

export function SiteMenu() {
  const content = useSiteContent();
  const navLinks = [{ href: '#running', label: content.nav.running }, { href: '#work', label: content.nav.work }, { href: '#projects', label: content.nav.projects }, { href: '#interests', label: content.nav.interests }];
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
    <div className="section-menu">
      <nav className="section-menu-links" aria-label="Site sections">
        {navLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>
      <details className="section-menu-mobile" ref={menuRef}>
        <summary aria-label="Open site menu"><span aria-hidden="true">☰</span><span className="section-menu-mobile-label">Menu</span></summary>
        <nav className="section-menu-panel" aria-label="Site sections">
          {navLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
      </details>
    </div>
  );
}
