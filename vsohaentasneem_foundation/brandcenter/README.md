# STFL Brand Center

**The single authority for STFL identity, brand governance and reusable creative assets.**

SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)

---

## What this is

The Brand Center holds the canonical record of every STFL brand asset and every rule that governs its use. It is the answer to *"what is our logo, which variant, which colour, which font, and who approved it?"*

## What this is not

It is **not** a replacement for production asset paths. Every asset here is also served from a production folder. The Brand Center holds the canonical copy; production keeps serving from its own path. See [`../portfolio/DEPENDENCY_MAP.md`](../portfolio/DEPENDENCY_MAP.md).

---

## Structure

```
brandcenter/
├── README.md                    This file
├── BRANDCENTER_MASTER.md        Master index
├── BRAND_GOVERNANCE_INDEX.md    Governance document index
├── governance/                  The rules
├── identity/                    Logos, marks, wordmarks, favicon
├── assets/                      Vector, raster, print, digital, social, presentation, signage, merchandise
├── templates/                   Letterhead, presentations, social, reports, certificates, documents
├── campaigns/                   Campaign-specific creative
├── publications/                Published material
├── website/                     Web-specific brand artefacts
├── app/                         App-specific brand artefacts
├── media/                       Photography and video
├── exports/                     Export-ready files
├── drafts/                      Work in progress
├── archive/                     Deprecated and superseded assets
└── registry/                    Machine-readable asset registry
```

---

## Governance documents

| Document | Scope |
|---|---|
| [`governance/brand-governance.md`](./governance/brand-governance.md) | Master brand rules and authority |
| [`governance/naming.md`](./governance/naming.md) | Institutional and project naming |
| [`governance/logo-governance.md`](./governance/logo-governance.md) | Logo variants, clear space, misuse |
| [`governance/typography.md`](./governance/typography.md) | Bilingual type system |
| [`governance/color-system.md`](./governance/color-system.md) | Palette and tokens |
| [`governance/imagery.md`](./governance/imagery.md) | Photography and illustration |
| [`governance/iconography.md`](./governance/iconography.md) | Iconoir-only policy |
| [`governance/accessibility.md`](./governance/accessibility.md) | Contrast, motion, focus |
| [`governance/localization.md`](./governance/localization.md) | Bangla / English rules |
| [`governance/approval-workflow.md`](./governance/approval-workflow.md) | How an asset gets approved |

---

## Identity assets

| Category | Location | Count |
|---|---|---|
| Master logo | [`identity/master-logo/`](./identity/master-logo/) | 3 |
| Monochrome marks | [`identity/monochrome/`](./identity/monochrome/) | 2 |
| Symbol | [`identity/symbol/`](./identity/symbol/) | 1 |
| Wordmarks | [`identity/horizontal/`](./identity/horizontal/) | 3 |
| Favicon | [`identity/favicon/`](./identity/favicon/) | 1 |

## Project logos

| Category | Location | Count |
|---|---|---|
| Vector | [`assets/vector/`](./assets/vector/) | 11 |
| Raster | [`assets/raster/`](./assets/raster/) | 1 |

## Photography and artwork

| Category | Location | Count |
|---|---|---|
| Photography | [`assets/raster/`](./assets/raster/) | 6 |
| Hero artwork | [`assets/digital/`](./assets/digital/) | 1 |

## Typography

| Category | Location | Count |
|---|---|---|
| Fonts | [`assets/digital/fonts/`](./assets/digital/fonts/) | 6 |

## Templates

| Category | Location | Count |
|---|---|---|
| Document templates | [`templates/documents/`](./templates/documents/) | 14 |

---

## Registry

[`registry/assets.json`](./registry/assets.json) — schema `stfl-portfolio-assets-v1`.

Every entry carries: Asset ID, Name, Type, Version, Status, Owner, Approved By, Created, Updated, Usage, Restrictions, Source, Canonical Location, Variants, Related Project, and a **SHA-256 hash** proving the canonical copy is byte-identical to the production original.

Human-readable view: [`../portfolio/BRAND_REGISTRY.md`](../portfolio/BRAND_REGISTRY.md).

---

## The asset rule

```
COPY → REGISTER → VERIFY → RELINK → VERIFY → THEN MOVE
```

Never `MOVE → HOPE → DISCOVER BREAKAGE`.

| Situation | Action |
|---|---|
| Asset referenced by production code | Copy to Brand Center, register, record the production path, **leave the original in place** |
| Asset not referenced by production | Copy or move per classification |
| Asset is a duplicate | Register both; never auto-delete |
| Asset is deprecated | Mark `DEPRECATED`; keep the file |

---

## Status vocabulary

| Status | Meaning |
|---|---|
| `CANONICAL` | The authoritative version |
| `APPROVED` | Cleared for use |
| `WORKING` | In use, not formally approved |
| `DRAFT` | In progress |
| `EXPORT` | Generated output |
| `REFERENCE` | For reference only |
| `DEPRECATED` | Superseded, still present |
| `ARCHIVE` | Stored, not in use |
| `UNKNOWN` | Evidence insufficient |

Approval information is **never invented**. Where no approval record exists, the field reads `NOT RECORDED`.
