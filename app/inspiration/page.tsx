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
            text="inspirations"
            tag="h1"
          />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="inspirations" tag="h1" />
        </div>
      </div>

      <div className="text-content">
        <ul className="list-disc pl-6 marker:text-ink">
          {LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-cursive text-[2.1rem] text-ink no-underline md:text-[2.8rem]"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <HomeLink />
    </div>
  );
}
