"use client";

import { Avatar as RadixAvatar } from "radix-ui";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import type { IconName } from "@/components/icon";

// ---------------------------------------------------------------------------
// Size scale (spec SS1)
// ---------------------------------------------------------------------------

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "squircle";

const SIZE_DIAMETER: Record<AvatarSize, string> = {
  xs: "h-6 w-6",   // 24px
  sm: "h-8 w-8",   // 32px
  md: "h-10 w-10", // 40px
  lg: "h-14 w-14", // 56px
  xl: "h-20 w-20", // 80px
};

const SIZE_TEXT_STYLE: Record<AvatarSize, string> = {
  xs: "text-caption-2",
  sm: "text-caption-1",
  md: "text-subheadline",
  lg: "text-title-3",
  xl: "text-title-1",
};

const SIZE_ICON_SIZE: Record<AvatarSize, "xs" | "sm" | "md" | "lg" | "xl"> = {
  xs: "xs",
  sm: "sm",
  md: "sm",
  lg: "md",
  xl: "lg",
};

// ---------------------------------------------------------------------------
// Deterministic initials + color (spec SS4)
// ---------------------------------------------------------------------------

// 12 accent colors, §2.1.
const AVATAR_COLORS = [
  "--color-red",
  "--color-orange",
  "--color-yellow",
  "--color-green",
  "--color-mint",
  "--color-teal",
  "--color-cyan",
  "--color-blue",
  "--color-indigo",
  "--color-purple",
  "--color-pink",
  "--color-brown",
] as const;

function getAvatarColorVar(name: string): string {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  // First letter of first word + first letter of last word.
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export interface AvatarProps {
  src?: string;
  /** Required when src is set — describes the image for assistive tech. */
  alt?: string;
  /** Used to generate initials and deterministic background color. */
  name?: string;
  /** Final fallback icon when no src or name is given. Default: "user". */
  icon?: IconName;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Avatar({
  src,
  alt,
  name,
  icon = "user",
  size = "md",
  shape = "circle",
  className,
}: AvatarProps) {
  const colorVar = name ? getAvatarColorVar(name) : "--color-blue";
  const initials = name ? getInitials(name) : null;

  const shapeClass =
    shape === "circle" ? "rounded-full" : "rounded-[30%]";

  return (
    <RadixAvatar.Root
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none",
        SIZE_DIAMETER[size],
        shapeClass,
        className,
      )}
    >
      {/* Image — hidden until loaded; Radix handles the loading state. */}
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={alt ?? name ?? "Avatar"}
          className="h-full w-full object-cover"
        />
      )}

      {/* Fallback: initials (if name provided) or generic icon.
          delayMs=600 prevents a flash of fallback while the image loads
          quickly (Radix built-in — spec SS3). Only set when there's a src to
          wait on: Radix's own canRender starts false whenever `delayMs` is a
          defined number (even 0), gated behind a setTimeout -- so `delayMs={0}`
          still defers the very first paint by a tick instead of rendering
          synchronously the way `undefined` does. */}
      <RadixAvatar.Fallback
        delayMs={src ? 600 : undefined}
        className={cn(
          "flex h-full w-full items-center justify-center",
          // Solid opaque background — deterministic from name, safe on any bg (spec SS4 / badge tone="solid").
        )}
        style={{ background: `rgb(var(${colorVar}))` }}
      >
        {initials ? (
          <Text
            as="span"
            className={cn(SIZE_TEXT_STYLE[size], "font-semibold text-white leading-none")}
          >
            {initials}
          </Text>
        ) : (
          <Icon
            name={icon}
            size={SIZE_ICON_SIZE[size]}
            className="text-white"
            decorative
          />
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
