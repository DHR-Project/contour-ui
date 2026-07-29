/**
 * CSS easing/duration tokens.
 * Use these for plain CSS transitions (no Framer Motion involved).
 */
export const easings = {
  standard: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  springOut: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 500,
} as const;

export type EasingName = keyof typeof easings;
export type DurationName = keyof typeof durations;
