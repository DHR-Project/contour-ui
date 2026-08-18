// Sheet renders its content in a portal outside this card, so every export
// forces `open` on mount (no interaction happens in a static screenshot).
// On a mouse/trackpad it presents as a centered Modal; on touch it presents
// as a draggable Bottom Sheet -- same markup either way.
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Container } from "@/components/ui/container";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export function Basic() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="Shipping details">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Shipping details</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text>
              Touch presents this as a draggable Bottom Sheet; a mouse or trackpad presents it as a
              centered Modal instead -- same markup either way.
            </Text>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}

export function SnapPoints() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} snapPoints={[0.4, 0.9]} title="Filters">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Filters</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text color="secondary">
              On touch, drag between 40% and 90% height, or drag past 40% to dismiss. With a
              mouse/trackpad, snapPoints has no effect -- it always presents as a fixed Modal.
            </Text>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}

export function NotDismissible() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} dismissible={false} title="Processing payment">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Processing payment</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text color="secondary">
              Close button, click-outside, Escape, and drag-to-bottom are all blocked until the
              gate passes -- useful while an async action is in flight.
            </Text>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}
