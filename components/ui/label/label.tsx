"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * Label — built on Radix Label. Functionally almost identical to a native
 * <label>: same htmlFor/click-forwarding behavior, plus Radix adds
 * prevention of accidental text selection on double-click. Deliberately
 * unstyled beyond a pointer cursor - it's used two different ways in this
 * library (a small field caption in TextField/Textarea, which supply their
 * own text-footnote classes; and a full-row wrapper around a control plus
 * body text in Checkbox/RadioGroup usage), so forcing a font size or color
 * here would fight one of those.
 */
export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Appends a destructive "*" after the label content. */
  required?: boolean;
}

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn("cursor-pointer", className)} {...props}>
      {children}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = "Label";
