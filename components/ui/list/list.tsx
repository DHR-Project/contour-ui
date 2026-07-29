"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon/icon.types";

/**
 * List / ListItem — a row-based list, built directly on the row/grouped
 * spacing tokens in styles/tokens.css (--padding-row-x/y,
 * --inset-grouped-margin-x/gap, --bg-grouped-primary/secondary) which
 * already spec out exactly this pattern: a grouped card of rows on a
 * grouped page background.
 *
 * Compound API - <List><ListItem /></List> - rather than an options
 * array, since row content varies too much (icon, subtitle, a Switch, a
 * value string, a chevron...) to fit one shape.
 *
 * A third "menu" variant exists for floating-panel contexts (Dropdown,
 * Popover) - compact rounded rows with no divider lines and no card
 * background, matching Select's own item styling, since Dropdown/Popover
 * content already supplies the panel's background/border/shadow (see
 * material-thick usage in Dropdown/Select) - a grouped card nested inside
 * would double up on that chrome.
 */
const listVariants = cva("", {
  variants: {
    variant: {
      plain: "divide-y divide-separator",
      grouped: "divide-y divide-separator overflow-hidden rounded-lg bg-bg-grouped-secondary",
      menu: "flex flex-col gap-0.5",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
});

/**
 * Shares the parent List's variant with each ListItem so callers don't have
 * to repeat `variant="menu"` on every row - matching how the row's own
 * padding/hover treatment needs to follow the list's, not be set per-item.
 */
const ListVariantContext = React.createContext<"plain" | "grouped" | "menu">("plain");

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: "plain" | "grouped" | "menu";
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, variant = "plain", ...props }, ref) => (
    <ListVariantContext.Provider value={variant}>
      <ul ref={ref} className={cn(listVariants({ variant }), className)} {...props} />
    </ListVariantContext.Provider>
  ),
);
List.displayName = "List";

const rowVariants = cva(["flex w-full items-center text-left transition-colors duration-200"], {
  variants: {
    variant: {
      plain: "gap-(--gap-icon-text) px-(--padding-row-x) py-(--padding-row-y)",
      grouped: "gap-(--gap-icon-text) px-(--padding-row-x) py-(--padding-row-y)",
      menu: "gap-2 rounded-sm px-2 py-1.5",
    },
    interactive: {
      // ring-inset (no ring-offset) so the focus ring doesn't get clipped
      // by the grouped variant's overflow-hidden card, or the menu
      // variant's own compact row bounds.
      true: "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tint",
      false: "",
    },
  },
  compoundVariants: [
    { variant: ["plain", "grouped"], interactive: true, class: "hover:bg-fill-quaternary" },
    // Matches Select's item hover/highlight color exactly, since this
    // variant exists specifically for that kind of floating-panel row.
    { variant: "menu", interactive: true, class: "hover:bg-fill-secondary" },
  ],
  defaultVariants: {
    variant: "plain",
    interactive: false,
  },
});

export interface ListItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Icon from the shared registry. Use `leading` instead for anything else (avatar, custom badge...). */
  leadingIcon?: IconName;
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Shorthand: appends a chevron-right after trailing, for navigation rows. */
  chevron?: boolean;
  disabled?: boolean;
  /** Render props onto the immediate child instead of a new element - e.g. wrap in next/link's Link for a navigation row. */
  asChild?: boolean;
}

export const ListItem = React.forwardRef<HTMLButtonElement, ListItemProps>(
  (
    {
      className,
      leadingIcon,
      leading,
      title,
      subtitle,
      trailing,
      chevron,
      disabled,
      onClick,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const variant = React.useContext(ListVariantContext);
    const interactive = asChild || Boolean(onClick);
    const Component: React.ElementType = asChild ? Slot : interactive ? "button" : "div";

    return (
      <li>
        <Component
          ref={ref}
          type={!asChild && interactive ? "button" : undefined}
          disabled={!asChild && interactive ? disabled : undefined}
          aria-disabled={asChild && disabled ? true : undefined}
          onClick={disabled ? undefined : onClick}
          className={cn(
            rowVariants({ variant, interactive }),
            disabled && "pointer-events-none opacity-40",
            className,
          )}
          {...props}
        >
          {leadingIcon ? (
            <Icon name={leadingIcon} size={20} className="shrink-0 text-label-secondary" />
          ) : (
            leading
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body text-label-primary">{title}</span>
            {subtitle ? (
              <span className="truncate text-footnote text-label-secondary">{subtitle}</span>
            ) : null}
          </div>

          {trailing}
          {chevron ? (
            <Icon name="chevron-right" size={16} className="shrink-0 text-label-tertiary" />
          ) : null}
        </Component>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
