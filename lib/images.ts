import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

/**
 * Lists image files in public/images/<dir> at build time and returns their
 * public URLs, sorted by name. Replaces the Astro `import.meta.glob` the
 * gallery pages used. Runs only in a Server Component (build-time), which is
 * valid under static export.
 */
export function getGalleryImages(dir: string): string[] {
  const abs = path.join(process.cwd(), 'public', 'images', dir);
  return fs
    .readdirSync(abs)
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/images/${dir}/${encodeURIComponent(file)}`);
}
