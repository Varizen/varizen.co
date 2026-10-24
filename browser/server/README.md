# Eye AI Gateway — operations guide

The gateway is the only component that holds OpenRouter credentials. It is a small
stateless Node service; the browser is a separate, independently shipped artifact.

```
AiBrowser --HTTPS--> Gateway --HTTPS--> OpenRouter --> free models only
```

## What needs maintaining

| Thing | How often | What to do |
|---|---|---|
| OpenRouter keys | On rotation / leak | Replace env var, restart. No browser release. |
| Free-model catalog | Automatic | Fetched every 10 min; stale cache is served if OpenRouter is down. |
| Task→model hints | When quality drops | Edit `HINTS` in `policy.js`. No browser release. |
| Rate limits | As traffic grows | `EYE_RATE_LIMIT` env var. |
| Node runtime | Quarterly | Bump the `FROM node:` tag in `Dockerfile`. |

**The browser never needs updating for any of the above.** That is the point of the split.

## Deploy

```bash
docker build -t eye-gateway ./server
docker run -p 8787:8787 \
  -e OPENROUTER_API_KEY_1=... \
  -e OPENROUTER_API_KEY_2=... \
  -e EYE_INSTALL_TOKENS=... \
  eye-gateway
```

Put TLS in front (Caddy, nginx, or your platform's ingress). The gateway speaks plain
HTTP and expects a reverse proxy to terminate TLS.

## Health checks

`GET /health` → `200` when enabled and at least one key is healthy, `503` otherwise.
Point your uptime monitor and load balancer at it. It exposes no secrets.

```json
{"ok":true,"enabled":true,"healthyKeys":2,"freeModels":20,"catalogAgeMs":42000,"uptimeSec":3600}
```

## Key rotation (zero downtime)

1. Create the replacement key in OpenRouter.
2. Add it as a **third** env var slot temporarily, or replace `_2` and restart.
3. Watch `/health` — `healthyKeys` should stay ≥ 1.
4. Revoke the old key in OpenRouter.
5. Remove the old env var.

Because the pool picks the least-loaded healthy key, a restart with one new key
immediately starts routing to it.

## Kill switch

```bash
EYE_AI_ENABLED=false   # restart required
```

Browser shows *"Eye AI is temporarily unavailable."* Everything else keeps working.

## Tests

```bash
node server/test.js     # 13 assertions, no network needed
```

Covers: load balancing, 429 failover, cooldown expiry, FAILED threshold, secret masking,
and the strict free-pricing rules (missing/null/nonzero pricing all rejected).

## Incident checklist

| Symptom | Check |
|---|---|
| All requests 503 | `/health` → `healthyKeys`. If 0, keys are invalid or rate-limited. |
| `freeModels: 0` | OpenRouter catalog unreachable and cache empty. Check egress. |
| One key stuck `RATE_LIMITED` | Normal; cooldown is 60s or `Retry-After`. |
| Key `FAILED` | 3 consecutive errors → 5 min cooldown. Verify the key in OpenRouter. |
| Suspected key leak | `pool.disable('KEY-A')` wipes it from memory; revoke in OpenRouter; rotate. |

## What is deliberately absent

- No database, no user accounts, no request logging of prompt content.
- No paid-model fallback path exists in the code.
- No admin UI — configuration is environment variables only, so there is no
  "show full key" surface to attack.
