"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  usePresence,
} from "framer-motion";
import type { MotionValue, PanInfo, Transition } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import { useSheetZIndex, sheetDragProgress } from "./use-sheet-stack";
import type { SheetZIndex } from "./use-sheet-stack";
import { resolveDragTarget, snapFractionToY } from "./sheet-drag";

export type SheetDismissible = boolean | (() => boolean | Promise<boolean>);

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Snap heights as fractions of viewport height, e.g. [0.4, 0.9] (contour-spec-sheet-v2.md SS "snap points"). Default [1] -- single full-height snap point. Only applies to the draggable Bottom Sheet presentation (pointer: coarse); ignored for the Modal presentation. */
  snapPoints?: number[];
  /** Accessible name announced by screen readers (Radix Dialog requires a Title). This is not rendered visibly -- compose your own visible heading via SheetHeader + Text. */
  title?: string;
  children: ReactNode;
  /** Static or dynamic dismiss gate, evaluated at every close attempt (close button, click-outside, Escape, drag-to-bottom) before the Sheet actually closes. A function may return a Promise for async validation -- the Sheet enters a "pending" state and locks dismiss input until it resolves. Default true. */
  dismissible?: SheetDismissible;
}

interface SheetContextValue {
  open: boolean;
  dismissible: SheetDismissible;
  pending: boolean;
  snapPoints: number[];
  title?: string;
  isDraggable: boolean;
  reducedMotion: boolean;
  zIndex: SheetZIndex;
  /** Evaluates `dismissible`; closes and returns true if allowed, returns false if blocked. Never throws -- callers only need the boolean to decide which blocked-dismiss feedback to play. */
  attemptDismiss: () => Promise<boolean>;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext(component: string): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Sheet>.`);
  }
  return ctx;
}

function resolveTransition(base: Transition, reducedMotion: boolean): Transition {
  // Guideline SS6.5: every pattern (including drag/bounce/shake) falls back
  // to a short plain fade/tween under prefers-reduced-motion, not a full
  // disable -- Continuity still requires *some* feedback on a blocked
  // dismiss attempt.
  return reducedMotion ? { duration: 0.15 } : base;
}

export function Sheet({
  open,
  onOpenChange,
  snapPoints = [1],
  title,
  children,
  dismissible = true,
}: SheetProps) {
  // Touch always gets the Bottom Sheet (contour-spec-sheet-v2.md SS6.8) --
  // additionally, compact width gets it too even under a mouse/trackpad,
  // since a centered Modal card reads wrong that narrow (a resized desktop
  // browser window is a real case here, not just phones/tablets).
  const isCoarsePointer = useIsCoarsePointer();
  const isCompact = useSizeClass() === "compact";
  const isDraggable = isCoarsePointer || isCompact;
  const reducedMotion = useReducedMotion();
  const zIndex = useSheetZIndex(open);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  const normalizedSnapPoints = useMemo(() => {
    const sorted = [...new Set(snapPoints)]
      .filter((value) => value > 0 && value <= 1)
      .sort((a, b) => a - b);
    return sorted.length > 0 ? sorted : [1];
  }, [snapPoints]);

  const attemptDismiss = useCallback(async (): Promise<boolean> => {
    if (pendingRef.current) return false;

    if (typeof dismissible !== "function") {
      if (dismissible) {
        onOpenChange(false);
        return true;
      }
      return false;
    }

    pendingRef.current = true;
    setPending(true);
    try {
      const allowed = await dismissible();
      if (allowed) onOpenChange(false);
      return allowed;
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }, [dismissible, onOpenChange]);

  const contextValue = useMemo<SheetContextValue>(
    () => ({
      open,
      dismissible,
      pending,
      snapPoints: normalizedSnapPoints,
      title,
      isDraggable,
      reducedMotion,
      zIndex,
      attemptDismiss,
    }),
    [open, dismissible, pending, normalizedSnapPoints, title, isDraggable, reducedMotion, zIndex, attemptDismiss],
  );

  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={(next) => {
        // Radix calls this with `false` for Escape/outside-click/its own
        // Close -- all of which Sheet intercepts itself below and routes
        // through attemptDismiss instead, so a bare `false` here is
        // ignored. `true` is passed straight through (Sheet exposes no
        // Trigger of its own; open is always externally controlled).
        if (next) onOpenChange(true);
      }}
    >
      <SheetContext.Provider value={contextValue}>
        <AnimatePresence>{open && children}</AnimatePresence>
      </SheetContext.Provider>
    </RadixDialog.Root>
  );
}

// Native onDrag*/onAnimation* event props conflict in type shape with
// framer-motion's gesture-based props of the same name -- SheetContent
// drives its own drag/animate internally, so these are dropped rather
// than left to collide when spread onto the underlying motion.div.
type NativeMotionConflicts =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export interface SheetContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | NativeMotionConflicts> {
  children: ReactNode;
}

// contour-spec-sheet-v2.md SS2: touch (pointer: coarse) presents a
// draggable Bottom Sheet at every size-class, including large tablets;
// pointer: fine gets a fixed Centered Modal at regular+, but still a
// Bottom Sheet at compact -- see the Sheet root's isDraggable derivation.
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { className, children, ...rest },
  forwardedRef,
) {
  const ctx = useSheetContext("SheetContent");

  return ctx.isDraggable ? (
    <DraggableSheetPanel ctx={ctx} className={className} forwardedRef={forwardedRef} {...rest}>
      {children}
    </DraggableSheetPanel>
  ) : (
    <ModalSheetPanel ctx={ctx} className={className} forwardedRef={forwardedRef} {...rest}>
      {children}
    </ModalSheetPanel>
  );
});

// SS7 receded-card transform (contour-spec-sheet-v2.md SS7).
const RECEDED_SCALE = 0.94;
const RECEDED_Y = -16;

// Shared chrome between both presentations: recede transform for a Sheet
// that has a newer Sheet stacked on top of it (SS7), plus the backdrop.
function SheetChrome({
  ctx,
  children,
}: {
  ctx: SheetContextValue;
  children: (args: { shakeX: MotionValue<number> }) => ReactNode;
}) {
  const { zIndex, reducedMotion, isDraggable } = ctx;
  const shakeX = useMotionValue(0);
  // Only the base (first-opened) Sheet dims the page -- a nested Sheet's
  // own Overlay still renders (Radix needs it mounted for outside-click
  // detection on that layer) but stays transparent, otherwise each nested
  // level would stack another full-strength bg-overlay-default on top of
  // the one below it and the page would visibly darken further per level.
  const isBase = zIndex.depth <= 0;
  const isReceded = zIndex.isReceded;

  // Explicit motion values (not the `animate` prop) so the drag-tracking
  // listener below can drive them imperatively too -- both write to the
  // same scale/y, so whichever last touched them wins each frame.
  const scale = useMotionValue(isReceded ? RECEDED_SCALE : 1);
  const y = useMotionValue(isReceded ? RECEDED_Y : 0);

  useEffect(() => {
    void animate(scale, isReceded ? RECEDED_SCALE : 1, resolveTransition(springs.smooth, reducedMotion));
    void animate(y, isReceded ? RECEDED_Y : 0, resolveTransition(springs.smooth, reducedMotion));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReceded, reducedMotion]);

  // SS7 live tracking: while the Sheet directly above this one is actively
  // being dragged, scale/shift this card in step with that drag instead of
  // only snapping to its resting scale once the gesture ends --
  // sheetDragProgress is written by whichever Sheet is topmost (the only
  // one draggable at a time), 0 at rest up to 1 at the dismiss threshold.
  useMotionValueEvent(sheetDragProgress, "change", (progress) => {
    if (!isReceded) return;
    scale.set(RECEDED_SCALE + (1 - RECEDED_SCALE) * progress);
    y.set(RECEDED_Y + (0 - RECEDED_Y) * progress);
  });

  return (
    <RadixDialog.Portal forceMount>
      {/* Single stacking-context boundary for the whole Sheet (backdrop +
          panel) -- z-(--z-sticky) only needs to be set once, here. Setting
          it again on the backdrop or panel wrapper below would give each
          its own competing stacking context (an element's own inline
          zIndex always wins over its own class either way), which is what
          let the backdrop's inline zIndex.backdropZ float above the panel
          wrapper's plain z-(--z-sticky) class instead of staying under it. */}
      <div className="fixed inset-0 z-(--z-sticky)">
        {/* Backdrop lives outside the scale/y wrapper below -- it must stay a
            plain full-viewport rectangle dimming the whole page, not shrink
            and round its corners along with a receded Sheet's card. */}
        <RadixDialog.Overlay asChild forceMount>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isBase ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : durations.normal }}
            className={cn("fixed inset-0", isBase && "bg-overlay-default")}
            style={{ zIndex: zIndex.backdropZ }}
          />
        </RadixDialog.Overlay>
        <motion.div
          className="fixed inset-0"
          style={{
            scale,
            y,
            // Binding scale/y here gives this wrapper a `transform`, which
            // creates its own stacking context regardless of z-index (CSS
            // transforms spec) -- without an explicit z-index of its own,
            // that context's *boundary* falls into the implicit z-index:0
            // layer, painting under the backdrop's explicit zIndex.backdropZ
            // even though the panel inside carries a higher inline zIndex.
            // Matching the panel's own zIndex.z here keeps the wrapper (and
            // everything in it) above the backdrop, as a unit.
            zIndex: zIndex.z,
            pointerEvents: isReceded ? "none" : "auto",
            transformOrigin: isDraggable ? "50% 100%" : "50% 50%",
          }}
        >
          {children({ shakeX })}
          {/* SS7: a receded Sheet gets its own light dim, independent of the
              base Sheet's backdrop -- that backdrop dims the page behind the
              whole stack, this dims specifically the covered Sheet. Scales
              with the panel above (same wrapper) so it stays aligned to the
              card's shrunk bounds instead of covering the pre-scale area. */}
          {isReceded && (
            <div
              className="pointer-events-none fixed inset-0 bg-overlay-default"
              style={{ zIndex: zIndex.z, opacity: 0.15 }}
            />
          )}
        </motion.div>
      </div>
    </RadixDialog.Portal>
  );
}

function CloseButton({
  onPointerDown,
  pending,
}: {
  onPointerDown: () => void;
  pending: boolean;
}) {
  return (
    <RadixDialog.Close asChild>
      <button
        type="button"
        aria-label="Close"
        disabled={pending}
        onClick={(event) => {
          // Sheet decides whether this actually closes (via attemptDismiss)
          // -- Radix's own auto-close on Dialog.Close is not what we want.
          event.preventDefault();
          onPointerDown();
        }}
        className={cn(
          "absolute right-[var(--space-3)] top-[var(--space-3)] z-10",
          "flex h-11 w-11 items-center justify-center rounded-full",
          "text-label-secondary transition-colors hover-fine:bg-fill-tertiary active:bg-fill-tertiary",
          "focus-visible:[outline-style:solid] focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:[outline-offset:var(--focus-ring-offset)] focus-visible:[outline-color:rgb(var(--focus-ring-color))]",
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <Icon name="close" size="sm" />
      </button>
    </RadixDialog.Close>
  );
}

async function shake(shakeX: MotionValue<number>, reducedMotion: boolean) {
  // ~2.5 cycles at ±4px, built from --duration-instant (SS6.2/6.4) -- reads
  // as "heard the attempt, didn't accept it" without implying the whole
  // Sheet is broken (contour-design-guidelines-v2.md rule 1.1 Continuity).
  await animate(shakeX, [0, -4, 4, -4, 4, 0], {
    duration: reducedMotion ? 0.15 : durations.instant * 3,
    ease: "easeInOut",
  });
}

interface PanelProps extends SheetContentProps {
  ctx: SheetContextValue;
  forwardedRef: ForwardedRef<HTMLDivElement>;
}

function DraggableSheetPanel({ ctx, className, style: styleProp, children, forwardedRef, ...rest }: PanelProps) {
  const { snapPoints, pending, reducedMotion, attemptDismiss, title } = ctx;
  const [viewportHeight, setViewportHeight] = useState(0);
  const [topGap, setTopGap] = useState(0);
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    // A full-height Bottom Sheet (snapPoints reaching 1) shouldn't cover the
    // screen edge-to-edge -- native Bottom Sheets always leave a gap at the
    // top. Measured via a probe (env() only resolves to a real px value once
    // applied to a layout property) so it respects a real notch/safe-area
    // when present, with --space-3 as the floor on devices with none.
    const measureTopGap = () => {
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;height:0;padding-top:max(var(--space-3),var(--safe-area-top));visibility:hidden;pointer-events:none;";
      document.body.appendChild(probe);
      const gap = parseFloat(getComputedStyle(probe).paddingTop) || 0;
      document.body.removeChild(probe);
      setTopGap(gap);
    };
    const update = () => setViewportHeight(window.innerHeight);

    measureTopGap();
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxSnap = snapPoints[snapPoints.length - 1];
  const initialSnap = snapPoints[0];
  // Every snap fraction is relative to this, not the raw viewport height, so
  // the fully-open (fraction 1) snap point lands just below topGap instead
  // of at the very top edge.
  const availableHeight = Math.max(viewportHeight - topGap, 0);
  const panelHeightPx = maxSnap * (availableHeight || 0);
  const y = useMotionValue(0);

  // Present: slide up from fully off-screen (fraction 0) to the initial snap
  // point once real viewport height is known (0 on the very first render,
  // before the resize-listener effect runs) -- contour-spec-sheet-v2.md
  // "Sheet present/dismiss": slide up from bottom + backdrop fade, springs.smooth.
  useEffect(() => {
    if (!viewportHeight) return;
    y.set(snapFractionToY(0, maxSnap, availableHeight));
    void animate(
      y,
      snapFractionToY(initialSnap, maxSnap, availableHeight),
      resolveTransition(springs.smooth, reducedMotion),
    );
    // Only on mount / when the measured viewport height first becomes
    // available -- subsequent snapPoints changes shouldn't yank an
    // already-open Sheet back to its initial position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportHeight > 0]);

  // Dismiss: slide back down to off-screen before AnimatePresence actually
  // unmounts the panel (mirrors the present animation above). Skipped when
  // viewport height was never measured (nothing was ever visible to animate).
  useEffect(() => {
    if (isPresent || !viewportHeight) {
      if (isPresent === false && !viewportHeight) safeToRemove?.();
      return;
    }
    void animate(
      y,
      snapFractionToY(0, maxSnap, availableHeight),
      resolveTransition(springs.smooth, reducedMotion),
    ).then(() => safeToRemove?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  // SS7 live tracking (write side): reports how far this drag has moved
  // toward its own dismiss position, 0..1, so a receded Sheet underneath
  // can scale back up in step -- see the matching listener in SheetChrome.
  const handleDrag = () => {
    if (!panelHeightPx) return;
    sheetDragProgress.set(Math.min(Math.max(y.get() / panelHeightPx, 0), 1));
  };

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (pending || !viewportHeight) return;
    const currentY = y.get();
    const target = resolveDragTarget({
      currentY,
      velocityY: info.velocity.y,
      snapPoints,
      maxSnap,
      viewportHeight: availableHeight,
      includeDismiss: true,
    });

    if (target !== "dismiss") {
      animate(y, snapFractionToY(target, maxSnap, availableHeight), resolveTransition(springs.smooth, reducedMotion));
      // Not dismissing -- ease back to 0 rather than snapping, so a receded
      // Sheet underneath (still subscribed) settles back in the same spring
      // instead of jumping straight to its resting scale.
      void animate(sheetDragProgress, 0, resolveTransition(springs.smooth, reducedMotion));
      return;
    }

    const allowed = await attemptDismiss();
    if (allowed) return; // Sheet closes -- AnimatePresence exit takes over.

    // Blocked: bounce toward close by ~10% of the panel's own height past
    // the release point, then spring back to the nearest real snap point
    // -- both legs springs.bouncy (contour-spec-sheet-v2.md SS6.2).
    const restTarget = resolveDragTarget({
      currentY,
      velocityY: 0,
      snapPoints,
      maxSnap,
      viewportHeight: availableHeight,
      includeDismiss: false,
    });
    const restY = snapFractionToY(typeof restTarget === "number" ? restTarget : maxSnap, maxSnap, availableHeight);
    const overshootY = Math.min(currentY + panelHeightPx * 0.1, panelHeightPx);
    void animate(sheetDragProgress, 0, resolveTransition(springs.bouncy, reducedMotion));
    await animate(y, overshootY, resolveTransition(springs.bouncy, reducedMotion));
    await animate(y, restY, resolveTransition(springs.bouncy, reducedMotion));
  };

  const handleNonDragDismiss = useCallback(
    async (shakeX: MotionValue<number>) => {
      if (pending) return;
      const allowed = await attemptDismiss();
      if (!allowed) void shake(shakeX, reducedMotion);
    },
    [pending, attemptDismiss, reducedMotion],
  );

  return (
    <SheetChrome ctx={ctx}>
      {({ shakeX }) => (
        <RadixDialog.Content
          asChild
          forceMount
          aria-describedby={undefined}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            void handleNonDragDismiss(shakeX);
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            void handleNonDragDismiss(shakeX);
          }}
        >
          <motion.div
            ref={forwardedRef}
            drag={pending ? false : "y"}
            dragConstraints={{ top: 0, bottom: panelHeightPx }}
            dragElastic={{ top: 0.15, bottom: 0 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ ...styleProp, y, x: shakeX, height: panelHeightPx || undefined, zIndex: ctx.zIndex.z }}
            className={cn(
              "contour-sheet-content fixed inset-x-0 bottom-0 flex flex-col overflow-hidden",
              "bg-(--material-thick) backdrop-blur-[20px] outline-none",
              className,
            )}
            {...rest}
          >
            {title && (
              <RadixDialog.Title asChild>
                <VisuallyHidden.Root>{title}</VisuallyHidden.Root>
              </RadixDialog.Title>
            )}
            <div className="flex shrink-0 justify-center pt-2 pb-1" aria-hidden>
              <div
                className={cn("contour-sheet-grabber bg-fill-tertiary", pending && "opacity-40")}
              />
            </div>
            <CloseButton pending={pending} onPointerDown={() => void handleNonDragDismiss(shakeX)} />
            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{
                paddingBottom: "var(--safe-area-bottom)",
                paddingLeft: "var(--inset-grouped-margin-x)",
                paddingRight: "var(--inset-grouped-margin-x)",
              }}
            >
              {children}
            </div>
          </motion.div>
        </RadixDialog.Content>
      )}
    </SheetChrome>
  );
}

function ModalSheetPanel({ ctx, className, style: styleProp, children, forwardedRef, ...rest }: PanelProps) {
  const { pending, reducedMotion, attemptDismiss, title } = ctx;

  const handleDismiss = useCallback(
    async (shakeX: MotionValue<number>) => {
      if (pending) return;
      const allowed = await attemptDismiss();
      if (!allowed) void shake(shakeX, reducedMotion);
    },
    [pending, attemptDismiss, reducedMotion],
  );

  return (
    <SheetChrome ctx={ctx}>
      {({ shakeX }) => (
        <RadixDialog.Content
          asChild
          forceMount
          aria-describedby={undefined}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            void handleDismiss(shakeX);
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            void handleDismiss(shakeX);
          }}
        >
          <motion.div
            ref={forwardedRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={resolveTransition(springs.smooth, reducedMotion)}
            style={{ ...styleProp, x: shakeX, zIndex: ctx.zIndex.z }}
            className={cn(
              "contour-sheet-content fixed left-1/2 top-1/2 flex max-h-[85vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden",
              "w-[min(var(--container-max-width),calc(100%-var(--space-4)*2))]",
              "bg-(--material-thick) backdrop-blur-[20px] outline-none",
              className,
            )}
            {...rest}
          >
            {title && (
              <RadixDialog.Title asChild>
                <VisuallyHidden.Root>{title}</VisuallyHidden.Root>
              </RadixDialog.Title>
            )}
            <CloseButton pending={pending} onPointerDown={() => void handleDismiss(shakeX)} />
            <div
              className="min-h-0 flex-1 overflow-y-auto"
              style={{
                paddingBottom: "var(--safe-area-bottom)",
                paddingLeft: "var(--inset-grouped-margin-x)",
                paddingRight: "var(--inset-grouped-margin-x)",
              }}
            >
              {children}
            </div>
          </motion.div>
        </RadixDialog.Content>
      )}
    </SheetChrome>
  );
}

export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// Just the header region's own chrome (padding + separator) -- content
// inside (Text, actions, ...) is fully consumer-composed, same principle
// as SheetContent's body area (contour-spec-sheet-v2.md SS4).
//
// minHeight guarantees the row is at least as tall as CloseButton's own
// footprint (top-[--space-3] + 44px hit area = 12px + 2.75rem, +4px
// breathing room) -- CloseButton is positioned absolutely against the
// whole panel (not this header specifically, since header content is
// consumer-composed), so without this a short single-line title lets the
// button's bottom edge cross the header's border-bottom.
export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center justify-center border-b border-separator text-center",
        className,
      )}
      style={{
        ...style,
        paddingLeft: "var(--inset-grouped-margin-x)",
        paddingRight: "var(--inset-grouped-margin-x)",
        paddingTop: "var(--space-3)",
        paddingBottom: "var(--space-3)",
        minHeight: "calc(var(--space-3) + 2.75rem + var(--space-1))",
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
