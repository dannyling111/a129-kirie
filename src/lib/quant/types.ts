import type { AssetKind, FaceDir, PlaneId } from "./engine";

export type Asset = {
  id: string;
  src: string;
  kind: AssetKind;
  label: string;
  tags: string[];
  canon?: { w: number; h: number };
  defaultOffsetYQ?: number;
  person?: "m-office" | "f-office" | "m-casual" | "f-casual";
  pose?: string;
  /** Native looking direction of the raw sprite, viewer-relative. */
  face?: FaceDir;
};

export type Bubble = {
  id: string;
  text: string;
  xQ: number;
  yQ: number;
  tail: "bl" | "br" | "tl" | "tr" | "none";
  wQ?: number;
};

export type Layer = {
  id: string;
  assetId: string;
  plane: PlaneId;
  xQ: number;
  yQ?: number;
  offsetYQ?: number;
  flip?: boolean;
  opacity?: number;
};

export type Panel = {
  id: string;
  caption?: string;
  rain?: boolean;
  layers: Layer[];
  bubbles: Bubble[];
};

export type Comic = {
  id: string;
  title: string;
  subtitle: string;
  hour: string;
  template: boolean;
  panels: Panel[];
};
