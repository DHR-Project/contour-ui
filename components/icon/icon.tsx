import { forwardRef } from "react";
import type { CSSProperties, SVGProps } from "react";
import type { SemanticColorToken } from "@/lib/types/color.types";
import { iconRegistry } from "./icon-registry";
import type { IconName } from "./icon.types";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_VALUE: Record<IconSize, string> = {
  xs: "var(--icon-size-xs)",
  sm: "var(--icon-size-sm)",
  md: "var(--icon-size-md)",
  lg: "var(--icon-size-lg)",
  xl: "var(--icon-size-xl)",
};

const COLOR_VALUE: Record<SemanticColorToken, string> = {
  tint: "rgb(var(--tint))",
  destructive: "rgb(var(--color-destructive))",
  success: "rgb(var(--color-success))",
  warning: "rgb(var(--color-warning))",
  info: "rgb(var(--color-info))",
};

type IconAccessibilityProps =
  | { decorative?: true; "aria-label"?: never }
  | { decorative: false; "aria-label": string };

export type IconProps = Omit<SVGProps<SVGSVGElement>, "color" | "width" | "height"> &
  IconAccessibilityProps & {
    name: IconName;
    size?: IconSize;
    color?: "currentColor" | SemanticColorToken;
  };

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = "md", color = "currentColor", decorative = true, style, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const LucideIcon = iconRegistry[name];

  // width/height/stroke-width are applied via style (not lucide's size/
  // strokeWidth props) so they stay live CSS var references -- e.g. they
  // respond to prefers-contrast:more (SS0.2) without a re-render.
  const mergedStyle: CSSProperties = {
    width: SIZE_VALUE[size],
    height: SIZE_VALUE[size],
    strokeWidth: "var(--icon-stroke-width)",
    ...style,
  };

  return (
    <LucideIcon
      ref={ref}
      color={color === "currentColor" ? undefined : COLOR_VALUE[color]}
      style={mergedStyle}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : ariaLabel}
      {...rest}
    />
  );
});
