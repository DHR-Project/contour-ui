"use client";

import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Circular size presets (spec SS2).
const CIRCULAR_SIZES = {
  sm: { diameter: 16, strokeWidth: 2 },
  md: { diameter: 24, strokeWidth: 2.5 },
  lg: { diameter: 32, strokeWidth: 3 },
} as const;

// The spinner arc is a fixed 270-degree gap (spec SS2, "~270°").
const SPINNER_GAP_DEG = 90; // leaves 270° visible

type ColorKey = "tint" | "destructive" | "success" | "warning";

const COLOR_VAR: Record<ColorKey, string> = {
  tint: "rgb(var(--tint))",
  destructive: "rgb(var(--color-destructive))",
  success: "rgb(var(--color-success))",
  warning: "rgb(var(--color-warning))",
};

export type ProgressCircularProps = {
  variant?: "circular";
  /** 0-100. undefined = indeterminate spinner. */
  value?: number;
  size?: "sm" | "md" | "lg";
  /** Escape hatch: exact pixel diameter (bypasses size preset). */
  diameter?: number;
  /** Escape hatch: stroke width in px — required when using diameter. */
  strokeWidth?: number;
  color?: ColorKey;
  /** aria-label for accessibility. Required when no surrounding text describes it. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

export type ProgressLinearProps = {
  variant: "linear";
  /** Required — linear is always determinate (spec SS1). */
  value: number;
  color?: ColorKey;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

export type ProgressProps = ProgressCircularProps | ProgressLinearProps;

// ---------------------------------------------------------------------------
// Circular Progress
// ---------------------------------------------------------------------------

function CircularProgress({
  value,
  size = "md",
  diameter: diameterProp,
  strokeWidth: strokeWidthProp,
  color = "tint",
  label,
  className,
  style,
}: ProgressCircularProps) {
  const preset = CIRCULAR_SIZES[size];
  const diameter = diameterProp ?? preset.diameter;
  const strokeWidth = strokeWidthProp ?? preset.strokeWidth;

  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const isIndeterminate = value === undefined;

  // For a determinate arc: dashoffset shrinks as value increases.
  // Full circle = offset 0; empty = offset = circumference.
  const dashOffset = isIndeterminate
    ? // Spinner: show ~270° of arc (gap of 90°).
      (SPINNER_GAP_DEG / 360) * circumference
    : circumference * (1 - Math.max(0, Math.min(100, value)) / 100);

  const fillColor = COLOR_VAR[color];

  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={isIndeterminate ? undefined : 0}
      aria-valuemax={isIndeterminate ? undefined : 100}
      className={cn("inline-flex shrink-0", className)}
      style={style}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        fill="none"
        aria-hidden="true"
        className={cn(
          isIndeterminate && [
            // Standard spin animation for sighted users.
            "animate-spin",
            // prefers-reduced-motion: pulse instead of spin (spec SS4).
            "motion-reduce:animate-none motion-reduce:[animation:_progress-pulse_1.2s_ease-in-out_infinite]",
          ],
        )}
      >
        {/* Track */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="rgb(var(--fill-tertiary))"
          strokeWidth={strokeWidth}
        />
        {/* Fill arc */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          // SVG starts at 3 o'clock; rotate -90° so arc starts at 12 o'clock.
          transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
          style={
            isIndeterminate
              ? undefined
              : {
                  transition: `stroke-dashoffset var(--duration-normal) ease`,
                }
          }
        />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Linear Progress
// ---------------------------------------------------------------------------

function LinearProgress({
  value,
  color = "tint",
  label,
  className,
  style,
}: ProgressLinearProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColor = COLOR_VAR[color];

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-fill-secondary",
        className,
      )}
      style={style}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${clampedValue}%`,
          background: fillColor,
          transition: `width var(--duration-normal) ease`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function Progress(props: ProgressProps) {
  if (props.variant === "linear") {
    return <LinearProgress {...props} />;
  }
  return <CircularProgress {...props} />;
}
