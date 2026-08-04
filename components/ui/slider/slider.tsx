"use client";

import { forwardRef, useId, useState } from "react";
import { Slider as RadixSlider } from "radix-ui";
import { cn } from "@/lib/utils/cn";

// Radix Slider itself supports multiple thumbs (range selection) -- exposing
// only a single number here would narrow away real capability consumers may
// need later (see CLAUDE.local.md on wrapping third-party primitives).
export type SliderValue = number | number[];

export interface SliderProps {
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Radix multi-thumb option: minimum steps required between adjacent thumbs. */
  minStepsBetweenThumbs?: number;
  className?: string;
  /** Accessible name per thumb -- a single string for one thumb, or one
   * entry per thumb for a multi-thumb range (named apart from `aria-label`
   * so eslint-plugin-jsx-a11y doesn't flag it as a raw DOM aria-label,
   * which must always be a plain string). */
  thumbLabel?: string | string[];
}

function toArray(value: SliderValue | undefined): number[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9-]/g, "");
}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    minStepsBetweenThumbs,
    className,
    thumbLabel,
  },
  ref,
) {
  // Whether to report back a single number or an array mirrors whichever
  // shape the caller opted into via value/defaultValue.
  const isMulti = Array.isArray(value ?? defaultValue);
  const arrayValue = toArray(value);
  const arrayDefaultValue = toArray(defaultValue) ?? [min];
  const thumbCount = (arrayValue ?? arrayDefaultValue).length;
  const thumbLabels = Array.isArray(thumbLabel) ? thumbLabel : undefined;
  const singleThumbLabel = typeof thumbLabel === "string" ? thumbLabel : undefined;

  const [isDragging, setIsDragging] = useState(false);
  const rawId = useId();
  const scopeClass = `contour-slider-${sanitizeId(rawId)}`;

  const handlePointerDown = () => {
    if (!disabled) setIsDragging(true);
  };
  const handlePointerUp = () => setIsDragging(false);

  return (
    <RadixSlider.Root
      ref={ref}
      value={arrayValue}
      defaultValue={arrayDefaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      onValueChange={(next) => onValueChange?.(isMulti ? next : next[0])}
      onValueCommit={(next) => onValueCommit?.(isMulti ? next : next[0])}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={cn(
        scopeClass,
        "relative flex w-full touch-none select-none items-center py-(--space-3)",
        disabled && "opacity-40",
        className,
      )}
    >
      {/* Radix positions each Thumb's wrapper span (an internal, unstyled
          element we have no direct handle on) via inline `left`. Direct drag
          must stay perfectly 1:1 with the pointer (no easing) per Continuity
          1.1's documented exception for direct manipulation -- so transition
          is only enabled once the drag ends, using the spring-out CSS
          easing token as the closest non-JS approximation of
          springs.snappy/springs.smooth (this scoped rule is the only way to
          reach that wrapper, matching Grid's responsive-columns pattern). */}
      <style>{`
        .${scopeClass} > span:has([role="slider"]) {
          transition: ${isDragging ? "none" : "left var(--duration-normal) var(--ease-spring-out)"};
        }
      `}</style>
      <RadixSlider.Track className="relative h-1 w-full grow rounded-full bg-fill-secondary">
        <RadixSlider.Range className="absolute h-full rounded-full bg-tint" />
      </RadixSlider.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <RadixSlider.Thumb
          key={index}
          aria-label={thumbLabels?.[index] ?? singleThumbLabel}
          className="relative block h-7 w-7 rounded-full bg-bg-primary shadow-sm before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]"
        />
      ))}
    </RadixSlider.Root>
  );
});
