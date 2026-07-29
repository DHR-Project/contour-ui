/**
 * Plain (non-"use client") module so app/layout.tsx - a server component -
 * can call getPreferencesInitScript() directly. Every export of a "use
 * client" file is treated as a client reference, even a plain function, so
 * this can't live in preferences-provider.tsx alongside the React context.
 */
export const THEME_STORAGE_KEY = "contour-theme";
export const MOTION_STORAGE_KEY = "contour-motion-preference";

/**
 * Blocking script to inline in <head> so the theme and motion classes land
 * on <html> before first paint - without it, the page flashes light-mode/
 * full-motion for a frame while React hydrates.
 */
export function getPreferencesInitScript() {
  return `(function(){try{
    var theme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var dark=theme==="light"?false:theme==="dark"?true:window.matchMedia("(prefers-color-scheme: dark)").matches;
    if(dark)document.documentElement.classList.add("dark");
    var motion=localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)});
    var reduced=motion==="reduce"?true:motion==="no-reduce"?false:window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced)document.documentElement.classList.add("reduce-motion");
  }catch(e){}})();`;
}
