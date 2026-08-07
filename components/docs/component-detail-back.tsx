"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSizeClass } from "@/lib/hooks/use-size-class";

// Compact-only: regular+ keeps DocsSidebarRail on screen at all times, so
// there's nothing to back out of. Compact reaches this page through
// DocsMobileNav's drawer link and otherwise has no way back except the
// browser's own button. router.back() (not a push to a fixed href) so
// RouteTransition's popstate-based direction detection
// (use-navigation-direction.ts) animates this as a pop, matching how the
// page was reached.
export function ComponentDetailBack() {
  const sizeClass = useSizeClass();
  const router = useRouter();

  if (sizeClass !== "compact") return null;

  return (
    <Button variant="plain" size="sm" leadingIcon="chevron-left" onClick={() => router.back()}>
      Components
    </Button>
  );
}
