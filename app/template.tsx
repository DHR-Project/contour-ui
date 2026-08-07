import { RouteTransition } from "@/components/ui/route-transition";

// template.tsx (not layout.tsx) re-renders on every route change, giving
// RouteTransition a fresh `children` per navigation to key its animation on
// -- see contour-spec-route-transition.md SS2.
export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
