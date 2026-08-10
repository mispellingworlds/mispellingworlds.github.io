import type { Metadata } from 'next';
import Gallery from '@/components/gallery';
import HomeLink from '@/components/home-link';
import { getGalleryImages } from '@/lib/images';

export const metadata: Metadata = {
  title: 'drawings',
  description:
    'axiomatic doodling, b/w pointillism, emotional formalism — scanned from a 12,7 x 8,6 cm notebook.',
  alternates: { canonical: '/drawings/' },
};

export default function DrawingsPage() {
  const images = getGalleryImages('drawings');
  return (
    <div className="master-stack">
      <HomeLink as="header" />
      <Gallery images={images} />
      <HomeLink />
    </div>
  );
}
