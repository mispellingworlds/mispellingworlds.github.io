import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (served from /out).
  output: 'export',
  // GitHub Pages has no image optimization server, so images ship as-is.
  images: { unoptimized: true },
  // Emit directory-style routes (/about/index.html) — cleaner on GitHub Pages.
  trailingSlash: true,
  // Let .mdx files be treated as modules we can import (posts live in /content).
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

const withMDX = createMDX({
  options: {
    // Expose each post's YAML frontmatter as an exported `frontmatter` object.
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withMDX(nextConfig);
