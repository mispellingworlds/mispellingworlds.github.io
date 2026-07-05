import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = { title: 'Images' };

export default function ImagesPage() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="i want to become an image in your mind" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="i want to become an" tag="h1" />
          <FluidText text="image in your mind    " tag="h1" />
        </div>
      </div>

      <div className="text-content">
        <ul className="list-disc pl-6 marker:text-ink">
          <li>
            <Link
              href="/drawings"
              className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
            >
              drawings
            </Link>
          </li>
          axiomatic doodling, b/w pointillism, emotional formalism. scanned from
          my 12,7 x 8,6 cm notebook.
        </ul>

        <ul className="mt-12 list-disc pl-6 marker:text-ink">
          <li>
            <Link
              href="/screenshots"
              className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
            >
              screenshots
            </Link>
          </li>
          taking a screenshot is the 2D equivalent of shooting a camera. it can
          be seen as a way to capture peculiarities, crystallize memories and
          give images new meaning.
        </ul>
      </div>

      <HomeLink />
    </div>
  );
}
