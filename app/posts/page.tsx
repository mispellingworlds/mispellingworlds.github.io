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
        <ul className="flex flex-col items-center gap-10 text-center">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-col items-center gap-0">
              <span className="font-cursive text-[2rem] italic leading-none text-ink md:text-[2.5rem]">
                {formatDate(post.frontmatter.pubDate)}
              </span>
              <Link
                href={`/posts/${post.slug}`}
                className="-mt-1 text-[1.5rem] font-bold text-ink no-underline md:text-[2rem]"
              >
                {post.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <HomeLink />
    </div>
  );
}
