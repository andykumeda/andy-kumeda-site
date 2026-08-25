'use client';

import { useEffect, useState } from 'react';

const showAfterScroll = 500;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > showAfterScroll);
    }

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible) return null;
  return <a className="back-to-top" href="#top" aria-label="Back to top">↑</a>;
}
