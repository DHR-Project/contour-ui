import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { IconName } from "@/components/icon";

export interface ToolbarAction {
  icon?: IconName;
  label?: string;
  onClick: () => void;
}

export type ToolbarPosition = "top" | "bottom";

export interface ToolbarProps {
  actions: ToolbarAction[];
  /** Default: "bottom". */
  position?: ToolbarPosition;
  /** Default: true. */
  progressiveBlur?: boolean;
  className?: string;
}

// Simplest of the three (SS "Part C") -- one row of actions, no Large
// Title, no adaptive presentation.
export function Toolbar({ actions, position = "bottom", progressiveBlur = true, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "sticky z-40 overflow-hidden",
        position === "top" ? "top-0 pt-(--safe-area-top)" : "bottom-0 pb-(--safe-area-bottom)",
        !progressiveBlur && "bg-bg-primary",
        className,
      )}
    >
      {progressiveBlur && <ProgressiveBlur position={position === "top" ? "top" : "bottom"} />}
      <div
        className="relative z-10 flex min-h-11 items-center justify-around gap-(--space-1) px-(--padding-control-x)"
      >
        {actions.map((action, index) => {
          // Falls back to the icon name as an accessible name when an
          // icon-only action has no `label` -- not ideal, but the spec's
          // ToolbarAction type doesn't carry a separate ariaLabel field.
          const accessibleLabel = action.label ?? action.icon ?? `Action ${index + 1}`;
          return action.label ? (
            <Button key={accessibleLabel + index} variant="plain" leadingIcon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          ) : (
            <Button
              key={accessibleLabel + index}
              variant="plain"
              leadingIcon={action.icon}
              aria-label={accessibleLabel}
              onClick={action.onClick}
            />
          );
        })}
      </div>
    </div>
  );
}
