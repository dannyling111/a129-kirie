/** KIRIE quantization engine — one grid, six depth planes, canonical sizes. */

export const Q = 8;

export const STAGE_Q = { w: 90, h: 120 } as const;
export const STAGE_PX = { w: STAGE_Q.w * Q, h: STAGE_Q.h * Q } as const;

export type PlaneId = "sky" | "far" | "mid" | "street" | "actors" | "fg";

export type AssetKind =
  | "sky"
  | "ground"
  | "buildingFar"
  | "buildingMid"
  | "interior"
  | "prop"
  | "charFull"
  | "charBust";

export type Fit = "fill" | "fillX" | "feet" | "bust";

/** Viewer-relative: which way the sprite looks in the raw art. */
export type FaceDir = "L" | "R";

export type ActorSlot = "left" | "right" | "solo";

export type PlaneSpec = {
  id: PlaneId;
  z: number;
  scale: number;
  groundQ: number;
  parallax: number;
  label: string;
  hint: string;
};

export const PLANES: Record<PlaneId, PlaneSpec> = {
  sky: {
    id: "sky",
    z: 0,
    scale: 1,
    groundQ: 0,
    parallax: 0.06,
    label: "天空",
    hint: "铺满画幅，留给楼与人去贴",
  },
  far: {
    id: "far",
    z: 1,
    scale: 0.5,
    groundQ: 56,
    parallax: 0.22,
    label: "远景",
    hint: "天际楼影，尺度减半",
  },
  mid: {
    id: "mid",
    z: 2,
    scale: 0.78,
    groundQ: 76,
    parallax: 0.5,
    label: "中景",
    hint: "街楼与室内墙，窗格对齐楼层",
  },
  street: {
    id: "street",
    z: 3,
    scale: 0.92,
    groundQ: 92,
    parallax: 0.8,
    label: "街道",
    hint: "地面、车、灯、贩卖机",
  },
  actors: {
    id: "actors",
    z: 4,
    scale: 1,
    groundQ: 120,
    parallax: 1,
    label: "立绘",
    hint: "大半身贴底，底边锁在画面下沿",
  },
  fg: {
    id: "fg",
    z: 5,
    scale: 1.18,
    groundQ: 112,
    parallax: 1.2,
    label: "前景",
    hint: "近物遮挡，略放大",
  },
};

export const PLANE_ORDER: PlaneId[] = ["sky", "far", "mid", "street", "actors", "fg"];

/** All 立ち絵 share one 2:3 box so two faces in a panel stay the same size. */
export const CHAR_Q = { w: 60, h: 90 } as const;

export const CANON_Q: Record<AssetKind, { w: number; h: number }> = {
  sky: { w: 90, h: 120 },
  ground: { w: 90, h: 40 },
  buildingFar: { w: 90, h: 36 },
  buildingMid: { w: 28, h: 58 },
  interior: { w: 90, h: 86 },
  prop: { w: 16, h: 28 },
  charFull: { ...CHAR_Q },
  charBust: { ...CHAR_Q },
};

export const KIND_PLANES: Record<AssetKind, PlaneId[]> = {
  sky: ["sky"],
  ground: ["street"],
  buildingFar: ["far"],
  buildingMid: ["mid"],
  interior: ["mid"],
  prop: ["street", "actors", "fg"],
  charFull: ["actors", "fg"],
  charBust: ["actors", "fg"],
};

export const KIND_FIT: Record<AssetKind, Fit> = {
  sky: "fill",
  ground: "fillX",
  buildingFar: "fillX",
  buildingMid: "feet",
  interior: "fill",
  prop: "feet",
  charFull: "bust",
  charBust: "bust",
};

export const LEFT_XQ = 0;
export const RIGHT_XQ = 36;
export const SOLO_XQ = 15;

export function snapQ(n: number, step = 1) {
  return Math.round(n / step) * step;
}

export function clampQ(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function defaultPlane(kind: AssetKind): PlaneId {
  return KIND_PLANES[kind][0];
}

export function isPlaneOk(kind: AssetKind, plane: PlaneId) {
  return KIND_PLANES[kind].includes(plane);
}

export function looksToward(native: FaceDir, flip?: boolean): FaceDir {
  if (!flip) return native;
  return native === "L" ? "R" : "L";
}

/** Dialogue: left looks right, right looks left — face to face, never back to back. */
export function wantFace(slot: ActorSlot): FaceDir {
  if (slot === "left") return "R";
  if (slot === "right") return "L";
  return "R";
}

export function flipForSlot(native: FaceDir, slot: ActorSlot): boolean {
  return native !== wantFace(slot);
}

/** Walk the same way: both look `dir`. */
export function flipToDir(native: FaceDir, dir: FaceDir): boolean {
  return native !== dir;
}

export function slotFromXQ(xQ: number): ActorSlot {
  if (xQ <= 18) return "left";
  if (xQ >= 32) return "right";
  return "solo";
}

export type LayoutBox = {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  fit: Fit;
};

export type PlaceInput = {
  kind: AssetKind;
  plane: PlaneId;
  xQ: number;
  yQ?: number;
  offsetYQ?: number;
  canon?: { w: number; h: number };
  order?: number;
};

export function layoutBox(input: PlaceInput): LayoutBox {
  const plane = PLANES[input.plane];
  const canon = input.canon ?? CANON_Q[input.kind];
  const fit = KIND_FIT[input.kind];
  const z = plane.z * 20 + (input.order ?? 0);

  if (fit === "fill") {
    return { x: 0, y: 0, w: STAGE_PX.w, h: STAGE_PX.h, z, fit };
  }

  if (fit === "fillX") {
    const h = canon.h * Q;
    const y = STAGE_PX.h - h + (input.offsetYQ ?? 0) * Q;
    return { x: 0, y, w: STAGE_PX.w, h, z, fit };
  }

  const w = Math.round(canon.w * plane.scale * Q);
  const h = Math.round(canon.h * plane.scale * Q);
  const x = snapQ(input.xQ) * Q;

  if (fit === "bust") {
    // Half-body always sits on the bottom edge of the frame.
    const y = STAGE_PX.h - h + (input.offsetYQ ?? 0) * Q;
    return { x, y, w, h, z, fit };
  }

  const y = plane.groundQ * Q - h + (input.offsetYQ ?? 0) * Q;
  return { x, y, w, h, z, fit };
}

export function pointerToQuant(
  clientX: number,
  clientY: number,
  rect: DOMRect,
) {
  const xQ = snapQ(((clientX - rect.left) / rect.width) * STAGE_Q.w);
  const yQ = snapQ(((clientY - rect.top) / rect.height) * STAGE_Q.h);
  return {
    xQ: clampQ(xQ, 0, STAGE_Q.w),
    yQ: clampQ(yQ, 0, STAGE_Q.h),
  };
}

export function qcNote(kind: AssetKind, plane: PlaneId): { ok: boolean; note: string } {
  if (!isPlaneOk(kind, plane)) {
    return { ok: false, note: `${kind} 不应落在「${PLANES[plane].label}」层` };
  }
  return { ok: true, note: "尺度合格" };
}

export type FaceActor = { xQ: number; flip?: boolean; face: FaceDir; kind: AssetKind };

export function panelFaceQc(actors: FaceActor[]): { ok: boolean; note: string } {
  const chars = actors.filter((a) => a.kind === "charFull" || a.kind === "charBust");
  if (chars.length < 2) return { ok: true, note: "朝向合格" };
  const sorted = [...chars].sort((a, b) => a.xQ - b.xQ);
  const left = looksToward(sorted[0].face, sorted[0].flip);
  const right = looksToward(sorted[sorted.length - 1].face, sorted[sorted.length - 1].flip);
  if (left === "L" && right === "R") {
    return { ok: false, note: "背对背 — 对话应对面" };
  }
  if (left === "R" && right === "L") {
    return { ok: true, note: "面对面" };
  }
  return { ok: true, note: `同向 ${left === "R" ? "右" : "左"}` };
}
