"""Install Varizen brand assets into every Z app + AiBrowser.

Source of truth is `brandsystem/04_APP_ASSETS/` (generated from the approved
brand exports). This script only COPIES into each app; it never generates art.

Per-app layout:
  <app>/public/brand/varizen-symbol-<n>.png, favicon.ico, varizen-horizontal-*.png
  <app>/public/favicon.ico                      (root, so /favicon.ico resolves)

AiBrowser uses the Electron app icon:
  browser/build/icon.png + icon.ico  (electron-builder reads `build/icon.*`)
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "brandsystem" / "04_APP_ASSETS"

WEB_APPS = ["zcal", "zmail", "zmeet", "ztalk"]
ICON_FILES = [
    "varizen-symbol-16.png",
    "varizen-symbol-32.png",
    "varizen-symbol-48.png",
    "varizen-symbol-180.png",
    "varizen-symbol-192.png",
    "varizen-symbol-512.png",
    "varizen-horizontal-color.png",
    "varizen-horizontal-white.png",
]
WORDMARK_FILES = ["varizen-stacked-color.png", "varizen-stacked-white.png"]


def install_web_app(app: str) -> int:
    dest = ROOT / app / "public" / "brand"
    dest.mkdir(parents=True, exist_ok=True)
    count = 0
    for name in ICON_FILES + WORDMARK_FILES:
        src = SRC / name
        if not src.exists():
            raise FileNotFoundError(src)
        shutil.copy2(src, dest / name)
        count += 1
    # Root favicon so browsers/Electron resolve /favicon.ico without a <link>
    shutil.copy2(SRC / "favicon.ico", ROOT / app / "public" / "favicon.ico")
    count += 1
    return count


def install_electron() -> int:
    build = ROOT / "browser" / "build"
    build.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SRC / "varizen-app-icon-512.png", build / "icon.png")
    shutil.copy2(SRC / "varizen-app-icon.ico", build / "icon.ico")
    # Also expose inside the renderer UI so the in-app brand mark can use it
    ui_assets = ROOT / "browser" / "src" / "ui" / "assets"
    ui_assets.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SRC / "varizen-app-icon-white-512.png", ui_assets / "varizen-symbol-white.png")
    shutil.copy2(SRC / "varizen-symbol-512.png", ui_assets / "varizen-symbol.png")
    return 4


def main() -> None:
    if not SRC.exists():
        raise SystemExit("Run scripts/build_app_icons.py first")
    total = 0
    for app in WEB_APPS:
        n = install_web_app(app)
        total += n
        print(f"{app}: {n} assets -> {app}/public/brand/")
    n = install_electron()
    total += n
    print(f"browser: {n} assets -> browser/build/ + browser/src/ui/assets/")
    print(f"total copied: {total}")


if __name__ == "__main__":
    main()
