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
  if ($('#status-url')) $('#status-url').textContent = active?.url?.replace(/^https?:\/\//, '') || 'Ready';
  $('#lock').textContent = active?.url?.startsWith('https:') ? '🔒' : active?.url?.startsWith('http:') ? '⚠' : '🔒';
}
eye.tabs.onUpdate(renderTabs);
eye.tabs.list().then(renderTabs);

$('#newtab').onclick = () => eye.tabs.create();
$('#omnibox').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { eye.nav.go(e.target.value.trim()); e.target.blur(); }
});
function syncNavState() {
  if (eye.nav.state) {
    eye.nav.state().then((s) => {
      if (!s) return;
      $('#btn-back').style.opacity = s.canGoBack ? '1' : '0.4';
      $('#btn-forward').style.opacity = s.canGoForward ? '1' : '0.4';
      if (s.isLoading) {
        $('#btn-reload').classList.add('hidden');
        $('#btn-stop').classList.remove('hidden');
      } else {
        $('#btn-stop').classList.add('hidden');
        $('#btn-reload').classList.remove('hidden');
      }
    }).catch(() => {});
  }
}
setInterval(syncNavState, 800);

eye.tabs.onLoading((id, loading) => {
  if (loading) {
    $('#btn-reload').classList.add('hidden');
    $('#btn-stop').classList.remove('hidden');
  } else {
    $('#btn-stop').classList.add('hidden');
    $('#btn-reload').classList.remove('hidden');
  }
  syncNavState();
});

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
  if (name === 'zenbox') initZenBox();
  if (name === 'services') initServices();
  if (name === 'bm') renderBookmarkLibrary();
  if (name === 'dl') refreshXdmDrives();
  if (name === 'settings') { refreshShield(); refreshGateway(); refreshSettingsDrives(); }
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

// ---------- Z Services launcher ----------
let svcLoading = false;
async function initServices() {
  const list = $('#svc-list');
  if (svcLoading) return;
  svcLoading = true;
  list.innerHTML = '<div class="svc-loading">Checking local services…</div>';
  try {
    const services = await eye.services.list();
    const byId = { zmeet: '📹', zcal: '📅', zmail: '✉', ztalk: '💬' };
    list.innerHTML = services
      .map(
        (s) => `<div class="svc-item ${s.online ? 'online' : 'offline'}" data-id="${s.id}">
          <div class="svc-icon">${byId[s.id] || 'Z'}</div>
          <div class="svc-main">
            <div class="svc-name">${s.name}</div>
            <div class="svc-desc">${s.desc}</div>
            <div class="svc-meta">
              <span class="svc-status">${s.online ? '● online' : '○ offline'}${s.status ? ` · ${s.status}` : ''}</span>
              <span class="svc-url">${s.url}</span>
            </div>
          </div>
          <button class="svc-open" data-open="${s.id}" ${s.online ? '' : 'disabled'}>Open</button>
        </div>`
      )
      .join('');
    const online = services.filter((s) => s.online).length;
    $('#svc-foot').textContent = `${online} of ${services.length} Z services online`;
    list.querySelectorAll('[data-open]').forEach((btn) => {
      btn.onclick = () => eye.services.open(btn.dataset.open);
    });
  } catch (e) {
    list.innerHTML = `<div class="svc-loading">Could not probe services: ${e.message}</div>`;
  } finally {
    svcLoading = false;
  }
}
$('#svc-refresh').onclick = initServices;

$('#btn-bm').onclick = () => openPanel('bm');
$('#btn-zenbox').onclick = () => openPanel('zenbox');
$('#btn-ai').onclick = () => openPanel('ai');
$('#btn-dl').onclick = () => openPanel('dl');
$('#btn-menu').onclick = () => openPanel('settings');
$('#btn-services').onclick = () => openPanel('services');
$('#panel-close').onclick = closePanel;
document.querySelectorAll('#panel-tabs button').forEach((b) => { b.onclick = () => openPanel(b.dataset.panel); });
openPanel('ai');

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
eye.shield.onBlocked(() => {
  $('#blocked').textContent = ++blocked;
  if ($('#status-blocked')) $('#status-blocked').textContent = blocked;
});

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
  else if (mod && e.key === 'm') { e.preventDefault(); openPanel('zenbox'); }
  else if (mod && e.key === 'f') { e.preventDefault(); openFind(); }
  else if (mod && e.shiftKey && e.key === 'N') { e.preventDefault(); eye.tab.createPrivate(); }
  else if (mod && (e.key === '=' || e.key === '+')) { e.preventDefault(); eye.zoom.set(0.1); }
  else if (mod && e.key === '-') { e.preventDefault(); eye.zoom.set(-0.1); }
  else if (mod && e.key === '0') { e.preventDefault(); eye.zoom.reset(); }
});

// ---------- ZenBox UI Logic ----------
let zbCurrentAccount = 'all';
let zbCurrentFolder = 'inbox';
let zbCurrentEmailId = null;
let zbAgentActive = false;
let zbAccountsList = [];
let zbSignaturesList = [];

async function initZenBox() {
  zbAccountsList = await eye.zenbox.accounts();
  zbSignaturesList = await eye.zenbox.signatures();
  renderZenBoxAccounts();
  await loadZenBoxEmails();
}

function renderZenBoxAccounts() {
  const select = $('#zb-account-select');
  const compFrom = $('#zb-comp-from');
  select.innerHTML = '<option value="all">Unified Inbox (All Accounts)</option>';
  compFrom.innerHTML = '';

  zbAccountsList.forEach((a) => {
    const opt = el('option', null, `${a.name} (${a.email})`);
    opt.value = a.id;
    select.append(opt);

    const compOpt = el('option', null, `${a.name} <${a.email}>`);
    compOpt.value = a.id;
    compFrom.append(compOpt);
  });

  select.value = zbCurrentAccount;
  select.onchange = () => {
    zbCurrentAccount = select.value;
    loadZenBoxEmails();
  };

  const defaultSig = zbSignaturesList.find((s) => s.isDefault) || zbSignaturesList[0];
  if (defaultSig) $('#zb-comp-signature').textContent = defaultSig.text;
}

async function loadZenBoxEmails() {
  const query = $('#zb-search').value.trim();
  const filter = {
    accountId: zbCurrentAccount,
    folder: zbCurrentFolder,
    search: query || undefined
  };
  const list = await eye.zenbox.list(filter);
  renderZenBoxList(list);
}

function renderZenBoxList(list) {
  const container = $('#zb-email-list');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:20px 0;">No emails in this view.</p>';
    return;
  }

  list.forEach((m) => {
    const item = el('div', 'zb-mail-item' + (!m.isRead ? ' unread' : ''));
    const top = el('div', 'zb-mail-top');
    const sender = el('div', 'zb-mail-sender');

    const acc = zbAccountsList.find((a) => a.id === m.accountId);
    const dot = el('span', 'zb-provider-dot');
    dot.style.background = acc?.color || '#FF6B35';
    sender.append(dot);
    sender.append(el('span', null, m.from.name || m.from.email));

    const time = el('span', 'zb-mail-time', new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric' }));
    top.append(sender, time);

    const subj = el('div', 'zb-mail-subj', m.subject || '(No Subject)');
    const snip = el('div', 'zb-mail-snippet', m.snippet || '');

    const badges = el('div', 'zb-mail-badges');
    if (m.isSecureSession) badges.append(el('span', 'zb-badge secure', '🔒 E2EE Secure Session'));
    if (m.tags?.includes('Suspicious')) badges.append(el('span', 'zb-badge phishing', '⚠ Phishing Risk'));
    if (m.hasAttachments) badges.append(el('span', 'zb-badge', '📎 Attachments'));
    if (m.isStarred) badges.append(el('span', 'zb-badge', '★ Starred'));

    item.append(top, subj, snip, badges);
    item.onclick = () => openZenBoxDetail(m.id);
    container.append(item);
  });
}

async function openZenBoxDetail(id) {
  zbCurrentEmailId = id;
  const msg = await eye.zenbox.get(id);
  if (!msg) return;

  await eye.zenbox.markRead(id, true);
  $('#zb-email-list').classList.add('hidden');
  $('#zb-email-detail').classList.remove('hidden');
  $('#zb-ai-result').classList.add('hidden');
  $('#zb-ai-result').textContent = '';

  const detailBox = $('#zb-detail-content');
  detailBox.innerHTML = '';

  // Meta header
  const meta = el('div', 'zb-detail-meta');
  meta.append(el('h3', null, msg.subject));
  const r1 = el('div', 'zb-detail-row');
  r1.append(el('span', null, `From: ${msg.from.name} <${msg.from.email}>`), el('span', null, new Date(msg.date).toLocaleString()));
  const r2 = el('div', 'zb-detail-row');
  r2.append(el('span', null, `To: ${(msg.to || []).map((t) => t.email || t.name).join(', ')}`));
  meta.append(r1, r2);

  // Attachments bar if present
  if (msg.attachments && msg.attachments.length) {
    const attRow = el('div', 'zb-detail-row', `Attachments: ${msg.attachments.map((a) => `${a.name} (${a.size})`).join(' · ')}`);
    meta.append(attRow);
  }
  detailBox.append(meta);

  // Secure Session or Plain Body
  if (msg.isSecureSession && !msg.isDecrypted) {
    const vault = el('div', 'zb-secure-vault');
    vault.append(el('h4', null, '🔒 ZMail Secure Session Protected'));
    vault.append(el('p', 'muted', 'This message was delivered with zero-knowledge end-to-end encryption. It is isolated from regular email storage and unauthenticated readers.'));
    const decryptBtn = el('button', 'primary', 'Authenticate & Establish Secure Session');
    decryptBtn.onclick = async () => {
      decryptBtn.textContent = 'Verifying Keys…';
      try {
        const sess = await eye.zenbox.secureSession(msg.id);
        openZenBoxDetail(msg.id);
      } catch (err) {
        alert('Authentication failed: ' + err.message);
      }
    };
    vault.append(decryptBtn);
    detailBox.append(vault);
  } else {
    const bodyBox = el('div', 'zb-detail-body', msg.body || msg.snippet || '');
    if (msg.isSecureSession) {
      const banner = el('div', 'zb-badge secure', '🔒 End-to-End Encrypted Session Active · Zero-Knowledge Memory Bounds');
      banner.style.marginBottom = '6px';
      detailBox.append(banner);
    }
    detailBox.append(bodyBox);
  }

  // Update actions state
  $('#zb-act-star').textContent = msg.isStarred ? '★' : '☆';
  $('#zb-boundary-indicator').textContent = msg.isSecureSession ? '🔒 Secure Session Isolated' : 'Audited Boundary';
}

function closeZenBoxDetail() {
  zbCurrentEmailId = null;
  $('#zb-email-detail').classList.add('hidden');
  $('#zb-email-list').classList.remove('hidden');
  loadZenBoxEmails();
}

// Detail View Buttons
$('#zb-detail-back').onclick = closeZenBoxDetail;
$('#zb-act-star').onclick = async () => {
  if (!zbCurrentEmailId) return;
  const updated = await eye.zenbox.star(zbCurrentEmailId);
  $('#zb-act-star').textContent = updated.isStarred ? '★' : '☆';
};
$('#zb-act-archive').onclick = async () => {
  if (!zbCurrentEmailId) return;
  await eye.zenbox.move(zbCurrentEmailId, 'archive');
  closeZenBoxDetail();
};
$('#zb-act-spam').onclick = async () => {
  if (!zbCurrentEmailId) return;
  await eye.zenbox.move(zbCurrentEmailId, 'spam');
  closeZenBoxDetail();
};
$('#zb-act-reply').onclick = async () => {
  if (!zbCurrentEmailId) return;
  const msg = await eye.zenbox.get(zbCurrentEmailId);
  if (!msg) return;
  openCompose({
    to: msg.from.email,
    subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
    isSecureSession: msg.isSecureSession
  });
};

// Folder Chips
document.querySelectorAll('.zb-chip').forEach((chip) => {
  chip.onclick = () => {
    document.querySelectorAll('.zb-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    zbCurrentFolder = chip.dataset.folder;
    closeZenBoxDetail();
    loadZenBoxEmails();
  };
});

// Search input
$('#zb-search').addEventListener('input', () => {
  closeZenBoxDetail();
  loadZenBoxEmails();
});

// AI Mailbox Dock Actions
async function runDetailAi(action, opts = {}) {
  if (!zbCurrentEmailId) return;
  const resBox = $('#zb-ai-result');
  resBox.classList.remove('hidden');
  resBox.textContent = 'Eye AI processing…';

  const res = await eye.zenbox.aiAction(action, zbCurrentEmailId, opts);
  if (!res.ok) {
    if (res.blockedByBoundary) {
      resBox.innerHTML = `<b>AI Security Barrier:</b> ${res.text}<br/><button id="zb-btn-grant-sec" class="primary" style="margin-top:6px; font-size:10px;">Grant One-Time Explicit Authorization</button>`;
      $('#zb-btn-grant-sec').onclick = () => runDetailAi(action, { explicitSecurePermission: true });
    } else {
      resBox.textContent = 'AI error: ' + (res.text || 'Unable to execute');
    }
    return;
  }

  if (action === 'summarize') resBox.textContent = res.text;
  else if (action === 'extractCommitments') {
    resBox.innerHTML = '<b>Extracted Tasks & Commitments:</b><br/>' +
      res.commitments.map((c) => `• [${c.type}] ${c.item}${c.due ? ' (Due: ' + c.due + ')' : ''}`).join('<br/>');
  } else if (action === 'draftReply') {
    resBox.innerHTML = `<b>Draft Reply:</b><br/>${res.draft}<br/><button id="zb-btn-use-draft" class="primary" style="margin-top:6px; font-size:10px;">Insert into Compose</button>`;
    $('#zb-btn-use-draft').onclick = () => {
      openCompose({ to: res.to, subject: res.subject, body: res.draft });
    };
  } else if (action === 'detectPhishing') {
    resBox.innerHTML = `<b>Phishing Risk: ${res.riskScore}</b><br/>${res.details}`;
  }
}

$('#zb-ai-sum').onclick = () => runDetailAi('summarize');
$('#zb-ai-commitments').onclick = () => runDetailAi('extractCommitments');
$('#zb-ai-draft-tomorrow').onclick = () => runDetailAi('draftReply', { prompt: 'review it tomorrow' });
$('#zb-ai-phishing').onclick = () => runDetailAi('detectPhishing');

// Agent Mode
$('#zb-btn-agent-mode').onclick = async () => {
  zbAgentActive = !zbAgentActive;
  $('#zb-agent-banner').classList.toggle('hidden', !zbAgentActive);
  $('#zb-btn-agent-mode').classList.toggle('on', zbAgentActive);
  if (zbAgentActive) {
    const analysis = await eye.zenbox.analyze();
    const statsBox = $('#zb-agent-stats');
    statsBox.innerHTML = `
      <div class="zb-agent-stat-card"><span>Needs Me</span><b>${analysis.needsMe.length}</b></div>
      <div class="zb-agent-stat-card"><span>AI Can Handle</span><b>${analysis.aiCanHandle.length}</b></div>
      <div class="zb-agent-stat-card"><span>Waiting</span><b>${analysis.waiting.length}</b></div>
      <div class="zb-agent-stat-card"><span>Important</span><b>${analysis.important.length}</b></div>
    `;

    const actsBox = $('#zb-agent-actions');
    actsBox.innerHTML = '';
    analysis.needsMe.forEach((n) => {
      const item = el('div', 'zb-agent-item');
      item.innerHTML = `<span><b>${n.from}:</b> ${n.recommendation}</span>`;
      const btn = el('button', null, 'Resolve');
      btn.onclick = () => openZenBoxDetail(n.id);
      item.append(btn);
      actsBox.append(item);
    });
    analysis.aiCanHandle.forEach((h) => {
      const item = el('div', 'zb-agent-item');
      item.innerHTML = `<span>🤖 ${h.recommendation}</span>`;
      const btn = el('button', null, 'Approve');
      btn.onclick = () => {
        item.style.opacity = '0.5';
        btn.textContent = 'Done ✓';
      };
      item.append(btn);
      actsBox.append(item);
    });
  }
};
$('#zb-agent-close').onclick = () => {
  zbAgentActive = false;
  $('#zb-agent-banner').classList.add('hidden');
};

// Compose
function openCompose(opts = {}) {
  $('#zb-compose-modal').classList.remove('hidden');
  $('#zb-comp-to').value = opts.to || '';
  $('#zb-comp-subject').value = opts.subject || '';
  $('#zb-comp-body').value = opts.body || '';
  $('#zb-comp-secure').checked = Boolean(opts.isSecureSession);
}

$('#zb-btn-compose').onclick = () => openCompose();
$('#zb-compose-close').onclick = () => $('#zb-compose-modal').classList.add('hidden');
$('#zb-comp-send').onclick = async () => {
  const accountId = $('#zb-comp-from').value;
  const to = $('#zb-comp-to').value.trim();
  const subject = $('#zb-comp-subject').value.trim();
  const body = $('#zb-comp-body').value;
  const isSecureSession = $('#zb-comp-secure').checked;

  if (!to) { alert('Please enter recipient'); return; }

  await eye.zenbox.send({ accountId, to, subject, body, isSecureSession });
  $('#zb-compose-modal').classList.add('hidden');
  loadZenBoxEmails();
};

// ---------- Bookmark Bar & Library Logic ----------
async function renderBookmarkBar() {
  const items = await eye.bookmarks.list();
  const barContainer = $('#bm-bar-items');
  if (!barContainer) return;
  barContainer.innerHTML = '';

  const barItems = items.filter((b) => b.bar);
  barItems.forEach((b) => {
    const it = el('div', 'bm-item');
    const title = b.title.toLowerCase();
    const mark = title.includes('varizen') ? 'V' : title.includes('github') ? 'GH' : title.includes('duckduckgo') ? 'D' : title.includes('hacker news') || title.includes('ycombinator') ? 'Y' : title.includes('ko-fi') || title.includes('kofi') ? 'K' : '•';
    const provider = title.includes('github') ? 'github' : title.includes('duckduckgo') ? 'duckduckgo' : title.includes('hacker news') || title.includes('ycombinator') ? 'hackernews' : title.includes('ko-fi') || title.includes('kofi') ? 'kofi' : '';
    it.append(el('span', 'fav ' + provider, mark));
    it.append(el('span', null, b.title));
    it.title = `${b.title}\n${b.url}`;
    it.onclick = () => eye.nav.go(b.url);
    barContainer.append(it);
  });
}
renderBookmarkBar();

$('#bm-bar-overflow').onclick = () => openPanel('bm');

$('#btn-star-page').onclick = async () => {
  const activeTabs = await eye.tabs.list();
  const active = activeTabs.find((t) => t.active);
  if (!active || !active.url || active.url.startsWith('aibrowser://')) return;

  const list = await eye.bookmarks.list();
  const existing = list.find((b) => b.url === active.url);
  if (existing) {
    await eye.bookmarks.remove(existing.id);
    $('#btn-star-page').classList.remove('active');
    $('#btn-star-page').textContent = '☆';
  } else {
    await eye.bookmarks.add({
      title: active.title || active.url,
      url: active.url,
      bar: true,
      folder: 'Favorites'
    });
    $('#btn-star-page').classList.add('active');
    $('#btn-star-page').textContent = '★';
  }
  renderBookmarkBar();
};

async function renderBookmarkLibrary() {
  const query = ($('#bm-search')?.value || '').toLowerCase();
  let list = await eye.bookmarks.list();
  if (query) {
    list = list.filter((b) => b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query));
  }

  const container = $('#bm-list');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:15px 0;">No bookmarks found.</p>';
    return;
  }

  list.forEach((b) => {
    const row = el('div', 'zb-mail-item');
    const top = el('div', 'zb-mail-top');
    const titleSpan = el('span', null, b.title);
    titleSpan.style.fontWeight = '600';

    const right = el('div', null);
    const starBtn = el('button', null, b.bar ? '★ On Bar' : '☆ Bar');
    starBtn.style.fontSize = '10px';
    starBtn.onclick = async (e) => {
      e.stopPropagation();
      await eye.bookmarks.toggleBar(b.id);
      renderBookmarkBar();
      renderBookmarkLibrary();
    };

    const delBtn = el('button', null, '×');
    delBtn.style.fontSize = '13px';
    delBtn.style.color = '#e66';
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await eye.bookmarks.remove(b.id);
      renderBookmarkBar();
      renderBookmarkLibrary();
    };

    right.append(starBtn, delBtn);
    top.append(titleSpan, right);

    const urlSpan = el('div', 'muted', b.url);
    urlSpan.style.fontSize = '11px';
    urlSpan.style.overflow = 'hidden';
    urlSpan.style.textOverflow = 'ellipsis';
    urlSpan.style.whiteSpace = 'nowrap';

    row.append(top, urlSpan);
    row.onclick = () => {
      eye.nav.go(b.url);
      closePanel();
    };
    container.append(row);
  });
}

$('#bm-search')?.addEventListener('input', renderBookmarkLibrary);

$('#btn-bm-import').onclick = async () => {
  $('#btn-bm-import').textContent = 'Importing…';
  const res = await eye.bookmarks.importExternal();
  alert(`One-Way Import Complete!\nImported: ${res.importedCount} new bookmarks.\n${res.securityGuarantee}`);
  $('#btn-bm-import').textContent = 'One-Way Import';
  renderBookmarkBar();
  renderBookmarkLibrary();
};

// ---------- XDM Accelerated Transport & Storage Logic ----------
async function refreshXdmDrives() {
  const drives = await eye.xdm.getDrives();
  if ($('#xdm-drive-status')) {
    const isNonC = !drives.finalDir.toLowerCase().startsWith('c:');
    $('#xdm-drive-status').textContent = isNonC ? `Non-C Drive (${drives.finalDir.slice(0, 3)})` : drives.finalDir.slice(0, 3);
    $('#xdm-drive-status').style.color = isNonC ? 'var(--accent)' : 'inherit';
  }
  if ($('#xdm-temp-path')) $('#xdm-temp-path').textContent = drives.tempDir;
}

async function refreshSettingsDrives() {
  const drives = await eye.xdm.getDrives();
  if ($('#s-xdm-final')) $('#s-xdm-final').value = drives.finalDir;
  if ($('#s-xdm-temp')) $('#s-xdm-temp').value = drives.tempDir;
}

$('#s-xdm-save').onclick = async () => {
  const finalDir = $('#s-xdm-final').value.trim();
  const tempDir = $('#s-xdm-temp').value.trim();
  await eye.xdm.setDrives({ finalDir, tempDir });
  $('#s-xdm-save').textContent = 'Applied ✓';
  setTimeout(() => { $('#s-xdm-save').textContent = 'Apply Storage Paths'; }, 1200);
  refreshXdmDrives();
};

$('#xdm-manual-form').onsubmit = async (e) => {
  e.preventDefault();
  const input = $('#xdm-url-input');
  const url = input.value.trim();
  if (!url) return;
  input.value = '';
  await eye.xdm.download(url);
};

// Hook downloads list renderer to display XDM transport badges and custom target path
eye.downloads.onUpdate((d) => {
  let item = document.getElementById(`dl-${d.id}`);
  const list = $('#dl-list');
  if (!item) {
    if (list.querySelector('.muted')) list.innerHTML = '';
    item = el('div', 'dl');
    item.id = `dl-${d.id}`;
    list.prepend(item);
  }
  const pct = d.total ? Math.round((d.got / d.total) * 100) : 0;
  item.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="name" title="${d.name}">${d.name}</span>
      <span class="zb-badge" style="background:var(--accent); color:#fff; border:none; font-size:9px;">${d.transport || 'XDM Turbo'}</span>
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="meta">
      <span>${(d.got / 1024 / 1024).toFixed(1)} MB ${d.total ? '/ ' + (d.total / 1024 / 1024).toFixed(1) + ' MB' : ''}</span>
      <span>${(d.speed / 1024 / 1024).toFixed(2)} MB/s</span>
      <span>${d.state}</span>
    </div>
    <div class="muted" style="font-size:10px; margin-top:4px; font-family:monospace;">Target: ${d.finalDir || 'Configured non-C drive'}</div>
  `;
});
