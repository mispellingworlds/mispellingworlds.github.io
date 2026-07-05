import type { Metadata } from 'next';
import Link from 'next/link';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import { formatDate, getAllPosts } from '@/lib/posts';

export const metadata: Metadata = { title: 'Posts' };

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

      <div className="text-content">
        <ul className="list-disc pl-6 marker:text-ink">
          {posts.map((post) => (
            <li key={post.slug}>
              <span className="relative">
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative z-10 text-[2rem] font-bold text-ink no-underline md:text-[2rem]"
                >
                  {post.frontmatter.title}
                </Link>
                {/* Absolutely positioned off the title's right edge: takes no
                    layout space, so the date's size never affects the list's
                    vertical rhythm and it may overlap neighbours. */}
                <span className="absolute left-full top-[80%] ml-4 -translate-y-1/2 whitespace-nowrap font-cursive text-[1.8rem] italic leading-none text-ink md:top-1/2 md:text-[2.5rem]">
                  {formatDate(post.frontmatter.pubDate)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <HomeLink />
    </div>
  );
}
