import { assetUrl } from "@/lib/asset-url";
import type { Asset } from "./types";

export const ASSETS: Asset[] = [
  { id: "sky-dawn", src: assetUrl("assets/skies/dawn.jpg"), kind: "sky", label: "晨空", tags: ["天空", "晨"] },
  { id: "sky-noon", src: assetUrl("assets/skies/noon.jpg"), kind: "sky", label: "午空", tags: ["天空", "昼"] },
  { id: "sky-dusk", src: assetUrl("assets/skies/dusk.jpg"), kind: "sky", label: "黄昏", tags: ["天空", "暮"] },
  { id: "sky-night", src: assetUrl("assets/skies/night.jpg"), kind: "sky", label: "夜空", tags: ["天空", "夜"] },
  { id: "sky-rain", src: assetUrl("assets/skies/rain.jpg"), kind: "sky", label: "雨空", tags: ["天空", "雨"] },

  { id: "skyline", src: assetUrl("assets/buildings/skyline.png"), kind: "buildingFar", label: "天际线", tags: ["远景", "楼"] },
  { id: "bldg-office", src: assetUrl("assets/buildings/office.png"), kind: "buildingMid", label: "办公楼", tags: ["中景", "楼"] },
  { id: "bldg-apt", src: assetUrl("assets/buildings/apt.png"), kind: "buildingMid", label: "公寓", tags: ["中景", "楼"] },
  { id: "bldg-shop", src: assetUrl("assets/buildings/shop.png"), kind: "buildingMid", label: "街铺", tags: ["中景", "楼"], canon: { w: 32, h: 36 } },
  { id: "bldg-tower", src: assetUrl("assets/buildings/tower.png"), kind: "buildingMid", label: "细楼", tags: ["中景", "楼"], canon: { w: 18, h: 62 } },

  { id: "ground-street", src: assetUrl("assets/grounds/street.png"), kind: "ground", label: "街道", tags: ["地面"] },
  { id: "ground-wet", src: assetUrl("assets/grounds/wet.png"), kind: "ground", label: "湿路", tags: ["地面", "雨", "夜"] },
  { id: "ground-roof", src: assetUrl("assets/grounds/roof.png"), kind: "ground", label: "天台", tags: ["地面", "屋顶"] },

  { id: "int-subway", src: assetUrl("assets/interiors/subway.png"), kind: "interior", label: "电车内", tags: ["室内"] },
  { id: "int-konbini", src: assetUrl("assets/interiors/konbini.png"), kind: "interior", label: "便利店", tags: ["室内"] },
  { id: "int-cafe", src: assetUrl("assets/interiors/cafe.png"), kind: "interior", label: "咖啡店", tags: ["室内"] },
  { id: "int-office", src: assetUrl("assets/interiors/office.png"), kind: "interior", label: "办公室", tags: ["室内", "夜"] },

  { id: "prop-lamp", src: assetUrl("assets/props/lamp.png"), kind: "prop", label: "路灯", tags: ["道具"], canon: { w: 8, h: 42 } },
  { id: "prop-tree", src: assetUrl("assets/props/tree.png"), kind: "prop", label: "行道树", tags: ["道具"], canon: { w: 24, h: 48 } },
  { id: "prop-car", src: assetUrl("assets/props/car.png"), kind: "prop", label: "轿车", tags: ["道具"], canon: { w: 36, h: 14 } },
  { id: "prop-bench", src: assetUrl("assets/props/bench.png"), kind: "prop", label: "长椅", tags: ["道具"], canon: { w: 32, h: 14 } },
  { id: "prop-vending", src: assetUrl("assets/props/vending.png"), kind: "prop", label: "贩卖机", tags: ["道具"], canon: { w: 14, h: 32 } },
  { id: "prop-umbrella", src: assetUrl("assets/props/umbrella.png"), kind: "prop", label: "伞", tags: ["道具", "雨"], canon: { w: 18, h: 16 } },
  { id: "prop-signal", src: assetUrl("assets/props/signal.png"), kind: "prop", label: "信号灯", tags: ["道具"], canon: { w: 8, h: 36 } },
  { id: "prop-bike", src: assetUrl("assets/props/bike.png"), kind: "prop", label: "自行车", tags: ["道具"], canon: { w: 22, h: 14 } },
  { id: "prop-scooter", src: assetUrl("assets/props/scooter.png"), kind: "prop", label: "滑板车", tags: ["道具"], canon: { w: 28, h: 18 } },

  { id: "m-office-stand", src: assetUrl("assets/chars/m-office-stand.png"), kind: "charFull", label: "男·通勤·立", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "stand", face: "L" },
  { id: "m-office-walk", src: assetUrl("assets/chars/m-office-walk.png"), kind: "charFull", label: "男·通勤·走", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "walk", face: "L" },
  { id: "m-office-talk", src: assetUrl("assets/chars/m-office-talk.png"), kind: "charFull", label: "男·通勤·说", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "talk", face: "L" },
  { id: "m-office-think", src: assetUrl("assets/chars/m-office-think.png"), kind: "charFull", label: "男·通勤·想", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "think", face: "L" },
  { id: "m-office-sit", src: assetUrl("assets/chars/m-office-sit.png"), kind: "charFull", label: "男·通勤·坐", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "sit", face: "L" },
  { id: "m-office-point", src: assetUrl("assets/chars/m-office-point.png"), kind: "charFull", label: "男·通勤·指", tags: ["人物", "男", "立绘", "通勤"], person: "m-office", pose: "point", face: "R" },
  { id: "m-office-bust", src: assetUrl("assets/chars/m-office-bust.png"), kind: "charBust", label: "男·通勤·特写", tags: ["人物", "男", "特写", "通勤"], person: "m-office", pose: "bust", face: "L" },

  { id: "f-office-stand", src: assetUrl("assets/chars/f-office-stand.png"), kind: "charFull", label: "女·通勤·立", tags: ["人物", "女", "立绘", "通勤"], person: "f-office", pose: "stand", face: "L" },
  { id: "f-office-walk", src: assetUrl("assets/chars/f-office-walk.png"), kind: "charFull", label: "女·通勤·走", tags: ["人物", "女", "立绘", "通勤"], person: "f-office", pose: "walk", face: "L" },
  { id: "f-office-talk", src: assetUrl("assets/chars/f-office-talk.png"), kind: "charFull", label: "女·通勤·说", tags: ["人物", "女", "立绘", "通勤"], person: "f-office", pose: "talk", face: "R" },
  { id: "f-office-sit", src: assetUrl("assets/chars/f-office-sit.png"), kind: "charFull", label: "女·通勤·坐", tags: ["人物", "女", "立绘", "通勤"], person: "f-office", pose: "sit", face: "L" },
  { id: "f-office-bust", src: assetUrl("assets/chars/f-office-bust.png"), kind: "charBust", label: "女·通勤·特写", tags: ["人物", "女", "特写", "通勤"], person: "f-office", pose: "bust", face: "L" },

  { id: "m-casual-stand", src: assetUrl("assets/chars/m-casual-stand.png"), kind: "charFull", label: "男·出行·立", tags: ["人物", "男", "立绘", "出行"], person: "m-casual", pose: "stand", face: "L" },
  { id: "m-casual-walk", src: assetUrl("assets/chars/m-casual-walk.png"), kind: "charFull", label: "男·出行·走", tags: ["人物", "男", "立绘", "出行"], person: "m-casual", pose: "walk", face: "L" },
  { id: "m-casual-talk", src: assetUrl("assets/chars/m-casual-talk.png"), kind: "charFull", label: "男·出行·说", tags: ["人物", "男", "立绘", "出行"], person: "m-casual", pose: "talk", face: "L" },
  { id: "f-casual-stand", src: assetUrl("assets/chars/f-casual-stand.png"), kind: "charFull", label: "女·出行·立", tags: ["人物", "女", "立绘", "出行"], person: "f-casual", pose: "stand", face: "L" },
  { id: "f-casual-walk", src: assetUrl("assets/chars/f-casual-walk.png"), kind: "charFull", label: "女·出行·走", tags: ["人物", "女", "立绘", "出行"], person: "f-casual", pose: "walk", face: "L" },
];

export const ASSET_MAP = Object.fromEntries(ASSETS.map((a) => [a.id, a])) as Record<string, Asset>;

export const CATEGORIES = [
  { id: "char", label: "立绘", kinds: ["charFull", "charBust"] },
  { id: "scene", label: "场景", kinds: ["sky", "ground", "buildingFar", "buildingMid", "interior"] },
  { id: "prop", label: "道具", kinds: ["prop"] },
] as const;

export function assetsByCategory(cat: string) {
  const c = CATEGORIES.find((x) => x.id === cat);
  if (!c) return ASSETS;
  return ASSETS.filter((a) => (c.kinds as readonly string[]).includes(a.kind));
}
