import { BRAND_COLORS } from '../../utils/brand';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/** The HabitBuddy logo, inlined so it can be sized and animated. Mirrors `public/favicon.svg`. */
export function BrandMark({ size = 60, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      className={className}
      role="img"
      aria-label="HabitBuddy"
    >
      <circle cx="30" cy="30" r="24" fill={BRAND_COLORS.coral} opacity="0.85" />
      <circle cx="60" cy="30" r="24" fill={BRAND_COLORS.gold} opacity="0.85" />
      <circle cx="30" cy="60" r="24" fill={BRAND_COLORS.teal} opacity="0.85" />
      <circle cx="60" cy="60" r="24" fill={BRAND_COLORS.violet} opacity="0.85" />
      <circle cx="45" cy="45" r="10" fill="#fff" />
    </svg>
  );
}
