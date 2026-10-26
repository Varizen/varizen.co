# Dependency Detail — API

**Folder:** `main/api/` · **Worker:** `stfl-api` · **Domain:** `https://stflbd.app/api/v1`

---

## Internal dependencies

| Depends on | Kind | Path-sensitive |
|---|---|---|
| `main/api/src/**` | Source | Yes |
| `main/api/migrations/**` | Database | Yes |
| `main/api/scripts/migrate.mjs` | Tooling | Yes |
| `main/api/scripts/seed-dev.mjs` | Tooling | Yes — imports `../src/crypto.ts` |
| `main/api/wrangler.toml` | Deploy | Yes |
| `main/api/test/**` | Tests | Yes |

## External dependencies

| Depends on | Kind |
|---|---|
| Cloudflare Hyperdrive → PostgreSQL | Database |
| Cloudflare R2 `stfl-media` | Media |
| Cloudflare KV `CONFIG_KV` | Config |
| `hono` ^4.9.7 | npm |
| `postgres` ^3.4.9 | npm |
| `wrangler` ^4.149.0 | npm (dev) |
| `vitest` ^5.0.3 | npm (dev) |

## Build chain

```
npm run typecheck  → tsc --noEmit
npm run test       → vitest run
npm run build      → wrangler deploy --dry-run --outdir dist
npm run deploy     → wrangler deploy
npm run db:migrate → node scripts/migrate.mjs
```

## Bindings

| Binding | Value |
|---|---|
| `CONFIG_KV` | `a2f247fbc4914040adc3c78befb6bb7a` |
| `MEDIA_BUCKET` | `stfl-media` |
| `HYPERDRIVE` | `REPLACE_WITH_HYPERDRIVE_ID` (placeholder by design) |

## Safe to move?

**No.** Worker config, migrations, and canonical source map all depend on this location.