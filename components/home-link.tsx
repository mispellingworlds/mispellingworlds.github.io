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
        // leading-[0.5] halves the layout box so the font's tall ascender and
        // descender areas overflow visually instead of taking up page height;
        // relative-bottom lifts the ink back up since the box hugs the page end.
        className="relative bottom-4 font-cursive text-[2rem] leading-[2] text-ink no-underline md:bottom-8 md:text-[3rem]"
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
  return <footer className="mt-auto">{link}</footer>;
}
