import type { Metadata } from 'next';
import FluidText from '@/components/fluid-text';
import HomeLink from '@/components/home-link';

export const metadata: Metadata = { title: 'About' };

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

      <div className="text-content">
        everything is interesting, or has the possibility of being interesting. i
        believe in a newfound digital psychedelia born from the ashes of
        overcrowded online spaces, interested in novel ways of wonder and still
        capable of engaging with the sparkling secrets; conscious that the
        circuit-woven wombs of these times are brooding possibilities never seen
        before.
      </div>

      <HomeLink />
    </div>
  );
}
