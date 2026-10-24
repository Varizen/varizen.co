# AiBrowser — Eye Browser

**Fast. Smart. Secure. Yours.**

Minimal Chromium-based desktop browser (Electron) implementing the core of `prompt1.txt` with no bloat.

## Run

```bash
npm install
npm start
```

## Build (Windows)

```bash
npm run dist   # NSIS installer + portable exe in dist/
```

## What's implemented

| Area | File |
|---|---|
| Tabs, navigation, tab sleeping, session restore, find, zoom, crash recovery | `src/main.js` |
| Secure IPC bridge | `src/preload.js` |
| Eye Shield (tracker blocking, strict permissions) | `src/modules/shield.js` |
| Eye Download (queue, speed, ETA, pause/resume) | `src/modules/downloads.js` |
| Eye AI client (gateway or local, prompt-injection isolated) | `src/modules/ai.js` |
| MCP client (JSON-RPC over stdio, per-tool approval) | `src/modules/mcp.js` |
| Single-user settings, encrypted tokens (OS vault) | `src/modules/settings.js` |
| Slim UI, AI panel, downloads, MCP, performance center, settings | `src/ui/` |
| **Eye AI Gateway** — free-model policy, dual-key pool, kill switch | `server/` |

## Shortcuts

`Ctrl+T` new tab · `Ctrl+W` close tab · `Ctrl+L` address bar · `Ctrl+F` find ·
`Ctrl+J` downloads · `Ctrl+I` Eye AI · `Ctrl+Shift+N` private tab ·
`Ctrl+=` / `Ctrl+-` / `Ctrl+0` zoom

## Eye AI is free — and the keys are not in the browser

```
AiBrowser  --HTTPS-->  Eye AI Gateway  -->  OpenRouter  -->  free models only
                       (holds the keys)
```

- The browser holds **zero** OpenRouter credentials. It sends a task type, never a model id.
- The gateway verifies pricing from the live OpenRouter catalog and rejects anything not `$0`.
- Two server-side keys (`OPENROUTER_API_KEY_1/2`) are load-balanced with health states
  (`ACTIVE / DEGRADED / RATE_LIMITED / FAILED / DISABLED`). A 429 cools that key down and
  the request retries on the other one.
- No paid fallback, ever. If no free model answers: *"Eye AI is temporarily unavailable."*
- `EYE_AI_ENABLED=false` is the kill switch; the browser keeps working normally.

### Run the gateway

```bash
cp server/.env.example server/.env   # fill in the two keys
npm run gateway
```

Then in the browser: Settings → Eye AI Gateway → `http://localhost:8787` (dev) or your
production URL, plus an install token if `EYE_INSTALL_TOKENS` is set.

Operations, rotation, health checks and incident handling: **[`server/README.md`](server/README.md)**.
Tests: `node server/test.js`.

## Design rules

- Single user, local profile, no sync, no telemetry.
- AI is optional: free gateway by default, or your own local model.
- Web page text is passed to the model as untrusted data inside `<web_content>` — never as instructions.
- The install token is encrypted with the OS credential store (`safeStorage`), never written in plaintext.
- Provider keys exist only in the gateway process environment — never in the repo, the binary, or the UI.
- Background tabs unload after the configured idle period to free RAM.
- Private tabs use a non-persistent partition, wiped on window close, and are never saved to the session.
- Session restore writes tab URLs on close and reopens them on launch (Eye Recovery).
- Performance Center reads real numbers from `app.getAppMetrics()` — nothing simulated.
- MCP servers are spawned only when you add one; every tool is denied until you tick it in the MCP panel.
- The Claw Agent can only call approved tools, is capped at 6 steps, and shows a trace of every call.
- HTTPS-first upgrades `http://` navigations; per-site exemptions are stored in settings.
- No wallet signing, no autonomous transactions — not implemented rather than faked.

## MCP quick start

MCP panel → Name `filesystem`, Command `npx`, Args `-y @modelcontextprotocol/server-filesystem C:\docs`
→ **Add server** → **Discover tools** → tick the tools you trust → turn **Agent: on** in Eye AI.

## Not implemented (deliberately, to stay slim)

Web3 wallet, DeFi Guard, shopping engine, Eye Vault, auto-updater. These are separate modules in the original spec; add them behind feature flags when needed.
