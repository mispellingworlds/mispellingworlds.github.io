import fs from 'node:fs';
import path from 'node:path';

type Variant = { width: number; url: string };

type ManifestEntry = {
  width: number;
  height: number;
  blur: string;
  variants: Variant[];
};

/** What a component needs to render one responsive <img>. */
export type ResponsiveImage = {
  /** Fallback src: the largest derivative (never the untouched original). */
  src: string;
  srcSet?: string;
  /** Biggest derivative — what the lightbox shows at ~95vw. */
  full: string;
  width?: number;
  height?: number;
  /** Inline data: URI painted behind the image so the box is never blank. */
  blur?: string;
};

const MANIFEST_PATH = path.join(process.cwd(), '.image-manifest.json');

/**
 * Percent-encodes a public path segment by segment (filenames here contain
 * spaces and parentheses). Manifest URLs arrive already encoded; this only
 * covers the fallback, so every caller can treat the result as URL-ready.
 */
function encodePath(url: string): string {
  return url.split('/').map(encodeURIComponent).join('/');
}

let cache: Record<string, ManifestEntry> | null = null;

function manifest(): Record<string, ManifestEntry> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    // No manifest (scripts/optimize-images.mjs hasn't run) — every lookup
    // falls back to the original file, so the site still renders.
    cache = {};
  }
  return cache!;
}

/**
 * Looks up the derivatives generated for `src` by scripts/optimize-images.mjs.
 * Callers must be server-side (build time): this reads from disk.
 *
 * `src` may be encoded (lib/images.ts) or raw (as typed in MDX); the manifest
 * is keyed by the decoded path.
 */
export function getResponsiveImage(src: string): ResponsiveImage {
  let key = src;
  try {
    key = decodeURI(src);
  } catch {
    // Malformed escape — fall through with the string as written.
  }

  const entry = manifest()[key];
  if (!entry || entry.variants.length === 0) {
    const encoded = encodePath(key);
    return { src: encoded, full: encoded };
  }

  const largest = entry.variants[entry.variants.length - 1];
  return {
    src: largest.url,
    srcSet: entry.variants.map((v) => `${v.url} ${v.width}w`).join(', '),
    full: largest.url,
    width: entry.width,
    height: entry.height,
    blur: entry.blur,
  };
}
