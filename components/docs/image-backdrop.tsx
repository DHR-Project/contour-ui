import type { ReactNode } from "react";

const seeds: Record<string, number> = {
  background: 30,
  fill: 42,
};

// High-frequency stripes so a backdrop-filter: blur applied on top is
// unmistakable - a photo is too smooth at this box size to show the
// difference clearly.
const patternBackground =
  "repeating-linear-gradient(45deg, #0a84ff 0 20px, #ff375f 20px 40px, #ffd60a 40px 60px, #30d158 60px 80px)";

export interface ImageBackdropProps {
  /** Which token section this backdrop illustrates - picks a fixed photo. */
  seed?: keyof typeof seeds;
  /** Use a high-contrast striped pattern instead of a photo (for blur demos). */
  variant?: "photo" | "pattern";
  className?: string;
  children: ReactNode;
}

/**
 * Places token swatches over a photo (or, for blur demos, a high-contrast
 * pattern) instead of a flat surface, so how each token interacts with
 * whatever is behind it is visible directly rather than just described.
 */
export function ImageBackdrop({ seed, variant = "photo", className, children }: ImageBackdropProps) {
  const backgroundImage =
    variant === "pattern"
      ? patternBackground
      : `url(https://picsum.photos/seed/contour-${seed}-${seeds[seed ?? "background"]}/800/400)`;

  return (
    <div
      className={className}
      style={{
        backgroundImage,
        backgroundSize: variant === "pattern" ? undefined : "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </div>
  );
}
