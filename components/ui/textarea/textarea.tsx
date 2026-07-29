"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Textarea — a labeled multi-line text input with optional helper/error
 * text. Deliberately not sharing code with TextField (same label/helper
 * structure, duplicated): this library is meant to be copied into a
 * project file by file, not imported from a package, so each component
 * stays self-contained instead of reaching into a sibling.
 */
const fieldVariants = cva(
  [
    "block w-full resize-y bg-fill-secondary text-body text-label-primary",
    "transition-shadow duration-200",
    "placeholder:text-label-tertiary outline-none",
    "focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      size: {
        sm: "rounded-sm px-3 py-2 text-subheadline",
        md: "rounded-md px-3.5 py-2.5",
        lg: "rounded-lg px-4 py-3",
      },
      invalid: {
        true: "ring-2 ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof fieldVariants> {
  label?: string;
  /** Replaced by errorText when present, and switches the field to its invalid state. */
  helperText?: string;
  errorText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size = "md",
      label,
      helperText,
      errorText,
      id,
      required,
      rows = 4,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const helperId = `${fieldId}-helper`;
    const isInvalid = Boolean(errorText);
    const message = errorText ?? helperText;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <Label htmlFor={fieldId} required={required} className="text-footnote font-medium text-label-primary">
            {label}
          </Label>
        ) : null}

        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          rows={rows}
          aria-invalid={isInvalid}
          aria-describedby={
            [message ? helperId : undefined, ariaDescribedBy].filter(Boolean).join(" ") ||
            undefined
          }
          className={cn(fieldVariants({ size, invalid: isInvalid }), className)}
          {...props}
        />

        {message ? (
          <p
            id={helperId}
            className={cn("text-footnote", isInvalid ? "text-destructive" : "text-label-tertiary")}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
