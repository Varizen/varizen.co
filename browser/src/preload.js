const { contextBridge, ipcRenderer } = require('electron');

const on = (ch) => (cb) => { const h = (_e, ...a) => cb(...a); ipcRenderer.on(ch, h); return () => ipcRenderer.off(ch, h); };

contextBridge.exposeInMainWorld('eye', {
  tabs: {
    list: () => ipcRenderer.invoke('tabs:list'),
    create: (url) => ipcRenderer.invoke('tab:new', url),
    close: (id) => ipcRenderer.invoke('tab:close', id),
    activate: (id) => ipcRenderer.invoke('tab:activate', id),
    onUpdate: on('tabs:update'),
    onLoading: on('tab:loading')
  },
  nav: {
    go: (input) => ipcRenderer.invoke('nav:go', input),
    back: () => ipcRenderer.invoke('nav:back'),
    forward: () => ipcRenderer.invoke('nav:forward'),
    reload: () => ipcRenderer.invoke('nav:reload'),
    stop: () => ipcRenderer.invoke('nav:stop'),
    state: () => ipcRenderer.invoke('nav:state')
  },
  tab: {
    createPrivate: () => ipcRenderer.invoke('tab:private'),
    onCrashed: on('tab:crashed')
  },
  find: {
    start: (t) => ipcRenderer.invoke('find:start', t),
    stop: () => ipcRenderer.invoke('find:stop'),
    onResult: on('find:result')
  },
  zoom: {
    set: (d) => ipcRenderer.invoke('zoom:set', d),
    reset: () => ipcRenderer.invoke('zoom:reset')
  },
  chromeHeight: (h) => ipcRenderer.invoke('chrome:height', h),
  perf: () => ipcRenderer.invoke('perf:stats'),
  ai: {
    ask: (q, withPage) => ipcRenderer.invoke('ai:ask', q, withPage),
    config: () => ipcRenderer.invoke('ai:config'),
    save: (cfg) => ipcRenderer.invoke('ai:save', cfg),
    agent: (q) => ipcRenderer.invoke('agent:run', q),
    status: () => ipcRenderer.invoke('ai:status')
  },
  mcp: {
    list: () => ipcRenderer.invoke('mcp:list'),
    add: (cfg) => ipcRenderer.invoke('mcp:add', cfg),
    remove: (id) => ipcRenderer.invoke('mcp:remove', id),
    discover: (id) => ipcRenderer.invoke('mcp:discover', id),
    allow: (key, on) => ipcRenderer.invoke('mcp:allow', key, on),
    call: (id, tool, args) => ipcRenderer.invoke('mcp:call', id, tool, args)
  },
  shieldCtl: {
    allow: (host, on) => ipcRenderer.invoke('shield:allow', host, on),
    state: () => ipcRenderer.invoke('shield:state')
  },
  downloads: { control: (id, a) => ipcRenderer.invoke('downloads:control', id, a), onUpdate: on('downloads:update') },
  panelWidth: (w) => ipcRenderer.invoke('panel:width', w),
  shield: { onBlocked: on('shield:blocked') },
  bookmarks: {
    list: () => ipcRenderer.invoke('bookmarks:list'),
    add: (b) => ipcRenderer.invoke('bookmarks:add', b),
    remove: (id) => ipcRenderer.invoke('bookmarks:remove', id),
    update: (id, up) => ipcRenderer.invoke('bookmarks:update', id, up),
    toggleBar: (id) => ipcRenderer.invoke('bookmarks:toggleBar', id),
    importExternal: () => ipcRenderer.invoke('bookmarks:import')
  },
  xdm: {
    getDrives: () => ipcRenderer.invoke('xdm:drives:get'),
    setDrives: (cfg) => ipcRenderer.invoke('xdm:drives:set', cfg),
    download: (url) => ipcRenderer.invoke('xdm:download', url),
    control: (id, act) => ipcRenderer.invoke('xdm:control', id, act)
  },
  zenbox: {
    accounts: () => ipcRenderer.invoke('zenbox:accounts'),
    addAccount: (acc) => ipcRenderer.invoke('zenbox:account:add', acc),
    removeAccount: (id) => ipcRenderer.invoke('zenbox:account:remove', id),
    list: (filter) => ipcRenderer.invoke('zenbox:list', filter),
    get: (id) => ipcRenderer.invoke('zenbox:get', id),
    markRead: (id, read) => ipcRenderer.invoke('zenbox:markRead', id, read),
    star: (id) => ipcRenderer.invoke('zenbox:star', id),
    move: (id, folder) => ipcRenderer.invoke('zenbox:move', id, folder),
    send: (payload) => ipcRenderer.invoke('zenbox:send', payload),
    secureSession: (id, pass) => ipcRenderer.invoke('zenbox:secureSession', id, pass),
    analyze: () => ipcRenderer.invoke('zenbox:analyze'),
    aiAction: (action, id, opts) => ipcRenderer.invoke('zenbox:aiAction', action, id, opts),
    signatures: () => ipcRenderer.invoke('zenbox:signatures')
  },
  settings: { get: (k) => ipcRenderer.invoke('settings:get', k), set: (k, v) => ipcRenderer.invoke('settings:set', k, v) },
  reset: () => ipcRenderer.invoke('app:reset'),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url)
});
