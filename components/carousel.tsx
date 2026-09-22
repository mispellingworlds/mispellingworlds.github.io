import CarouselView, { type Slide } from '@/components/carousel-view';
import { getResponsiveImage } from '@/lib/image-manifest';
import { toSizes } from '@/lib/image-sizes';
import { getGalleryImages } from '@/lib/images';

/** One slide as written in MDX: a bare path, or a path with its own alt/caption. */
type CarouselItem = string | { src: string; alt?: string; caption?: string };

type CarouselProps = {
  /** Explicit slides, in order. Mutually exclusive with `dir`. */
  images?: CarouselItem[];
  /**
   * Folder under public/images (e.g. "posts/desolation-seed") — every image in
   * it becomes a slide, sorted by filename. Saves listing nine paths by hand.
   */
  dir?: string;
  /** Alt text for slides that don't carry their own. */
  alt?: string;
  /** Desktop width, e.g. "80%". Defaults to the full reading column. */
  size?: string;
  /** Width below 768px. Defaults to 100%. */
  mobileSize?: string;
  /** Seconds between automatic advances. Omit for manual-only. */
  autoplay?: number;
};

/**
 * Image carousel for posts. Server component: it resolves every source through
 * the build-time manifest (scripts/optimize-images.mjs) exactly like
 * <PostImage> does, then hands the resolved list to the client component that
 * owns the slideshow state.
 *
 *   <Carousel dir="posts/desolation-seed" alt="desolation seed" size="80%" />
 *
 *   <Carousel
 *     images={[
 *       { src: '/images/posts/x/a.png', caption: 'the first room' },
 *       '/images/posts/x/b.png',
 *     ]}
 *   />
 */
export default function Carousel({
  images,
  dir,
  alt = '',
  size = '100%',
  mobileSize = '100%',
  autoplay = 0,
}: CarouselProps) {
  const slides: Slide[] = dir
    ? getGalleryImages(dir).map((image) => ({ image, alt }))
    : (images ?? []).map((item) =>
        typeof item === 'string'
          ? { image: getResponsiveImage(item), alt }
          : {
              image: getResponsiveImage(item.src),
              alt: item.alt ?? item.caption ?? alt,
              caption: item.caption,
            }
      );

  if (slides.length === 0) return null;

  // Only worth hinting when the manifest actually produced a srcset.
  const sizes = slides.some(({ image }) => image.srcSet)
    ? toSizes(size, mobileSize)
    : undefined;

  return (
    <CarouselView
      slides={slides}
      sizes={sizes}
      size={size}
      mobileSize={mobileSize}
      autoplay={autoplay}
    />
  );
}
