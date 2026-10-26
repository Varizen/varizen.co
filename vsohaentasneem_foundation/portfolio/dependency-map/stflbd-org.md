# Dependency Detail — Foundation Website

**Folder:** `stflbd.org/` · **Worker:** `stfl-foundation-web` · **Domain:** `https://stflbd.org`

---

## Internal dependencies

| Depends on | Kind | Path-sensitive |
|---|---|---|
| `stflbd.org/src/app/**` | Source | Yes |
| `stflbd.org/public/**` | Static assets | Yes |
| `stflbd.org/scripts/verify-icon-policy.mjs` | Build | Yes |
| `../scripts/verify-domain-separation.mjs` | Build | **Yes — breaks if moved** |
| `stflbd.org/wrangler.toml` | Deploy | Yes |
| `stflbd.org/.open-next/` | Build output | Yes |

## External dependencies

| Depends on | Kind |
|---|---|
| `stflbd.app/api/v1` | API (CORS-allowed) |
| `stflbd.app/media` | R2 media |
| `iconoir-react` | npm |
| `next`, `react`, `react-dom` | npm |
| `@opennextjs/cloudflare` | npm (dev) |

## Build chain

```
npm run build
  └─ npm run verify
       ├─ npm run verify:icons   → scripts/verify-icon-policy.mjs
       └─ npm run verify:domains → ../scripts/verify-domain-separation.mjs
  └─ next build
       └─ npx opennextjs-cloudflare build → .open-next/worker.js
```

## Assets referenced

All institutional identity assets, all project logos, all photography, all fonts. See [`../DEPENDENCY_MAP.md`](../DEPENDENCY_MAP.md) §3.

## Safe to move?

**No.** Worker config, build path, and canonical source map all depend on this exact location.