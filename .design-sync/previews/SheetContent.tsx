// SheetContent only renders meaningfully inside <Sheet> (it owns the
// scrollable body area below SheetHeader) -- both exports compose the full
// parent, and force `open` since Sheet portals outside this card and has
// no visible content while closed.
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Container } from "@/components/ui/container";
import { VStack } from "@/components/ui/stack";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";

export function ScrollableList() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="Select a folder">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Select a folder</Text>
        </SheetHeader>
        <List>
          <ListItem key="1" leadingIcon="bell" title="Inbox" />
          <ListItem key="2" leadingIcon="star" title="Starred" />
          <ListItem key="3" leadingIcon="layers" title="Work" />
          <ListItem key="4" leadingIcon="layers" title="Personal" />
        </List>
      </SheetContent>
    </Sheet>
  );
}

export function FormContent() {
  const [open, setOpen] = useState(true);
  return (
    <Sheet open={open} onOpenChange={setOpen} title="Filters">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">Filters</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-4">
            <Text color="secondary">
              SheetContent owns the scrollable body -- any composed content (lists, forms, text)
              scrolls independently below the pinned SheetHeader.
            </Text>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}
