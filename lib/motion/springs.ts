import type { Transition } from "framer-motion";

/**
 * Framer Motion spring configs used across Contour components.
 */
export const springs = {
  /** button, toggle */
  snappy: { type: "spring", stiffness: 500, damping: 30, mass: 1 },
  /** sheet, modal */
  smooth: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
  /** push navigation */
  gentle: { type: "spring", stiffness: 260, damping: 26, mass: 1 },
  /** drag release */
  bouncy: { type: "spring", stiffness: 400, damping: 20, mass: 1 },
} as const satisfies Record<string, Transition>;

export type SpringName = keyof typeof springs;
