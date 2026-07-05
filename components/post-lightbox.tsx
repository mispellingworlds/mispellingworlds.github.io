'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Wraps post content and opens a full-screen lightbox when any image inside is
 * clicked. Ported from the inline script in MarkdownPostLayout.astro, using
 * event delegation so it covers images rendered by MDX.
 */
export default function PostLightbox({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <>
      <div
        ref={ref}
        className="text-content"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'IMG') {
            setActive((target as HTMLImageElement).src);
          }
        }}
      >
        {children}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-paper/[0.98]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active}
            alt="full view"
            className="max-h-[95vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
