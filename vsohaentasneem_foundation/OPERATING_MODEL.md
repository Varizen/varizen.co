# STFL Operating Model

How the STFL portfolio is operated, and how a new project is added.

---

## 1. The one rule

> **One STFL → many projects → one central portfolio → one brand governance center → controlled production sources → clear project lifecycles.**

| Layer | Governs | Does not govern |
|---|---|---|
| Brand Center | Identity | Executable software |
| Portfolio | Visibility and lifecycle | Deployment |
| Production project | Executable software | Institutional brand |
| Individual project | Its own implementation | Production infrastructure |

---

## 2. Adding a new project

Twelve steps. Do not skip. Do not reorder.

| # | Step | Output | Where |
|---|---|---|---|
| 1 | **Discover** | Evidence the initiative exists | Any source |
| 2 | **Register** | Row in the project registry | `portfolio/registry/projects.json` |
| 3 | **Classify** | Category, type, ownership | `projects/PROJECT_REGISTRY.md` |
| 4 | **Create workspace** | `projects/<slug>/` with the standard shape | `projects/` |
| 5 | **Assign brand relationship** | `NATIVE_VERIFIED` / `CO_BRANDED` / `CONCEPT_ONLY` / `LEGACY` | `brandcenter/registry/assets.json` |
| 6 | **Document dependencies** | What it needs from STFL | `projects/<slug>/INTEGRATIONS/` |
| 7 | **Assign status** | One lifecycle state | `projects/<slug>/STATUS.md` |
| 8 | **Link production** | Domain, Worker, route — only if it is actually deployed | `portfolio/DEPLOYMENT_REGISTRY.md` |
| 9 | **Register domains** | Every domain it owns | `portfolio/DOMAIN_REGISTRY.md` |
| 10 | **Register technology** | Stack, runtime, data store | `portfolio/TECHNOLOGY_REGISTRY.md` |
| 11 | **Register assets** | Logos, marks, imagery | `brandcenter/registry/assets.json` |
| 12 | **Maintain lifecycle** | Review status on a schedule | `portfolio/STATUS_MATRIX.md` |

### Step 1 — Discover

A project is discovered from evidence, never from a filename guess. Acceptable evidence:

- a project specification document
- a repository or implementation folder
- a deployment configuration
- a domain reference
- an application name in a store listing
- an explicit initiative record

If the only evidence is a stray file, the item is `UNKNOWN` — not a project.

### Step 4 — Workspace shape

```
projects/<slug>/
├── README.md
├── PROJECT_PROFILE.md
├── STATUS.md
├── ARCHITECTURE.md
├── ASSETS/
├── DOCS/
├── DESIGN/
├── SOURCE/          ← only when real source belongs to this project
├── INTEGRATIONS/
└── ARCHIVE/
```

### Step 7 — Lifecycle states

| State | Meaning |
|---|---|
| `ACTIVE` | Operating now |
| `PLANNED` | Approved, not started |
| `IN_DEVELOPMENT` | Being built |
| `PILOT` | Limited live use |
| `PAUSED` | Deliberately stopped, not retired |
| `HISTORICAL` | Complete, retained for record |
| `RETIRED` | No longer operated |
| `ARCHIVED` | Closed and stored |
| `UNKNOWN` | Evidence insufficient |

`PAUSED` is not `RETIRED`. `RETIRED` is not `DELETED`. Nothing is deleted.

---

## 3. Adding a brand asset

```
COPY → REGISTER → VERIFY → RELINK → VERIFY → THEN MOVE
```

Never `MOVE → HOPE → DISCOVER BREAKAGE`.

| Situation | Action |
|---|---|
| Asset is referenced by production code | **Copy** to Brand Center, register, record the production path, leave the original in place |
| Asset is not referenced by production | Copy or move per classification |
| Asset is a duplicate | Register both; do not auto-delete |
| Asset is deprecated | Mark `DEPRECATED`; keep the file |

Every registered asset carries: Asset ID, Name, Type, Version, Status, Owner, Approved By, Created, Updated, Usage, Restrictions, Source, Canonical Location, Variants, Related Project.

Unknown fields are recorded as `UNKNOWN` or `NOT RECORDED`. Approval information is never invented.

---

## 4. Changing production

Portfolio work **never** changes production. A production change is a separate operation that must:

1. Identify every dependency (see [`portfolio/DEPENDENCY_MAP.md`](../portfolio/DEPENDENCY_MAP.md))
2. Change one logical batch at a time
3. Run the production build after each batch
4. Pass the regression gate in [`portfolio/IMPLEMENTATION_REGISTER.md`](../portfolio/IMPLEMENTATION_REGISTER.md)

### Production build commands

| Target | Command | Working directory |
|---|---|---|
| Domain separation linter | `node ../../scripts/verify-domain-separation.mjs` | `main/web` |
| Domain separation linter (org) | `node ../scripts/verify-domain-separation.mjs` | `stflbd.org` |
| Web type-check | `npm run type-check` | `main/web` |
| Web lint | `npm run lint` | `main/web` |
| Web build | `npm run build` | `main/web` |
| Org type-check | `npm run type-check` | `stflbd.org` |
| Org build | `npm run build` | `stflbd.org` |
| API typecheck | `npm run typecheck` | `main/api` |
| API tests | `npm run test` | `main/api` |
| API dry-run deploy | `npm run build` | `main/api` |
| Android build | `.\gradlew.bat :app:assembleDebug` | `main` |
| Live domain smoke | `.\scripts\verify-live-domains.ps1` | root |

---

## 5. Review cadence

| Cadence | Review |
|---|---|
| On change | Update the affected registry in the same change |
| Monthly | `STATUS_MATRIX.md` — confirm every `ACTIVE` project is still active |
| Quarterly | `ROADMAP.md` and `TECHNOLOGY_REGISTRY.md` |
| On archive | Move to `ARCHIVE/`, set status, keep the record |

---

## 6. Prohibited operations

- Moving a production folder without a dependency analysis
- Renaming a production path
- Changing a domain, Worker name, route, KV id, R2 bucket or Hyperdrive binding
- Changing `applicationId`, signing configuration or Play Store settings
- Committing `.env`, `.dev.vars`, `keystore.properties`, `*.jks`, `*.p12` or any credential
- Deleting a retired project
- Treating an archive as active production
- Reporting `COMPLETE` when production verification failed
