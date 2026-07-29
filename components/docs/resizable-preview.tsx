"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/stack";
import { Slider } from "@/components/ui/slider";

export interface ResizablePreviewProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  /**
   * Make the width-controlled frame itself a container query context
   * (`@container`), so a direct child using containerSm/Md/Lg/Xl responds
   * to the slider. Turn off when the example already provides its own
   * context (e.g. previewing the Container component's default).
   */
  container?: boolean;
  className?: string;
}

/**
 * A live preview frame with a drag-to-resize width slider - for
 * demonstrating container query breakpoints (containerSm/Md/Lg/Xl on
 * Flex/Grid/Container) without needing to resize the actual browser
 * window. Viewport breakpoints (regular/regularLg/regularXl) can't be
 * previewed this way; they only react to the real window width.
 */
export function ResizablePreview({
  children,
  defaultWidth = 480,
  minWidth = 240,
  maxWidth = 720,
  container = true,
  className,
}: ResizablePreviewProps) {
  const [width, setWidth] = React.useState(defaultWidth);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex min-h-32 items-center justify-center overflow-x-auto rounded-lg border border-separator p-6">
        <div style={{ width }} className={cn("max-w-full shrink-0", container && "@container")}>
          {children}
        </div>
      </div>
      <HStack gap="3" align="center">
        <Slider
          min={minWidth}
          max={maxWidth}
          value={width}
          onValueChange={(next) => setWidth(typeof next === "number" ? next : next[0])}
          thumbLabel="Preview width"
          className="w-full flex-1"
        />
        <Text
          as="span"
          variant="caption1"
          color="tertiary"
          className="w-14 shrink-0 text-right font-mono"
        >
          {width}px
        </Text>
      </HStack>
    </div>
  );
}
