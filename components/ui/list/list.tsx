"use client";

import { Children } from "react";
import type { ReactElement, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export type ListStyle = "plain" | "grouped";

export interface ListProps {
  style?: ListStyle;
  /** ListItem elements -- each must have a stable `key` for the add/remove animation to work. */
  children: ReactNode;
}

// Add/remove animation (contour-spec-list.md SS5): scale+blur+height collapse
// for the item actually being added/removed, `layout` alone (position shift,
// no blur) for siblings -- reduced motion drops to a plain fade, no layout
// animation (guideline rule 5.3 / contour-spec-list.md SS5 last bullet).
export function List({ style = "plain", children }: ListProps) {
  const items = Children.toArray(children) as ReactElement[];
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {
        layout: false as const,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: durations.fast },
      }
    : {
        layout: true as const,
        initial: { opacity: 0, scale: 0.9, filter: "blur(4px)", height: 0 },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)", height: "auto" },
        exit: { opacity: 0, scale: 0.9, filter: "blur(4px)", height: 0 },
        transition: springs.smooth,
      };

  return (
    <ul
      className={cn(
        style === "grouped" &&
          "mx-[var(--inset-grouped-margin-x)] overflow-hidden rounded-lg border border-separator",
      )}
    >
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li key={item.key} className="group" {...motionProps}>
            {item}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
