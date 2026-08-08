"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack } from "@/components/ui/stack";
import { Icon } from "@/components/icon";
import { useNotes } from "@/components/examples/notes-context";

// Only rendered on regular+ (the detail column) -- on compact the notes
// list itself is the index view, see NotesShell's NotesWorkspace.
export default function NotesIndexPage() {
  const router = useRouter();
  const { createNote } = useNotes();

  return (
    <div className="flex h-full items-center justify-center">
      <Container variant="content">
        <VStack gap="3" align="center" className="text-center">
          <Icon name="message-circle" size="lg" className="text-label-tertiary" />
          <Text textStyle="title-3" weight="semibold">
            No Note Selected
          </Text>
          <Text textStyle="body" color="secondary" className="max-w-xs">
            Select a note from the list, or create a new one to get started.
          </Text>
          <Button
            leadingIcon="plus"
            onClick={() => {
              const note = createNote("personal");
              router.push(`/examples/notes/${note.id}`);
            }}
          >
            New Note
          </Button>
        </VStack>
      </Container>
    </div>
  );
}
