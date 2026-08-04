"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { durations } from "@/lib/motion";
import { Flex } from "@/components/ui/flex";
import { Icon } from "@/components/icon";
import type { IconName, IconSize } from "@/components/icon";
import { Text } from "@/components/ui/text";

export type ButtonVariant = "filled" | "tinted" | "plain";
export type ButtonRole = "default" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonCorner = "standard" | "squircle";

// Background/text color per variant x role (contour-spec-button.md SS1).
// Known gap: filled always uses white text -- correct for 8/9 system
// colors, but --color-yellow is light enough that this fails contrast if a
// consumer sets tint="yellow". Not resolved at the token level yet.
const buttonStyles = cva(
  // min-h-[44px] guarantees the compact touch target (guideline rule 5.5);
  // dropped at regular+ where pointer-driven input doesn't need it.
  "inline-flex items-center justify-center min-h-[44px] md:min-h-0 transition-[background-color,filter] duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-40 focus-visible:[outline-style:solid] focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:[outline-offset:var(--focus-ring-offset)] focus-visible:[outline-color:rgb(var(--focus-ring-color))]",
  {
    variants: {
      variant: {
        filled: "",
        tinted: "",
        plain: "",
      },
      role: {
        default: "",
        destructive: "",
      },
      size: {
        sm: "px-[var(--space-3)] py-[var(--space-1)]",
        md: "px-[var(--padding-control-x)] py-[var(--padding-control-y)]",
        lg: "px-[var(--space-6)] py-[var(--space-3)]",
      },
      iconOnly: {
        true: "aspect-square",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      corner: {
        // True continuous-corner squircle (figma-squircle clip-path) isn't
        // implemented yet -- falls back to a larger standard radius.
        standard: "rounded-md",
        squircle: "rounded-xl",
      },
    },
    compoundVariants: [
      {
        variant: "filled",
        role: "default",
        class: "bg-[rgb(var(--tint))] text-white hover-fine:brightness-95",
      },
      {
        variant: "filled",
        role: "destructive",
        class: "bg-[rgb(var(--color-destructive))] text-white hover-fine:brightness-95",
      },
      {
        variant: "tinted",
        role: "default",
        class:
          "bg-[var(--tint-fill)] text-[rgb(var(--tint))] hover-fine:bg-[var(--tint-fill-pressed)]",
      },
      {
        variant: "tinted",
        role: "destructive",
        // SS10.1 -- dedicated token, not an ad hoc opacity on --color-destructive.
        class:
          "bg-[rgb(var(--button-bg-destructive))] text-[rgb(var(--color-destructive))] hover-fine:bg-[rgb(var(--color-destructive)/0.25)]",
      },
      {
        variant: "plain",
        role: "default",
        class: "bg-transparent text-[rgb(var(--tint))] hover-fine:bg-fill-tertiary",
      },
      {
        variant: "plain",
        role: "destructive",
        class: "bg-transparent text-[rgb(var(--color-destructive))] hover-fine:bg-fill-tertiary",
      },
    ],
    defaultVariants: {
      variant: "filled",
      role: "default",
      size: "md",
      iconOnly: false,
      fullWidth: false,
      corner: "standard",
    },
  },
);

const ICON_SIZE_FOR_BUTTON: Record<ButtonSize, IconSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

type ButtonBaseProps = Omit<HTMLMotionProps<"button">, "children" | "color"> & {
  variant?: ButtonVariant;
  role?: ButtonRole;
  size?: ButtonSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  corner?: ButtonCorner;
};

export type ButtonProps = ButtonBaseProps &
  (
    | { children: ReactNode; "aria-label"?: string }
    | { children?: never; "aria-label": string }
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "filled",
    role = "default",
    size = "md",
    leadingIcon,
    trailingIcon,
    loading = false,
    disabled = false,
    fullWidth = false,
    corner = "standard",
    className,
    children,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const iconOnly = !children;
  const isDisabled = disabled || loading;
  const iconSize = ICON_SIZE_FOR_BUTTON[size];

  // Icon-only buttons need their own accessible name too (guideline rule
  // 6.3) even though the <button> already carries `aria-label` -- TS can't
  // correlate the runtime `iconOnly` check back to ButtonProps' discriminated
  // union here, hence the cast (ariaLabel is guaranteed set when iconOnly).
  let leadingIconElement: ReactNode = null;
  if (loading) {
    leadingIconElement = <Icon name="spinner" size={iconSize} className="animate-spin" />;
  } else if (leadingIcon) {
    leadingIconElement = iconOnly ? (
      <Icon name={leadingIcon} size={iconSize} decorative={false} aria-label={ariaLabel as string} />
    ) : (
      <Icon name={leadingIcon} size={iconSize} />
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: durations.instant }}
      className={cn(
        buttonStyles({ variant, role, size, iconOnly, fullWidth, corner }),
        className,
      )}
      {...rest}
    >
      {/* container={false}: container-type: inline-size would make this
          wrapper size itself independent of its content (CSS containment),
          breaking Button's shrink-to-fit width. */}
      <Flex direction="row" align="center" justify="center" gap="icon-text" container={false}>
        {leadingIconElement}
        {children && (
          <Text as="span" textStyle="body" weight="semibold" className="text-inherit">
            {children}
          </Text>
        )}
        {!iconOnly && !loading && trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
      </Flex>
    </motion.button>
  );
});
