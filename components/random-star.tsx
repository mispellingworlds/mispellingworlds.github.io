'use client';

import { useEffect, useState } from 'react';

// Every codepoint in /fonts/90stars.woff2 with a drawn glyph — the font maps
// ASCII to hand-drawn stars, so any one of these renders as a star. (", ' and
// ` are mapped but blank, so they're left out.)
const STAR_CHARS =
  '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}';

const STAR_ID = 'random-star';

// Runs inline while the HTML streams in, so the star is already picked at
// first paint instead of waiting for the bundle to download and hydrate. The
// page is statically exported, so the pick can't happen at render time (a
// render-time Math.random() would mismatch the prerendered HTML) — the
// prerendered span is empty and this fills it pre-paint.
const PICK_SCRIPT = `(function () {
  var s = document.getElementById(${JSON.stringify(STAR_ID)});
  var c = ${JSON.stringify(STAR_CHARS)};
  if (s && !s.textContent) s.textContent = c[Math.floor(Math.random() * c.length)];
})();`;

// Always returns a char different from `prev`, so a click visibly changes.
function pickStar(prev: string): string {
  let next = prev;
  while (next === prev) {
    next = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
  }
  return next;
}

export default function RandomStar() {
  // On the server this is '' (matching the empty prerendered span); during
  // hydration the initializer reads back whatever PICK_SCRIPT already put in
  // the DOM, so React adopts the pre-paint pick instead of clobbering it.
  const [char, setChar] = useState(() =>
    typeof document === 'undefined'
      ? ''
      : document.getElementById(STAR_ID)?.textContent ?? '',
  );

  // Fallback for the rare case the inline script didn't run (e.g. blocked).
  useEffect(() => {
    setChar((prev) => (prev === '' ? pickStar('') : prev));
  }, []);

  return (
    <>
      <span
        id={STAR_ID}
        aria-hidden
        suppressHydrationWarning
        onClick={() => setChar(pickStar(char))}
        className="cursor-pointer select-none font-stars text-[22vh] leading-none text-ink md:text-[36vh]"
      >
        {char}
      </span>
      <script dangerouslySetInnerHTML={{ __html: PICK_SCRIPT }} />
    </>
  );
}
