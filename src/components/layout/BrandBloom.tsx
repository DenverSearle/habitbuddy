import { BRAND_COLORS } from '../../utils/brand';
import { hexWithAlpha } from '../../utils/stats';

/**
 * The mark's four colors bloomed across the screen. Sized in vmin so the wash keeps its
 * proportions from a phone up to a desktop, and faded to zero alpha (not `transparent`,
 * which can interpolate through grey).
 */
const BLOOM = [
  `radial-gradient(70vmin 65vmin at 12% 8%, ${hexWithAlpha(BRAND_COLORS.coral, 0.38)}, ${hexWithAlpha(BRAND_COLORS.coral, 0)} 70%)`,
  `radial-gradient(65vmin 60vmin at 92% 18%, ${hexWithAlpha(BRAND_COLORS.gold, 0.36)}, ${hexWithAlpha(BRAND_COLORS.gold, 0)} 70%)`,
  `radial-gradient(75vmin 75vmin at 88% 88%, ${hexWithAlpha(BRAND_COLORS.violet, 0.38)}, ${hexWithAlpha(BRAND_COLORS.violet, 0)} 70%)`,
  `radial-gradient(70vmin 70vmin at 8% 82%, ${hexWithAlpha(BRAND_COLORS.teal, 0.36)}, ${hexWithAlpha(BRAND_COLORS.teal, 0)} 70%)`,
].join(', ');

/** Full-bleed background wash for the app's entry screens. Expects a `relative` parent. */
export function BrandBloom() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 dark:opacity-60"
      style={{ background: BLOOM }}
    />
  );
}
