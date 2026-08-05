/**
 * Helper that computes the `diameter` and `strokeWidth` props to pass to
 * `<Progress variant="circular">` so it wraps an Avatar of a given size.
 *
 * Neither Avatar nor Progress imports this file — both components stay
 * completely independent. Only call sites that explicitly want to compose
 * an Avatar with a progress ring use this helper (spec contour-spec-avatar.md
 * SS8 and contour-spec-progress.md SS8).
 *
 * Usage:
 *   <div className="relative inline-block">
 *     <Avatar name="Alice" size="lg" />
 *     <Progress
 *       variant="circular"
 *       value={uploadProgress}
 *       {...getAvatarProgressRing("lg")}
 *       className="absolute inset-0 -m-1"
 *     />
 *   </div>
 */

// Avatar diameters (px) per size — must stay in sync with avatar.tsx SIZE_DIAMETER.
const AVATAR_DIAMETER_PX: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const RING_STROKE_WIDTH: Record<string, number> = {
  xs: 2,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
};

const RING_MARGIN: Record<string, number> = {
  xs: 3,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

export interface AvatarProgressRingConfig {
  /** Exact pixel diameter for <Progress>. */
  diameter: number;
  /** Stroke width in px for <Progress>. */
  strokeWidth: number;
}

/**
 * Returns the exact `diameter` and `strokeWidth` props for a Progress ring
 * that wraps an Avatar of the given size with a consistent 1-pixel gap.
 */
export function getAvatarProgressRing(
  size: "xs" | "sm" | "md" | "lg" | "xl",
): AvatarProgressRingConfig {
  const avatarPx = AVATAR_DIAMETER_PX[size];
  const stroke = RING_STROKE_WIDTH[size];
  const margin = RING_MARGIN[size];
  // Outer diameter = avatar + 2 * (margin to create gap).
  const diameter = avatarPx + margin * 2;
  return { diameter, strokeWidth: stroke };
}
