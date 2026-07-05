import Link from 'next/link';
import ReactDOM from 'react-dom';
import FluidText from '@/components/fluid-text';
import RandomStar from '@/components/random-star';

const NAV = [
  { href: '/posts', label: 'Posts' },
  { href: '/images', label: 'Images' },
  { href: '/about', label: 'About' },
  { href: '/other', label: 'Other' },
];

export default function HomePage() {
  // The star font is only used on this page, so it's preloaded here rather
  // than in the layout (same pattern as PRELOAD_FONTS in app/layout.tsx).
  ReactDOM.preload('/fonts/90stars.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return (
    <div className="master-stack">
      {/* The nav hides underneath the title; erase a letter (click it) to
          reach the link behind it. The title layer is pointer-events-none so
          only the still-visible glyphs catch clicks. */}
      <div className="relative mb-52 md:mb-52">
        <div className="text-section pointer-events-none relative z-10">
          <div className="hidden md:block">
            <FluidText text="ive wasted 2 much time so now im making space" tag="h1" />
          </div>
          <div className="flex flex-col gap-2 md:hidden">
            <FluidText text="ive wasted 2 much time" tag="h1" />
            <FluidText text="so now im making space" tag="h1" />
          </div>
        </div>

        <nav className="absolute inset-x-0 bottom-0 flex translate-y-[90px] flex-row flex-wrap justify-center gap-x-4 gap-y-0 px-2 md:gap-14 md:px-0">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-cursive text-[1.6rem] lowercase text-ink no-underline md:text-[4rem]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Fixed height so the layout doesn't shift while the star picks itself
          after hydration.  */}
      <div className="flex h-[26vh] w-full flex-none items-center justify-center md:h-[40vh]">
        <RandomStar />
      </div>
    </div>
  );
}
