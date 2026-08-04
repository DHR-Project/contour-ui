import { forwardRef } from "react";
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { SemanticColorToken } from "@/lib/types/color.types";

export type TextStyle =
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

export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextElement = "h1" | "h2" | "h3" | "h4" | "p" | "span";
export type TextLabelColor = "primary" | "secondary" | "tertiary" | "quaternary";
export type TextDensity = "tight" | "default" | "loose";

const STYLE_CLASS: Record<TextStyle, string> = {
  "large-title": "text-large-title",
  "title-1": "text-title-1",
  "title-2": "text-title-2",
  "title-3": "text-title-3",
  headline: "text-headline",
  body: "text-body",
  callout: "text-callout",
  subheadline: "text-subheadline",
  footnote: "text-footnote",
  "caption-1": "text-caption-1",
  "caption-2": "text-caption-2",
};

// Default `as` per Text Style (contour-spec-text.md SS2).
const STYLE_DEFAULT_ELEMENT: Record<TextStyle, TextElement> = {
  "large-title": "h1",
  "title-1": "h1",
  "title-2": "h2",
  "title-3": "h3",
  headline: "h4",
  body: "p",
  callout: "p",
  subheadline: "span",
  footnote: "span",
  "caption-1": "span",
  "caption-2": "span",
};

// Only Headline defaults to semibold (SS3.1 table); every other style is regular.
const STYLE_DEFAULT_WEIGHT: Record<TextStyle, TextWeight> = {
  "large-title": "regular",
  "title-1": "regular",
  "title-2": "regular",
  "title-3": "regular",
  headline: "semibold",
  body: "regular",
  callout: "regular",
  subheadline: "regular",
  footnote: "regular",
  "caption-1": "regular",
  "caption-2": "regular",
};

const WEIGHT_CLASS: Record<TextWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const LABEL_COLOR_CLASS: Record<TextLabelColor, string> = {
  primary: "text-label-primary",
  secondary: "text-label-secondary",
  tertiary: "text-label-tertiary",
  quaternary: "text-label-quaternary",
};

const SEMANTIC_COLOR_VALUE: Record<SemanticColorToken, string> = {
  tint: "rgb(var(--tint))",
  destructive: "rgb(var(--color-destructive))",
  success: "rgb(var(--color-success))",
  warning: "rgb(var(--color-warning))",
  info: "rgb(var(--color-info))",
};

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  /** Text Style (contour-spec-text.md SS1) -- named `textStyle` (not `style`) to keep the native DOM style attribute usable. */
  textStyle?: TextStyle;
  as?: TextElement;
  weight?: TextWeight;
  color?: TextLabelColor | SemanticColorToken;
  /** Line-spacing override (contour-spec-text.md SS3a) -- component-scoped,
   * only changes leading, not size or letter-spacing. Default "default". */
  density?: TextDensity;
  /** `true` for single-line ellipsis, or a line count for multi-line clamp. */
  truncate?: boolean | number;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    textStyle = "body",
    as,
    weight,
    color = "primary",
    density = "default",
    truncate,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const Component: ElementType = as ?? STYLE_DEFAULT_ELEMENT[textStyle];
  const resolvedWeight = weight ?? STYLE_DEFAULT_WEIGHT[textStyle];
  const isLabelColor = color in LABEL_COLOR_CLASS;

  const mergedStyle: CSSProperties = { ...style };
  if (!isLabelColor) {
    mergedStyle.color = SEMANTIC_COLOR_VALUE[color as SemanticColorToken];
  }
  if (typeof truncate === "number") {
    mergedStyle.display = "-webkit-box";
    mergedStyle.WebkitBoxOrient = "vertical";
    mergedStyle.WebkitLineClamp = truncate;
    mergedStyle.overflow = "hidden";
  }

  return (
    <Component
      ref={ref as never}
      className={cn(
        STYLE_CLASS[textStyle],
        WEIGHT_CLASS[resolvedWeight],
        isLabelColor && LABEL_COLOR_CLASS[color as TextLabelColor],
        density !== "default" && `density-${density}`,
        truncate === true && "truncate",
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
});
