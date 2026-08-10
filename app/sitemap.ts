import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

// Required by `output: 'export'` — the sitemap must render once at build time.
export const dynamic = 'force-static';

const BASE_URL = 'https://cartografia.xyz';

// Every static route on the site. Trailing slashes are mandatory: with
// `trailingSlash: true` the slash-less URLs are 301s on GitHub Pages, and a
// sitemap must list the URLs that answer 200.
const STATIC_PATHS = [
  '/',
  '/posts/',
  '/images/',
  '/about/',
  '/other/',
  '/contact/',
  '/drawings/',
  '/screenshots/',
  '/inspiration/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}/`,
    lastModified: post.frontmatter.pubDate,
  }));

  return [...pages, ...posts];
}
