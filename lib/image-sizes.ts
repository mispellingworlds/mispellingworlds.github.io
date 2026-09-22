/** Widest the reading column ever gets: 65ch minus its 1rem padding. */
const COLUMN_MAX_PX = 748;
/** .text-content is w-4/5 on desktop, w-[95%] below 768px. */
const COLUMN_DESKTOP_VW = 80;
const COLUMN_MOBILE_VW = 95;

/**
 * Turns the CSS width props used by in-post media (<PostImage>, <Carousel>)
 * into a `sizes` hint so the browser picks the right rung of the srcset.
 * Percentages resolve against the reading column; anything else (a fixed px
 * width, "auto") is passed through as-is.
 */
export function toSizes(size: string, mobileSize: string): string {
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
