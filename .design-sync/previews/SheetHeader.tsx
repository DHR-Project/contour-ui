// SheetHeader only renders meaningfully inside <Sheet>/<SheetContent> (the
// header row sits above SheetContent's own scroll body) -- both exports
// compose the full parent, and force `open` since Sheet portals outside
// this card and has no visible content while closed.
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Container } from "@/components/ui/container";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function TitleOnly() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="Choose a category">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Choose a category</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text color="secondary">SheetHeader pins above the scrollable body -- it never scrolls with it.</Text>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}

export function WithSubtitle() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="New category">
      <SheetContent>
        <SheetHeader>
          <VStack gap="1">
            <Text textStyle="headline">New category</Text>
            <Text textStyle="footnote" color="secondary">
              Visible to everyone on this board
            </Text>
          </VStack>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text color="secondary">Any content composes inside SheetHeader, not just a single Text node.</Text>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}
