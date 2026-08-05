"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SizeClassOverrideProvider } from "@/lib/hooks/use-size-class";

const SIZE_CLASS_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "regular", label: "Regular" },
] as const;

type PreviewSizeClass = (typeof SIZE_CLASS_OPTIONS)[number]["value"];

// Wraps a demo whose rendering depends on useSizeClass() so readers can
// compare compact vs. regular without resizing the browser window.
export function SizeClassPreview({ children }: { children: ReactNode }) {
  const [sizeClass, setSizeClass] = useState<PreviewSizeClass>("regular");

  return (
    <div className="flex flex-col gap-(--space-4)">
      <SegmentedControl
        value={sizeClass}
        onValueChange={(value) => setSizeClass(value as PreviewSizeClass)}
        options={[...SIZE_CLASS_OPTIONS]}
        size="small"
        fullWidth={false}
        className="self-start"
      />
      <SizeClassOverrideProvider value={sizeClass}>{children}</SizeClassOverrideProvider>
    </div>
  );
}
