"use client";

import { forwardRef, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Text } from "@/components/ui/text";

// Body text line-height from tokens.css §3.3 (--text-body-leading: 1.375rem).
// Used to compute the max pixel height (maxRows * lineHeightPx) for the
// auto-resize height cap. Evaluated once at module init — matches the default
// text style used on the textarea element itself.
const BODY_LINE_HEIGHT_REM = 1.375;

export interface TextareaProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Initial visible line count. Default: 3. */
  rows?: number;
  /** JS-driven height auto-grow on input. Default: true. */
  autoResize?: boolean;
  /** Height cap in lines — scrolls internally beyond this. Default: 10. */
  maxRows?: number;
  /** Hard character limit. Counter only renders when this is set. */
  maxLength?: number;
  /** Show the character counter when maxLength is set. Default: true. */
  showCounter?: boolean;
  /** Fraction of maxLength at which the counter switches to warning color. Default: 0.9. */
  counterThreshold?: number;
  /** Inline error message; presence triggers error state. */
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      value,
      onValueChange,
      placeholder,
      rows = 3,
      autoResize = true,
      maxRows = 10,
      maxLength,
      showCounter = true,
      counterThreshold = 0.9,
      error,
      disabled = false,
      id,
      className,
      "aria-label": ariaLabel,
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const errorId = error ? `textarea-error-${generatedId}` : undefined;

    // Internal ref for height measurement. Merges with the forwarded ref.
    const innerRef = useRef<HTMLTextAreaElement>(null);

    // Sync the forwarded ref with the internal one.
    function setRefs(node: HTMLTextAreaElement | null) {
      (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current =
        node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node;
      }
    }

    // Auto-resize: measure scrollHeight after each value change.
    // CSS transition: height var(--duration-fast) handles the smooth grow/shrink
    // (spec SS2 "Motion" — CSS transition, not spring, because height changes
    // have no physical inertia to simulate).
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;

      const rootFontSizePx =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const lineHeightPx = BODY_LINE_HEIGHT_REM * rootFontSizePx;
      const maxHeightPx = maxRows * lineHeightPx;

      // Reset to "auto" before reading scrollHeight so shrinking works
      // correctly (scrollHeight is always >= clientHeight, so if we skip the
      // reset on a shrink the height would never decrease).
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, maxHeightPx)}px`;
    }, [value, autoResize, maxRows]);

    const showCharCounter =
      maxLength !== undefined && showCounter;

    const isWarning =
      maxLength !== undefined && value.length >= maxLength * counterThreshold;

    return (
      <div className={cn("flex flex-col gap-(--space-1)", className)}>
        {/* Border wrapper — mirrors TextField's container structure */}
        <div
          className={cn(
            "border bg-bg-primary transition-colors duration-(--duration-fast) rounded-sm",
            disabled && "opacity-40",
            error
              ? "border-destructive"
              : "border-separator focus-within:border-tint focus-within:outline-solid focus-within:[outline-width:var(--focus-ring-width)] focus-within:outline-offset-(--focus-ring-offset) focus-within:outline-[rgb(var(--focus-ring-color))]",
          )}
        >
          <textarea
            ref={setRefs}
            id={id}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorId}
            className={cn(
              // resize: none — height is managed entirely by autoResize JS;
              // no browser drag handle (spec SS2).
              // w-full so it fills the border wrapper horizontally.
              // transition on height for smooth grow/shrink (spec SS2 "Motion").
              "w-full resize-none bg-transparent text-body text-label-primary outline-none placeholder:text-label-tertiary disabled:cursor-not-allowed",
              "px-(--padding-control-x) py-(--padding-control-y)",
              autoResize && "transition-[height] duration-(--duration-fast)",
            )}
          />

          {/* Character counter — pinned to bottom-right inside the border */}
          {showCharCounter && (
            <div className="flex justify-end px-(--padding-control-x) pb-(--padding-control-y)">
              <Text
                as="span"
                textStyle="caption-1"
                color={isWarning ? "destructive" : "secondary"}
              >
                {value.length}/{maxLength}
              </Text>
            </div>
          )}
        </div>

        {/* Inline error message — same pattern as TextField */}
        {error && (
          <Text as="span" textStyle="footnote" color="destructive" id={errorId}>
            {error}
          </Text>
        )}
      </div>
    );
  },
);
