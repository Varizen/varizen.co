"""Apply the supplied triple-panel references to the three proposal documents.
Keeps distinct concept marks and strategy while updating palette/type direction.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
MODELS = [
    {
        "file": "proposal-01-southern-standard.html", "number": "01",
        "old": "The Southern Standard", "new": "Blue Professional / Institutional Care",
        "nav": "proposal-02-one-campus.html", "next": "02 — Green Wellness",
        "palette": "blue", "heading": "Blue Professional. <span>Institutional care.</span>",
        "eyebrow": "Trust · Care · Academic Excellence",
        "palette_heading": "Professional blue. Precise accents.",
        "font": "Muller + Hind Siliguri",
        "font_rule": "Muller is the preferred commercial English candidate (license required); Source Sans 3/Arial is the open fallback. Hind Siliguri drives Bangla UI; Noto Serif Bengali supports academic documents.",
        "description": "A professional, reliable and clean medical-education identity for institutional trust, academic excellence and compassionate clinical service.",
        "colors": [("Primary Blue", "#0B6FA4"), ("Light Blue", "#E6F2FF"), ("Accent Cyan", "#00B4DB"), ("Deep Blue", "#005A8C"), ("Red (logo reference)", "#E21E2B"), ("Warm Orange", "#F59E0B"), ("Charcoal", "#1A1A1A"), ("Slate", "#475569"), ("Light Gray", "#E5E7EB"), ("Surface", "#F8FAFC")],
        "overrides": "--primary:#005A8C;--accent:#0B6FA4;--ink:#1A1A1A;--muted:#475569;--line:#E5E7EB;--paper:#fff;--note:#E6F2FF;--on-primary:#fff;--display:'Muller',Arial,sans-serif;--body:Arial,sans-serif;--bangla:'Hind Siliguri','Noto Sans Bengali',sans-serif;--radius:8px;--pattern:none",
    },
    {
        "file": "proposal-02-one-campus.html", "number": "02",
        "old": "One Campus, Two Missions", "new": "Green Wellness / One Campus",
        "nav": "proposal-03-barishal-green.html", "next": "03 — Purple Innovation",
        "palette": "green", "heading": "Green Wellness. <span>One connected campus.</span>",
        "eyebrow": "Growth · Wellbeing · Community Health",
        "palette_heading": "Wellness green. Human warmth.",
        "font": "Panton + Hind Siliguri",
        "font_rule": "Panton is the preferred commercial English candidate (license required); Source Sans 3/Arial is the open fallback. Hind Siliguri is the UI family; Noto Sans Bengali supports dense information; Baloo Da 2 is restricted to warm campaign headlines.",
        "description": "A fresh, balanced identity where medical learning, patient care and community wellbeing grow together on one green campus.",
        "colors": [("Primary Green", "#16A34A"), ("Light Green", "#DCFCE7"), ("Teal", "#0EA5A4"), ("Lime", "#84CC16"), ("Warm Yellow", "#FBBF24"), ("Coral Orange", "#FB923C"), ("Charcoal", "#1F2937"), ("Slate", "#475569"), ("Light Gray", "#E5E7EB"), ("Surface", "#F9FAFB")],
        "overrides": "--primary:#0E7736;--accent:#0E7736;--ink:#1F2937;--muted:#475569;--line:#E5E7EB;--paper:#fff;--note:#DCFCE7;--on-primary:#fff;--display:'Panton',Arial,sans-serif;--body:Arial,sans-serif;--bangla:'Hind Siliguri','Noto Sans Bengali',sans-serif;--radius:14px;--pattern:radial-gradient(circle at 10px 10px,#0EA5A420 2px,transparent 2.5px);background-size:28px 28px",
    },
    {
        "file": "proposal-03-barishal-green.html", "number": "03",
        "old": "Barishal Green", "new": "Purple Innovation / Future-Ready Learning",
        "nav": "proposal-01-southern-standard.html", "next": "01 — Blue Professional",
        "palette": "purple", "heading": "Purple Innovation. <span>Future-ready learning.</span>",
        "eyebrow": "Innovation · Technology · Global Impact",
        "palette_heading": "Knowledge purple. Purposeful innovation.",
        "font": "Nexa Pro + Anek Bangla",
        "font_rule": "Nexa Pro is the preferred commercial English candidate (license required); Source Sans 3/Arial is the open fallback. Anek Bangla is reserved for campaign/display headings; Noto Sans Bengali handles UI and longer reading.",
        "description": "A modern, distinctive identity for medical knowledge, responsible technology and a global outlook grounded in compassionate care and Barishal's communities.",
        "colors": [("Primary Purple", "#7C3AED"), ("Light Purple", "#F3E8FF"), ("Indigo", "#6366F1"), ("Accent Pink", "#EC4899"), ("Warm Orange", "#F97316"), ("Teal", "#14B8A6"), ("Charcoal", "#0F172A"), ("Slate", "#475569"), ("Light Gray", "#E5E7EB"), ("Surface", "#FAFAFF")],
        "overrides": "--primary:#7C3AED;--accent:#7C3AED;--ink:#0F172A;--muted:#475569;--line:#E5E7EB;--paper:#fff;--note:#F3E8FF;--on-primary:#fff;--display:'Nexa Pro',Arial,sans-serif;--body:Arial,sans-serif;--bangla:'Anek Bangla','Noto Sans Bengali',sans-serif;--radius:16px;--pattern:linear-gradient(135deg,#7C3AED10 1px,transparent 1px);background-size:24px 24px",
    },
]


def palette_html(model):
    swatches = "".join(f'<div class="swatch"><div class="swatch-color" style="background:{hexv}"></div><div class="swatch-info"><strong>{name}</strong><code>{hexv}</code><br>Reference palette token</div></div>' for name, hexv in model["colors"])
    primary, light = model["colors"][0][1], model["colors"][1][1]
    charcoal = next(x[1] for x in model["colors"] if x[0] == "Charcoal")
    return f'''<section id="palette"><div class="eyebrow">03 / Supplied color system</div><h2>{model["palette_heading"]}</h2><p>Exact source tokens transcribed from the supplied triple-panel color reference. This is <b>{model["new"].split(" /")[0]}</b>, not a palette to mix with the other models. <a href="colors.html">Open complete color library and semantic rules</a>.</p><div class="swatches">{swatches}</div><div class="grid two" style="margin-top:22px"><div class="card"><h3>Semantic use</h3><p><b>Primary:</b> main actions/navigation. <b>Light:</b> cards and secondary surfaces. <b>Info:</b> model accent, always with a text label. <b>Success/warning/error:</b> shared accessible semantic tokens, never color alone. Slate is readable secondary text; light gray is a border, not small text.</p></div><div class="card"><h3>Contrast and production</h3><p>Primary on white: <span data-contrast="{primary},#ffffff"></span>. Charcoal on light: <span data-contrast="{charcoal},{light}"></span>. Where primary is too light for normal white text, use the documented darker action token. Print, fabric and signage require vendor-specific proofs; no unverified Pantone equivalence.</p></div></div><p class="small">The reference logo's red is not automatically an action or error color. Do not use it until the crest and name are authorized. Source: supplied triple-panel PNG; inspect source artwork before production.</p></section>'''


def main():
    for model in MODELS:
        path = ROOT / model["file"]
        text = path.read_text(encoding="utf-8")
        if 'id="palette"' in text:
            print("Already updated", path.name)
            continue
        text = text.replace(model["old"], model["new"])
        text = re.sub(r"<title>.*?</title>", f'<title>{model["number"]} · {model["new"]} | SAMC</title>', text)
        text = text.replace('<link rel="stylesheet" href="assets/system.css">', '<link rel="stylesheet" href="assets/system.css"><link rel="stylesheet" href="colorsystem/palettes.css"><link rel="stylesheet" href="fontsystem/fonts.css">')
        text = re.sub(r":root\{.*?\}", ":root{" + model["overrides"] + "}", text, count=1)
        text = text.replace('</style></head><body>', '</style></head><body data-palette="' + model["palette"] + '">')
        text = re.sub(r'<div class="eyebrow">[^<]+</div><h1>.*?</h1><p>.*?</p>', f'<div class="eyebrow">{model["eyebrow"]}</div><h1>{model["heading"]}</h1><p>{model["description"]}</p>', text, count=1)
        text = re.sub(r'<span class="proposal-number">MODEL \d+ / [^<]+</span>', f'<span class="proposal-number">MODEL {model["number"]} / {model["new"].upper()}</span>', text)
        start = text.index('<section><div class="eyebrow">03 / Color & type</div>')
        end = text.index('<section><div class="eyebrow">04 / Graphic & editorial language</div>', start)
        type_html = f'''<section id="typography"><div class="eyebrow">03B / Bilingual typography</div><h2>{model["font"]}</h2><p class="lead">{model["font_rule"]}</p><div class="grid two"><div class="card"><h3>English candidate and fallback</h3><div class="type-sample">Medical · Health · Science</div><p>Commercial candidate is shown by name only; without its licensed font installed, this browser displays the fallback. No unlicensed English font binary is bundled. Confirm font metrics and actual license before production.</p></div><div class="card"><h3>Bangla system / বাংলা</h3><div class="type-sample bn">নিরাপদ চিকিৎসা · মানবিক সেবা</div><p class="bn">শিরোনাম ও তথ্যব্যবস্থায় নির্বাচিত বাংলা ফন্ট ব্যবহার করুন। স্থানীয় OFL ফন্ট এবং লাইসেন্স এই প্যাকেজে অন্তর্ভুক্ত আছে। নাম, তারিখ, সংখ্যা ও প্রযুক্তিগত পরিভাষা দ্বিভাষিক সম্পাদকের পর্যালোচনা প্রয়োজন।</p></div></div><table class="specs"><tr><th>Digital scale</th><td>Display 48–72px / H1 38–40px / H2 30px / H3 21–22px / Body 16–18px / Labels 14–16px. English body line height 1.55–1.7; Bangla 1.8–1.95.</td></tr><tr><th>Weights</th><td>400 body / 500 labels / 600 headings / 700 emphasis / 800 limited display. Use only actually available licensed weights; never thin patient information.</td></tr><tr><th>Grid and accessibility</th><td>8px spacing, 12-column desktop and 4-column mobile; 65–80 Latin characters per line; native Bangla readability testing; text never depends on color alone.</td></tr><tr><th>Library</th><td><a href="fonts.html">Full English/Bangla candidate catalog, licensed local previews and pairing rules</a>.</td></tr></table></section>'''
        text = text[:start] + palette_html(model) + type_html + text[end:]
        text = text.replace('<a href="research.html">Research</a>', '<a href="research.html">Research</a><a href="colors.html">Colors</a><a href="fonts.html">Fonts</a>')
        text = re.sub(r'<a class="button secondary" href="[^"]+">Compare model \d+ →</a>', f'<a class="button secondary" href="{model["nav"]}">Compare {model["next"]} →</a>', text)
        path.write_text(text, encoding="utf-8")
        print("Updated", path.name)


if __name__ == "__main__":
    main()
