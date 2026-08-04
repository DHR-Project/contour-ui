// Raw 4pt-grid spacing scale (design-tokens-summary.md SS4.1).
export type SpaceToken =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20";

// Semantic gap roles (design-tokens-summary.md SS4.2) -- prefer these over
// raw SpaceToken when a role-based token matches the context.
export type SemanticGap = "icon-text" | "row" | "section";

export type GapToken = SpaceToken | SemanticGap;
