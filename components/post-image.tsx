import ReactDOM from 'react-dom';
import { getResponsiveImage } from '@/lib/image-manifest';

type PostImageProps = {
  src: string;
  alt: string;
  /** Desktop width, e.g. "45%" or "70%". Defaults to auto. */
  size?: string;
  /** Width below 768px. Defaults to 100%. */
  mobileSize?: string;
  /**
   * Set on the image at the top of a post. It's above the fold, so lazy
   * loading only delays the largest paint — load it eagerly and early.
   */
  priority?: boolean;
};

/** Widest the reading column ever gets: 65ch minus its 1rem padding. */
const COLUMN_MAX_PX = 748;
/** .text-content is w-4/5 on desktop, w-[95%] below 768px. */
const COLUMN_DESKTOP_VW = 80;
const COLUMN_MOBILE_VW = 95;

/**
 * Turns the CSS width props into a `sizes` hint so the browser picks the right
 * rung of the srcset. Percentages resolve against the reading column; anything
 * else (a fixed px width, "auto") is passed through as-is.
 */
function toSizes(size: string, mobileSize: string): string {
  const asFraction = (value: string) => {
    const match = /^([\d.]+)%$/.exec(value.trim());
    return match ? Number(match[1]) / 100 : null;
  };

  const desktop = asFraction(size);
  const mobile = asFraction(mobileSize);

  const desktopHint = desktop
    ? `min(${(desktop * COLUMN_DESKTOP_VW).toFixed(1)}vw, ${Math.round(desktop * COLUMN_MAX_PX)}px)`
    : `min(${COLUMN_DESKTOP_VW}vw, ${COLUMN_MAX_PX}px)`;
  const mobileHint = `${((mobile ?? 1) * COLUMN_MOBILE_VW).toFixed(1)}vw`;

  return `(max-width: 768px) ${mobileHint}, ${desktopHint}`;
}

/**
 * Image used inside posts. Ported from PostImage.astro — the responsive width
 * is driven by CSS custom properties so a media query can swap it on mobile.
 *
 * Sources come from the build-time derivatives (see scripts/optimize-images.mjs):
 * the originals are multi-megabyte scans and nothing resizes them at request
 * time on GitHub Pages.
 */
export default function PostImage({
  src,
  alt,
  size = 'auto',
  mobileSize = '100%',
  priority = false,
}: PostImageProps) {
  const image = getResponsiveImage(src);
  const sizes = image.srcSet ? toSizes(size, mobileSize) : undefined;

  if (priority) {
    // Hoisted into <head>, so the preload scanner starts the fetch before it
    // has parsed down to this <img> in the post body.
    ReactDOM.preload(image.src, {
      as: 'image',
      imageSrcSet: image.srcSet,
      imageSizes: sizes,
      fetchPriority: 'high',
    });
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      // PostLightbox reads this instead of the rendered src, so the overlay
      // shows the largest derivative rather than whichever rung is in the DOM.
      data-full={image.full}
      alt={alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className="post-image mx-auto my-10 block h-auto first:mt-0 md:my-10"
      style={
        {
          width: 'var(--post-image-size)',
          '--post-image-size': size,
          '--post-image-mobile-size': mobileSize,
          // Low-res placeholder behind the image: the box shows something
          // immediately and the real file paints over it, so no blank gap.
          backgroundImage: image.blur ? `url("${image.blur}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } as React.CSSProperties
      }
    />
  );
}
