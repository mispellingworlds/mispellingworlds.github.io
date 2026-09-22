import type { Metadata } from 'next';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = {
  title: 'about',
  description:
    'everything is interesting, or has the possibility of being interesting: a newfound digital psychedelia born from the ashes of overcrowded online spaces.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <div className="hidden md:block">
          <FluidText text="ive got so bored i found new ways of breathing+" tag="h1" />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          <FluidText text="ive got so bored ive found " tag="h1" />
          <FluidText text="new ways of breathing+    " tag="h1" />
        </div>
      </div>

      {/* A thick black rectangle boxes the reading column; flex-1 stretches it
          down from the title to the home link even when the text runs short. */}
      <div className="text-content mb-6 flex-1 border-[10px] border-ink md:mb-10 md:border-[14px]">
        everything is interesting, or has the possibility of being interesting. i
        believe in a newfound digital psychedelia born from the ashes of
        overcrowded online spaces, interested in novel ways of wonder and still
        capable of engaging with the sparkling secrets; conscious that the
        circuit-woven wombs of these times are brooding possibilities never seen
        before. everyone is drawing a cartography of existence thorugh senses 
        and information, but such maps, contrary to the one reality, can be 
        designed to be unique and strive for their own beauty.
        {/* eslint-disable-next-line @next/next/no-img-element */}
      </div>

      <HomeLink />
    </div>
  );
}
