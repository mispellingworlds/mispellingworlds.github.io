'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'div' | 'p';

type FluidTextProps = {
  text: string;
  tag?: Tag;
};

// Starting guess for the line width in user units, replaced by the measured
// width after mount. AVG_ADVANCE is roughly Nohemi's average glyph advance as
// a fraction of the font size — it only affects the pre-measurement frame (and
// the server-rendered HTML), so it just needs to be in the right ballpark.
const EST_W = 1000;
const AVG_ADVANCE = 0.5;
// Vertical-only stretch applied to the glyphs (1 = none). Keep it subtle.
const STRETCH_Y = 1.05;

/**
 * A single line of text that fills its container's width. The text renders at
 * a fixed font size inside an SVG whose viewBox matches the line's width, so
 * fitting the container is pure vector scaling (and reflows on resize for
 * free). An earlier version used `textLength` to force the fit without any
 * measuring, but Chrome and WebKit ignore textLength when the text is split
 * into per-letter tspans (which click-to-erase needs), so long lines rendered
 * at natural width and were clipped by the viewBox. Instead the real width is
 * measured with getComputedTextLength in a layout effect and fed back into the
 * viewBox; until then (and in the server HTML) a per-letter estimate is used.
 * Clicking a letter erases it: it turns transparent and stops catching pointer
 * events, so anything layered beneath (e.g. the home page nav) becomes
 * clickable through the gap. Unclicked glyphs opt back in via visiblePainted,
 * so a parent can be pointer-events-none without disabling them.
 */
export default function FluidText({ text, tag: Tag = 'div' }: FluidTextProps) {
  const [clicked, setClicked] = useState<ReadonlySet<number>>(() => new Set());
  const [measuredW, setMeasuredW] = useState<number | null>(null);
  const textRef = useRef<SVGTextElement>(null);

  const letters = Array.from(text);
  const n = Math.max(letters.length, 1);

  // Fixed font size from the estimate; the measurement adjusts the viewBox,
  // not the font size, so the text element never has to re-render.
  const fontSize = EST_W / (n * AVG_ADVANCE);
  const viewH = fontSize * STRETCH_Y;
  const baseline = fontSize * 0.78;
  const viewW = measuredW ?? EST_W;

  useLayoutEffect(() => {
    const measure = () => {
      const w = textRef.current?.getComputedTextLength() ?? 0;
      if (w > 0) setMeasuredW(w);
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
      >
        <text
          ref={textRef}
          x="0"
          y={baseline}
          transform={`scale(1 ${STRETCH_Y})`}
          fontSize={fontSize}
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
      </svg>
    </Tag>
  );
}
