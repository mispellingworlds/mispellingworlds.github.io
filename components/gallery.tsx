'use client';

import { useEffect, useState } from 'react';

type GalleryProps = {
  images: string[];
};

/**
 * Masonry grid of thumbnails with a click-to-zoom lightbox overlay.
 * Ported from Gallery.astro. Uses plain <img> (static export, full-size
 * assets already shipped) so columns can flow naturally.
 */
export default function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState<string | null>(null);

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <>
      <div className="mx-auto w-4/5 columns-2 gap-[30px] md:columns-3">
        {images.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt="drawing"
            onClick={() => setActive(src)}
            className="mb-[30px] block w-full cursor-pointer break-inside-avoid object-contain transition-transform duration-200 ease-out hover:scale-105"
          />
        ))}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[9999] flex touch-none items-center justify-center bg-paper/[0.98]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active}
            alt="full view"
            className="max-h-[95vh] max-w-[95vw] object-contain shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
          />
        </div>
      )}
    </>
  );
}
