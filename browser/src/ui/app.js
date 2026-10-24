const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// ---------- Tabs ----------
function renderTabs(tabs) {
  const box = $('#tabs');
  box.replaceChildren(...tabs.map((t) => {
    const tab = el('div', 'tab' + (t.active ? ' active' : '') + (t.sleeping ? ' sleeping' : '') + (t.private ? ' private' : ''));
    tab.title = t.url;
    tab.append(el('span', 't', (t.private ? '🕶 ' : '') + (t.title || 'New Tab')));
    const x = el('span', 'x', '×');
    x.onclick = (e) => { e.stopPropagation(); eye.tabs.close(t.id); };
    tab.append(x);
    tab.onclick = () => eye.tabs.activate(t.id);
    return tab;
  }));
  const active = tabs.find((t) => t.active);
  if (active && document.activeElement !== $('#omnibox')) $('#omnibox').value = active.url === 'aibrowser://newtab' ? '' : active.url;
  $('#lock').textContent = active?.url?.startsWith('https:') ? '🔒' : active?.url?.startsWith('http:') ? '⚠' : '🔒';
}
eye.tabs.onUpdate(renderTabs);
eye.tabs.list().then(renderTabs);

$('#newtab').onclick = () => eye.tabs.create();
$('#omnibox').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { eye.nav.go(e.target.value.trim()); e.target.blur(); }
});
document.querySelectorAll('[data-nav]').forEach((b) => { b.onclick = () => eye.nav[b.dataset.nav](); });

// ---------- Chrome height (find bar changes it) ----------
function syncChromeHeight() {
  const h = $('#chrome').offsetHeight;
  document.documentElement.style.setProperty('--chrome-h', h + 'px');
  eye.chromeHeight(h);
}
addEventListener('resize', syncChromeHeight);
syncChromeHeight();

// ---------- Find in page ----------
const findbar = $('#findbar');
function openFind() {
  findbar.classList.remove('hidden');
  syncChromeHeight();
  $('#find-input').focus();
  $('#find-input').select();
}
function closeFind() {
  findbar.classList.add('hidden');
  $('#find-count').textContent = '';
  eye.find.stop();
  syncChromeHeight();
}
$('#find-input').addEventListener('input', (e) => {
  const q = e.target.value;
  if (q) eye.find.start(q); else { eye.find.stop(); $('#find-count').textContent = ''; }
});
$('#find-input').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFind();
  if (e.key === 'Enter') eye.find.start(e.target.value);
});
$('#find-close').onclick = closeFind;
eye.find.onResult((matches, active) => {
  $('#find-count').textContent = matches ? `${active}/${matches}` : 'no matches';
});

// ---------- Crash recovery ----------
const crash = $('#crash');
eye.tab.onCrashed(() => crash.classList.remove('hidden'));
$('#crash-reload').onclick = () => { crash.classList.add('hidden'); eye.nav.reload(); };
$('#crash-close').onclick = () => {
  crash.classList.add('hidden');
  const a = document.querySelector('.tab.active');
  if (a) a.querySelector('.x').click();
};

// ---------- Panel ----------
const panel = $('#panel');
function openPanel(name) {
  panel.classList.remove('hidden');
  document.querySelectorAll('#panel-tabs button').forEach((b) => b.classList.toggle('active', b.dataset.panel === name));
  document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('hidden', p.id !== 'p-' + name));
  eye.panelWidth(panel.offsetWidth);
  watchPerf(name === 'perf');
  if (name === 'mcp') renderMcp();
  if (name === 'settings') { refreshShield(); refreshGateway(); }
}

async function refreshGateway() {
  const s = await eye.ai.status();
  $('#gw-state').textContent = s.label;
  $('#gw-state').style.color = s.ok ? 'var(--accent)' : '#e66';
}
function closePanel() {
  panel.classList.add('hidden');
  eye.panelWidth(0);
  watchPerf(false);
}
$('#btn-ai').onclick = () => openPanel('ai');
$('#btn-dl').onclick = () => openPanel('dl');
$('#btn-menu').onclick = () => openPanel('settings');
$('#panel-close').onclick = closePanel;
document.querySelectorAll('#panel-tabs button').forEach((b) => { b.onclick = () => openPanel(b.dataset.panel); });

// ---------- Eye AI ----------
function addMsg(role, text) {
  const m = el('div', 'msg ' + role, text);
  $('#chat').append(m);
  $('#chat').scrollTop = $('#chat').scrollHeight;
  return m;
}
let agentMode = false;
$('#agent-toggle').onclick = () => {
  agentMode = !agentMode;
  $('#agent-toggle').textContent = 'Agent: ' + (agentMode ? 'on' : 'off');
  $('#agent-toggle').classList.toggle('on', agentMode);
};

async function ask(q) {
  addMsg('user', q);
  const pending = addMsg('ai', '…');
  if (agentMode) {
    const res = await eye.ai.agent(q);
    pending.textContent = res.text;
    if (res.trace?.length) {
      const t = el('div', 'trace');
      res.trace.forEach((s) => t.append(el('div', null, `⚙ ${s.tool} → ${String(s.result).slice(0, 160)}`)));
      $('#chat').append(t);
      $('#chat').scrollTop = $('#chat').scrollHeight;
    }
  } else {
    const res = await eye.ai.ask(q, true);
    pending.textContent = res.text;
    if (!res.ok) pending.classList.add('err');
  }
}
$('#ask-form').onsubmit = (e) => {
  e.preventDefault();
  const q = $('#ask').value.trim();
  if (!q) return;
  $('#ask').value = '';
  ask(q);
};
document.querySelectorAll('.chips button').forEach((b) => { b.onclick = () => ask(b.dataset.prompt); });

// ---------- Downloads ----------
const dlMap = new Map();
const fmt = (b) => b > 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : (b / 1e3).toFixed(0) + ' KB';
const eta = (s) => s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

eye.downloads.onUpdate((d) => {
  dlMap.set(d.id, d);
  const list = $('#dl-list');
  list.replaceChildren(...[...dlMap.values()].map((x) => {
    const box = el('div', 'dl');
    box.append(el('div', 'name', x.name));
    const bar = el('div', 'bar'); const fill = el('i');
    fill.style.width = (x.total ? (x.got / x.total) * 100 : 0) + '%';
    bar.append(fill); box.append(bar);
    const meta = el('div', 'meta');
    meta.append(el('span', null, `${fmt(x.got)} / ${x.total ? fmt(x.total) : '?'}`));
    meta.append(el('span', null, `${fmt(x.speed)}/s · ${eta(x.eta)}`));
    box.append(meta);
    const acts = el('div', 'acts');
    const mk = (label, action) => { const b = el('button', null, label); b.onclick = () => eye.downloads.control(x.id, action); return b; };
    acts.append(x.paused ? mk('Resume', 'resume') : mk('Pause', 'pause'), mk('Cancel', 'cancel'));
    box.append(acts);
    return box;
  }));
  if (!dlMap.size) list.replaceChildren(el('p', 'muted', 'No downloads yet.'));
});

// ---------- Shield ----------
let blocked = 0;
eye.shield.onBlocked(() => { $('#blocked').textContent = ++blocked; });

async function refreshShield() {
  const s = await eye.shieldCtl.state();
  $('#sh-host').textContent = s.host || '—';
  const exempt = s.allow.includes(s.host);
  $('#sh-toggle').textContent = exempt ? 'Re-enable blocking on this site' : 'Exempt this site from blocking';
  $('#sh-toggle').dataset.exempt = exempt ? '1' : '';
}
$('#sh-toggle').onclick = async () => {
  const s = await eye.shieldCtl.state();
  if (!s.host) return;
  await eye.shieldCtl.allow(s.host, !s.allow.includes(s.host));
  refreshShield();
};

// ---------- MCP ----------
async function renderMcp() {
  const list = await eye.mcp.list();
  const box = $('#mcp-list');
  if (!list.length) { box.replaceChildren(el('p', 'muted', 'No MCP servers configured.')); return; }
  box.replaceChildren(...list.map((s) => {
    const card = el('div', 'dl');
    card.append(el('div', 'name', s.name));
    card.append(el('div', 'meta', `${s.command} ${(s.args || []).join(' ')}`));
    const acts = el('div', 'acts');
    const disc = el('button', null, 'Discover tools');
    disc.onclick = async () => {
      disc.textContent = 'Connecting…';
      try {
        const tools = await eye.mcp.discover(s.id);
        const wrap = el('div', 'tools');
        tools.forEach((t) => {
          const key = `${s.id}:${t.name}`;
          const row = el('label', 'row');
          const cb = el('input'); cb.type = 'checkbox';
          cb.checked = s.allowed.includes(key);
          cb.onchange = () => eye.mcp.allow(key, cb.checked);
          row.append(cb, el('span', null, t.name));
          row.title = t.description || '';
          wrap.append(row);
        });
        card.append(wrap);
        disc.remove();
      } catch (e) { disc.textContent = 'Failed: ' + e.message; }
    };
    const del = el('button', null, 'Remove');
    del.onclick = async () => { await eye.mcp.remove(s.id); renderMcp(); };
    acts.append(disc, del);
    card.append(acts);
    return card;
  }));
}
$('#mcp-add').onclick = async () => {
  const name = $('#mcp-name').value.trim();
  const command = $('#mcp-cmd').value.trim();
  if (!name || !command) return;
  const args = $('#mcp-args').value.trim().split(/\s+/).filter(Boolean);
  await eye.mcp.add({ name, command, args });
  $('#mcp-name').value = $('#mcp-cmd').value = $('#mcp-args').value = '';
  renderMcp();
};

// ---------- Performance Center ----------
let perfTimer = null;
async function refreshPerf() {
  const s = await eye.perf();
  $('#pf-proc').textContent = s.processes;
  $('#pf-cpu').textContent = s.cpu + '%';
  $('#pf-mem').textContent = s.memoryMB + ' MB';
  $('#pf-tabs').textContent = s.tabs;
  $('#pf-sleep').textContent = s.sleeping;
}
function watchPerf(on) {
  clearInterval(perfTimer);
  if (on) { refreshPerf(); perfTimer = setInterval(refreshPerf, 2000); }
}

// ---------- Settings ----------
function toggleLocalBoxes() {
  const on = $('#s-local').checked;
  ['#local-box', '#local-model-box', '#local-key-box'].forEach((s) => $(s).classList.toggle('hidden', !on));
}
$('#s-local').onchange = toggleLocalBoxes;

(async () => {
  const cfg = await eye.ai.config();
  $('#s-gw-url').value = cfg.gatewayUrl;
  $('#s-gw-token').placeholder = cfg.hasGatewayToken ? '•••••••• (saved)' : 'issued by the gateway';
  $('#s-endpoint').value = cfg.endpoint;
  $('#s-model').value = cfg.model;
  $('#s-enabled').checked = cfg.enabled;
  $('#s-local').checked = cfg.useLocal;
  $('#s-key').placeholder = cfg.hasKey ? '•••••••• (saved)' : 'optional';
  $('#s-sleep').value = await eye.settings.get('sleepMinutes');
  $('#s-https').checked = await eye.settings.get('httpsFirst');
  toggleLocalBoxes();
})();

$('#s-save').onclick = async () => {
  await eye.ai.save({
    gatewayUrl: $('#s-gw-url').value.trim(),
    gatewayToken: $('#s-gw-token').value,
    endpoint: $('#s-endpoint').value.trim(),
    model: $('#s-model').value.trim(),
    enabled: $('#s-enabled').checked,
    useLocal: $('#s-local').checked,
    apiKey: $('#s-key').value
  });
  await eye.settings.set('sleepMinutes', Number($('#s-sleep').value) || 10);
  await eye.settings.set('httpsFirst', $('#s-https').checked);
  $('#s-key').value = '';
  $('#s-gw-token').value = '';
  $('#s-key').placeholder = '•••••••• (saved)';
  $('#s-gw-token').placeholder = '•••••••• (saved)';
  $('#s-save').textContent = 'Saved ✓';
  setTimeout(() => { $('#s-save').textContent = 'Save'; }, 1200);
  refreshGateway();
};

$('#s-reset').onclick = async () => {
  if (!confirm('Reset AiBrowser? Settings, AI memory and site data will be cleared.')) return;
  await eye.reset();
  location.reload();
};

// ---------- Menu actions ----------
$('#m-private').onclick = () => eye.tab.createPrivate();
$('#m-find').onclick = openFind;
$('#m-zoomin').onclick = () => eye.zoom.set(0.1);
$('#m-zoomout').onclick = () => eye.zoom.set(-0.1);
$('#m-zoomreset').onclick = () => eye.zoom.reset();

// ---------- Shortcuts ----------
addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === 't') { e.preventDefault(); eye.tabs.create(); }
  else if (mod && e.key === 'w') { e.preventDefault(); const a = document.querySelector('.tab.active'); if (a) a.querySelector('.x').click(); }
  else if (mod && e.key === 'l') { e.preventDefault(); $('#omnibox').focus(); $('#omnibox').select(); }
  else if (mod && e.key === 'j') { e.preventDefault(); openPanel('dl'); }
  else if (mod && e.key === 'i') { e.preventDefault(); openPanel('ai'); }
  else if (mod && e.key === 'f') { e.preventDefault(); openFind(); }
  else if (mod && e.shiftKey && e.key === 'N') { e.preventDefault(); eye.tab.createPrivate(); }
  else if (mod && (e.key === '=' || e.key === '+')) { e.preventDefault(); eye.zoom.set(0.1); }
  else if (mod && e.key === '-') { e.preventDefault(); eye.zoom.set(-0.1); }
  else if (mod && e.key === '0') { e.preventDefault(); eye.zoom.reset(); }
});
