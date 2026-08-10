import HomeLink from '@/components/home-link';
import FluidText from '@/components/fluid-text';

export default function NotFound() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <FluidText text="page not found" tag="h1" />
      </div>
      <HomeLink />
    </div>
  );
}
