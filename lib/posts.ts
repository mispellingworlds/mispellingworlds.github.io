import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export type PostFrontmatter = {
  title: string;
  description?: string;
  pubDate: string;
  /** Optional split title for narrow screens. */
  titleMobile?: string[];
};

export type PostMeta = {
  slug: string;
  frontmatter: PostFrontmatter;
};

function normalizeDate(value: unknown): string {
  // gray-matter parses unquoted YAML dates into Date objects.
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return new Date(String(value)).toISOString().split('T')[0];
}

/** "2026-04-21" → "april 21st" for display. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const monthName = new Date(Date.UTC(year, month - 1, day))
    .toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
    .toLowerCase();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? 'th'
      : ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : day % 10];
  return `${monthName} ${day}${suffix}`;
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

export function getPostSource(slug: string): { content: string; frontmatter: PostFrontmatter } {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(raw);
  return {
    content,
    frontmatter: { ...(data as PostFrontmatter), pubDate: normalizeDate(data.pubDate) },
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => ({ slug, frontmatter: getPostSource(slug).frontmatter }))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).valueOf() -
        new Date(a.frontmatter.pubDate).valueOf(),
    );
}
