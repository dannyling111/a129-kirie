import { uid } from "@/lib/utils";
import type { Bubble, Comic, Layer, Panel } from "./types";
import type { ActorSlot, FaceDir, PlaneId } from "./engine";
import { LEFT_XQ, RIGHT_XQ, SOLO_XQ, flipForSlot, flipToDir } from "./engine";
import { ASSET_MAP } from "./catalog";

function L(
  id: string,
  assetId: string,
  plane: PlaneId,
  xQ: number,
  extra: Partial<Layer> = {},
): Layer {
  return { id, assetId, plane, xQ, ...extra };
}

function B(id: string, text: string, xQ: number, yQ: number, tail: Bubble["tail"] = "bl"): Bubble {
  return { id, text, xQ, yQ, tail };
}

function P(id: string, layers: Layer[], bubbles: Bubble[] = [], extra: Partial<Panel> = {}): Panel {
  return { id, layers, bubbles, ...extra };
}

function nativeFace(assetId: string): FaceDir {
  return ASSET_MAP[assetId]?.face ?? "L";
}

/** Dialogue / facing: left looks right, right looks left. Bottom is pinned by the engine. */
function A(id: string, assetId: string, slot: ActorSlot, extra: Partial<Layer> = {}): Layer {
  const xQ = extra.xQ ?? (slot === "left" ? LEFT_XQ : slot === "right" ? RIGHT_XQ : SOLO_XQ);
  const flip = extra.flip ?? flipForSlot(nativeFace(assetId), slot);
  const { xQ: _x, flip: _f, ...rest } = extra;
  return L(id, assetId, "actors", xQ, { ...rest, flip });
}

/** Two people walking the same way. */
function walkA(id: string, assetId: string, slot: "left" | "right", dir: FaceDir, extra: Partial<Layer> = {}): Layer {
  const xQ = extra.xQ ?? (slot === "left" ? LEFT_XQ : RIGHT_XQ);
  const flip = extra.flip ?? flipToDir(nativeFace(assetId), dir);
  const { xQ: _x, flip: _f, ...rest } = extra;
  return L(id, assetId, "actors", xQ, { ...rest, flip });
}

function streetSet(prefix: string, sky: string, wet = false): Layer[] {
  return [
    L(`${prefix}-sky`, sky, "sky", 0),
    L(`${prefix}-line`, "skyline", "far", 0),
    L(`${prefix}-off`, "bldg-office", "mid", 2),
    L(`${prefix}-apt`, "bldg-apt", "mid", 30),
    L(`${prefix}-tw`, "bldg-tower", "mid", 56),
    L(`${prefix}-sh`, "bldg-shop", "mid", 72),
    L(`${prefix}-gnd`, wet ? "ground-wet" : "ground-street", "street", 0),
  ];
}

export const TEMPLATES: Comic[] = [
  {
    id: "last-train",
    title: "末班电车",
    subtitle: "车厢把夜晚切成一条细缝",
    hour: "23:48",
    template: true,
    panels: [
      P("lt-1", [
        L("lt-1-sky", "sky-night", "sky", 0),
        L("lt-1-int", "int-subway", "mid", 0),
        A("lt-1-m", "m-office-stand", "left"),
        A("lt-1-f", "f-office-stand", "right"),
      ], [B("lt-1-b", "末班了。", 18, 8, "bl")]),
      P("lt-2", [
        L("lt-2-sky", "sky-night", "sky", 0),
        L("lt-2-int", "int-subway", "mid", 0),
        A("lt-2-f", "f-office-bust", "solo"),
      ], [B("lt-2-b", "还以为只有我。", 8, 8, "br")]),
      P("lt-3", [
        L("lt-3-sky", "sky-night", "sky", 0),
        L("lt-3-int", "int-subway", "mid", 0),
        A("lt-3-m", "m-office-sit", "left"),
        A("lt-3-f", "f-office-sit", "right"),
      ], [B("lt-3-b", "这座城市一到夜里就没收声音。", 20, 8, "bl")]),
      P("lt-4", [
        L("lt-4-sky", "sky-night", "sky", 0),
        L("lt-4-int", "int-subway", "mid", 0),
        A("lt-4-m", "m-office-talk", "left"),
        A("lt-4-f", "f-office-stand", "right"),
      ], [
        B("lt-4-b1", "你在哪一站下？", 8, 8, "bl"),
        B("lt-4-b2", "下一站。", 58, 10, "br"),
      ]),
      P("lt-5", [
        L("lt-5-sky", "sky-night", "sky", 0),
        L("lt-5-int", "int-subway", "mid", 0),
        A("lt-5-m", "m-office-stand", "left"),
        A("lt-5-f", "f-office-stand", "right"),
      ], [B("lt-5-b", "我也是。", 36, 8, "none")], { caption: "车门还没有开。" }),
    ],
  },
  {
    id: "konbini-217",
    title: "便利店 2:17",
    subtitle: "灯是全城最亮的一块纸",
    hour: "02:17",
    template: true,
    panels: [
      P("kb-1", [
        L("kb-1-sky", "sky-night", "sky", 0),
        L("kb-1-int", "int-konbini", "mid", 0),
        A("kb-1-m", "m-casual-walk", "solo"),
      ], [B("kb-1-b", "灯还开着。", 12, 8, "bl")]),
      P("kb-2", [
        L("kb-2-sky", "sky-night", "sky", 0),
        L("kb-2-int", "int-konbini", "mid", 0),
        A("kb-2-m", "m-casual-stand", "left"),
        A("kb-2-f", "f-casual-stand", "right"),
      ], [B("kb-2-b", "关东煮已经皱了。", 48, 8, "br")]),
      P("kb-3", [
        L("kb-3-sky", "sky-night", "sky", 0),
        L("kb-3-int", "int-konbini", "mid", 0),
        A("kb-3-m", "m-casual-talk", "left"),
        A("kb-3-f", "f-casual-stand", "right"),
      ], [
        B("kb-3-b1", "还要加热吗？", 52, 8, "br"),
        B("kb-3-b2", "不用。这样就好。", 8, 12, "bl"),
      ]),
      P("kb-4", [
        L("kb-4-sky", "sky-rain", "sky", 0),
        L("kb-4-line", "skyline", "far", 0),
        L("kb-4-sh", "bldg-shop", "mid", 8),
        L("kb-4-apt", "bldg-apt", "mid", 44),
        L("kb-4-gnd", "ground-wet", "street", 0),
        L("kb-4-ven", "prop-vending", "street", 6),
        walkA("kb-4-m", "m-casual-walk", "left", "R", { xQ: 16 }),
        L("kb-4-lp", "prop-lamp", "fg", 72),
      ], [], { rain: true, caption: "门外还在下雨。" }),
      P("kb-5", [
        L("kb-5-sky", "sky-night", "sky", 0),
        L("kb-5-int", "int-konbini", "mid", 0),
        A("kb-5-f", "f-casual-stand", "solo"),
      ], [B("kb-5-b", "下次也这个点。", 12, 8, "bl")]),
    ],
  },
  {
    id: "rooftop",
    title: "天台",
    subtitle: "楼在下面变成格子",
    hour: "18:40",
    template: true,
    panels: [
      P("rt-1", [
        L("rt-1-sky", "sky-dusk", "sky", 0),
        L("rt-1-line", "skyline", "far", 0),
        L("rt-1-gnd", "ground-roof", "street", 0),
        A("rt-1-m", "m-office-stand", "solo"),
        L("rt-1-lp", "prop-lamp", "fg", 4),
      ], [B("rt-1-b", "风把外套吹开。", 48, 10, "none")]),
      P("rt-2", [
        L("rt-2-sky", "sky-dusk", "sky", 0),
        L("rt-2-line", "skyline", "far", 0),
        L("rt-2-gnd", "ground-roof", "street", 0),
        A("rt-2-f", "f-office-bust", "solo"),
      ], [B("rt-2-b", "你还会来吗？", 8, 8, "br")]),
      P("rt-3", [
        L("rt-3-sky", "sky-dusk", "sky", 0),
        L("rt-3-line", "skyline", "far", 0),
        L("rt-3-gnd", "ground-roof", "street", 0),
        A("rt-3-m", "m-office-talk", "left"),
        A("rt-3-f", "f-office-stand", "right"),
      ], [B("rt-3-b", "周四。如果加班早点。", 8, 8, "bl")]),
      P("rt-4", [
        L("rt-4-sky", "sky-dusk", "sky", 0),
        L("rt-4-line", "skyline", "far", 0),
        L("rt-4-gnd", "ground-roof", "street", 0),
        A("rt-4-m", "m-office-think", "solo"),
      ], [], { caption: "天色把两个人切成同一块纸。" }),
      P("rt-5", [
        L("rt-5-sky", "sky-night", "sky", 0),
        L("rt-5-line", "skyline", "far", 0),
        L("rt-5-gnd", "ground-roof", "street", 0),
        A("rt-5-m", "m-office-stand", "left"),
        A("rt-5-f", "f-office-stand", "right"),
      ], [B("rt-5-b", "走吧。", 38, 8, "none")]),
    ],
  },
  {
    id: "rain-alley",
    title: "雨巷",
    subtitle: "路灯被切成一条一条",
    hour: "21:05",
    template: true,
    panels: [
      P("ra-1", [
        L("ra-1-sky", "sky-rain", "sky", 0),
        L("ra-1-line", "skyline", "far", 0),
        L("ra-1-apt", "bldg-apt", "mid", 4),
        L("ra-1-off", "bldg-office", "mid", 36),
        L("ra-1-tw", "bldg-tower", "mid", 68),
        L("ra-1-gnd", "ground-wet", "street", 0),
        L("ra-1-lp", "prop-lamp", "street", 8),
        walkA("ra-1-m", "m-office-walk", "left", "R", { xQ: 16 }),
      ], [], { rain: true, caption: "雨把路灯切成一条一条。" }),
      P("ra-2", [
        L("ra-2-sky", "sky-rain", "sky", 0),
        L("ra-2-line", "skyline", "far", 0),
        L("ra-2-apt", "bldg-apt", "mid", 8),
        L("ra-2-sh", "bldg-shop", "mid", 50),
        L("ra-2-gnd", "ground-wet", "street", 0),
        walkA("ra-2-f", "f-office-walk", "right", "L"),
        L("ra-2-lp", "prop-lamp", "fg", 2),
      ], [], { rain: true, caption: "一把伞从对面过来。" }),
      P("ra-3", [
        L("ra-3-sky", "sky-rain", "sky", 0),
        L("ra-3-apt", "bldg-apt", "mid", 6),
        L("ra-3-off", "bldg-office", "mid", 40),
        L("ra-3-gnd", "ground-wet", "street", 0),
        A("ra-3-m", "m-office-talk", "left"),
        A("ra-3-f", "f-office-stand", "right"),
      ], [
        B("ra-3-b1", "抱歉，溅到你了。", 6, 8, "bl"),
        B("ra-3-b2", "没事。这城本来就湿。", 52, 10, "br"),
      ], { rain: true }),
      P("ra-4", [
        L("ra-4-sky", "sky-rain", "sky", 0),
        L("ra-4-line", "skyline", "far", 0),
        L("ra-4-tw", "bldg-tower", "mid", 10),
        L("ra-4-apt", "bldg-apt", "mid", 40),
        L("ra-4-gnd", "ground-wet", "street", 0),
        walkA("ra-4-m", "m-office-walk", "left", "R"),
        walkA("ra-4-f", "f-office-walk", "right", "R"),
        L("ra-4-lp", "prop-lamp", "fg", 76),
      ], [], { rain: true, caption: "两个人的脚步错开，又叠上。" }),
      P("ra-5", [
        L("ra-5-sky", "sky-night", "sky", 0),
        L("ra-5-line", "skyline", "far", 0),
        L("ra-5-off", "bldg-office", "mid", 18),
        L("ra-5-gnd", "ground-wet", "street", 0),
        L("ra-5-lp", "prop-lamp", "street", 6),
        L("ra-5-um", "prop-umbrella", "street", 38, { offsetYQ: -8 }),
      ], [B("ra-5-b", "下一场雨也这样。", 12, 8, "none")], { rain: true }),
    ],
  },
  {
    id: "overtime",
    title: "加班",
    subtitle: "屏幕是唯一的白天",
    hour: "22:11",
    template: true,
    panels: [
      P("ot-1", [
        L("ot-1-sky", "sky-night", "sky", 0),
        L("ot-1-int", "int-office", "mid", 0),
        A("ot-1-m", "m-office-think", "solo"),
      ], [B("ot-1-b", "对面楼又灭了一扇。", 10, 8, "bl")]),
      P("ot-2", [
        L("ot-2-sky", "sky-night", "sky", 0),
        L("ot-2-int", "int-office", "mid", 0),
        A("ot-2-m", "m-office-bust", "solo"),
      ], [B("ot-2-b", "十七。", 8, 8, "br")]),
      P("ot-3", [
        L("ot-3-sky", "sky-night", "sky", 0),
        L("ot-3-int", "int-office", "mid", 0),
        A("ot-3-m", "m-office-talk", "solo"),
      ], [B("ot-3-b", "明天的会，可以改到后天。", 8, 8, "bl")]),
      P("ot-4", [
        L("ot-4-sky", "sky-night", "sky", 0),
        L("ot-4-int", "int-office", "mid", 0),
        A("ot-4-m", "m-office-stand", "solo"),
      ], [], { caption: "他把这句话删掉。" }),
      P("ot-5", [
        L("ot-5-sky", "sky-night", "sky", 0),
        L("ot-5-line", "skyline", "far", 0),
        L("ot-5-off", "bldg-office", "mid", 20),
        L("ot-5-tw", "bldg-tower", "mid", 52),
        L("ot-5-gnd", "ground-street", "street", 0),
        L("ot-5-lp", "prop-lamp", "fg", 6),
      ], [B("ot-5-b", "走廊的灯也是纸做的。", 20, 8, "none")]),
    ],
  },
  {
    id: "green-light",
    title: "绿灯",
    subtitle: "比人更准时的东西",
    hour: "08:04",
    template: true,
    panels: [
      P("gl-1", [
        ...streetSet("gl-1", "sky-dawn"),
        L("gl-1-sg", "prop-signal", "street", 8),
        walkA("gl-1-m", "m-office-walk", "left", "R"),
        walkA("gl-1-f", "f-office-walk", "right", "R"),
      ], [], { caption: "绿灯比人更准时。" }),
      P("gl-2", [
        L("gl-2-sky", "sky-dawn", "sky", 0),
        L("gl-2-line", "skyline", "far", 0),
        L("gl-2-sh", "bldg-shop", "mid", 4),
        L("gl-2-apt", "bldg-apt", "mid", 40),
        L("gl-2-gnd", "ground-street", "street", 0),
        walkA("gl-2-m", "m-office-walk", "left", "R"),
        walkA("gl-2-f", "f-office-walk", "right", "R"),
        L("gl-2-sg", "prop-signal", "fg", 78),
      ], [B("gl-2-b", "……", 22, 8, "bl")]),
      P("gl-3", [
        L("gl-3-sky", "sky-noon", "sky", 0),
        L("gl-3-line", "skyline", "far", 0),
        L("gl-3-off", "bldg-office", "mid", 10),
        L("gl-3-tw", "bldg-tower", "mid", 48),
        L("gl-3-gnd", "ground-street", "street", 0),
        L("gl-3-tr", "prop-tree", "street", 62),
        walkA("gl-3-m", "m-casual-walk", "left", "R"),
        walkA("gl-3-f", "f-casual-walk", "right", "R"),
      ], [], { caption: "谁也没有回头。" }),
      P("gl-4", [
        L("gl-4-sky", "sky-noon", "sky", 0),
        L("gl-4-line", "skyline", "far", 0),
        L("gl-4-apt", "bldg-apt", "mid", 8),
        L("gl-4-gnd", "ground-street", "street", 0),
        L("gl-4-tr", "prop-tree", "fg", 4),
        L("gl-4-tr2", "prop-tree", "street", 70, { flip: true }),
      ], [], { caption: "风把银杏吹成碎片。" }),
      P("gl-5", [
        ...streetSet("gl-5", "sky-dusk"),
        L("gl-5-sg", "prop-signal", "street", 6),
        A("gl-5-m", "m-office-stand", "left"),
        A("gl-5-f", "f-office-stand", "right"),
      ], [B("gl-5-b", "下一次绿灯，还是这些人。", 16, 8, "none")]),
    ],
  },
  {
    id: "window-seat",
    title: "窗边",
    subtitle: "玻璃上有对面的楼",
    hour: "16:20",
    template: true,
    panels: [
      P("ws-1", [
        L("ws-1-sky", "sky-dusk", "sky", 0),
        L("ws-1-int", "int-cafe", "mid", 0),
        A("ws-1-m", "m-office-sit", "left"),
        A("ws-1-f", "f-office-sit", "right"),
      ], [], { caption: "玻璃上有对面的楼。" }),
      P("ws-2", [
        L("ws-2-sky", "sky-dusk", "sky", 0),
        L("ws-2-int", "int-cafe", "mid", 0),
        A("ws-2-m", "m-office-sit", "left"),
        A("ws-2-f", "f-office-talk", "right"),
      ], [B("ws-2-b", "你说的那件事，我答应了。", 48, 8, "br")]),
      P("ws-3", [
        L("ws-3-sky", "sky-dusk", "sky", 0),
        L("ws-3-int", "int-cafe", "mid", 0),
        A("ws-3-m", "m-office-bust", "solo"),
      ], [B("ws-3-b", "我还没问。", 8, 8, "bl")]),
      P("ws-4", [
        L("ws-4-sky", "sky-dusk", "sky", 0),
        L("ws-4-int", "int-cafe", "mid", 0),
        A("ws-4-m", "m-office-sit", "left"),
        A("ws-4-f", "f-office-sit", "right"),
      ], [], { caption: "咖啡冷了，谁也没点第二杯。" }),
      P("ws-5", [
        L("ws-5-sky", "sky-night", "sky", 0),
        L("ws-5-int", "int-cafe", "mid", 0),
        A("ws-5-f", "f-office-stand", "solo"),
      ], [B("ws-5-b", "下次还坐这儿。", 8, 8, "bl")]),
    ],
  },
  {
    id: "first-train",
    title: "第一班",
    subtitle: "天还没完全醒",
    hour: "06:12",
    template: true,
    panels: [
      P("ft-1", [
        ...streetSet("ft-1", "sky-dawn"),
        L("ft-1-lp", "prop-lamp", "street", 6),
        walkA("ft-1-m", "m-office-walk", "left", "R", { xQ: 16 }),
      ], [], { caption: "天还没完全醒。" }),
      P("ft-2", [
        L("ft-2-sky", "sky-dawn", "sky", 0),
        L("ft-2-line", "skyline", "far", 0),
        L("ft-2-sh", "bldg-shop", "mid", 10),
        L("ft-2-apt", "bldg-apt", "mid", 48),
        L("ft-2-gnd", "ground-street", "street", 0),
        L("ft-2-ven", "prop-vending", "street", 4),
        walkA("ft-2-f", "f-office-walk", "left", "R", { xQ: 16 }),
      ], [B("ft-2-b", "便利店的灯还开着。", 16, 8, "none")]),
      P("ft-3", [
        L("ft-3-sky", "sky-dawn", "sky", 0),
        L("ft-3-line", "skyline", "far", 0),
        L("ft-3-off", "bldg-office", "mid", 6),
        L("ft-3-tw", "bldg-tower", "mid", 40),
        L("ft-3-gnd", "ground-street", "street", 0),
        walkA("ft-3-m", "m-office-walk", "left", "R"),
        walkA("ft-3-f", "f-office-walk", "right", "R"),
        L("ft-3-bk", "prop-bike", "street", 68),
      ], [], { caption: "他们不说话，只是同路。" }),
      P("ft-4", [
        L("ft-4-sky", "sky-dawn", "sky", 0),
        L("ft-4-int", "int-subway", "mid", 0),
        A("ft-4-m", "m-office-stand", "left"),
        A("ft-4-f", "f-office-stand", "right"),
      ], [B("ft-4-b", "电车会来的。", 22, 8, "bl")]),
      P("ft-5", [
        ...streetSet("ft-5", "sky-noon"),
        L("ft-5-tr", "prop-tree", "fg", 2),
        walkA("ft-5-m", "m-casual-walk", "left", "R"),
        walkA("ft-5-f", "f-casual-walk", "right", "R"),
      ], [], { caption: "城市把人一张一张贴回去。" }),
    ],
  },
];

export function emptyComic(): Comic {
  return {
    id: uid("comic"),
    title: "未命名",
    subtitle: "新的一页",
    hour: "—",
    template: false,
    panels: [
      P(uid("pn"), [
        L(uid("ly"), "sky-dusk", "sky", 0),
        L(uid("ly"), "skyline", "far", 0),
        L(uid("ly"), "bldg-office", "mid", 8),
        L(uid("ly"), "bldg-apt", "mid", 42),
        L(uid("ly"), "ground-street", "street", 0),
      ]),
    ],
  };
}

export function cloneComic(src: Comic): Comic {
  return {
    ...src,
    id: uid("comic"),
    title: src.title + " · 摹",
    template: false,
    panels: src.panels.map((p) => ({
      ...p,
      id: uid("pn"),
      layers: p.layers.map((l) => ({ ...l, id: uid("ly") })),
      bubbles: p.bubbles.map((b) => ({ ...b, id: uid("bb") })),
    })),
  };
}

export function findTemplate(id: string) {
  return TEMPLATES.find((c) => c.id === id);
}
