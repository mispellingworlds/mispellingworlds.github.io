import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import { formatDate, getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'posts',
  description: 'ive thought about this at one moment in time',
  alternates: { canonical: '/posts/' },
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="ive thought about this at one moment in time" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="ive thought about this" tag="h1" />
          <FluidText text="at one moment in time" tag="h1" />
        </div>
      </div>

      {/* Full-bleed rows, alternating white-on-black and black-on-white so the
          list reads as a stack of bands (same idiom as the home page's
          latest-post bar). */}
      <ul className="mt-2 flex w-full list-none flex-col p-0 md:mt-4">
        {posts.map((post, i) => {
          const dark = i % 2 === 0;
          return (
            <li key={post.slug} className="w-full">
              <Link
                href={`/posts/${post.slug}`}
                // Asymmetric on purpose: the cursive date's ascenders and
                // swashes reach well above its (leading-none) line box, so the
                // top needs enough room to keep that ink inside the band —
                // outside it, white-on-black text is painted on white page and
                // reads as a chopped-off letter. The title below only has
                // descenders to clear, so the bottom stays tight and the gap
                // between one title and the next date stays near the 2.5rem
                // the list had before the bands.
                // min-h + centering, not a hard height: long titles wrap to
                // two lines on narrow screens (and only some of them do), so
                // the floor is the two-line height and the shorter rows pad
                // out to match it. The padding stays as the minimum breathing
                // room; any slack beyond it is split evenly above and below.
                className={`flex min-h-[9rem] w-full flex-col justify-center px-[1%] pt-8 pb-3 text-center no-underline md:min-h-[8.5rem] md:pt-9 ${
                  dark ? 'bg-ink text-paper' : 'bg-paper text-ink'
                }`}
              >
                <span className="block font-cursive text-[2rem] italic leading-none md:text-[2.5rem]">
                  {formatDate(post.frontmatter.pubDate)}
                </span>
                <span className="block font-nohemi text-[1.5rem] font-bold leading-tight md:text-[2rem]">
                  {post.frontmatter.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <HomeLink />
    </div>
  );
}
