"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Slot } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { mergeRefs } from "@/lib/utils/merge-refs";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";

export type ScrollRailOrientation = "horizontal" | "vertical";

export interface ScrollRailProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  /** Scrolls the child at this index into view (centered) when it changes. */
  activeIndex?: number;
  /** Always hidden at the compact size-class (touch/narrow-viewport swipe is the primary interaction there), regardless of this prop. default true */
  showArrows?: boolean;
  /** default "horizontal" */
  orientation?: ScrollRailOrientation;
  /** Renders the scroll track as `children`'s own root element instead of a `div`. `children` must be a single element when true. default false */
  asChild?: boolean;
  className?: string;
}

const ARROW_ICON: Record<ScrollRailOrientation, { start: "chevron-left" | "chevron-up"; end: "chevron-right" | "chevron-down" }> = {
  horizontal: { start: "chevron-left", end: "chevron-right" },
  vertical: { start: "chevron-up", end: "chevron-down" },
};

export const ScrollRail = forwardRef<HTMLDivElement, ScrollRailProps>(function ScrollRail(
  { children, activeIndex, showArrows = true, orientation = "horizontal", asChild = false, className, ...rest },
  ref,
) {
  const axis = orientation === "horizontal" ? "x" : "y";
  const trackRef = useRef<HTMLDivElement>(null);
  const [showStartArrow, setShowStartArrow] = useState(false);
  const [showEndArrow, setShowEndArrow] = useState(false);
  const reducedMotion = useReducedMotion();
  const arrowTransition = reducedMotion ? { duration: 0 } : springs.snappy;
  // Compact = touch/narrow viewport, where swiping the track directly is
  // the expected gesture -- arrow buttons are regular+ chrome for
  // mouse/trackpad users, same tier as Button's own compact-vs-regular
  // touch-target handling (button.tsx's `md:min-h-0`).
  const sizeClass = useSizeClass();
  const arrowsEnabled = showArrows && sizeClass !== "compact";

  const checkScrollLimits = () => {
    const track = trackRef.current;
    if (!track) return;
    if (axis === "x") {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      setShowStartArrow(scrollLeft > 1);
      setShowEndArrow(scrollLeft + clientWidth < scrollWidth - 2);
    } else {
      const { scrollTop, scrollHeight, clientHeight } = track;
      setShowStartArrow(scrollTop > 1);
      setShowEndArrow(scrollTop + clientHeight < scrollHeight - 2);
    }
  };

  // Watch for activeIndex and scroll to the corresponding item.
  useEffect(() => {
    const track = trackRef.current;
    const target = activeIndex !== undefined ? (track?.children?.[activeIndex] as HTMLElement) : undefined;
    if (!track || !target) return;

    const trackRect = track.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (axis === "x") {
      const relativeOffset = targetRect.left - trackRect.left + track.scrollLeft;
      const scrollToPoint = relativeOffset - trackRect.width / 2 + targetRect.width / 2;
      track.scrollTo({ left: scrollToPoint, behavior: "smooth" });
    } else {
      const relativeOffset = targetRect.top - trackRect.top + track.scrollTop;
      const scrollToPoint = relativeOffset - trackRect.height / 2 + targetRect.height / 2;
      track.scrollTo({ top: scrollToPoint, behavior: "smooth" });
    }
  }, [activeIndex, axis]);

  // Set up listeners for scroll and layout/content changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    checkScrollLimits();

    track.addEventListener("scroll", checkScrollLimits, { passive: true });

    const resizeObserver = new ResizeObserver(checkScrollLimits);
    resizeObserver.observe(track);

    const mutationObserver = new MutationObserver(checkScrollLimits);
    mutationObserver.observe(track, { childList: true, subtree: true });

    // Extra check after DOM updates settle.
    const timeoutId = setTimeout(checkScrollLimits, 100);

    return () => {
      track.removeEventListener("scroll", checkScrollLimits);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, axis]);

  const scroll = (direction: "backward" | "forward") => {
    const track = trackRef.current;
    if (!track) return;
    const sign = direction === "backward" ? -1 : 1;
    if (axis === "x") {
      track.scrollBy({ left: sign * track.clientWidth * 0.7, behavior: "smooth" });
    } else {
      track.scrollBy({ top: sign * track.clientHeight * 0.7, behavior: "smooth" });
    }
  };

  const icons = ARROW_ICON[orientation];
  const Track = asChild ? Slot.Root : "div";

  return (
    <Flex
      direction={orientation === "horizontal" ? "row" : "column"}
      align="center"
      justify="center"
      container={false}
      className="relative w-full h-full"
    >
      <AnimatePresence>
        {arrowsEnabled && showStartArrow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={arrowTransition}
            className={cn(
              "absolute z-10",
              orientation === "horizontal" ? "left-2" : "top-2",
            )}
          >
            <Button
              variant="plain"
              size="sm"
              leadingIcon={icons.start}
              aria-label="Scroll backward"
              onClick={() => scroll("backward")}
              className="rounded-full bg-(--material-thick) shadow-md backdrop-blur-[20px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Track
        ref={mergeRefs(ref, trackRef)}
        className={cn(
          "flex no-scrollbar snap-mandatory *:transition-all *:snap-center *:snap-always w-full h-full",
          orientation === "horizontal"
            ? "flex-row overflow-x-auto snap-x scroll-mask-x"
            : "flex-col overflow-y-auto snap-y scroll-mask-y",
          className,
        )}
        {...rest}
      >
        {children}
      </Track>

      <AnimatePresence>
        {arrowsEnabled && showEndArrow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={arrowTransition}
            className={cn(
              "absolute z-10",
              orientation === "horizontal" ? "right-2" : "bottom-2",
            )}
          >
            <Button
              variant="plain"
              size="sm"
              leadingIcon={icons.end}
              aria-label="Scroll forward"
              onClick={() => scroll("forward")}
              className="rounded-full bg-(--material-thick) shadow-md backdrop-blur-[20px]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
});
