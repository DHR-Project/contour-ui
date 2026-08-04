"use client";

import { forwardRef, useState } from "react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

export type CheckboxSize = "sm" | "md";
export type CheckboxCheckedState = boolean | "indeterminate";

const BOX_SIZE_CLASS: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

export interface CheckboxProps {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = "md",
    disabled = false,
    label,
    id,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  },
  ref,
) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState<CheckboxCheckedState>(defaultChecked);
  const currentChecked = checked ?? uncontrolledChecked;

  const box = (
    <RadixCheckbox.Root
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(state) => {
        setUncontrolledChecked(state);
        onCheckedChange?.(state === true);
      }}
      disabled={disabled}
      className={cn(
        // `before:` is the 44px hit-area expansion (rule 5.5a) for the
        // no-label case -- when `label` is set, the label wrapper below
        // covers the combined control+label hit area instead.
        "relative inline-flex shrink-0 items-center justify-center rounded-xs border border-separator-opaque bg-transparent text-white transition-colors duration-(--duration-fast) before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))] data-[state=checked]:border-transparent data-[state=checked]:bg-tint data-[state=indeterminate]:border-transparent data-[state=indeterminate]:bg-tint",
        !label && "disabled:opacity-40",
        BOX_SIZE_CLASS[size],
        className,
      )}
    >
      <RadixCheckbox.Indicator forceMount className="flex items-center justify-center">
        <AnimatePresence initial={false}>
          {currentChecked !== false && (
            <motion.span
              key={currentChecked === "indeterminate" ? "indeterminate" : "checked"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={springs.snappy}
              className="flex items-center justify-center"
            >
              <Icon name={currentChecked === "indeterminate" ? "minus" : "check"} size="xs" />
            </motion.span>
          )}
        </AnimatePresence>
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (!label) return box;

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
      {box}
      <Text as="span" textStyle="body">
        {label}
      </Text>
    </label>
  );
});
