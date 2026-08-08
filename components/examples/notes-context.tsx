"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "@/components/ui/toast";
import type { FolderId, Note, NoteColor, NoteFolderId } from "@/lib/examples/notes-data";
import { FOLDERS, INITIAL_NOTES } from "@/lib/examples/notes-data";

export type SortBy = "updated" | "created" | "title";
export type ViewMode = "list" | "grid";

export interface NotesContextValue {
  notes: Note[];
  folders: typeof FOLDERS;
  activeFolder: FolderId;
  setActiveFolder: (id: FolderId) => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  sortCheckedToBottom: boolean;
  setSortCheckedToBottom: (value: boolean) => void;
  textScale: number;
  setTextScale: (value: number) => void;
  iCloudSyncEnabled: boolean;
  setICloudSyncEnabled: (value: boolean) => void;
  syncing: boolean;
  folderCount: (id: FolderId) => number;
  visibleNotes: (folderId: FolderId) => Note[];
  getNote: (id: string) => Note | undefined;
  createNote: (folderId?: NoteFolderId) => Note;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "body" | "color" | "locked">>) => void;
  togglePin: (id: string) => void;
  toggleChecklistItem: (noteId: string, itemId: string) => void;
  setAllChecklistItems: (noteId: string, done: boolean) => void;
  addChecklistItem: (noteId: string) => void;
  duplicateNote: (id: string) => Note;
  moveNote: (id: string, folderId: NoteFolderId) => void;
  softDeleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

let nextId = INITIAL_NOTES.length + 1;

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeFolder, setActiveFolder] = useState<FolderId>("all");
  const [sortBy, setSortBy] = useState<SortBy>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortCheckedToBottom, setSortCheckedToBottom] = useState(true);
  const [textScale, setTextScale] = useState(100);
  const [iCloudSyncEnabled, setICloudSyncEnabled] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pulseSync = useCallback(() => {
    if (!iCloudSyncEnabled) return;
    setSyncing(true);
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => setSyncing(false), 900);
  }, [iCloudSyncEnabled]);

  const getNote = useCallback((id: string) => notes.find((note) => note.id === id), [notes]);

  const folderCount = useCallback(
    (id: FolderId) => {
      switch (id) {
        case "all":
          return notes.filter((note) => !note.deleted).length;
        case "shared":
          return notes.filter((note) => note.shared && !note.deleted).length;
        case "trash":
          return notes.filter((note) => note.deleted).length;
        default:
          return notes.filter((note) => note.folderId === id && !note.deleted).length;
      }
    },
    [notes],
  );

  const visibleNotes = useCallback(
    (folderId: FolderId) => {
      const filtered = notes.filter((note) => {
        if (folderId === "all") return !note.deleted;
        if (folderId === "shared") return note.shared && !note.deleted;
        if (folderId === "trash") return note.deleted;
        return note.folderId === folderId && !note.deleted;
      });
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "created") return b.createdAt - a.createdAt;
        return b.updatedAt - a.updatedAt;
      });
      if (folderId === "trash") return sorted;
      // Pinned notes float to the top of every real/smart folder, same as
      // Notes.app -- Recently Deleted is the one place pin state is ignored.
      return [...sorted.filter((n) => n.pinned), ...sorted.filter((n) => !n.pinned)];
    },
    [notes, sortBy],
  );

  const updateNoteInternal = useCallback((id: string, updater: (note: Note) => Note) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? updater({ ...note, updatedAt: Date.now() }) : note)));
  }, []);

  const createNote = useCallback(
    (folderId: NoteFolderId = "personal") => {
      const note: Note = {
        id: `n${nextId++}`,
        folderId,
        title: "",
        body: "",
        color: "default",
        pinned: false,
        locked: false,
        shared: false,
        deleted: false,
        hasAttachment: false,
        collaborators: [],
        checklist: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [note, ...prev]);
      pulseSync();
      return note;
    },
    [pulseSync],
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, "title" | "body" | "color" | "locked">>) => {
      updateNoteInternal(id, (note) => ({ ...note, ...patch }));
      pulseSync();
    },
    [updateNoteInternal, pulseSync],
  );

  const togglePin = useCallback(
    (id: string) => {
      updateNoteInternal(id, (note) => ({ ...note, pinned: !note.pinned }));
      pulseSync();
    },
    [updateNoteInternal, pulseSync],
  );

  const toggleChecklistItem = useCallback(
    (noteId: string, itemId: string) => {
      updateNoteInternal(noteId, (note) => ({
        ...note,
        checklist: note.checklist?.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)) ?? null,
      }));
      pulseSync();
    },
    [updateNoteInternal, pulseSync],
  );

  const setAllChecklistItems = useCallback(
    (noteId: string, done: boolean) => {
      updateNoteInternal(noteId, (note) => ({
        ...note,
        checklist: note.checklist?.map((item) => ({ ...item, done })) ?? null,
      }));
      pulseSync();
    },
    [updateNoteInternal, pulseSync],
  );

  const addChecklistItem = useCallback(
    (noteId: string) => {
      updateNoteInternal(noteId, (note) => ({
        ...note,
        checklist: [...(note.checklist ?? []), { id: `c${Date.now()}`, label: "New item", done: false }],
      }));
      pulseSync();
    },
    [updateNoteInternal, pulseSync],
  );

  const duplicateNote = useCallback(
    (id: string) => {
      const source = getNote(id);
      const copy: Note = {
        ...(source as Note),
        id: `n${nextId++}`,
        title: source ? `${source.title || "Untitled"} copy` : "Untitled copy",
        pinned: false,
        shared: false,
        collaborators: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [copy, ...prev]);
      pulseSync();
      toast({ title: "Note duplicated", icon: "copy" });
      return copy;
    },
    [getNote, pulseSync],
  );

  const moveNote = useCallback(
    (id: string, folderId: NoteFolderId) => {
      updateNoteInternal(id, (note) => ({ ...note, folderId }));
      pulseSync();
      const folder = FOLDERS.find((f) => f.id === folderId);
      toast({ title: `Moved to ${folder?.label ?? "folder"}`, icon: "layers" });
    },
    [updateNoteInternal, pulseSync],
  );

  const restoreNote = useCallback(
    (id: string) => {
      updateNoteInternal(id, (note) => ({ ...note, deleted: false }));
      pulseSync();
      toast({ title: "Note restored", variant: "success", icon: "circle-check" });
    },
    [updateNoteInternal, pulseSync],
  );

  const softDeleteNote = useCallback(
    (id: string) => {
      updateNoteInternal(id, (note) => ({ ...note, deleted: true }));
      pulseSync();
      toast({
        title: "Note moved to Recently Deleted",
        icon: "trash",
        action: { label: "Undo", onPress: () => restoreNote(id) },
      });
    },
    [updateNoteInternal, pulseSync, restoreNote],
  );

  const permanentlyDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      pulseSync();
      toast({ title: "Note permanently deleted", variant: "destructive", icon: "trash" });
    },
    [pulseSync],
  );

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      folders: FOLDERS,
      activeFolder,
      setActiveFolder,
      sortBy,
      setSortBy,
      viewMode,
      setViewMode,
      sortCheckedToBottom,
      setSortCheckedToBottom,
      textScale,
      setTextScale,
      iCloudSyncEnabled,
      setICloudSyncEnabled,
      syncing,
      folderCount,
      visibleNotes,
      getNote,
      createNote,
      updateNote,
      togglePin,
      toggleChecklistItem,
      setAllChecklistItems,
      addChecklistItem,
      duplicateNote,
      moveNote,
      softDeleteNote,
      restoreNote,
      permanentlyDeleteNote,
    }),
    [
      notes,
      activeFolder,
      sortBy,
      viewMode,
      sortCheckedToBottom,
      textScale,
      iCloudSyncEnabled,
      syncing,
      folderCount,
      visibleNotes,
      getNote,
      createNote,
      updateNote,
      togglePin,
      toggleChecklistItem,
      setAllChecklistItems,
      addChecklistItem,
      duplicateNote,
      moveNote,
      softDeleteNote,
      restoreNote,
      permanentlyDeleteNote,
    ],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within a NotesProvider");
  return ctx;
}

export function noteColorClass(color: NoteColor): string {
  switch (color) {
    case "yellow":
      return "bg-[rgb(var(--color-yellow))]/10";
    case "blue":
      return "bg-[rgb(var(--color-blue))]/10";
    case "green":
      return "bg-[rgb(var(--color-green))]/10";
    case "pink":
      return "bg-[rgb(var(--color-pink))]/10";
    default:
      return "";
  }
}
