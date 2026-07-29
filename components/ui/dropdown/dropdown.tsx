"use client";

import * as React from "react";
import * as PopperPrimitive from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { Slot } from "@radix-ui/react-slot";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn, composeRefs } from "@/lib/utils";
import { springs, useMorphOrigin, type MorphOrigin } from "@/lib/motion";

/**
 * Dropdown — a floating panel of arbitrary content anchored to a trigger,
 * built entirely on framer-motion plus `@radix-ui/react-popper` (used only
 * for its headless anchor-positioning math - side/align/collision handling
 * - not for any UI or interaction behavior). Unlike Select, nothing here
 * comes from a Radix *interactive* primitive: open state, the trigger-to-
 * content morph animation, outside-click, and Escape-to-close are all
 * hand-written below. See the docs page for the accessibility trade-offs
 * that come with that (no built-in focus trap or roving tabindex - Select
 * or a future Popover/Dialog built on Radix's own primitives are the
 * better fit for anything needing that).
 */
const DropdownContext = React.createContext<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  origin: MorphOrigin | null;
  contentId: string;
} | null>(null);

export interface DropdownProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Dropdown({ open, defaultOpen, onOpenChange, children }: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { origin, capture } = useMorphOrigin(triggerRef, contentRef);
  const contentId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      capture(next);
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange, capture],
  );

  return (
    <DropdownContext.Provider value={{ isOpen, setOpen, triggerRef, contentRef, origin, contentId }}>
      <PopperPrimitive.Root>{children}</PopperPrimitive.Root>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Render as the child element instead of a <button> - e.g. to trigger off a custom icon button. */
  asChild?: boolean;
  children?: React.ReactNode;
}

export const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ asChild = false, className, onClick, ...props }, ref) => {
    const dropdown = React.useContext(DropdownContext);
    const isOpen = dropdown?.isOpen ?? false;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) dropdown?.setOpen(!isOpen);
    };

    const sharedProps = {
      "aria-expanded": isOpen,
      "aria-haspopup": "dialog" as const,
      "aria-controls": dropdown?.contentId,
      onClick: handleClick,
      className: cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
        className,
      ),
    };

    if (asChild) {
      // Slot does not support motion props - strip them before rendering as child.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...slotProps } =
        props as DropdownTriggerProps & Record<string, unknown>;
      return (
        <PopperPrimitive.Anchor asChild>
          <Slot
            ref={composeRefs(ref, dropdown?.triggerRef)}
            {...sharedProps}
            {...(slotProps as React.ComponentPropsWithoutRef<"button">)}
          />
        </PopperPrimitive.Anchor>
      );
    }

    return (
      <PopperPrimitive.Anchor asChild>
        <motion.button
          ref={composeRefs(ref, dropdown?.triggerRef)}
          type="button"
          animate={{ opacity: isOpen ? 0.5 : 1 }}
          transition={springs.smooth}
          {...sharedProps}
          {...props}
        />
      </PopperPrimitive.Anchor>
    );
  },
);
DropdownTrigger.displayName = "DropdownTrigger";

export type DropdownContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof PopperPrimitive.Content>,
  DropdownContentProps
>(({ className, children, side = "bottom", sideOffset = 8, align = "start", ...props }, ref) => {
  const dropdown = React.useContext(DropdownContext);
  const isOpen = dropdown?.isOpen ?? false;
  const origin = dropdown?.origin ?? null;

  // Hand-wired close behavior: Popper.Content is headless and, unlike
  // Radix's interactive primitives (Select, Dialog), has no built-in
  // outside-click or Escape handling of its own - see the module doc
  // comment above for why that's a deliberate trade-off here.
  React.useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (dropdown?.contentRef.current?.contains(target)) return;
      if (dropdown?.triggerRef.current?.contains(target)) return;
      dropdown?.setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dropdown?.setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dropdown]);

  return (
    <Portal>
      <PopperPrimitive.Content
        ref={composeRefs(ref, dropdown?.contentRef)}
        side={side}
        sideOffset={sideOffset}
        align={align}
        {...props}
        id={dropdown?.contentId}
        role="dialog"
        aria-hidden={!isOpen}
        className={cn("z-50", !isOpen && "pointer-events-none")}
      >
        <motion.div
          // Plain initial/animate values, not framer-motion's `layout` prop -
          // see lib/motion/morph-origin.ts for why: `layout` needs the same
          // component instance to persist across a change to diff "before"
          // vs "after", which is fragile to depend on; `initial` doesn't
          // have that requirement; it's evaluated fresh on every mount.
          initial={
            origin
              ? {
                  opacity: 0,
                  width: origin.width,
                  height: origin.height,
                  borderRadius: origin.radius,
                  x: origin.dx,
                  y: origin.dy,
                }
              : false
          }
          animate={{
            opacity: isOpen ? 1 : 0,
            width: isOpen ? "auto" : origin?.width,
            height: isOpen ? "auto" : origin?.height,
            borderRadius: isOpen ? "var(--radius-lg)" : origin?.radius,
            x: isOpen ? 0 : origin?.dx,
            y: isOpen ? 0 : origin?.dy,
          }}
          transition={springs.smooth}
          style={{ transformOrigin: "var(--radix-popper-transform-origin)" }}
          className={cn(
            "max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-separator p-1 shadow-lg",
            "material-thick",
            className,
          )}
        >
          {/* Content fades and blurs in slightly after the shape above
              starts resizing, rather than stretching visibly with it -
              same reveal technique as Select. */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              filter: isOpen ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ ...springs.smooth, delay: isOpen ? 0.08 : 0 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </PopperPrimitive.Content>
    </Portal>
  );
});
DropdownContent.displayName = "DropdownContent";
