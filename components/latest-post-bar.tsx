import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

/**
 * Full-width black band pinned to the bottom of the home page, linking to
 * the most recent post. Set in the title font (Nohemi bold) at roughly the
 * size the fluid heading renders at, in white on black.
 */
export default function LatestPostBar() {
  const [latest] = getAllPosts();
  if (!latest) return null;

  return (
    <Link
      href={`/posts/${latest.slug}`}
      className="mt-auto block w-full flex-none bg-ink px-[1%] py-3 text-center font-nohemi text-[1.5rem] font-bold leading-none text-paper no-underline md:py-4 md:text-[3rem]"
    >
      <span className="italic">latest post: </span>[ {latest.frontmatter.title}<span> ]</span>
    </Link>
  );
}
