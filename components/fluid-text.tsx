'use client';

import { useState } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'div' | 'p';

type FluidTextProps = {
  text: string;
  tag?: Tag;
};

// Internal viewBox width in user units (arbitrary; the SVG scales to the
// container). AVG_ADVANCE is roughly Nohemi's average glyph advance as a
// fraction of the font size — it only sets the *starting* size so that
// textLength's stretch stays tiny.
const VIEW_W = 1000;
const AVG_ADVANCE = 0.5;
// Vertical-only stretch applied to the glyphs (1 = none). Keep it subtle.
const STRETCH_Y = 1.05;

/**
 * A single line of text that fills its container's width, computed entirely at
 * render time — no measuring, no effects, no resize handler, no flash. The SVG
 * `textLength` forces the line to exactly fill the viewBox width, and the SVG
 * scales to the container as a vector (so it also reflows on resize for free).
 * Clicking a letter erases it: it turns transparent and stops catching pointer
 * events, so anything layered beneath (e.g. the home page nav) becomes
 * clickable through the gap. Unclicked glyphs opt back in via visiblePainted,
 * so a parent can be pointer-events-none without disabling them.
 */
export default function FluidText({ text, tag: Tag = 'div' }: FluidTextProps) {
  const [clicked, setClicked] = useState<ReadonlySet<number>>(() => new Set());

  const letters = Array.from(text);
  const n = Math.max(letters.length, 1);

  // Pick a font size so the natural line width lands near VIEW_W; textLength
  // then absorbs the small per-string difference. viewBox height tracks the
  // font size, giving the title a consistent width:height ratio.
  const fontSize = VIEW_W / (n * AVG_ADVANCE);
  const viewH = fontSize * STRETCH_Y;
  const baseline = fontSize * 0.78;

  return (
    <Tag className="m-0 leading-none">
      <svg
        role="img"
        aria-label={text}
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
      >
        <text
          x="0"
          y={baseline}
          transform={`scale(1 ${STRETCH_Y})`}
          textLength={VIEW_W}
          lengthAdjust="spacingAndGlyphs"
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
