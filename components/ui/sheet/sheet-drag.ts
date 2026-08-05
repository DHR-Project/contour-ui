// Pure snap-point math for the draggable Bottom Sheet (contour-spec-sheet-v2.md
// SS "Cơ chế kéo/snap points"). Kept free of React/Framer Motion so the
// resolution logic is unit-testable without mounting a drag gesture.

/** Fling speed (px/s) above which release commits in the fling direction
 * regardless of resting distance. */
export const SNAP_VELOCITY_THRESHOLD = 500;

export interface SnapCandidate {
  y: number;
  /** A snap fraction, or "dismiss" for the fully-closed position. */
  value: number | "dismiss";
}

/** Panel Y offset (px) for a given open fraction -- 0 is fully at `maxSnap`
 * (top of the panel's own drag travel), increasing downward. The panel is
 * rendered at a fixed height of `maxSnap * viewportHeight`, so this is how
 * far to translate it down to reveal only `fraction` of the viewport. */
export function snapFractionToY(fraction: number, maxSnap: number, viewportHeight: number): number {
  return (maxSnap - fraction) * viewportHeight;
}

export function buildSnapCandidates(
  snapPoints: number[],
  maxSnap: number,
  viewportHeight: number,
  includeDismiss: boolean,
): SnapCandidate[] {
  const candidates: SnapCandidate[] = snapPoints.map((value) => ({
    y: snapFractionToY(value, maxSnap, viewportHeight),
    value,
  }));
  if (includeDismiss) {
    candidates.push({ y: snapFractionToY(0, maxSnap, viewportHeight), value: "dismiss" });
  }
  return candidates;
}

/**
 * Resolves where a drag release should settle. Velocity past the threshold
 * commits in the fling direction to the next candidate past the current
 * position (or fully open/dismissed if there is no further candidate);
 * otherwise settles on whichever candidate is nearest by distance.
 */
export function resolveDragTarget(params: {
  currentY: number;
  velocityY: number;
  snapPoints: number[];
  maxSnap: number;
  viewportHeight: number;
  includeDismiss: boolean;
}): number | "dismiss" {
  const { currentY, velocityY, snapPoints, maxSnap, viewportHeight, includeDismiss } = params;
  const candidates = buildSnapCandidates(snapPoints, maxSnap, viewportHeight, includeDismiss);
  const sortedByY = [...candidates].sort((a, b) => a.y - b.y);

  if (Math.abs(velocityY) > SNAP_VELOCITY_THRESHOLD) {
    if (velocityY > 0) {
      const next = sortedByY.find((c) => c.y > currentY + 1);
      return next ? next.value : (sortedByY[sortedByY.length - 1]?.value ?? "dismiss");
    }
    const next = [...sortedByY].reverse().find((c) => c.y < currentY - 1);
    return next ? next.value : (sortedByY[0]?.value ?? maxSnap);
  }

  let nearest = candidates[0];
  for (const candidate of candidates) {
    if (Math.abs(candidate.y - currentY) < Math.abs(nearest.y - currentY)) {
      nearest = candidate;
    }
  }
  return nearest.value;
}
