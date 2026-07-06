type PostImageProps = {
  src: string;
  alt: string;
  /** Desktop width, e.g. "45%" or "70%". Defaults to auto. */
  size?: string;
  /** Width below 768px. Defaults to 100%. */
  mobileSize?: string;
};

/**
 * Image used inside posts. Ported from PostImage.astro — the responsive width
 * is driven by CSS custom properties so a media query can swap it on mobile.
 */
export default function PostImage({
  src,
  alt,
  size = 'auto',
  mobileSize = '100%',
}: PostImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="post-image mx-auto my-10 block h-auto first:mt-0 md:my-10"
      style={
        {
          width: 'var(--post-image-size)',
          '--post-image-size': size,
          '--post-image-mobile-size': mobileSize,
        } as React.CSSProperties
      }
    />
  );
}
