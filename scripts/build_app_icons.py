"""Generate Varizen V-symbol favicons / app icons for the Z suite.

Reads ONLY from the brand centre (`brandsystem/01_RECOMMENDED_USE`) — this script
never invents artwork; it only removes the flat backdrop, trims and resizes the
approved exports.

Rules honoured (brandsystem/03_GUIDELINES + LOGO_USAGE_MATRIX):
  - Favicon/app icon = SYMBOL-ONLY V mark on a TRANSPARENT background.
  - Never stretch or squash: every export is square-padded, aspect preserved.
  - Native geometry and the digital-dispersion motif are untouched.
  - Colour mark for light contexts, reverse/white mark for dark contexts.

Outputs land in `brandsystem/04_APP_ASSETS/` (the brand record) and are copied
into each app's public folder by `scripts/install_app_icons.py`.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "brandsystem" / "01_RECOMMENDED_USE"
OUT = ROOT / "brandsystem" / "04_APP_ASSETS"
OUT.mkdir(parents=True, exist_ok=True)

STACKED_COLOR = SRC / "VARIZEN_Primary_Stacked_Color.png"
STACKED_WHITE = SRC / "VARIZEN_Reverse_Stacked_White.png"
HORIZ_COLOR = SRC / "VARIZEN_Primary_Horizontal_Color.png"
HORIZ_WHITE = SRC / "VARIZEN_Reverse_Horizontal_White.png"

WHITE_BG = 235   # anything lighter than this is backdrop on light art
DARK_BG = 20     # anything darker than this is backdrop on reverse art


def to_alpha(path: Path, dark_background: bool) -> Image.Image:
    """Replace a flat backdrop with transparency, then trim to content."""
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            is_bg = (max(r, g, b) <= DARK_BG) if dark_background else (min(r, g, b) >= WHITE_BG)
            if is_bg:
                px[x, y] = (r, g, b, 0)
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im


def split_stacked(path: Path, dark_background: bool):
    """Return (symbol, bands) — the tallest ink band is the V symbol."""
    im = to_alpha(path, dark_background)
    w, h = im.size
    alpha = im.getchannel("A")
    rows = [alpha.crop((0, y, w, y + 1)).getbbox() is not None for y in range(h)]

    bands, start = [], None
    for y in range(h):
        if rows[y]:
            if start is None:
                start = y
        else:
            if start is not None:
                bands.append((start, y))
                start = None
    if start is not None:
        bands.append((start, h))

    bands = [b for b in bands if b[1] - b[0] > h * 0.03]
    if len(bands) < 2:
        raise RuntimeError(f"{path.name}: could not separate symbol from wordmark")

    symbol_band = max(bands, key=lambda b: b[1] - b[0])
    symbol = im.crop((0, symbol_band[0], w, symbol_band[1]))
    symbol = symbol.crop(symbol.getchannel("A").getbbox())
    return symbol, bands


def square(im: Image.Image, size: int, pad_ratio: float = 0.12) -> Image.Image:
    """Center on a transparent square canvas; never distort."""
    inner = max(1, int(size * (1 - pad_ratio * 2)))
    scaled = im.copy()
    scaled.thumbnail((inner, inner), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2), scaled)
    return canvas


def main() -> None:
    symbol_color, color_bands = split_stacked(STACKED_COLOR, dark_background=False)
    symbol_white, white_bands = split_stacked(STACKED_WHITE, dark_background=True)
    print("colour bands:", color_bands)
    print("white  bands:", white_bands)
    print("symbol colour:", symbol_color.size, " white:", symbol_white.size)

    for size in (16, 32, 48, 180, 192, 512):
        square(symbol_color, size).save(OUT / f"varizen-symbol-{size}.png", optimize=True)

    square(symbol_color, 512).save(OUT / "varizen-app-icon-512.png", optimize=True)
    square(symbol_white, 512).save(OUT / "varizen-app-icon-white-512.png", optimize=True)

    square(symbol_color, 256).save(
        OUT / "varizen-app-icon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    square(symbol_color, 64).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for src, name, dark in (
        (HORIZ_COLOR, "varizen-horizontal-color", False),
        (HORIZ_WHITE, "varizen-horizontal-white", True),
    ):
        to_alpha(src, dark).save(OUT / f"{name}.png", optimize=True)

    for src, name, dark in (
        (STACKED_COLOR, "varizen-stacked-color", False),
        (STACKED_WHITE, "varizen-stacked-white", True),
    ):
        to_alpha(src, dark).save(OUT / f"{name}.png", optimize=True)

    print("written to", OUT)


if __name__ == "__main__":
    main()
