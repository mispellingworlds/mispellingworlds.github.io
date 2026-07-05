'use client';

import { useEffect, useState } from 'react';

type ObfuscatedEmailProps = {
  /** Char codes of the address, joined with commas. */
  codes: string;
};

/**
 * Renders an email address only on the client, decoded from char codes, so it
 * never appears in the static HTML for scrapers. Ported from contact.astro.
 */
export default function ObfuscatedEmail({ codes }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(
      codes
        .split(',')
        .map(Number)
        .map((n) => String.fromCharCode(n))
        .join(''),
    );
  }, [codes]);

  return (
    <p
      className="m-0 inline-block text-center font-nohemi text-[5vw] font-bold [text-rendering:optimizeLegibility]"
      style={{ visibility: email ? 'visible' : 'hidden' }}
    >
      {email}
    </p>
  );
}
