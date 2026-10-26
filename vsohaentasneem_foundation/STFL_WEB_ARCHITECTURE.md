# STFL Web Architecture Specification

**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Binding Specification:** [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](./STFL_DOMAIN_SEPARATION_ARCHITECTURE.md)  
**Deployables:**
- `stflbd.org/` — Foundation Public Website & Enterprise Workspace (`https://stflbd.org`)
- `main/web/` — Mobile Application Landing Site (`https://stflbd.app`)
**Version:** 2026.10.18  
**Status:** CONSTITUTIONAL & IMPLEMENTED  

---

## 1. Domain Separation & Deployables Architecture (§3.1)

Per `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`:

| Folder | Worker name | Routes | Purpose |
|---|---|---|---|
| `stflbd.org/` | `stfl-foundation-web` (+ `-production`) | `stflbd.org/*`, `www.stflbd.org/*` | Foundation site + Enterprise Workspace |
| `main/web/` | `stfl-web` (+ `-production`, `-staging`) | `stflbd.app/*`, `www.stflbd.app/*`, `staging.stflbd.app/*` | App landing site **only** (after slimming) |
| `main/api/` | `stfl-api` | `stflbd.app/api/*`, `www.stflbd.app/api/*`, `staging.stflbd.app/api/*` | Backend (more specific route wins over `stfl-web`) |
| `main/` (Android) | — | — | Android app, talks only to `https://stflbd.app/api/v1` |
| `web/`, `apk/` | **none — must never deploy** | — | Legacy mirrors (neutralised with predeploy guards) |

---

## 2. Technology Stack & Framework

| Layer | Technology | Specification / Standard |
|---|---|---|
| **Core Framework** | Next.js 15 (React 19) | App Router architecture, Server Components by default, Client Components where interactivity requires. |
| **Language Runtime** | TypeScript 5.8 | Strict mode, zero compilation warnings. |
| **UI Library** | React 19.0.0 | Concurrent React, hydration-safe bilingual state rendering. |
| **Styling Engine** | Tailwind CSS v4.0.0 | CSS variables with `@theme inline` mapping in `globals.css` and `stfl-tokens.css`. |
| **Typography** | Google Fonts | `Hind Siliguri` (Bengali Headings/Footers), `Noto Sans Bengali` (Bengali Body), `Inter` (English Body/Headings), `JetBrains Mono` (Code/Monospace). |
| **Iconography** | `iconoir-react` (v7.12.1) | **Strict Exclusive Rule:** 100% of interface UI icons are Iconoir. Prohibited: Lucide, Heroicons, FontAwesome, React-icons. Enforced by `verify-icon-policy.mjs`. |
| **Domain Constants** | `src/lib/domains.ts` | Single source of domain constants (`FOUNDATION_ORIGIN`, `APP_ORIGIN`, `API_BASE_URL`, `WORKSPACE_BASE`, `canonical(path)`). |
| **CI Guardrails** | `scripts/verify-domain-separation.mjs` | Automated CI linter preventing domain drift, illegal routes, or incorrect canonical declarations. |

---

## 3. Enterprise Workspace on `stflbd.org` (Spec §5)

The Enterprise Workspace (`/admin/*`) on `stflbd.org` is designed desktop-first:
- Optimized for 1366×768 and 1920×1080; zero horizontal scroll ≥ 1280px.
- Persistent navigation for 18 governed consoles across 6 administrative clusters.
- Mobile (<768px) displays a clear notice recommending desktop browser or the Android application.
- Security headers: `X-Frame-Options: DENY`, `X-Robots-Tag: noindex, nofollow, noarchive`, `Cache-Control: no-store`.

---

## 4. Backend & Cross-Domain Integration Contract (§3.3)

1. **API Base:** Every client uses exactly `https://stflbd.app/api/v1` (staging: `https://staging.stflbd.app/api/v1`).
2. **CORS:** `ALLOWED_ORIGINS` in `main/api/wrangler.toml` explicitly includes `https://stflbd.org`, `https://www.stflbd.org`, `https://stflbd.app`, and `https://www.stflbd.app`.
3. **Authentication:** Bearer token authorization in memory; no cross-domain cookies required.
4. **CSP:** `stflbd.org` allows `connect-src 'self' https://stflbd.app https://*.stflbd.app`.
