import type { Metadata } from 'next';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = { title: 'Inspirations' };

const LINKS = [
  { url: 'https://waiting-all-my.life/', title: '7038634357' },
  { url: 'https://store.steampowered.com/app/650700/Yume_Nikki/', title: 'Yume Nikki' },
  { url: 'https://www.instagram.com/dg_bladee/', title: 'Bladee' },
  { url: 'https://edglrd.com/', title: 'EDGLRD' },
  { url: 'https://www.instagram.com/tulpess/', title: 'Tulpess' },
  { url: 'https://x.com/LIL_ICEBUNNY', title: 'James Ferraro' },
  { url: 'https://rothko.nga.gov/', title: 'Mark Rothko' },
];

export default function InspirationPage() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText
            text="ive got a portal in my portable computer"
            tag="h1"
          />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="ive got a portal in my" tag="h1" />
          <FluidText text="portable computer     " tag="h1" />
        </div>
        
      </div>
      <br></br>
      <div className="text-content flex flex-col items-center gap-24 text-center leading-none">
        {LINKS.map((link) => (
          <span key={link.url} className="relative inline-block">
            {/* A larger cursive echo of the title, centred behind the link.
                Purely decorative: aria-hidden keeps it out of the accessibility
                tree (the real link already announces the name), and
                pointer-events-none / select-none mean clicks and drag-selection
                pass straight through to the link on top. whitespace-nowrap lets
                it overflow the link's box symmetrically instead of wrapping. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-10 select-none whitespace-nowrap font-cursive text-[2rem] leading-none text-grey-meta md:text-[3rem]"
            >
              {link.title}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-nohemi text-[2.1rem] font-bold text-ink no-underline md:text-[2.8rem]"
            >
              {link.title}
            </a>
          </span>
        ))}
      </div>

      <HomeLink />
    </div>
  );
}
