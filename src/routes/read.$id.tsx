import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ComicReader } from "@/components/comic-reader";
import { Button } from "@/components/ui/button";
import { resolveComic, useLibrary } from "@/lib/store";

export const Route = createFileRoute("/read/$id")({ component: ReadPage });

function ReadPage() {
  const { id } = Route.useParams();
  const user = useLibrary((s) => s.comics);
  const comic = resolveComic(id, user);
  if (!comic) {
    return (
      <AppShell>
        <div className="px-6 py-20 text-center">
          <p className="text-muted">找不到这一篇。</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/">回作品</Link>
          </Button>
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <ComicReader comic={comic} />
    </AppShell>
  );
}
