'use client';

import { useEffect, useState } from 'react';

type GalleryProps = {
  images: string[];
};

/**
 * Masonry grid of thumbnails with a click-to-zoom lightbox overlay.
 * Ported from Gallery.astro. Uses plain <img> (static export, full-size
 * assets already shipped).
 *
 * CSS multi-column fills column-by-column (all of col 1 top→bottom, then
 * col 2), so reading order runs vertically. To get row-major order while
 * keeping masonry (variable heights, no cropping), we deal the images
 * round-robin into N flex columns: image i goes to column i % N, so
 * consecutive images land side by side across a row.
 */
export default function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(3);

  // 2 columns below the md breakpoint, 3 at/above it.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setColumnCount(mq.matches ? 3 : 2);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  images.forEach((src, i) => columns[i % columnCount].push(src));

  return (
    <>
      <div className="mx-auto flex w-4/5 gap-[30px]">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-1 flex-col gap-[30px]">
            {column.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="drawing"
                loading="lazy"
                decoding="async"
                onClick={() => setActive(src)}
                className="block w-full cursor-pointer object-contain transition-transform duration-200 ease-out hover:scale-105"
              />
            ))}
          </div>
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
