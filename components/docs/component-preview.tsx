import type { ReactNode } from "react";

export interface ComponentPreviewProps {
  children: ReactNode;
}

export function ComponentPreview({ children }: ComponentPreviewProps) {
  return (
    <div className="flex min-h-32 flex-wrap items-center justify-center gap-4 rounded-lg border border-separator p-6">
      {children}
    </div>
  );
}
