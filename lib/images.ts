import fs from 'node:fs';
import path from 'node:path';
import { getResponsiveImage, type ResponsiveImage } from '@/lib/image-manifest';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

/**
 * Lists image files in public/images/<dir> at build time and returns them with
 * their generated derivatives (see scripts/optimize-images.mjs). Replaces the
 * Astro `import.meta.glob` the gallery pages used. Runs only in a Server
 * Component (build-time), which is valid under static export.
 */
export function getGalleryImages(dir: string): ResponsiveImage[] {
  const abs = path.join(process.cwd(), 'public', 'images', dir);
  return fs
    .readdirSync(abs)
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => getResponsiveImage(`/images/${dir}/${file}`));
}
