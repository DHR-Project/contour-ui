"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { generateTypeCSSVars } from "@/lib/typography/scale";
import type { SizeMode } from "@/lib/typography/scale";

const STORAGE_KEY = "contour-size-mode";
const DEFAULT_SIZE_MODE: SizeMode = "large";
// Mirrors TabBar's same-tab layout preference pattern -- native "storage"
// events only fire in OTHER tabs/windows, not the one that made the change.
const SIZE_MODE_CHANGE_EVENT = "contour-size-mode-change";

function subscribe(onChange: () => void) {
  window.addEventListener(SIZE_MODE_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SIZE_MODE_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

interface ContourContextValue {
  sizeMode: SizeMode;
  setSizeMode: (mode: SizeMode) => void;
}

const ContourContext = createContext<ContourContextValue>({
  sizeMode: DEFAULT_SIZE_MODE,
  setSizeMode: () => {},
});

export interface ContourProviderProps {
  /** Fallback Dynamic Type level (design-tokens-summary-v2.md SS3.6) used
   * when nothing is persisted yet. Default "large" matches the SSR-safe
   * baseline baked into styles/tokens.css, so there's no flash on mount
   * unless a different mode was persisted from a previous visit. */
  sizeMode?: SizeMode;
  children: ReactNode;
}

// Only handles sizeMode today -- tint (SS2.7) and dark mode (SS2.5) aren't
// wired into a runtime context yet, they're still static token/`.dark`
// class + the inline FOUC script in app/layout.tsx. This is the place
// they'd extend into if they need live in-app switching later.
//
// Known gap: unlike dark mode, there's no inline FOUC-prevention script for
// a persisted non-default sizeMode -- that would mean duplicating the full
// lib/typography/scale.ts lookup table into a <script> string. Since
// sizeMode has no UI entry point yet (nothing lets a user change it), a
// user coming back with a persisted non-default value briefly sees the
// "large" baseline before the effect below runs. Revisit if/when sizeMode
// switching ships in the UI.
export function ContourProvider({ sizeMode: defaultSizeMode = DEFAULT_SIZE_MODE, children }: ContourProviderProps) {
  // Reads localStorage directly as the external source of truth (like
  // TabBar's layout preference) instead of useState+effect, so there's no
  // setState-during-effect render cascade on mount.
  const sizeMode = useSyncExternalStore(
    subscribe,
    () => (window.localStorage.getItem(STORAGE_KEY) as SizeMode | null) ?? defaultSizeMode,
    () => defaultSizeMode,
  );

  useEffect(() => {
    const vars = generateTypeCSSVars(sizeMode);
    Object.entries(vars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, [sizeMode]);

  const setSizeMode = (mode: SizeMode) => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new Event(SIZE_MODE_CHANGE_EVENT));
  };

  return <ContourContext.Provider value={{ sizeMode, setSizeMode }}>{children}</ContourContext.Provider>;
}

export function useContourSizeMode(): ContourContextValue {
  return useContext(ContourContext);
}
