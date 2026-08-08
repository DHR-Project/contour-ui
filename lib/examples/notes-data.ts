import type { IconName } from "@/components/icon";

export type FolderId = "all" | "personal" | "work" | "shared" | "trash";

export interface Folder {
  id: FolderId;
  label: string;
  icon: IconName;
}

// Real folders a note can actually live in -- "all"/"shared"/"trash" are
// smart collections derived from note flags, not storage locations (mirrors
// how Notes.app separates "Folders" from "Shared"/"Recently Deleted").
export type NoteFolderId = "personal" | "work";

export const FOLDERS: Folder[] = [
  { id: "all", label: "All Notes", icon: "layout-grid" },
  { id: "personal", label: "Personal", icon: "heart" },
  { id: "work", label: "Work", icon: "layers" },
  { id: "shared", label: "Shared", icon: "share" },
  { id: "trash", label: "Recently Deleted", icon: "trash" },
];

export const MOVABLE_FOLDERS: { id: NoteFolderId; label: string }[] = [
  { id: "personal", label: "Personal" },
  { id: "work", label: "Work" },
];

export type NoteColor = "default" | "yellow" | "blue" | "green" | "pink";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Note {
  id: string;
  folderId: NoteFolderId;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  locked: boolean;
  shared: boolean;
  deleted: boolean;
  hasAttachment: boolean;
  collaborators: string[];
  checklist: ChecklistItem[] | null;
  createdAt: number;
  updatedAt: number;
}

const DAY = 86_400_000;
const now = Date.now();

export const INITIAL_NOTES: Note[] = [
  {
    id: "n1",
    folderId: "personal",
    title: "Grocery List",
    body: "Weekly run before the weekend -- check the checklist below.",
    color: "yellow",
    pinned: true,
    locked: false,
    shared: false,
    hasAttachment: false,
    deleted: false,
    collaborators: [],
    checklist: [
      { id: "c1", label: "Oat milk", done: true },
      { id: "c2", label: "Eggs", done: true },
      { id: "c3", label: "Spinach", done: false },
      { id: "c4", label: "Coffee beans", done: false },
      { id: "c5", label: "Dish soap", done: false },
    ],
    createdAt: now - 6 * DAY,
    updatedAt: now - 25 * 60_000,
  },
  {
    id: "n2",
    folderId: "work",
    title: "Q3 Roadmap",
    body: "Draft agenda for the planning review:\n\n1. Recap Q2 delivery against commitments\n2. Walk through the three proposed workstreams\n3. Staffing -- who owns what\n4. Open risks and mitigations\n\nPriya to send updated timeline before Thursday's sync.",
    color: "blue",
    pinned: true,
    locked: false,
    shared: true,
    hasAttachment: true,
    deleted: false,
    collaborators: ["Alex Chen", "Priya Patel"],
    checklist: null,
    createdAt: now - 3 * DAY,
    updatedAt: now - 3 * 60 * 60_000,
  },
  {
    id: "n3",
    folderId: "work",
    title: "1:1 notes -- Jordan",
    body: "Talked through the migration timeline. Jordan is comfortable owning the rollout plan, wants a second pair of eyes on the rollback strategy.\n\nFollow up: share the incident postmortem template.",
    color: "default",
    pinned: false,
    locked: true,
    shared: false,
    hasAttachment: false,
    deleted: false,
    collaborators: [],
    checklist: null,
    createdAt: now - 2 * DAY,
    updatedAt: now - DAY,
  },
  {
    id: "n4",
    folderId: "personal",
    title: "Recipe -- Weeknight Pasta",
    body: "Garlic, chili flakes, anchovy, olive oil. Toss with whatever green is in the fridge. 8 minutes, start to finish.",
    color: "green",
    pinned: false,
    locked: false,
    shared: false,
    hasAttachment: true,
    deleted: false,
    collaborators: [],
    checklist: null,
    createdAt: now - 10 * DAY,
    updatedAt: now - 4 * DAY,
  },
  {
    id: "n5",
    folderId: "personal",
    title: "Books to read",
    body: "- Klara and the Sun\n- The Left Hand of Darkness\n- A Swim in a Pond in the Rain",
    color: "pink",
    pinned: false,
    locked: false,
    shared: false,
    hasAttachment: false,
    deleted: false,
    collaborators: [],
    checklist: null,
    createdAt: now - 14 * DAY,
    updatedAt: now - 6 * DAY,
  },
  {
    id: "n6",
    folderId: "work",
    title: "Standup notes",
    body: "Shipped the sidebar resize fix. Picking up the export-to-PDF spike next -- flagged the third-party lib licensing question to legal.",
    color: "default",
    pinned: false,
    locked: false,
    shared: true,
    hasAttachment: false,
    deleted: false,
    collaborators: ["Sam Ortiz"],
    checklist: null,
    createdAt: now - DAY,
    updatedAt: now - 45 * 60_000,
  },
  {
    id: "n7",
    folderId: "personal",
    title: "Trip packing list",
    body: "Long weekend, carry-on only.",
    color: "default",
    pinned: false,
    locked: false,
    shared: false,
    hasAttachment: false,
    deleted: false,
    collaborators: [],
    checklist: [
      { id: "c1", label: "Passport", done: true },
      { id: "c2", label: "Charger", done: false },
      { id: "c3", label: "Sunscreen", done: false },
    ],
    createdAt: now - 20 * DAY,
    updatedAt: now - 9 * DAY,
  },
  {
    id: "n8",
    folderId: "work",
    title: "Old draft -- scrap",
    body: "Half-finished notes from the abandoned v1 proposal. Safe to remove.",
    color: "default",
    pinned: false,
    locked: false,
    shared: false,
    hasAttachment: false,
    deleted: true,
    collaborators: [],
    checklist: null,
    createdAt: now - 40 * DAY,
    updatedAt: now - 30 * DAY,
  },
];

export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function notePreview(note: Note): string {
  if (note.checklist && note.checklist.length > 0) {
    const done = note.checklist.filter((item) => item.done).length;
    return `${done} of ${note.checklist.length} checked`;
  }
  const firstLine = note.body.split("\n").find((line) => line.trim().length > 0);
  return firstLine?.trim() ?? "No additional text";
}
