import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-bg-primary text-label-primary">
      <p className="text-large-title font-semibold">Contour</p>
      <p className="text-body text-label-secondary">Phase 0 infrastructure is set up.</p>
      <Link href="/docs">
        <Button leadingIcon="chevron-right">Go to Docs</Button>
      </Link>
    </main>
  );
}
