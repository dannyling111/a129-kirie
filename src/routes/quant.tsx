import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CANON_Q, CHAR_Q, PLANES, PLANE_ORDER, Q, STAGE_PX, STAGE_Q } from "@/lib/quant/engine";
import { ASSETS } from "@/lib/quant/catalog";

export const Route = createFileRoute("/quant")({ component: QuantPage });

function QuantPage() {
  const chars = ASSETS.filter((a) => a.face);
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs tracking-[0.28em] text-cinnabar">ENGINE</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">量化引擎</h1>
        <p className="mt-4 text-muted">
          画幅 {STAGE_Q.w} × {STAGE_Q.h} 格，每格 {Q} 像素，舞台 {STAGE_PX.w}×{STAGE_PX.h}
          。半身立绘底边锁在画面下沿。每张立绘标注朝向，对话面对面，同框同一盒。
        </p>

        <h2 className="mt-10 font-display text-2xl">六层景深</h2>
        <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-line">
          {PLANE_ORDER.map((id) => {
            const p = PLANES[id];
            return (
              <div key={id} className="grid grid-cols-[4.5rem_1fr_4rem] items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                <span className="font-display">{p.label}</span>
                <span className="text-sm text-muted">{p.hint}</span>
                <span className="text-right text-xs tabular-nums text-stone">×{p.scale}</span>
              </div>
            );
          })}
        </div>

        <h2 className="mt-10 font-display text-2xl">标准尺寸</h2>
        <p className="mt-2 text-sm text-muted">
          立绘统一 {CHAR_Q.w}×{CHAR_Q.h}（2:3），贴紧下沿。男女同框同身高、同脸大。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(CANON_Q).map(([k, v]) => (
            <div key={k} className="rounded-[var(--radius-md)] border border-line bg-paper-2 p-3">
              <p className="text-xs text-stone">{k}</p>
              <p className="mt-1 font-display text-xl tabular-nums">
                {v.w}×{v.h}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-2xl">朝向</h2>
        <p className="mt-2 text-sm text-muted">
          素材自带朝左 / 朝右。对话：左边的人必须朝右，右边的人必须朝左。走路可以同向。引擎会按槽位自动翻转。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          {chars.map((a) => (
            <div key={a.id} className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-line px-2 py-1.5">
              <img src={a.src} alt="" className="h-12 w-8 object-contain object-bottom" />
              <div className="min-w-0">
                <p className="truncate text-sm">{a.label}</p>
                <p className="text-[11px] text-muted">原图朝{a.face === "L" ? "左" : "右"}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-2xl">合格素材</h2>
        <p className="mt-2 text-sm text-muted">
          同一身高、标注朝向、纯底抠图。现有 {ASSETS.length} 件。
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-6">
          {ASSETS.filter((a) => a.kind !== "sky" && a.kind !== "ground" && a.kind !== "interior").map((a) => (
            <div key={a.id} className="aspect-[3/4] overflow-hidden rounded-[var(--radius-sm)] bg-paper-2">
              <img src={a.src} alt={a.label} className="h-full w-full object-contain object-bottom" />
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
