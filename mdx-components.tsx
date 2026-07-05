import type { MDXComponents } from 'mdx/types';
import PostImage from '@/components/post-image';
import Vimeo from '@/components/vimeo';

// Required by @next/mdx. Components listed here are available to every MDX
// file without an explicit import — that's how posts use <PostImage> / <Vimeo>.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PostImage,
    Vimeo,
    ...components,
  };
}
