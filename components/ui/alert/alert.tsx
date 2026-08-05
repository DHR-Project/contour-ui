"use client";

import { AlertDialog as RadixAlertDialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { Text } from "@/components/ui/text";

export interface AlertAction {
  label: string;
  onClick: () => void;
  role?: "default" | "destructive" | "cancel";
  emphasized?: boolean;
}

export interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actions: AlertAction[];
}

export function Alert({
  open,
  onOpenChange,
  title,
  description,
  actions,
}: AlertProps) {
  const isRow = actions.length === 2;
  const cancelActionIndex = actions.findIndex((a) => a.role === "cancel");

  // Determine sorted actions layout.
  // If row (2 actions), cancel is always on the right (index 1).
  // If column (1 or >=3 actions), cancel is always at the bottom.
  const sortedActions = [...actions];
  if (cancelActionIndex !== -1) {
    const [cancelAction] = sortedActions.splice(cancelActionIndex, 1);
    sortedActions.push(cancelAction); // push to end (right for row, bottom for col).
  }

  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixAlertDialog.Portal forceMount>
            <RadixAlertDialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: durations.normal }}
                className="fixed inset-0 z-390 bg-overlay-default" // z-[390] maps to --z-alert
              />
            </RadixAlertDialog.Overlay>
            <RadixAlertDialog.Content
              asChild
              forceMount
              // Prevent dismiss unless action button is clicked (spec rule).
              // Outside pointer-down is already blocked internally by AlertDialogContent.
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={springs.bouncy}
                className={cn(
                  "fixed z-390 overflow-hidden rounded-lg bg-(--material-thick) backdrop-blur-[20px]",
                  "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "w-[min(320px,calc(100%-var(--space-4)*2))]",
                  "flex flex-col outline-none",
                )}
              >
                <div className="flex flex-col items-center px-4 pt-5 pb-4">
                  <RadixAlertDialog.Title asChild>
                    <Text textStyle="headline" className="text-center">
                      {title}
                    </Text>
                  </RadixAlertDialog.Title>
                  {description && (
                    <RadixAlertDialog.Description asChild>
                      <Text
                        textStyle="footnote"
                        color="secondary"
                        className="mt-1 text-center"
                      >
                        {description}
                      </Text>
                    </RadixAlertDialog.Description>
                  )}
                </div>

                <div
                  className={cn(
                    "flex border-t border-separator",
                    isRow ? "flex-row" : "flex-col",
                  )}
                >
                  {sortedActions.map((action, i) => {
                    const Component =
                      action.role === "cancel"
                        ? RadixAlertDialog.Cancel
                        : RadixAlertDialog.Action;

                    // Focus defaults to cancel. If no cancel, find first non-destructive.
                    const isFirstSafeAction =
                      cancelActionIndex === -1 &&
                      action.role !== "destructive" &&
                      sortedActions.findIndex((a) => a.role !== "destructive") === i;

                    return (
                      <Component
                        key={i}
                        asChild
                        onClick={(e) => {
                          e.preventDefault();
                          action.onClick();
                          onOpenChange(false);
                        }}
                      >
                        <button
                          type="button"
                          autoFocus={isFirstSafeAction}
                          className={cn(
                            "flex h-11 flex-1 select-none items-center justify-center outline-none",
                            "focus-visible:bg-black/5 active:bg-black/5 transition-colors duration-100",
                            "text-body", // style font size + line height
                            action.role === "destructive"
                              ? "text-[rgb(var(--color-destructive))]"
                              : "text-tint",
                            action.emphasized
                              ? "font-semibold"
                              : "font-regular",
                            isRow &&
                              i > 0 &&
                              "border-l border-separator",
                            !isRow &&
                              i > 0 &&
                              "border-t border-separator",
                          )}
                        >
                          {action.label}
                        </button>
                      </Component>
                    );
                  })}
                </div>
              </motion.div>
            </RadixAlertDialog.Content>
          </RadixAlertDialog.Portal>
        )}
      </AnimatePresence>
    </RadixAlertDialog.Root>
  );
}
