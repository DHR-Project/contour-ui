"use client";

import * as React from "react";
import { Toast as RadixToast } from "radix-ui";
import { motion, AnimatePresence } from "framer-motion";
import { useToast, dismissToast, clearToasts } from "./use-toast";
import type { ToastProps } from "./use-toast";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";

const VARIANT_ICONS: Record<string, IconName> = {
  success: "circle-check",
  warning: "triangle-alert",
  destructive: "circle-alert",
};

// Fallback used for an item's contribution to the expanded stack height
// before its ResizeObserver has reported an actual measurement.
const DEFAULT_TOAST_HEIGHT = 64;
// Gap between toasts in the expanded list. --space-3 rather than the
// --space-2 of contour-spec-toast-v2.md §5.3: at 8px two dark, low-contrast
// toast surfaces on a dark backdrop read as one glued-together block.
const TOAST_GAP = 12;
const STACK_PEEK = 8; // per-layer offset of the collapsed "paper stack"

// §5.1: the paper-stack peek only ever shows the top 3 -- this is a
// collapsed-display rule, not a cap on how many toasts can be active (see
// use-toast.ts). Expanding the stack shows all of them regardless.
const STACK_VISIBLE_LIMIT = 3;

// §5.2: mouseleave debounce, so crossing a gap between two toasts doesn't
// flicker the stack shut.
const HOVER_COLLAPSE_DELAY = 300;

// By default the expanded list may use the whole page height before it starts
// scrolling -- it is the stack's own list, not a popover, so there's nothing
// underneath worth reserving room for.

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Either one fixed position for every size class, or a per-size-class pair.
 * The default is adaptive: `top-center` on compact, `bottom-right` on
 * regular+ -- toasts drop from the top on phones and settle in the corner on
 * larger, pointer-driven layouts.
 */
export type ToastPositionProp =
  | ToastPosition
  | { compact?: ToastPosition; regular?: ToastPosition };

export interface ToasterProps {
  /** Where the stack is anchored. Defaults to `{ compact: "top-center", regular: "bottom-right" }`. */
  position?: ToastPositionProp;
  /**
   * Height (px) the expanded list may reach before it scrolls internally.
   * Defaults to the full page height.
   */
  expandedMaxHeight?: number;
  /** Label of the button that collapses an open list. */
  showLessLabel?: string;
  /** Label of the button that dismisses every toast at once. */
  clearLabel?: string;
  className?: string;
}

const DEFAULT_COMPACT_POSITION: ToastPosition = "top-center";
const DEFAULT_REGULAR_POSITION: ToastPosition = "bottom-right";

type ToastEdge = "top" | "bottom";
type ToastAlign = "left" | "center" | "right";

function resolvePosition(
  position: ToastPositionProp | undefined,
  isCompact: boolean,
): ToastPosition {
  const fallback = isCompact
    ? DEFAULT_COMPACT_POSITION
    : DEFAULT_REGULAR_POSITION;
  if (!position) return fallback;
  if (typeof position === "string") return position;
  return (isCompact ? position.compact : position.regular) ?? fallback;
}

// Expansion is a three-state machine rather than a boolean: hovering only
// previews the list (it collapses again on mouseleave), while a tap/click
// pins it open until "Show Less" is pressed -- the grouped-notification
// pattern §5.4 describes.
type Expansion = "collapsed" | "hover" | "pinned";

export function Toaster({
  position,
  expandedMaxHeight,
  showLessLabel = "Show Less",
  clearLabel = "Clear",
  className,
}: ToasterProps = {}) {
  const { toasts } = useToast();
  const sizeClass = useSizeClass();
  const isCoarsePointer = useIsCoarsePointer();
  const isCompact = sizeClass === "compact";

  const resolvedPosition = resolvePosition(position, isCompact);
  const [edge, align] = resolvedPosition.split("-") as [ToastEdge, ToastAlign];
  const isBottomAnchored = edge === "bottom";

  const [expansion, setExpansion] = React.useState<Expansion>("collapsed");
  const isExpanded = expansion !== "collapsed";
  const collapseTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const viewportRef = React.useRef<HTMLOListElement>(null);

  // Measured heights per toast id, used to lay out the fully expanded
  // vertical list (§5.3: `y: index * (toastHeight + 8)`), since toast
  // height varies with an optional description line.
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const handleHeightChange = React.useCallback((id: string, height: number) => {
    setHeights((prev) =>
      prev[id] === height ? prev : { ...prev, [id]: height },
    );
  }, []);
  const handleHeightRelease = React.useCallback((id: string) => {
    setHeights((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const [actionsHeight, setActionsHeight] = React.useState(0);

  // The available window height is only read on the client (and on resize),
  // never during render, so the server and first client render agree.
  const [windowHeight, setWindowHeight] = React.useState(0);
  React.useEffect(() => {
    const update = () => setWindowHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Collapse whenever the stack empties, so the next batch of toasts starts
  // stacked again instead of inheriting a stale pinned-open state. Adjusted
  // during render (React's derive-state-from-props escape hatch) rather than
  // in an effect, which would cost an extra committed render first.
  const isEmpty = toasts.length === 0;
  const [wasEmpty, setWasEmpty] = React.useState(true);
  if (isEmpty !== wasEmpty) {
    setWasEmpty(isEmpty);
    if (isEmpty && expansion !== "collapsed") setExpansion("collapsed");
  }

  React.useEffect(() => {
    return () => {
      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Layout
  //
  // Everything below is laid out downward from the top of the viewport's
  // padding box, including bottom-anchored positions: the viewport box
  // itself is what's pinned to the bottom edge, and it grows upward as the
  // stack gets taller. Keeping every offset positive is what makes the
  // expanded list scrollable -- overflow above a scroll container's top edge
  // is unreachable, so a bottom-anchored list built out of negative offsets
  // could never scroll.
  // -------------------------------------------------------------------------
  const itemHeights = toasts.map(
    (toast) => heights[toast.id] ?? DEFAULT_TOAST_HEIGHT,
  );
  const stackHeight = Math.max(
    itemHeights.reduce((sum, height) => sum + height + TOAST_GAP, -TOAST_GAP),
    0,
  );
  // How far the collapsed peek extends past the front toast, so the hit area
  // (and the box the peek is drawn in) covers the whole paper stack.
  const peekExtent =
    Math.min(toasts.length - 1, STACK_VISIBLE_LIMIT - 1) * STACK_PEEK;
  const collapsedHeight =
    toasts.length === 0 ? 0 : (itemHeights[0] ?? 0) + Math.max(peekExtent, 0);

  // Visible for as long as the list is open -- including a hover preview, so
  // the way out of the list never has to be discovered by clicking first.
  const showsActions = isExpanded && toasts.length > 1;
  const edgeInset = isCompact ? 16 : 24;
  // Room the action row occupies at the anchored edge. It is reserved with
  // animated padding on the wrapper rather than by putting the row in flow:
  // the row appears the instant the list opens, and an unanimated flow child
  // would shove the whole stack sideways in one frame.
  const actionsSpace = showsActions ? actionsHeight + TOAST_GAP : 0;

  const expandedOffsets: number[] = [];
  let runningOffset = 0;
  for (const height of itemHeights) {
    expandedOffsets.push(
      isBottomAnchored ? stackHeight - runningOffset - height : runningOffset,
    );
    runningOffset += height + TOAST_GAP;
  }

  // The Viewport's padding sits inside the scroll box, so the list has that
  // much less room before it has to scroll. The anchored edge can grow past it
  // with a safe-area inset; the estimate only shifts the scroll threshold by
  // that much, never the layout.
  const viewportPaddingY = edgeInset * 2;
  const maxHeight = expandedMaxHeight ?? windowHeight;
  const listMaxHeight = Math.max(maxHeight - actionsSpace, 0);
  const contentHeight =
    (isExpanded ? stackHeight : collapsedHeight) + viewportPaddingY;
  // Clipping is only switched on when the list genuinely overflows: an
  // `overflow-y: auto` box also clips horizontally, which would cut off
  // swipe-to-dismiss and the toast shadows.
  const needsScroll =
    isExpanded && maxHeight > 0 && contentHeight > listMaxHeight;

  // With the list scrolling, the newest toast is the one to keep in view --
  // it sits at the far end of the content for bottom-anchored positions.
  const anchorScroll = React.useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    node.scrollTop = isBottomAnchored ? node.scrollHeight : 0;
  }, [isBottomAnchored]);

  // Re-anchored from three places, because none of them alone lands on the
  // final geometry: the stack's height is animated, so at the moment the list
  // becomes scrollable the DOM is still the size it was before the spring
  // started, and Framer's onUpdate runs before the frame's DOM write. The
  // rAF pass here catches the post-paint size, and onAnimationComplete on the
  // stack wrapper below catches the settled one.
  React.useLayoutEffect(() => {
    if (!needsScroll) return;
    anchorScroll();
    const frame = requestAnimationFrame(anchorScroll);
    return () => cancelAnimationFrame(frame);
  }, [needsScroll, anchorScroll, stackHeight, actionsSpace]);

  // -------------------------------------------------------------------------
  // Expand / collapse triggers (§5.2, §5.4)
  // -------------------------------------------------------------------------
  const handleMouseEnter = () => {
    if (isCoarsePointer) return;
    if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    setExpansion((prev) =>
      prev === "collapsed" && toasts.length > 1 ? "hover" : prev,
    );
  };

  const handleMouseLeave = () => {
    if (isCoarsePointer) return;
    if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    collapseTimeout.current = setTimeout(() => {
      // A pinned list stays open on mouseleave -- only the hover preview
      // collapses on its own.
      setExpansion((prev) => (prev === "hover" ? "collapsed" : prev));
    }, HOVER_COLLAPSE_DELAY);
  };

  const handleClick = (event: React.MouseEvent) => {
    // Toast actions and the Show Less button own their clicks.
    if ((event.target as HTMLElement).closest("button, a, [role='button']"))
      return;
    if (toasts.length < 2) return;
    setExpansion((prev) => (prev === "pinned" ? "collapsed" : "pinned"));
  };

  return (
    <RadixToast.Provider swipeDirection={swipeDirectionFor(edge, align)}>
      {/* Anchor wrapper. It owns the screen position and the expand/collapse
          gestures, so the action row can sit outside the scroll box and still
          count as "inside the stack" for hover purposes. Keeping those buttons
          out of the scroller is what stops the scroll mask from dimming them
          and stops them from scrolling out of reach.

          The row's own space is reserved by animating this element's padding
          on the anchored side, in lockstep with the stack's expand spring --
          a flow child would appear at full height in a single frame and jolt
          the whole stack. */}
      <motion.div
        className={cn(
          // pointer-events are re-enabled per child, so the padded, mostly
          // empty box never swallows clicks meant for the page.
          "pointer-events-none fixed z-400 flex w-full max-w-97.5 flex-col outline-none",
          edge === "top" ? "top-0" : "bottom-0",
          align === "left" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "right" && "right-0",
          className,
        )}
        initial={false}
        animate={{
          paddingTop: edge === "top" ? actionsSpace : 0,
          paddingBottom: edge === "top" ? 0 : actionsSpace,
        }}
        transition={springs.smooth}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <ToastActions
          visible={showsActions}
          showLessLabel={showLessLabel}
          clearLabel={clearLabel}
          edge={edge}
          isCompact={isCompact}
          isCoarsePointer={isCoarsePointer}
          onHeightChange={setActionsHeight}
          onShowLess={() => setExpansion("collapsed")}
          onClear={clearToasts}
        />

        <RadixToast.Viewport
          ref={viewportRef}
          className={cn(
            "pointer-events-none relative w-full min-h-0 shrink-0 list-none outline-none",
            isCompact ? "p-4" : "p-6",
            edge === "top"
              ? isCompact
                ? "pt-[max(var(--space-4),var(--safe-area-top))]"
                : "pt-[max(var(--space-6),var(--safe-area-top))]"
              : isCompact
                ? "pb-[max(var(--space-4),var(--safe-area-bottom))]"
                : "pb-[max(var(--space-6),var(--safe-area-bottom))]",
            // No need scroll-mask here, it makes the blur not works
            // House rule: a scroll container always fades its clipped edge
            // rather than cutting content off mid-toast.
            // needsScroll && "scroll-mask-y",
          )}
          style={{
            maxHeight: needsScroll ? listMaxHeight : undefined,
            overflowY: needsScroll ? "auto" : "visible",
          }}
        >
          <motion.div
            className="pointer-events-auto relative w-full shrink-0"
            initial={false}
            // Every item below is absolutely positioned (see ToastItem), so
            // nothing here is derived from document flow -- the wrapper's own
            // height has to be set explicitly in both states, computed purely
            // from measured per-item heights. Deriving it from a
            // flow-participating child instead created a feedback loop: a
            // child's own measured height would depend on this height, which
            // depends on that same measurement.
            //
            // It's animated with the same spring the items use because for a
            // bottom-anchored stack the box grows upward by exactly as much as
            // each item's offset grows downward. Snapping the height while the
            // offsets animate would make the front toast jump up and slide
            // back; animating both in lockstep holds it perfectly still.
            animate={{ height: isExpanded ? stackHeight : collapsedHeight }}
            transition={springs.smooth}
            onUpdate={needsScroll ? anchorScroll : undefined}
            onAnimationComplete={needsScroll ? anchorScroll : undefined}
          >
            <AnimatePresence mode="popLayout">
              {toasts.map((toast, index) => (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  index={index}
                  isExpanded={isExpanded}
                  isCompact={isCompact}
                  edge={edge}
                  expandedY={expandedOffsets[index]}
                  collapsedY={
                    isBottomAnchored
                      ? peekExtent - index * STACK_PEEK
                      : index * STACK_PEEK
                  }
                  onHeightChange={handleHeightChange}
                  onHeightRelease={handleHeightRelease}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </RadixToast.Viewport>
      </motion.div>
    </RadixToast.Provider>
  );
}

// Radix takes a single swipe axis for the whole viewport: swipe toward the
// screen edge the stack is anchored to. Left/right-aligned stacks are closest
// to a side edge, centered ones to the top/bottom edge they hang from.
function swipeDirectionFor(edge: ToastEdge, align: ToastAlign) {
  if (align === "left") return "left" as const;
  if (align === "right") return "right" as const;
  return edge === "top" ? ("up" as const) : ("down" as const);
}

// The controls that sit at the anchored edge of an open list (§5.4): the way
// back to a collapsed stack, and a way to dismiss everything at once. They are
// siblings of the Viewport rather than children, so the scroll box can never
// scroll them away or dim them through the scroll mask, and they are absolutely
// positioned so their appearance never displaces the list -- the wrapper
// reserves their room with animated padding instead.
function ToastActions({
  visible,
  showLessLabel,
  clearLabel,
  edge,
  isCompact,
  isCoarsePointer,
  onHeightChange,
  onShowLess,
  onClear,
}: {
  visible: boolean;
  showLessLabel: string;
  clearLabel: string;
  edge: ToastEdge;
  isCompact: boolean;
  isCoarsePointer: boolean;
  onHeightChange: (height: number) => void;
  onShowLess: () => void;
  onClear: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      onHeightChange(0);
      return;
    }
    // offsetHeight, not getBoundingClientRect(), so the scale transform of
    // the enter animation doesn't leak into the layout math.
    const report = () => onHeightChange(node.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => {
      observer.disconnect();
      onHeightChange(0);
    };
  }, [visible, onHeightChange]);

  const edgeInsetClass =
    edge === "top"
      ? isCompact
        ? "top-[max(var(--space-4),var(--safe-area-top))]"
        : "top-[max(var(--space-6),var(--safe-area-top))]"
      : isCompact
        ? "bottom-[max(var(--space-4),var(--safe-area-bottom))]"
        : "bottom-[max(var(--space-6),var(--safe-area-bottom))]";

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: { duration: durations.fast },
          }}
          transition={springs.smooth}
          className={cn(
            "absolute inset-x-0 z-200 flex items-center justify-center gap-2",
            isCompact ? "px-4" : "px-6",
            edgeInsetClass,
          )}
        >
          <button
            type="button"
            onClick={onShowLess}
            className={cn(
              ACTION_PILL,
              "gap-1 px-3 py-1.5 text-footnote font-semibold text-tint",
            )}
          >
            <Icon
              name={edge === "top" ? "chevron-up" : "chevron-down"}
              size="sm"
            />
            {showLessLabel}
          </button>

          <ClearButton
            label={clearLabel}
            isCoarsePointer={isCoarsePointer}
            onClear={onClear}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ACTION_PILL = cn(
  "pointer-events-auto flex shrink-0 items-center rounded-full outline-none",
  "bg-(--material-thick) shadow-lg ring-1 ring-inset ring-black/5 backdrop-blur-[20px] dark:ring-white/10",
  "hover:bg-black/5 active:bg-black/10",
  "focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]",
);

// Dismisses every toast. With a mouse the intent is already legible -- a
// tooltip names the action and one click runs it. On touch there is no hover
// to read the label from, so the first tap arms the button instead: it widens
// and cross-fades the icon into the word, and the second tap clears. Tapping
// anywhere else disarms it, so a stray tap never wipes the stack.
function ClearButton({
  label,
  isCoarsePointer,
  onClear,
}: {
  label: string;
  isCoarsePointer: boolean;
  onClear: () => void;
}) {
  const [armRequested, setArmRequested] = React.useState(false);
  // Derived, not stored: a pointer that stops being coarse (a tablet paired
  // with a mouse) must not leave the button stuck in its armed shape.
  const armed = isCoarsePointer && armRequested;
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!armed) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current?.contains(event.target as Node)) return;
      setArmRequested(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [armed]);

  const handleClick = () => {
    if (!isCoarsePointer || armed) {
      setArmRequested(false);
      onClear();
      return;
    }
    setArmRequested(true);
  };

  const button = (
    <motion.button
      ref={ref}
      type="button"
      layout
      onClick={handleClick}
      transition={springs.smooth}
      aria-label={label}
      className={cn(
        ACTION_PILL,
        "justify-center overflow-hidden py-1.5 text-footnote font-semibold text-tint",
        armed ? "px-3" : "px-2",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {armed ? (
          <motion.span
            key="label"
            layout="position"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: durations.fast }}
            className="whitespace-nowrap"
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="icon"
            layout="position"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: durations.fast }}
            className="flex"
          >
            <Icon name="close" size="sm" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  // The tooltip is what carries the label for a pointer user, so it is gated
  // on the input modality rather than the size class -- a touch tablet is
  // regular-width but still has no hover to reveal it.
  return isCoarsePointer ? button : <Tooltip content={label}>{button}</Tooltip>;
}

function ToastItem({
  toast,
  index,
  isExpanded,
  isCompact,
  edge,
  expandedY,
  collapsedY,
  onHeightChange,
  onHeightRelease,
}: {
  toast: ToastProps;
  index: number;
  isExpanded: boolean;
  isCompact: boolean;
  edge: ToastEdge;
  expandedY: number;
  collapsedY: number;
  onHeightChange: (id: string, height: number) => void;
  onHeightRelease: (id: string) => void;
}) {
  const {
    id,
    title,
    description,
    variant = "default",
    icon,
    action,
    duration,
  } = toast;

  const IconComponent = icon ? icon : VARIANT_ICONS[variant];

  // Stack styling (collapsed):
  // scale -= 0.05
  // opacity -= 0.3 (min 0.4), forced to 0 past STACK_VISIBLE_LIMIT so only
  // the top 3 peek -- older ones stay mounted (their own duration timer
  // keeps running) but invisible until the stack expands.
  // The 8px-per-layer peek offset is computed by the parent, which knows
  // which edge the stack hangs from.
  const isPastVisibleLimit = index >= STACK_VISIBLE_LIMIT;
  const scale = isExpanded ? 1 : Math.max(0, 1 - index * 0.05);
  const opacity = isExpanded
    ? 1
    : isPastVisibleLimit
      ? 0
      : Math.max(1 - index * 0.3, 0.4);
  const yOffset = isExpanded ? expandedY : collapsedY;

  // Toasts always travel along the vertical axis, never sideways: down from
  // above for a top-anchored stack, up from below for a bottom-anchored one.
  // Alignment only decides where the stack sits, not how it arrives.
  const initialY = edge === "top" ? -50 : 50;

  // Radix portals each Root directly into the Viewport <ol> (see
  // @radix-ui/react-toast's ToastImpl -- it always renders via
  // ReactDOM.createPortal(..., context.viewport)), so this item is never
  // actually nested inside the wrapper div above -- it's a sibling, a
  // direct child of the <ol>. And `top: 0; left: 0` on an absolutely
  // positioned element lands flush with the containing block's *padding
  // box* edge, which visually ignores the ancestor's own padding. So the
  // Viewport's p-4/p-6 padding never insets these items; each one has to
  // carry the same inset itself, mirroring the Viewport's own padding.
  const edgeInset = isCompact
    ? "max(var(--space-4),var(--safe-area-top))"
    : "max(var(--space-6),var(--safe-area-top))";
  const topInset =
    edge === "top"
      ? edgeInset
      : isCompact
        ? "var(--space-4)"
        : "var(--space-6)";
  const sideInset = isCompact ? "var(--space-4)" : "var(--space-6)";

  const itemRef = React.useRef<HTMLLIElement>(null);

  // Report rendered height so the parent can lay out the expanded stack
  // (§5.3 `toastHeight`) and the collapsed one below can vary with an
  // optional description line instead of assuming a fixed height.
  React.useLayoutEffect(() => {
    const node = itemRef.current;
    if (!node) return;
    // offsetHeight rather than getBoundingClientRect().height: the latter is
    // measured *after* the collapsed stack's scale transform, so back layers
    // would report a height 5-10% short of their real layout height.
    const observer = new ResizeObserver(() =>
      onHeightChange(id, node.offsetHeight),
    );
    observer.observe(node);
    onHeightChange(id, node.offsetHeight);
    return () => {
      observer.disconnect();
      onHeightRelease(id);
    };
  }, [id, onHeightChange, onHeightRelease]);

  return (
    <RadixToast.Root
      asChild
      duration={duration}
      // §7: warning/destructive are announced immediately (assertive),
      // everything else politely.
      type={
        variant === "warning" || variant === "destructive"
          ? "foreground"
          : "background"
      }
      onOpenChange={(open) => {
        if (!open) dismissToast(id);
      }}
      forceMount // Rely on AnimatePresence
    >
      <motion.li
        ref={itemRef}
        initial={{ opacity: 0, y: initialY, x: 0, scale: 1 }}
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
          pointerEvents: "auto",
        }}
        className={cn(
          "flex items-start gap-3 rounded-lg p-4 shadow-lg outline-none",
          "bg-(--material-thick) backdrop-blur-[20px]",
          // Contrast ring
          "ring-1 ring-inset ring-black/5 dark:ring-white/10",
        )}
      >
        {IconComponent && (
          <div
            className={cn(
              "mt-0.5 shrink-0",
              variant === "success" && "text-[rgb(var(--color-success))]",
              variant === "warning" && "text-[rgb(var(--color-warning))]",
              variant === "destructive" &&
                "text-[rgb(var(--color-destructive))]",
              variant === "default" && "text-label-primary",
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
                "hover:bg-black/5 active:bg-black/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tint",
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
