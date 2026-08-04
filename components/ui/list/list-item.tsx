"use client";

import { useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { useDrag } from "@use-gesture/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import type { SemanticColorToken } from "@/lib/types/color.types";
// Direct imports (not the barrels) -- both Dropdown and ContextMenu
// re-export from modules that, in turn, get imported here, which Rollup
// flags as a circular chunk dependency when routed through index.ts.
import { Dropdown } from "@/components/ui/dropdown/dropdown";
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

export type SwipeActionColor = "destructive" | "default" | SemanticColorToken;

export interface SwipeAction {
  icon: IconName;
  label: string;
  color: SwipeActionColor;
  onAction: () => void;
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
  /** Max 3 shown directly; the rest collapse into a "More" action (contour-spec-list.md SS4.1). */
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
const TRAILING_RESERVE_CLASS: Record<number, string> = {
  1: "group-hover-fine:pr-[calc(var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pr-[calc(var(--swipe-action-width)+var(--gap-icon-text))]",
  2: "group-hover-fine:pr-[calc(2*var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pr-[calc(2*var(--swipe-action-width)+var(--gap-icon-text))]",
  3: "group-hover-fine:pr-[calc(3*var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pr-[calc(3*var(--swipe-action-width)+var(--gap-icon-text))]",
};
const LEADING_RESERVE_CLASS =
  "group-hover-fine:pl-[calc(var(--swipe-action-width)+var(--gap-icon-text))] group-focus-within:pl-[calc(var(--swipe-action-width)+var(--gap-icon-text))]";

function ActionButton({ action, width }: { action: SwipeAction; width: number }) {
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
  const [x, setX] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressOriginRef = useRef<{ x: number; y: number } | null>(null);

  const visibleTrailing = trailingActions.slice(0, 3);
  const overflowTrailing = trailingActions.slice(3);
  const trailingWidth = visibleTrailing.length * SWIPE_ACTION_WIDTH;
  const leadingWidth = leadingAction ? SWIPE_ACTION_WIDTH : 0;

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
        const lastTrailing = trailingActions[trailingActions.length - 1];
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
  // desktop where the overlay doesn't otherwise displace anything.
  const reserveClass = isCoarsePointer
    ? undefined
    : cn(
        visibleTrailing.length > 0 && TRAILING_RESERVE_CLASS[visibleTrailing.length],
        leadingAction && LEADING_RESERVE_CLASS,
        (visibleTrailing.length > 0 || leadingAction) && "transition-[padding] duration-(--duration-fast)",
      );

  const content = (
    <div className="relative overflow-hidden bg-bg-primary">
      {leadingAction && (
        <div
          className={cn(
            "absolute inset-y-0 left-0",
            // Touch: sits behind the row, revealed as the row is dragged
            // away. Desktop: sits above the row instead and fades in as an
            // opaque overlay over the original icon (contour-spec-list.md
            // SS4.4) -- it can't be behind the row there since nothing moves
            // to expose it.
            isCoarsePointer
              ? "z-0"
              : "z-20 opacity-0 transition-opacity duration-(--duration-fast) group-hover-fine:opacity-100 group-focus-within:opacity-100",
          )}
          style={{ width: SWIPE_ACTION_WIDTH }}
        >
          <ActionButton action={leadingAction} width={SWIPE_ACTION_WIDTH} />
        </div>
      )}
      {visibleTrailing.length > 0 && (
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex",
            // Same reasoning as the leading action above.
            isCoarsePointer
              ? "z-0"
              : "z-20 opacity-0 transition-opacity duration-(--duration-fast) group-hover-fine:opacity-100 group-focus-within:opacity-100",
          )}
        >
          {visibleTrailing.map((action, index) =>
            overflowTrailing.length > 0 && index === visibleTrailing.length - 1 ? (
              <Dropdown
                key="more"
                items={overflowTrailing.map(
                  (overflowAction): DropdownItemDef => ({
                    type: "action",
                    icon: overflowAction.icon,
                    label: overflowAction.label,
                    onSelect: overflowAction.onAction,
                    role: overflowAction.color === "destructive" ? "destructive" : "default",
                  }),
                )}
                trigger={
                  <button
                    type="button"
                    style={{ width: SWIPE_ACTION_WIDTH }}
                    className={cn(
                      "flex h-full flex-col items-center justify-center gap-1",
                      ACTION_BG.default,
                      ACTION_TEXT.default,
                    )}
                    aria-label="More actions"
                  >
                    <Icon name="ellipsis" size="sm" />
                    <Text as="span" textStyle="caption-1" className="text-inherit">
                      More
                    </Text>
                  </button>
                }
              />
            ) : (
              <ActionButton key={action.label} action={action} width={SWIPE_ACTION_WIDTH} />
            ),
          )}
        </div>
      )}
      <motion.div
        ref={rowRef}
        {...(bindDrag() as Record<string, unknown>)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={clearLongPressTimer}
        onTouchCancel={clearLongPressTimer}
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
            // text actually starts (row padding, plus icon width + gap only
            // when this row actually has one), right mirrors it instead of
            // running flush to the row's own edge.
            !separatorInset
              ? "left-0 right-0"
              : leadingIcon
                ? "left-[calc(var(--padding-row-x)+var(--icon-size-md)+var(--gap-icon-text))] right-[calc(var(--padding-row-x)+var(--icon-size-md)+var(--gap-icon-text))]"
                : "left-(--padding-row-x) right-(--padding-row-x)",
          )}
        />
      </motion.div>
    </div>
  );

  if (!contextMenuItems) return content;

  // Desktop: Radix's own oncontextmenu handling covers right-click.
  // Touch: driven by the synthetic dispatch in handleTouchStart above, not
  // Radix's native long-press detection (contour-spec-context-menu.md SS2).
  return <ContextMenu items={contextMenuItems}>{content}</ContextMenu>;
}
