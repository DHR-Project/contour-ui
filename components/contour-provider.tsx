"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { generateTypeCSSVars } from "@/lib/typography/scale";
import type { SizeMode } from "@/lib/typography/scale";

export type ThemeMode = "light" | "dark" | "system";

// The 12 base system colors (styles/tokens.css SS2.1) -- tint can only be
// one of these, never an arbitrary value (design-tokens-summary-v2.md SS2.7).
export const TINT_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "mint",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
] as const;
export type TintColor = (typeof TINT_COLORS)[number];

const SIZE_MODE_KEY = "contour-size-mode";
const THEME_KEY = "contour-theme";
const TINT_KEY = "contour-tint";
const REDUCE_TRANSPARENCY_KEY = "contour-reduce-transparency";
const REDUCE_MOTION_KEY = "contour-reduce-motion";
const HIGH_CONTRAST_KEY = "contour-high-contrast";

const DEFAULT_SIZE_MODE: SizeMode = "large";
const DEFAULT_THEME: ThemeMode = "system";
const DEFAULT_TINT: TintColor = "blue";

// Shared same-tab change signal for every preference below -- native
// "storage" events only fire in OTHER tabs/windows, not the one that made
// the change (mirrors the original sizeMode-only implementation).
const PREFERENCE_CHANGE_EVENT = "contour-preference-change";

function subscribe(onChange: () => void) {
  window.addEventListener(PREFERENCE_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PREFERENCE_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function subscribeSystemDark(onChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function readBoolean(key: string): boolean {
  return window.localStorage.getItem(key) === "1";
}

function writeAndNotify(key: string, value: string | null) {
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, value);
  window.dispatchEvent(new Event(PREFERENCE_CHANGE_EVENT));
}

interface ContourContextValue {
  sizeMode: SizeMode;
  setSizeMode: (mode: SizeMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  /** "system" resolved to the actual scheme currently in effect. */
  resolvedTheme: "light" | "dark";
  tint: TintColor;
  setTint: (tint: TintColor) => void;
  reduceTransparency: boolean;
  setReduceTransparency: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}

const ContourContext = createContext<ContourContextValue>({
  sizeMode: DEFAULT_SIZE_MODE,
  setSizeMode: () => {},
  theme: DEFAULT_THEME,
  setTheme: () => {},
  resolvedTheme: "light",
  tint: DEFAULT_TINT,
  setTint: () => {},
  reduceTransparency: false,
  setReduceTransparency: () => {},
  reduceMotion: false,
  setReduceMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
});

export interface ContourProviderProps {
  /** Fallback Dynamic Type level (design-tokens-summary-v2.md SS3.6) used
   * when nothing is persisted yet. Default "large" matches the SSR-safe
   * baseline baked into styles/tokens.css, so there's no flash on mount
   * unless a different mode was persisted from a previous visit. */
  sizeMode?: SizeMode;
  children: ReactNode;
}

// Reads persisted preferences directly from localStorage as the external
// source of truth (like TabBar's layout preference) instead of
// useState+effect, so there's no setState-during-effect render cascade on
// mount. The .dark class, --tint value, and reduce-*/high-contrast classes
// applied here are also set synchronously pre-hydration by the inline
// FOUC-prevention script in app/layout.tsx -- the effects below just keep
// them in sync as state changes after mount.
export function ContourProvider({ sizeMode: defaultSizeMode = DEFAULT_SIZE_MODE, children }: ContourProviderProps) {
  const sizeMode = useSyncExternalStore(
    subscribe,
    () => (window.localStorage.getItem(SIZE_MODE_KEY) as SizeMode | null) ?? defaultSizeMode,
    () => defaultSizeMode,
  );
  const theme = useSyncExternalStore(
    subscribe,
    () => (window.localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? DEFAULT_THEME,
    () => DEFAULT_THEME,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
  const tint = useSyncExternalStore(
    subscribe,
    () => (window.localStorage.getItem(TINT_KEY) as TintColor | null) ?? DEFAULT_TINT,
    () => DEFAULT_TINT,
  );
  const reduceTransparency = useSyncExternalStore(subscribe, () => readBoolean(REDUCE_TRANSPARENCY_KEY), () => false);
  const reduceMotion = useSyncExternalStore(subscribe, () => readBoolean(REDUCE_MOTION_KEY), () => false);
  const highContrast = useSyncExternalStore(subscribe, () => readBoolean(HIGH_CONTRAST_KEY), () => false);

  const resolvedTheme: "light" | "dark" = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const vars = generateTypeCSSVars(sizeMode);
    Object.entries(vars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, [sizeMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--tint", `var(--color-${tint})`);
  }, [tint]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-transparency", reduceTransparency);
  }, [reduceTransparency]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const value: ContourContextValue = {
    sizeMode,
    setSizeMode: (mode) => writeAndNotify(SIZE_MODE_KEY, mode),
    theme,
    setTheme: (mode) => writeAndNotify(THEME_KEY, mode),
    resolvedTheme,
    tint,
    setTint: (color) => writeAndNotify(TINT_KEY, color),
    reduceTransparency,
    setReduceTransparency: (v) => writeAndNotify(REDUCE_TRANSPARENCY_KEY, v ? "1" : null),
    reduceMotion,
    setReduceMotion: (v) => writeAndNotify(REDUCE_MOTION_KEY, v ? "1" : null),
    highContrast,
    setHighContrast: (v) => writeAndNotify(HIGH_CONTRAST_KEY, v ? "1" : null),
  };

  return <ContourContext.Provider value={value}>{children}</ContourContext.Provider>;
}

export function useContourPreferences(): ContourContextValue {
  return useContext(ContourContext);
}
