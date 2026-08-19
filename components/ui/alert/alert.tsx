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
                <div className="flex flex-col px-4 pt-5 pb-4">
                  <RadixAlertDialog.Title asChild>
                    <Text textStyle="headline">{title}</Text>
                  </RadixAlertDialog.Title>
                  {description && (
                    <RadixAlertDialog.Description asChild>
                      <Text
                        textStyle="footnote"
                        color="secondary"
                        className="mt-1"
                      >
                        {description}
                      </Text>
                    </RadixAlertDialog.Description>
                  )}
                </div>

                <div
                  className={cn(
                    "flex gap-(--space-2) p-(--space-3)",
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
                      sortedActions.findIndex(
                        (a) => a.role !== "destructive",
                      ) === i;

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
                        <motion.button
                          type="button"
                          autoFocus={isFirstSafeAction}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: durations.instant }}
                          className={cn(
                            "flex flex-1 min-h-11 items-center justify-center px-(--space-3) py-(--space-2) bg-fill-tertiary hover-fine:bg-fill-quaternary focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:-outline-offset-(--focus-ring-width) focus-visible:outline-[rgb(var(--focus-ring-color))] rounded-md",
                            action.emphasized && action.role !== "destructive" && "bg-tint hover-fine:bg-tint",
                          )}
                        >
                          <Text
                            textStyle="body"
                            weight={action.emphasized ? "semibold" : "regular"}
                            color={
                              action.role === "destructive"
                                ? "destructive"
                                : action.emphasized ? "primary" : "tint"
                            }
                          >
                            {action.label}
                          </Text>
                        </motion.button>
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
