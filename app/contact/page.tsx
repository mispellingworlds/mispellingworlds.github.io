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
      <div className="flex flex-1 flex-col items-center justify-center">
        <ObfuscatedEmail codes={codes} />
      </div>

      <HomeLink />
    </div>
  );
}
