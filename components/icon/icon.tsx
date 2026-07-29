import { cn } from "@/lib/utils";
import { iconRegistry } from "./icon-registry";
import type { IconName } from "./icon.types";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

/**
 * Public API for icons across Contour.
 * Never import lucide-react directly in components — always go through <Icon name="..." />.
 */
export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideIcon = iconRegistry[name];

  if (!LucideIcon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Contour/Icon] Icon "${name}" not found in icon-registry.`);
    }
    return null;
  }

  return (
    <LucideIcon
      size={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
