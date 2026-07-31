// Mirrors the CSS easing/duration tokens (styles/tokens.css SS6.2) as JS values
// for Framer Motion, which needs numeric arrays/seconds rather than CSS strings.
export const easings = {
  standard: [0.25, 0.1, 0.25, 1],
  springOut: [0.34, 1.56, 0.64, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
} as const;

export const durations = {
  instant: 0.1, // press feedback
  fast: 0.2, // hover
  normal: 0.3, // fade, color
  slow: 0.4, // sheet, modal
  slower: 0.5, // page transition
} as const;
