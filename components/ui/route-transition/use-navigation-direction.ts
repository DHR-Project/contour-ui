"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type NavigationDirection = "push" | "pop";

// Distinguishes push (router.push, Link click) from pop (browser back/
// forward, router.back()) so RouteTransition knows which way to slide.
// `popstate` only fires for pop navigations -- router.push() calls
// history.pushState() directly and never triggers it -- so a listener that
// flags the next pathname change as a pop is enough to tell the two apart,
// without needing to read or patch Next's internal history.state shape
// (which the "NOT the Next.js you know" warning in AGENTS.md means we
// shouldn't assume about).
//
// State (not a ref) carries that flag across renders: the direction has to
// be known in the same render that mounts the new page's motion.div (its
// `initial` position depends on it), which rules out deriving it in an
// effect (an effect only runs after that render already committed). Calling
// `setState` conditionally during render is React's documented pattern for
// deriving state from a prop change mid-render -- React discards and
// re-runs the render immediately, so `direction` is already correct by the
// time this render's output is used. A ref read/write here would do the
// same thing but is flagged by this project's react-hooks/refs lint rule
// (ref access must stay inside effects/handlers, never the render body).
export function useNavigationDirection(): NavigationDirection {
  const pathname = usePathname();
  const [popped, setPopped] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [direction, setDirection] = useState<NavigationDirection>("push");

  useEffect(() => {
    const onPopState = () => setPopped(true);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (prevPathname !== pathname) {
    setDirection(popped ? "pop" : "push");
    setPopped(false);
    setPrevPathname(pathname);
  }

  return direction;
}
