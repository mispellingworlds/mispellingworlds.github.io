'use client';

import { useEffect, useState } from 'react';
import type { ResponsiveImage } from '@/lib/image-manifest';

type GalleryProps = {
  images: ResponsiveImage[];
};

/**
 * Thumbnails render at roughly a third of a 4/5-width container on desktop and
 * a half of it on mobile (minus the 30px gaps), so the browser can pick a much
 * smaller rung than the full-size file.
 */
const THUMB_SIZES = '(max-width: 768px) 40vw, 26vw';

/** Images above the fold in either column count; the rest stay lazy. */
const EAGER_COUNT = 4;

/**
 * Masonry grid of thumbnails with a click-to-zoom lightbox overlay.
 * Ported from Gallery.astro. Uses plain <img> (static export, no image server)
 * pointed at the derivatives from scripts/optimize-images.mjs.
 *
 * CSS multi-column fills column-by-column (all of col 1 top→bottom, then
 * col 2), so reading order runs vertically. To get row-major order while
 * keeping masonry (variable heights, no cropping), we deal the images
 * round-robin into N flex columns: image i goes to column i % N, so
 * consecutive images land side by side across a row.
 */
export default function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState<ResponsiveImage | null>(null);
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

  const columns: { image: ResponsiveImage; index: number }[][] = Array.from(
    { length: columnCount },
    () => []
  );
  images.forEach((image, index) => columns[index % columnCount].push({ image, index }));

  return (
    <>
      <div className="mx-auto flex w-4/5 gap-[30px]">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-1 flex-col gap-[30px]">
            {column.map(({ image, index }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.src}
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.srcSet ? THUMB_SIZES : undefined}
                alt="drawing"
                // Intrinsic size reserves the slot before the file arrives, so
                // the column doesn't reflow as thumbnails stream in.
                width={image.width}
                height={image.height}
                loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
                fetchPriority={index < EAGER_COUNT ? 'high' : undefined}
                decoding="async"
                // Warm the full-size file before the click lands.
                onPointerEnter={() => {
                  const preload = new Image();
                  preload.src = image.full;
                }}
                onClick={() => setActive(image)}
                className="block w-full cursor-pointer object-contain transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  backgroundImage: image.blur ? `url("${image.blur}")` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
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
            src={active.full}
            alt="full view"
            decoding="async"
            className="max-h-[95vh] max-w-[95vw] object-contain shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
            style={{
              backgroundImage: active.blur ? `url("${active.blur}")` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      )}
    </>
  );
}
