import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';
import PostLightbox from '@/components/post-lightbox';
import { getPostSlugs, getPostSource } from '@/lib/posts';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getPostSource(slug);
    return { title: frontmatter.title, description: frontmatter.description };
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!getPostSlugs().includes(slug)) {
    notFound();
  }

  // Import the post as an MDX module. Components (<PostImage>, <Vimeo>) resolve
  // via the root mdx-components.tsx; frontmatter via remark-mdx-frontmatter.
  const { default: Content } = await import(`../../../content/posts/${slug}.mdx`);
  const { frontmatter } = getPostSource(slug);
  const mobileTitles = frontmatter.titleMobile ?? [frontmatter.title];

  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text={frontmatter.title} tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          {mobileTitles.map((line, i) => (
            <FluidText key={i} text={line} tag="h1" />
          ))}
        </div>
      </div>

      <PostLightbox>
        <Content />
      </PostLightbox>

      <HomeLink />
    </div>
  );
}
