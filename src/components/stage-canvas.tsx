import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  KIND_FIT,
  PLANES,
  PLANE_ORDER,
  STAGE_PX,
  STAGE_Q,
  layoutBox,
  pointerToQuant,
  snapQ,
} from "@/lib/quant/engine";
import { ASSET_MAP } from "@/lib/quant/catalog";
import type { Layer, Panel } from "@/lib/quant/types";
import { SpeechBubble } from "@/components/speech-bubble";

type Mode = "view" | "edit" | "thumb";

export function StageCanvas({
  panel,
  mode = "view",
  selectedId,
  onSelect,
  onMoveLayer,
  onMoveBubble,
  showGrid,
  showPlanes,
  parallax = 0,
  className,
}: {
  panel: Panel;
  mode?: Mode;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onMoveLayer?: (id: string, xQ: number, yQ?: number) => void;
  onMoveBubble?: (id: string, xQ: number, yQ: number) => void;
  showGrid?: boolean;
  showPlanes?: boolean;
  parallax?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; kind: "layer" | "bubble"; dx: number; dy: number } | null>(null);

  const ordered = useMemo(() => {
    return [...panel.layers].sort((a, b) => {
      const za = PLANES[a.plane].z * 20 + panel.layers.indexOf(a);
      const zb = PLANES[b.plane].z * 20 + panel.layers.indexOf(b);
      return za - zb;
    });
  }, [panel.layers]);

  function clientToQ(e: React.PointerEvent) {
    const rect = rootRef.current!.getBoundingClientRect();
    return pointerToQuant(e.clientX, e.clientY, rect);
  }

  function onPointerDownLayer(e: React.PointerEvent, layer: Layer) {
    if (mode !== "edit") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const q = clientToQ(e);
    drag.current = { id: layer.id, kind: "layer", dx: q.xQ - layer.xQ, dy: q.yQ - (layer.yQ ?? 0) };
    onSelect?.(layer.id);
  }

  function onPointerDownBubble(e: React.PointerEvent, id: string, xQ: number, yQ: number) {
    if (mode !== "edit") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const q = clientToQ(e);
    drag.current = { id, kind: "bubble", dx: q.xQ - xQ, dy: q.yQ - yQ };
    onSelect?.(id);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (mode !== "edit" || !drag.current) return;
    const q = clientToQ(e);
    const d = drag.current;
    if (d.kind === "layer") onMoveLayer?.(d.id, snapQ(q.xQ - d.dx), snapQ(q.yQ - d.dy));
    else onMoveBubble?.(d.id, snapQ(q.xQ - d.dx), snapQ(q.yQ - d.dy));
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "stage relative overflow-hidden bg-ink ring-1 ring-ink/20",
        mode === "edit" && "cursor-crosshair",
        className,
      )}
      style={{ aspectRatio: `${STAGE_Q.w} / ${STAGE_Q.h}` }}
      onPointerDown={() => mode === "edit" && onSelect?.(null)}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        drag.current = null;
      }}
    >
      {ordered.map((layer, i) => {
        const asset = ASSET_MAP[layer.assetId];
        if (!asset) return null;
        const box = layoutBox({
          kind: asset.kind,
          plane: layer.plane,
          xQ: layer.xQ,
          yQ: layer.yQ,
          offsetYQ: layer.offsetYQ ?? asset.defaultOffsetYQ,
          canon: asset.canon,
          order: i,
        });
        const fit = KIND_FIT[asset.kind];
        const px = parallax * (PLANES[layer.plane].parallax - 1) * 2.2;
        return (
          <img
            key={layer.id}
            src={asset.src}
            alt={mode === "thumb" ? "" : asset.label}
            draggable={false}
            onPointerDown={(e) => onPointerDownLayer(e, layer)}
            className={cn(
              "absolute max-w-none select-none",
              mode === "edit" && "cursor-grab active:cursor-grabbing",
              selectedId === layer.id && "outline outline-2 outline-offset-[-2px] outline-cinnabar",
            )}
            style={{
              left: `${(box.x / STAGE_PX.w) * 100}%`,
              top: `${(box.y / STAGE_PX.h) * 100}%`,
              width: `${(box.w / STAGE_PX.w) * 100}%`,
              height: `${(box.h / STAGE_PX.h) * 100}%`,
              zIndex: box.z,
              opacity: layer.opacity ?? 1,
              transform: `${layer.flip ? "scaleX(-1) " : ""}translateX(${px}%)`,
              objectFit: fit === "fill" || fit === "fillX" ? "cover" : "contain",
              objectPosition: "bottom center",
              filter:
                asset.kind === "sky" ? undefined : asset.kind.startsWith("char")
                  ? "drop-shadow(0 2px 6px rgba(20,28,32,0.22))"
                  : "drop-shadow(0 6px 10px rgba(26,36,40,0.16))",
              pointerEvents: mode === "edit" ? "auto" : "none",
            }}
          />
        );
      })}
      {panel.rain && <div className="rain-lines pointer-events-none absolute inset-0 z-40 opacity-70" />}
      {panel.bubbles.map((b) => (
        <SpeechBubble
          key={b.id}
          bubble={b}
          selected={selectedId === b.id}
          onPointerDown={(e) => onPointerDownBubble(e, b.id, b.xQ, b.yQ)}
        />
      ))}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--color-ink) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-ink) 12%, transparent) 1px, transparent 1px)",
            backgroundSize: `${100 / STAGE_Q.w}% ${100 / STAGE_Q.h}%`,
          }}
        />
      )}
      {showPlanes &&
        PLANE_ORDER.filter((p) => p !== "sky").map((p) => (
          <div
            key={p}
            className="pointer-events-none absolute left-0 right-0 z-30 border-t border-dashed border-cinnabar/60"
            style={{ top: `${(PLANES[p].groundQ / STAGE_Q.h) * 100}%` }}
          >
            <span className="absolute left-1 top-0 bg-cinnabar px-1.5 py-0.5 text-[10px] tracking-wide text-cinnabar-fg">
              {PLANES[p].label} {PLANES[p].groundQ}q
            </span>
          </div>
        ))}
      {panel.caption && (
        <div className="absolute bottom-[2%] left-[4%] right-[4%] z-40 text-center font-display text-[3.2cqw] text-cream [text-shadow:0_1px_0_rgba(28,24,20,0.65)]">
          {panel.caption}
        </div>
      )}
    </div>
  );
}
