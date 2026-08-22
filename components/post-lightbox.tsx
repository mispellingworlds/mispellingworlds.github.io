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
            const img = target as HTMLImageElement;
            // PostImage stashes the largest derivative here; `src` is whichever
            // srcset rung the browser picked, which can be far too small.
            setActive(img.dataset.full ?? img.src);
          }
        }}
        // Fetch the full-size file while the pointer is still on the image, so
        // the overlay usually opens on an already-cached bitmap.
        onPointerOver={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'IMG') return;
          const full = (target as HTMLImageElement).dataset.full;
          if (full) new Image().src = full;
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
            decoding="async"
            className="max-h-[95vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </>
  );
}
