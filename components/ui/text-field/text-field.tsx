"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon/icon.types";
import { Label } from "@/components/ui/label";

/**
 * TextField — a labeled text input with optional helper/error text and
 * leading/trailing icons. A single composed component rather than a
 * separate bare Input + wrapper: matches how this library is meant to be
 * consumed (copied into a project, not imported from a package), so each
 * component stays self-contained instead of reaching into a sibling.
 */
const wrapperVariants = cva(
  [
    "flex items-center gap-2 bg-fill-secondary text-label-primary",
    "transition-shadow duration-200",
    "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-tint has-[input:focus-visible]:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "h-8 rounded-sm px-3 text-subheadline",
        md: "h-10 rounded-md px-3.5 text-body",
        lg: "h-12 rounded-lg px-4 text-body",
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

const iconSize = { sm: 14, md: 16, lg: 18 } as const;

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof wrapperVariants> {
  label?: string;
  /** Replaced by errorText when present, and switches the field to its invalid state. */
  helperText?: string;
  errorText?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Shows a clear (x) button once there is a value; called instead of trying to guess intent from onChange. */
  onClear?: () => void;
  wrapperClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      wrapperClassName,
      size = "md",
      label,
      helperText,
      errorText,
      leadingIcon,
      trailingIcon,
      onClear,
      id,
      disabled,
      required,
      value,
      defaultValue,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const isInvalid = Boolean(errorText);
    const message = errorText ?? helperText;

    // Track whether there's a value to decide when to show the clear
    // button, without turning this into a controlled component when the
    // caller didn't ask for one.
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
    const currentValue = value ?? uncontrolledValue;
    const hasValue = String(currentValue ?? "").length > 0;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setUncontrolledValue(event.target.value);
      onChange?.(event);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <Label htmlFor={inputId} required={required} className="text-footnote font-medium text-label-primary">
            {label}
          </Label>
        ) : null}

        <div
          className={cn(
            wrapperVariants({ size, invalid: isInvalid }),
            disabled && "pointer-events-none opacity-40",
            wrapperClassName,
          )}
        >
          {leadingIcon ? (
            <Icon name={leadingIcon} size={iconSize[size ?? "md"]} className="text-label-tertiary" />
          ) : null}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={isInvalid}
            aria-describedby={
              [message ? helperId : undefined, ariaDescribedBy].filter(Boolean).join(" ") ||
              undefined
            }
            className={cn(
              "min-w-0 flex-1 bg-transparent text-label-primary outline-none placeholder:text-label-tertiary",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />

          {onClear && hasValue && !disabled ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear"
              className="flex shrink-0 items-center justify-center rounded-full p-0.5 text-label-tertiary hover:bg-fill-primary hover:text-label-primary"
            >
              <Icon name="close" size={iconSize[size ?? "md"]} />
            </button>
          ) : trailingIcon ? (
            <Icon name={trailingIcon} size={iconSize[size ?? "md"]} className="text-label-tertiary" />
          ) : null}
        </div>

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
TextField.displayName = "TextField";
