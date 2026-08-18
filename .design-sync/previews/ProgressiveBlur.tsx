// ProgressiveBlur is the edge-fade backdrop NavBar/TabBar/Toolbar place
// behind their own fixed chrome (contour-design-guidelines.md SS2.10) -- it
// never wraps scrolling content itself. Real usage (nav-bar.tsx, tab-bar.tsx):
// a `relative` bar holds ProgressiveBlur as an absolute inset-0 background
// layer, positioned by its own immediate `relative` parent (not a grandparent),
// plus a `relative z-10` content row on top. Its backdrop-filter blur + tint
// only reads against a busy/colorful backdrop -- a plain white-on-white page
// makes the effect invisible, so this composition uses saturated color tiles
// as the "content" scrolling underneath, instead of the plain white List used
// in the real app chrome (which is why that alone wouldn't show anything here).
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Text } from "@/components/ui/text";

const COLORS = [
  "bg-[rgb(var(--color-red))]",
  "bg-[rgb(var(--color-orange))]",
  "bg-[rgb(var(--color-yellow))]",
  "bg-[rgb(var(--color-green))]",
  "bg-[rgb(var(--color-blue))]",
  "bg-[rgb(var(--color-purple))]",
];

function ColorStrip() {
  return (
    <div className="flex flex-col gap-2 p-3">
      {COLORS.map((c) => (
        <div key={c} className={`h-8 w-full rounded-md ${c}`} />
      ))}
    </div>
  );
}

export function TopBar() {
  return (
    <div className="relative h-64 w-72 overflow-hidden rounded-(--radius-card) border border-separator">
      <div className="absolute inset-0 overflow-y-auto">
        <ColorStrip />
        <ColorStrip />
      </div>
      <div className="absolute top-0 left-0 right-0 h-11">
        <ProgressiveBlur position="top" />
        <div className="relative z-10 flex h-full items-center px-(--padding-control-x)">
          <Text textStyle="headline">Inbox</Text>
        </div>
      </div>
    </div>
  );
}

export function BottomBar() {
  return (
    <div className="relative h-64 w-72 overflow-hidden rounded-(--radius-card) border border-separator">
      <div className="absolute inset-0 overflow-y-auto">
        <ColorStrip />
        <ColorStrip />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-11">
        <ProgressiveBlur position="bottom" />
        <div className="relative z-10 flex h-full items-center px-(--padding-control-x)">
          <Text textStyle="footnote" color="secondary">
            6 notifications
          </Text>
        </div>
      </div>
    </div>
  );
}
