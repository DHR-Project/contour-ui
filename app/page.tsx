import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-(--page-margin)">
      <h1 className="text-large-title leading-(--leading-large-title) font-(--weight-bold)">
        Contour
      </h1>
      <p className="text-label-secondary text-body">
        An adaptive UI kit for the web
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="filled">Filled</Button>
        <Button variant="tinted">Tinted</Button>
        <Button variant="gray">Gray</Button>
        <Button variant="plain">Plain</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <Link href="/docs" className="text-tint text-subheadline font-(--weight-medium)">
        View documentation
      </Link>
    </main>
  );
}
