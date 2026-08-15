"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { useDrag } from "@use-gesture/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import type { SemanticColorToken } from "@/lib/types/color.types";
// Direct import (not the barrel) -- ContextMenu re-exports from a module
// that, in turn, gets imported here, which Rollup flags as a circular chunk
// dependency when routed through index.ts. DropdownItemDef is only a type
// (contextMenuItems' shape), so it carries no such risk.
import type { DropdownItemDef } from "@/components/ui/dropdown/dropdown";
import { ContextMenu } from "@/components/ui/context-menu/context-menu";
import { ListItemContent } from "./list-item-content";

// contour-spec-context-menu.md SS3 -- long-press threshold and movement
// tolerance before it's disqualified as a swipe/scroll instead.
const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE_PX = 10;

// Mirrors --swipe-action-width (design-tokens-summary.md SS4.7) as a JS
// number -- gesture math needs an actual pixel value, not a CSS var string.
const SWIPE_ACTION_WIDTH = 80;

// How long a non-confirm action's tap-feedback flash holds at full width
// before auto-reverting (contour-spec-list.md SS4.5) -- comfortably longer
// than springs.snappy's settle time so the expand actually reads before it
// collapses back, not a half-open flicker.
const FLASH_HOLD_MS = 450;

export type SwipeActionColor = "destructive" | "default" | SemanticColorToken;

export interface SwipeAction {
  icon: IconName;
  label: string;
  color: SwipeActionColor;
  onAction: () => void;
  /** Arms instead of running immediately: the button expands to fill the row
   * (everything else fades out) and a second tap on it is what actually runs
   * `onAction` -- tapping outside or Escape cancels back. For actions worth
   * a beat of friction (contour-spec-list.md SS4.5). Actions without this
   * still run `onAction` on the first tap as always, but get the same
   * full-row expand as tap feedback, auto-reverting on its own afterward. */
  confirm?: boolean;
}

export interface ListItemProps {
  leadingIcon?: IconName;
  title: string;
  subtitle?: string;
  trailingIcon?: IconName;
  trailingText?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Separator starts after the leading icon instead of spanning full width. Default true. */
  separatorInset?: boolean;
  leadingAction?: SwipeAction;
  /** Max 3 -- extras beyond the 3rd are ignored (contour-spec-list.md SS4.1). */
  trailingActions?: SwipeAction[];
  /** Additive, not breaking (contour-spec-context-menu.md) -- long-press on
   * touch / right-click on desktop. Touch behavior is byte-for-byte
   * unchanged from today when this isn't passed. */
  contextMenuItems?: DropdownItemDef[];
}

const ACTION_BG: Record<SwipeActionColor, string> = {
  destructive: "bg-[rgb(var(--color-destructive))]",
  default: "bg-fill-secondary",
  tint: "bg-[rgb(var(--tint))]",
  success: "bg-[rgb(var(--color-success))]",
  warning: "bg-[rgb(var(--color-warning))]",
  info: "bg-[rgb(var(--color-info))]",
};

const ACTION_TEXT: Record<SwipeActionColor, string> = {
  destructive: "text-white",
  default: "text-label-primary",
  tint: "text-white",
  success: "text-white",
  warning: "text-white",
  info: "text-white",
};

// Reserves room on the row's own padding for the revealed action overlay
// (desktop only) so title/subtitle truncate out of the way instead of being
// covered mid-text -- static Tailwind classes since these need to be
// statically extractable (see cn.ts / lib/ui/spacing.ts for the same
// constraint). Each value is N * SWIPE_ACTION_WIDTH plus --gap-icon-text so
// the revealed action doesn't sit flush against the row content with zero
// breathing room.
// Only 1 and 2 are hover-gated -- at 3 trailing actions the row is always
// `trailingCollapsed` on desktop, which reserves a 1-slot width for the
// "..." trigger while closed, and this 3-slot width (unconditionally, not
// hover-gated, since the open state is a click-driven React state, not a
// live :hover) once opened. Content stays anchored/visible either way --
// this reserve narrows it via padding, it never gets translated off-canvas.
const TRAILING_COLLAPSED_OPEN_RESERVE_CLASS = "pr-[calc(3*var(--swipe-action-width)+var(--gap-icon-text))]";
const TRAILING_RESERVE_CLASS: Record<number, string> = {
  1: "group-hover-fine:pr-[calc(var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pr-[calc(var(--swipe-action-width)+var(--gap-icon-text))]",
  2: "group-hover-fine:pr-[calc(2*var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pr-[calc(2*var(--swipe-action-width)+var(--gap-icon-text))]",
};
const LEADING_RESERVE_CLASS =
  "group-hover-fine:pl-[calc(var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pl-[calc(var(--swipe-action-width)+var(--gap-icon-text))]";

function ActionButton({ action, width }: { action: SwipeAction; width: number | string }) {
  return (
    <button
      type="button"
      onClick={action.onAction}
      style={{ width }}
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1",
        ACTION_BG[action.color],
        ACTION_TEXT[action.color],
      )}
    >
      <Icon name={action.icon} size="sm" />
      <Text as="span" textStyle="caption-1" className="text-inherit">
        {action.label}
      </Text>
    </button>
  );
}

export function ListItem({
  leadingIcon,
  title,
  subtitle,
  trailingIcon,
  trailingText,
  onClick,
  disabled = false,
  separatorInset = true,
  leadingAction,
  trailingActions = [],
  contextMenuItems,
}: ListItemProps) {
  const isCoarsePointer = useIsCoarsePointer();
  const reduceMotion = useReducedMotion();
  const [x, setX] = useState(0);
  const [collapsedOpen, setCollapsedOpen] = useState(false);
  // Which action (if any) is currently expanded full-row awaiting a second,
  // confirming tap -- keyed by "leading" or the trailing action's label
  // (labels are already assumed unique per row, same as the React `key`s
  // below) since actions don't carry a dedicated id.
  const [armedAction, setArmedAction] = useState<{ key: string; action: SwipeAction } | null>(null);
  // Same full-row expand as armedAction, but for a non-confirm action's tap
  // feedback -- self-clears via flashTimerRef instead of waiting for a
  // second tap/outside-click/Escape.
  const [flashAction, setFlashAction] = useState<{ key: string; action: SwipeAction } | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressOriginRef = useRef<{ x: number; y: number } | null>(null);

  // Extras beyond the 3rd are ignored -- a list item only supports up to 3
  // trailing actions (contour-spec-list.md SS4.1).
  const visibleTrailing = trailingActions.slice(0, 3);
  const trailingWidth = visibleTrailing.length * SWIPE_ACTION_WIDTH;
  const leadingWidth = leadingAction ? SWIPE_ACTION_WIDTH : 0;
  // Desktop only (contour-spec-list.md SS4.4 update): 3 trailing actions is
  // too much to hover-reveal inline -- collapse to a single "..." trigger.
  // Clicking it opens an opaque overlay with all 3 actions, the same
  // padding-reserve + overlay treatment the 1-2 action case already uses
  // (not a row translate) -- translating the whole row would clip its own
  // title off-canvas on a narrow row, since the row has no separate "content
  // width" independent of its own left edge.
  const trailingCollapsed = !isCoarsePointer && visibleTrailing.length === 3;

  function clearLongPressTimer() {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressOriginRef.current = null;
  }

  // Extends the row's existing touch handling with a timer-based 3-gesture
  // disambiguation (contour-spec-context-menu.md SS3) instead of a second
  // handler stacked on the same touch area -- when `contextMenuItems` isn't
  // passed, none of this runs and touch behaves exactly as before.
  function handleTouchStart(event: ReactTouchEvent) {
    if (!contextMenuItems || disabled) return;
    const touch = event.touches[0];
    longPressOriginRef.current = { x: touch.clientX, y: touch.clientY };
    longPressTimerRef.current = setTimeout(() => {
      const origin = longPressOriginRef.current;
      longPressTimerRef.current = null;
      longPressOriginRef.current = null;
      setIsLongPressing(true);
      // Feedback (row scale/dim) plays via isLongPressing below; the menu
      // itself opens right away -- Radix's ContextMenu positions off the
      // event's own coordinates (contour-spec-context-menu.md SS1/SS2), not
      // the trigger's bounding box, so a synthetic event at the press point
      // reproduces a native long-press-to-menu without needing the
      // browser's own (non-disambiguable) touch-and-hold handling.
      rowRef.current?.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: origin?.x,
          clientY: origin?.y,
        }),
      );
      setIsLongPressing(false);
    }, LONG_PRESS_MS);
  }

  function handleTouchMove(event: ReactTouchEvent) {
    const origin = longPressOriginRef.current;
    if (!origin) return;
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - origin.x);
    const dy = Math.abs(touch.clientY - origin.y);
    if (dx > LONG_PRESS_MOVE_TOLERANCE_PX || dy > LONG_PRESS_MOVE_TOLERANCE_PX) {
      clearLongPressTimer();
    }
  }

  // Closes the click-opened collapsed-trailing panel (desktop only) on an
  // outside click or Escape -- scoped to `containerRef` (the whole item,
  // actions included) so clicking a revealed action isn't mistaken for
  // "outside" and doesn't race the action's own click handler.
  useEffect(() => {
    if (!collapsedOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setCollapsedOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCollapsedOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [collapsedOpen]);

  // Same outside-click / Escape dismissal for the armed (expand-to-confirm)
  // overlay -- cancels back to the normal row instead of running the action.
  useEffect(() => {
    if (!armedAction) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setArmedAction(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setArmedAction(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [armedAction]);

  // Cancel the pending flash-revert if the row unmounts (e.g. the action
  // itself removed this item) mid-flash, or a later flash replaces it.
  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
    };
  }, []);

  // Routes every action tap through the optional confirm step instead of
  // running `onAction` directly: first tap on a `confirm` action arms it
  // (collapsing any open reveal panel, since the full-row overlay replaces
  // them); tapping the already-armed action is what actually runs it. A
  // non-confirm action runs immediately, same as always, but also gets the
  // same full-row expand as tap feedback -- it just auto-reverts on its own
  // instead of waiting for a second tap.
  function activateAction(key: string, action: SwipeAction) {
    if (armedAction?.key === key) {
      action.onAction();
      setArmedAction(null);
      return;
    }
    if (action.confirm) {
      setArmedAction({ key, action });
      setX(0);
      setCollapsedOpen(false);
      return;
    }
    action.onAction();
    setCollapsedOpen(false);
    if (flashTimerRef.current !== null) clearTimeout(flashTimerRef.current);
    setFlashAction({ key, action });
    flashTimerRef.current = setTimeout(() => {
      setFlashAction(null);
      flashTimerRef.current = null;
    }, FLASH_HOLD_MS);
  }

  const bindDrag = useDrag(
    ({ movement: [mx], last, tap, cancel }) => {
      if (tap || disabled) return;
      if (!leadingAction && trailingWidth === 0) {
        cancel();
        return;
      }
      const clamped = Math.max(-trailingWidth - SWIPE_ACTION_WIDTH, Math.min(leadingWidth + SWIPE_ACTION_WIDTH, mx));
      setX(clamped);

      if (last) {
        const lastTrailing = visibleTrailing[visibleTrailing.length - 1];
        // Full swipe (past the revealed actions plus one more width) commits
        // the outermost action directly, matching the Mail app pattern
        // (contour-spec-list.md SS4.3).
        if (mx <= -(trailingWidth + SWIPE_ACTION_WIDTH) && lastTrailing) {
          lastTrailing.onAction();
          setX(0);
        } else if (mx >= leadingWidth + SWIPE_ACTION_WIDTH && leadingAction) {
          leadingAction.onAction();
          setX(0);
        } else if (mx < -SWIPE_ACTION_WIDTH / 2 && trailingWidth > 0) {
          setX(-trailingWidth);
        } else if (mx > SWIPE_ACTION_WIDTH / 2 && leadingAction) {
          setX(leadingWidth);
        } else {
          setX(0);
        }
      }
    },
    { axis: "x", enabled: isCoarsePointer && !disabled, pointer: { touch: true } },
  );

  // `pointer: { touch: true }` makes @use-gesture bind via onTouchStart/
  // onTouchMove/onTouchEnd (same prop names React uses), so these can't be
  // spread and then re-declared below -- the later JSX prop wins and would
  // silently drop the gesture's own handler. The inline onTouch* handlers
  // below call both instead of letting one clobber the other -- composed as
  // arrow functions written directly in the JSX (rather than a shared
  // helper called during render) so refs read inside handleTouchStart/
  // handleTouchMove/clearLongPressTimer are only ever touched from within an
  // actual event handler, not from a function reference passed through
  // another call while rendering (react-hooks/refs).
  const dragHandlers = bindDrag() as Record<string, ((event: ReactTouchEvent) => void) | undefined>;

  const trailingContent =
    trailingIcon || trailingText ? (
      <>
        {trailingText && (
          <Text as="span" textStyle="body" color="secondary">
            {trailingText}
          </Text>
        )}
        {trailingIcon && <Icon name={trailingIcon} size="sm" color="tint" />}
      </>
    ) : undefined;

  const row = (
    <ListItemContent leadingIcon={leadingIcon} title={title} subtitle={subtitle} trailing={trailingContent} />
  );

  // See TRAILING_RESERVE_CLASS/LEADING_RESERVE_CLASS above -- only needed on
  // desktop where the overlay doesn't otherwise displace anything. Collapsed
  // trailing reserves room for the single "..." trigger while closed, or for
  // all 3 actions once opened -- title/subtitle truncate to make room but
  // stay anchored and visible either way, never translated off-canvas.
  const reserveClass = isCoarsePointer
    ? undefined
    : cn(
        trailingCollapsed
          ? collapsedOpen
            ? TRAILING_COLLAPSED_OPEN_RESERVE_CLASS
            : TRAILING_RESERVE_CLASS[1]
          : visibleTrailing.length > 0 && TRAILING_RESERVE_CLASS[visibleTrailing.length],
        leadingAction && LEADING_RESERVE_CLASS,
        (visibleTrailing.length > 0 || leadingAction) && "transition-[padding] duration-(--duration-fast)",
      );

  // Whichever of the two full-row overlays is currently showing -- only one
  // can be at a time (arming collapses any reveal panel, and the wrapper
  // below goes `inert` while either is up, so a different action can't be
  // tapped to start the other mid-display).
  const overlayAction = armedAction ?? flashAction;

  const content = (
    <div ref={containerRef} className="relative overflow-hidden bg-bg-primary">
      {/* Fades out as a unit while armed or flashing (contour-spec-list.md
          SS4.5) -- the overlay below is the only sibling excluded, so it's
          the only thing left visible/interactive. `inert` (not just
          opacity) so the now-invisible buttons underneath -- the same
          button that's also rendered full-size in the overlay
          -- can't be reached by click, Tab, or a screen reader while hidden. */}
      <div
        inert={!!overlayAction}
        aria-hidden={overlayAction ? true : undefined}
        className={cn(
          "contents",
          // `!opacity-0` (important) -- without it, a still-hovered reveal
          // panel's own `group-hover-fine:opacity-100` ties on specificity
          // and can win depending on Tailwind's utility output order, which
          // would leave it visible even while armed/flashing.
          overlayAction && "[&>*]:!opacity-0 [&>*]:transition-opacity [&>*]:duration-(--duration-fast)",
        )}
      >
        {leadingAction && (
          <div
            className={cn(
              "absolute inset-y-0 left-0",
              // Touch: sits behind the row, revealed as the row is dragged
              // away. Desktop: sits above the row instead and fades in as an
              // opaque overlay over the original icon (contour-spec-list.md
              // SS4.4) -- it can't be behind the row there since nothing
              // moves to expose it.
              isCoarsePointer
                ? "z-0"
                : "z-20 opacity-0 transition-opacity duration-(--duration-fast) group-hover-fine:opacity-100 group-focus-within:opacity-100",
            )}
            style={{ width: SWIPE_ACTION_WIDTH }}
          >
            <ActionButton
              action={{ ...leadingAction, onAction: () => activateAction("leading", leadingAction) }}
              width={SWIPE_ACTION_WIDTH}
            />
          </div>
        )}
        {visibleTrailing.length > 0 && !trailingCollapsed && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex",
              // Touch: sits behind the row, revealed as the row is dragged
              // away. Desktop (<=2 actions only -- see the trailingCollapsed
              // branch below for 3): sits above the row instead and
              // cross-fades in, matching the leading overlay's treatment.
              isCoarsePointer
                ? "z-0"
                : "z-20 opacity-0 transition-opacity duration-(--duration-fast) group-hover-fine:opacity-100 group-focus-within:opacity-100",
            )}
          >
            {visibleTrailing.map((action) => (
              <ActionButton
                key={action.label}
                action={{ ...action, onAction: () => activateAction(action.label, action) }}
                width={SWIPE_ACTION_WIDTH}
              />
            ))}
          </div>
        )}
        {trailingCollapsed && !collapsedOpen && (
          // Plain conditional mount, no framer-motion -- this element's own
          // opacity is CSS-hover-driven (below), and the open panel right
          // below is the same (no AnimatePresence): the row's own
          // `transition-[padding]` already softens the width change, so
          // neither side needs its own enter/exit animation.
          <div
            className="absolute inset-y-0 right-0 z-20 opacity-0 transition-opacity duration-(--duration-fast) group-hover-fine:opacity-100 group-focus-within:opacity-100"
            style={{ width: SWIPE_ACTION_WIDTH }}
          >
            <button
              type="button"
              onClick={() => setCollapsedOpen(true)}
              style={{ width: SWIPE_ACTION_WIDTH }}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1",
                ACTION_BG.default,
                ACTION_TEXT.default,
              )}
              aria-label="Show actions"
            >
              <Icon name="ellipsis" size="sm" />
              <Text as="span" textStyle="caption-1" className="text-inherit">
                More
              </Text>
            </button>
          </div>
        )}
        {trailingCollapsed && collapsedOpen && (
          <div className="absolute inset-y-0 right-0 z-20 flex">
            {visibleTrailing.map((action) => (
              <ActionButton
                key={action.label}
                action={{ ...action, onAction: () => activateAction(action.label, action) }}
                width={SWIPE_ACTION_WIDTH}
              />
            ))}
          </div>
        )}
        <motion.div
          ref={rowRef}
          {...dragHandlers}
          onTouchStart={(event) => {
            dragHandlers.onTouchStart?.(event);
            handleTouchStart(event);
          }}
          onTouchMove={(event) => {
            dragHandlers.onTouchMove?.(event);
            handleTouchMove(event);
          }}
          onTouchEnd={(event) => {
            dragHandlers.onTouchEnd?.(event);
            clearLongPressTimer();
          }}
          onTouchCancel={(event) => {
            dragHandlers.onTouchCancel?.(event);
            clearLongPressTimer();
          }}
          animate={{ x, scale: isLongPressing ? 0.97 : 1 }}
          transition={{ x: springs.bouncy, scale: springs.snappy }}
          className="relative z-10 touch-pan-y bg-bg-primary"
        >
          {/* Confirms the long-press landed before the menu opens (a
              native-feeling "peek" confirmation, contour-spec-context-menu.md
              SS2) -- separate from the swipe-reveal overlays above, which
              only show on desktop hover/focus. */}
          {isLongPressing && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-fill-quaternary" />
          )}
          {onClick ? (
            <button
              type="button"
              onClick={disabled ? undefined : onClick}
              disabled={disabled}
              className={cn(
                "w-full px-(--padding-row-x) py-(--padding-row-y) text-left outline-none",
                "active:bg-fill-quaternary focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:-outline-offset-(--focus-ring-width) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                reserveClass,
                disabled && "pointer-events-none opacity-40",
              )}
            >
              {row}
            </button>
          ) : (
            <div className={cn("px-(--padding-row-x) py-(--padding-row-y)", reserveClass, disabled && "opacity-40")}>
              {row}
            </div>
          )}
          <div
            aria-hidden
            className={cn(
              "absolute bottom-0 h-px bg-separator group-last:hidden",
              // Same inset on both edges -- left aligns with where the title
              // text actually starts (row padding, plus icon width + gap
              // only when this row actually has one), right mirrors it
              // instead of running flush to the row's own edge.
              !separatorInset
                ? "left-0 right-0"
                : leadingIcon
                  ? "left-[calc(var(--padding-row-x)+var(--icon-size-md)+var(--gap-icon-text))] right-[calc(var(--padding-row-x)+var(--icon-size-md)+var(--gap-icon-text))]"
                  : "left-(--padding-row-x) right-(--padding-row-x)",
            )}
          />
        </motion.div>
      </div>
      {/* Full-row overlay (contour-spec-list.md SS4.5): the tapped action
          fills `content`'s entire box while the row and any reveal panel
          underneath fade out (the wrapper above). Grows from the edge it
          was tapped from (leading: left, trailing: right) rather than a
          plain center scale, so it reads as "this button expanded" instead
          of a generic popup.
          - Armed (confirm): a second tap on it is what actually runs the
            action; outside click / Escape cancels instead (effect above).
          - Flashing (non-confirm): pure tap feedback -- the action already
            ran, so this isn't tappable, and it auto-reverts on its own
            (FLASH_HOLD_MS timer above) rather than waiting for anything. */}
      <AnimatePresence>
        {overlayAction && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            // `pointerEvents: "none"` here (not numerically tweened, applied
            // the instant exit starts) so this can never block clicks to the
            // buttons underneath if its own removal from the DOM lags behind
            // the fade -- a spring has no fixed duration, so AnimatePresence
            // has to detect completion itself, and that detection can lag.
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, pointerEvents: "none" }}
            transition={reduceMotion ? { duration: durations.fast } : springs.snappy}
            style={{ transformOrigin: overlayAction.key === "leading" ? "left" : "right" }}
            className="absolute inset-0 z-30 flex"
          >
            <ActionButton
              action={{
                ...overlayAction.action,
                onAction: armedAction ? () => activateAction(armedAction.key, armedAction.action) : () => {},
              }}
              width="100%"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!contextMenuItems) return content;

  // Desktop: Radix's own oncontextmenu handling covers right-click.
  // Touch: driven by the synthetic dispatch in handleTouchStart above, not
  // Radix's native long-press detection (contour-spec-context-menu.md SS2).
  return <ContextMenu items={contextMenuItems}>{content}</ContextMenu>;
}
