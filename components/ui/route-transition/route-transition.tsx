"use client";

import { Activity, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { durations } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export interface RouteTransitionProps {
  children: ReactNode;
  /**
   * How many previously visited routes stay mounted (hidden via React
   * `<Activity>`) after navigating away, so their state/scroll position
   * survives instead of being torn down. 0 disables caching. Default 1,
   * hard-capped at 10 regardless of what's passed.
   */
  cacheDepth?: number;
}

const MAX_CACHE_DEPTH = 10;

interface CachedRoute {
  path: string;
  tree: ReactNode;
}

export function RouteTransition({ children, cacheDepth = 1 }: RouteTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const effectiveCacheDepth = Math.min(cacheDepth, MAX_CACHE_DEPTH);
  const [cachedRoutes, setCachedRoutes] = useState<CachedRoute[]>([]);
  const [lastCachedPathname, setLastCachedPathname] = useState<string | null>(null);

  // Caches each route's children as it's visited, so navigating away can
  // keep the previous view mounted (hidden) below. Derived inline during
  // render rather than in an effect -- an unconditional setState in an
  // effect body forces an extra cascading render on every navigation,
  // which this project's react-hooks/set-state-in-effect rule flags;
  // calling setState conditionally during render is React's documented
  // way to derive state from a changed input without that extra pass.
  if (effectiveCacheDepth > 0 && lastCachedPathname !== pathname) {
    setCachedRoutes((prev) => {
      const next = [{ path: pathname, tree: children }, ...prev.filter((route) => route.path !== pathname)];
      return next.slice(0, effectiveCacheDepth);
    });
    setLastCachedPathname(pathname);
  }

  const transition = { duration: reducedMotion ? durations.instant : durations.fast };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {effectiveCacheDepth > 0 &&
        cachedRoutes
          .filter((route) => route.path !== pathname)
          .map((route) => (
            <Activity key={route.path} mode="hidden">
              {route.tree}
            </Activity>
          ))}
    </>
  );
}
