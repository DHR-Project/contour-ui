"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SplitView } from "@/components/ui/split-view";
import { RouteTransition } from "@/components/ui/route-transition";
import { Toaster } from "@/components/ui/toast";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { NotesProvider } from "./notes-context";
import { FolderNav } from "./folder-nav";
import { NotesListColumn } from "./notes-list-column";

const NOTES_INDEX_PATH = "/examples/notes";

function NotesWorkspace({ children }: { children: ReactNode }) {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const pathname = usePathname();
  const isDetailRoute = pathname !== NOTES_INDEX_PATH;

  if (isCompact) {
    // One column at a time, plain document scroll -- push-navigation feel.
    // Bottom padding clears SplitView's fixed compact TabBar.
    return (
      <div className="min-h-dvh pb-[calc(80px+var(--safe-area-bottom))]">
        {!isDetailRoute && <NotesListColumn />}
        {isDetailRoute && <RouteTransition>{children}</RouteTransition>}
      </div>
    );
  }

  return (
    <div className="flex h-dvh">
      <div className="h-full w-[360px] shrink-0 border-r border-separator">
        <NotesListColumn />
      </div>
      <div className="h-full min-w-0 flex-1">
        <RouteTransition>{children}</RouteTransition>
      </div>
    </div>
  );
}

export function NotesShell({ children }: { children: ReactNode }) {
  return (
    <NotesProvider>
      <Toaster position={{ compact: "top-center", regular: "bottom-right" }} />
      <SplitView sidebar={<FolderNav />}>
        <NotesWorkspace>{children}</NotesWorkspace>
      </SplitView>
    </NotesProvider>
  );
}
