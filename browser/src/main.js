const { app, BrowserWindow, WebContentsView, ipcMain, session, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const settings = require('./modules/settings');
const shield = require('./modules/shield');
const downloads = require('./modules/downloads');
const ai = require('./modules/ai');
const mcp = require('./modules/mcp');
const zenbox = require('./modules/zenbox');
const bookmarks = require('./modules/bookmarks');
const xdm = require('./modules/xdm');

let chromeH = 76; // grows when the find bar is visible
const statusBarH = 30;
let win, ui;
const tabs = new Map(); // id -> { view, sleeping, title, url, private }
let activeId = null;
let nextId = 1;
let panelWidth = 0; // native views render above the UI, so the page must shrink

const send = (ch, ...a) => {
  try {
    if (ui && !ui.isDestroyed() && ui.webContents && !ui.webContents.isDestroyed()) {
      ui.webContents.send(ch, ...a);
    }
  } catch {}
};
const sessionFile = () => path.join(app.getPath('userData'), 'session.json');

function createTab(url = 'https://aibrowser.varize.co/', activate = true, isPrivate = false) {
  const id = nextId++;
  const view = new WebContentsView({
    webPreferences: {
      sandbox: true, contextIsolation: true, nodeIntegration: false,
      partition: isPrivate ? 'private' : 'persist:main'
    }
  });
  win.contentView.addChildView(view);
  const wc = view.webContents;
  const tab = { view, sleeping: false, title: 'New Tab', url, lastActive: Date.now(), private: isPrivate };
  tabs.set(id, tab);

  const sync = () => {
    if (tab.sleeping) return; // ignore about:blank navigation while asleep
    tab.title = wc.getTitle() || 'New Tab';
    tab.url = wc.getURL();
    if (id === activeId) tab.lastActive = Date.now();
    send('tabs:update', listTabs());
  };
  wc.on('page-title-updated', sync);
  wc.on('did-navigate', sync);
  wc.on('did-navigate-in-page', sync);
  wc.on('did-start-loading', () => send('tab:loading', id, true));
  wc.on('did-stop-loading', () => send('tab:loading', id, false));
  wc.on('render-process-gone', () => send('tab:crashed', id));
  wc.on('found-in-page', (_e, r) => send('find:result', r.matches, r.activeMatchOrdinal));
  wc.setWindowOpenHandler(({ url: u }) => { createTab(u, true, tab.private); return { action: 'deny' }; });

  if (url === 'aibrowser://newtab') wc.loadFile(path.join(__dirname, 'ui/newtab.html'));
  else wc.loadURL(url);

  if (activate) activateTab(id);
  else layout();
  send('tabs:update', listTabs());
  return id;
}

function listTabs() {
  return [...tabs].map(([id, t]) => ({
    id, title: t.title, url: t.url, sleeping: t.sleeping, private: t.private, active: id === activeId
  }));
}

function layout() {
  if (!win) return;
  const { width, height } = win.getContentBounds();
  const w = Math.max(0, width - panelWidth);
  for (const [id, t] of tabs) {
    if (id === activeId) {
      t.view.setBounds({ x: 0, y: chromeH, width: w, height: Math.max(0, height - chromeH - statusBarH) });
      t.view.setVisible(true);
    } else {
      t.view.setVisible(false);
    }
  }
}

function activateTab(id) {
  const tab = tabs.get(id);
  if (!tab) return;
  if (tab.sleeping) { // wake: reload last URL
    tab.sleeping = false;
    tab.view.webContents.loadURL(tab.url);
  }
  activeId = id;
  tab.lastActive = Date.now();
  layout();
  send('tabs:update', listTabs());
}

function closeTab(id) {
  const tab = tabs.get(id);
  if (!tab) return;
  win.contentView.removeChildView(tab.view);
  tab.view.webContents.close();
  tabs.delete(id);
  if (activeId === id) {
    const next = tabs.keys().next().value;
    if (next) activateTab(next); else createTab();
  }
  send('tabs:update', listTabs());
}

// ---- Session restore (Eye Recovery) ----
function saveSession() {
  const urls = [...tabs.values()].filter((t) => !t.private).map((t) => t.url).filter((u) => u && u !== 'about:blank');
  try { fs.writeFileSync(sessionFile(), JSON.stringify({ urls, active: activeId })); } catch {}
}

function restoreSession() {
  let urls = [];
  try { urls = JSON.parse(fs.readFileSync(sessionFile(), 'utf8')).urls || []; } catch {}
  if (!urls.length) return createTab();
  urls.forEach((u, i) => createTab(u, i === 0));
}

// Tab sleeping: unload background tabs after idle to free RAM.
setInterval(() => {
  const limit = settings.get('sleepMinutes') * 60000;
  for (const [id, t] of tabs) {
    if (id === activeId || t.sleeping) continue;
    if (Date.now() - (t.lastActive || 0) > limit) {
      t.url = t.view.webContents.getURL();
      t.sleeping = true;
      t.view.webContents.loadURL('about:blank');
      send('tabs:update', listTabs());
    }
  }
}, 30000);

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 720, minHeight: 480,
    backgroundColor: '#1A1A1A', titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#1A1A1A', symbolColor: '#FAFAFA', height: 36 },
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true }
  });
  ui = win;
  win.loadFile(path.join(__dirname, 'ui/index.html'));
  win.on('resize', layout);
  win.on('close', saveSession);
  win.on('closed', () => {
    win = null;
    session.fromPartition('private').clearStorageData().catch(() => {});
  });

  const ses = session.fromPartition('persist:main');
  shield.install(ses, {
    allow: () => settings.get('shieldAllow'),
    httpsFirst: () => settings.get('httpsFirst'),
    onBlock: (host) => send('shield:blocked', host)
  });
  downloads.install(ses, (d) => send('downloads:update', d));
  xdm.install(ses, (d) => send('downloads:update', d));
  ses.setUserAgent(ses.getUserAgent().replace(/Electron\/\S+\s/, '').replace(/AiBrowser\/\S+\s/, ''));

  win.webContents.once('did-finish-load', () => {
    zenbox.init(app.getPath('userData'));
    bookmarks.init(app.getPath('userData'));
    xdm.init();
    restoreSession();
  });
}

// ---- IPC ----
ipcMain.handle('tabs:list', () => listTabs());
ipcMain.handle('tab:new', (_e, url) => createTab(url));
ipcMain.handle('tab:close', (_e, id) => closeTab(id));
ipcMain.handle('tab:activate', (_e, id) => activateTab(id));
ipcMain.handle('nav:go', (_e, input) => {
  const tab = tabs.get(activeId);
  if (!tab || !input) return;
  const isUrl = /^[a-z]+:\/\//i.test(input) || /^[\w-]+(\.[\w-]+)+(\/|$)/.test(input);
  const url = isUrl ? (input.includes('://') ? input : 'https://' + input) : settings.get('searchUrl') + encodeURIComponent(input);
  tab.sleeping = false;
  tab.view.webContents.loadURL(url);
});
ipcMain.handle('nav:back', () => tabs.get(activeId)?.view.webContents.navigationHistory.goBack());
ipcMain.handle('nav:forward', () => tabs.get(activeId)?.view.webContents.navigationHistory.goForward());
ipcMain.handle('nav:reload', () => tabs.get(activeId)?.view.webContents.reload());
ipcMain.handle('nav:stop', () => tabs.get(activeId)?.view.webContents.stop());
ipcMain.handle('nav:state', () => {
  const wc = tabs.get(activeId)?.view.webContents;
  if (!wc) return { canGoBack: false, canGoForward: false, isLoading: false };
  return {
    canGoBack: wc.navigationHistory.canGoBack(),
    canGoForward: wc.navigationHistory.canGoForward(),
    isLoading: wc.isLoading()
  };
});
ipcMain.handle('panel:width', (_e, w) => { panelWidth = Math.max(0, Number(w) || 0); layout(); });

// ---- Z Services registry ----
const Z_SERVICES = [
  { id: 'zmeet', name: 'ZMeet', desc: 'Meetings & live sessions', url: 'http://127.0.0.1:4400', health: '/api/health' },
  { id: 'zcal', name: 'ZCal', desc: 'Calendar & scheduling', url: 'http://127.0.0.1:4300', health: '/api/health' },
  { id: 'zmail', name: 'ZMail', desc: 'Email & secure sessions', url: 'http://127.0.0.1:4200', health: '/api/counts' },
  { id: 'ztalk', name: 'ZTalk', desc: 'Messaging, 14+ platforms', url: 'http://127.0.0.1:4500', health: '/api/health' },
  { id: 'zlet', name: 'Zlet', desc: 'Wallet & financial layer', url: 'http://127.0.0.1:4600', health: '/api/health' }
];

async function probeService(svc) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const res = await fetch(svc.url + svc.health, { signal: ctl.signal });
    clearTimeout(t);
    return { ...svc, online: res.ok, status: res.status };
  } catch {
    return { ...svc, online: false, status: 0 };
  }
}

ipcMain.handle('services:list', async () => {
  const results = await Promise.all(Z_SERVICES.map(probeService));
  return results;
});
ipcMain.handle('services:open', (_e, id) => {
  const svc = Z_SERVICES.find((s) => s.id === id);
  if (!svc) return { ok: false };
  const tabId = createTab(svc.url, true);
  return { ok: true, tabId };
});
ipcMain.handle('chrome:height', (_e, h) => { chromeH = Math.max(0, Number(h) || 76); layout(); });
ipcMain.handle('tab:private', () => createTab('aibrowser://newtab', true, true));
ipcMain.handle('find:start', (_e, text) => {
  const wc = tabs.get(activeId)?.view.webContents;
  if (!wc) return 0;
  wc.findInPage(text);
  return 1;
});
ipcMain.handle('find:stop', () => tabs.get(activeId)?.view.webContents.stopFindInPage('clearSelection'));
ipcMain.handle('zoom:set', (_e, delta) => {
  const wc = tabs.get(activeId)?.view.webContents;
  if (!wc) return 1;
  const z = Math.min(3, Math.max(0.25, wc.getZoomFactor() + delta));
  wc.setZoomFactor(z);
  return z;
});
ipcMain.handle('zoom:reset', () => tabs.get(activeId)?.view.webContents.setZoomFactor(1));
// ---- MCP servers ----
ipcMain.handle('mcp:list', () => settings.get('mcp').map((s) => ({ ...s, allowed: settings.get('mcpAllowed') })));
ipcMain.handle('mcp:add', (_e, cfg) => {
  const list = settings.get('mcp');
  const id = cfg.id || `srv${Date.now()}`;
  list.push({ id, name: cfg.name || id, command: cfg.command, args: cfg.args || [], env: cfg.env || {}, enabled: true });
  settings.save();
  return settings.get('mcp');
});
ipcMain.handle('mcp:remove', (_e, id) => {
  const d = settings.load();
  d.mcp = d.mcp.filter((s) => s.id !== id);
  d.mcpAllowed = d.mcpAllowed.filter((k) => !k.startsWith(id + ':'));
  settings.save();
  return d.mcp;
});
ipcMain.handle('mcp:discover', async (_e, id) => {
  const cfg = settings.get('mcp').find((s) => s.id === id);
  if (!cfg) throw new Error('Unknown MCP server');
  return mcp.discover(cfg);
});
ipcMain.handle('mcp:allow', (_e, key, on) => {
  const d = settings.load();
  d.mcpAllowed = on ? [...new Set([...d.mcpAllowed, key])] : d.mcpAllowed.filter((k) => k !== key);
  settings.save();
  return d.mcpAllowed;
});
ipcMain.handle('mcp:call', async (_e, id, tool, args) => {
  const cfg = settings.get('mcp').find((s) => s.id === id);
  if (!cfg) throw new Error('Unknown MCP server');
  if (!settings.get('mcpAllowed').includes(`${id}:${tool}`)) {
    throw new Error(`Permission denied: ${id}:${tool} is not approved.`);
  }
  return mcp.callTool(cfg, tool, args);
});

// ---- Eye Shield per-site controls ----
ipcMain.handle('shield:allow', (_e, host, on) => {
  const d = settings.load();
  d.shieldAllow = on ? [...new Set([...d.shieldAllow, host])] : d.shieldAllow.filter((h) => h !== host);
  settings.save();
  return d.shieldAllow;
});
ipcMain.handle('shield:state', () => ({
  allow: settings.get('shieldAllow'),
  httpsFirst: settings.get('httpsFirst'),
  host: (() => { try { return new URL(tabs.get(activeId)?.url || '').hostname; } catch { return ''; } })()
}));

ipcMain.handle('perf:stats', () => {
  const m = app.getAppMetrics();
  // Electron returns objects here, not numbers:
  //   cpu    -> { percentCPUUsage, cumulativeCPUUsage, idleWakeupsPerSecond }
  //   memory -> { workingSetSize, peakWorkingSetSize, privateBytes }  (KB)
  const sum = (pick) => m.reduce((a, p) => a + (Number(pick(p)) || 0), 0);
  return {
    processes: m.length,
    cpu: +sum((p) => p.cpu?.percentCPUUsage).toFixed(1),
    memoryMB: Math.round(sum((p) => p.memory?.workingSetSize) / 1024),
    tabs: tabs.size,
    sleeping: [...tabs.values()].filter((t) => t.sleeping).length
  };
});
ipcMain.handle('ai:ask', async (_e, q, withPage) => {
  try { return { ok: true, text: await ai.ask(q, withPage ? await pageContext() : null) }; }
  catch (err) { return { ok: false, text: err.message }; }
});
ipcMain.handle('agent:run', async (_e, q) => {
  try {
    const allowed = settings.get('mcpAllowed');
    const servers = settings.get('mcp').filter((s) => s.enabled);
    const tools = [];
    const map = new Map(); // toolName -> { serverId, name }
    for (const s of servers) {
      let list = [];
      try { list = await mcp.discover(s); } catch { continue; }
      for (const t of list) {
        if (!allowed.includes(`${s.id}:${t.name}`)) continue;
        const flat = `${s.id}__${t.name}`;
        map.set(flat, { serverId: s.id, name: t.name });
        tools.push({
          type: 'function',
          function: { name: flat, description: t.description || '', parameters: t.schema || { type: 'object', properties: {} } }
        });
      }
    }
    const callTool = async (flat, args) => {
      const t = map.get(flat);
      if (!t) throw new Error(`Tool ${flat} is not approved.`);
      const cfg = settings.get('mcp').find((s) => s.id === t.serverId);
      return mcp.callTool(cfg, t.name, args);
    };
    const res = await ai.agent(q, await pageContext(), tools, callTool);
    return { ok: true, ...res };
  } catch (err) { return { ok: false, text: err.message, trace: [] }; }
});
ipcMain.handle('ai:config', () => settings.publicAI());
ipcMain.handle('ai:save', (_e, cfg) => { settings.setAI(cfg); return settings.publicAI(); });
ipcMain.handle('ai:status', async () => {
  const cfg = settings.publicAI();
  if (cfg.useLocal) return { mode: 'local', ok: true, label: 'Local model' };
  if (!cfg.gatewayUrl) return { mode: 'gateway', ok: false, label: 'Not configured' };
  try {
    const token = settings.gatewayToken();
    const res = await fetch(`${cfg.gatewayUrl}/api/v1/eye-ai/status`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return { mode: 'gateway', ok: false, label: 'Unavailable' };
    const s = await res.json();
    if (!s.enabled) return { mode: 'gateway', ok: false, label: 'Disabled' };
    // The gateway reports ok:false when it is enabled but cannot serve (no key,
    // or no install tokens configured). Surface that instead of claiming "Free".
    if (s.ok === false) return { mode: 'gateway', ok: false, label: 'Not configured' };
    return { mode: 'gateway', ok: true, label: `Free · ${s.freeModels || 20} models` };
  } catch {
    return { mode: 'gateway', ok: false, label: 'Unreachable' };
  }
});
ipcMain.handle('downloads:control', (_e, id, action) => downloads.control(id, action));
ipcMain.handle('settings:get', (_e, k) => settings.get(k));
ipcMain.handle('settings:set', (_e, k, v) => { settings.load()[k] = v; settings.save(); });
ipcMain.handle('app:reset', () => { settings.reset(); session.fromPartition('persist:main').clearStorageData(); });
ipcMain.handle('shell:open', (_e, url) => shell.openExternal(url));

// ---- ZenBox IPC handlers ----
ipcMain.handle('zenbox:accounts', () => zenbox.getAccounts());
ipcMain.handle('zenbox:account:add', (_e, acc) => zenbox.addAccount(acc));
ipcMain.handle('zenbox:account:remove', (_e, id) => zenbox.removeAccount(id));
ipcMain.handle('zenbox:list', (_e, filter) => zenbox.listEmails(filter));
ipcMain.handle('zenbox:get', (_e, id) => zenbox.getEmail(id));
ipcMain.handle('zenbox:markRead', (_e, id, read) => zenbox.markRead(id, read));
ipcMain.handle('zenbox:star', (_e, id) => zenbox.toggleStar(id));
ipcMain.handle('zenbox:move', (_e, id, folder) => zenbox.moveFolder(id, folder));
ipcMain.handle('zenbox:send', (_e, payload) => zenbox.sendEmail(payload));
ipcMain.handle('zenbox:secureSession', (_e, msgId, pass) => zenbox.establishSecureSession(msgId, pass));
ipcMain.handle('zenbox:analyze', () => zenbox.analyzeMailbox());
ipcMain.handle('zenbox:aiAction', (_e, action, id, opts) => zenbox.executeAiAction(action, id, opts));
ipcMain.handle('zenbox:signatures', () => zenbox.getSignatures());

// ---- Bookmarks & One-Way Sync Handlers ----
ipcMain.handle('bookmarks:list', () => bookmarks.list());
ipcMain.handle('bookmarks:add', (_e, item) => bookmarks.add(item));
ipcMain.handle('bookmarks:remove', (_e, id) => bookmarks.remove(id));
ipcMain.handle('bookmarks:update', (_e, id, up) => bookmarks.update(id, up));
ipcMain.handle('bookmarks:toggleBar', (_e, id) => bookmarks.toggleBar(id));
ipcMain.handle('bookmarks:import', () => bookmarks.importFromExternalBrowsers());

// ---- XDM Content Transport & Storage Drives ----
ipcMain.handle('xdm:drives:get', () => xdm.getStorageDrives());
ipcMain.handle('xdm:drives:set', (_e, cfg) => xdm.setStorageDrives(cfg));
ipcMain.handle('xdm:download', (_e, url) => xdm.startXdmDownload(url, (d) => send('downloads:update', d)));
ipcMain.handle('xdm:control', (_e, id, act) => xdm.control(id, act));

async function pageContext() {
  const tab = tabs.get(activeId);
  if (!tab || tab.sleeping) return null;
  const wc = tab.view.webContents;
  const text = await wc.executeJavaScript('document.body ? document.body.innerText.slice(0, 12000) : ""').catch(() => '');
  return { url: wc.getURL(), text };
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { mcp.stopAll(); app.quit(); });
