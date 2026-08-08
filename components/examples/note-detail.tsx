"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Toolbar } from "@/components/ui/toolbar";
import { Dropdown } from "@/components/ui/dropdown";
import type { DropdownItemDef } from "@/components/ui/dropdown";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack, HStack } from "@/components/ui/stack";
import { toast } from "@/components/ui/toast";
import { MOVABLE_FOLDERS } from "@/lib/examples/notes-data";
import type { NoteColor } from "@/lib/examples/notes-data";
import { useNotes } from "./notes-context";

const COLOR_OPTIONS: { value: NoteColor; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "yellow", label: "Yellow" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "pink", label: "Pink" },
];

export function NoteDetail({ noteId }: { noteId: string }) {
  const isCompact = useSizeClass() === "compact";
  const router = useRouter();
  const {
    getNote,
    updateNote,
    duplicateNote,
    moveNote,
    softDeleteNote,
    permanentlyDeleteNote,
    toggleChecklistItem,
    setAllChecklistItems,
    addChecklistItem,
    sortCheckedToBottom,
    textScale,
  } = useNotes();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const note = getNote(noteId);

  if (!note) {
    return (
      <Container variant="content">
        <VStack gap="3" align="center" className="h-full justify-center py-(--space-10) text-center">
          <Text textStyle="body" color="secondary">
            This note is no longer available.
          </Text>
          <Button onClick={() => router.push("/examples/notes")}>Back to Notes</Button>
        </VStack>
      </Container>
    );
  }

  const checklist = note.checklist
    ? sortCheckedToBottom
      ? [...note.checklist].sort((a, b) => Number(a.done) - Number(b.done))
      : note.checklist
    : null;
  const doneCount = checklist?.filter((item) => item.done).length ?? 0;
  const totalCount = checklist?.length ?? 0;
  const selectAllState = totalCount === 0 ? false : doneCount === totalCount ? true : doneCount === 0 ? false : "indeterminate";

  function handleDeleteClick() {
    if (!note) return;
    if (note.deleted) {
      setConfirmOpen(true);
    } else {
      softDeleteNote(note.id);
      router.push("/examples/notes");
    }
  }

  const moreMenuItems: DropdownItemDef[] = [
    { type: "label", text: "Note" },
    {
      type: "checkbox",
      label: "Locked",
      checked: note.locked,
      onCheckedChange: (checked) => updateNote(note.id, { locked: checked }),
    },
    {
      type: "radio-group",
      value: note.color,
      onValueChange: (value) => updateNote(note.id, { color: value as NoteColor }),
      options: COLOR_OPTIONS,
    },
    { type: "separator" },
    {
      type: "action",
      icon: "copy",
      label: "Duplicate",
      onSelect: () => {
        const copy = duplicateNote(note.id);
        router.push(`/examples/notes/${copy.id}`);
      },
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
      label: note.deleted ? "Delete Immediately" : "Delete",
      role: "destructive",
      onSelect: handleDeleteClick,
    },
  ];

  return (
    <div className={cn("flex flex-col", !isCompact && "h-full")}>
      <div className={cn(!isCompact && "flex-1 min-h-0 overflow-y-auto scroll-mask-y")}>
        <div className="sticky top-0 z-10 border-b border-separator bg-bg-primary px-(--space-4) py-(--space-3)">
          <HStack align="center" gap="2" container={false}>
            {isCompact && (
              <Button
                variant="plain"
                leadingIcon="chevron-left"
                aria-label="Back to Notes"
                onClick={() => router.push("/examples/notes")}
                className="shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <TextField
                value={note.title}
                onValueChange={(value) => updateNote(note.id, { title: value })}
                placeholder="Title"
                disabled={note.locked}
                className="font-semibold"
              />
            </div>
            {note.locked && <Badge variant="status" label="Locked" color="warning" tone="tinted" />}
            {note.shared && <Badge variant="status" label="Shared" color="tint" tone="tinted" />}
            <Dropdown
              trigger={<Button variant="plain" leadingIcon="ellipsis" aria-label="More options" className="shrink-0" />}
              side="bottom"
              align="end"
              items={moreMenuItems}
            />
          </HStack>
          {note.shared && note.collaborators.length > 0 && (
            <HStack align="center" gap="2" container={false} className="mt-(--space-2)">
              <div className="flex -space-x-2">
                {note.collaborators.map((name) => (
                  <Avatar key={name} name={name} size="xs" className="ring-2 ring-bg-primary" />
                ))}
              </div>
              <Text textStyle="caption-1" color="secondary">
                Shared with {note.collaborators.length} {note.collaborators.length === 1 ? "person" : "people"}
              </Text>
            </HStack>
          )}
        </div>

        <Container variant="content">
          <VStack gap="section" className="py-(--space-4)">
            <div style={{ fontSize: `${textScale}%` }}>
              <Textarea
                value={note.body}
                onValueChange={(value) => updateNote(note.id, { body: value })}
                placeholder="Start writing…"
                disabled={note.locked}
                autoResize
              />
            </div>

            {checklist && (
              <VStack gap="2">
                <HStack justify="between" align="center">
                  <Text textStyle="subheadline" weight="semibold">
                    Checklist
                  </Text>
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={() => setAllChecklistItems(note.id, doneCount !== totalCount)}
                    label="Select all"
                    size="sm"
                  />
                </HStack>
                <VStack gap="1">
                  {checklist.map((item) => (
                    <HStack key={item.id} align="center" gap="2">
                      <Checkbox checked={item.done} onCheckedChange={() => toggleChecklistItem(note.id, item.id)} />
                      <Text
                        textStyle="body"
                        color={item.done ? "tertiary" : "primary"}
                        className={item.done ? "line-through" : undefined}
                      >
                        {item.label}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            )}
          </VStack>
        </Container>
      </div>

      <Toolbar
        position="bottom"
        className={isCompact ? "static bottom-auto pb-[calc(64px+var(--safe-area-bottom))]" : undefined}
        actions={[
          {
            icon: "check",
            label: "Checklist",
            onClick: () => {
              addChecklistItem(note.id);
              toast({ title: "Checklist item added", icon: "check" });
            },
          },
          { icon: "image", label: "Add Photo", onClick: () => toast({ title: "Photo attached (demo)", icon: "image" }) },
          {
            icon: "share",
            label: "Share",
            onClick: () => toast({ title: `"${note.title || "Note"}" link copied`, icon: "share" }),
          },
        ]}
      />

      <Alert
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Immediately?"
        description="This note will be permanently deleted. This action cannot be undone."
        actions={[
          { label: "Cancel", role: "cancel", onClick: () => setConfirmOpen(false) },
          {
            label: "Delete",
            role: "destructive",
            emphasized: true,
            onClick: () => {
              permanentlyDeleteNote(note.id);
              setConfirmOpen(false);
              router.push("/examples/notes");
            },
          },
        ]}
      />
    </div>
  );
}
