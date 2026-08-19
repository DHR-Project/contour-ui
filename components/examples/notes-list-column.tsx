"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useNow } from "@/lib/hooks/use-now";
import { NavBar } from "@/components/ui/nav-bar";
import { SearchField } from "@/components/ui/search-field";
import type { SearchFieldResult } from "@/components/ui/search-field";
import { List, ListItem } from "@/components/ui/list";
import type { SwipeAction } from "@/components/ui/list";
import { Grid } from "@/components/ui/grid";
import { Card } from "@/components/ui/card";
import { ContextMenu } from "@/components/ui/context-menu";
import type { DropdownItemDef } from "@/components/ui/dropdown";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack, HStack } from "@/components/ui/stack";
import { Icon } from "@/components/icon";
import { toast } from "@/components/ui/toast";
import {
  formatRelativeTime,
  notePreview,
  MOVABLE_FOLDERS,
} from "@/lib/examples/notes-data";
import type { Note, NoteFolderId } from "@/lib/examples/notes-data";
import { useNotes, noteColorClass } from "./notes-context";
import { ViewOptionsSheet } from "./view-options-sheet";

export function NotesListColumn() {
  const isCompact = useSizeClass() === "compact";
  const now = useNow();
  const router = useRouter();
  const {
    notes,
    folders,
    activeFolder,
    visibleNotes,
    viewMode,
    createNote,
    togglePin,
    duplicateNote,
    moveNote,
    softDeleteNote,
    restoreNote,
    permanentlyDeleteNote,
  } = useNotes();

  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const folder = folders.find((f) => f.id === activeFolder) ?? folders[0];
  const items = visibleNotes(activeFolder);
  const inTrash = activeFolder === "trash";

  const searchResults = useMemo<SearchFieldResult[] | undefined>(() => {
    if (!searchQuery.trim()) return undefined;
    const q = searchQuery.toLowerCase();
    return notes
      .filter(
        (n) =>
          !n.deleted &&
          (n.title.toLowerCase().includes(q) ||
            n.body.toLowerCase().includes(q)),
      )
      .slice(0, 8)
      .map((n) => ({
        id: n.id,
        label: n.title || "New Note",
        subtitle: notePreview(n),
        icon: n.pinned ? "star" : undefined,
      }));
  }, [notes, searchQuery]);

  function relativeTime(note: Note): string {
    return now === null ? "" : formatRelativeTime(note.updatedAt, now);
  }

  function handleNewNote() {
    const folderId: NoteFolderId =
      activeFolder === "personal" || activeFolder === "work"
        ? activeFolder
        : "personal";
    const note = createNote(folderId);
    router.push(`/examples/notes/${note.id}`);
  }

  function handleShare(note: Note) {
    toast({ title: `"${note.title || "Note"}" link copied`, icon: "share" });
  }

  function trailingActionsFor(note: Note): SwipeAction[] {
    if (inTrash) {
      return [
        {
          icon: "circle-check",
          label: "Restore",
          color: "default",
          onAction: () => restoreNote(note.id),
        },
        {
          icon: "trash",
          label: "Delete",
          color: "destructive",
          onAction: () => setConfirmDeleteId(note.id),
        },
      ];
    }
    const base: SwipeAction[] = [
      {
        icon: "star",
        label: note.pinned ? "Unpin" : "Pin",
        color: "default",
        onAction: () => togglePin(note.id),
      },
      {
        icon: "share",
        label: "Share",
        color: "tint",
        onAction: () => handleShare(note),
      },
    ];
    // n2 gets a fourth action so its row demonstrates the "More" overflow
    // (ListItem shows 3 directly, collapsing the rest into a Dropdown).
    if (note.id === "n2") {
      base.push({
        icon: "copy",
        label: "Duplicate",
        color: "default",
        onAction: () => duplicateNote(note.id),
      });
    }
    base.push({
      icon: "trash",
      label: "Delete",
      color: "destructive",
      onAction: () => softDeleteNote(note.id),
    });
    return base;
  }

  function contextMenuItemsFor(note: Note): DropdownItemDef[] {
    return [
      {
        type: "action",
        icon: "star",
        label: note.pinned ? "Unpin" : "Pin",
        onSelect: () => togglePin(note.id),
      },
      {
        type: "action",
        icon: "copy",
        label: "Duplicate",
        onSelect: () => duplicateNote(note.id),
      },
      {
        type: "submenu",
        icon: "layers",
        label: "Move to",
        items: MOVABLE_FOLDERS.map((f) => ({
          type: "action" as const,
          label: f.label,
          onSelect: () => moveNote(note.id, f.id),
        })),
      },
      { type: "separator" },
      {
        type: "action",
        icon: "trash",
        label: inTrash ? "Delete Immediately" : "Delete",
        role: "destructive",
        onSelect: () =>
          inTrash ? setConfirmDeleteId(note.id) : softDeleteNote(note.id),
      },
    ];
  }

  return (
    <>
      <div className={cn("flex flex-col", !isCompact && "h-full")}>
        <div className={cn("flex-1 min-h-0 overflow-y-auto")}>
          <NavBar
            title={folder.label}
            largeTitleMode
            trailingActions={[
              {
                icon: "sliders-horizontal",
                label: "View Options",
                onClick: () => setViewSheetOpen(true),
              },
              { icon: "plus", label: "New Note", onClick: handleNewNote },
            ]}
            leadingAction={
              isCompact
                ? {
                    icon: "chevron-left",
                    label: "Back",
                    onClick: () => {},
                  }
                : undefined
            }
          />

          <div className="px-(--space-4) pb-(--space-3)">
            <SearchField
              value={searchQuery}
              onValueChange={setSearchQuery}
              results={searchResults}
              onResultSelect={(id) => {
                router.push(`/examples/notes/${id}`);
                setSearchQuery("");
              }}
              placeholder="Search all notes"
            />
          </div>

          {items.length === 0 ? (
            <Container variant="content">
              <VStack
                gap="3"
                align="center"
                className="py-(--space-10) text-center"
              >
                <Icon
                  name={folder.icon}
                  size="lg"
                  className="text-label-tertiary"
                />
                <Text textStyle="body" color="secondary">
                  {inTrash ? "No recently deleted notes." : "No notes yet."}
                </Text>
                {!inTrash && (
                  <Button leadingIcon="plus" onClick={handleNewNote}>
                    New Note
                  </Button>
                )}
              </VStack>
            </Container>
          ) : viewMode === "list" ? (
            <>
              <VStack>
                <div className="px-(--padding-row-x)">
                  <Text>Pin</Text>
                </div>
                <List style="plain">
                  {items
                    .filter((note) => note.pinned)
                    .map((note) => (
                      <ListItem
                        key={note.id}
                        title={note.title || "New Note"}
                        subtitle={notePreview(note)}
                        leadingIcon={note.shared ? "check" : undefined}
                        trailingText={relativeTime(note)}
                        onClick={() =>
                          router.push(`/examples/notes/${note.id}`)
                        }
                        trailingActions={trailingActionsFor(note)}
                        contextMenuItems={contextMenuItemsFor(note)}
                      />
                    ))}
                </List>
              </VStack>

              <VStack>
                <div className="px-(--padding-row-x)">
                  <Text></Text>
                </div>
                <List style="plain">
                  {items
                    .filter((note) => !note.pinned)
                    .map((note) => (
                      <ListItem
                        key={note.id}
                        title={note.title || "New Note"}
                        subtitle={notePreview(note)}
                        trailingText={relativeTime(note)}
                        trailingIcon={note.pinned ? "star" : undefined}
                        onClick={() =>
                          router.push(`/examples/notes/${note.id}`)
                        }
                        trailingActions={trailingActionsFor(note)}
                        contextMenuItems={contextMenuItemsFor(note)}
                      />
                    ))}
                </List>
              </VStack>
            </>
          ) : (
            <Grid
              columns={{ compact: 1, regular: 2 }}
              gap="3"
              // items-start: cards vary in height (attachments add a fixed
              // image block), and Grid's default align-items: stretch would
              // otherwise force every card in a row to match its tallest
              // sibling, stretching shorter cards with dead empty space.
              className="items-start p-(--space-4)"
            >
              {items.map((note) => (
                <ContextMenu key={note.id} items={contextMenuItemsFor(note)}>
                  <Card
                    elevation="flat"
                    padding="4"
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/examples/notes/${note.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/examples/notes/${note.id}`);
                      }
                    }}
                    className={cn("cursor-pointer", noteColorClass(note.color))}
                  >
                    <VStack gap="1" container={false}>
                      <HStack
                        justify="between"
                        align="start"
                        gap="2"
                        container={false}
                      >
                        <Text
                          textStyle="subheadline"
                          weight="semibold"
                          truncate
                          className="min-w-0 flex-1"
                        >
                          {note.title || "New Note"}
                        </Text>
                        {note.pinned && (
                          <Icon
                            name="star"
                            size="xs"
                            className="mt-0.5 shrink-0 text-label-tertiary"
                          />
                        )}
                      </HStack>
                      <Text textStyle="footnote" color="secondary" truncate={3}>
                        {notePreview(note)}
                      </Text>
                      {showAttachments && note.hasAttachment && (
                        <div className="mt-(--space-1) flex h-16 w-full items-center justify-center rounded-sm bg-fill-secondary">
                          <Icon
                            name="image"
                            size="md"
                            className="text-label-tertiary"
                          />
                        </div>
                      )}
                      <Text
                        textStyle="caption-2"
                        color="tertiary"
                        className="mt-(--space-1)"
                      >
                        {relativeTime(note)}
                      </Text>
                    </VStack>
                  </Card>
                </ContextMenu>
              ))}
            </Grid>
          )}

          {isCompact && (
            <div
              aria-hidden
              style={{ height: "calc(64px + var(--safe-area-bottom))" }}
            />
          )}
        </div>
      </div>

      <ViewOptionsSheet
        open={viewSheetOpen}
        onOpenChange={setViewSheetOpen}
        showAttachments={showAttachments}
        onShowAttachmentsChange={setShowAttachments}
      />

      <Alert
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
        title="Delete Immediately?"
        description="This note will be permanently deleted. This action cannot be undone."
        actions={[
          {
            label: "Cancel",
            role: "cancel",
            onClick: () => setConfirmDeleteId(null),
          },
          {
            label: "Delete",
            role: "destructive",
            emphasized: true,
            onClick: () => {
              if (confirmDeleteId) permanentlyDeleteNote(confirmDeleteId);
              setConfirmDeleteId(null);
            },
          },
        ]}
      />
    </>
  );
}
