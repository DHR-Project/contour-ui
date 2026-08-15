"use client";

import { useEffect, useState } from "react";

const OFFSET = 96; // matches DocsSection/DocsSubsection's scroll-mt-20 clearance under the fixed mobile bar.

// Scrollspy for DocsToc: the active heading is the last one (in document
// order) whose top has scrolled up past OFFSET -- i.e. whichever section
// the reader is currently under. Deliberately position-based rather than
// IntersectionObserver-based: DocsSection/DocsSubsection ids are on the
// wrapping <section>/<div>, which (for DocsSection) can span several child
// subsections and stay "intersecting" the whole time the reader is inside
// any of them -- an IntersectionObserver picking "closest intersecting top"
// kept selecting that tall parent section over the much shorter child
// subsection actually on screen. Comparing raw top position sidesteps that:
// only where each heading itself starts matters, not how tall its wrapper is.
//
// `pageKey` (DocsToc passes its pathname) forces this effect to re-run on
// every route change, even when it lands on a page whose heading ids are
// byte-for-byte the same as the previous one (every component doc page
// uses the same fixed section ids: demo/anatomy/props/states/do-dont/
// tokens) -- otherwise `idsKey` wouldn't change and this effect would never
// re-subscribe there.
//
// `measure` re-queries `document.getElementById` on every call instead of
// closing over a snapshot of elements taken when the effect starts. RouteTransition
// plays its page transition via Framer Motion's `AnimatePresence mode="wait"`,
// which keeps the outgoing page's DOM mounted for the exit animation and
// doesn't attach the incoming page's DOM until that finishes -- so an
// element snapshot taken right as `pathname` changes can end up pointing at
// the *previous* page's nodes. Once that exit animation completes and those
// nodes are actually removed, a detached element's getBoundingClientRect()
// reports an empty/zeroed rect (top: 0), which satisfies `top <= OFFSET` for
// every element in the stale snapshot and walks the loop all the way to the
// last heading -- regardless of where the reader actually scrolled to on the
// new page. Looking elements up fresh each time sidesteps the snapshot
// entirely: whatever the DOM looks like *right now* is what gets measured.
export function useActiveHeading(ids: string[], pageKey?: string): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join("|");

  useEffect(() => {
    if (ids.length === 0) return;

    let rafId: number | undefined;

    const measure = () => {
      rafId = undefined;
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) return;

      // Elements are in document order (scanHeadings walks the DOM top to
      // bottom), so the last one whose top has passed OFFSET is the active
      // one -- falls back to the first heading if none has been reached yet.
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top > OFFSET) break;
        current = el.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (rafId === undefined) rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, pageKey]);

  return activeId;
}
