import HomeLink from '@/components/home-link';
import FluidText from '@/components/fluid-text';

export default function NotFound() {
  return (
    <div className="master-stack">
      <div className="text-section">
        <FluidText text="lost in the mispelling worlds" tag="h1" />
      </div>
      <div className="text-content text-center">404 — page not found</div>
      <HomeLink />
    </div>
  );
}
