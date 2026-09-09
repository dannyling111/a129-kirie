import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FlipHorizontal, Plus, Trash2, Grid3x3, Layers, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StageCanvas } from "@/components/stage-canvas";
import { ASSETS, CATEGORIES, assetsByCategory, ASSET_MAP } from "@/lib/quant/catalog";
import { KIND_FIT, KIND_PLANES, PLANES, LEFT_XQ, RIGHT_XQ, SOLO_XQ, defaultPlane, flipForSlot, isPlaneOk, looksToward, panelFaceQc, qcNote, slotFromXQ } from "@/lib/quant/engine";
import { cloneComic } from "@/lib/quant/comics";
import { useLibrary } from "@/lib/store";
import { cn, uid } from "@/lib/utils";
import type { Comic, Layer } from "@/lib/quant/types";

export function StudioApp({ initial }: { initial: Comic }) {
  const nav = useNavigate();
  const saveLib = useLibrary((s) => s.save);
  const [comic, setComic] = useState<Comic>(() => (initial.template ? cloneComic(initial) : structuredClone(initial)));
  const [panelIndex, setPanelIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cat, setCat] = useState("char");
  const [showGrid, setShowGrid] = useState(true);
  const [showPlanes, setShowPlanes] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  const panel = comic.panels[panelIndex];
  const selectedLayer = panel?.layers.find((l) => l.id === selectedId);
  const selectedBubble = panel?.bubbles.find((b) => b.id === selectedId);
  const selectedAsset = selectedLayer ? ASSET_MAP[selectedLayer.assetId] : undefined;

  function patchPanel(partial: Partial<typeof panel>) {
    setComic((c) => ({
      ...c,
      panels: c.panels.map((p, i) => (i === panelIndex ? { ...p, ...partial } : p)),
    }));
  }

  function patchLayer(id: string, partial: Partial<Layer>) {
    patchPanel({
      layers: panel.layers.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    });
  }

  function addAsset(assetId: string, xQ = 32) {
    const asset = ASSET_MAP[assetId];
    if (!asset) return;
    const isChar = asset.kind === "charFull" || asset.kind === "charBust";
    const existing = panel.layers.filter((l) => {
      const a = ASSET_MAP[l.assetId];
      return a?.kind === "charFull" || a?.kind === "charBust";
    });
    let placeX = xQ;
    let flip: boolean | undefined;
    if (isChar) {
      const slot = existing.length === 0 ? "left" : existing.length === 1 ? "right" : "solo";
      placeX = slot === "left" ? LEFT_XQ : slot === "right" ? RIGHT_XQ : SOLO_XQ;
      flip = flipForSlot(asset.face ?? "L", slot);
    }
    const layer: Layer = {
      id: uid("ly"),
      assetId,
      plane: defaultPlane(asset.kind),
      xQ: placeX,
      offsetYQ: asset.defaultOffsetYQ,
      flip,
    };
    patchPanel({ layers: [...panel.layers, layer] });
    setSelectedId(layer.id);
    setPending(null);
  }

  const palette = useMemo(() => assetsByCategory(cat), [cat]);

  if (!panel) return null;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-3 py-3 lg:h-[calc(100dvh-3.5rem)] lg:flex-row">
      <aside className="flex max-h-48 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper-2 lg:max-h-none lg:w-56">
        <div className="flex gap-1 border-b border-line p-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "h-9 flex-1 rounded-[var(--radius-sm)] text-xs",
                cat === c.id ? "bg-ink text-paper" : "text-muted",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1 overflow-auto p-2 lg:grid-cols-2">
          {palette.map((a) => (
            <button
              key={a.id}
              onClick={() => addAsset(a.id)}
              onPointerEnter={() => setPending(a.id)}
              className="group flex aspect-[3/4] flex-col items-center justify-end overflow-hidden rounded-[var(--radius-sm)] bg-paper"
            >
              <img src={a.src} alt="" className="pointer-events-none h-full w-full object-contain object-bottom" />
              <span className="w-full truncate bg-ink/80 px-1 py-0.5 text-[10px] text-paper">{a.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={comic.title}
            onChange={(e) => setComic({ ...comic, title: e.target.value })}
            className="h-11 min-w-0 flex-1 rounded-[var(--radius-md)] border border-line bg-cream px-3 font-display text-lg"
          />
          <Button
            variant={showGrid ? "accent" : "outline"}
            size="icon"
            aria-label="网格"
            onClick={() => setShowGrid((v) => !v)}
          >
            <Grid3x3 className="size-4" />
          </Button>
          <Button
            variant={showPlanes ? "accent" : "outline"}
            size="icon"
            aria-label="景深线"
            onClick={() => setShowPlanes((v) => !v)}
          >
            <Layers className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const id = uid("bb");
              patchPanel({
                bubbles: [...panel.bubbles, { id, text: "……", xQ: 12, yQ: 16, tail: "bl" }],
              });
              setSelectedId(id);
            }}
          >
            <MessageSquare className="size-4" />
            对白
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              saveLib(comic);
              nav({ to: "/read/$id", params: { id: comic.id } });
            }}
          >
            保存并阅读
          </Button>
        </div>

        <div className="mx-auto w-full max-w-[min(100%,520px)] flex-1">
          <StageCanvas
            panel={panel}
            mode="edit"
            selectedId={selectedId}
            showGrid={showGrid}
            showPlanes={showPlanes}
            onSelect={setSelectedId}
            onMoveLayer={(id, xQ, yQ) => {
              const layer = panel.layers.find((l) => l.id === id);
              const asset = layer ? ASSET_MAP[layer.assetId] : undefined;
              if (asset && KIND_FIT[asset.kind] === "bust") {
                const slot = slotFromXQ(xQ);
                const flip = asset.face ? flipForSlot(asset.face, slot) : undefined;
                patchLayer(id, { xQ, flip });
              } else patchLayer(id, { xQ, yQ });
            }}
            onMoveBubble={(id, xQ, yQ) =>
              patchPanel({
                bubbles: panel.bubbles.map((b) => (b.id === id ? { ...b, xQ, yQ } : b)),
              })
            }
            className="w-full rounded-[var(--radius-lg)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {comic.panels.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setPanelIndex(idx);
                setSelectedId(null);
              }}
              className={cn(
                "h-16 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border",
                idx === panelIndex ? "border-cinnabar" : "border-line",
              )}
            >
              <StageCanvas panel={p} mode="thumb" className="h-full w-full" />
            </button>
          ))}
          <button
            className="flex h-16 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-line text-muted"
            onClick={() => {
              const next = {
                id: uid("pn"),
                layers: panel.layers.map((l) => ({ ...l, id: uid("ly") })),
                bubbles: [],
              };
              setComic({ ...comic, panels: [...comic.panels, next] });
              setPanelIndex(comic.panels.length);
            }}
            aria-label="新一格"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </section>

      <aside className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-line bg-paper-2 p-3 lg:w-64">
        <p className="text-xs tracking-[0.16em] text-muted">图层 · 量化</p>
        <div className="max-h-40 overflow-auto lg:max-h-52">
          {[...panel.layers].reverse().map((l) => {
            const a = ASSET_MAP[l.assetId];
            return (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm",
                  selectedId === l.id ? "bg-cream" : "hover:bg-paper",
                )}
              >
                <span className="w-10 truncate text-[10px] text-stone">{PLANES[l.plane].label}</span>
                <span className="truncate">{a?.label ?? l.assetId}</span>
              </button>
            );
          })}
        </div>
        {selectedLayer && selectedAsset && (
          <div className="flex flex-col gap-2 border-t border-line pt-3">
            <p className="text-sm">{selectedAsset.label}</p>
            <p className={cn("text-xs", qcNote(selectedAsset.kind, selectedLayer.plane).ok ? "text-muted" : "text-cinnabar")}>
              {qcNote(selectedAsset.kind, selectedLayer.plane).note}
              {" · "}
              {selectedLayer.xQ}q
              {selectedAsset.face
                ? ` · 朝${looksToward(selectedAsset.face, selectedLayer.flip) === "L" ? "左" : "右"}`
                : ""}
            </p>
            {(() => {
              const faceQc = panelFaceQc(
                panel.layers
                  .map((l) => {
                    const a = ASSET_MAP[l.assetId];
                    if (!a?.face) return null;
                    return { xQ: l.xQ, flip: l.flip, face: a.face, kind: a.kind };
                  })
                  .filter((x): x is NonNullable<typeof x> => Boolean(x)),
              );
              return (
                <p className={cn("text-xs", faceQc.ok ? "text-muted" : "text-cinnabar")}>{faceQc.note}</p>
              );
            })()}
            <label className="text-xs text-muted">
              景深
              <select
                className="mt-1 h-10 w-full rounded-[var(--radius-sm)] border border-line bg-cream px-2"
                value={selectedLayer.plane}
                onChange={(e) => {
                  const plane = e.target.value as Layer["plane"];
                  if (isPlaneOk(selectedAsset.kind, plane)) patchLayer(selectedLayer.id, { plane });
                }}
              >
                {KIND_PLANES[selectedAsset.kind].map((p) => (
                  <option key={p} value={p}>
                    {PLANES[p].label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => patchLayer(selectedLayer.id, { flip: !selectedLayer.flip })}>
                <FlipHorizontal className="size-4" />
                翻转
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  patchPanel({ layers: panel.layers.filter((l) => l.id !== selectedLayer.id) });
                  setSelectedId(null);
                }}
              >
                <Trash2 className="size-4" />
                删除
              </Button>
            </div>
          </div>
        )}
        {selectedBubble && (
          <div className="flex flex-col gap-2 border-t border-line pt-3">
            <textarea
              className="min-h-20 rounded-[var(--radius-sm)] border border-line bg-cream p-2 text-sm"
              value={selectedBubble.text}
              onChange={(e) =>
                patchPanel({
                  bubbles: panel.bubbles.map((b) => (b.id === selectedBubble.id ? { ...b, text: e.target.value } : b)),
                })
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                patchPanel({ bubbles: panel.bubbles.filter((b) => b.id !== selectedBubble.id) });
                setSelectedId(null);
              }}
            >
              删除对白
            </Button>
          </div>
        )}
        <p className="mt-auto text-[11px] leading-relaxed text-stone">
          半身立绘锁在画面下沿。对话自动面对面：左的朝右，右的朝左。同框同一身高。
        </p>
        <p className="hidden text-[10px] text-stone">{ASSETS.length} 件合格贴纸 · {pending}</p>
      </aside>
    </div>
  );
}
