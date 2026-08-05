import type { ReactNode, SVGProps } from "react";
import type { IconSize } from "@/components/icon";

// Hand-drawn line pictograms, one per component slug -- decorative
// stand-ins that sketch each component's real shape (a switch track +
// thumb, a bottom sheet, a segmented pill...) rather than a generic
// stock glyph. These are bespoke illustrations, not semantic icons, so
// guideline 6.1 (icon usage only via the lucide Icon registry) doesn't
// apply here -- there is no lucide-react import in this file.
const SIZE_VALUE: Record<IconSize, string> = {
  xs: "var(--icon-size-xs)",
  sm: "var(--icon-size-sm)",
  md: "var(--icon-size-md)",
  lg: "var(--icon-size-lg)",
  xl: "var(--icon-size-xl)",
};

// All paths share a 24x24 canvas, ~3-21 safe margin, and inherit
// stroke/fill/linecap from the wrapping <svg> below. `fill="currentColor"
// stroke="none"` marks the handful of solid accents (a switch thumb, a
// selected tab, a badge dot) -- still monochrome, just filled vs. outlined.
const PICTOGRAMS: Record<string, ReactNode> = {
  // Layout
  flex: (
    <>
      <rect x="3" y="6" width="6" height="12" rx="1.5" />
      <rect x="15" y="6" width="6" height="12" rx="1.5" />
      <path d="M10 12h4" />
      <path d="M12 10l2 2-2 2" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  stack: (
    <>
      <rect x="4" y="4" width="16" height="4" rx="1.5" />
      <rect x="4" y="10" width="16" height="4" rx="1.5" />
      <rect x="4" y="16" width="16" height="4" rx="1.5" />
    </>
  ),
  container: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="2 2" />
    </>
  ),

  // Navigation
  "nav-bar": (
    <>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <path d="M7.5 5.5L6 7l1.5 1.5" />
      <circle cx="17" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <path d="M4 14h16M4 18h10" />
    </>
  ),
  "tab-bar": (
    <>
      <path d="M3 19h18" />
      <rect x="4.5" y="10.5" width="5" height="5" rx="2.5" />
      <circle cx="7" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  toolbar: (
    <>
      <path d="M4 5h16M4 9h12" />
      <rect x="3" y="16" width="18" height="5" rx="1.5" />
      <circle cx="8" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  sidebar: (
    <>
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <path d="M14 7h7M14 12h7M14 17h4" />
    </>
  ),

  // Controls
  button: (
    <>
      <rect x="4" y="8" width="16" height="8" rx="4" />
      <path d="M9 12h6" />
    </>
  ),
  checkbox: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12.5l2.5 2.5L16.5 9" />
    </>
  ),
  radio: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  switch: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  slider: (
    <>
      <path d="M3 12h18" />
      <circle cx="14" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  "segmented-control": (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M9 8v8M15 8v8" />
    </>
  ),
  "text-field": (
    <>
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <path d="M7 10.5v3" />
    </>
  ),
  textarea: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M6 9h12M6 13h12M6 17h7" />
    </>
  ),
  "search-field": (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <circle cx="9" cy="12" r="2" />
      <path d="M10.5 13.5L13 16" />
    </>
  ),

  // Display
  text: <path d="M4 6h16M4 12h16M4 18h9" />,
  icon: <path d="M12 3.5l2.2 4.6 5 0.7-3.6 3.6 0.9 5-4.5-2.4-4.5 2.4 0.9-5-3.6-3.6 5-0.7z" />,
  card: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M6 9h12M6 13h12M6 17h7" />
    </>
  ),
  list: (
    <>
      <circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" />
      <path d="M8 6h12" />
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M8 12h12" />
      <circle cx="5" cy="18" r="1" fill="currentColor" stroke="none" />
      <path d="M8 18h9" />
    </>
  ),
  badge: (
    <>
      <rect x="4" y="6" width="12" height="12" rx="3" />
      <circle cx="17" cy="7" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  avatar: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="9.5" r="2.3" />
      <path d="M6.5 18a5.7 5.7 0 0 1 11 0" />
    </>
  ),
  progress: (
    <>
      <circle cx="12" cy="12" r="7.5" strokeOpacity="0.25" />
      <circle
        cx="12"
        cy="12"
        r="7.5"
        strokeDasharray="28 47"
        transform="rotate(-90 12 12)"
      />
    </>
  ),

  // Feedback
  alert: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  toast: (
    <>
      <rect x="3" y="15" width="18" height="6" rx="3" />
      <path d="M8 18l2 2 4-4" />
    </>
  ),

  // Overlay
  sheet: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="3" y="12" width="18" height="9" rx="2" />
      <path d="M10.5 14.5h3" />
    </>
  ),
  dropdown: (
    <>
      <rect x="4" y="4" width="9" height="4" rx="1.5" />
      <path d="M8.5 8v2" />
      <rect x="4" y="10" width="14" height="9" rx="1.5" />
      <path d="M7 13.5h8M7 16.5h5" />
    </>
  ),
  "context-menu": (
    <>
      <path d="M5 4l4.5 11 1.6-4.4L15 9z" />
      <rect x="12" y="9" width="9" height="8" rx="1.5" />
      <path d="M15 12h4M15 14.5h3" />
    </>
  ),
  "route-transition": (
    <>
      <rect x="3" y="6" width="10" height="12" rx="2" />
      <rect x="11" y="4" width="10" height="12" rx="2" />
      <path d="M9 12h4" />
      <path d="M11 10l2 2-2 2" />
    </>
  ),
  "split-view": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </>
  ),
};

export interface ComponentPictogramProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  /** Component registry slug, e.g. "nav-bar", "sheet", "button". */
  slug: string;
  size?: IconSize;
}

/** Bespoke per-component illustration -- see PICTOGRAMS above. Renders
 * nothing for an unrecognized slug rather than falling back to a generic
 * glyph, so a missing entry is obvious in review instead of silently
 * looking like every other component. */
export function ComponentPictogram({
  slug,
  size = "md",
  style,
  ...rest
}: ComponentPictogramProps) {
  const glyph = PICTOGRAMS[slug];
  if (!glyph) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        width: SIZE_VALUE[size],
        height: SIZE_VALUE[size],
        strokeWidth: "var(--icon-stroke-width)",
        ...style,
      }}
      {...rest}
    >
      {glyph}
    </svg>
  );
}
