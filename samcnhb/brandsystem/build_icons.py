"""Download one consistent CC0 outline family and build an offline SVG sprite."""
from pathlib import Path
from urllib.request import urlopen
from xml.etree import ElementTree as ET
import json

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "icons"
ICONS = {
    "departments": ("places/hospital", "Hospital"),
    "learning": ("people/i-training_class", "Training"),
    "community": ("people/health-worker", "Health worker"),
    "care": ("symbols/health", "Health"),
    "approved": ("symbols/i-documents_accepted", "Approved document"),
    "calendar": ("objects/calendar", "Calendar"),
    "emergency": ("vehicles/ambulance", "Ambulance"),
    "accessibility": ("symbols/ui-accessibility", "Accessibility"),
    "phone": ("symbols/ui-call", "Call"),
    "research": ("devices/microscope", "Microscope"),
    "forest": ("places/forest", "Forest"),
    "admissions": ("specialties/admissions", "Admissions"),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    symbols, manifest = [], []
    for name, (path, title) in ICONS.items():
        url = f"https://healthicons.org/icons/svg/outline/{path}.svg"
        try:
            raw = urlopen(url, timeout=30).read()
            root = ET.fromstring(raw)
            if root.attrib.get("viewBox") != "0 0 48 48":
                raise ValueError("Unexpected grid")
            (OUT / f"{name}.svg").write_bytes(raw)
            content = "".join(ET.tostring(child, encoding="unicode") for child in root)
            symbols.append(f'<symbol id="hi-{name}" viewBox="0 0 48 48"><title>{title}</title>{content}</symbol>')
            manifest.append({"id": f"hi-{name}", "name": title, "source": url, "license": "CC0-1.0", "local": f"assets/icons/{name}.svg"})
            print("OK", name)
        except Exception as error:
            print("UNAVAILABLE", name, error)
    (ROOT / "assets/icons.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' + "".join(symbols) + "</svg>", encoding="utf-8")
    (OUT / "registry.json").write_text(json.dumps({"family": "Health Icons outline", "style": "outline only, no filled or 24px variants", "license": "https://creativecommons.org/publicdomain/zero/1.0/", "icons": manifest}, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
