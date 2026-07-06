'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'div' | 'p';

type FluidTextProps = {
  text: string;
  tag?: Tag;
};

// Per-character advance widths of Nohemi at weight 700 (500 face + synthetic
// bold), in em units, measured once via canvas measureText in Chrome. The
// server-rendered width is the per-string sum of these, exact up to kerning
// (≲1%, and kerning only ever makes the real line *narrower*), so the first
// paint already looks right and the post-hydration measurement is an
// imperceptible touch-up rather than a visible jump.
// prettier-ignore
const ADVANCES: Record<string, number> = {
  ' ': 0.229, '!': 0.219, '"': 0.3603, '#': 0.772, '$': 0.6603, '%': 0.8812,
  '&': 0.7238, "'": 0.2013, '(': 0.3498, ')': 0.3498, '*': 0.47, '+': 0.546,
  ',': 0.218, '-': 0.5272, '.': 0.218, '/': 0.4368,
  '0': 0.712, '1': 0.4595, '2': 0.6495, '3': 0.6747, '4': 0.727, '5': 0.671,
  '6': 0.6877, '7': 0.612, '8': 0.6945, '9': 0.6877,
  ':': 0.218, ';': 0.218, '<': 0.5723, '=': 0.546, '>': 0.5723, '?': 0.6205,
  '@': 0.9557,
  A: 0.7085, B: 0.6773, C: 0.7345, D: 0.682, E: 0.5557, F: 0.5463, G: 0.7462,
  H: 0.682, I: 0.2087, J: 0.6228, K: 0.6753, L: 0.535, M: 0.9175, N: 0.7218,
  O: 0.7472, P: 0.6693, Q: 0.747, R: 0.6813, S: 0.6603, T: 0.6135, U: 0.694,
  V: 0.6865, W: 1.0913, X: 0.6945, Y: 0.6817, Z: 0.6332,
  '[': 0.28, '\\': 0.4368, ']': 0.28, '^': 0.4377, '_': 0.5777, '`': 0.27,
  a: 0.5935, b: 0.6085, c: 0.5823, d: 0.6085, e: 0.584, f: 0.4213, g: 0.6085,
  h: 0.586, i: 0.1975, j: 0.1975, k: 0.5843, l: 0.1975, m: 0.925, n: 0.586,
  o: 0.597, p: 0.6085, q: 0.6085, r: 0.4118, s: 0.5515, t: 0.4113, u: 0.586,
  v: 0.5835, w: 0.923, x: 0.6212, y: 0.5833, z: 0.5335,
  '{': 0.374, '|': 0.1953, '}': 0.374, '~': 0.5905,
  'à': 0.5935, 'è': 0.584, 'é': 0.584, 'ì': 0.2235, 'ò': 0.597, 'ù': 0.586,
  '’': 0.2542,
};
// For characters not in the table (rare); roughly a lowercase letter.
const FALLBACK_ADVANCE = 0.6;

// Font size in SVG user units. Arbitrary, since the viewBox scales to the
// container; it just sets the scale the widths are computed at.
const FONT_SIZE = 100;
// Vertical-only stretch applied to the glyphs (1 = none). Keep it subtle.
const STRETCH_Y = 1.05;

/**
 * A single line of text that fills its container's width. The text renders at
 * a fixed font size inside an SVG whose viewBox matches the line's width, so
 * fitting the container is pure vector scaling (and reflows on resize for
 * free). An earlier version used `textLength` to force the fit without any
 * measuring, but Chrome and WebKit ignore textLength when the text is split
 * into per-letter tspans (which click-to-erase needs), so long lines rendered
 * at natural width and were clipped by the viewBox. Instead the width is
 * summed from ADVANCES for the server HTML and first paint, then confirmed
 * with getComputedTextLength in a layout effect (kerning and cross-browser
 * shaping differences make the sum fractionally wide).
 * Clicking a letter erases it: it turns transparent and stops catching pointer
 * events, so anything layered beneath (e.g. the home page nav) becomes
 * clickable through the gap. Unclicked glyphs opt back in via visiblePainted,
 * so a parent can be pointer-events-none without disabling them.
 * WebKit only applies pointer-events at the <text> level, never on tspans, so
 * on iOS the tspans can't opt out of the parent's pointer-events-none and taps
 * do nothing. Each unerased letter therefore also gets an invisible <rect>
 * over its glyph cell (measured via getExtentOfChar once the font is in) —
 * rects are real graphics elements that every engine hit-tests individually.
 */
export default function FluidText({ text, tag: Tag = 'div' }: FluidTextProps) {
  const [clicked, setClicked] = useState<ReadonlySet<number>>(() => new Set());
  const [measuredW, setMeasuredW] = useState<number | null>(null);
  const [extents, setExtents] = useState<
    readonly { x: number; y: number; width: number; height: number }[] | null
  >(null);
  const textRef = useRef<SVGTextElement>(null);

  const letters = Array.from(text);

  const estimatedW = letters.reduce(
    (w, char) => w + (ADVANCES[char] ?? FALLBACK_ADVANCE) * FONT_SIZE,
    0,
  );
  const viewH = FONT_SIZE * STRETCH_Y;
  const baseline = FONT_SIZE * 0.78;
  const viewW = measuredW ?? estimatedW;

  useLayoutEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      const w = el.getComputedTextLength();
      if (w > 0) setMeasuredW(w);
      try {
        const n = el.getNumberOfChars();
        setExtents(
          Array.from({ length: n }, (_, i) => {
            const r = el.getExtentOfChar(i);
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          }),
        );
      } catch {
        // Hit-testing falls back to the tspans (fine outside WebKit).
      }
    };
    measure();
    // The first measurement may have hit the fallback font; measure again once
    // the webfonts are in (and on any later font load, e.g. display: swap).
    document.fonts.ready.then(measure);
    document.fonts.addEventListener('loadingdone', measure);
    return () => document.fonts.removeEventListener('loadingdone', measure);
  }, [text]);

  return (
    <Tag className="m-0 leading-none">
      <svg
        role="img"
        aria-label={text}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
        // The element's aspect ratio stays pinned to the server-side estimate
        // even after the real width is measured, so the svg never changes
        // height post-hydration. A height change here moves everything below
        // (nav, cursive links), and iOS WebKit repaints moved text without
        // invalidating the ink that overflows the line boxes — the cursive
        // swashes end up sliced into shifted bands. The measured width only
        // rescales the glyphs inside the fixed box via the viewBox (≲1%,
        // imperceptible).
        style={{ aspectRatio: `${estimatedW} / ${viewH}` }}
      >
        <text
          ref={textRef}
          x="0"
          y={baseline}
          transform={`scale(1 ${STRETCH_Y})`}
          fontSize={FONT_SIZE}
          xmlSpace="preserve"
          className="font-nohemi font-bold"
        >
          {letters.map((char, i) => (
            <tspan
              key={i}
              fill={clicked.has(i) ? 'transparent' : '#000000'}
              style={{ pointerEvents: clicked.has(i) ? 'none' : 'visiblePainted' }}
              className={clicked.has(i) ? undefined : 'cursor-pointer'}
              onClick={() => setClicked((prev) => new Set(prev).add(i))}
            >
              {char}
            </tspan>
          ))}
        </text>
        {extents && (
          // Same transform as the text so the extents (reported in the text's
          // pre-transform user space) line up with the drawn glyphs.
          <g transform={`scale(1 ${STRETCH_Y})`}>
            {extents.map((r, i) =>
              // No rect over erased letters (the gap stays click-through) or
              // spaces (nothing painted there to erase).
              clicked.has(i) || letters[i] === ' ' ? null : (
                <rect
                  key={i}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill="transparent"
                  style={{ pointerEvents: 'all' }}
                  className="cursor-pointer"
                  onClick={() => setClicked((prev) => new Set(prev).add(i))}
                />
              ),
            )}
          </g>
        )}
      </svg>
    </Tag>
  );
}
