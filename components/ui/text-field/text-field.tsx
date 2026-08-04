"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";

export type TextFieldSize = "sm" | "md";
export type TextFieldType = "text" | "email" | "password" | "number" | "search";

// Fixed control-density padding (group 1, not responsive -- contour-spec-
// textfield.md SS "Visual"); `size` only scales it down, mirroring Button's
// sm/md padding scale.
const PADDING_CLASS: Record<TextFieldSize, string> = {
  sm: "px-(--space-3) py-(--space-1)",
  md: "px-(--padding-control-x) py-(--padding-control-y)",
};

const TEXT_CLASS: Record<TextFieldSize, string> = {
  sm: "text-subheadline",
  md: "text-body",
};

export interface TextFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Makes the trailing icon interactive (e.g. clear, show/hide password).
   * Both are required together to keep the button accessible (rule 6.3). */
  onTrailingIconClick?: () => void;
  trailingIconLabel?: string;
  error?: string;
  disabled?: boolean;
  size?: TextFieldSize;
  type?: TextFieldType;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    value,
    onValueChange,
    placeholder,
    leadingIcon,
    trailingIcon,
    onTrailingIconClick,
    trailingIconLabel,
    error,
    disabled = false,
    size = "md",
    type = "text",
    id,
    className,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const generatedId = useId();
  const errorId = error ? `textfield-error-${generatedId}` : undefined;

  return (
    <div className={cn("flex flex-col gap-(--space-1)", className)}>
      <div
        className={cn(
          "flex items-center gap-(--gap-icon-text) rounded-sm border bg-bg-primary transition-colors duration-(--duration-fast)",
          PADDING_CLASS[size],
          disabled && "opacity-40",
          error
            ? "border-destructive"
            : "border-separator focus-within:border-tint focus-within:outline-solid focus-within:[outline-width:var(--focus-ring-width)] focus-within:outline-offset-(--focus-ring-offset) focus-within:outline-[rgb(var(--focus-ring-color))]",
        )}
      >
        {leadingIcon && (
          <Icon name={leadingIcon} size="sm" className="shrink-0 text-label-secondary" />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-label-primary outline-none placeholder:text-label-tertiary disabled:cursor-not-allowed",
            TEXT_CLASS[size],
          )}
        />
        {trailingIcon &&
          (onTrailingIconClick ? (
            <button
              type="button"
              onClick={onTrailingIconClick}
              disabled={disabled}
              aria-label={trailingIconLabel}
              className="relative flex shrink-0 items-center justify-center text-label-secondary before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
            >
              <Icon name={trailingIcon} size="sm" />
            </button>
          ) : (
            <Icon name={trailingIcon} size="sm" className="shrink-0 text-label-secondary" />
          ))}
      </div>
      {error && (
        <Text as="span" textStyle="footnote" color="destructive" id={errorId}>
          {error}
        </Text>
      )}
    </div>
  );
});
