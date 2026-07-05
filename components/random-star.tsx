'use client';

import { useEffect, useState } from 'react';

// Every codepoint in /fonts/90stars.woff2 with a drawn glyph — the font maps
// ASCII to hand-drawn stars, so any one of these renders as a star. (", ' and
// ` are mapped but blank, so they're left out.)
const STAR_CHARS =
  '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}';

// Always returns a char different from `prev`, so a click visibly changes.
function pickStar(prev: string): string {
  let next = prev;
  while (next === prev) {
    next = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
  }
  return next;
}

export default function RandomStar() {
  // Picked in an effect, not during render: the page is statically exported,
  // so a render-time Math.random() would mismatch the prerendered HTML.
  const [char, setChar] = useState('');

  useEffect(() => {
    setChar(pickStar(''));
  }, []);

  return (
    <span
      aria-hidden
      onClick={() => setChar(pickStar(char))}
      className="cursor-pointer select-none font-stars text-[22vh] leading-none text-ink md:text-[36vh]"
    >
      {char}
    </span>
  );
}
