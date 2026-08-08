import type { Metadata } from "next";
import { NoteDetail } from "@/components/examples/note-detail";
import { INITIAL_NOTES } from "@/lib/examples/notes-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return INITIAL_NOTES.map((note) => ({ id: note.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = INITIAL_NOTES.find((n) => n.id === id);
  return { title: note ? `${note.title || "Untitled"} — Notes` : "Note — Contour Examples" };
}

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  return <NoteDetail noteId={id} />;
}
