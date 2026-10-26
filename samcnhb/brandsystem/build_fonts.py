"""Fetch open Bangla font previews and licenses from the official Google Fonts repository."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import quote
import json

ROOT = Path(__file__).resolve().parent / "fontsystem" / "fonts"
FONTS = {
    "hind-siliguri": ("hindsiliguri", ["HindSiliguri-Regular.ttf", "HindSiliguri-Medium.ttf", "HindSiliguri-SemiBold.ttf", "HindSiliguri-Bold.ttf"]),
    "noto-sans-bengali": ("notosansbengali", ["NotoSansBengali[wdth,wght].ttf"]),
    "noto-serif-bengali": ("notoserifbengali", ["NotoSerifBengali[wdth,wght].ttf"]),
    "anek-bangla": ("anekbangla", ["AnekBangla[wdth,wght].ttf"]),
    "tiro-bangla": ("tirobangla", ["TiroBangla-Regular.ttf"]),
    "baloo-da-2": ("balooda2", ["BalooDa2[wght].ttf"]),
}


def main():
    registry = []
    for slug, (folder, files) in FONTS.items():
        target = ROOT / slug
        target.mkdir(parents=True, exist_ok=True)
        for name in ["OFL.txt", *files]:
            url = f"https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/{quote(name)}"
            try:
                data = urlopen(url, timeout=45).read()
                (target / name).write_bytes(data)
                print("OK", slug, name)
            except Exception as error:
                print("UNAVAILABLE", url, error)
        registry.append({"family": slug, "source": f"https://github.com/google/fonts/tree/main/ofl/{folder}", "license": "SIL Open Font License 1.1", "files": files})
    (ROOT / "registry.json").write_text(json.dumps({"source": "Official google/fonts repository", "families": registry}, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
