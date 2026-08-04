/*
 * Contour Dynamic Type lookup tables.
 * Source: current-generation reference design data (local-docs/dynamic-type-dimensions-extraction.md).
 *
 * No global multiplier (the old --type-scale) -- the scale is non-linear
 * across Text Styles (e.g. Large Title only grows x1.76 from Large to AX5,
 * while Body grows x3.12 over the same range), so a single factor applied
 * to every rem token can't be correct for all styles at once. This is a
 * real lookup table instead.
 */

export type TextStyleName =
  | "large-title"
  | "title-1"
  | "title-2"
  | "title-3"
  | "headline"
  | "body"
  | "callout"
  | "subheadline"
  | "footnote"
  | "caption-1"
  | "caption-2";

export type SizeMode =
  | "xSmall"
  | "small"
  | "medium"
  | "large" // default
  | "xLarge"
  | "xxLarge"
  | "xxxLarge"
  | "ax1"
  | "ax2"
  | "ax3"
  | "ax4"
  | "ax5";

export type LineSpacingDensity = "tight" | "default" | "loose";

const TEXT_STYLES: TextStyleName[] = [
  "large-title",
  "title-1",
  "title-2",
  "title-3",
  "headline",
  "body",
  "callout",
  "subheadline",
  "footnote",
  "caption-1",
  "caption-2",
];

const DENSITIES: LineSpacingDensity[] = ["tight", "default", "loose"];

// ---------------------------------------------------------------------------
// 1. FONT SIZE -- does not vary with density, only sizeMode. Unit: px.
// ---------------------------------------------------------------------------
export const FONT_SIZE: Record<TextStyleName, Record<SizeMode, number>> = {
  "large-title": { xSmall: 31, small: 32, medium: 33, large: 34, xLarge: 36, xxLarge: 38, xxxLarge: 40, ax1: 44, ax2: 48, ax3: 52, ax4: 56, ax5: 60 },
  "title-1":     { xSmall: 25, small: 26, medium: 27, large: 28, xLarge: 30, xxLarge: 32, xxxLarge: 34, ax1: 38, ax2: 43, ax3: 48, ax4: 53, ax5: 58 },
  "title-2":     { xSmall: 19, small: 20, medium: 21, large: 22, xLarge: 24, xxLarge: 26, xxxLarge: 28, ax1: 34, ax2: 43, ax3: 44, ax4: 50, ax5: 56 },
  "title-3":     { xSmall: 17, small: 18, medium: 19, large: 20, xLarge: 22, xxLarge: 24, xxxLarge: 26, ax1: 31, ax2: 37, ax3: 43, ax4: 43, ax5: 55 },
  "headline":    { xSmall: 14, small: 15, medium: 16, large: 17, xLarge: 19, xxLarge: 21, xxxLarge: 23, ax1: 28, ax2: 33, ax3: 40, ax4: 47, ax5: 53 },
  "body":        { xSmall: 14, small: 15, medium: 16, large: 17, xLarge: 19, xxLarge: 21, xxxLarge: 23, ax1: 28, ax2: 33, ax3: 40, ax4: 47, ax5: 53 },
  "callout":     { xSmall: 13, small: 14, medium: 15, large: 16, xLarge: 18, xxLarge: 20, xxxLarge: 22, ax1: 26, ax2: 32, ax3: 38, ax4: 44, ax5: 51 },
  "subheadline": { xSmall: 12, small: 13, medium: 14, large: 15, xLarge: 17, xxLarge: 19, xxxLarge: 21, ax1: 25, ax2: 30, ax3: 36, ax4: 42, ax5: 49 },
  "footnote":    { xSmall: 12, small: 12, medium: 12, large: 13, xLarge: 15, xxLarge: 17, xxxLarge: 19, ax1: 23, ax2: 27, ax3: 33, ax4: 38, ax5: 44 },
  "caption-1":   { xSmall: 11, small: 11, medium: 11, large: 12, xLarge: 14, xxLarge: 16, xxxLarge: 18, ax1: 22, ax2: 26, ax3: 32, ax4: 37, ax5: 43 },
  "caption-2":   { xSmall: 11, small: 11, medium: 11, large: 11, xLarge: 13, xxLarge: 15, xxxLarge: 17, ax1: 20, ax2: 24, ax3: 29, ax4: 34, ax5: 40 },
};

// ---------------------------------------------------------------------------
// 2. LEADING (line-height) -- varies with BOTH sizeMode AND density. Unit: px.
// ---------------------------------------------------------------------------
export const LEADING: Record<TextStyleName, Record<LineSpacingDensity, Record<SizeMode, number>>> = {
  "large-title": {
    tight:   { xSmall: 36, small: 37, medium: 38, large: 39, xLarge: 41, xxLarge: 44, xxxLarge: 46, ax1: 50, ax2: 55, ax3: 59, ax4: 64, ax5: 68 },
    default: { xSmall: 38, small: 39, medium: 40, large: 41, xLarge: 43, xxLarge: 46, xxxLarge: 48, ax1: 52, ax2: 57, ax3: 61, ax4: 66, ax5: 70 },
    loose:   { xSmall: 40, small: 41, medium: 42, large: 43, xLarge: 45, xxLarge: 48, xxxLarge: 50, ax1: 54, ax2: 59, ax3: 63, ax4: 68, ax5: 72 },
  },
  "title-1": {
    tight:   { xSmall: 29, small: 30, medium: 31, large: 32, xLarge: 34, xxLarge: 37, xxxLarge: 39, ax1: 44, ax2: 49, ax3: 55, ax4: 60, ax5: 66 },
    default: { xSmall: 31, small: 32, medium: 33, large: 34, xLarge: 36, xxLarge: 39, xxxLarge: 41, ax1: 46, ax2: 51, ax3: 57, ax4: 62, ax5: 68 },
    loose:   { xSmall: 33, small: 34, medium: 35, large: 36, xLarge: 38, xxLarge: 41, xxxLarge: 43, ax1: 48, ax2: 53, ax3: 59, ax4: 64, ax5: 70 },
  },
  "title-2": {
    tight:   { xSmall: 21, small: 22, medium: 26, large: 26, xLarge: 28, xxLarge: 30, xxxLarge: 32, ax1: 39, ax2: 49, ax3: 50, ax4: 57, ax5: 64 },
    default: { xSmall: 23, small: 24, medium: 28, large: 28, xLarge: 30, xxLarge: 32, xxxLarge: 34, ax1: 41, ax2: 51, ax3: 52, ax4: 59, ax5: 66 },
    loose:   { xSmall: 25, small: 26, medium: 30, large: 30, xLarge: 32, xxLarge: 34, xxxLarge: 36, ax1: 43, ax2: 53, ax3: 54, ax4: 61, ax5: 68 },
  },
  "title-3": {
    tight:   { xSmall: 20, small: 21, medium: 22, large: 23, xLarge: 26, xxLarge: 28, xxxLarge: 30, ax1: 36, ax2: 42, ax3: 49, ax4: 49, ax5: 63 },
    default: { xSmall: 22, small: 23, medium: 24, large: 25, xLarge: 28, xxLarge: 30, xxxLarge: 32, ax1: 38, ax2: 44, ax3: 51, ax4: 51, ax5: 65 },
    loose:   { xSmall: 24, small: 25, medium: 26, large: 27, xLarge: 30, xxLarge: 32, xxxLarge: 34, ax1: 40, ax2: 46, ax3: 53, ax4: 53, ax5: 67 },
  },
  headline: {
    tight:   { xSmall: 17, small: 18, medium: 19, large: 20, xLarge: 22, xxLarge: 24, xxxLarge: 27, ax1: 32, ax2: 38, ax3: 46, ax4: 54, ax5: 60 },
    default: { xSmall: 19, small: 20, medium: 21, large: 22, xLarge: 24, xxLarge: 26, xxxLarge: 29, ax1: 34, ax2: 40, ax3: 48, ax4: 56, ax5: 62 },
    loose:   { xSmall: 21, small: 22, medium: 23, large: 24, xLarge: 26, xxLarge: 28, xxxLarge: 31, ax1: 36, ax2: 42, ax3: 50, ax4: 58, ax5: 64 },
  },
  body: {
    tight:   { xSmall: 17, small: 18, medium: 19, large: 20, xLarge: 22, xxLarge: 24, xxxLarge: 27, ax1: 32, ax2: 38, ax3: 46, ax4: 54, ax5: 60 },
    default: { xSmall: 19, small: 20, medium: 21, large: 22, xLarge: 24, xxLarge: 26, xxxLarge: 29, ax1: 34, ax2: 40, ax3: 48, ax4: 56, ax5: 62 },
    loose:   { xSmall: 21, small: 22, medium: 23, large: 24, xLarge: 26, xxLarge: 28, xxxLarge: 31, ax1: 36, ax2: 42, ax3: 50, ax4: 58, ax5: 64 },
  },
  callout: {
    tight:   { xSmall: 16, small: 17, medium: 18, large: 19, xLarge: 21, xxLarge: 22, xxxLarge: 26, ax1: 30, ax2: 37, ax3: 44, ax4: 50, ax5: 58 },
    default: { xSmall: 18, small: 19, medium: 20, large: 21, xLarge: 23, xxLarge: 24, xxxLarge: 28, ax1: 32, ax2: 39, ax3: 46, ax4: 52, ax5: 60 },
    loose:   { xSmall: 20, small: 21, medium: 22, large: 23, xLarge: 25, xxLarge: 26, xxxLarge: 30, ax1: 34, ax2: 41, ax3: 48, ax4: 54, ax5: 62 },
  },
  subheadline: {
    tight:   { xSmall: 14, small: 16, medium: 17, large: 18, xLarge: 20, xxLarge: 22, xxxLarge: 26, ax1: 29, ax2: 35, ax3: 41, ax4: 48, ax5: 56 },
    default: { xSmall: 16, small: 18, medium: 19, large: 20, xLarge: 22, xxLarge: 24, xxxLarge: 28, ax1: 31, ax2: 37, ax3: 43, ax4: 50, ax5: 58 },
    loose:   { xSmall: 18, small: 20, medium: 21, large: 22, xLarge: 24, xxLarge: 26, xxxLarge: 30, ax1: 33, ax2: 39, ax3: 45, ax4: 52, ax5: 60 },
  },
  footnote: {
    tight:   { xSmall: 14, small: 14, medium: 14, large: 16, xLarge: 18, xxLarge: 20, xxxLarge: 22, ax1: 27, ax2: 31, ax3: 38, ax4: 44, ax5: 50 },
    default: { xSmall: 16, small: 16, medium: 16, large: 18, xLarge: 20, xxLarge: 22, xxxLarge: 24, ax1: 29, ax2: 33, ax3: 40, ax4: 46, ax5: 52 },
    loose:   { xSmall: 18, small: 18, medium: 18, large: 20, xLarge: 22, xxLarge: 24, xxxLarge: 26, ax1: 31, ax2: 35, ax3: 42, ax4: 48, ax5: 54 },
  },
  "caption-1": {
    tight:   { xSmall: 11, small: 11, medium: 11, large: 14, xLarge: 17, xxLarge: 19, xxxLarge: 21, ax1: 26, ax2: 30, ax3: 37, ax4: 42, ax5: 49 },
    default: { xSmall: 13, small: 13, medium: 13, large: 16, xLarge: 19, xxLarge: 21, xxxLarge: 23, ax1: 28, ax2: 32, ax3: 39, ax4: 44, ax5: 51 },
    loose:   { xSmall: 15, small: 15, medium: 15, large: 18, xLarge: 21, xxLarge: 23, xxxLarge: 25, ax1: 30, ax2: 34, ax3: 41, ax4: 46, ax5: 53 },
  },
  "caption-2": {
    tight:   { xSmall: 11, small: 11, medium: 11, large: 11, xLarge: 16, xxLarge: 18, xxxLarge: 20, ax1: 23, ax2: 28, ax3: 33, ax4: 39, ax5: 46 },
    default: { xSmall: 13, small: 13, medium: 13, large: 13, xLarge: 18, xxLarge: 20, xxxLarge: 22, ax1: 25, ax2: 30, ax3: 35, ax4: 41, ax5: 48 },
    loose:   { xSmall: 15, small: 15, medium: 15, large: 15, xLarge: 20, xxLarge: 22, xxxLarge: 24, ax1: 27, ax2: 32, ax3: 37, ax4: 43, ax5: 50 },
  },
};

// ---------------------------------------------------------------------------
// 3. LETTER SPACING -- flat, does not vary with sizeMode or density. Unit: px.
// ---------------------------------------------------------------------------
export const LETTER_SPACING: Record<TextStyleName, number> = {
  "large-title": 0.4,
  "title-1": 0.38,
  "title-2": -0.26,
  "title-3": -0.45,
  headline: -0.43,
  body: -0.43,
  callout: -0.31,
  subheadline: -0.23,
  footnote: -0.08,
  "caption-1": 0,
  "caption-2": 0.06,
};

// ---------------------------------------------------------------------------
// Generates every --text-{style}-size / -leading / -leading-tight /
// -leading-loose / -letter-spacing custom property for a given sizeMode, to
// set on :root (ContourProvider, on sizeMode change). The "default" density
// leading is emitted unsuffixed since it's what `.text-{style}` reads
// directly; -tight/-loose are indirection targets for the `density-tight`/
// `density-loose` classes (see styles/tokens.css SS3.3 and
// contour-spec-text.md SS3a) -- Text itself never needs to know sizeMode.
// ---------------------------------------------------------------------------
export function generateTypeCSSVars(sizeMode: SizeMode): Record<string, string> {
  const vars: Record<string, string> = {};
  TEXT_STYLES.forEach((style) => {
    vars[`--text-${style}-size`] = `${FONT_SIZE[style][sizeMode] / 16}rem`;
    vars[`--text-${style}-letter-spacing`] = `${LETTER_SPACING[style] / 16}rem`;
    DENSITIES.forEach((density) => {
      const suffix = density === "default" ? "" : `-${density}`;
      vars[`--text-${style}-leading${suffix}`] = `${LEADING[style][density][sizeMode] / 16}rem`;
    });
  });
  return vars;
}
