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

      {/* Matryoshka frame: six concentric rectangles nested inward. Each ring
          is a step thinner than the one outside it (6px down to a 1px
          hairline) and sits a step closer to it (the gaps tighten 6px -> 2px),
          so the frame reads as accelerating inward toward the text.
          Nested divs rather than box-shadow rings so the frame grows inward
          and never widens the reading column. The outer box keeps .text-content
          (measure + typography, inherited by the text); its p-4 is overridden
          by the first ring gap, and the innermost box restores the text padding.
          No flex-1 stretch, so the bottom edge sits just under the last line —
          the home link stays pinned to the page bottom via its own mt-auto. */}
      <div className="text-content mb-6 border-[9px] border-ink p-[4px] md:mb-10 md:border-[9px] md:p-[6px]">
        <div className="border-[7px] border-ink p-[4px] md:border-[7px] md:p-[5px]">
          <div className="border-[5px] border-ink p-[3px] md:border-[5px] md:p-[4px]">
            <div className="border-[3px] border-ink p-[3px] md:border-[3px] md:p-[3px]">
              <div className="border-[2px] border-ink p-[2px]">
                <div className="border-[1px] border-ink p-4">
                  everything is interesting, or has the possibility of being
                  interesting. i believe in a newfound digital psychedelia born
                  from the ashes of overcrowded online spaces, interested in
                  novel ways of wonder and still capable of engaging with the
                  sparkling secrets; conscious that the circuit-woven wombs of
                  these times are brooding possibilities never seen before. we're 
                  all drawing cartographies of existence thorugh senses and
                  information, but these maps - contrary to the one reality -
                  can be designed to be unique, and strive for their own beauty.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeLink />
    </div>
  );
}
