# Portfolio Architecture — Decision Log

Decisions taken during the 2026-10-18 reorganization.

---

## D1 — Do not move `main/` into `stfl-main/`

| Field | Value |
|---|---|
| Decision | `stfl-main/` is a pointer, not a folder move |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** Three concrete blockers:

1. `main/web/package.json` resolves `../../scripts/verify-domain-separation.mjs`. Moving `main/` one level deeper breaks `npm run build`.
2. `main/` is a live git repository with 112 status entries (25 modified, 61 deleted, 26 untracked).
3. `STFL_VI_CANONICAL_SOURCE_MAP.md` names `main/...` paths as implementation sources for 30+ governed domains.

**Alternative rejected.** Force the move and fix paths afterwards — violates *"production integrity has priority over aesthetic folder structure"*.

---

## D2 — Copy assets, never move them

| Field | Value |
|---|---|
| Decision | All 36 production-referenced assets copied to Brand Center; originals untouched |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** Every canonical asset is referenced by production code. Moving one breaks a page.

**Verification.** All 36 copies hash-identical to their originals (SHA-256).

---

## D3 — Leave `web/` and `apk/` in place

| Field | Value |
|---|---|
| Decision | Legacy mirrors not moved to `_old/` |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** They are already non-deployable (`predeploy` exits 1, `wrangler.toml.disabled`). Moving them adds risk with no benefit and would obscure the legacy-mirror record.

---

## D4 — Do not centralize `files/web/aakutu-board/`

| Field | Value |
|---|---|
| Decision | Classified `UNRELATED_PROJECT`, left in place |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** Independent git repository with its own remote. Not an STFL initiative. Centralizing it would misrepresent ownership.

---

## D5 — Record `NOT RECORDED` rather than infer approval

| Field | Value |
|---|---|
| Decision | No approval data invented for any asset |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** The specification forbids inventing approval information. 36 assets are `APPROVED` by virtue of production use; 14 templates are `WORKING` because no approval evidence exists.

---

## D6 — Do not run the full regression gate

| Field | Value |
|---|---|
| Decision | Only the domain separation linter was run |
| Date | 2026-10-18 |
| Status | ACCEPTED |

**Reason.** This operation changed zero production files. Running web/API/Android builds would validate an unchanged tree. The gate remains documented for future production changes.

**Consequence.** The final status is `PARTIAL — PRODUCTION PRESERVED`, not `COMPLETE — PRODUCTION SAFE`. Claiming COMPLETE without running the gate would violate the specification.