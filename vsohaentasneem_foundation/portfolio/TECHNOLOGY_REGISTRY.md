# STFL Technology Registry

Every stack, runtime and data store in use, with the folder that owns it.

---

## 1. Web — Foundation site and Enterprise Workspace

| Field | Value |
|---|---|
| Folder | `stflbd.org/` |
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, `@tailwindcss/postcss` |
| Icons | `iconoir-react` ^7.12.1 (Iconoir only) |
| Lint | ESLint 9 (`eslint.config.mjs`) |
| Adapter | `@opennextjs/cloudflare` ^1.20.12 |
| Runtime | Cloudflare Workers (`nodejs_compat`) |
| Package manager | npm |
| Node | v24.20.0 (verified) |

## 2. Web — App landing

| Field | Value |
|---|---|
| Folder | `main/web/` |
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Icons | `iconoir-react` ^7.12.1 |
| Lint | ESLint 9 (`eslint.config.mjs`) |
| Adapter | `@opennextjs/cloudflare` ^1.20.12 |
| Runtime | Cloudflare Workers (`nodejs_compat`) |
| Package manager | npm |

## 3. API

| Field | Value |
|---|---|
| Folder | `main/api/` |
| Framework | Hono ^4.9.7 |
| Language | TypeScript ^5.9.2 |
| Runtime | Cloudflare Workers (`nodejs_compat`) |
| Database driver | `postgres` ^3.4.9 (via Hyperdrive) |
| Migrations | `main/api/migrations/` (0001, 0002, 0003) |
| Migration runner | `main/api/scripts/migrate.mjs` |
| Tests | Vitest ^5.0.3 |
| Deploy tool | Wrangler ^4.149.0 |
| Package manager | npm |

## 4. Android

| Field | Value |
|---|---|
| Folder | `main/` |
| Language | Kotlin |
| UI | Jetpack Compose |
| Build | Gradle 9.8.1 (wrapper) |
| JDK | 21 (verified: OpenJDK 21.0.12.1 LTS) |
| minSdk | 26 |
| Namespace | `foundation.sohaeltasneem.app` |
| applicationId | `foundation.sohaeltasneem.app` |
| Local cache | Room |
| Security | Encrypted storage, screen protection |
| Mock backend | `devmockserver` (JDK `HttpServer`, never shipped) |

### Android modules

| Module | Purpose |
|---|---|
| `app` | Application shell, navigation, vertical slice |
| `core` | Design system, brand, security primitives |
| `domain` | Models and contracts |
| `data` | Repository implementations, DI |
| `network` | API client |
| `database` | Room cache |
| `security` | Encrypted storage, screen protection |
| `notifications` | Firebase integration |
| `ui` | Screens |
| `devmockserver` | Development-only mock backend |

## 5. Infrastructure

| Component | Technology | Value |
|---|---|---|
| Edge compute | Cloudflare Workers | 3 Workers |
| Object storage | Cloudflare R2 | `stfl-media` |
| Key-value config | Cloudflare KV | `CONFIG_KV` = `a2f247fbc4914040adc3c78befb6bb7a` |
| Database proxy | Cloudflare Hyperdrive | binding `HYPERDRIVE` |
| Database | PostgreSQL | via Hyperdrive |
| DNS | Cloudflare | zones `stflbd.org`, `stflbd.app` |
| Distribution | Google Play | `foundation.sohaeltasneem.app` |

## 6. Design system

| Component | Value |
|---|---|
| Colour tokens | `stflbd.org/stfl-brand-tokens.css`, `main/web/stfl-brand-tokens.css` |
| Token source of truth | `STFL_VI_BRAND_GUIDELINES.md` §2 |
| Typography spec | `STFL_VI_TYPOGRAPHY_SYSTEM.md` |
| Icon policy | `stflbd.org/STFL_ICONOGRAPHY_POLICY.md` |
| Icon library | Iconoir (`iconoir-react`) — no other icon source permitted |

### Fonts

| Family | Role | Bundled at |
|---|---|---|
| Hind Siliguri | BN headings | `stflbd.org/public/fonts/`, `main/web/public/fonts/`, `main/core/src/main/res/font/`, `main/assets/branding/fonts/` |
| Noto Sans Bengali | BN body | Next.js font cache |
| Baloo Da 2 | BN UI | Google Fonts CSS2 + local |
| Inter | EN headings and body | Next.js font cache, `main/core/src/main/res/font/inter_variable.ttf` |
| JetBrains Mono | Code | CSS import / monospace fallback |

## 7. Tooling

| Tool | Version | Purpose |
|---|---|---|
| Node.js | v24.20.0 | Web and API builds |
| npm | 11.19.0 | Package management |
| JDK | 21.0.12.1 LTS | Android builds |
| Gradle | 9.8.1 | Android builds |
| Wrangler | ^4.149.0 | Cloudflare deploys |
| Vitest | ^5.0.3 | API tests |
| ESLint | 9 | Web lint |

## 8. Legacy stacks

| Folder | Stack | Status |
|---|---|---|
| `web/` | Next.js 15, ESLint 10 | LEGACY — must not deploy |
| `apk/` | Kotlin / Gradle (duplicate of `main/`) | LEGACY |
| `files/web/aakutu-board/` | TypeScript, Vitest, own build | UNRELATED PROJECT |

## 9. Technology rules

1. **Iconoir only.** No other icon library, no hand-drawn interface icons.
2. **No new framework without a registry entry.** Adding a stack means adding a row here.
3. **No alternate production runtime.** Cloudflare Workers is the only edge runtime.
4. **No second database.** PostgreSQL via Hyperdrive is the only production data store.
5. **No secrets in code.** Ever.
