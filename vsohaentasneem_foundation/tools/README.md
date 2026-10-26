# Tools

Portfolio maintenance and validation helpers.

---

## 1. Existing verification scripts

These pre-date the portfolio layer and remain authoritative.

| Script | Purpose | Run from |
|---|---|---|
| [`../scripts/verify-domain-separation.mjs`](../scripts/verify-domain-separation.mjs) | Enforces the domain split | `main/web` or `stflbd.org` |
| [`../scripts/verify-live-domains.ps1`](../scripts/verify-live-domains.ps1) | Live HTTP smoke test | root |
| [`../validate_json.js`](../validate_json.js) | JSON validation | root |

### Domain separation linter

```powershell
# From main/web
node ../../scripts/verify-domain-separation.mjs

# From stflbd.org
node ../scripts/verify-domain-separation.mjs
```

Checks:

- `stflbd.org` contains no app-only routes (`/download`, `/demo`, `/roadmap`, `/v`, `/verify`)
- `main/web` contains no foundation or admin routes
- No `.org` file declares a canonical URL on `.app`
- No `.org` file uses an `@stflbd.app` email
- No file references `api.stflbd.app` or `stflbd.org/api`
- `stflbd.org/wrangler.toml` does not target `.app` routes

### Live domain smoke test

```powershell
.\scripts\verify-live-domains.ps1
.\scripts\verify-live-domains.ps1 -Detailed
```

---

## 2. Portfolio validation

| Check | Command |
|---|---|
| All registry JSON parses | `node tools/validate-portfolio.mjs` |
| Every canonical asset hash matches its production source | `node tools/validate-portfolio.mjs --hashes` |
| Every project workspace has the required files | `node tools/validate-portfolio.mjs --workspaces` |

See [`validate-portfolio.mjs`](./validate-portfolio.mjs).

---

## 3. Rules

1. **Tools never mutate production.** Read-only against production paths.
2. **Tools never deploy.** Deployment is manual and deliberate.
3. **Tools never write secrets.**
4. **A failing tool is a finding, not an obstacle.**