# Naming

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18

---

## 1. Institutional naming

| Form | Value | Use |
|---|---|---|
| Canonical name | SohaelTasneem Foundation | All formal contexts |
| Bangla name | সোহেল তাসনীম ফাউন্ডেশন | Bangla contexts |
| Abbreviation | STFL | Short form, code, identifiers |
| Legal entity | SohaelTasneem Foundation | Legal documents |
| Canonical domain | `stflbd.org` | Web |
| Jurisdiction | Bangladesh | Legal |

**Never:** "Sohael Tasneem Foundation" (with a space) in formal identity contexts, "STFL Foundation", "The STFL", "Sohail Tasneem".

> Note: `main/README.md` uses "Sohael Tasneem Foundation" in prose. The registry value `SohaelTasneem Foundation` is canonical.

---

## 2. Platform naming

| Form | Value |
|---|---|
| Platform name | STFL VI |
| Descriptor | Unified Institutional Operating Platform |
| Domain | `stflbd.org` (organisation) · `stflbd.app` (app) |

---

## 3. Project naming

| Rule | Detail |
|---|---|
| Slug format | lowercase, hyphen-separated, ASCII |
| Slug examples | `grihostios`, `skillconnect`, `aev-developments`, `cikgu-fatimah` |
| Project ID format | `STFL-PRJ-YYYY-NNNN` |
| Display name | Human-readable, may include an em dash descriptor |
| Bangla display name | Where recorded in the registry |

### Registered slugs

`grihostios` · `skillconnect` · `aev-developments` · `maxremit` · `helpex` · `proiozon` · `perlu` · `oiix` · `hashify` · `yourgiftcardsupply` · `cikgu-fatimah` · `hakimsarker` · `qimai`

---

## 4. Asset naming

| Rule | Detail |
|---|---|
| Format | `<subject>-<variant>.<ext>` |
| Examples | `stfl-mark-dark.png`, `stfl-wordmark-white.png`, `grihostios-logo.svg` |
| Lowercase | Always |
| Hyphens | Not underscores, not spaces |
| No version in filename | Version lives in the registry |

### Exceptions in the current inventory

| File | Why it deviates |
|---|---|
| `logo_stfl_full.png` | Android resource naming convention (underscores required) |
| `HindSiliguri-Bold.ttf` | Font family naming convention |
| `inter_variable.ttf` | Android resource naming convention |
| `official_doc/templates/<uuid>.png` | Browser-download artefacts; retained unmodified |

---

## 5. Domain naming

| Rule | Detail |
|---|---|
| Organisation | `stflbd.org` |
| App | `stflbd.app` |
| Product sub-domain | `<slug>.stflbd.app` |
| External project domain | As registered per project |

Never introduce an alternate production domain.

---

## 6. Code identifiers

| Context | Convention | Example |
|---|---|---|
| Android namespace | `foundation.sohaeltasneem.<module>` | `foundation.sohaeltasneem.app` |
| Android applicationId | `foundation.sohaeltasneem.app` | — |
| npm package | `stfl-<area>` | `stfl-web`, `stfl-api` |
| Cloudflare Worker | `stfl-<area>` | `stfl-web`, `stfl-api`, `stfl-foundation-web` |
| KV binding | `SCREAMING_SNAKE` | `CONFIG_KV` |
| R2 binding | `SCREAMING_SNAKE` | `MEDIA_BUCKET` |

---

## 7. Related

- [`brand-governance.md`](./brand-governance.md)
- [`../portfolio/PROJECT_REGISTRY.md`](../../portfolio/PROJECT_REGISTRY.md)
- [`../portfolio/DOMAIN_REGISTRY.md`](../../portfolio/DOMAIN_REGISTRY.md)