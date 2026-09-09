import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StageCanvas } from "@/components/stage-canvas";
import { TEMPLATES } from "@/lib/quant/comics";
import { useLibrary } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const mine = useLibrary((s) => s.comics);
  const featured = TEMPLATES.find((c) => c.id === "rooftop") ?? TEMPLATES[0];
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs tracking-[0.28em] text-cinnabar">KIRIE COMIC</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.15] tracking-tight md:text-5xl">
              漫画工坊
            </h1>
            <p className="mt-4 max-w-md text-muted">
              日式 RPG 立绘贴在城市风景上。人物是大半身，背景自己走自己的透视。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to="/studio">打开工坊</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/quant">看量化引擎</Link>
              </Button>
            </div>
          </div>
          {featured && (
            <Link to="/read/$id" params={{ id: featured.id }} className="block">
              <StageCanvas
                panel={featured.panels[0]}
                className="w-full rounded-[var(--radius-xl)]"
              />
            </Link>
          )}
        </section>

        {mine.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl">我的稿</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {mine.map((c) => (
                <ComicCard key={c.id} id={c.id} title={c.title} hour={c.hour} panel={c.panels[0]} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-2xl">样板漫画</h2>
          <p className="mt-1 text-sm text-muted">八篇城市短篇，同一套立绘贴在风景上。</p>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {TEMPLATES.map((c) => (
              <ComicCard key={c.id} id={c.id} title={c.title} hour={c.hour} panel={c.panels[0]} subtitle={c.subtitle} />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function ComicCard({
  id,
  title,
  hour,
  panel,
  subtitle,
}: {
  id: string;
  title: string;
  hour: string;
  panel: (typeof TEMPLATES)[number]["panels"][number];
  subtitle?: string;
}) {
  return (
    <Link to="/read/$id" params={{ id }} className="group block">
      <StageCanvas panel={panel} className="w-full rounded-[var(--radius-lg)]" />
      <p className="mt-2 text-[11px] tracking-[0.16em] text-stone">{hour}</p>
      <h3 className="font-display text-lg leading-tight group-hover:text-cinnabar">{title}</h3>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
    </Link>
  );
}
