"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn, composeRefs } from "@/lib/utils";
import { Icon } from "@/components/icon";
import { springs, useMorphOrigin, type MorphOrigin } from "@/lib/motion";

/**
 * Select — a listbox-style single-choice control built on Radix Select.
 * Root/Trigger/Content/Item map directly onto the Radix primitive names so
 * the API is predictable to anyone who already knows Radix; this wrapper
 * adds styling, the chevron/check icons, and a continuous open/close
 * animation: Content morphs out of the trigger's own box on open (FLIP-
 * style - starting at the trigger's measured width/height/radius/position
 * and animating up to Content's natural size and resting position) and
 * morphs back down into that same box on close, instead of just appearing
 * or fading in place. The trigger itself fades out entirely as Content
 * takes its place, then fades back in as Content shrinks back down into it
 * on close - so Content reads as a direct transformation of the trigger,
 * not a second, disconnected element appearing on top of it.
 */
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

/**
 * Radix's Select Root doesn't expose its open state to descendants other
 * than through its own internal context, which this wrapper has no access
 * to - so Select tracks it again here (controlled/uncontrolled merged, same
 * as Checkbox), plus refs to the trigger and content DOM nodes and the
 * trigger-to-content morph state (see lib/motion/morph-origin.ts), all
 * consumed by Trigger and Content below.
 */
const SelectMorphContext = React.createContext<{
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  origin: MorphOrigin | null;
} | null>(null);

export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

export function Select({ open, defaultOpen, onOpenChange, ...props }: SelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { origin, capture } = useMorphOrigin(triggerRef, contentRef);

  // Radix calls this to actually open or close the menu, so `capture` runs
  // at the exact moment of the interaction - see useMorphOrigin for why
  // that timing matters. This lives in Select (not SelectContent)
  // deliberately: SelectContent itself never unmounts between opens - only
  // Radix's *internal* implementation swaps underneath it - so a `settled`
  // reset tied to SelectContent's own mount effect would only ever fire
  // once, on first page load, not on every open. Select's state doesn't
  // have that problem since it's the stable root of this whole subtree.
  const handleOpenChange = (next: boolean) => {
    capture(next);
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <SelectMorphContext.Provider value={{ isOpen, triggerRef, contentRef, origin }}>
      <SelectPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props} />
    </SelectMorphContext.Provider>
  );
}

/**
 * Tracks which item is currently highlighted so SelectItem can render a
 * shared `layoutId` background that glides between items instead of each
 * one's highlight just snapping on/off. Fed from onFocus/onBlur rather than
 * pointer events: Radix's own SelectItem calls `.focus()` on pointer move
 * and derives its `data-highlighted` attribute from that same focus state,
 * so DOM focus is already the single source of truth for both mouse and
 * keyboard highlighting - mirroring it here (instead of tracking pointer
 * position separately) is what keeps this from fighting with Radix's own
 * highlight instead of replacing it. Scoped to one SelectContent via
 * context rather than lifted onto Select itself, since it should reset
 * every time the content remounts (i.e. each time the menu opens).
 */
const SelectHighlightContext = React.createContext<{
  highlightedValue: string | null;
  setHighlightedValue: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

const triggerVariants = cva(
  [
    "flex w-full items-center justify-between gap-2 bg-fill-secondary text-label-primary",
    "transition-shadow duration-200 outline-none",
    "focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[placeholder]:text-label-tertiary",
  ],
  {
    variants: {
      size: {
        sm: "h-8 rounded-sm px-3 text-subheadline",
        md: "h-10 rounded-md px-3.5 text-body",
        lg: "h-12 rounded-lg px-4 text-body",
      },
      invalid: {
        true: "ring-2 ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

const iconSize = { sm: 14, md: 16, lg: 18 } as const;

export interface SelectTriggerProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
      // Native drag/animation event handlers conflict with framer-motion's
      // own (differently-typed) props of the same name, now that the
      // trigger is wrapped in motion.create() below to animate its opacity.
      "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
    >,
    VariantProps<typeof triggerVariants> {}

const MotionSelectTrigger = motion.create(SelectPrimitive.Trigger);

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, size = "md", invalid, children, ...props }, ref) => {
  const morph = React.useContext(SelectMorphContext);
  const isOpen = morph?.isOpen ?? false;

  return (
    <MotionSelectTrigger
      ref={composeRefs(ref, morph?.triggerRef)}
      className={cn(triggerVariants({ size, invalid }), className)}
      animate={{ opacity: isOpen ? 0.5 : 1 }}
      transition={springs.smooth}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon name="chevron-down" size={iconSize[size ?? "md"]} className="shrink-0 text-label-tertiary" />
      </SelectPrimitive.Icon>
    </MotionSelectTrigger>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => {
  const morph = React.useContext(SelectMorphContext);
  const isOpen = morph?.isOpen ?? false;
  const origin = morph?.origin ?? null;
  const [highlightedValue, setHighlightedValue] = React.useState<string | null>(null);

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={composeRefs(ref, morph?.contentRef)}
        position={position}
        sideOffset={sideOffset}
        {...props}
        // No forceMount: SelectContentImpl bundles a body-scroll lock
        // (react-remove-scroll) and an outside-click listener
        // (DismissableLayer) that Radix only intends to run while the menu
        // is genuinely open. forceMount kept this component permanently
        // mounted, so those effects never turned off even while visually
        // closed - that's what was blocking interaction with the rest of
        // the page. Leaving this unforced lets Radix's own Presence swap it
        // for a lightweight hidden fragment on close, which still keeps
        // SelectItem/SelectItemText mounted (so the Trigger's selected-
        // value display keeps working) without those side effects.
        // `select-content-exit` (app/globals.css) is a real CSS animation
        // on data-state="closed" - Presence natively waits for one before
        // it actually unmounts, so the panel still gets a graceful close
        // without needing forceMount to do it via JS.
        className="z-50 select-content-exit"
      >
        <motion.div
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
          style={{ transformOrigin: "var(--radix-select-content-transform-origin)" }}
          className={cn(
            "max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width)",
            // Keeps the panel from ever overflowing a narrow viewport,
            // independent of how wide its longest item wants to be.
            "max-w-[calc(100vw-2rem)]",
            "material-thick overflow-hidden rounded-lg border border-separator p-1 shadow-lg",
            className,
          )}
        >
          {/* Content fades and blurs in slightly after the shape above
              starts resizing, rather than stretching visibly with it. */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              filter: isOpen ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ ...springs.smooth, delay: isOpen ? 0.08 : 0 }}
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-label-tertiary">
              <Icon name="chevron-up" size={14} />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className="flex flex-col gap-0.5">
              <SelectHighlightContext.Provider value={{ highlightedValue, setHighlightedValue }}>
                {children}
              </SelectHighlightContext.Provider>
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-label-tertiary">
              <Icon name="chevron-down" size={14} />
            </SelectPrimitive.ScrollDownButton>
          </motion.div>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = "SelectContent";

export type SelectItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
  "asChild"
>;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, value, ...props }, ref) => {
  const highlight = React.useContext(SelectHighlightContext);
  const isHighlighted = highlight !== null && highlight.highlightedValue === value;

  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        "relative flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body text-label-primary outline-none select-none",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      onFocus={() => highlight?.setHighlightedValue(value)}
      onBlur={() =>
        highlight?.setHighlightedValue((current) => (current === value ? null : current))
      }
      {...props}
    >
      {isHighlighted ? (
        <motion.div
          layoutId="select-item-highlight"
          className="absolute inset-0 rounded-sm bg-fill-secondary"
          transition={springs.snappy}
        />
      ) : null}
      <SelectPrimitive.ItemText className="relative z-10">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="relative z-10 flex items-center">
        <Icon name="check" size={14} className="text-tint" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = "SelectItem";

export type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-footnote font-medium text-label-tertiary", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("my-1 h-px bg-separator", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";
