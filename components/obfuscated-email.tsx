'use client';

import { useEffect, useState } from 'react';
import FluidText from '@/components/fluid-text';

type ObfuscatedEmailProps = {
  /** Char codes of the address, joined with commas. */
  codes: string;
};

/**
 * Renders an email address only on the client, decoded from char codes, so it
 * never appears in the static HTML for scrapers. Ported from contact.astro.
 * The decoded address is drawn with FluidText so it scales to fill its
 * container like the site's titles. Until the effect runs (server render and
 * first client paint) `email` is empty, so nothing is emitted for scrapers.
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

  if (!email) return null;

  return <FluidText text={email} tag="p" />;
}
