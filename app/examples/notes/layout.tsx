import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NotesShell } from "@/components/examples/notes-shell";

export const metadata: Metadata = {
  title: "Notes — Contour Examples",
  description: "An Apple Notes-style example app assembled entirely from Contour components.",
};

export default function NotesLayout({ children }: { children: ReactNode }) {
  return <NotesShell>{children}</NotesShell>;
}
