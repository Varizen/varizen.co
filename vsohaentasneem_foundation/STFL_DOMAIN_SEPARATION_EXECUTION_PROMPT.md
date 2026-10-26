# STFL Domain Separation — Execution Prompt

> Copy everything inside the box below into a new AI-agent session opened at `c:\Users\ShoebTahseen\Desktop\stfl`.
> The binding specification is [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](./STFL_DOMAIN_SEPARATION_ARCHITECTURE.md). If the prompt and the spec disagree, **the spec wins**.

---

````text
ROLE
You are the STFL platform engineer responsible for separating the two STFL domains.
Workspace root: c:\Users\ShoebTahseen\Desktop\stfl (Windows, PowerShell).
Binding spec: STFL_DOMAIN_SEPARATION_ARCHITECTURE.md — read it fully before doing anything.
Also read: STFL_VI_CANONICAL_SOURCE_MAP.md, STFL_WEB_ROUTES.md, STFL_WEB_SEO_MODEL.md,
stflbd.org/ICON_RULE_FOR_ALL_AGENTS.md, stflbd.org/STFL_ICONOGRAPHY_POLICY.md,
STFL_WEB_BILINGUAL_GOVERNANCE.md, STFL_VI_BRAND_GUIDELINES.md.

GOAL
1. stflbd.org  = the organisation: Foundation public website + Enterprise Workspace (/admin/*),
                 fully usable on desktop/PC browsers.
2. stflbd.app  = the mobile app only: app landing, /download, /demo/*, app legal pages,
                 /v + /verify (permanent QR contract), /api/v1 backend, /media, *.stflbd.app products.
3. Make it structurally hard for the two to drift together again (constants, CI lint, smoke tests).

KNOWN FACTS (verified 2026-10-18 — re-verify, do not assume)
- stflbd.org nameservers are launch1/launch2.spaceship.net, no DNS records → site is empty.
  This is an infrastructure task (Cloudflare zone + registrar NS change); code cannot fix it.
- main/web (Worker "stfl-web", routes stflbd.app/*) currently serves app landing + foundation + /admin.
- stflbd.org/ (Worker "stfl-foundation-web", routes stflbd.org/*) is a fork of main/web; it lacks
  main/web's newer edits to layout.tsx, page.tsx, brandcenter/page.tsx, initiatives/page.tsx,
  lib/initiativesRegistry.ts, and main/web lacks stflbd.org's initiatives/{aev-developments,helpex,oiix,perlu}.
- ~45 files in stflbd.org/src hard-code https://stflbd.app canonical/OG URLs.
- main/api ALLOWED_ORIGINS excludes stflbd.org.
- Android DataModule.DEFAULT_BASE_URL = "https://api.stflbd.app" (does not resolve).
- Web auth uses Authorization: Bearer (no cross-domain cookies).
- Root web/ and apk/ are legacy mirrors; web/wrangler.toml also targets stflbd.app/* (dangerous).

HARD CONSTRAINTS
- NEVER break: stflbd.app/v/{code}, /verify, /verify/{id}, /privacy, /terms, /safeguarding,
  /account-deletion, /.well-known/assetlinks.json, /api/v1/*, /media/*. They are printed on documents,
  referenced by the Play Store listing and by the Android binary.
- NEVER create stflbd.org/api, api.stflbd.app, or any second API origin.
- NEVER commit secrets; never print .env/.dev.vars values. wrangler secrets stay in Cloudflare.
- NEVER run `wrangler deploy`, change DNS, or touch the registrar without explicit user approval
  in this session. Prepare commands; ask before executing.
- Iconoir icons only; keep bilingual bn/en parity; keep brand tokens unchanged.
- Do not delete folders. "Archive" = move to _old/ only after user approval.
- Preserve existing behaviour of every route not listed in spec §3.2.
- Small, reviewable commits per phase (Co-authored-by trailer per session rules) if the folder is a git repo.

WORK PLAN — execute phase by phase; after each phase run its checks and report PASS/FAIL before continuing.

PHASE 0 — Baseline & inventory (read-only)
  a. Re-run: Resolve-DnsName stflbd.org -Type NS; curl.exe -sI for https://stflbd.org, https://stflbd.app,
     https://stflbd.app/api/v1, https://stflbd.app/.well-known/assetlinks.json.
  b. Produce a route inventory for main/web/src/app and stflbd.org/src/app and map each route to the
     ownership column of spec §3.2. List any route not covered by §3.2 and STOP to ask the user.
  c. Diff main/web/src vs stflbd.org/src (hash compare) and list files to merge.
  d. Grep the whole workspace (exclude node_modules, .next, .open-next, build, _old) for
     stflbd\.org|stflbd\.app|api\.stflbd|sohaeltasneem\.foundation and save the table to
     files/domain-baseline.md in the session folder (not the repo).
  Checks: inventory complete; no unknown routes.

PHASE 1 — Domain constants (no behaviour change)
  a. Create src/lib/domains.ts in stflbd.org/ and main/web/ exactly as spec §3.4
     (FOUNDATION_ORIGIN, APP_ORIGIN, API_BASE_URL from NEXT_PUBLIC_API_BASE_URL/NEXT_PUBLIC_API_URL with
     default https://stflbd.app/api/v1, VERIFY_ORIGIN, SITE_ORIGIN, canonical(path)).
  b. Create main/api/src/config/domains.ts (APP_ORIGIN, FOUNDATION_ORIGIN, verifyUrl, qrUrl) and replace
     literals in documents/engine.ts, grihosti/engine.ts, comms/engine.ts, routes/app.ts, index.ts.
     Generated URLs must stay byte-identical (stflbd.app/v/..., stflbd.app/verify/...).
  c. Android: add FOUNDATION_URL / APP_URL / API_BASE_URL to core/.../brand/Brand.kt; make AppConfig.kt,
     AppConfigUi.kt and DataModule.kt use them; fix DEFAULT_BASE_URL → "https://stflbd.app/api/v1".
     Apply to main/ (canonical). Do not edit apk/ unless the user asks.
  Checks: main/api `npm test`; both web projects `npm run type-check` (or `npx tsc --noEmit`) and
  `npm run build`; Android `.\gradlew.bat test` (JDK 21) if SDK available — otherwise report as skipped.

PHASE 2 — Make stflbd.org/ the complete organisation site + Enterprise Workspace
  a. Merge newer main/web edits into stflbd.org/ (layout metadata stays stflbd.org; foundation home stays
     the foundation landing, NOT AppLandingPage). Bring over admin/* and any lib/component changes.
  b. Replace every hard-coded https://stflbd.app canonical/OG/body URL for foundation pages with
     canonical("/path") from domains.ts → https://stflbd.org/path. Keep verification links pointing to
     VERIFY_ORIGIN (stflbd.app). Replace brand@stflbd.app with hi@stflbd.email. Fix /brand "Primary domain"
     text and social placeholder links (do not invent social URLs — leave TODO with no href if unknown).
  c. Remove from stflbd.org/src/app: download, demo (+ demo-backed finance/operations/governance/outcomes/
     compliance/documents/people/projects pages — confirm each is a DemoWorkspace wrapper first), roadmap,
     v, verify. Add Next.js redirects() (permanent) for those paths → https://stflbd.app/<new path>
     (demo sub-pages → /demo/<name>). Keep a public /projects page only if it is real foundation content.
  d. /login and /signup on .org = workspace sign-in; remove "STFL VI Product Platform • stflbd.app" footer
     wording, link to the app via APP_ORIGIN + "/download".
  e. Enterprise Workspace PC requirements (spec §5): desktop-first admin layout, persistent sidebar,
     no horizontal scroll ≥1280px, <768px shows "use a PC or the Android app" notice, noindex meta +
     X-Robots-Tag, X-Frame-Options DENY, Cache-Control no-store for /admin/*, WORKSPACE_BASE constant.
  f. next.config.ts headers: add /admin/:path* specific headers; keep CSP connect-src https://stflbd.app.
  g. public/sitemap.xml + robots.txt: only stflbd.org URLs; Disallow: /admin, /login, /signup.
  h. Initiative registry: story pages at stflbd.org/initiatives/{slug}; product `domain` fields stay
     {product}.stflbd.app.
  Checks: npm run build, type-check, verify:icons; local preview (npm run preview / wrangler dev) and
  open /, /about, /initiatives, /admin at 1366×768 and 1920×1080 — screenshot if browser tools available.

PHASE 3 — Slim main/web to the app landing site
  a. Keep only: / (AppLandingPage), /download, /demo/* (move demo-backed sub-pages under /demo/),
     /roadmap, /privacy, /terms, /safeguarding, /account-deletion (create if missing — Play Store needs it),
     /cookies, /v/[code], /verify, /verify/[documentId], shared components they import.
  b. Delete foundation and admin pages from main/web/src/app ONLY after Phase 2 builds green, and add
     permanent redirects() for every removed path → https://stflbd.org/<same path>
     (/foundation → https://stflbd.org/, /login + /signup + /admin/* → stflbd.org).
  c. AppLandingPage: "Workspace Consoles" and every /admin link → FOUNDATION_ORIGIN + "/admin";
     add one "About the Foundation" link → FOUNDATION_ORIGIN.
  d. app legal pages describe the app's data processing (Android app + API); foundation policies live on .org.
  e. sitemap.xml/robots.txt: only stflbd.app URLs; Disallow /api, /demo/ sub-pages.
  f. Ensure /.well-known/assetlinks.json is served (public/.well-known) and never redirected.
  Checks: build, type-check, verify:icons; route test that each removed path returns 308/301 with the
  correct Location in local preview.

PHASE 4 — API & Android alignment
  a. main/api/wrangler.toml: production ALLOWED_ORIGINS =
     "https://stflbd.org,https://www.stflbd.org,https://stflbd.app,https://www.stflbd.app"
     (both [vars] and [env.production.vars]); staging adds only staging hosts. Add FOUNDATION_ORIGIN var.
  b. Add/extend an API test proving an OPTIONS preflight from https://stflbd.org is allowed and from
     https://evil.example is rejected.
  c. routes/app.ts app-config: website stays APP_ORIGIN for app legal pages; add foundationUrl =
     FOUNDATION_ORIGIN (additive, backward compatible).
  d. Android: add "About the Foundation" → FOUNDATION_URL where the app links to the website
     (settings/about screen), keep privacy/terms/account-deletion on stflbd.app.
  Checks: main/api npm test; Android unit tests.

PHASE 5 — Guardrails
  a. scripts/verify-domain-separation.mjs (root) implementing spec §6.1; wire as `npm run verify:domains`
     in stflbd.org/ and main/web/ and into their existing `verify`/`prebuild` scripts.
  b. scripts/verify-live-domains.ps1 implementing spec §6.2 (curl.exe -sI, assert status + Location for
     every §3.2 row; assetlinks 200 JSON; /api/v1 reachable).
  c. Neutralise legacy deployables: root web/ and apk/ — add a predeploy guard that exits 1 with
     "LEGACY MIRROR — DO NOT DEPLOY, see STFL_DOMAIN_SEPARATION_ARCHITECTURE.md"; rename their
     wrangler.toml to wrangler.toml.disabled. Ask before moving them to _old/.
  d. Add a PR/agent checklist section to ICON_RULE_FOR_ALL_AGENTS.md-style file:
     DOMAIN_RULE_FOR_ALL_AGENTS.md in stflbd.org/ and main/web/ (short: the one-sentence rule + §6.5 tree).
  Checks: run verify:domains in both projects → PASS; intentionally add a bad literal in a temp copy to
  prove it FAILS, then remove it.

PHASE 6 — Infrastructure runbook (prepare, then ask user to execute or approve)
  Output the exact steps of spec §4 (I1–I9) as a numbered checklist with the commands, e.g.
    cd stflbd.org; npx opennextjs-cloudflare build; npx wrangler deploy --env production
    cd main\web;   npx opennextjs-cloudflare build; npx wrangler deploy --env production
    cd main\api;   npx wrangler deploy --env production
  Order matters: (1) DNS for stflbd.org live, (2) deploy stfl-api CORS, (3) deploy stflbd.org,
  (4) verify .org green, (5) only then deploy slimmed main/web with redirects.
  Never deploy main/web redirects before stflbd.org returns 200 — that would send users to an empty site.

PHASE 7 — Documentation sync
  Update to reference the spec and reflect the new ownership: STFL_VI_CANONICAL_SOURCE_MAP.md (enterprise
  consoles canonical path → stflbd.org/src/app/admin), STFL_WEB_ROUTES.md, STFL_WEB_SEO_MODEL.md,
  STFL_WEB_ARCHITECTURE.md, STFL_VI_MASTER_CONTROL.md, main/docs/API.md, main/api/docs/API_DEPLOYMENT.md,
  main/docs/PLAY_STORE_LISTING.md, stflbd.org/docs/STFL_ECOSYSTEM_ROUTE_MAP.md, STFL_PROJECT_REGISTRY.json
  ("canonical_domain" for the organisation = stflbd.org; products keep *.stflbd.app). Append an entry to
  STFL_VI_CHANGELOG.md. Run validate_json.js on edited JSON.

FINAL REPORT (concise)
  - Table: phase | status | evidence (command + result)
  - Table: every §3.2 route | .org result | .app result
  - Items needing user action (DNS/registrar/deploy approvals), each with the exact command/click path
  - Anything skipped and why

STOP AND ASK THE USER WHEN
  - A route is not covered by spec §3.2.
  - A page mixes foundation and product content and cannot be cleanly assigned.
  - A change would alter a URL printed on documents/QR codes or used by the Android binary.
  - Any deploy, DNS, registrar, secret, or folder-archive action.
  - Any test that was green in Phase 0 turns red and the fix is not obvious.
````

---

## Short version (for quick tasks touching URLs)

```text
Follow STFL_DOMAIN_SEPARATION_ARCHITECTURE.md. stflbd.org = Foundation website + Enterprise Workspace
(/admin, desktop-first). stflbd.app = mobile-app landing, /download, /demo, app legal pages,
/v + /verify (permanent), /api/v1, /media, *.stflbd.app. Use src/lib/domains.ts (web),
src/config/domains.ts (api), Brand.kt (Android) — never hard-code domains. No stflbd.org/api, no
api.stflbd.app. Run `npm run verify:domains` before finishing. Ask before deploys or DNS changes.
```
