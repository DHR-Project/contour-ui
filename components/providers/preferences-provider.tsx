"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

import { THEME_STORAGE_KEY, MOTION_STORAGE_KEY } from "@/lib/preferences/storage";

/**
 * Global user preferences - color scheme and motion. Both are applied as
 * classes on <html> (`.dark`, `.reduce-motion`) so every consumer of the
 * design tokens in styles/tokens.css is affected, not just components
 * rendered under this provider. Framer Motion's own animations (springs
 * driven by JS, not CSS transitions) are covered separately via MotionConfig
 * below, since a CSS class alone can't reach into those.
 */
export type Theme = "light" | "dark" | "system";
/**
 * "system" follows the OS prefers-reduced-motion setting. Once the user
 * flips the docs nav switch, the choice becomes an explicit "reduce" /
 * "no-reduce" override so toggling it off doesn't silently snap back to
 * "on" for someone whose OS also requests reduced motion.
 */
export type MotionPreference = "system" | "reduce" | "no-reduce";

interface PreferencesContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  motionPreference: MotionPreference;
  setMotionPreference: (preference: MotionPreference) => void;
  prefersReducedMotion: boolean;
}

const PreferencesContext = React.createContext<PreferencesContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSystemReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [motionPreference, setMotionPreferenceState] = React.useState<MotionPreference>("system");
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light");
  const [systemReducedMotion, setSystemReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      setThemeState(storedTheme);
    }
    const storedMotion = window.localStorage.getItem(MOTION_STORAGE_KEY);
    if (storedMotion === "system" || storedMotion === "reduce" || storedMotion === "no-reduce") {
      setMotionPreferenceState(storedMotion);
    }
    setSystemTheme(getSystemTheme());
    setSystemReducedMotion(getSystemReducedMotion());

    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onColorSchemeChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? "dark" : "light");
    const onMotionChange = (event: MediaQueryListEvent) => setSystemReducedMotion(event.matches);

    colorSchemeQuery.addEventListener("change", onColorSchemeChange);
    motionQuery.addEventListener("change", onMotionChange);
    return () => {
      colorSchemeQuery.removeEventListener("change", onColorSchemeChange);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const prefersReducedMotion =
    motionPreference === "reduce"
      ? true
      : motionPreference === "no-reduce"
        ? false
        : systemReducedMotion;

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", prefersReducedMotion);
  }, [prefersReducedMotion]);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const setMotionPreference = React.useCallback((next: MotionPreference) => {
    setMotionPreferenceState(next);
    window.localStorage.setItem(MOTION_STORAGE_KEY, next);
  }, []);

  const value = React.useMemo<PreferencesContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      motionPreference,
      setMotionPreference,
      prefersReducedMotion,
    }),
    [theme, setTheme, resolvedTheme, motionPreference, setMotionPreference, prefersReducedMotion],
  );

  return (
    <PreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = React.useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
