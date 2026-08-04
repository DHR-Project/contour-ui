"use client";

import { useId, useRef, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { ListItemContent } from "@/components/ui/list";
import { useDragSelect } from "./use-drag-select";
import type { DragSelectTarget } from "./use-drag-select";

export type DropdownRole = "default" | "destructive";

export type DropdownItemDef =
  | { type: "action"; icon?: IconName; label: string; onSelect: () => void; role?: DropdownRole }
  | {
      type: "checkbox";
      icon?: IconName;
      label: string;
      checked: boolean;
      onCheckedChange: (checked: boolean) => void;
    }
  | {
      type: "radio-group";
      options: { value: string; label: string }[];
      value: string;
      onValueChange: (value: string) => void;
    }
  | { type: "submenu"; icon?: IconName; label: string; items: DropdownItemDef[] }
  | { type: "separator" }
  | { type: "label"; text: string };

export interface DropdownProps {
  trigger: ReactElement;
  items: DropdownItemDef[];
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

// springs.snappy (SS6.3/6.4) approximated with --ease-spring-out (SS6.2) --
// Radix mounts/unmounts this content itself, outside of React's tree, so
// Framer Motion can't drive it directly (see globals.css keyframes comment).
// The submenu-stack and drag-select motion below is a different case: it
// only animates children *inside* this already-mounted content, so it
// doesn't fight the same constraint -- Framer Motion is safe to use there.
// Exported for reuse by ContextMenu (contour-spec-context-menu.md: don't
// rewrite the render logic) -- Radix's ContextMenu/DropdownMenu sub-components
// are structurally parallel but distinct component families, so the JSX
// switch itself isn't shared, but the visual tokens are.
//
// Radius follows the concentric-nesting formula (outer = inner + padding),
// not --popover-radius directly -- at the item's --radius-sm (8px) plus the
// container's own 6px (p-1.5) padding, that's 14px, matching --radius-lg.
// `relative` anchors popLayout's absolutely-positioned exiting screen (see
// stackVariants below) so it stays clipped by `overflow-hidden` instead of
// escaping to whatever ancestor happens to be positioned.
export const contentClassName =
  "relative z-[var(--z-dropdown)] min-w-48 origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-hidden rounded-[var(--radius-lg)] border border-separator bg-bg-tertiary p-1.5 shadow-md " +
  "data-[state=open]:animate-[contour-scale-fade-in_var(--duration-fast)_var(--ease-spring-out)] " +
  "data-[state=closed]:animate-[contour-scale-fade-out_var(--duration-fast)_var(--ease-standard)]";

// --menu-item-padding-sides/-padding-y (SS4.8/4.9, contour-spec-dropdown-v2.md
// SSA.2a) -- denser than List's --padding-row-y since a menu needs to stay
// compact, and distinct from --padding-control-* which other controls use.
// `relative` is load-bearing for the absolutely-positioned drag-select
// highlight (SSA.5) rendered inside the active row.
export const itemClassName =
  "relative flex cursor-default select-none items-center gap-(--gap-icon-text) rounded-sm px-(--menu-item-padding-sides) py-(--menu-item-padding-y) outline-none data-[highlighted]:bg-fill-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

export const sectionTitleClassName =
  "px-(--menu-item-padding-sides) pt-(--menu-section-title-padding-top) pb-(--menu-section-title-padding-bottom) text-[length:var(--menu-section-title-size)] text-label-secondary";

export const separatorClassName = "my-(--menu-item-separator-padding) h-px bg-separator";

function CheckIndicator() {
  return (
    <DropdownMenu.ItemIndicator>
      <Icon name="check" size="sm" color="tint" />
    </DropdownMenu.ItemIndicator>
  );
}

// Collects drag-select targets (SSA.5) as a side effect of the same render
// pass that produces the item nodes, so the `data-drag-select-index` on each
// row and the `targets` array handed to `useDragSelect` can never drift out
// of sync with each other.
interface DragRenderContext {
  targets: DragSelectTarget[];
  highlightedIndex: number | null;
  highlightLayoutId: string;
}

function pushDragTarget(drag: DragRenderContext | undefined, target: DragSelectTarget): number | undefined {
  if (!drag) return undefined;
  drag.targets.push(target);
  return drag.targets.length - 1;
}

function DragHighlight({ layoutId }: { layoutId: string }) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={springs.snappy}
      className="absolute inset-0 -z-10 rounded-sm bg-fill-secondary"
    />
  );
}

type SubmenuItemDef = Extract<DropdownItemDef, { type: "submenu" }>;
type SubmenuRenderer = (
  item: SubmenuItemDef,
  index: number,
  dragIndex: number | undefined,
  drag: DragRenderContext | undefined,
) => ReactNode;

// `regular`+ default: Radix's own flyout cascade (contour-spec-dropdown-v2.md
// SSA.4) -- correct as-is, no changes needed. Nested flyout content is
// intentionally excluded from drag-select (SSA.5 scope note below).
const defaultSubmenuRenderer: SubmenuRenderer = (item, index, dragIndex, drag) => (
  <DropdownMenu.Sub key={index}>
    <DropdownMenu.SubTrigger className={itemClassName} data-drag-select-index={dragIndex}>
      {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
      <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<Icon name="chevron-right" size="sm" />} />
    </DropdownMenu.SubTrigger>
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent className={contentClassName} sideOffset={4}>
        {/* No `drag` passed through: drag-select only covers the currently
            visible screen (SSA.5 scope note, contour-spec-dropdown-v2.md). */}
        {renderItems(item.items)}
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>
  </DropdownMenu.Sub>
);

function renderItems(
  items: DropdownItemDef[],
  drag?: DragRenderContext,
  renderSubmenu: SubmenuRenderer = defaultSubmenuRenderer,
) {
  return items.map((item, index) => {
    switch (item.type) {
      case "separator":
        return <DropdownMenu.Separator key={index} className={separatorClassName} />;
      case "label":
        return (
          <DropdownMenu.Label key={index} className={sectionTitleClassName}>
            {item.text}
          </DropdownMenu.Label>
        );
      case "action": {
        const dragIndex = pushDragTarget(drag, { onSelect: item.onSelect });
        return (
          <DropdownMenu.Item
            key={index}
            data-drag-select-index={dragIndex}
            className={cn(itemClassName, item.role === "destructive" && "text-[rgb(var(--color-destructive))]")}
            onSelect={item.onSelect}
          >
            {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
            <ListItemContent leadingIcon={item.icon} title={item.label} />
          </DropdownMenu.Item>
        );
      }
      case "checkbox": {
        const dragIndex = pushDragTarget(drag, { onSelect: () => item.onCheckedChange(!item.checked) });
        return (
          <DropdownMenu.CheckboxItem
            key={index}
            data-drag-select-index={dragIndex}
            className={itemClassName}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            onSelect={(event) => event.preventDefault()}
          >
            {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
            <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<CheckIndicator />} />
          </DropdownMenu.CheckboxItem>
        );
      }
      case "radio-group":
        return (
          <DropdownMenu.RadioGroup key={index} value={item.value} onValueChange={item.onValueChange}>
            {item.options.map((option) => {
              const dragIndex = pushDragTarget(drag, { onSelect: () => item.onValueChange(option.value) });
              return (
                <DropdownMenu.RadioItem
                  key={option.value}
                  value={option.value}
                  data-drag-select-index={dragIndex}
                  className={itemClassName}
                  onSelect={(event) => event.preventDefault()}
                >
                  {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
                  <ListItemContent title={option.label} trailing={<CheckIndicator />} />
                </DropdownMenu.RadioItem>
              );
            })}
          </DropdownMenu.RadioGroup>
        );
      case "submenu": {
        // Highlightable like any other row, but releasing a drag over it is
        // a no-op -- it never cascades open mid-drag (SSA.5): the user must
        // release and tap again to enter the submenu normally.
        const dragIndex = pushDragTarget(drag, { onSelect: () => {} });
        return renderSubmenu(item, index, dragIndex, drag);
      }
      default:
        return null;
    }
  });
}

interface StackFrame {
  label: string;
  items: DropdownItemDef[];
}

// Direction-aware slide (contour-spec-dropdown-v2.md SSA.4): entering
// submenu comes from the right and settles at center; the retreating parent
// eases back to -30%/40% opacity instead of disappearing, signaling "still
// there." Reversed on Back. `custom` must be set on both AnimatePresence and
// the motion.div: AnimatePresence forwards it to the exiting element (which
// otherwise can't receive fresh props once removed from the tree), while
// the entering element reads its own prop normally.
const stackVariants = {
  enter: (direction: "push" | "pop") => ({
    x: direction === "push" ? "100%" : "-30%",
    opacity: direction === "push" ? 1 : 0.4,
    filter: "blur(8px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: "push" | "pop") => ({
    x: direction === "push" ? "-30%" : "100%",
    opacity: direction === "push" ? 0.4 : 1,
    filter: "blur(8px)",
  }),
};

export function Dropdown({ trigger, items, side = "bottom", align = "start" }: DropdownProps) {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const isCoarsePointer = useIsCoarsePointer();
  const reducedMotion = useReducedMotion();
  const highlightLayoutId = `dropdown-drag-highlight-${useId()}`;
  const contentRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [direction, setDirection] = useState<"push" | "pop">("push");

  const currentFrame = stack[stack.length - 1];
  const currentItems = currentFrame ? currentFrame.items : items;

  function pushSubmenu(label: string, subItems: DropdownItemDef[]) {
    setDirection("push");
    setStack((previous) => [...previous, { label, items: subItems }]);
  }

  function popSubmenu() {
    setDirection("pop");
    setStack((previous) => previous.slice(0, -1));
  }

  const dragTargets: DragSelectTarget[] = [];
  const { highlightedIndex, triggerDragProps } = useDragSelect({
    enabled: isCoarsePointer,
    open,
    onOpenRequest: () => setOpen(true),
    targets: dragTargets,
    containerRef: contentRef,
  });

  // Only built on coarse pointers -- fine-pointer (mouse) never renders the
  // extra highlight nodes or index attributes (SSA.5 scope: touch-only).
  const drag: DragRenderContext | undefined = isCoarsePointer
    ? { targets: dragTargets, highlightedIndex, highlightLayoutId }
    : undefined;

  // compact: stack push/pop with Back, no Radix flyout (SSA.4). regular+:
  // Radix's default flyout cascade, untouched.
  const compactSubmenuRenderer: SubmenuRenderer = (item, index, dragIndex, dragCtx) => (
    <DropdownMenu.Item
      key={index}
      data-drag-select-index={dragIndex}
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        pushSubmenu(item.label, item.items);
      }}
    >
      {dragCtx && dragIndex === dragCtx.highlightedIndex && <DragHighlight layoutId={dragCtx.highlightLayoutId} />}
      <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<Icon name="chevron-right" size="sm" />} />
    </DropdownMenu.Item>
  );

  const backRow = currentFrame && (
    <DropdownMenu.Item
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        popSubmenu();
      }}
    >
      <Icon name="chevron-left" size="sm" color="tint" />
      <Text as="span" textStyle="footnote" weight="semibold" color="tint">
        {currentFrame.label}
      </Text>
    </DropdownMenu.Item>
  );

  const compactScreen = (
    <>
      {backRow}
      {renderItems(currentItems, drag, compactSubmenuRenderer)}
    </>
  );

  const content = !isCompact ? (
    renderItems(items, drag)
  ) : reducedMotion ? (
    <div>{compactScreen}</div>
  ) : (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={stack.length}
        custom={direction}
        variants={stackVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={springs.snappy}
      >
        {compactScreen}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setStack([]);
      }}
    >
      {/* onPointerDown intercepts touchstart to open immediately, ahead of
          Radix's own click handling (SSA.5: the menu should open right away
          while the finger is still down, not wait for release). No-op on
          mouse/pen; merges with the child's own handlers via Radix's
          asChild/Slot. */}
      <DropdownMenu.Trigger asChild {...triggerDragProps}>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content ref={contentRef} className={contentClassName} side={side} align={align} sideOffset={4}>
          {content}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
