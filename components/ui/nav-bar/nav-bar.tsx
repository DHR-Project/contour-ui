"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useScrollProgress } from "@/lib/hooks/use-scroll-progress";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { IconName } from "@/components/icon";

export interface NavBarAction {
  icon: IconName;
  onClick: () => void;
  label: string;
}

export interface NavBarProps {
  title: string;
  /** Default: true on compact, false on regular+ (contour-spec-navbar-tabbar-toolbar.md SS A.1). */
  largeTitleMode?: boolean;
  leadingAction?: NavBarAction;
  /** Max 2 -- narrower than ListItem.trailingActions (3): NavBar has no overflow menu (SS A.4). */
  trailingActions?: NavBarAction[];
  progressiveBlur?: boolean;
  className?: string;
}

// Component-intrinsic sizes, not global tokens -- same treatment as
// Switch's track/thumb dimensions (SS A.2).
const COLLAPSED_HEIGHT = 44;
const LARGE_TITLE_HEIGHT = 96;
const COLLAPSE_RANGE = LARGE_TITLE_HEIGHT - COLLAPSED_HEIGHT;
// How much the Large Title shrinks by the time it's fully collapsed.
const LARGE_TITLE_MIN_SCALE = 0.7;
// The Large Title finishes scaling/fading away entirely within the first
// 90% of the collapse range; the compact centered title only starts
// fading in for the remaining 10% -- sequential, never both visible at
// once, rather than a simultaneous cross-fade.
const STAGE_THRESHOLD = 0.9;

export function NavBar({
  title,
  largeTitleMode,
  leadingAction,
  trailingActions = [],
  progressiveBlur = true,
  className,
}: NavBarProps) {
  const sizeClass = useSizeClass();
  const resolvedLargeTitle = largeTitleMode ?? sizeClass === "compact";
  const visibleTrailing = trailingActions.slice(0, 2);
  // Lets useScrollProgress find this bar's own nearest scrollable ancestor
  // instead of assuming `window` is always what's scrolling.
  const headerRef = useRef<HTMLElement>(null);

  // 0 at the top of the page, 1 once scrolled past the large-title collapse
  // range -- drives the title/height/blur interpolation together (SS A.3).
  const scrollProgress = useScrollProgress(COLLAPSE_RANGE, resolvedLargeTitle, headerRef);
  // The Large Title finishes its own collapse within [0, STAGE_THRESHOLD]
  // and the compact title only reveals across [STAGE_THRESHOLD, 1] --
  // sequential, not a simultaneous cross-fade.
  const largeTitleProgress = Math.min(1, scrollProgress / STAGE_THRESHOLD);
  const revealProgress = Math.max(0, Math.min(1, (scrollProgress - STAGE_THRESHOLD) / (1 - STAGE_THRESHOLD)));
  const blurIntensity = resolvedLargeTitle ? scrollProgress : 1;
  const largeTitleRowHeight = resolvedLargeTitle ? COLLAPSE_RANGE * (1 - largeTitleProgress) : 0;
  const largeTitleScale = 1 - largeTitleProgress * (1 - LARGE_TITLE_MIN_SCALE);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 overflow-hidden pt-(--safe-area-top)",
        !progressiveBlur && "bg-bg-primary",
        className,
      )}
    >
      {progressiveBlur && <ProgressiveBlur position="top" intensity={blurIntensity} />}

      {/* Known simplification: leading/trailing groups aren't width-matched,
          so the title only sits exactly centered when both sides are
          symmetric (e.g. neither present, or 1 leading + 1 trailing). */}
      <div
        className="relative z-10 flex items-center gap-(--gap-icon-text) px-(--padding-control-x)"
        style={{ height: COLLAPSED_HEIGHT }}
      >
        <div className="flex shrink-0 items-center">
          {leadingAction && (
            <div style={{ opacity: resolvedLargeTitle ? revealProgress : 1 }}>
              <Button
                variant="plain"
                leadingIcon={leadingAction.icon}
                aria-label={leadingAction.label}
                onClick={leadingAction.onClick}
              />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 text-center">
          <Text
            as={resolvedLargeTitle ? "span" : "h1"}
            textStyle="headline"
            truncate
            aria-hidden={resolvedLargeTitle || undefined}
            style={{ opacity: resolvedLargeTitle ? revealProgress : 1 }}
          >
            {title}
          </Text>
        </div>
        <div className="flex shrink-0 items-center gap-(--space-1)">
          {visibleTrailing.map((action) => (
            <Button
              key={action.label}
              variant="plain"
              leadingIcon={action.icon}
              aria-label={action.label}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>

      {resolvedLargeTitle && (
        <div
          className="relative z-10 overflow-hidden px-(--padding-control-x)"
          style={{ height: largeTitleRowHeight, opacity: 1 - largeTitleProgress }}
        >
          <Text
            as="h1"
            textStyle="large-title"
            truncate
            style={{ transform: `scale(${largeTitleScale})`, transformOrigin: "left center" }}
          >
            {title}
          </Text>
        </div>
      )}
    </header>
  );
}
