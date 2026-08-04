// Breakpoint / Size-Class system (design-tokens-summary.md SS1) -- mirrors
// styles/tokens.css --bp-* tokens. "compact" has no lower bound (mobile-first
// base), so it isn't listed in SIZE_CLASS_MIN_WIDTH.
export type SizeClass = "compact" | "regular" | "regular-lg" | "regular-xl";

export const SIZE_CLASS_MIN_WIDTH: Record<Exclude<SizeClass, "compact">, number> = {
  regular: 768,
  "regular-lg": 1024,
  "regular-xl": 1280,
};
