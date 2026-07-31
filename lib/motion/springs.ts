// Framer Motion spring presets (design-tokens-summary.md SS6.3).
export const springs = {
  snappy: { type: "spring", stiffness: 500, damping: 30, mass: 1 }, // button, toggle
  smooth: { type: "spring", stiffness: 300, damping: 30, mass: 1 }, // sheet, modal
  gentle: { type: "spring", stiffness: 260, damping: 26, mass: 1 }, // push navigation
  bouncy: { type: "spring", stiffness: 400, damping: 20, mass: 1 }, // drag release
} as const;
