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
                  className="relative z-10 text-[1.5rem] font-bold text-ink no-underline md:text-[2rem]"
                >
                  {post.frontmatter.title}
                </Link>
                {/* On md+ the date is absolutely positioned off the title's
                    right edge: takes no layout space, so its size never affects
                    the list's vertical rhythm and it may overlap neighbours.
                    On mobile that would push it off-screen (widening the iOS
                    layout viewport), so it flows inline after the title. */}
                <span className="ml-3 whitespace-nowrap font-cursive text-[1.4rem] italic leading-none text-ink md:absolute md:left-full md:top-1/2 md:ml-4 md:-translate-y-1/2 md:text-[2.5rem]">
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
