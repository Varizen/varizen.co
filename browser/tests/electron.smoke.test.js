// Electron smoke test — the only suite that actually launches the app.
// Exercises main.js (window creation, IPC handlers) and preload.js (the window.eye bridge).
// Run from browser/: node --test tests/electron.smoke.test.js
//
// Playwright is resolved from the repo root's node_modules (Node walks up from this file),
// so browser/ needs no new dependency.
const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { _electron: electron } = require('playwright');

const APP_DIR = path.join(__dirname, '..');

// Playwright resolves Electron relative to its own install (the repo root), which does not
// have Electron. Resolve the binary from browser/node_modules explicitly.
const ELECTRON_BIN = require('electron');

// Isolated profile so the test never touches the developer's real settings/session.
function tempProfile() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'aibrowser-test-'));
}

async function launch() {
  const userDataDir = tempProfile();
  const app = await electron.launch({
    executablePath: ELECTRON_BIN,
    args: ['.', `--user-data-dir=${userDataDir}`],
    cwd: APP_DIR,
    timeout: 60000
  });
  const window = await app.firstWindow({ timeout: 60000 });
  await window.waitForLoadState('domcontentloaded');
  return { app, window, userDataDir };
}

async function shutdown({ app, userDataDir }) {
  try { await app.close(); } catch { /* already gone */ }
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { /* best effort */ }
}

test('AiBrowser launches and the shell works', async (t) => {
  const ctx = await launch();
  const { app, window } = ctx;

  try {
    await t.test('a window opens with the expected title', async () => {
      assert.strictEqual(await window.title(), 'AiBrowser');
    });

    await t.test('exactly one window is created', async () => {
      assert.strictEqual(app.windows().length, 1);
    });

    await t.test('the renderer loads the UI document', async () => {
      const url = window.url();
      assert.match(url, /ui[\\/]index\.html$/);
    });

    await t.test('the preload bridge exposes window.eye', async () => {
      const shape = await window.evaluate(() => ({
        present: typeof window.eye === 'object' && window.eye !== null,
        groups: Object.keys(window.eye || {}).sort()
      }));
      assert.strictEqual(shape.present, true);
      for (const g of ['tabs', 'nav', 'find', 'zoom', 'ai', 'perf', 'shield', 'mcp', 'downloads']) {
        assert.ok(shape.groups.includes(g), `window.eye.${g} missing`);
      }
    });

    await t.test('node integration is off in the renderer', async () => {
      const leaked = await window.evaluate(() => ({
        require: typeof window.require,
        process: typeof window.process
      }));
      assert.strictEqual(leaked.require, 'undefined', 'require leaked into the renderer');
      assert.strictEqual(leaked.process, 'undefined', 'process leaked into the renderer');
    });

    await t.test('IPC: tabs:list returns the restored tab', async () => {
      const tabs = await window.evaluate(() => window.eye.tabs.list());
      assert.ok(Array.isArray(tabs), 'tabs.list did not return an array');
      assert.strictEqual(tabs.length, 1, 'expected one restored tab');
      assert.strictEqual(tabs[0].active, true);
      assert.strictEqual(tabs[0].private, false);
    });

    await t.test('IPC: tab:new adds a tab and it becomes active', async () => {
      const before = await window.evaluate(() => window.eye.tabs.list());
      await window.evaluate(() => window.eye.tabs.create('aibrowser://newtab'));
      const after = await window.evaluate(() => window.eye.tabs.list());
      assert.strictEqual(after.length, before.length + 1);
      assert.strictEqual(after.filter((x) => x.active).length, 1, 'exactly one tab must be active');
    });

    await t.test('IPC: tab:private creates a private tab', async () => {
      await window.evaluate(() => window.eye.tab.createPrivate());
      const tabs = await window.evaluate(() => window.eye.tabs.list());
      assert.ok(tabs.some((x) => x.private), 'no private tab was created');
    });

    await t.test('IPC: tab:close removes a tab', async () => {
      const before = await window.evaluate(() => window.eye.tabs.list());
      const victim = before.find((x) => !x.active);
      assert.ok(victim, 'need a non-active tab to close');
      await window.evaluate((id) => window.eye.tabs.close(id), victim.id);
      const after = await window.evaluate(() => window.eye.tabs.list());
      assert.strictEqual(after.length, before.length - 1);
      assert.ok(!after.some((x) => x.id === victim.id), 'closed tab still listed');
    });

    await t.test('IPC: perf:stats returns real metrics', async () => {
      const stats = await window.evaluate(() => window.eye.perf());
      assert.ok(stats.processes >= 1, 'no processes reported');
      assert.ok(typeof stats.memoryMB === 'number' && stats.memoryMB > 0, 'no memory reported');
      assert.ok(typeof stats.cpu === 'number' && Number.isFinite(stats.cpu), 'cpu is not a number');
      assert.ok(typeof stats.tabs === 'number');
    });

    await t.test('IPC: shieldCtl.state reflects settings', async () => {
      const state = await window.evaluate(() => window.eye.shieldCtl.state());
      assert.strictEqual(typeof state.httpsFirst, 'boolean');
      assert.ok(Array.isArray(state.allow));
    });

    await t.test('IPC: zoom:set clamps within bounds', async () => {
      const zoomed = await window.evaluate(() => window.eye.zoom.set(0.5));
      assert.ok(zoomed >= 0.25 && zoomed <= 3, `zoom out of range: ${zoomed}`);
      await window.evaluate(() => window.eye.zoom.reset());
    });

    await t.test('IPC: ai:config never returns a raw provider key', async () => {
      const cfg = await window.evaluate(() => window.eye.ai.config());
      const raw = JSON.stringify(cfg);
      assert.ok(!/sk-or-v1-[A-Za-z0-9]{8,}/.test(raw), 'a provider key leaked to the renderer');
      assert.strictEqual(typeof cfg.enabled, 'boolean');
    });

    await t.test('main process reports a version', async () => {
      const version = await app.evaluate(({ app: a }) => a.getVersion());
      assert.match(version, /^\d+\.\d+\.\d+/);
    });
  } finally {
    await shutdown(ctx);
  }
});

test('closing the window quits the app', async () => {
  const ctx = await launch();
  const closed = new Promise((resolve) => ctx.app.once('close', resolve));
  await ctx.app.close();
  await closed;
  try { fs.rmSync(ctx.userDataDir, { recursive: true, force: true }); } catch { /* best effort */ }
});
