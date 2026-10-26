# Portfolio Architecture — Production Boundary

Where the portfolio ends and production begins.

---

## The boundary

```
portfolio/  brandcenter/  projects/  docs/  tools/  stfl-main/
──────────────────────────── BOUNDARY ────────────────────────────
stflbd.org/   main/web/   main/api/   main/   scripts/
```

| Side | May be changed by portfolio work? |
|---|---|
| Portfolio side | Yes |
| Production side | **No** |

---

## What crosses the boundary

| Direction | What | How |
|---|---|---|
| Production → Portfolio | Asset copies | Copy + hash verify |
| Production → Portfolio | Path references | Recorded in the dependency map |
| Portfolio → Production | **Nothing** | — |

The portfolio **reads** production. It never writes to it.

---

## Why

Production is a live system serving `stflbd.org`, `stflbd.app` and the Android app. A portfolio reorganization is an organizational improvement, not a production migration. The two must never be conflated.

---

## Enforcement

| Rule | Enforced by |
|---|---|
| No production file moved | This operation made zero production changes |
| No production reference changed | Verified by `git status` in `main/` and `apk/` |
| Build paths intact | `verify-domain-separation.mjs` still resolves |