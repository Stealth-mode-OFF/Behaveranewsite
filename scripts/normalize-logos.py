#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Tuple
from PIL import Image

RAW_DIR = Path("src/assets/logos/raw")
OUT_DIR = Path("src/assets/logos/normalized")
TARGET_HEIGHT = 40
TOLERANCE = 18
EDGE_RATIO = 0.85


def _avg_color(pixels) -> Tuple[int, int, int]:
    if not pixels:
        return (255, 255, 255)
    r = sum(p[0] for p in pixels) // len(pixels)
    g = sum(p[1] for p in pixels) // len(pixels)
    b = sum(p[2] for p in pixels) // len(pixels)
    return (r, g, b)


def _close(c1, c2, tol: int) -> bool:
    return (
        abs(c1[0] - c2[0]) <= tol
        and abs(c1[1] - c2[1]) <= tol
        and abs(c1[2] - c2[2]) <= tol
    )


def _edge_pixels(img: Image.Image):
    w, h = img.size
    pixels = img.load()
    edge = []
    for x in range(w):
        edge.append(pixels[x, 0])
        edge.append(pixels[x, h - 1])
    for y in range(h):
        edge.append(pixels[0, y])
        edge.append(pixels[w - 1, y])
    return edge


def _remove_uniform_bg(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()
    corners = [pixels[0, 0], pixels[w - 1, 0], pixels[0, h - 1], pixels[w - 1, h - 1]]
    transparent_corners = sum(1 for p in corners if p[3] <= 10)
    if transparent_corners >= 3:
        return img

    bg = _avg_color([p[:3] for p in corners])

    edges = _edge_pixels(img)
    matches = sum(1 for p in edges if _close(p[:3], bg, TOLERANCE))
    if edges and (matches / len(edges)) < EDGE_RATIO:
        return img

    data = img.getdata()
    new_data = []
    for p in data:
        if p[3] > 10 and _close(p[:3], bg, TOLERANCE):
            new_data.append((p[0], p[1], p[2], 0))
        else:
            new_data.append(p)
    img.putdata(new_data)
    return img


def _trim_transparent(img: Image.Image) -> Image.Image:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def normalize_logo(path: Path, out_dir: Path) -> Path:
    img = Image.open(path).convert("RGBA")
    img = _remove_uniform_bg(img)
    img = _trim_transparent(img)

    w, h = img.size
    if h == 0:
        raise ValueError(f"Invalid image height for {path}")

    scale = TARGET_HEIGHT / float(h)
    new_w = max(1, int(round(w * scale)))
    img = img.resize((new_w, TARGET_HEIGHT), Image.LANCZOS)

    out_path = out_dir / (path.stem.lower().replace(" ", "-") + ".png")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    return out_path


def main() -> None:
    if not RAW_DIR.exists():
        raise SystemExit(f"Missing {RAW_DIR}")

    files = [p for p in RAW_DIR.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"}]
    if not files:
        raise SystemExit(f"No images found in {RAW_DIR}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for path in sorted(files):
        out_path = normalize_logo(path, OUT_DIR)
        print(f"{path.name} -> {out_path}")


if __name__ == "__main__":
    main()
