import type { Metadata } from 'next';
import ObfuscatedEmail from '@/components/obfuscated-email';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = { title: 'Contact' };

const EMAIL = 'mispellingworlds@gmail.com';
const codes = Array.from(EMAIL)
  .map((c) => c.charCodeAt(0))
  .join(',');

export default function ContactPage() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <ObfuscatedEmail codes={codes} />
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/jesterbw.webp"
          alt="jester"
          loading="lazy"
          decoding="async"
          className="max-h-[50vh] w-auto max-w-full object-contain"
        />
      </div>

      <HomeLink />
    </div>
  );
}
