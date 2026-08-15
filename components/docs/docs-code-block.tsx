"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";

export interface DocsCodeBlockProps {
  children: string;
  lang?: string;
  /** Adds a copy-to-clipboard button in the top-right corner. Default false --
   * most call sites (props tables, token pages) don't need it. */
  copyable?: boolean;
}

export function DocsCodeBlock({
  children,
  lang = "text",
  copyable = false,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => clearTimeout(resetRef.current), []);

  function handleCopy() {
    // clipboard-write can reject (permission denied, insecure context,
    // no clipboard access in an embedded frame, ...) -- only flip to the
    // "copied" state once the write actually succeeds, and don't let a
    // rejection surface as an unhandled promise rejection.
    navigator.clipboard.writeText(children).then(
      () => {
        setCopied(true);
        clearTimeout(resetRef.current);
        resetRef.current = setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  return (
    // min-w-0 + the pre's own min-w-0 keep this a flex/grid-safe shrinking
    // box -- without it, a flex/grid ancestor (e.g. a popover's VStack) lets
    // the pre's intrinsic (white-space: pre) content width push past the
    // container's edge instead of triggering its own overflow-x-auto.
    <div className="relative min-w-0 w-full">
      <pre
        className="rounded-md bg-fill-secondary text-caption-1 font-mono text-label-primary"
        style={copyable ? { paddingRight: "var(--space-9)" } : undefined}
        data-lang={lang}
      >
        <div className="scroll-mask-x w-full min-w-0 overflow-x-auto p-(--space-4)">
          <code>{children}</code>
        </div>
      </pre>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute right-(--space-2) top-(--space-2) flex items-center justify-center rounded-sm p-(--space-1) text-label-secondary transition-colors duration-(--duration-fast) hover-fine:bg-fill-tertiary hover-fine:text-label-primary"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={
                reducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.5, rotate: -30 }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={
                reducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.5, rotate: 30 }
              }
              transition={reducedMotion ? { duration: 0 } : springs.bouncy}
              className="flex"
            >
              <Icon
                name={copied ? "check" : "copy"}
                size="sm"
                color={copied ? "success" : undefined}
              />
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
