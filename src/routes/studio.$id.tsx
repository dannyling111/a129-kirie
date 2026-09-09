import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StudioApp } from "@/components/studio-app";
import { Button } from "@/components/ui/button";
import { resolveComic, useLibrary } from "@/lib/store";

export const Route = createFileRoute("/studio/$id")({ component: StudioIdPage });

function StudioIdPage() {
  const { id } = Route.useParams();
  const user = useLibrary((s) => s.comics);
  const comic = resolveComic(id, user);
  if (!comic) {
    return (
      <AppShell>
        <div className="px-6 py-20 text-center">
          <p className="text-muted">没有这份稿。</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/studio">去工坊</Link>
          </Button>
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <StudioApp initial={comic} />
    </AppShell>
  );
}
