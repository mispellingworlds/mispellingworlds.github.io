import Link from 'next/link';

type HomeLinkProps = {
  /** "footer" pins to the bottom of the master-stack; "header" sits on top. */
  as?: 'header' | 'footer';
};

/**
 * The grey cursive "home" link. Combines Header.astro and Footer.astro, which
 * were identical but for the wrapping element.
 */
export default function HomeLink({ as = 'footer' }: HomeLinkProps) {
  const link = (
    <div className="flex w-full flex-none justify-center pt-12 pb-2">
      <Link
        href="/"
        // No `relative bottom` lift: it used to pull the ink up out of its
        // box, which left the word sitting high with empty space under it.
        // The box is the same either way, so sitting low costs no page height.
        className="font-cursive text-[2rem] leading-[2] text-ink no-underline md:text-[3rem]"
      >
        home
      </Link>
    </div>
  );

  if (as === 'header') {
    // The cursive swashes reach well above the line box, so the header needs
    // extra top padding to keep them on screen.
    return <header className="h-[25vh] pt-8 md:pt-12">{link}</header>;
  }
  // overflow-clip: the cursive descenders paint below the line box, and this
  // box is the last thing on the page — that stray ink counts as scrollable
  // overflow and puts a scrollbar on pages that otherwise fit exactly one
  // screen. The old `relative bottom` lift avoided it by pulling the whole
  // word up; clipping keeps the word where it sits and drops only the sliver
  // that was already past the bottom edge.
  return <footer className="mt-auto overflow-clip">{link}</footer>;
}
