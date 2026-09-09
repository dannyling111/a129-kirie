import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StudioApp } from "@/components/studio-app";
import { emptyComic } from "@/lib/quant/comics";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  return (
    <AppShell>
      <StudioApp initial={emptyComic()} />
    </AppShell>
  );
}
