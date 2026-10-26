# Dependency Detail — App Landing

**Folder:** `main/web/` · **Worker:** `stfl-web` · **Domain:** `https://stflbd.app`

---

## Internal dependencies

| Depends on | Kind | Path-sensitive |
|---|---|---|
| `main/web/src/app/**` | Source | Yes |
| `main/web/public/**` | Static assets | Yes |
| `main/web/scripts/verify-icon-policy.mjs` | Build | Yes |
| `../../scripts/verify-domain-separation.mjs` | Build | **Yes — breaks if moved** |
| `main/web/wrangler.toml` | Deploy | Yes |
| `main/web/.open-next/` | Build output | Yes |

## External dependencies

| Depends on | Kind |
|---|---|
| `stflbd.app/api/v1` | API |
| `stflbd.app/media` | R2 media |
| `iconoir-react` | npm |
| `next`, `react`, `react-dom` | npm |
| `@opennextjs/cloudflare` | npm (dev) |

## Build chain

```
npm run build
  └─ npm run verify
       ├─ npm run verify:icons   → scripts/verify-icon-policy.mjs
       └─ npm run verify:domains → ../../scripts/verify-domain-separation.mjs
  └─ next build
       └─ npx opennextjs-cloudflare build → .open-next/worker.js
```

## Assets referenced

`stfl-mark-white.png`, `stfl-mark-transparent.png`, `stfl-logo-transparent.png`, `stfl-original-logo.png`, `stfl-wordmark-*.png`, `grihostios-logo.svg`, `skillconnect-logo.svg`, `maxremit-logo.svg`, `proiozon-logo.png`, fonts, favicon.

## Safe to move?

**No.** The `../../scripts` build path breaks, and the canonical source map names `main/web/src/...` as the implementation source for the app domain.