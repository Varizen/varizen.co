/**
 * ZTalk — client. Vanilla ES modules, no framework, no build step.
 *
 * Binds directly to the ZTalk HTTP API and stays honest about what is real:
 *   - seeded conversations report `simulated: true` and are labelled in the header
 *   - AI output is the deterministic local engine unless an operator opts into remote
 *   - nothing is invented client-side; missing states render as empty
 */

/* ------------------------------- plumbing ------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    ...options
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: text.slice(0, 200) };
  }
  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.capability = body?.capability;
    throw err;
  }
  return body;
}

const state = {
  view: 'all',
  search: '',
  platform: 'all',
  conversations: [],
  counts: {},
  vocabulary: { platforms: [], detections: [], tones: [], translationTargets: [] },
  activeId: null,
  active: null,
  messages: [],
  identity: null,
  aiVisible: true,
  aiBusy: false
};

/* --------------------------------- util --------------------------------- */

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function clockOf(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function dayOf(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function initialsOf(name) {
  return String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || '')
    .join('')
    .toUpperCase();
}

function tintFor(seed, alpha = 1) {
  const hash = [...String(seed || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue} 52% ${alpha === 1 ? 42 : 30}%)`;
}

function bytes(n) {
  if (!n) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = Number(n);
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
}

function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .2s ease';
    setTimeout(() => el.remove(), 220);
  }, 2600);
}

/* -------------------------------- render -------------------------------- */

function renderIdentity() {
  const id = state.identity;
  if (!id) return;
  $('#identity').innerHTML = `
    <div class="identity-avatar">${esc(initialsOf(id.name))}</div>
    <div class="identity-text">
      <div class="identity-name">${esc(id.name)}</div>
      <div class="identity-org">${esc(id.organization?.name || id.email)}</div>
    </div>`;
}

function renderCounts() {
  const c = state.counts || {};
  const map = {
    all: c.all,
    unread: c.unread,
    important: c.important,
    groups: c.groups,
    'needs-reply': c.needsReply
  };
  for (const [key, val] of Object.entries(map)) {
    const el = $(`#count-${key}`);
    if (!el) continue;
    el.textContent = val ? String(val) : '';
  }
}

function renderAccounts() {
  const platforms = state.vocabulary.platforms || [];
  const byplatform = new Map();
  for (const conv of state.conversations) {
    byplatform.set(conv.platform, (byplatform.get(conv.platform) || 0) + 1);
  }
  const rows = platforms
    .filter((p) => byplatform.has(p.id))
    .map((p) => {
      const n = byplatform.get(p.id);
      return `<button class="acc" data-platform="${esc(p.id)}">
        <span class="acc-dot" style="background:${esc(p.color)}"></span>
        <span class="acc-name">${esc(p.label)}</span>
        <span class="acc-count">${n}</span>
      </button>`;
    })
    .join('');
  $('#accounts').innerHTML = rows || '<div class="acc-name" style="padding:6px 8px;color:var(--tx-4)">No accounts</div>';
  $$('#accounts .acc').forEach((el) => {
    el.onclick = () => {
      const p = el.dataset.platform;
      state.platform = state.platform === p ? 'all' : p;
      renderConversations();
    };
  });
}

function renderConversations() {
  const list = state.conversations;
  const meta = [];
  if (state.platform !== 'all') {
    const p = state.vocabulary.platforms.find((x) => x.id === state.platform);
    meta.push(`Filtered to ${p?.label || state.platform}`);
  }
  if (state.search) meta.push(`${list.length} match${list.length === 1 ? '' : 'es'} for “${state.search}”`);
  $('#listMeta').textContent = meta.join(' · ');

  if (!list.length) {
    $('#convList').innerHTML = `<div class="placeholder" style="padding:36px 16px">
      <p style="font-size:11.5px">No conversations match this view.</p></div>`;
    return;
  }

  $('#convList').innerHTML = list
    .map((c) => {
      const pmeta = c.platformMeta || {};
      const unread = c.unread > 0;
      const flags = [
        c.important ? '<span class="flag-important" title="Important">★</span>' : '',
        c.needsReply ? '<span class="flag-reply" title="Needs reply">↩</span>' : ''
      ].join('');
      return `<div class="conv ${c.id === state.activeId ? 'active' : ''} ${unread ? 'unread' : ''}"
                   role="option" tabindex="0" data-id="${esc(c.id)}"
                   aria-selected="${c.id === state.activeId}">
        ${c.live ? '<span class="live-dot" title="Live connection"></span>' : ''}
        <div class="conv-avatar" style="background:${tintFor(c.title)}">
          ${esc(initialsOf(c.title))}
          <span class="conv-badge" style="background:${esc(pmeta.color || '#5b8cff')}"
                title="${esc(pmeta.label || c.platform)}">${esc(pmeta.short || '')}</span>
        </div>
        <div class="conv-main">
          <div class="conv-top">
            <span class="conv-title">${esc(c.title)}</span>
            <span class="conv-time">${esc(timeAgo(c.lastMessageAt))}</span>
          </div>
          <div class="conv-preview">${esc(c.lastOutbound ? 'You: ' : '')}${esc(c.lastPreview || '')}</div>
        </div>
        <div class="conv-side">
          ${unread ? `<span class="unread-pill">${c.unread}</span>` : ''}
          <span class="conv-flags">${flags}</span>
        </div>
      </div>`;
    })
    .join('');

  $$('#convList .conv').forEach((el) => {
    el.onclick = () => openConversation(el.dataset.id);
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openConversation(el.dataset.id);
      }
    };
  });
}

function renderThreadHead() {
  const c = state.active;
  if (!c) {
    $('#threadHead').innerHTML = '<div class="empty-head"><span class="muted">Select a conversation</span></div>';
    return;
  }
  const pmeta = c.platformMeta || {};
  const source = c.live
    ? '<span class="th-pill live">live</span>'
    : '<span class="th-pill simulated">sandbox</span>';
  $('#threadHead').innerHTML = `
    <button class="icon-btn" id="btn-back" title="Back" style="display:none">←</button>
    <div class="th-avatar" style="background:${tintFor(c.title)}">${esc(initialsOf(c.title))}</div>
    <div class="th-main">
      <div class="th-title">${esc(c.title)}</div>
      <div class="th-sub">
        <span>${esc(pmeta.label || c.platform)}</span>
        ${pmeta.mode ? `<span class="th-pill">${esc(pmeta.mode)}</span>` : ''}
        ${source}
      </div>
    </div>
    <button class="icon-btn" id="btn-toggle-important" title="Toggle important">${c.important ? '★' : '☆'}</button>`;
  $('#btn-toggle-important').onclick = toggleImportant;
  const back = $('#btn-back');
  if (back && window.matchMedia('(max-width:720px)').matches) back.style.display = 'grid';
  if (back) back.onclick = () => $('#app').classList.remove('mobile-thread');
}

function renderMessages() {
  const box = $('#messages');
  const c = state.active;
  if (!c) {
    box.innerHTML = `<div class="placeholder" id="placeholder">
      <div class="ph-mark">Z</div>
      <h2>Every conversation. One place.</h2>
      <p>Pick a chat to read, reply, translate, or ask the assistant.</p>
    </div>`;
    return;
  }
  if (!state.messages.length) {
    box.innerHTML = `<div class="placeholder"><p style="font-size:12px">No messages in this conversation yet.</p></div>`;
    return;
  }

  let lastDay = '';
  const rows = state.messages
    .map((m) => {
      const day = dayOf(m.at);
      const divider = day !== lastDay ? `<div class="msg-divider">${esc(day)}</div>` : '';
      lastDay = day;
      const atts = (m.attachments || [])
        .map(
          (a) => `<div class="msg-attach">
            <span class="msg-attach-icon">▤</span>
            <span class="msg-attach-name">${esc(a.name)}</span>
            <span class="msg-attach-size">${esc(bytes(a.sizeBytes))}</span>
          </div>`
        )
        .join('');
      const aiTag = m.ai?.assisted ? `<div class="msg-ai-tag">✦ AI-assisted draft · ${esc(m.ai.mode || 'assist')}</div>` : '';
      return `${divider}
        <div class="msg-row ${m.outbound ? 'out' : 'in'}">
          <div class="msg-author">${esc(m.author)} <span style="color:var(--tx-4)">${esc(clockOf(m.at))}</span></div>
          <div class="msg-bubble">${esc(m.body)}</div>
          ${atts}
          ${aiTag}
        </div>`;
    })
    .join('');

  box.innerHTML = rows;
  requestAnimationFrame(() => {
    box.scrollTop = box.scrollHeight;
  });
}

function renderAIEmpty(msg) {
  $('#aiBody').innerHTML = `<div class="ai-empty"><p>${esc(msg)}</p></div>`;
}

function renderAIBlocked(session) {
  $('#aiBody').innerHTML = `<div class="ai-blocked">
    <strong>AI boundary</strong><br>${esc(session)}
  </div>`;
}

/* -------------------------------- actions -------------------------------- */

async function loadState() {
  const s = await api('/api/state');
  state.identity = s.identity;
  state.counts = s.counts || {};
  state.vocabulary = s.vocabulary || state.vocabulary;
  renderIdentity();
  renderCounts();
}

async function loadConversations() {
  const qs = new URLSearchParams();
  if (state.view !== 'all') qs.set('filter', state.view);
  if (state.search) qs.set('search', state.search);
  const data = await api(`/api/conversations?${qs.toString()}`);
  let list = data.conversations || [];
  if (state.platform !== 'all') list = list.filter((c) => c.platform === state.platform);
  state.conversations = list;
  state.counts = data.counts || state.counts;
  renderConversations();
  renderCounts();
  renderAccounts();
}

async function openConversation(id) {
  state.activeId = id;
  $('#app').classList.add('mobile-thread');
  renderConversations();
  try {
    const [convRes, msgs] = await Promise.all([
      api(`/api/conversations/${encodeURIComponent(id)}`),
      api(`/api/conversations/${encodeURIComponent(id)}/messages?limit=200`)
    ]);
    const conv = convRes.conversation || convRes;
    state.active = conv;
    state.messages = msgs.messages || convRes.messages || [];
    renderThreadHead();
    renderMessages();
    $('#composer').hidden = false;
    $('#composer').style.display = '';
    $('#compose').value = '';
    $('#compose').focus();
    $('#composerHint').textContent = conv.needsReply ? 'This conversation is waiting on your reply.' : '';
    $('#composerHint').className = conv.needsReply ? 'composer-hint warn' : 'composer-hint';
    renderAIEmpty('Ask the assistant to summarize, draft a reply, translate, or find commitments in this conversation.');
    await api(`/api/conversations/${encodeURIComponent(id)}/read`, { method: 'POST', body: '{}' }).catch(() => {});
    await loadConversations();
    state.activeId = id;
    renderConversations();
  } catch (err) {
    toast(err.message, 'err');
  }
}

async function send() {
  const input = $('#compose');
  const body = input.value.trim();
  if (!body || !state.activeId) return;
  const btn = $('#btn-send');
  btn.disabled = true;
  try {
    await api(`/api/conversations/${encodeURIComponent(state.activeId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body })
    });
    input.value = '';
    input.style.height = 'auto';
    await refreshThread();
    await loadConversations();
  } catch (err) {
    toast(err.message, 'err');
  } finally {
    btn.disabled = false;
  }
}

async function refreshThread() {
  if (!state.activeId) return;
  const msgs = await api(`/api/conversations/${encodeURIComponent(state.activeId)}/messages?limit=200`);
  state.messages = msgs.messages || [];
  renderMessages();
}

async function toggleImportant() {
  if (!state.active) return;
  try {
    const updated = await api(`/api/conversations/${encodeURIComponent(state.active.id)}/important`, {
      method: 'POST',
      body: JSON.stringify({ important: !state.active.important })
    });
    state.active = { ...state.active, ...updated };
    renderThreadHead();
    await loadConversations();
    toast(state.active.important ? 'Marked important' : 'Unmarked', 'ok');
  } catch (err) {
    toast(err.message, 'err');
  }
}

/* ---------------------------------- AI ---------------------------------- */

function aiBusy(on) {
  state.aiBusy = on;
  ['btn-ai-summary', 'btn-ai-replies', 'btn-ai-translate'].forEach((id) => {
    const el = $(`#${id}`);
    if (el) el.disabled = on;
  });
}

async function aiSummarize() {
  if (!state.activeId) return;
  aiBusy(true);
  renderAIEmpty('Summarizing…');
  try {
    const r = await api(`/api/conversations/${encodeURIComponent(state.activeId)}/ai/summary`, {
      method: 'POST',
      body: '{}'
    });
    const s = r.summary || {};
    const topics = (s.topics || []).map((t) => `<span class="ai-topic">${esc(t)}</span>`).join('');
    const bullets = (s.bullets || [])
      .map((b) => `<li>${esc(typeof b === 'string' ? b : b.text)}</li>`)
      .join('');
    $('#aiBody').innerHTML = `
      <div class="ai-card">
        <h4>✦ Summary</h4>
        ${s.subtitle ? `<p style="font-size:10.5px;color:var(--tx-4);margin-bottom:7px">${esc(s.subtitle)}</p>` : ''}
        ${bullets ? `<ul>${bullets}</ul>` : '<p>No summary available.</p>'}
        ${topics ? `<div style="margin-top:9px">${topics}</div>` : ''}
      </div>
      ${s.openQuestion
        ? `<div class="ai-card"><h4>Open question</h4><p>${esc(s.openQuestion.text)}</p>
             <div style="margin-top:6px;font-size:10px;color:var(--tx-4)">${esc(s.openQuestion.from || '')} · ${esc(timeAgo(s.openQuestion.at))}</div></div>`
        : ''}
      <div class="ai-card"><h4>Signals</h4>
        <p style="font-size:11px">sentiment: <strong>${esc(s.sentiment || 'n/a')}</strong><br>
        unanswered for: <strong>${esc(s.unansweredFor || 'n/a')}</strong></p></div>
      <div class="ai-card"><h4>Source</h4><p style="font-size:10.5px;color:var(--tx-4)">${esc(
        s.engine || r.aiMode || 'deterministic local engine'
      )}</p></div>`;
  } catch (err) {
    renderAIEmpty(`Could not summarize: ${err.message}`);
  } finally {
    aiBusy(false);
  }
}

async function aiReplies() {
  if (!state.activeId) return;
  aiBusy(true);
  renderAIEmpty('Drafting suggestions…');
  try {
    const r = await api(`/api/conversations/${encodeURIComponent(state.activeId)}/ai/replies`, {
      method: 'POST',
      body: '{}'
    });
    const list = r.replies || r.suggestions || [];
    if (!list.length) {
      renderAIEmpty('No suggestions available for this conversation.');
      return;
    }
    $('#aiBody').innerHTML = `
      <div class="ai-card"><h4>✦ Suggested replies</h4>
        ${r.note ? `<p style="font-size:10px;color:var(--tx-4);margin-bottom:7px">${esc(r.note)}</p>` : ''}
        <div style="display:flex;flex-direction:column;gap:6px">
          ${list
            .map(
              (s, i) => `<div class="ai-suggestion" data-i="${i}">
                ${esc(s.body || s.text || s)}
                ${s.tone ? `<div style="margin-top:5px;font-size:9.5px;color:var(--tx-4)">tone: ${esc(s.tone)}</div>` : ''}
              </div>`
            )
            .join('')}
        </div>
      </div>`;
    $$('#aiBody .ai-suggestion').forEach((el) => {
      el.onclick = () => {
        const item = list[Number(el.dataset.i)];
        $('#compose').value = item.body || item.text || String(item);
        $('#compose').focus();
        $('#compose').dispatchEvent(new Event('input'));
        toast('Draft inserted — review before sending', 'ok');
      };
    });
  } catch (err) {
    renderAIEmpty(`Could not draft: ${err.message}`);
  } finally {
    aiBusy(false);
  }
}

async function aiTranslate() {
  if (!state.activeId) return;
  const draft = $('#compose').value.trim();
  const targets = state.vocabulary.translationTargets || [];
  if (!draft) {
    renderAIEmpty('Type a draft first, then translate it into the contact’s language.');
    return;
  }
  aiBusy(true);
  renderAIEmpty('Translating…');
  try {
    const r = await api(`/api/conversations/${encodeURIComponent(state.activeId)}/ai/translate`, {
      method: 'POST',
      body: JSON.stringify({ text: draft, target: targets[0]?.id || null })
    });
    $('#aiBody').innerHTML = `
      <div class="ai-card">
        <h4>⇄ Translation${r.target ? ` · ${esc(r.target)}` : ''}</h4>
        <p>${esc(r.text || '')}</p>
        <div class="ai-actions">
          <button class="ai-act" id="ai-use-translation">Use this</button>
        </div>
        <div style="margin-top:8px;font-size:10px;color:var(--tx-4)">
          ${esc(r.engine || '')}${r.coverage !== undefined ? ` · coverage ${r.coverage}%` : ''}
        </div>
        ${r.note ? `<div style="margin-top:6px;font-size:10px;color:var(--amber)">${esc(r.note)}</div>` : ''}
      </div>`;
    const use = $('#ai-use-translation');
    if (use)
      use.onclick = () => {
        $('#compose').value = r.text || '';
        $('#compose').focus();
        toast('Translation inserted', 'ok');
      };
  } catch (err) {
    renderAIEmpty(`Could not translate: ${err.message}`);
  } finally {
    aiBusy(false);
  }
}

/* -------------------------------- modals -------------------------------- */

function openModal(title, html) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = html;
  const bd = $('#modalBackdrop');
  bd.hidden = false;
  bd.style.display = 'grid';
}

function closeModal() {
  const bd = $('#modalBackdrop');
  bd.hidden = true;
  bd.style.display = 'none';
}

async function showDigest() {
  try {
    const d = await api('/api/digest');
    const needsReply = (d.needsReply || [])
      .map((n) => `<li><strong>${esc(n.title)}</strong> — ${esc(n.preview)} <span style="color:var(--tx-4)">(${esc(n.for || '')})</span></li>`)
      .join('');
    const meetings = (d.meetingSignals || [])
      .map((m) => `<li><strong>${esc(m.title || 'Meeting')}</strong> — ${esc(m.detail || '')}</li>`)
      .join('');
    openModal(
      'Daily digest',
      `<h4>Needs your reply · ${(d.needsReply || []).length}</h4>
       ${needsReply ? `<ul>${needsReply}</ul>` : '<p>Nothing is waiting on you.</p>'}
       <h4>Meeting signals · ${(d.meetingSignals || []).length}</h4>
       ${meetings ? `<ul>${meetings}</ul>` : '<p>No meeting requests detected.</p>'}
       <h4>Generated</h4><p style="color:var(--tx-4);font-size:11px">${esc(new Date(d.generatedAt).toLocaleString())}</p>`
    );
  } catch (err) {
    toast(err.message, 'err');
  }
}

async function showActivity() {
  try {
    const a = await api('/api/ai/activity');
    const rows = (a.activity || a.entries || [])
      .slice(0, 40)
      .map(
        (e) => `<li><strong>${esc(e.title || e.kind || 'action')}</strong> — ${esc(e.detail || '')}
          <span style="color:var(--tx-4)">${esc(timeAgo(e.at))}</span></li>`
      )
      .join('');
    openModal('AI activity', rows ? `<ul>${rows}</ul>` : '<p>No AI activity recorded yet.</p>');
  } catch (err) {
    toast(err.message, 'err');
  }
}

async function showPrivacy() {
  try {
    const p = await api('/api/privacy');
    const fmt = (v) => (typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''));
    openModal(
      'Privacy & data',
      `<dl class="kv">
        <dt>AI engine</dt><dd>${esc(fmt(p.ai?.engine || p.ai?.provider))}</dd>
        <dt>Remote AI</dt><dd>${p.ai?.remote ? 'enabled' : 'disabled (local only)'}</dd>
        <dt>Storage</dt><dd>${esc(fmt(p.storage?.engine || p.storage))}</dd>
        <dt>Selling data</dt><dd class="status-${p.sellsData ? 'off' : 'ok'}">${p.sellsData ? 'yes' : 'never'}</dd>
      </dl>
       <h4>Note</h4><p>${esc(p.note || 'Conversation text is stored locally. Third-party platform credentials are never persisted.')}</p>
       <h4>Bridges</h4>
       <ul>${Object.entries(p.bridges || {})
         .map(([k, v]) => `<li><strong>${esc(k)}</strong> — ${esc(v)}</li>`)
         .join('')}</ul>`
    );
  } catch (err) {
    toast(err.message, 'err');
  }
}

async function showIntegrations() {
  try {
    const i = await api('/api/integrations');
    const row = (label, v) => `<li><strong>${esc(label)}</strong> —
      <span class="status-${v?.available || v?.connected ? 'ok' : 'off'}">${v?.available || v?.connected ? 'connected' : 'offline'}</span>
      ${v?.note ? `<div style="color:var(--tx-4);font-size:10.5px">${esc(v.note)}</div>` : ''}</li>`;
    openModal(
      'Integrations',
      `<ul>
        ${row('ZMeet', i.zenMeet || i.zmeet)}
        ${row('ZCal', i.zenCalendar || i.zcal)}
        ${row('ZMail', i.zenBox || i.zmail)}
      </ul>
       <h4>Policy</h4><p>${esc(i.note || 'Every bridge is fail-safe: unavailable siblings degrade with a visible reason instead of silently doing nothing.')}</p>`
    );
  } catch (err) {
    toast(err.message, 'err');
  }
}

/* ------------------------------ wire events ------------------------------ */

function wire() {
  // nav filters
  $$('#nav .nav-item').forEach((el) => {
    el.onclick = async () => {
      $$('#nav .nav-item').forEach((n) => n.classList.remove('active'));
      el.classList.add('active');
      state.view = el.dataset.filter;
      state.platform = 'all';
      await loadConversations();
    };
  });

  // search (debounced)
  let t = null;
  $('#search').oninput = (e) => {
    clearTimeout(t);
    t = setTimeout(async () => {
      state.search = e.target.value.trim();
      await loadConversations();
    }, 200);
  };

  // composer
  const compose = $('#compose');
  compose.oninput = () => {
    compose.style.height = 'auto';
    compose.style.height = `${Math.min(compose.scrollHeight, 132)}px`;
    $('#btn-send').disabled = !compose.value.trim();
  };
  compose.onkeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };
  $('#btn-send').onclick = send;

  // AI
  $('#btn-ai-summary').onclick = aiSummarize;
  $('#btn-ai-replies').onclick = aiReplies;
  $('#btn-ai-translate').onclick = aiTranslate;
  $('#btn-important').onclick = toggleImportant;
  $('#btn-ai-close').onclick = () => {
    $('#app').classList.add('ai-hidden');
    $('#app').classList.remove('ai-open');
  };

  // side links
  $('#btn-digest').onclick = showDigest;
  $('#btn-activity').onclick = showActivity;
  $('#btn-privacy').onclick = showPrivacy;
  $('#btn-integrations').onclick = showIntegrations;

  // reset sandbox
  $('#btn-reset').onclick = async () => {
    try {
      await api('/api/sandbox/reset', { method: 'POST', body: '{}' });
      state.activeId = null;
      state.active = null;
      state.messages = [];
      renderThreadHead();
      renderMessages();
      $('#composer').hidden = true;
      $('#composer').style.display = 'none';
      renderAIEmpty('Sandbox reset. Pick a conversation to begin.');
      await loadState();
      await loadConversations();
      toast('Sandbox reset', 'ok');
    } catch (err) {
      toast(err.message, 'err');
    }
  };

  // modal
  $('#btn-modal-close').onclick = closeModal;
  $('#modalBackdrop').onclick = (e) => {
    if (e.target.id === 'modalBackdrop') closeModal();
  };

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#modalBackdrop').hidden) return closeModal();
    }
    if (e.key === '/' && document.activeElement !== compose && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      $('#search').focus();
    }
  });

  // live updates
  try {
    const es = new EventSource('/api/events');
    es.addEventListener('message', async () => {
      await loadConversations();
      if (state.activeId) await refreshThread();
    });
    es.onerror = () => {
      /* SSE is best-effort; polling-free degradation is acceptable */
    };
  } catch {
    /* EventSource unavailable — the UI still works on navigation */
  }
}

/* --------------------------------- boot --------------------------------- */

async function boot() {
  wire();
  // Inline default so a stale stylesheet can never leave the modal open.
  const bd = $('#modalBackdrop');
  bd.hidden = true;
  bd.style.display = 'none';
  $('#composer').style.display = 'none';
  try {
    await loadState();
    await loadConversations();
    renderThreadHead();
    const mq = window.matchMedia('(min-width:1241px)');
    if (!mq.matches) $('#app').classList.add('ai-hidden');
    mq.addEventListener('change', (e) => {
      $('#app').classList.toggle('ai-hidden', !e.matches);
    });
  } catch (err) {
    toast(`Could not reach ZTalk: ${err.message}`, 'err');
    $('#convList').innerHTML = `<div class="placeholder" style="padding:32px 14px">
      <p style="font-size:11.5px">ZTalk server unreachable.<br>Start it with <code>npm start</code>.</p></div>`;
  }
}

boot();
