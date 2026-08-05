import { cn } from "@/lib/utils/cn";
import { Text } from "@/components/ui/text";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeCounterProps = {
  variant?: "counter";
  /** Numeric count to display. count > 99 shows "99+". */
  count?: number;
  /** Show only a dot — no number. Default: false. */
  dot?: boolean;
  /** Render when count === 0. Default: false (hidden). */
  showZero?: boolean;
  className?: string;
};

export type BadgeStatusProps = {
  variant: "status";
  label: string;
  color?: "tint" | "destructive" | "success" | "warning";
  /** solid = opaque bg (safe on any background, default). tinted = alpha bg (only safe on controlled backgrounds). */
  tone?: "solid" | "tinted";
  className?: string;
};

export type BadgeProps = BadgeCounterProps | BadgeStatusProps;

// ---------------------------------------------------------------------------
// Counter helpers
// ---------------------------------------------------------------------------

// Map semantic color name to CSS variable fragment.
const STATUS_COLOR_VAR: Record<
  NonNullable<BadgeStatusProps["color"]>,
  string
> = {
  tint: "--tint",
  destructive: "--color-destructive",
  success: "--color-success",
  warning: "--color-warning",
};

function formatCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Badge(props: BadgeProps) {
  // --- counter variant ---
  if (!props.variant || props.variant === "counter") {
    const { count, dot = false, showZero = false, className } = props;

    // Hide when count is 0 and showZero is false (but always show dots).
    if (!dot && count === 0 && !showZero) return null;
    // Hide when count is undefined and not a dot.
    if (!dot && count === undefined) return null;

    const displayText = dot ? null : formatCount(count!);
    const isMultiDigit = !dot && displayText !== null && displayText.length >= 2;

    return (
      <span
        className={cn(
          // Fixed red background, white text — iOS notification badge convention.
          "inline-flex items-center justify-center bg-destructive text-white",
          dot
            ? "h-2 w-2 rounded-full"
            : cn(
                "min-h-4 min-w-4 px-[3px]",
                isMultiDigit ? "rounded-full" : "rounded-full",
              ),
          className,
        )}
        aria-label={
          dot ? "Notification" : displayText ? `${displayText} notifications` : undefined
        }
        role="status"
      >
        {!dot && displayText && (
          <Text as="span" textStyle="caption-2" weight="bold" className="text-white leading-none">
            {displayText}
          </Text>
        )}
      </span>
    );
  }

  // --- status variant ---
  const {
    label,
    color = "tint",
    tone = "solid",
    className,
  } = props as BadgeStatusProps;

  const cssVar = STATUS_COLOR_VAR[color];

  const bgStyle =
    tone === "solid"
      ? { background: `rgb(var(${cssVar}))` }
      : { background: `rgb(var(${cssVar}) / 0.15)` };

  const textColorStyle =
    tone === "solid"
      ? { color: "white" }
      : { color: `rgb(var(${cssVar}))` };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-(--space-2) py-(--space-1)",
        className,
      )}
      style={bgStyle}
    >
      <Text
        as="span"
        textStyle="caption-1"
        weight="semibold"
        className="leading-none"
        style={textColorStyle}
      >
        {label}
      </Text>
    </span>
  );
}
