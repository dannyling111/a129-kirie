#!/usr/bin/env python3
"""Chroma-key magenta manga assets, trim, pad characters to one aspect, emit PNGs."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/workspace")
SRC = ROOT / "artifacts" / "imagine_images"
OUT = ROOT / "public" / "assets"
QC_DIR = ROOT / "assets" / "raw"

CHAR_ASPECT = 2 / 3


def chroma_key(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA")).astype(np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    is_key = (r > 168) & (g < 92) & ((r - g) > 96) & (b > g + 22)
    new_a = a.copy()
    new_a[is_key] = 0
    soft = (r > 150) & (g < 110) & ((r - g) > 70) & (b > g + 12) & ~is_key
    fade = np.clip(255.0 * (1.0 - ((r - g) - 70.0) / 50.0), 0, 255)
    new_a = np.where(soft, np.minimum(new_a, fade), new_a)
    remain = new_a > 16
    spill = remain & (r > g + 8) & (b > g + 8)
    excess = np.maximum((r + b) / 2.0 - g, 0) * 0.5
    r = np.where(spill, r - excess, r)
    b = np.where(spill, b - excess, b)
    arr[:, :, 0] = np.clip(r, 0, 255)
    arr[:, :, 1] = np.clip(g, 0, 255)
    arr[:, :, 2] = np.clip(b, 0, 255)
    arr[:, :, 3] = np.clip(new_a, 0, 255)
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def trim(im: Image.Image, pad: int = 6) -> Image.Image:
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > 10)
    if xs.size == 0:
        return im
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width - 1, x1 + pad)
    y1 = min(im.height - 1, y1 + pad)
    return im.crop((x0, y0, x1 + 1, y1 + 1))


def pad_to_aspect(im: Image.Image, aspect: float) -> Image.Image:
    w, h = im.size
    if h <= 0 or w <= 0:
        return im
    current = w / h
    if abs(current - aspect) < 0.02:
        return im
    if current < aspect:
        new_w = max(w, int(round(h * aspect)))
        out = Image.new("RGBA", (new_w, h), (0, 0, 0, 0))
        out.paste(im, ((new_w - w) // 2, 0), im)
        return out
    new_h = max(h, int(round(w / aspect)))
    out = Image.new("RGBA", (w, new_h), (0, 0, 0, 0))
    out.paste(im, (0, new_h - h), im)
    return out


def zoom_from_top(im: Image.Image, keep: float, aspect: float) -> Image.Image:
    """Keep the top `keep` fraction, crop sides back to aspect so the face enlarges."""
    if keep >= 0.99:
        return im
    w, h = im.size
    new_h = max(1, int(round(h * keep)))
    cropped = im.crop((0, 0, w, new_h))
    cw, ch = cropped.size
    target_w = max(1, int(round(ch * aspect)))
    if cw > target_w:
        x0 = (cw - target_w) // 2
        return cropped.crop((x0, 0, x0 + target_w, ch))
    return pad_to_aspect(cropped, aspect)


def opaque_stats(im: Image.Image) -> dict:
    a = np.array(im)[:, :, 3]
    mask = a > 12
    ys, xs = np.where(mask)
    if xs.size == 0:
        return {"empty": True}
    w, h = int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)
    return {
        "empty": False,
        "w": im.width,
        "h": im.height,
        "subject_w": w,
        "subject_h": h,
        "aspect": round(w / max(h, 1), 3),
        "coverage": round(float(mask.mean()), 3),
    }


CHAR_KEEP = {
    "chars/m-office-stand.png": 0.90,
    "chars/m-office-walk.png": 0.86,
    "chars/m-office-talk.png": 0.86,
    "chars/m-office-think.png": 0.86,
    "chars/m-office-sit.png": 0.76,
    "chars/m-office-point.png": 0.86,
    "chars/m-casual-stand.png": 0.86,
    "chars/m-casual-walk.png": 0.86,
    "chars/m-casual-talk.png": 0.86,
    "chars/f-casual-stand.png": 0.92,
    "chars/f-casual-walk.png": 0.90,
    "chars/f-office-walk.png": 0.92,
    "chars/f-office-sit.png": 0.90,
}

MANIFEST = [
    ("sky", "skies/dawn.jpg", "7790aaa0-cf4f-4b71-af71-9ab50b31a9d2.jpg", False),
    ("sky", "skies/noon.jpg", "237e792f-746d-4aeb-ba84-714d73e9becd.jpg", False),
    ("sky", "skies/dusk.jpg", "1e2e4887-47f5-4157-b0e4-3abc99e52446.jpg", False),
    ("sky", "skies/night.jpg", "e591523f-a736-4199-a782-7725b74d536b.jpg", False),
    ("sky", "skies/rain.jpg", "b9398f58-3782-451e-a1d0-86f635ec1d3b.jpg", False),
    ("char", "chars/m-office-stand.png", "48ee1d9b-3e56-4436-8551-8962ec2d8510.jpg", True),
    ("char", "chars/m-office-walk.png", "17e613f0-993b-40c6-b7ca-7f9a6dbbdcbd.jpg", True),
    ("char", "chars/m-office-talk.png", "50032a1d-6a79-4448-83f5-076f1d033d69.jpg", True),
    ("char", "chars/m-office-think.png", "3a86983b-a66f-40cf-a8f3-e7032b145504.jpg", True),
    ("char", "chars/m-office-sit.png", "9cfa6e48-afe7-4a9e-97f2-9e545c123083.jpg", True),
    ("char", "chars/m-office-point.png", "22e21ef1-6720-4d82-880f-fdc052b827f3.jpg", True),
    ("char", "chars/m-office-bust.png", "989e7117-78f3-4ea4-a19a-97df8aae7c51.jpg", True),
    ("char", "chars/f-office-stand.png", "96cadcd2-8528-4376-822e-5ae12bdd1aea.jpg", True),
    ("char", "chars/f-office-walk.png", "90d76f93-2027-4c5f-9ff8-22c6d8fc7651.jpg", True),
    ("char", "chars/f-office-talk.png", "131b99f5-0020-4efd-9b48-04ee70f4ecfd.jpg", True),
    ("char", "chars/f-office-sit.png", "d92f3fc1-8e7e-448e-976a-f9f3645039b5.jpg", True),
    ("char", "chars/f-office-bust.png", "73667611-b507-4dfa-8174-34a7dcd65cbe.jpg", True),
    ("char", "chars/m-casual-stand.png", "625502ca-c2da-402f-853d-c1d792720a9c.jpg", True),
    ("char", "chars/m-casual-walk.png", "9e9450b4-dcbb-418a-bed7-c28f1a4e0849.jpg", True),
    ("char", "chars/m-casual-talk.png", "06df2905-dc2f-4f85-b3f7-941e1fb26175.jpg", True),
    ("char", "chars/f-casual-stand.png", "be033495-3e42-4390-8293-031eaf7ed002.jpg", True),
    ("char", "chars/f-casual-walk.png", "07cdd62d-bad8-41ee-83c4-8d94be184cc3.jpg", True),
    ("bldg", "buildings/office.png", "3f9ec51a-df5f-4eb4-a53d-f52b0ed5c788.jpg", True),
    ("bldg", "buildings/apt.png", "e01c432e-006e-455d-a238-2f151a6bf5a6.jpg", True),
    ("bldg", "buildings/shop.png", "3cfba49e-3bc1-48dd-9995-8b89aa4f546d.jpg", True),
    ("bldg", "buildings/tower.png", "c36cc413-2c6b-4c3f-a417-6aa3ca0da620.jpg", True),
    ("bldg", "buildings/skyline.png", "c12bf60c-04b0-4387-8ac1-c168f01198c5.jpg", True),
    ("ground", "grounds/street.png", "484c368f-d40f-4b33-a8c1-520dad165cf0.jpg", False),
    ("ground", "grounds/wet.png", "8215cbbe-261f-4999-b0b2-a7faaad4f383.jpg", False),
    ("ground", "grounds/roof.png", "53b88ff8-afe9-4922-8926-505705c03e8a.jpg", False),
    ("interior", "interiors/konbini.png", "e05d237f-3e75-41db-acc5-9549668e02c5.jpg", False),
    ("interior", "interiors/cafe.png", "a0147ee4-64c1-4958-96d8-6f76a1c43dcf.jpg", False),
    ("interior", "interiors/office.png", "1a0db073-0158-448c-a088-76b2f891c49f.jpg", False),
    ("interior", "interiors/subway.png", "ba72e59d-a4da-4ead-86d4-e6958342dff5.jpg", False),
    ("prop", "props/lamp.png", "e79f36ba-792b-4f2c-aac7-1fd0a5019a70.jpg", True),
    ("prop", "props/tree.png", "47fef17b-c1a8-4230-9127-54abfbbc567a.jpg", True),
    ("prop", "props/car.png", "f1f8f358-7e23-4563-9d67-b41bed3c36e4.jpg", True),
    ("prop", "props/bench.png", "10452bc1-08fc-4919-b9d2-f6ff9e5b0ff2.jpg", True),
    ("prop", "props/vending.png", "3061c914-c396-4cbd-b122-4fe7e4949a24.jpg", True),
    ("prop", "props/umbrella.png", "6eaca403-4435-41d1-a9a9-72da85a906f5.jpg", True),
    ("prop", "props/signal.png", "65692648-4173-47ff-891e-34ea05f8b313.jpg", True),
    ("prop", "props/bike.png", "47fc75d9-8d51-48a8-9c07-6d523e71e8d7.jpg", True),
    ("prop", "props/scooter.png", "f13b91a5-b685-4772-8e82-12f5cfbbc4a4.jpg", True),
]


def make_grain() -> None:
    rng = np.random.default_rng(7)
    n = rng.integers(0, 55, (512, 512), dtype=np.uint8)
    alpha = (rng.integers(8, 40, (512, 512))).astype(np.uint8)
    rgba = np.dstack([n, n, n, alpha])
    Image.fromarray(rgba, "RGBA").save(OUT / "ui" / "grain.png", "PNG")


def main() -> None:
    QC_DIR.mkdir(parents=True, exist_ok=True)
    report = []
    for kind, dest, src_name, key in MANIFEST:
        src = SRC / src_name
        out = OUT / dest
        out.parent.mkdir(parents=True, exist_ok=True)
        if not src.exists():
            report.append({"dest": dest, "ok": False, "error": "missing source"})
            print(f"MISSING {src_name} -> {dest}")
            continue
        im = Image.open(src)
        if key:
            im = chroma_key(im)
            im = trim(im, pad=8 if kind in {"char", "prop", "bldg"} else 2)
            if kind == "char":
                im = pad_to_aspect(im, CHAR_ASPECT)
                keep = CHAR_KEEP.get(dest, 1.0)
                if keep < 0.99:
                    im = zoom_from_top(im, keep, CHAR_ASPECT)
                    im = pad_to_aspect(im, CHAR_ASPECT)
            im.save(out, "PNG")
        elif dest.endswith(".png"):
            im.convert("RGB").save(out, "PNG")
        else:
            im.convert("RGB").save(out, "JPEG", quality=90)
        stats = opaque_stats(
            Image.open(out).convert("RGBA") if dest.endswith(".png") else im.convert("RGBA")
        )
        ok = not stats.get("empty") and stats.get("coverage", 1) > 0.02
        report.append({"dest": dest, "kind": kind, "ok": ok, **stats})
        print(f"{'OK' if ok else 'FAIL':4} {dest:36} {stats}")
    make_grain()
    (QC_DIR / "qc-report.json").write_text(json.dumps(report, indent=2))
    fails = [r for r in report if not r.get("ok")]
    print(f"\n{len(report) - len(fails)}/{len(report)} passed, grain written")


if __name__ == "__main__":
    main()
