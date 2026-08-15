"use client";

import { useEffect, useState } from "react";

// Whether the browser window/tab itself currently has focus -- distinct
// from `:focus-within` (keyboard focus on a descendant element). Sidebar
// uses this to dim its active row when the user switches to another
// app/tab, mirroring the macOS Mail/Finder sidebar convention
// (contour-spec-sidebar.md SS3).
export function useWindowFocus(): boolean {
  // Always `true` on the first render, matching the server (no `document`
  // there) -- reading `document.hasFocus()` synchronously here instead
  // would diverge from that whenever the tab happens to be unfocused right
  // as it hydrates, producing a real hydration mismatch. Corrected via the
  // effect below immediately after mount, same trade-off SplitView's own
  // localStorage read documents.
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    const syncFocus = () => setFocused(document.hasFocus());
    syncFocus();
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return focused;
}
