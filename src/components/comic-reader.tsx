import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StageCanvas } from "@/components/stage-canvas";
import type { Comic } from "@/lib/quant/types";

export function ComicReader({ comic }: { comic: Comic }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [parallax, setParallax] = useState(0);
  const panel = comic.panels[i];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setI((n) => {
        if (n >= comic.panels.length - 1) {
          setPlaying(false);
          return n;
        }
        return n + 1;
      });
    }, 2800);
    return () => clearInterval(t);
  }, [playing, comic.panels.length]);

  if (!panel) return null;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div
          className="mx-auto w-full max-w-[min(100%,520px)]"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setParallax(((e.clientX - r.left) / r.width) * 2 - 1);
          }}
        >
          <StageCanvas panel={panel} parallax={parallax} className="w-full rounded-[var(--radius-lg)]" />
        </div>
        <div className="mx-auto mt-4 flex max-w-[min(100%,520px)] items-center justify-between gap-2">
          <Button variant="outline" size="icon" aria-label="上一格" onClick={() => setI((n) => Math.max(0, n - 1))}>
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {comic.panels.map((p, idx) => (
              <button
                key={p.id}
                aria-label={`第 ${idx + 1} 格`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-cinnabar" : "w-2 bg-line"}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={playing ? "暂停" : "演出"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="下一格"
            onClick={() => setI((n) => Math.min(comic.panels.length - 1, n + 1))}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
      <aside className="flex flex-col gap-4 lg:pt-2">
        <p className="text-xs tracking-[0.2em] text-muted">{comic.hour}</p>
        <h1 className="font-display text-3xl tracking-tight">{comic.title}</h1>
        <p className="text-muted">{comic.subtitle}</p>
        <p className="text-sm text-stone">
          第 {i + 1} / {comic.panels.length} 格
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild variant="accent">
            <Link to="/studio/$id" params={{ id: comic.id }}>
              摹进工坊
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">全部作品</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
