"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

const colorSwatchSizes = {
  md: "h-12",
  lg: "h-28",
};

/**
 * Renders a color token as a filled swatch, labeled with the exact Tailwind
 * utility class to use plus the live computed color (reflects light/dark).
 */
export function ColorSwatch({
  className,
  size = "md",
}: {
  className: string;
  size?: keyof typeof colorSwatchSizes;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string | null>(null);
  const [blur, setBlur] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const computed = getComputedStyle(ref.current);
    setValue(computed.backgroundColor);
    // Materials (e.g. material-thin) bundle a backdrop-filter with their
    // background - surface it too, since that is the whole point of that
    // utility over a plain bg-fill-* color.
    if (computed.backdropFilter && computed.backdropFilter !== "none") {
      setBlur(computed.backdropFilter);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        className={cn(
          "w-full rounded-md border border-separator",
          colorSwatchSizes[size],
          className,
        )}
      />
      <div className="flex flex-col">
        <Text as="span" variant="caption1" className="font-mono">
          {className}
        </Text>
        <Text as="span" variant="caption2" color="tertiary" className="font-mono">
          {value ?? "..."}
          {blur ? ` + ${blur}` : ""}
        </Text>
      </div>
    </div>
  );
}

/**
 * Compact swatch for dense scales (e.g. a 9-step shade ramp per hue) -
 * shows only the step number and, on hover, the live computed value.
 */
export function ShadeSwatch({ className, step }: { className: string; step: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setValue(getComputedStyle(ref.current).backgroundColor);
  }, []);

  return (
    <div className="group flex flex-1 flex-col gap-1" title={`${className} - ${value ?? "..."}`}>
      <div ref={ref} className={cn("h-10 w-full rounded-sm border border-separator", className)} />
      <Text as="span" variant="caption2" color="tertiary" className="text-center font-mono">
        {step}
      </Text>
    </div>
  );
}

/**
 * Renders a text color token as a sample glyph on a neutral background,
 * labeled with the utility class plus the live computed color value.
 */
export function LabelSwatch({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    setValue(getComputedStyle(ref.current).color);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-12 w-full items-center justify-center rounded-md bg-bg-secondary">
        <span ref={ref} className={cn("text-title-2 font-semibold", className)}>
          Aa
        </span>
      </div>
      <div className="flex flex-col">
        <Text as="span" variant="caption1" className="font-mono">
          {className}
        </Text>
        <Text as="span" variant="caption2" color="tertiary" className="font-mono">
          {value ?? "..."}
        </Text>
      </div>
    </div>
  );
}
