/**
 * ZMeet — dashboard client.
 * Vanilla JS, no build step, no frameworks. Server is authoritative for
 * permissions; this file only renders and asks.
 */

const state = {
  view: 'upcoming',
  rooms: [],
  stats: {},
  vocab: {},
  identity: null,
  activity: [],
  provider: null,
  query: '',
  memoryResults: null,
  selectedType: 'business',
  newToggles: { waiting: true, secure: false, startNow: true },
  drafts: []
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ============================================================
   Utilities
   ============================================================ */

function icon(name) {
  return `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function esc(text = '') {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[ch]);
}

function initials(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function fmtDay(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, tomorrow)) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function relative(iso) {
  if (!iso) return '';
  const diff = new Date(iso).getTime() - Date.now();
  const mins = Math.round(diff / 60000);
  if (Math.abs(mins) < 1) return 'now';
  if (mins > 0 && mins < 60) return `in ${mins} min`;
  if (mins < 0 && mins > -60) return `${Math.abs(mins)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours > 0 && hours < 24) return `in ${hours} h`;
  if (hours < 0 && hours > -24) return `${Math.abs(hours)} h ago`;
  return '';
}

function toast(message, kind = 'success') {
  const stack = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const ic = kind === 'error' ? 'alert' : kind === 'warn' ? 'alert' : 'check';
  el.innerHTML = `${icon(ic)}<span>${esc(message)}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 260);
  }, 3400);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function showError(err) {
  toast(err.message || 'Something went wrong', 'error');
}

/* ============================================================
   Boot
   ============================================================ */

document.addEventListener('DOMContentLoaded', boot);

async function boot() {
  buildTypeGrid();
  bindEvents();
  await ensureSession();
  await loadAll();
}

async function ensureSession() {
  try {
    const session = await api('/api/session', { method: 'POST', body: JSON.stringify({}) });
    state.identity = session.identity;
  } catch {
    // Already has a cookie, or non-local without a key — fall through.
  }
}

async function loadAll() {
  try {
    const [stateRes, roomsRes, activityRes, draftsRes] = await Promise.all([
      api('/api/state'),
      api('/api/rooms'),
      api('/api/ai/activity?limit=40'),
      api('/api/ai/drafts').catch(() => ({ drafts: [] }))
    ]);
    state.identity = stateRes.identity;
    state.vocab = stateRes.vocabulary;
    state.stats = stateRes.stats;
    state.provider = stateRes.aiProvider;
    state.rooms = roomsRes.rooms;
    state.activity = activityRes.activity;
    state.drafts = draftsRes.drafts || [];
    applyIdentity();
    render();
  } catch (err) {
    showError(err);
  }
}

function applyIdentity() {
  const org = state.identity?.organization;
  if (!org) return;
  $('#orgAvatar').textContent = initials(org.name);
  $('#orgName').textContent = org.name;
  $('#orgPlan').textContent = `${org.plan} plan`;
  $('#btnAvatar').textContent = initials(state.identity.name);
  $('#orgAvatar').title = `${org.name} · ${org.storagePolicy} storage`;
}

/* ============================================================
   Events
   ============================================================ */

function bindEvents() {
  $$('#primaryNav .nav-item, .side-section .nav-item').forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  $('#btnNewMeeting').addEventListener('click', () => openNewModal());
  $('#btnCloseNew').addEventListener('click', () => close('#newModal'));
  $('#btnCancelNew').addEventListener('click', () => close('#newModal'));
  $('#btnCreateMeeting').addEventListener('click', createMeeting);

  $('#btnAiOrganizer').addEventListener('click', () => {
    open('#organizerModal');
    setTimeout(() => $('#organizerInput').focus(), 60);
  });
  $('#btnCloseOrganizer').addEventListener('click', () => close('#organizerModal'));
  $('#btnCancelOrganizer').addEventListener('click', () => close('#organizerModal'));
  $('#btnRunOrganizer').addEventListener('click', runOrganizer);

  $('#btnCloseShare').addEventListener('click', () => close('#shareModal'));
  $('#btnCopyLink').addEventListener('click', copyShareLink);

  $('#btnCloseDetail').addEventListener('click', () => close('#detailModal'));
  $('#btnOrg').addEventListener('click', showIdentity);
  $('#btnAvatar').addEventListener('click', showIdentity);

  $('#searchInput').addEventListener('input', debounce((e) => {
    state.query = e.target.value.trim();
    if (!state.query) {
      state.memoryResults = null;
      render();
      return;
    }
    runMemorySearch(state.query);
  }, 320));

  $('#tglWaiting').addEventListener('click', () => toggleNew('waiting'));
  $('#tglSecure').addEventListener('click', () => toggleNew('secure'));
  $('#tglStartNow').addEventListener('click', () => toggleNew('startNow'));

  $('#newAiMode').addEventListener('change', () => {
    const mode = state.vocab.aiModes?.find((m) => m.key === $('#newAiMode').value);
    $('#aiModeHint').textContent = mode ? mode.description : '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['#newModal', '#organizerModal', '#shareModal', '#detailModal'].forEach((sel) => close(sel));
    }
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !isTyping(e)) {
      e.preventDefault();
      openNewModal();
    }
    if (e.key === '/' && !isTyping(e)) {
      e.preventDefault();
      $('#searchInput').focus();
    }
  });

  $$('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

function isTyping(event) {
  const tag = event.target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function open(sel) {
  $(sel).hidden = false;
}

function close(sel) {
  $(sel).hidden = true;
}

function setView(view) {
  state.view = view;
  state.memoryResults = null;
  $$('#primaryNav .nav-item, .side-section .nav-item').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  render();
}

/* ============================================================
   Views
   ============================================================ */

const VIEW_TITLES = {
  live: ['Live now', 'rooms in progress'],
  upcoming: ['Upcoming', 'scheduled meetings'],
  all: ['My Meetings', 'everything you organize or attend'],
  recordings: ['Recordings', 'references to media in your own storage'],
  studio: ['Live Studio', 'scenes, lower thirds and multi-destination streaming'],
  memory: ['AI Notes', 'searchable meeting intelligence'],
  files: ['Shared Files', 'permission-controlled meeting assets'],
  settings: ['Settings', 'AI provider, privacy and storage'],
  activity: ['Agent log', 'every consequential AI action']
};

function render() {
  const counts = computeCounts();
  $('#countLive').textContent = state.stats.live || 0;
  $('#countLive').hidden = !state.stats.live;
  $('#countUpcoming').textContent = counts.upcoming;
  $('#countAll').textContent = state.rooms.length;
  $('#countRecordings').textContent = state.stats.recordings || 0;
  $('#countActivity').textContent = state.stats.aiActions || 0;

  const [title, sub] = VIEW_TITLES[state.view] || ['ZMeet', ''];
  $('#viewTitle').textContent = title;
  $('#viewSub').textContent = sub ? `· ${sub}` : '';

  const stage = $('#stage');
  if (state.query && state.memoryResults) {
    stage.innerHTML = renderMemoryResults();
    bindRoomClicks();
    return;
  }

  const views = {
    live: renderLiveView,
    upcoming: renderUpcomingView,
    all: renderAllView,
    recordings: renderRecordingsView,
    studio: renderStudioView,
    memory: renderMemoryView,
    files: renderFilesView,
    settings: renderSettingsView,
    activity: renderActivityView
  };
  stage.innerHTML = (views[state.view] || renderUpcomingView)();
  bindRoomClicks();
  bindViewActions();
}

function computeCounts() {
  const now = Date.now();
  return {
    upcoming: state.rooms.filter(
      (r) => r.status === 'scheduled' && new Date(r.scheduledFor).getTime() >= now - 3600_000
    ).length
  };
}

/* ------------------------------ live ------------------------------ */

function renderLiveView() {
  const live = state.rooms.filter((r) => r.status === 'live');
  if (!live.length) {
    return `
      ${renderPageHead('Nothing live right now', 'Start a meeting and it appears here instantly.')}
      <div class="empty">
        <div class="empty-icon">${icon('bolt')}</div>
        <h3>No live meetings</h3>
        <p>Create a room and join it. ZMeet opens the sandbox, prepares the brief and starts taking notes.</p>
        <button class="btn primary" data-action="new">${icon('plus')}New meeting</button>
      </div>`;
  }
  return live.map((room) => renderLiveHero(room)).join('') + `
    <div class="section">
      <div class="section-head"><h2>Also live</h2><span class="count">${live.length}</span></div>
      <div class="room-grid">${live.map(renderRoomCard).join('')}</div>
    </div>`;
}

/* ---------------------------- upcoming ---------------------------- */

function renderUpcomingView() {
  const now = Date.now();
  const live = state.rooms.filter((r) => r.status === 'live');
  const upcoming = state.rooms
    .filter((r) => r.status === 'scheduled' && new Date(r.scheduledFor).getTime() >= now - 3600_000)
    .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  const next = live[0] || upcoming[0];

  const parts = [];

  if (next) {
    parts.push(next.status === 'live' ? renderLiveHero(next) : renderNextHero(next));
  } else {
    parts.push(renderEmptyHero());
  }

  const heroSide = renderHeroSide();
  parts[0] = parts[0].replace('<!--HERO_SIDE-->', heroSide);

  if (upcoming.length) {
    parts.push(`
      <div class="section">
        <div class="section-head">
          <h2>Next up</h2>
          <span class="count">${upcoming.length}</span>
          <span class="spacer"></span>
          <button class="btn sm ghost" data-action="all">View all ${icon('chevron-right')}</button>
        </div>
        <div class="room-grid">${upcoming.slice(0, 6).map(renderRoomCard).join('')}</div>
      </div>`);
  }

  const recent = state.rooms.filter((r) => r.status === 'ended').slice(0, 4);
  if (recent.length) {
    parts.push(`
      <div class="section">
        <div class="section-head"><h2>Recently finished</h2><span class="count">notes ready</span></div>
        <div class="rows">${recent.map(renderRoomRow).join('')}</div>
      </div>`);
  }

  return parts.join('');
}

function renderPageHead(title, sub) {
  return `<div class="section-head" style="margin-bottom:14px">
    <h2 style="font-size:15px">${esc(title)}</h2>
    <span class="count">${esc(sub)}</span>
  </div>`;
}

function renderEmptyHero() {
  return `
    <div class="hero">
      <div class="hero-main">
        <span class="hero-tag">${icon('spark')} ZMeet</span>
        <h1 class="hero-title">AI organizes the meeting.<br>You run the conversation.</h1>
        <div class="hero-meta">
          <span>${icon('clock')}Instant rooms</span>
          <span>${icon('shield')}Permission-controlled AI</span>
          <span>${icon('storage')}Your storage, your files</span>
        </div>
        <div class="hero-actions">
          <button class="btn-stage" data-action="new">${icon('video')}New meeting</button>
          <button class="btn-stage-ghost" data-action="organizer">${icon('wand')}Ask AI to organize</button>
        </div>
      </div>
      <div class="hero-side">${renderHeroSide()}</div>
    </div>`;
}

function renderNextHero(room) {
  return `
    <div class="hero">
      <div class="hero-main">
        <span class="hero-tag">${icon('clock')} Next up · ${relative(room.scheduledFor)}</span>
        <h1 class="hero-title">${esc(room.title)}</h1>
        <div class="hero-meta">
          <span>${icon('calendar')} ${fmtDay(room.scheduledFor)} · ${fmtTime(room.scheduledFor)}</span>
          <span>${icon('clock')} ${room.durationMinutes} min</span>
          <span>${icon('users')} ${room.participants + room.invited} people</span>
          <span>${icon('spark')} ${esc(room.aiModeLabel)}</span>
        </div>
        <div class="hero-actions">
          <button class="btn-stage" data-room="${room.id}" data-action="open">${icon('play')}Open room</button>
          <button class="btn-stage-ghost" data-room="${room.id}" data-action="share">${icon('link')}Invite</button>
        </div>
      </div>
      <div class="hero-side">${renderHeroSide()}</div>
    </div>`;
}

function renderLiveHero(room) {
  return `
    <div class="hero">
      <div class="hero-main">
        <span class="hero-tag live"><span class="dot"></span>Live · ${room.participants} in the room</span>
        <h1 class="hero-title">${esc(room.title)}</h1>
        <div class="hero-meta">
          <span>${icon('rec')} ${room.hasRecording ? 'Recording' : 'Not recording'}</span>
          <span>${icon('users')} ${room.participants} joined${room.waiting ? ` · ${room.waiting} waiting` : ''}</span>
          <span>${icon('spark')} ${esc(room.aiModeLabel)}</span>
          <span>${icon('clock')} started ${relative(room.startedAt)}</span>
        </div>
        <div class="hero-actions">
          <button class="btn-stage" data-room="${room.id}" data-action="open">${icon('play')}Rejoin room</button>
          <button class="btn-stage-ghost" data-room="${room.id}" data-action="share">${icon('link')}Copy link</button>
          <button class="btn-stage-ghost" data-room="${room.id}" data-action="report">${icon('notes')}Live notes</button>
        </div>
      </div>
      <div class="hero-side">${renderHeroSide()}</div>
    </div>`;
}

function renderHeroSide() {
  const s = state.stats;
  return `
    <div class="stat-card">
      <div class="label">Live now</div>
      <div class="value">${s.live || 0}<small>${s.participants || 0} participants</small></div>
      <div class="hint">${s.waiting ? `${s.waiting} waiting for admission` : 'Media stays peer-to-peer. Signaling only.'}</div>
    </div>
    <div class="stat-card">
      <div class="label">AI boundary</div>
      <div class="value" style="font-size:15px;letter-spacing:-0.2px">
        <span class="chip violet">${icon('spark')}${esc(state.provider?.kind === 'deterministic' ? 'Local engine' : state.provider?.kind || 'Local')}</span>
      </div>
      <div class="hint">${esc(state.provider?.note || 'Deterministic, on-process. No content leaves ZMeet.')}</div>
    </div>
    <div class="stat-card">
      <div class="label">Storage</div>
      <div class="value" style="font-size:15px;letter-spacing:-0.2px">
        <span class="chip blue">${icon('storage')}${esc(s.storagePolicy || 'organization')}</span>
      </div>
      <div class="hint">${s.recordings || 0} recording references · media lives with you</div>
    </div>`;
}

/* ------------------------------- all ------------------------------- */

function renderAllView() {
  if (!state.rooms.length) {
    return renderEmptyHero();
  }
  const groups = [
    { key: 'live', label: 'Live', rooms: state.rooms.filter((r) => r.status === 'live') },
    { key: 'scheduled', label: 'Scheduled', rooms: state.rooms.filter((r) => r.status === 'scheduled') },
    { key: 'ended', label: 'Finished', rooms: state.rooms.filter((r) => r.status === 'ended') }
  ].filter((g) => g.rooms.length);

  return groups
    .map(
      (g) => `
      <div class="section">
        <div class="section-head"><h2>${g.label}</h2><span class="count">${g.rooms.length}</span></div>
        <div class="room-grid">${g.rooms.map(renderRoomCard).join('')}</div>
      </div>`
    )
    .join('');
}

/* --------------------------- recordings --------------------------- */

function renderRecordingsView() {
  const rows = [];
  for (const room of state.rooms) {
    if (!room.hasRecording) continue;
    rows.push(`
      <div class="row" data-room="${room.id}" data-action="report" style="cursor:pointer">
        <div class="row-icon rose">${icon('rec')}</div>
        <div class="row-body">
          <div class="row-title">${esc(room.title)}</div>
          <div class="row-sub">${fmtDay(room.scheduledFor)} · ${room.durationMinutes} min · stored in ${esc(room.organizer?.organization || 'your workspace')}</div>
        </div>
        <div class="row-meta">
          <span class="chip">${icon('storage')}reference only</span>
          <span class="chip green">${icon('notes')}notes ready</span>
        </div>
      </div>`);
  }
  if (!rows.length) {
    return `<div class="empty">
      <div class="empty-icon">${icon('rec')}</div>
      <h3>No recordings yet</h3>
      <p>ZMeet keeps a reference to each recording. The media itself stays in the storage you chose — organization, cloud, object storage or this device.</p>
    </div>`;
  }
  return `
    <div class="section">
      <div class="section-head"><h2>Recording references</h2><span class="count">${rows.length}</span></div>
      <div class="rows">${rows.join('')}</div>
    </div>
    <div class="stat-card" style="max-width:620px">
      <div class="label">Native storage principle</div>
      <div class="hint" style="margin-top:6px">
        ZMeet does not force meeting media into its own storage. Every recording row above is a pointer:
        adapter, location and retention — never a copy.
      </div>
    </div>`;
}

/* ----------------------------- studio ----------------------------- */

function renderStudioView() {
  const candidates = state.rooms.filter((r) => r.type === 'live' || r.type === 'webinar' || r.type === 'presentation' || r.status === 'live');
  if (!candidates.length) {
    return `<div class="empty">
      <div class="empty-icon">${icon('broadcast')}</div>
      <h3>No production rooms</h3>
      <p>Live Show, Webinar and Presentation rooms get a scene-based studio with lower thirds and multi-destination streaming.</p>
      <button class="btn primary" data-action="new">${icon('plus')}Create a live room</button>
    </div>`;
  }
  return candidates
    .map((room) => `
      <div class="section">
        <div class="section-head">
          <h2>${esc(room.title)}</h2>
          <span class="chip ${room.status === 'live' ? 'live' : ''}">${room.status === 'live' ? '<span class="dot"></span>live' : 'ready'}</span>
          <span class="spacer"></span>
          <button class="btn sm" data-room="${room.id}" data-action="open">${icon('broadcast')}Open studio</button>
        </div>
        <div class="rows">
          <div class="row">
            <div class="row-icon violet">${icon('grid')}</div>
            <div class="row-body">
              <div class="row-title">6 scenes ready</div>
              <div class="row-sub">Host · Host + Guest · Guest + Slides · Screen + Speaker · Video + Lower Third · Full Presentation</div>
            </div>
          </div>
          <div class="row">
            <div class="row-icon blue">${icon('broadcast')}</div>
            <div class="row-body">
              <div class="row-title">Destinations</div>
              <div class="row-sub">YouTube · Facebook · LinkedIn · Custom RTMP — keys held in the vault</div>
            </div>
            <div class="row-meta"><span class="chip">${room.status === 'live' ? 'available' : 'configure in studio'}</span></div>
          </div>
        </div>
      </div>`)
    .join('');
}

/* ----------------------------- memory ----------------------------- */

function renderMemoryView() {
  return `
    <div class="section">
      <div class="section-head"><h2>Ask your meeting memory</h2><span class="count">respects your permissions</span></div>
      <div class="rows">
        ${[
          'When did we decide to launch?',
          'Find the meeting where John discussed the budget',
          'Show every meeting related to Malaysia',
          'What did we decide about the security review?'
        ]
          .map(
            (q) => `<button class="row" data-memory="${esc(q)}">
              <div class="row-icon violet">${icon('search')}</div>
              <div class="row-body"><div class="row-title">${esc(q)}</div><div class="row-sub">Search meetings, decisions, actions and transcripts</div></div>
              <div class="row-meta">${icon('arrow-right')}</div>
            </button>`
          )
          .join('')}
      </div>
    </div>
    ${state.memoryResults ? renderMemoryResults() : ''}
    <div class="stat-card" style="max-width:680px">
      <div class="label">Searchable meeting intelligence</div>
      <div class="hint" style="margin-top:6px">
        Results return the meeting, the timestamp and the excerpt — never a dump of everything.
        Only rooms you are permitted to see are searched.
      </div>
    </div>`;
}

function renderMemoryResults() {
  const res = state.memoryResults;
  if (!res) return '';
  if (!res.results.length) {
    return `<div class="empty">
      <div class="empty-icon">${icon('search')}</div>
      <h3>No matches for “${esc(res.query)}”</h3>
      <p>Try a project name, a person, a decision or a deadline. ZMeet searches titles, decisions, actions, transcripts and files.</p>
    </div>`;
  }
  return `
    <div class="section">
      <div class="section-head"><h2>Results for “${esc(res.query)}”</h2><span class="count">${res.total}</span></div>
      <div class="rows">
        ${res.results
          .map(
            (r) => `<div class="row" data-room="${r.roomId}" data-action="detail" style="cursor:pointer">
              <div class="row-icon blue">${icon('notes')}</div>
              <div class="row-body">
                <div class="row-title">${esc(r.title)}</div>
                <div class="row-sub">${r.matches[0] ? esc(r.matches[0].excerpt) : 'Match on meeting metadata'}</div>
              </div>
              <div class="row-meta">
                ${r.matches[0]?.at ? `<span class="chip">${icon('clock')}${fmtDay(r.matches[0].at)} ${fmtTime(r.matches[0].at)}</span>` : ''}
                <span class="chip violet">score ${r.score}</span>
              </div>
            </div>`
          )
          .join('')}
      </div>
    </div>`;
}

/* ------------------------------ files ------------------------------ */

function renderFilesView() {
  const rows = [];
  for (const room of state.rooms) {
    rows.push(`
      <div class="row" data-room="${room.id}" data-action="detail" style="cursor:pointer">
        <div class="row-icon ${room.status === 'live' ? 'rose' : 'blue'}">${icon('files')}</div>
        <div class="row-body">
          <div class="row-title">${esc(room.title)}</div>
          <div class="row-sub">${room.hasRecording ? 'recordings · ' : ''}file policy per meeting · AI access off by default</div>
        </div>
        <div class="row-meta"><span class="chip">${esc(room.typeLabel)}</span></div>
      </div>`);
  }
  return `
    <div class="section">
      <div class="section-head"><h2>Meeting file sandboxes</h2><span class="count">${rows.length}</span></div>
      <div class="rows">${rows.join('') || '<div class="row"><div class="row-body"><div class="row-sub">No meetings yet.</div></div></div>'}</div>
    </div>
    <div class="stat-card" style="max-width:700px">
      <div class="label">File permissions</div>
      <div class="hint" style="margin-top:6px">
        Every file carries four switches the host controls: <b>View only</b>, <b>Download allowed</b>,
        <b>Collaborate</b> and <b>AI access allowed</b>. Files are pointers into your own storage.
      </div>
    </div>`;
}

/* ---------------------------- activity ---------------------------- */

function renderActivityView() {
  const items = state.activity;
  if (!items.length) {
    return `<div class="empty">
      <div class="empty-icon">${icon('spark')}</div>
      <h3>No AI activity yet</h3>
      <p>Every consequential AI action appears here: agendas, availability checks, summaries, actions, minutes and follow-ups.</p>
    </div>`;
  }
  return `
    <div class="section">
      <div class="section-head">
        <h2>AI activity</h2>
        <span class="count">${items.length}</span>
        <span class="spacer"></span>
        <button class="btn sm ghost" data-action="clear-activity">${icon('trash')}Clear</button>
      </div>
      <div class="rows">
        ${items
          .map(
            (a) => `<div class="row">
              <div class="row-icon ${activityColor(a.kind)}">${icon(activityIcon(a.kind))}</div>
              <div class="row-body">
                <div class="row-title">${esc(a.title)}</div>
                <div class="row-sub">${esc(a.detail || a.kindLabel)}</div>
              </div>
              <div class="row-meta">
                ${a.approved ? `<span class="chip green">${icon('check')}approved</span>` : ''}
                ${a.capability ? `<span class="chip violet">${esc(a.capability)}</span>` : ''}
                <span class="chip">${fmtTime(a.at)}</span>
              </div>
            </div>`
          )
          .join('')}
      </div>
    </div>`;
}

function activityIcon(kind) {
  return {
    agenda: 'notes',
    availability: 'calendar',
    room: 'video',
    prepare: 'wand',
    summary: 'notes',
    actions: 'check',
    minutes: 'notes',
    followup: 'mail',
    calendar: 'calendar',
    recording: 'rec',
    stream: 'broadcast',
    permission: 'shield',
    search: 'search'
  }[kind] || 'spark';
}

function activityColor(kind) {
  return {
    agenda: 'blue',
    availability: 'green',
    room: 'blue',
    prepare: 'violet',
    summary: 'violet',
    actions: 'green',
    minutes: 'violet',
    followup: 'amber',
    calendar: 'green',
    recording: 'rose',
    stream: 'rose',
    permission: 'amber',
    search: 'blue'
  }[kind] || '';
}

/* ---------------------------- settings ---------------------------- */

function renderSettingsView() {
  const providers = state.vocab.providers || [];
  return `
    <div class="section">
      <div class="section-head"><h2>AI provider</h2><span class="count">not locked to one vendor</span></div>
      <div class="rows" id="providerList">
        ${(state.providerOptions || [])
          .map(
            (p) => `<button class="row" data-provider="${p.id}">
              <div class="row-icon ${p.remote ? 'amber' : 'violet'}">${icon(p.remote ? 'broadcast' : 'spark')}</div>
              <div class="row-body">
                <div class="row-title">${esc(p.label)} ${state.provider?.kind === p.id ? '<span class="chip green" style="margin-left:6px">active</span>' : ''}</div>
                <div class="row-sub">${esc(p.blurb)}</div>
              </div>
              <div class="row-meta"><span class="chip ${p.remote ? 'rose' : 'green'}">${p.remote ? 'remote · consent required' : 'local'}</span></div>
            </button>`
          )
          .join('') || `<div class="row"><div class="row-body"><div class="row-sub">${esc(state.provider?.note || '')}</div></div></div>`}
      </div>
    </div>

    <div class="section">
      <div class="section-head"><h2>Storage policy</h2></div>
      <div class="rows">
        ${(state.vocab.storage || [])
          .map(
            (s) => `<div class="row">
              <div class="row-icon blue">${icon('storage')}</div>
              <div class="row-body"><div class="row-title">${esc(s.label)}</div><div class="row-sub">${esc(s.blurb)}</div></div>
              <div class="row-meta">${s.id === state.stats.storagePolicy ? '<span class="chip green">active</span>' : `<span class="chip">${s.requiresConfig ? 'needs setup' : 'available'}</span>`}</div>
            </div>`
          )
          .join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-head"><h2>Privacy statement</h2></div>
      <div class="stat-card" style="max-width:760px">
        <div class="hint" style="margin-top:2px;line-height:1.6">
          ZMeet does not monetize meeting content or personal data. AI access is per-room, explicit and revocable.
          Group calls are <b>transport-encrypted</b>, not end-to-end encrypted, and the interface says so.
          If you enable AI or cloud recording in a secure room, the server necessarily sees the media — the UI states
          this before you enable it.
        </div>
      </div>
    </div>`;
}

/* ============================================================
   Cards
   ============================================================ */

function renderRoomCard(room) {
  const isLive = room.status === 'live';
  const faces = Array.from({ length: Math.min(3, Math.max(1, room.participants || 1)) })
    .map((_, i) => `<span class="face face-${i}">${initials(['Sarah Malik', 'John Carter', 'Alex Rivera'][i] || 'ZM')}</span>`)
    .join('');

  return `
    <button class="room-card ${isLive ? 'is-live' : ''}" data-room="${room.id}" data-action="detail">
      <div class="room-card-top">
        <div class="room-card-title">${esc(room.title)}</div>
        ${isLive ? '<span class="chip live"><span class="dot"></span>live</span>' : ''}
      </div>
      <div class="room-card-when">
        ${icon('calendar')}${isLive ? `started ${relative(room.startedAt)}` : `${fmtDay(room.scheduledFor)} · ${fmtTime(room.scheduledFor)}`}
        <span style="color:var(--ink-4)">·</span>${room.durationMinutes} min
      </div>
      <div class="room-card-tags">
        <span class="chip">${esc(room.typeLabel)}</span>
        <span class="chip violet">${icon('spark')}${esc(room.aiModeLabel.replace('AI ', ''))}</span>
        ${room.secure ? `<span class="chip secure">${icon('lock')}secure</span>` : ''}
        ${room.hasRecording ? `<span class="chip rose">${icon('rec')}rec</span>` : ''}
        ${room.recurrence ? `<span class="chip">${icon('history')}${esc(room.recurrence.frequency)}</span>` : ''}
      </div>
      <div class="room-card-foot">
        <div class="facepile">${faces}${room.participants + room.invited > 3 ? `<span class="more">+${room.participants + room.invited - 3}</span>` : ''}</div>
        <span class="spacer" style="flex:1"></span>
        <span class="chip">${icon('users')}${room.participants || room.invited}</span>
      </div>
    </button>`;
}

function renderRoomRow(room) {
  return `
    <button class="row" data-room="${room.id}" data-action="detail">
      <div class="row-icon ${room.status === 'ended' ? 'green' : 'blue'}">${icon(room.status === 'ended' ? 'notes' : 'video')}</div>
      <div class="row-body">
        <div class="row-title">${esc(room.title)}</div>
        <div class="row-sub">${fmtDay(room.scheduledFor)} · ${fmtTime(room.scheduledFor)} · ${esc(room.typeLabel)}</div>
      </div>
      <div class="row-meta">
        ${room.status === 'ended' ? '<span class="chip green">notes ready</span>' : ''}
        <span class="chip">${icon('spark')}${esc(room.aiModeLabel)}</span>
      </div>
    </button>`;
}

/* ============================================================
   Bindings
   ============================================================ */

function bindRoomClicks() {
  $$('[data-action]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('click', (e) => {
      const action = el.dataset.action;
      const roomId = el.dataset.room;
      e.stopPropagation();

      if (action === 'new') return openNewModal();
      if (action === 'organizer') return open('#organizerModal');
      if (action === 'all') return setView('all');
      if (action === 'open') return openRoom(roomId);
      if (action === 'share') return openShare(roomId);
      if (action === 'detail') return showDetail(roomId);
      if (action === 'report') return showReport(roomId);
      if (action === 'clear-activity') return clearActivity();
      return undefined;
    });
  });

  $$('[data-memory]').forEach((el) => {
    el.addEventListener('click', () => {
      $('#searchInput').value = el.dataset.memory;
      state.query = el.dataset.memory;
      runMemorySearch(el.dataset.memory);
    });
  });

  $$('[data-provider]').forEach((el) => {
    el.addEventListener('click', () => switchProvider(el.dataset.provider));
  });
}

function bindViewActions() {
  /* single delegated pass above covers everything */
}

/* ============================================================
   Actions
   ============================================================ */

function openRoom(roomId) {
  const room = state.rooms.find((r) => r.id === roomId);
  if (!room) return;
  window.location.href = `/r/${room.code}`;
}

function openShare(roomId) {
  const room = state.rooms.find((r) => r.id === roomId);
  if (!room) return;
  const url = `${window.location.origin}/r/${room.code}`;
  $('#shareLink').value = url;
  $('#shareOrg').textContent = room.organizer?.organization || 'Your organization';
  $('#shareHost').textContent = room.organizer?.email || state.identity?.email || '';
  $('#shareHint').textContent =
    room.secure
      ? 'Secure session: guests join a waiting room and are verified before entry.'
      : room.admission === 'open'
        ? 'Guests join with one click. No account required.'
        : `Admission policy: ${room.admission}.`;
  $('#shareExtra').innerHTML = `
    <div class="toggle-row">
      <div><div class="label">Copy invite text</div><div class="desc">Title, time and link, ready to paste into ZMail or any email.</div></div>
      <button class="btn sm" id="btnCopyInvite">${icon('copy')}Copy invite</button>
    </div>`;
  $('#btnCopyInvite').addEventListener('click', async () => {
    const when = `${fmtDay(room.scheduledFor)} ${fmtTime(room.scheduledFor)}`;
    const text = `${room.organizer?.organization || ''} — ${room.title}\n${when} (${room.durationMinutes} min)\n${url}\n\nJoin from your browser. Click the link, enter your name, and you are in.`;
    await navigator.clipboard.writeText(text);
    toast('Invite copied');
  });
  open('#shareModal');
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText($('#shareLink').value);
    toast('Join link copied');
  } catch {
    toast('Copy failed — select the link manually', 'error');
  }
}

async function showDetail(roomId) {
  try {
    const room = await api(`/api/rooms/${roomId}`);
    $('#detailTitle').textContent = room.title;
    $('#detailSub').textContent = `${room.typeLabel} · ${fmtDay(room.scheduledFor)} ${fmtTime(room.scheduledFor)}`;
    $('#detailBody').innerHTML = renderDetailBody(room);
    $('#detailFoot').innerHTML = `
      <button class="btn ghost sm" data-detail-action="share">${icon('link')}Invite</button>
      ${room.status === 'ended' ? `<button class="btn sm" data-detail-action="report">${icon('notes')}Report</button>` : ''}
      ${room.status === 'live' ? `<button class="btn sm" data-detail-action="ai-notes">${icon('spark')}Live notes</button>` : ''}
      <span class="spacer"></span>
      ${room.status === 'scheduled' ? `<button class="btn sm" data-detail-action="start">${icon('play')}Start now</button>` : ''}
      <button class="btn primary" data-detail-action="open">${icon('video')}${room.status === 'ended' ? 'Open room' : 'Join room'}</button>`;

    $$('#detailFoot [data-detail-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.detailAction;
        if (action === 'open') return openRoom(room.id);
        if (action === 'share') return openShare(room.id);
        if (action === 'report') return showReport(room.id);
        if (action === 'ai-notes') {
          close('#detailModal');
          return openRoom(room.id);
        }
        if (action === 'start') return startRoom(room.id);
        return undefined;
      });
    });

    open('#detailModal');
  } catch (err) {
    showError(err);
  }
}

function renderDetailBody(room) {
  const waiting = room.waitingRoom || [];
  return `
    <div class="room-card-tags">
      <span class="chip ${room.status === 'live' ? 'live' : 'blue'}">${room.status === 'live' ? '<span class="dot"></span>live' : room.status}</span>
      <span class="chip">${esc(room.typeLabel)}</span>
      <span class="chip violet">${icon('spark')}${esc(room.aiModeLabel)}</span>
      ${room.secure ? `<span class="chip secure">${icon('lock')}secure session</span>` : ''}
      <span class="chip">${icon('users')}${room.admission}</span>
    </div>

    <div>
      <div class="section-head" style="margin-bottom:8px"><h2>Brief</h2><span class="count">prepared by AI</span></div>
      <div class="stat-card">
        <div class="label">Purpose</div>
        <div style="font-size:13px;font-weight:560;margin-top:2px">${esc(room.brief?.purpose || room.purpose || room.title)}</div>
        <div style="display:flex;gap:14px;margin-top:10px;flex-wrap:wrap">
          ${[
            ['Participants', room.brief?.participants ?? room.participants?.length ?? 0],
            ['Agenda', (room.agenda || room.brief?.agenda || []).length],
            ['Documents', room.brief?.documents ?? (room.files || []).length],
            ['Open actions', room.brief?.outstandingActions ?? 0]
          ]
            .map(([label, value]) => `<div><div class="label">${label}</div><div style="font-size:16px;font-weight:660">${value}</div></div>`)
            .join('')}
        </div>
      </div>
    </div>

    ${(room.agenda || []).length ? `
    <div>
      <div class="section-head" style="margin-bottom:8px"><h2>Agenda</h2></div>
      <div class="rows">
        ${room.agenda.map((a, i) => `<div class="row" style="padding:9px 13px">
          <div class="row-icon blue" style="width:24px;height:24px;font-size:11px;font-weight:700">${i + 1}</div>
          <div class="row-body"><div class="row-title">${esc(a.text)}</div>${a.minutes ? `<div class="row-sub">${a.minutes} min</div>` : ''}</div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    ${waiting.length ? `
    <div>
      <div class="section-head" style="margin-bottom:8px"><h2>Waiting room</h2><span class="count">${waiting.length}</span></div>
      <div class="rows">
        ${waiting.map((w) => `<div class="row" style="padding:9px 13px">
          <div class="row-icon amber">${icon('users')}</div>
          <div class="row-body"><div class="row-title">${esc(w.name)}</div><div class="row-sub">${esc(w.email || 'guest')} · requested ${fmtTime(w.requestedAt)}</div></div>
          <div class="row-meta">
            <button class="btn sm" data-admit="${w.id}">Admit</button>
            <button class="btn sm ghost" data-reject="${w.id}">Reject</button>
          </div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    <div>
      <div class="section-head" style="margin-bottom:8px"><h2>Decisions &amp; actions</h2><span class="count">AI-detected</span></div>
      <div class="rows">
        ${(room.decisions || []).slice(0, 4).map((d) => `<div class="row" style="padding:9px 13px">
          <div class="row-icon green">${icon('check')}</div>
          <div class="row-body"><div class="row-title">${esc(d.text)}</div><div class="row-sub">${d.approvedBy ? 'approved' : 'proposed'} · ${esc(d.source || 'transcript')}</div></div>
        </div>`).join('')}
        ${(room.actions || []).slice(0, 4).map((a) => `<div class="row" style="padding:9px 13px">
          <div class="row-icon ${a.approved ? 'blue' : 'amber'}">${icon('check')}</div>
          <div class="row-body"><div class="row-title">${esc(a.owner)} — ${esc(a.task)}</div><div class="row-sub">${a.deadline ? `by ${esc(a.deadline)} · ` : ''}${a.approved ? 'approved' : 'awaiting approval'}</div></div>
        </div>`).join('')}
        ${!(room.decisions || []).length && !(room.actions || []).length ? '<div class="row" style="padding:9px 13px"><div class="row-body"><div class="row-sub">Nothing detected yet — the agent needs a conversation first.</div></div></div>' : ''}
      </div>
    </div>

    <div>
      <div class="section-head" style="margin-bottom:8px"><h2>Files</h2><span class="count">${(room.files || []).length}</span></div>
      <div class="rows">
        ${(room.files || []).map((f) => `<div class="row" style="padding:9px 13px">
          <div class="row-icon blue">${icon('files')}</div>
          <div class="row-body"><div class="row-title">${esc(f.name)}</div><div class="row-sub">${Math.round((f.sizeBytes || 0) / 1024)} KB · ${esc(f.storage?.location || 'your storage')}</div></div>
          <div class="row-meta">
            ${f.policy?.viewOnly ? '<span class="chip">view only</span>' : ''}
            ${f.policy?.downloadAllowed ? '<span class="chip green">download</span>' : '<span class="chip rose">no download</span>'}
            ${f.policy?.aiAccess ? '<span class="chip violet">AI</span>' : ''}
          </div>
        </div>`).join('') || '<div class="row" style="padding:9px 13px"><div class="row-body"><div class="row-sub">No files in this sandbox yet.</div></div></div>'}
      </div>
    </div>`;
}

async function startRoom(roomId) {
  try {
    await api(`/api/rooms/${roomId}/start`, { method: 'POST', body: '{}' });
    toast('Meeting started');
    close('#detailModal');
    await loadAll();
    openRoom(roomId);
  } catch (err) {
    showError(err);
  }
}

async function showReport(roomId) {
  try {
    const report = await api(`/api/rooms/${roomId}/ai/report`);
    const room = await api(`/api/rooms/${roomId}`);
    $('#detailTitle').textContent = `AI meeting report`;
    $('#detailSub').textContent = room.title;
    $('#detailBody').innerHTML = `
      <div class="stat-card">
        <div class="label">Summary</div>
        <div style="font-size:12.5px;line-height:1.6;margin-top:4px">${esc(report.summary)}</div>
        <div style="display:flex;gap:14px;margin-top:10px">
          <div><div class="label">Duration</div><div style="font-size:16px;font-weight:660">${report.durationMinutes} min</div></div>
          <div><div class="label">Decisions</div><div style="font-size:16px;font-weight:660">${report.decisions.length}</div></div>
          <div><div class="label">Actions</div><div style="font-size:16px;font-weight:660">${report.actions.length}</div></div>
          <div><div class="label">Open</div><div style="font-size:16px;font-weight:660">${report.openQuestions.length}</div></div>
        </div>
      </div>

      <div>
        <div class="section-head" style="margin-bottom:8px"><h2>Action items</h2></div>
        <div class="rows">
          ${report.actions.map((a) => `<div class="row" style="padding:9px 13px">
            <div class="row-icon ${a.approved ? 'green' : 'amber'}">${icon('check')}</div>
            <div class="row-body"><div class="row-title">${esc(a.owner)}</div><div class="row-sub">${esc(a.task)}</div></div>
            <div class="row-meta">${a.deadline ? `<span class="chip">${esc(a.deadline)}</span>` : '<span class="chip">no date</span>'}</div>
          </div>`).join('') || '<div class="row"><div class="row-body"><div class="row-sub">No action items.</div></div></div>'}
        </div>
      </div>

      ${report.highlights.length ? `
      <div>
        <div class="section-head" style="margin-bottom:8px"><h2>Important moments</h2><span class="count">clickable timestamps</span></div>
        <div class="rows">
          ${report.highlights.map((h) => `<div class="row" style="padding:9px 13px">
            <div class="row-icon violet">${icon('clock')}</div>
            <div class="row-body"><div class="row-title">${esc(h.label)}</div><div class="row-sub">${esc(h.detail)}</div></div>
            <div class="row-meta"><span class="chip blue">${Math.floor(h.offsetSeconds / 60)}:${String(h.offsetSeconds % 60).padStart(2, '0')}</span></div>
          </div>`).join('')}
        </div>
      </div>` : ''}

      <div class="stat-card">
        <div class="label">Follow-up</div>
        <div class="hint" style="margin-top:5px">${report.followUp ? 'Draft ready — review before it goes to ZMail.' : 'Not drafted yet.'}</div>
      </div>`;

    $('#detailFoot').innerHTML = `
      <button class="btn ghost sm" data-report-action="close">Close</button>
      <span class="spacer"></span>
      <button class="btn sm" data-report-action="followup">${icon('mail')}Draft follow-up</button>
      <button class="btn primary" data-report-action="open">${icon('video')}Open room</button>`;

    $$('#detailFoot [data-report-action]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.reportAction;
        if (action === 'close') return close('#detailModal');
        if (action === 'open') return openRoom(room.id);
        if (action === 'followup') {
          try {
            const draft = await api(`/api/rooms/${room.id}/ai/followup`, { method: 'POST', body: '{}' });
            toast('Follow-up draft ready', 'success');
            $('#detailBody').insertAdjacentHTML(
              'beforeend',
              `<div class="stat-card"><div class="label">Draft email</div>
                <div style="font-size:12px;font-weight:600;margin-top:4px">${esc(draft.subject)}</div>
                <pre style="white-space:pre-wrap;font-family:inherit;font-size:12px;line-height:1.55;margin-top:8px;max-height:220px;overflow:auto;color:var(--ink-2)">${esc(draft.body)}</pre>
                <div class="hint">${esc(draft.note)}</div></div>`
            );
          } catch (err) {
            showError(err);
          }
        }
        return undefined;
      });
    });

    open('#detailModal');
  } catch (err) {
    showError(err);
  }
}

/* ------------------------------ new meeting ------------------------------ */

function buildTypeGrid() {
  const types = [
    ['private', 'Private Meeting', 'Small group video/audio'],
    ['business', 'Business Meeting', 'Agenda, notes, actions'],
    ['interview', 'Interview', 'Host + guest, recorded'],
    ['webinar', 'Webinar', 'Host, speakers, audience'],
    ['live', 'Live Show', 'Scene-based production'],
    ['presentation', 'Presentation', 'Speaker + slides'],
    ['workshop', 'Workshop', 'Whiteboard and polls'],
    ['ai', 'AI Session', 'AI as facilitator']
  ];
  $('#typeGrid').innerHTML = types
    .map(
      ([key, label, blurb]) => `<button class="type-option ${key === 'business' ? 'active' : ''}" data-type="${key}">
        <strong>${label}</strong><span>${blurb}</span>
      </button>`
    )
    .join('');

  $$('#typeGrid .type-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#typeGrid .type-option').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedType = btn.dataset.type;
    });
  });

  const modes = [
    ['off', 'AI OFF', 'No AI access. Nothing read, transcribed or summarized.'],
    ['observe', 'AI Observe', 'AI reads context only. It cannot act or write.'],
    ['assistant', 'AI Assistant', 'Summaries, answers, tasks and follow-up drafts.'],
    ['notetaker', 'AI Note-taker', 'Assistant plus always-on minutes and transcript.'],
    ['full', 'AI Full Access', 'May perform actions you approve individually.']
  ];
  $('#newAiMode').innerHTML = modes.map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
  $('#newAiMode').value = 'notetaker';
  $('#aiModeHint').textContent = 'Assistant plus always-on minutes and transcript.';
}

function openNewModal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15 - (now.getMinutes() % 15), 0, 0);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  $('#newWhen').value = local;
  $('#newTitle').value = '';
  $('#newInvitees').value = '';
  $('#newModalTitle').textContent = 'New meeting';
  open('#newModal');
  setTimeout(() => $('#newTitle').focus(), 60);
}

function toggleNew(key) {
  state.newToggles[key] = !state.newToggles[key];
  const map = { waiting: '#tglWaiting', secure: '#tglSecure', startNow: '#tglStartNow' };
  const el = $(map[key]);
  el.classList.toggle('on', state.newToggles[key]);
  el.setAttribute('aria-checked', String(state.newToggles[key]));
}

async function createMeeting() {
  const title = $('#newTitle').value.trim() || `${state.vocab.meetingTypes?.find((t) => t.key === state.selectedType)?.label || 'New'} meeting`;
  const inviteesRaw = $('#newInvitees').value.trim();
  const invitees = inviteesRaw
    ? inviteesRaw
        .split(/[,;\s]+/)
        .filter((v) => v.includes('@'))
        .map((email) => ({ email, name: email.split('@')[0] }))
    : [];
  const when = $('#newWhen').value ? new Date($('#newWhen').value).toISOString() : new Date().toISOString();

  const payload = {
    title,
    type: state.selectedType,
    scheduledFor: when,
    durationMinutes: Number($('#newDuration').value),
    invitees,
    aiMode: $('#newAiMode').value,
    admission: state.newToggles.waiting || state.newToggles.secure ? 'waiting' : 'open',
    secure: state.newToggles.secure,
    startNow: state.newToggles.startNow
  };

  const btn = $('#btnCreateMeeting');
  btn.disabled = true;
  try {
    const result = await api('/api/rooms', { method: 'POST', body: JSON.stringify(payload) });
    close('#newModal');
    toast(state.newToggles.startNow ? 'Meeting created — opening room' : 'Meeting scheduled');
    await loadAll();
    if (state.newToggles.startNow) {
      openRoom(result.room.id);
    } else if (result.calendar?.unavailable) {
      toast('ZCal not running — invite saved without a calendar event', 'warn');
    }
  } catch (err) {
    showError(err);
  } finally {
    btn.disabled = false;
  }
}

/* ----------------------------- organizer ----------------------------- */

async function runOrganizer() {
  const raw = $('#organizerInput').value.trim();
  if (!raw) {
    toast('Tell the agent what you need', 'warn');
    return;
  }
  const btn = $('#btnRunOrganizer');
  btn.disabled = true;
  $('#organizerResult').innerHTML = `<div class="stat-card"><div class="hint">Checking availability and preparing the room…</div></div>`;
  try {
    const draft = await api('/api/ai/organize', { method: 'POST', body: JSON.stringify({ request: raw }) });
    renderDraft(draft);
  } catch (err) {
    $('#organizerResult').innerHTML = '';
    showError(err);
  } finally {
    btn.disabled = false;
  }
}

function renderDraft(draft) {
  $('#organizerResult').innerHTML = `
    <div class="stat-card">
      <div class="label">Proposed meeting</div>
      <div style="font-size:14px;font-weight:650;margin-top:3px">${esc(draft.title)}</div>
      <div class="room-card-tags" style="margin-top:7px">
        <span class="chip">${esc(draft.typeLabel)}</span>
        <span class="chip">${draft.durationMinutes} min</span>
        <span class="chip blue">${icon('calendar')}${draft.slots.length} slots</span>
        <span class="chip ${draft.availability.source === 'zcal' ? 'green' : ''}">${esc(draft.availability.source)}</span>
      </div>
      <div class="hint" style="margin-top:8px">${esc(draft.availability.note || '')}</div>
    </div>

    <div class="rows">
      ${draft.slots
        .map(
          (s, i) => `<button class="row" data-slot="${i}">
            <div class="row-icon ${i === 0 ? 'blue' : ''}">${icon('clock')}</div>
            <div class="row-body">
              <div class="row-title">${esc(s.day || fmtDay(s.start))} · ${esc(s.time || `${fmtTime(s.start)}–${fmtTime(s.end)}`)}</div>
              <div class="row-sub">${esc((s.reasons || []).join(' · ') || 'Within working hours')}</div>
            </div>
            <div class="row-meta">${i === 0 ? `<span class="chip green">${icon('check')}best</span>` : `<span class="chip">${Math.round((s.score || 0) * 100)}</span>`}</div>
          </button>`
        )
        .join('')}
    </div>

    <div class="field">
      <label>Invitation draft</label>
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:12px;line-height:1.6;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px;max-height:200px;overflow:auto">${esc(draft.invite.body)}</pre>
      <div class="hint">Nothing is sent. Approving creates the room and hands the event to ZCal as a proposal.</div>
    </div>

    <div class="modal-foot" style="border:none;background:transparent;padding:0">
      <button class="btn sm ghost" id="btnDiscardDraft">${icon('trash')}Discard</button>
      <span class="spacer" style="flex:1"></span>
      <button class="btn primary" id="btnApproveDraft">${icon('check')}Approve &amp; create room</button>
    </div>`;

  let slotIndex = 0;
  $$('#organizerResult [data-slot]').forEach((btn) => {
    btn.addEventListener('click', () => {
      slotIndex = Number(btn.dataset.slot);
      $$('#organizerResult [data-slot]').forEach((b) => b.classList.remove('active'));
      btn.style.background = 'var(--blue-soft)';
    });
  });

  $('#btnDiscardDraft').addEventListener('click', async () => {
    try {
      await api(`/api/ai/drafts/${draft.id}`, { method: 'DELETE' });
      $('#organizerResult').innerHTML = '';
      toast('Draft discarded');
    } catch (err) {
      showError(err);
    }
  });

  $('#btnApproveDraft').addEventListener('click', async () => {
    try {
      const result = await api(`/api/ai/drafts/${draft.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ slotIndex })
      });
      close('#organizerModal');
      $('#organizerResult').innerHTML = '';
      toast('Meeting created');
      if (result.calendar?.unavailable) {
        toast('ZCal not reachable — room created without a calendar event', 'warn');
      } else if (result.calendar?.pushed) {
        toast('Calendar proposal sent to ZCal');
      }
      await loadAll();
      openShare(result.room.id);
    } catch (err) {
      showError(err);
    }
  });
}

/* ------------------------------- misc ------------------------------- */

async function runMemorySearch(query) {
  try {
    const res = await api(`/api/memory/search?q=${encodeURIComponent(query)}`);
    state.memoryResults = res;
    if (state.view !== 'memory') {
      $$('#primaryNav .nav-item, .side-section .nav-item').forEach((b) => b.classList.toggle('active', b.dataset.view === 'memory'));
      state.view = 'memory';
      $('#viewTitle').textContent = VIEW_TITLES.memory[0];
      $('#viewSub').textContent = `· ${VIEW_TITLES.memory[1]}`;
    }
    const stage = $('#stage');
    stage.innerHTML = renderMemoryResults();
    bindRoomClicks();
  } catch (err) {
    showError(err);
  }
}

async function clearActivity() {
  try {
    await api('/api/ai/activity', { method: 'DELETE' });
    state.activity = [];
    await loadAll();
    toast('AI activity cleared');
  } catch (err) {
    showError(err);
  }
}

async function switchProvider(kind) {
  try {
    const result = await api('/api/ai/provider', {
      method: 'POST',
      body: JSON.stringify({ kind, allowRemote: false })
    });
    state.provider = result;
    toast(`${kind} selected`);
    await loadAll();
  } catch (err) {
    if (err.data?.needsConsent) {
      toast('Remote providers need explicit consent and an organization API key', 'warn');
    } else {
      showError(err);
    }
  }
}

function showIdentity() {
  const id = state.identity;
  if (!id) return;
  $('#detailTitle').textContent = 'Your identity';
  $('#detailSub').textContent = 'organizer context';
  $('#detailBody').innerHTML = `
    <div class="stat-card">
      <div class="label">Personal</div>
      <div style="font-size:13.5px;font-weight:640;margin-top:3px">${esc(id.name)}</div>
      <div class="row-sub">${esc(id.email)}</div>
    </div>
    <div class="stat-card">
      <div class="label">Organization</div>
      <div style="font-size:13.5px;font-weight:640;margin-top:3px">${esc(id.organization.name)}</div>
      <div class="row-sub">${esc(id.organization.plan)} · ${esc(id.organization.domain)} · ${id.organization.seats} seats</div>
      <div class="hint" style="margin-top:7px">Storage policy: ${esc(id.organization.storagePolicy)}. Meetings keep references, not media.</div>
    </div>
    <div class="stat-card">
      <div class="label">Teams</div>
      ${(id.teams || []).map((t) => `<div class="row-title" style="margin-top:6px">${esc(t.name)} <span class="row-sub" style="display:inline">· ${esc(t.department)}</span></div>`).join('')}
    </div>
    <div class="stat-card">
      <div class="label">Guest experience</div>
      <div class="hint" style="margin-top:5px">Click link → enter name → join. No account required unless your security policy asks for it. Guests always see the organizer and host before sending anything.</div>
    </div>`;
  $('#detailFoot').innerHTML = `<span class="spacer"></span><button class="btn primary" id="btnCloseIdentity">Done</button>`;
  $('#btnCloseIdentity').addEventListener('click', () => close('#detailModal'));
  open('#detailModal');
}

/* provider list is fetched lazily for the settings view */
api('/api/ai/providers')
  .then((res) => {
    state.providerOptions = res.providers || [];
    state.provider = res.current || state.provider;
    if (state.view === 'settings') render();
  })
  .catch(() => {});
