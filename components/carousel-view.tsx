'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResponsiveImage } from '@/lib/image-manifest';

export type Slide = {
  image: ResponsiveImage;
  alt: string;
  caption?: string;
};

type CarouselViewProps = {
  slides: Slide[];
  /** `sizes` hint computed server-side from the width props. */
  sizes?: string;
  /** Desktop width of the whole carousel, e.g. "80%". */
  size: string;
  /** Width below 768px. */
  mobileSize: string;
  /** Seconds between automatic advances. 0 (the default) means manual only. */
  autoplay: number;
};

/** A swipe has to travel this far (px) before it counts as a navigation. */
const SWIPE_THRESHOLD = 40;

/**
 * Only slides within this distance of the current one are mounted, so a nine
 * image carousel doesn't fire nine requests the moment it scrolls into view.
 * Once mounted a slide stays mounted — going back is then instant.
 */
const PRELOAD_RADIUS = 1;

/** Above this many slides the dots turn into a plain "[ 3 / 20 ]" counter. */
const DOT_LIMIT = 12;

/**
 * Frame aspect ratio: the *tallest* image in the set, so switching slides never
 * changes the carousel's height (shorter ones letterbox inside it). Undefined
 * when the manifest hasn't run yet and no dimensions are known — the frame then
 * takes its height from the image itself.
 */
function frameRatio(slides: Slide[]): string | undefined {
  const ratios = slides
    .map(({ image }) => (image.width && image.height ? image.width / image.height : null))
    .filter((r): r is number => r !== null);
  return ratios.length ? String(Math.min(...ratios)) : undefined;
}

/**
 * Slideshow for a set of post images: one visible at a time, with arrows, dots,
 * swipe and arrow keys. Slides cross-fade in place rather than sliding, which
 * keeps the markup free of transform math and reads calmly next to the text.
 *
 * Each <img> carries data-full, so a click still opens the post lightbox
 * (components/post-lightbox.tsx) on the largest derivative — except after a
 * swipe, where the trailing click is swallowed.
 */
export default function CarouselView({
  slides,
  sizes,
  size,
  mobileSize,
  autoplay,
}: CarouselViewProps) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(() => new Set<number>([0]));
  const [paused, setPaused] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const count = slides.length;
  const ratio = frameRatio(slides);

  const go = (index: number) => setActive(((index % count) + count) % count);

  // Mount the neighbours of whatever is showing, keeping everything already
  // mounted. A plain Set mutation wouldn't re-render, hence the copy.
  useEffect(() => {
    setMounted((previous) => {
      const next = new Set(previous);
      for (let offset = -PRELOAD_RADIUS; offset <= PRELOAD_RADIUS; offset += 1) {
        next.add((((active + offset) % count) + count) % count);
      }
      return next.size === previous.size ? previous : next;
    });
  }, [active, count]);

  // Autoplay, opt-in. Pauses while the pointer or focus is on the carousel, and
  // stays off entirely for readers who asked for reduced motion.
  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), autoplay * 1000);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, count]);

  return (
    <figure
      className="post-image mx-auto my-10 block first:mt-0"
      style={
        {
          width: 'var(--post-image-size)',
          '--post-image-size': size,
          '--post-image-mobile-size': mobileSize,
        } as React.CSSProperties
      }
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* The arrows sit in the page margin beside the reading column: the row
          is pulled out by exactly one arrow lane on each side, so the image
          itself still spans the full column. Below md there's no margin to
          borrow, so the lanes stay inside and the image gives up the width. */}
      <div className="flex w-full items-center [--arrow-lane:1.8rem] md:mx-[calc(var(--arrow-lane)*-1)] md:w-auto md:[--arrow-lane:2.9rem]">
        {count > 1 && <Arrow direction="prev" onClick={() => go(active - 1)} />}

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={`${count} images`}
          tabIndex={0}
          className="relative min-w-0 flex-1 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-grey-meta"
          style={{ aspectRatio: ratio }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(active - 1);
            else if (e.key === 'ArrowRight') go(active + 1);
            else return;
            e.preventDefault();
          }}
          onPointerDown={(e) => {
            swipeStart.current = { x: e.clientX, y: e.clientY };
            swiped.current = false;
          }}
          onPointerUp={(e) => {
            const start = swipeStart.current;
            swipeStart.current = null;
            if (!start) return;
            const dx = e.clientX - start.x;
            // Vertical drags are the reader scrolling the page, not a swipe.
            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(e.clientY - start.y)) {
              return;
            }
            swiped.current = true;
            go(active + (dx < 0 ? 1 : -1));
          }}
          // A swipe ends in a click on the image; left alone, that click would
          // bubble up to PostLightbox and open the overlay on the way out.
          onClickCapture={(e) => {
            if (!swiped.current) return;
            swiped.current = false;
            e.stopPropagation();
          }}
        >
          {slides.map(({ image, alt }, index) => {
            const current = index === active;
            if (!mounted.has(index)) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.src}
                src={image.src}
                srcSet={image.srcSet}
                sizes={sizes}
                // The lightbox reads this instead of the rendered src, so the
                // overlay shows the largest derivative.
                data-full={image.full}
                alt={alt}
                width={image.width}
                height={image.height}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                aria-hidden={!current}
                className={[
                  ratio ? 'absolute inset-0 h-full w-full object-contain' : 'w-full',
                  'transition-opacity duration-300 ease-out',
                  current ? 'opacity-100' : 'pointer-events-none opacity-0',
                  // Without a known ratio the frame has no height of its own, so
                  // the inactive slides have to leave the flow entirely.
                  !ratio && !current ? 'hidden' : '',
                ].join(' ')}
                style={{
                  backgroundImage: image.blur ? `url("${image.blur}")` : undefined,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            );
          })}
        </div>

        {count > 1 && <Arrow direction="next" onClick={() => go(active + 1)} />}
      </div>

      <figcaption className="mt-3 flex flex-col items-center gap-2 text-center text-[0.9rem] leading-tight text-grey-meta [hyphens:none]">
        {slides[active].caption ? <span>{slides[active].caption}</span> : null}

        {count > 1 &&
          // Past a dozen slides the dots get too small to aim at, so the
          // position is spelled out instead — bracketed like the citations.
          (count > DOT_LIMIT ? (
            <span className="font-google tabular-nums">
              [ {active + 1} / {count} ]
            </span>
          ) : (
            <span className="flex items-center gap-[9px]">
              {slides.map((slide, index) => (
                <button
                  key={slide.image.src}
                  type="button"
                  onClick={() => go(index)}
                  aria-label={`image ${index + 1} of ${count}`}
                  aria-current={index === active}
                  // Filled black for the slide you're on, hollow (paper with a
                  // black rim) for the rest. No hover state: the dots read as a
                  // position marker, not a row of buttons.
                  className={`h-[11px] w-[11px] rounded-full border-2 border-ink ${
                    index === active ? 'bg-ink' : 'bg-paper'
                  }`}
                />
              ))}
            </span>
          ))}
      </figcaption>
    </figure>
  );
}

/**
 * Navigation arrow, one lane wide: a solid black triangle, drawn rather than
 * set as a text glyph (the body face's arrows are far too light to hold their
 * own out in the margin). Static — no hover state, like the dots.
 */
function Arrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const prev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? 'previous image' : 'next image'}
      className="flex w-[var(--arrow-lane)] flex-none select-none items-center justify-center self-center text-ink"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[1.7rem] w-[1.7rem] md:h-[2.6rem] md:w-[2.6rem]"
        fill="currentColor"
      >
        <polygon points={prev ? '17 2 5 12 17 22' : '7 2 19 12 7 22'} />
      </svg>
    </button>
  );
}
