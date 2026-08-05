"use client";

import * as React from "react";
import { Toast as RadixToast } from "radix-ui";
import { motion, AnimatePresence } from "framer-motion";
import { useToast, dismissToast } from "./use-toast";
import type { ToastProps } from "./use-toast";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";

const VARIANT_ICONS: Record<string, IconName> = {
  success: "circle-check",
  warning: "triangle-alert",
  destructive: "circle-alert",
};

// Fallback used for an item's contribution to the expanded stack height
// before its ResizeObserver has reported an actual measurement.
const DEFAULT_TOAST_HEIGHT = 64;
const TOAST_GAP = 8; // --space-2, per contour-spec-toast-v2.md §5.3

// §5.1: the paper-stack peek only ever shows the top 3 -- this is a
// collapsed-display rule, not a cap on how many toasts can be active (see
// use-toast.ts). Expanding the stack shows all of them regardless.
const STACK_VISIBLE_LIMIT = 3;

export function Toaster() {
  const { toasts } = useToast();
  const sizeClass = useSizeClass();
  const isCoarsePointer = useIsCoarsePointer();
  const isCompact = sizeClass === "compact";

  const [expanded, setExpanded] = React.useState(false);
  const collapseTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Measured heights per toast id, used to lay out the fully expanded
  // vertical list (§5.3: `y: index * (toastHeight + 8)`), since toast
  // height varies with an optional description line.
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const handleHeightChange = React.useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const handleMouseEnter = () => {
    if (!isCoarsePointer) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isCoarsePointer) {
      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
      collapseTimeout.current = setTimeout(() => {
        setExpanded(false);
      }, 300);
    }
  };

  const handlePointerDown = () => {
    if (isCoarsePointer) {
      setExpanded((prev) => {
        const next = !prev;
        if (next) {
          if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
          collapseTimeout.current = setTimeout(() => {
            setExpanded(false);
          }, 3000);
        }
        return next;
      });
    }
  };

  // Close on outside click for touch
  React.useEffect(() => {
    if (!expanded || !isCoarsePointer) return;

    const handleOutsideClick = () => {
      setExpanded(false);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [expanded, isCoarsePointer]);

  // Clean up timeout
  React.useEffect(() => {
    return () => {
      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    };
  }, []);

  return (
    <RadixToast.Provider swipeDirection={isCompact ? "up" : "right"}>
      <RadixToast.Viewport
        className={cn(
          "fixed z-400 flex w-full max-w-97.5 outline-none",
          isCompact
            ? "top-0 left-1/2 -translate-x-1/2 p-4 pt-[max(var(--space-4),var(--safe-area-top))]"
            : "bottom-0 right-0 p-6 pb-[max(var(--space-6),var(--safe-area-bottom))]"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDownCapture={handlePointerDown}
      >
        <div
          className="relative w-full"
          style={{
            // Every item below is absolutely positioned (see ToastItem), so
            // nothing here is derived from document flow -- the wrapper's
            // own height has to be set explicitly in both states, computed
            // purely from measured per-item heights. Deriving it from a
            // flow-participating child instead created a feedback loop: a
            // child's own measured height would depend on this height,
            // which depends on that same measurement.
            height:
              toasts.length === 0
                ? 0
                : expanded
                  ? Math.max(
                      toasts.reduce(
                        (sum, t) => sum + (heights[t.id] ?? DEFAULT_TOAST_HEIGHT) + TOAST_GAP,
                        -TOAST_GAP
                      ),
                      0
                    )
                  : (heights[toasts[0].id] ?? DEFAULT_TOAST_HEIGHT),
          }}
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((toast, index) => {
              const expandedY = toasts
                .slice(0, index)
                .reduce((sum, t) => sum + (heights[t.id] ?? DEFAULT_TOAST_HEIGHT) + TOAST_GAP, 0);
              return (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  index={index}
                  isExpanded={expanded}
                  isCompact={isCompact}
                  expandedY={expandedY}
                  onHeightChange={handleHeightChange}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </RadixToast.Viewport>
    </RadixToast.Provider>
  );
}

function ToastItem({
  toast,
  index,
  isExpanded,
  isCompact,
  expandedY,
  onHeightChange,
}: {
  toast: ToastProps;
  index: number;
  isExpanded: boolean;
  isCompact: boolean;
  expandedY: number;
  onHeightChange: (id: string, height: number) => void;
}) {
  const { id, title, description, variant = "default", icon, action, duration } = toast;

  const IconComponent = icon ? icon : VARIANT_ICONS[variant];

  // Stack styling (collapsed):
  // scale -= 0.05
  // opacity -= 0.3 (min 0.4), forced to 0 past STACK_VISIBLE_LIMIT so only
  // the top 3 peek -- older ones stay mounted (their own duration timer
  // keeps running) but invisible until the stack expands.
  // translateY: 8px * index, away from the anchored edge -- up for
  // regular (bottom-anchored), down for compact (top-anchored), so the
  // peek lands inside the viewport instead of clipping past its edge.
  const isPastVisibleLimit = index >= STACK_VISIBLE_LIMIT;
  const scale = isExpanded ? 1 : Math.max(0, 1 - index * 0.05);
  const opacity = isExpanded ? 1 : isPastVisibleLimit ? 0 : Math.max(1 - index * 0.3, 0.4);
  const collapsedY = (isCompact ? 1 : -1) * index * 8;
  const yOffset = isExpanded ? expandedY : collapsedY;

  // On entry, enter from top if compact, or right if regular
  const initialY = isCompact ? -50 : 0;
  const initialX = isCompact ? 0 : 50;

  // Radix portals each Root directly into the Viewport <ol> (see
  // @radix-ui/react-toast's ToastImpl -- it always renders via
  // ReactDOM.createPortal(..., context.viewport)), so this item is never
  // actually nested inside the wrapper div below -- it's a sibling, a
  // direct child of the <ol>. And `top: 0; left: 0` on an absolutely
  // positioned element lands flush with the containing block's *padding
  // box* edge, which visually ignores the ancestor's own padding. So the
  // Viewport's p-4/p-6 padding never insets these items; each one has to
  // carry the same inset itself, mirroring the Viewport's own padding.
  const topInset = isCompact ? "max(var(--space-4),var(--safe-area-top))" : "var(--space-6)";
  const sideInset = isCompact ? "var(--space-4)" : "var(--space-6)";

  const itemRef = React.useRef<HTMLLIElement>(null);

  // Report rendered height so the parent can lay out the expanded stack
  // (§5.3 `toastHeight`) and the collapsed one below can vary with an
  // optional description line instead of assuming a fixed height.
  React.useLayoutEffect(() => {
    const node = itemRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(id, entry.target.getBoundingClientRect().height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, onHeightChange]);

  return (
    <RadixToast.Root
      asChild
      duration={duration}
      onOpenChange={(open) => {
        if (!open) dismissToast(id);
      }}
      forceMount // Rely on AnimatePresence
    >
      <motion.li
        ref={itemRef}
        initial={{ opacity: 0, y: initialY, x: initialX, scale: 1 }}
        animate={{
          opacity,
          scale,
          y: yOffset,
          x: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: { duration: durations.normal },
        }}
        transition={springs.smooth}
        style={{
          // Always absolute (never a flow child of the wrapper), so this
          // item's own rendered size can never feed back into the
          // wrapper's explicit height calculation (see Toaster). Inset via
          // top/left/right (not 0 + width:100%) so the item is actually
          // padded from the screen edge -- see topInset/sideInset above.
          position: "absolute",
          top: topInset,
          left: sideInset,
          right: sideInset,
          zIndex: 100 - index,
        }}
        className={cn(
          "flex items-start gap-3 rounded-lg p-4 shadow-lg outline-none",
          "bg-(--material-thick) backdrop-blur-[20px]",
          // Contrast ring
          "ring-1 ring-inset ring-black/5 dark:ring-white/10"
        )}
      >
        {IconComponent && (
          <div
            className={cn(
              "mt-0.5 shrink-0",
              variant === "success" && "text-[rgb(var(--color-success))]",
              variant === "warning" && "text-[rgb(var(--color-warning))]",
              variant === "destructive" && "text-[rgb(var(--color-destructive))]",
              variant === "default" && "text-label-primary"
            )}
          >
            <Icon name={IconComponent} size="md" />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <RadixToast.Title asChild>
            <Text textStyle="subheadline" weight="semibold">
              {title}
            </Text>
          </RadixToast.Title>
          {description && (
            <RadixToast.Description asChild>
              <Text textStyle="footnote" color="secondary">
                {description}
              </Text>
            </RadixToast.Description>
          )}
        </div>

        {action && (
          <RadixToast.Action asChild altText={action.label}>
            <button
              onClick={(e) => {
                e.stopPropagation(); // don't trigger expand toggle if touched
                action.onPress();
              }}
              className={cn(
                "shrink-0 rounded px-2 py-1 outline-none transition-colors",
                "text-subheadline font-semibold text-tint",
                "hover:bg-black/5 active:bg-black/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tint"
              )}
            >
              {action.label}
            </button>
          </RadixToast.Action>
        )}
      </motion.li>
    </RadixToast.Root>
  );
}
