"use client";

import { useEffect, useState } from "react";

// SSR-safe live clock for relative-time display ("5m ago"). Starts at
// `null` -- matching what the server renders, since Date.now() isn't
// meaningful there -- and only picks up the real timestamp in the mount
// effect, same trade-off as useIsCoarsePointer/useWindowFocus. Calling
// Date.now() directly during render diverges between the server pass and
// the client's hydration pass (different wall-clock moments), which is a
// real hydration mismatch, not just a stale value.
export function useNow(intervalMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
