"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/lib/utils/cn";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";

export interface SplitViewProps {
  /** Typically a <TabBar> in its "sidebar" position -- see contour-spec-splitview-v2.md SS1. */
  sidebar: ReactNode;
  /** The current route's content -- SplitView renders this as-is, relying on RouteTransition (app/template.tsx) for the navigation animation. */
  children: ReactNode;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  /** Reserved for a future icon-only collapsed sidebar mode. Not implemented yet (SS4). */
  collapsible?: boolean;
}

const DEFAULT_SIDEBAR_WIDTH = 280;
const STORAGE_KEY = "contour-splitview-sidebar-width";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SplitView({ sidebar, children, minSidebarWidth = 240, maxSidebarWidth = 400 }: SplitViewProps) {
  const sizeClass = useSizeClass();
  const isCoarsePointer = useIsCoarsePointer();
  const isCompact = sizeClass === "compact";

  const [sidebarWidth, setSidebarWidth] = useState(() =>
    clamp(DEFAULT_SIDEBAR_WIDTH, minSidebarWidth, maxSidebarWidth),
  );
  // Mirrors `sidebarWidth` for the drag handler to read without becoming a
  // dependency of it -- the handler mutates the CSS var directly every frame
  // (SS3's "no animation while dragging, 1:1 with the pointer") rather than
  // going through React state, so it needs a value that doesn't lag behind
  // by a render.
  const widthRef = useRef(sidebarWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  // localStorage isn't available during SSR -- start at the clamped default
  // (matches the server render) and correct after mount, same trade-off
  // useSizeClass/useIsCoarsePointer document. `sync` doubles as the initial
  // read and the "storage" event handler (mirrors TabBar's cross-tab
  // preference sync, SS2.5), which also keeps this a subscription-style
  // effect rather than an unconditional setState-in-effect.
  useEffect(() => {
    const sync = () => {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(stored) && stored > 0) {
        const next = clamp(stored, minSidebarWidth, maxSidebarWidth);
        widthRef.current = next;
        setSidebarWidth(next);
      }
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bindDrag = useDrag(
    ({ first, last, movement: [mx], memo }) => {
      const startWidth = first ? widthRef.current : (memo as number);
      const next = clamp(startWidth + mx, minSidebarWidth, maxSidebarWidth);
      widthRef.current = next;
      containerRef.current?.style.setProperty("--sidebar-current-width", `${next}px`);
      if (last) {
        setSidebarWidth(next);
        window.localStorage.setItem(STORAGE_KEY, String(next));
      }
      return startWidth;
    },
    { axis: "x", enabled: !isCompact && !isCoarsePointer },
  );

  return (
    <div
      ref={containerRef}
      style={{ "--sidebar-current-width": `${sidebarWidth}px` } as CSSProperties}
    >
      {!isCompact && (
        <div className="fixed inset-y-0 left-0 z-(--z-sidebar) w-(--sidebar-current-width)">
          {sidebar}
          {!isCoarsePointer && (
            // ~8px hit area straddling the edge, invisible until hovered
            // (SS3) -- cursor is the only affordance, no visible handle.
            <div
              {...(bindDrag() as Record<string, unknown>)}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
              className="absolute inset-y-0 right-0 w-2 translate-x-1/2 cursor-col-resize touch-none"
            />
          )}
        </div>
      )}

      <div className={cn(!isCompact && "pl-(--sidebar-current-width)")}>{children}</div>

      {isCompact && <div className="fixed inset-x-0 bottom-0 z-(--z-sidebar)">{sidebar}</div>}
    </div>
  );
}
