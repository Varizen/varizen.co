"""Remove only excess background from supplied Varizen raster assets.
Source geometry and colors are preserved. Run when verified source assets change.
"""
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "brandsystem" / "01_RECOMMENDED_USE"
OUTPUT = ROOT / "public" / "brand"
OUTPUT.mkdir(parents=True, exist_ok=True)


def trim(source: str, destination: str, light: bool) -> Image.Image:
    image = Image.open(SOURCE / source).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    def background(x: int, y: int) -> bool:
        r, g, b, _ = pixels[x, y]
        if light:
            return min(r, g, b) > 210 and max(r, g, b) - min(r, g, b) < 35
        return max(r, g, b) < 15

    seen = bytearray(width * height)
    queue = deque()
    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))
    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if seen[index] or not background(x, y):
            continue
        seen[index] = 1
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        if x:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))
    # Also remove neutral background enclosed by native negative-space contours.
    for y in range(height):
        for x in range(width):
            if background(x, y):
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
    result = image.crop(image.getchannel("A").getbbox())
    result.save(OUTPUT / f"{destination}.png", optimize=True)
    result.save(OUTPUT / f"{destination}.webp", quality=95, method=6)
    print(destination, result.size)
    return result


horizontal = trim("VARIZEN_Primary_Horizontal_Color.png", "varizen-horizontal-color", True)
trim("VARIZEN_Primary_Stacked_Color.png", "varizen-stacked-color", True)
trim("VARIZEN_Reverse_Horizontal_White.png", "varizen-horizontal-white", False)
trim("VARIZEN_Reverse_Stacked_White.png", "varizen-stacked-white", False)

# The native symbol is the first connected cluster before the full wordmark.
alpha = horizontal.getchannel("A")
columns = [alpha.crop((x, 0, x + 1, horizontal.height)).getbbox() is not None for x in range(horizontal.width)]
run = 0
split = 0
for x, occupied in enumerate(columns):
    run = run + 1 if not occupied else 0
    if run > 35 and occupied:
        split = x
        break
if not split:
    raise RuntimeError("Native symbol boundary could not be verified")
mark = horizontal.crop((0, 0, split, horizontal.height))
mark = mark.crop(mark.getchannel("A").getbbox())
side = max(mark.size)
icon = Image.new("RGBA", (side, side), (0, 0, 0, 0))
icon.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
icon.save(OUTPUT / "varizen-symbol.png", optimize=True)
print("varizen-symbol", icon.size)
