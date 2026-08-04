"use client";

import { forwardRef } from "react";
import { Switch as RadixSwitch } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { Text } from "@/components/ui/text";

// Standard track/thumb ratio (contour-spec-switch.md SS "Visual") -- no
// `size` prop, unlike Checkbox/Radio, since a real Switch only ships one size.
const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_INSET = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2;

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    onCheckedChange,
    disabled = false,
    label,
    id,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  },
  ref,
) {
  const track = (
    <RadixSwitch.Root
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        // `before:` is the 44px hit-area expansion (rule 5.5a) for the
        // no-label case -- when `label` is set, the label wrapper below
        // covers the combined control+label hit area instead.
        "relative inline-flex shrink-0 items-center rounded-full bg-fill-secondary transition-colors duration-(--duration-fast) before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))] data-[state=checked]:bg-tint",
        !label && "disabled:opacity-40",
        className,
      )}
      style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
    >
      <RadixSwitch.Thumb asChild>
        {/* Thumb stays white in both color modes -- always needs contrast
            against both track states, unlike other Contour surfaces (see
            spec). Position (not color) animates via spring: physical
            movement gets a spring, per Continuity 1.1. */}
        <motion.span
          initial={false}
          animate={{ x: checked ? THUMB_TRAVEL : 0 }}
          transition={springs.snappy}
          className="absolute rounded-full bg-white shadow-xs"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE, left: THUMB_INSET, top: THUMB_INSET }}
        />
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  );

  if (!label) return track;

  return (
    <label
      className={cn(
        // min-h-11 gives the combined control+label unit a 44px hit area
        // (rule 5.5a) -- clicking anywhere in the label forwards to the
        // nested Radix button natively, so this only needs to fix height.
        "inline-flex min-h-11 items-center gap-(--gap-icon-text)",
        disabled && "opacity-40",
      )}
    >
      {track}
      <Text as="span" textStyle="body">
        {label}
      </Text>
    </label>
  );
});
