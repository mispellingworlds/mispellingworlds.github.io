import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import Rule from '@/components/rule';

export const metadata: Metadata = {
  title: 'images',
  description: 'i want to become an image in your mind',
  alternates: { canonical: '/images/' },
};

export default function ImagesPage() {
  return (
    // no-scrollbar-gutter: the page doesn't scroll, and the rules have to
    // reach the screen edge — the reserved gutter would leave a strip of
    // white beside them (same reason the home page uses it).
    <div className="master-stack no-scrollbar-gutter">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="i want to become an image in your mind" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="i want to become an" tag="h1" />
          <FluidText text="image in your mind    " tag="h1" />
        </div>
      </div>

      {/* Same scaffold as /other: flex-1 + justify-between shares the leftover
          height between the blocks instead of spending it on fixed margins, so
          the page ends exactly at the bottom of the viewport. The rules are
          siblings of the reading columns, not children, so they span the full
          width while the text stays in its 65ch measure. */}
      <div className="flex w-full flex-1 flex-col justify-between">
        <Rule />

        <div className="text-content py-4 text-center">
          <Link
            href="/drawings"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            drawings
          </Link>
          <p>
            axiomatic doodling, b/w pointillism, emotional formalism. scanned from
            my 12,7 x 8,6 cm notebook.
          </p>
        </div>

        <Rule />

        <div className="text-content py-4 text-center">
          <Link
            href="/screenshots"
            className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
          >
            screenshots
          </Link>
          <p>
            taking a screenshot is the 2D equivalent of shooting a camera. it can
            be seen as a way to capture peculiarities, crystallize memories and
            give images new meaning.
          </p>
        </div>

        <Rule />
      </div>

      <HomeLink />
    </div>
  );
}
