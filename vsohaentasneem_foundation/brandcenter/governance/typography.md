# Typography

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18
**Upstream:** `STFL_VI_TYPOGRAPHY_SYSTEM.md` v2.0.0

---

## 1. Master matrix

| Context | Primary | Fallbacks | Weights | Line height | Tracking |
|---|---|---|---|---|---|
| BN heading (H1–H3) | Hind Siliguri | SolaimanLipi, Noto Sans Bengali, sans-serif | 600, 700 | 1.25–1.4 | -0.01em |
| BN subheading (H4–H6) | Hind Siliguri | SolaimanLipi, Noto Sans Bengali | 500, 600 | 1.4–1.5 | normal |
| BN body (long-form) | Noto Sans Bengali | Baloo Da 2, SolaimanLipi | 400, 500 | 1.7–1.8 | +0.01em |
| BN UI | Noto Sans Bengali / Baloo Da 2 | SolaimanLipi, system-ui | 500, 600 | 1.5 | normal |
| BN form inputs | Noto Sans Bengali | SolaimanLipi | 400, 500 | 1.5 | normal |
| BN data tables | Noto Sans Bengali | Baloo Da 2 | 400, 600 | 1.4 | tabular-nums |
| BN official documents | Noto Sans Bengali (body) / Hind Siliguri (title) | SolaimanLipi, Vrinda, Kalpurush | 400, 600, 700 | 1.6–1.75 | normal |
| EN heading | Inter | system-ui, -apple-system | 600, 700, 800 | 1.15–1.3 | -0.02em |
| EN body and UI | Inter | -apple-system, BlinkMacSystemFont | 400, 500 | 1.5–1.65 | normal |
| Monospace | JetBrains Mono | Consolas, Menlo | 400, 500, 700 | 1.5 | normal |

---

## 2. Immutable rules

1. **Hind Siliguri is immutable** for all Bengali headers, section headers, subheaders and major banners.
2. **No uncontrolled mixing.** Heading display is strictly separated from body reading flow.
3. **Offline resilience.** Critical fonts are self-hosted in `public/fonts/` and Android `core/res/font/`.
4. **OpenType features stay on.** Never disable `liga` or `clig`.

---

## 3. Font assets

| Family | Storage | Bundling |
|---|---|---|
| Hind Siliguri | `stflbd.org/public/fonts/`, `main/web/public/fonts/`, `main/core/src/main/res/font/`, `main/assets/branding/fonts/` | 100% bundled local |
| Noto Sans Bengali | Next.js build cache + Google CDN | Build self-hosted |
| Baloo Da 2 | `public/fonts/` + Google Fonts CSS2 | Hybrid |
| Inter | Next.js build cache, `main/core/src/main/res/font/inter_variable.ttf` | Build self-hosted |
| JetBrains Mono | CSS import / monospace fallback | Build self-hosted |

Canonical copies: [`../assets/digital/fonts/`](../assets/digital/fonts/).

---

## 4. Bengali rendering integrity

Conjuncts (যুক্তবর্ণ) must render correctly. Test set:

| Conjunct | Example |
|---|---|
| স্থ | সোহেলতাসনীম |
| ন্ট | অ্যাকাউন্ট |
| ন্ধ | গবেষণা |
| ক্ষ | প্রাতিষ্ঠানিক |
| জ্ঞ | বিজ্ঞান |
| ত্র | চরিত্র |

Diacritics — hasant (্), ref (র্), japhala (্য) — must maintain vertical spacing without overlapping ascenders.

---

## 5. CSS tokens

```css
--font-bn-header: 'Hind Siliguri', 'SolaimanLipi', 'Kalpurush', 'Noto Sans Bengali', sans-serif;
--font-bn-body:   'Baloo Da 2', 'Noto Sans Bengali', 'SolaimanLipi', 'Vrinda', sans-serif;
--font-en-header: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-en-body:   'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono:      'JetBrains Mono', 'Courier New', monospace;

--bn-line-height-header: 1.6;
--bn-line-height-body:   1.75;
--en-line-height-header: 1.3;
--en-line-height-body:   1.5;
```

Source: `stflbd.org/stfl-brand-tokens.css`.

---

## 6. Prohibited

| Prohibited | Reason |
|---|---|
| Substituting a font for Hind Siliguri in BN headings | Violates the immutable rule |
| Disabling OpenType ligatures | Breaks conjunct rendering |
| Using a web font not in this matrix | Unapproved |
| Setting BN body below 1.7 line height | Fails readability |
| Using all-caps for Bangla | Bangla has no case; it renders as a no-op or breaks shaping |

---

## 7. Related

- [`localization.md`](./localization.md)
- [`accessibility.md`](./accessibility.md)
- [`../../portfolio/TECHNOLOGY_REGISTRY.md`](../../portfolio/TECHNOLOGY_REGISTRY.md)