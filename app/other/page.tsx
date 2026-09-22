import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import Rule from '@/components/rule';

export const metadata: Metadata = {
  title: 'other',
  description: 'other.',
  alternates: { canonical: '/other/' },
};

export default function OtherPage() {
  return (
    // no-scrollbar-gutter: the page doesn't scroll, and the rules have to
    // reach the screen edge — the reserved gutter would leave a strip of
    // white beside them (same reason the home page uses it).
    <div className="master-stack no-scrollbar-gutter">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="every single thing has a part in everything" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="every single thing has" tag="h1" />
          <FluidText text="a part in everything   " tag="h1" />
        </div>
      </div>

      {/* flex-1 + justify-between instead of fixed margins between the blocks:
          the sections and rules are only ~500px of real content, so the
          leftover height is shared out between them and the page ends exactly
          at the bottom of the viewport on any screen tall enough to hold it.
          The rules are siblings of the reading columns, not children, so they
          span the full width while the text stays in its 65ch measure.
          `between` rather than `evenly` because the height here is fixed: the
          only way to give the bands more room is to stop spending any of it
          above the first rule and below the last, which is why those two now
          sit flush against the title and the home link. */}
      <div className="flex w-full flex-1 flex-col justify-between">
        <Rule />

        <div className="text-content py-4 text-center">
          <Link
            href="/inspiration"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            inspirations
          </Link>
          <p>unique/oblique visions, sources of creativity, resonant world-views.</p>
        </div>

        <Rule />

        <div className="text-content py-4 text-center">
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

        <Rule />

        <div className="text-content py-4 text-center">
          <Link
            href="/contact"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            contact me
          </Link>
          <p>@ my email address.</p>
        </div>

        <Rule />
      </div>

      <HomeLink />
    </div>
  );
}
