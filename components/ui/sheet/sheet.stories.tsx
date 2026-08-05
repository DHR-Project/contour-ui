import type { Story } from "@ladle/react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "./sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack } from "@/components/ui/stack";
import { CoarsePointerOverrideProvider } from "@/lib/hooks/use-coarse-pointer";

const meta = {
  title: "Components / Sheet",
};
export default meta;

// contour-spec-sheet-v2.md SS "snap points" default -- single full-height
// snap point, matches the pre-multi-snap "full behavior".
export const OpenClose: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Basic Sheet">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Basic Sheet</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text>
                This is the default single-snap-point behavior -- the Sheet opens to full height on
                touch, or as a centered modal with a mouse/trackpad.
              </Text>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// SS2: presentation is governed by input modality, not size-class --
// CoarsePointerOverrideProvider pins useIsCoarsePointer() so both shapes
// can be previewed side by side without device emulation.
export const AdaptivePresentation: Story = () => {
  const [touchOpen, setTouchOpen] = useState(false);
  const [mouseOpen, setMouseOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 p-8">
      <CoarsePointerOverrideProvider value={true}>
        <Button onClick={() => setTouchOpen(true)}>Open Bottom Sheet (touch)</Button>
        <Sheet open={touchOpen} onOpenChange={setTouchOpen} title="Bottom Sheet">
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">Bottom Sheet</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>pointer: coarse -- drag the grabber, or drag the content down to dismiss.</Text>
                <Button onClick={() => setTouchOpen(false)}>Close</Button>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>
      </CoarsePointerOverrideProvider>

      <CoarsePointerOverrideProvider value={false}>
        <Button onClick={() => setMouseOpen(true)}>Open Centered Modal (mouse)</Button>
        <Sheet open={mouseOpen} onOpenChange={setMouseOpen} title="Centered Modal">
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">Centered Modal</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>pointer: fine -- no drag; dismiss via the close button, Escape, or click-outside.</Text>
                <Button onClick={() => setMouseOpen(false)}>Close</Button>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>
      </CoarsePointerOverrideProvider>
    </div>
  );
};

export const SnapPoints: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <CoarsePointerOverrideProvider value={true}>
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Sheet with Snap Points</Button>
        <Sheet open={open} onOpenChange={setOpen} snapPoints={[0.4, 0.9]} title="Multi-snap Sheet">
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">Drag me</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>Opens at 40% height. Drag up to 90%, or drag past 40% to dismiss.</Text>
                <Text color="secondary">A fast downward flick commits in that direction regardless of distance.</Text>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>
      </div>
    </CoarsePointerOverrideProvider>
  );
};

// SS6: dismissible as a dynamic gate. `canClose` starts false so every
// dismiss attempt is blocked at first -- flip the checkbox, then dismiss
// attempts succeed. Try both a touch (drag/bounce) and mouse (shake) build
// to see both blocked-dismiss feedback types.
export const BlockedDismiss: Story = () => {
  return (
    <div className="flex gap-8 p-8">
      <CoarsePointerOverrideProvider value={true}>
        <BlockedDismissDemo label="Touch (drag bounce-back)" />
      </CoarsePointerOverrideProvider>
      <CoarsePointerOverrideProvider value={false}>
        <BlockedDismissDemo label="Mouse (shake)" />
      </CoarsePointerOverrideProvider>
    </div>
  );
};

function BlockedDismissDemo({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open ({label})</Button>
      <Sheet open={open} onOpenChange={setOpen} dismissible={() => canClose} title="Unsaved changes">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Unsaved changes</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text>
                Try closing (close button, drag-to-bottom, Escape, or click-outside) -- it&apos;s blocked
                until you check the box below. Sheet only plays the blocked-dismiss motion; showing
                *why* it was blocked (e.g. a toast) is the caller&apos;s responsibility.
              </Text>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={canClose} onChange={(e) => setCanClose(e.target.checked)} />
                <Text>Allow closing</Text>
              </label>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// SS6.1: dismissible as an async gate -- while the Promise is pending, the
// Sheet locks its own dismiss affordances (button/grabber dim + ignore
// input) rather than letting a second attempt race the first.
export const AsyncDismissible: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <CoarsePointerOverrideProvider value={false}>
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open (async validation)</Button>
        <Sheet
          open={open}
          onOpenChange={setOpen}
          title="Saving..."
          dismissible={() => new Promise((resolve) => setTimeout(() => resolve(true), 1500))}
        >
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">Async close</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>Closing simulates a 1.5s API call -- the close button dims while pending.</Text>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>
      </div>
    </CoarsePointerOverrideProvider>
  );
};

// SS7: a Sheet opened from inside another Sheet's content recedes the one
// underneath it (scale down, shift up, dim, pointer-events: none) --
// applies to both presentation modes.
export const NestedSheets: Story = () => {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  return (
    <CoarsePointerOverrideProvider value={false}>
      <div className="p-8">
        <Button onClick={() => setParentOpen(true)}>Open Category Picker</Button>
        <Sheet open={parentOpen} onOpenChange={setParentOpen} title="Choose a category">
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">Choose a category</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>Opening the nested Sheet recedes this one -- scaled down, dimmed, inert.</Text>
                <Button onClick={() => setChildOpen(true)}>New category...</Button>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>

        <Sheet open={childOpen} onOpenChange={setChildOpen} title="New category">
          <SheetContent>
            <SheetHeader>
              <Text textStyle="headline">New category</Text>
            </SheetHeader>
            <Container variant="content">
              <VStack gap="section" className="py-4">
                <Text>This Sheet sits above the receded one (--z-sheet + depth * 20).</Text>
                <Button onClick={() => setChildOpen(false)}>Done</Button>
              </VStack>
            </Container>
          </SheetContent>
        </Sheet>
      </div>
    </CoarsePointerOverrideProvider>
  );
};
