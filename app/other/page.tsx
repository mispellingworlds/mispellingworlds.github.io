import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = { title: 'Other' };

export default function OtherPage() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="every single thing has a part in everything" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="every single thing has" tag="h1" />
          <FluidText text="a part in everything   " tag="h1" />
        </div>
      </div>

      <div className="text-content">
        <div className="text-center">
          <Link
            href="/inspiration"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            inspirations
          </Link>
          <p>unique/oblique visions, sources of creativity, resonant world-views.</p>
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://cartografia.bandcamp.com/music"
            target="_blank"
            rel="noopener noreferrer"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            bandcamp
          </a>
          <p>audio-image materializations.</p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            contact me
          </Link>
          <p>@ my email address.</p>
        </div>
      </div>

      <HomeLink />
    </div>
  );
}
