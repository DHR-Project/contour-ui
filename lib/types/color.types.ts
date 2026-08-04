// State/tint semantic color tokens (design-tokens-summary.md SS2.2) shared
// by components that let a color prop escape their default semantic set
// (e.g. Icon, Text) -- never raw base colors or hex (guideline rule 2.1).
export type SemanticColorToken = "tint" | "destructive" | "success" | "warning" | "info";
