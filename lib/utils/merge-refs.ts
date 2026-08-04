import type { Ref, RefCallback } from "react";

// Needed wherever a component both forwards its own `ref` (forwardRef) and
// needs a second, internal ref to the same DOM node -- e.g. drag-select's
// hit-testing container (SegmentedControl, RadioGroup).
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}
