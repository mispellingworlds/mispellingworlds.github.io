import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import Rule from '@/components/rule';
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

      {/* Same separators as /images and /other: one above the list and one
          after every entry, so each post sits in its own band. No flex-1 +
          justify-between here — that scaffold exists to fill a single screen,
          and this list is long enough to scroll on its own. */}
      <div className="mt-2 flex w-full flex-col md:mt-4">
        <Rule />

        {posts.map((post) => (
          <Fragment key={post.slug}>
            <div className="text-content flex flex-col items-center py-4 text-center">
              <span className="pointer-events-none select-none font-cursive text-[2rem] italic leading-none text-ink md:text-[2.5rem]">
                {formatDate(post.frontmatter.pubDate)}
              </span>
              <Link
                href={`/posts/${post.slug}`}
                className="text-[1.5rem] font-bold text-ink no-underline md:text-[2rem]"
              >
                {post.frontmatter.title}
              </Link>
            </div>

            <Rule />
          </Fragment>
        ))}
      </div>

      <HomeLink />
    </div>
  );
}
