import ReactDOM from 'react-dom';
import { getResponsiveImage } from '@/lib/image-manifest';
import { toSizes } from '@/lib/image-sizes';

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
