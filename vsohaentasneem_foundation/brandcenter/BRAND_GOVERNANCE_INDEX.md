# STFL Brand Governance Index

Every governance document, what it governs, and its authority.

---

## 1. Governance documents

| # | Document | Governs | Authority | Status |
|---|---|---|---|---|
| 1 | [`brand-governance.md`](./brand-governance.md) | Master brand rules, authority chain, prohibited uses | CONSTITUTIONAL | ACTIVE |
| 2 | [`naming.md`](./naming.md) | Institutional, platform and project naming | CANONICAL | ACTIVE |
| 3 | [`logo-governance.md`](./logo-governance.md) | Logo variants, clear space, minimum size, misuse | CANONICAL | ACTIVE |
| 4 | [`typography.md`](./typography.md) | Bilingual type system, font licensing, rendering | CANONICAL | ACTIVE |
| 5 | [`color-system.md`](./color-system.md) | Palette, tokens, contrast, dark surfaces | CANONICAL | ACTIVE |
| 6 | [`imagery.md`](./imagery.md) | Photography, illustration, subject consent | CANONICAL | ACTIVE |
| 7 | [`iconography.md`](./iconography.md) | Iconoir-only policy, icon sizing, stroke | CONSTITUTIONAL | ACTIVE |
| 8 | [`accessibility.md`](./accessibility.md) | Contrast, motion, focus, screen reader | CANONICAL | ACTIVE |
| 9 | [`localization.md`](./localization.md) | Bangla / English rules, numerals, dates | CANONICAL | ACTIVE |
| 10 | [`approval-workflow.md`](./approval-workflow.md) | How an asset becomes approved | CANONICAL | ACTIVE |

---

## 2. Upstream canonical sources

These documents pre-date the Brand Center and remain authoritative. The Brand Center indexes and applies them; it does not supersede them.

| Document | Location | Governs |
|---|---|---|
| `STFL_VI_BRAND_GUIDELINES.md` | root | Brand hierarchy, palette, positioning |
| `STFL_VI_TYPOGRAPHY_SYSTEM.md` | root | Typography matrix, font bundling, Bengali rendering |
| `STFL_ICONOGRAPHY_POLICY.md` | `stflbd.org/`, `main/web/` | Iconoir-only rule |
| `STFL_BRAND_SYSTEM.md` | `stflbd.org/`, `main/web/` | Brand system implementation |
| `STFL_BRAND_IMPLEMENTATION.md` | `stflbd.org/`, `main/web/` | Implementation notes |
| `stfl-brand-tokens.css` | `stflbd.org/`, `main/web/` | CSS custom properties |
| `STFL_ECOSYSTEM_BRAND_GOVERNANCE.md` | `stflbd.org/docs/` | Ecosystem-level brand governance |
| `STFL_PROJECT_PUBLICATION_POLICY.md` | `stflbd.org/docs/` | What may be published publicly |
| `STFL_VI_CANONICAL_SOURCE_MAP.md` | root | One authoritative document per domain |

---

## 3. Enforcement

| Rule | Enforced by | Runs in |
|---|---|---|
| Iconoir only | `scripts/verify-icon-policy.mjs` | `main/web`, `stflbd.org` |
| Domain separation | `scripts/verify-domain-separation.mjs` | `main/web`, `stflbd.org` |
| No `.app` canonical on `.org` | `scripts/verify-domain-separation.mjs` | `stflbd.org` |
| No foundation routes on `.app` | `scripts/verify-domain-separation.mjs` | `main/web` |

Both web builds run `verify` before `next build`, so a brand or domain violation **fails the build**.

---

## 4. Asset registry fields

Every registered asset carries:

| Field | Required | Unknown value |
|---|---|---|
| Asset ID | Yes | — |
| Name | Yes | — |
| Type | Yes | `UNKNOWN` |
| Version | Yes | `1.0` |
| Status | Yes | `UNKNOWN` |
| Owner | Yes | `UNKNOWN` |
| Approved By | Yes | `NOT RECORDED` |
| Created Date | Yes | `NOT RECORDED` |
| Updated Date | Yes | `NOT RECORDED` |
| Usage | Yes | `NOT RECORDED` |
| Restrictions | Yes | `PROPRIETARY_STFL` |
| Source | Yes | — |
| Canonical Location | Yes | — |
| Variants | Yes | `[]` |
| Related Project | Yes | `STFL-CORE` |

**Approval information is never invented.** `NOT RECORDED` is a valid, honest value.

---

## 5. Change control

| Change | Requires |
|---|---|
| Add an asset | Copy → register → verify hash → record production path |
| Change an asset | New version, new hash, old version → `DEPRECATED` |
| Deprecate an asset | Replacement identified, status set, file retained |
| Change a governance rule | Update this index and the affected document in the same change |
| Change a production asset path | **Prohibited** without a full dependency analysis and regression gate |

---

## 6. Related registries

| Registry | Location |
|---|---|
| Asset registry (machine-readable) | [`registry/assets.json`](./registry/assets.json) |
| Brand registry (human-readable) | [`../portfolio/BRAND_REGISTRY.md`](../portfolio/BRAND_REGISTRY.md) |
| Project registry | [`../portfolio/PROJECT_REGISTRY.md`](../portfolio/PROJECT_REGISTRY.md) |
| Dependency map | [`../portfolio/DEPENDENCY_MAP.md`](../portfolio/DEPENDENCY_MAP.md) |
