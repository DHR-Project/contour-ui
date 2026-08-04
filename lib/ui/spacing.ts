import type { GapToken, SemanticGap, SpaceToken } from "@/lib/types/spacing.types";

// CSS values (not Tailwind classes) so the gap prop can be applied via
// inline style -- prop-driven token values can't be statically extracted
// by Tailwind's class scanner, so this sidesteps that instead of trying to
// enumerate every value/axis combination as literal utility classes.
const SPACE_VALUE: Record<SpaceToken, string> = {
  "0": "0px",
  "1": "var(--space-1)",
  "2": "var(--space-2)",
  "3": "var(--space-3)",
  "4": "var(--space-4)",
  "5": "var(--space-5)",
  "6": "var(--space-6)",
  "7": "var(--space-7)",
  "8": "var(--space-8)",
  "10": "var(--space-10)",
  "12": "var(--space-12)",
  "16": "var(--space-16)",
  "20": "var(--space-20)",
};

const SEMANTIC_GAP_VALUE: Record<SemanticGap, string> = {
  "icon-text": "var(--gap-icon-text)",
  row: "var(--padding-row-y)",
  section: "var(--gap-section)",
};

export function gapValue(token: GapToken): string {
  return SPACE_VALUE[token as SpaceToken] ?? SEMANTIC_GAP_VALUE[token as SemanticGap];
}
