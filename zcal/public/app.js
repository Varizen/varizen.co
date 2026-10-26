/**
 * ZCal client — vanilla ES modules, no framework, no build step.
 *
 * Renders the three-column shell: navigation, unified timeline, contextual rail.
 * All state comes from the server API; the client never computes availability or
 * invents times. Writes always go through the sandbox or an explicit user action.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const CATEGORIES = ['violet', 'blue', 'green', 'amber', 'sky', 'red'];

const state = {
  boot: null,
  mode: 'week',
  anchor: new Date(),
  selectedEvent: null,
  selectedDay: null,
  events: [],
  view: null,
  railTab: 'context',
  railOpen: true,
  agent: null,
  sandbox: [],
  searchOpen: false,
  searchResults: null,
  theme: 'light',
  tasks: [],
  settings: null
};

// Visible grid band. 8am–8pm covers a full working day without dead scroll.
const HOURS = { start: 8, end: 20 };
const ROW_H = () => Number(getComputedStyle(document.documentElement).getPropertyValue('--row-h').replace('px', '')) || 56;

/* ------------------------------------------------------------------ *
 * API
 * ------------------------------------------------------------------ */

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

const apiGet = (path) => api(path);
const apiPost = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body || {}) });
const apiPatch = (path, body) => api(path, { method: 'PATCH', body: JSON.stringify(body || {}) });
const apiDelete = (path) => api(path, { method: 'DELETE' });

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

const TZ = () => state.settings?.timeZone || 'UTC';

function fmtTime(iso) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ(), hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));
}

function fmtTimeShort(iso) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ(), hour: 'numeric', minute: '2-digit', hour12: true })
    .format(new Date(iso))
    .replace(':00', '');
}

function fmtDayLong(iso) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ(), weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(iso));
}

function fmtDayShort(iso) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ(), weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso));
}

function fmtRangeTitle() {
  const tz = TZ();
  const a = state.anchor;
  if (state.mode === 'day') {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(a);
  }
  if (state.mode === 'month') {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'long', year: 'numeric' }).format(a);
  }
  if (state.mode === 'agenda') {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'long', year: 'numeric' }).format(a);
  }

  const days = state.view?.days || [];
  if (!days.length) {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'long', year: 'numeric' }).format(a);
  }

  const first = new Date(days[0].date);
  const last = new Date(days[days.length - 1].date);
  const fmt = (d, opts) => new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(d);

  const firstMonth = fmt(first, { month: 'long' });
  const lastMonth = fmt(last, { month: 'long' });
  const lastYear = fmt(last, { year: 'numeric' });
  const lastDay = fmt(last, { day: 'numeric' });

  // Same month: "October 19 – 25, 2026"
  if (firstMonth === lastMonth) {
    return `${firstMonth} ${fmt(first, { day: 'numeric' })} – ${lastDay}, ${lastYear}`;
  }
  // Spans months: "September 29 – October 5, 2026"
  return `${firstMonth} ${fmt(first, { day: 'numeric' })} – ${lastMonth} ${lastDay}, ${lastYear}`;
}

function tzLabel() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ(), timeZoneName: 'shortOffset' }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value || TZ();
  } catch {
    return TZ();
  }
}

function minutesOf(iso) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ(), hour12: false, hour: '2-digit', minute: '2-digit'
  }).formatToParts(new Date(iso));
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24;
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return h * 60 + m;
}

function dayKeyOf(iso) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ(), year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(iso));
  return `${parts.find((p) => p.type === 'year').value}-${parts.find((p) => p.type === 'month').value}-${parts.find((p) => p.type === 'day').value}`;
}

/**
 * Derive a card palette from the calendar's own colour so an event's tint always
 * matches its sidebar swatch. Returns CSS custom properties, not a fixed class,
 * so no calendar can accidentally look like an error state.
 */
function eventTint(hex) {
  const fallback = '#7A5AF8';
  const value = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex : fallback;
  const r = parseInt(value.slice(1, 3), 16) / 255;
  const g = parseInt(value.slice(3, 5), 16) / 255;
  const b = parseInt(value.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const deg = Math.round(h * 360);
  const sat = Math.max(48, Math.round(s * 100));
  const dark = document.documentElement.dataset.theme === 'dark';
  return [
    `--evt-bg: hsl(${deg} ${Math.min(sat, 82)}% ${dark ? 17 : 95}%)`,
    `--evt-ink: hsl(${deg} ${dark ? 72 : Math.min(sat, 70)}% ${dark ? 74 : 36}%)`,
    `--evt-line: hsl(${deg} ${Math.min(sat, 78)}% ${dark ? 52 : 58}%)`
  ].join(';');
}

function catFor(event) {
  const id = event.calendarId || event.id || '';
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return CATEGORIES[hash % CATEGORIES.length];
}

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */

async function boot() {
  const saved = localStorage.getItem('zencal.theme');
  if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) {
    state.theme = 'dark';
    document.documentElement.dataset.theme = 'dark';
  }

  state.boot = await apiGet('/api/bootstrap');
  state.settings = state.boot.settings;
  state.tasks = state.boot.tasks || [];
  state.agent = await apiGet('/api/ai/agent');
  state.sandbox = state.boot.proposals || [];

  // On narrow viewports the contextual rail is an overlay — start it closed so
  // the calendar itself is the first thing you see.
  if (window.matchMedia('(max-width: 1020px)').matches) {
    state.railOpen = false;
    $('#app').classList.add('rail-hidden');
  }

  $('#tzChip').textContent = `${tzLabel()} · ${TZ()}`;
  renderSidebar();
  renderViewSwitch();
  await loadView();
  renderRail();
  wireEvents();
  updateBadges();
}

async function loadView() {
  if (!['day', 'week', 'month', 'agenda'].includes(state.mode)) return;
  const data = await apiGet(
    `/api/view?view=${state.mode}&anchor=${state.anchor.toISOString()}&timeZone=${encodeURIComponent(TZ())}`
  );
  state.view = data;
  state.events = data.events || [];
  $('#rangeTitle').textContent = fmtRangeTitle();
  renderStage();
}

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

function renderSidebar() {
  const list = $('#calendarList');
  const byAccount = new Map();
  for (const cal of state.boot.calendars) {
    const key = cal.accountId;
    if (!byAccount.has(key)) byAccount.set(key, []);
    byAccount.get(key).push(cal);
  }

  const rows = [];
  for (const [accountId, cals] of byAccount) {
    const account = state.boot.accounts.find((a) => a.id === accountId);
    if (!account) continue;
    for (const cal of cals) {
      const color = cal.color || account.color || '#2F6BFF';
      rows.push(`
        <div class="cal-row ${cal.visible === false ? 'off' : ''}" data-cal="${esc(cal.id)}">
          <span class="cal-swatch" style="background:${esc(color)}"></span>
          <span class="cal-name">${esc(cal.name)}</span>
          <span class="cal-tag">${esc(providerShort(cal.provider))}</span>
        </div>`);
    }
  }
  list.innerHTML = rows.join('') || '<div class="empty" style="padding:14px">No calendars yet</div>';

  for (const row of $$('.cal-row', list)) {
    row.addEventListener('click', async () => {
      const id = row.dataset.cal;
      const cal = state.boot.calendars.find((c) => c.id === id);
      cal.visible = cal.visible === false;
      row.classList.toggle('off', cal.visible === false);
      await apiPatch(`/api/calendars/${encodeURIComponent(id)}`, { visible: cal.visible });
      await loadView();
      renderRail();
    });
  }

  const tasksOpen = state.tasks.filter((t) => !t.done).length;
  $('#taskCount').textContent = tasksOpen || '';
  $('#taskCount').dataset.zero = tasksOpen ? '0' : '1';
  const pending = state.sandbox.filter((p) => p.status === 'pending').length;
  $('#sandboxCount').textContent = pending || '';
  $('#sandboxCount').dataset.zero = pending ? '0' : '1';

  $('#btnAgent').classList.toggle('on', Boolean(state.boot.agentMode));
}

function providerShort(provider) {
  return { google: 'Google', microsoft: 'M365', apple: 'iCloud', caldav: 'CalDAV', exchange: 'Exchange', local: 'Local' }[provider] || provider;
}

function renderViewSwitch() {
  for (const b of $$('#viewSwitch button')) b.classList.toggle('active', b.dataset.mode === state.mode);
  for (const b of $$('#primaryNav .nav-item')) {
    b.classList.toggle('active', b.dataset.view === state.mode);
  }
  for (const b of $$('.mnav-item')) b.classList.toggle('active', b.dataset.view === state.mode);
}

function updateBadges() {
  const pending = state.sandbox.filter((p) => p.status === 'pending').length;
  const badge = $('#aiBadge');
  badge.hidden = pending === 0;
  renderSidebar();
}

/* ------------------------------------------------------------------ *
 * Stage renderers
 * ------------------------------------------------------------------ */

function renderStage() {
  const stage = $('#stage');
  if (state.mode === 'week' || state.mode === 'day') stage.innerHTML = renderGrid();
  else if (state.mode === 'month') stage.innerHTML = renderMonth();
  else if (state.mode === 'agenda') stage.innerHTML = renderAgenda();
  else if (state.mode === 'ai') stage.innerHTML = renderAIPlanner();
  else if (state.mode === 'tasks') stage.innerHTML = renderTasks();
  else if (state.mode === 'sandbox') stage.innerHTML = renderSandbox();
  else if (state.mode === 'accounts') stage.innerHTML = renderAccounts();
  else if (state.mode === 'privacy') stage.innerHTML = renderPrivacy();
  else if (state.mode === 'activity') stage.innerHTML = renderActivity();
  else if (state.mode === 'settings') stage.innerHTML = renderSettings();
  else stage.innerHTML = renderGrid();
  bindStage();
}

/* ---------------------------- week / day grid ---------------------------- */

function renderGrid() {
  const days = state.mode === 'day'
    ? (state.view?.days || []).slice(0, 1)
    : state.view?.days || [];
  if (!days.length) return '<div class="empty">No days in view.</div>';

  const cols = days.length;
  const hours = [];
  for (let h = HOURS.start; h <= HOURS.end; h += 1) hours.push(h);
  const rows = hours.length;
  const rowH = ROW_H();
  const todayKey = dayKeyOf(new Date().toISOString());
  const now = new Date();
  const nowMinutes = minutesOf(now.toISOString());
  const nowTop = ((nowMinutes - HOURS.start * 60) / 60) * rowH;

  const head = days.map((d) => {
    const isToday = d.key === todayKey;
    const num = Number(d.key.slice(8, 10));
    const wd = new Intl.DateTimeFormat('en-US', { timeZone: TZ(), weekday: 'short' }).format(new Date(d.date));
    return `<div class="day-head ${isToday ? 'today' : ''}" data-day="${d.key}">
      <span class="day-name">${wd}</span>
      <span class="day-num">${num}</span>
    </div>`;
  }).join('');

  const timeCol = hours.map((h) => {
    const top = (h - HOURS.start) * rowH;
    const label = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' })
      .format(new Date(Date.UTC(2000, 0, 1, h)));
    return `<div class="time-label" style="top:${top}px">${label}</div>`;
  }).join('');

  const dayCols = days.map((d) => {
    const lines = hours.map((h) => {
      const top = (h - HOURS.start) * rowH;
      return `<div class="hour-line" style="top:${top}px"></div><div class="hour-line half" style="top:${top + rowH / 2}px"></div>`;
    }).join('');

    const dayEvents = d.events.filter((e) => !e.allDay);
    const laidOut = layoutDay(dayEvents);
    const eventHtml = laidOut.map(({ event, top, height, left, width, compact, conflicting }) => {
      const isProposed = event.isProposed || event.proposalNote;
      const isFree = event.availability === 'free';
      const cls = ['evt'];
      if (compact) cls.push('compact');
      if (isProposed) cls.push('proposed');
      if (conflicting && !isProposed) cls.push('conflict');
      if (isFree) cls.push('free');
      if (state.selectedEvent === event.id) cls.push('selected');
      const timeLabel = event.allDay ? 'All day' : `${fmtTimeShort(event.start)} – ${fmtTimeShort(event.end)}`;
      const tint = isProposed
        ? '--evt-bg:var(--violet-soft);--evt-ink:var(--violet);--evt-line:var(--violet)'
        : eventTint(event.calendarColor);
      return `<div class="${cls.join(' ')}" data-evt="${esc(event.id)}" data-instance="${esc(event.instanceId || event.id)}"
        style="${tint};top:${top}px;height:${Math.max(height, 18)}px;left:calc(${left}% + 3px);width:calc(${width}% - 6px)"
        title="${esc(event.title)} · ${timeLabel} · ${esc(event.calendarName || '')}">
        ${height >= 32 ? `<span class="evt-time">${esc(timeLabel)}</span>` : ''}
        <span class="evt-title">${esc(event.title)}</span>
        ${height >= 54 && event.location ? `<span class="evt-meta">${esc(event.location)}</span>` : ''}
        ${height >= 68 && (event.attendees || []).length > 1 ? `<span class="evt-meta">${event.attendees.length} people</span>` : ''}
      </div>`;
    }).join('');

    const allDay = d.events.filter((e) => e.allDay);
    const allDayHtml = allDay.length
      ? `<div class="allday-strip">${allDay.map((e) => `<div class="month-evt" data-evt="${esc(e.id)}"><span>${esc(e.title)}</span></div>`).join('')}</div>`
      : '';

    const nowHtml = d.key === todayKey && nowTop >= 0 && nowTop <= rows * rowH
      ? `<div class="now-line" style="top:${nowTop}px"></div>` : '';

    const weekdayShort = new Intl.DateTimeFormat('en-US', { timeZone: TZ(), weekday: 'short' }).format(new Date(d.date));
    const isWeekend = weekdayShort === 'Sat' || weekdayShort === 'Sun';

    return `<div class="day-col ${isWeekend ? 'weekend' : ''}" data-day="${d.key}" style="height:${rows * rowH}px">
      ${lines}${allDayHtml}${eventHtml}${nowHtml}
    </div>`;
  }).join('');

  return `<div class="grid-wrap">
    <div class="grid-head" style="--cols:${cols}">
      <div class="grid-head-corner"></div>${head}
    </div>
    <div class="grid-scroll">
      <div class="grid-body" style="--cols:${cols};--rows:${rows};height:${rows * rowH}px">
        <div class="time-col">${timeCol}</div>
        ${dayCols}
      </div>
    </div>
  </div>`;
}

/** Overlap layout: columns within a day, like Google Calendar. */
function layoutDay(events) {
  const rowH = ROW_H();
  const sorted = [...events].sort((a, b) => new Date(a.start) - new Date(b.start) || new Date(a.end) - new Date(b.end));
  const groups = [];
  let current = [];
  let currentEnd = 0;
  for (const e of sorted) {
    const s = new Date(e.start).getTime();
    const end = new Date(e.end).getTime();
    if (current.length && s >= currentEnd) {
      groups.push(current);
      current = [];
    }
    current.push(e);
    currentEnd = Math.max(currentEnd, end);
  }
  if (current.length) groups.push(current);

  const out = [];
  for (const group of groups) {
    const columns = [];
    for (const e of group) {
      let placed = false;
      for (const col of columns) {
        if (new Date(col[col.length - 1].end) <= new Date(e.start)) {
          col.push(e);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([e]);
    }
    const width = 100 / columns.length;
    columns.forEach((col, ci) => {
      for (const e of col) {
        const startMin = minutesOf(e.start);
        const endMin = minutesOf(e.end);
        const top = ((startMin - HOURS.start * 60) / 60) * rowH;
        const height = Math.max(16, ((endMin - startMin) / 60) * rowH - 2);
        out.push({
          event: e,
          top: Math.max(top, 0),
          height,
          left: ci * width,
          width,
          compact: height < 34,
          conflicting: group.length > 1
        });
      }
    });
  }
  return out;
}

/* ---------------------------- month ---------------------------- */

function renderMonth() {
  const days = state.view?.days || [];
  if (!days.length) return '<div class="empty">No month data.</div>';
  const todayKey = dayKeyOf(new Date().toISOString());
  const monthIdx = Number(dayKeyOf(state.anchor.toISOString()).slice(5, 7));
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const cells = days.map((d) => {
    const outside = Number(d.key.slice(5, 7)) !== monthIdx;
    const isToday = d.key === todayKey;
    const dayNumber = Number(d.key.slice(8, 10));
    const shown = d.events.slice(0, 3);
    const more = d.events.length - shown.length;
    return `<div class="month-cell ${outside ? 'outside' : ''} ${isToday ? 'today' : ''}" data-day="${d.key}">
      <div class="month-day-num">${dayNumber}</div>
      ${shown.map((e) => `<div class="month-evt" data-cat="${catFor(e)}" data-evt="${esc(e.id)}" style="background:var(--${catFor(e) === 'blue' ? 'accent' : catFor(e)}-soft);color:var(--${catFor(e) === 'blue' ? 'accent-ink' : catFor(e)});border-left-color:var(--${catFor(e) === 'blue' ? 'accent' : catFor(e)})"><span>${esc(fmtTimeShort(e.start))} ${esc(e.title)}</span></div>`).join('')}
      ${more > 0 ? `<div class="month-more">+${more} more</div>` : ''}
    </div>`;
  }).join('');

  return `<div class="month-wrap">
    <div class="month-head">${wd.map((d) => `<div>${d}</div>`).join('')}</div>
    <div class="month-grid">${cells}</div>
  </div>`;
}

/* ---------------------------- agenda ---------------------------- */

function renderAgenda() {
  const days = (state.view?.days || []).filter((d) => d.events.length);
  if (!days.length) {
    return `<div class="pane"><div class="empty"><svg><use href="#i-calendar"/></svg><b>Nothing scheduled</b>The next 30 days are clear.</div></div>`;
  }
  const todayKey = dayKeyOf(new Date().toISOString());

  return `<div class="agenda">${days.map((d) => `
    <section class="agenda-group">
      <div class="agenda-date">
        <h3>${fmtDayShort(d.date)}</h3>
        ${d.key === todayKey ? '<span class="today-pill">Today</span>' : ''}
        <span>${d.events.length} ${d.events.length === 1 ? 'event' : 'events'}</span>
      </div>
      ${d.events.map((e) => `
        <div class="agenda-row" data-evt="${esc(e.id)}">
          <div class="agenda-time">${e.allDay ? 'All day' : fmtTimeShort(e.start)}<small>${e.allDay ? '' : fmtTimeShort(e.end)}</small></div>
          <div class="agenda-bar" style="background:var(--${catFor(e) === 'blue' ? 'accent' : catFor(e)})"></div>
          <div class="agenda-info">
            <div class="agenda-title">${esc(e.title)}</div>
            <div class="agenda-sub">
              ${e.location ? `<i><svg><use href="#i-pin"/></svg>${esc(e.location)}</i>` : ''}
              ${(e.attendees || []).length > 1 ? `<i><svg><use href="#i-users"/></svg>${e.attendees.length}</i>` : ''}
              <i>${esc(e.calendarName || '')}</i>
              ${e.availability === 'free' ? '<i>Free</i>' : ''}
            </div>
          </div>
        </div>`).join('')}
    </section>`).join('')}</div>`;
}

/* ---------------------------- AI planner ---------------------------- */

function renderAIPlanner() {
  const plan = state.dailyPlan;
  const agent = state.agent;
  if (!plan || !agent) return '<div class="pane"><div class="empty">Loading plan…</div></div>';

  return `<div class="pane">
    <div class="pane-head">
      <h2>AI Planner</h2>
      <p>${esc(plan.label)} — ${esc(plan.summary.meetingCount)} meetings, ${plan.summary.busyHours}h committed, ${plan.summary.conflictCount} conflict(s). Everything below is a proposal until you approve it.</p>
    </div>

    <div class="stat-row">
      <div class="stat accent"><b>${plan.summary.busyCount}</b><span>Busy blocks</span></div>
      <div class="stat ${plan.summary.conflictCount ? 'red' : 'green'}"><b>${plan.summary.conflictCount}</b><span>Conflicts</span></div>
      <div class="stat green"><b>${plan.summary.freeCount}</b><span>Free</span></div>
      <div class="stat"><b>${plan.summary.busyHours}h</b><span>Committed</span></div>
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-agenda"/></svg><h3>Today's timeline</h3></div>
      ${plan.timeline.length ? plan.timeline.map((t) => `
        <div class="list-row" data-evt="${esc(t.id)}">
          <span class="mono" style="width:52px">${esc(t.time)}</span>
          <span class="cal-swatch" style="background:var(--${t.calendarColor ? '' : 'violet'})"></span>
          <span class="grow"><b>${esc(t.title)}</b><br><span class="muted">${esc(t.calendarName || '')}${t.attendees > 1 ? ` · ${t.attendees} people` : ''}</span></span>
          ${t.availability === 'free' ? '<span class="src-badge">Free</span>' : ''}
        </div>`).join('') : '<div class="empty" style="padding:20px">Nothing scheduled today.</div>'}
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-spark"/></svg><h3>AI suggestions</h3><span class="pill">${plan.suggestions.length}</span></div>
      ${plan.suggestions.length ? plan.suggestions.map((s) => `
        <div class="agent-item">
          <b>${esc(s.title)}</b>
          <span>${esc(s.detail)}</span>
          ${s.proposedSlot ? `<div class="btn-row"><button class="btn sm primary" data-act="suggest-apply" data-id="${esc(s.id)}">Add to sandbox</button></div>` : ''}
        </div>`).join('') : '<div class="empty" style="padding:16px">No suggestions — your day is already clean.</div>'}
    </div>

    ${plan.travelWarnings?.length ? `
    <div class="card">
      <div class="card-head"><svg><use href="#i-pin"/></svg><h3>Travel buffers</h3></div>
      ${plan.travelWarnings.map((w) => `<div class="conflict-card"><b>${esc(w.title)}</b><span>${esc(w.detail)}</span></div>`).join('')}
      <p class="hint" style="margin-top:8px">${esc(plan.travelWarnings[0].estimateSource)}</p>
    </div>` : ''}

    <div class="card">
      <div class="card-head"><svg><use href="#i-users"/></svg><h3>Agent can handle</h3><span class="pill">${agent.aiCanHandle.length}</span></div>
      ${agent.aiCanHandle.map((a) => `
        <div class="agent-item">
          <b>${esc(a.title)}</b>
          <span>${esc(a.detail)}</span>
          <span style="color:var(--ink-4);margin-top:3px">${esc(a.impact)}</span>
          <div class="btn-row">
            <button class="btn sm" data-act="agent-handle" data-id="${esc(a.id)}">Prepare in sandbox</button>
            ${a.requires ? `<span class="src-badge">${esc(a.requires)}</span>` : ''}
          </div>
        </div>`).join('') || '<div class="empty" style="padding:16px">Nothing needs handling right now.</div>'}
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-shield"/></svg><h3>Permissions</h3></div>
      <p class="hint" style="margin-bottom:10px">The agent can only do what you have granted. Changes always land in the sandbox first.</p>
      <div class="perm-grid">
        ${Object.entries(state.boot.capabilities).map(([cap, label]) => {
          const granted = (state.boot.permissions || []).some((g) => g.capability === cap);
          return `<div class="perm ${granted ? 'on' : ''}" data-cap="${esc(cap)}">
            <div class="perm-te"><b>${esc(label)}</b><span>${granted ? 'Granted' : 'Not granted'}</span></div>
            <span class="toggle"><i></i></span>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

/* ---------------------------- tasks ---------------------------- */

function renderTasks() {
  const open = state.tasks.filter((t) => !t.done);
  const done = state.tasks.filter((t) => t.done);
  const row = (t) => `
    <div class="list-row" data-task="${esc(t.id)}">
      <button class="icon-btn" data-act="toggle-task" data-id="${esc(t.id)}" style="width:22px;height:22px">
        ${t.done ? '<svg style="color:var(--green)"><use href="#i-check"/></svg>' : '<svg style="color:var(--ink-5)"><use href="#i-tasks"/></svg>'}
      </button>
      <span class="grow" style="${t.done ? 'text-decoration:line-through;color:var(--ink-4)' : ''}">${esc(t.title)}</span>
      <span class="muted">${t.minutes ? `${t.minutes}m` : ''}</span>
    </div>`;

  return `<div class="pane">
    <div class="pane-head">
      <h2>Tasks</h2>
      <p>Light preparation blocks that can be scheduled into free time. AI will never create a task without your approval.</p>
    </div>
    <div class="card">
      <div class="card-head"><h3>Open</h3><span class="pill">${open.length}</span></div>
      ${open.map(row).join('') || '<div class="empty" style="padding:16px">No open tasks.</div>'}
      <div class="btn-row" style="margin-top:10px">
        <button class="btn sm" data-act="new-task"><svg><use href="#i-plus"/></svg>Add task</button>
      </div>
    </div>
    ${done.length ? `<div class="card">
      <div class="card-head"><h3>Completed</h3><span class="pill">${done.length}</span></div>
      ${done.map(row).join('')}
    </div>` : ''}
  </div>`;
}

/* ---------------------------- sandbox ---------------------------- */

function renderSandbox() {
  const proposals = state.sandbox;
  if (!proposals.length) {
    return `<div class="pane">
      <div class="pane-head">
        <h2>Sandbox</h2>
        <p>The safety layer between AI intention and your real calendars. Nothing here has touched a provider yet.</p>
      </div>
      <div class="empty"><svg><use href="#i-flask"/></svg><b>No proposals</b>Ask the AI planner for something like “rearrange tomorrow so I have a 3-hour work block”.</div>
    </div>`;
  }

  return `<div class="pane">
    <div class="pane-head">
      <h2>Sandbox</h2>
      <p>Isolated execution environment. Approve per-operation or as a group. The real calendar is untouched until you apply.</p>
    </div>
    ${proposals.map((p) => renderProposal(p)).join('')}
  </div>`;
}

function renderProposal(p) {
  const badgeClass = p.status === 'partially-applied' ? 'partial' : p.status;
  const preview = p.preview || {};
  const ops = (p.operations || []).map((op) => {
    const icon = { move: 'i-arrow-right', update: 'i-edit', create: 'i-plus', delete: 'i-trash', invite: 'i-users', message: 'i-link' }[op.type] || 'i-edit';
    const cls = ['move', 'update'].includes(op.type) ? 'move' : op.type;
    const detail = op.type === 'move' || op.type === 'update'
      ? `${fmtTime(op.targetStart || op.start)} → ${fmtTime(op.targetEnd || op.end)}`
      : `${fmtTime(op.start)} – ${fmtTime(op.end)}`;
    return `<div class="op">
      <span class="op-icon ${cls}"><svg><use href="#${icon}"/></svg></span>
      <span class="op-text"><b>${esc(op.title || op.type)}</b><span>${esc(op.type)} · ${esc(detail)}${op.reason ? ` · ${esc(op.reason)}` : ''}</span></span>
    </div>`;
  }).join('');

  const stats = preview.stats || {};
  return `<div class="proposal">
    <div class="proposal-head">
      <h4>${esc(p.intent)}</h4>
      ${p.simulation ? '<span class="badge simulation">Simulation</span>' : ''}
      <span class="badge ${badgeClass}">${esc(p.status)}</span>
    </div>
    <div class="proposal-body">
      ${p.rationale ? `<p class="proposal-why">${esc(p.rationale)}</p>` : ''}
      ${ops}
      <div class="sim-strip">
        ${stats.moved ? `<span class="sim-chip">${stats.moved} moved</span>` : ''}
        ${stats.added ? `<span class="sim-chip ok">${stats.added} added</span>` : ''}
        ${stats.removed ? `<span class="sim-chip bad">${stats.removed} removed</span>` : ''}
        ${stats.conflictsIntroduced ? `<span class="sim-chip bad">${stats.conflictsIntroduced} new conflict(s)</span>` : '<span class="sim-chip ok">No new conflicts</span>'}
      </div>
      ${p.status === 'pending' ? `<div class="btn-row" style="margin-top:11px">
        <button class="btn sm primary" data-act="apply-proposal" data-id="${esc(p.id)}"><svg><use href="#i-check"/></svg>Apply changes</button>
        <button class="btn sm" data-act="simulate-proposal" data-id="${esc(p.id)}">Preview</button>
        <button class="btn sm ghost" data-act="discard-proposal" data-id="${esc(p.id)}">Discard</button>
      </div>` : ''}
      ${p.status === 'applied' ? `<div class="btn-row" style="margin-top:10px"><span class="sim-chip ok">Applied to native providers</span></div>` : ''}
    </div>
  </div>`;
}

/* ---------------------------- accounts ---------------------------- */

function renderAccounts() {
  return `<div class="pane">
    <div class="pane-head">
      <h2>Accounts</h2>
      <p>Every calendar stays with its provider. ZCal stores only provider references and a minimal encrypted cache.</p>
    </div>
    ${state.boot.accounts.map((a) => `
      <div class="card">
        <div class="card-head">
          <span class="cal-swatch" style="background:${esc(a.color)}"></span>
          <h3>${esc(a.label)}</h3>
          <span class="src-badge">${esc(a.provider)}</span>
          <span class="sim-chip ok">${esc(a.status)}</span>
        </div>
        <div class="list-row"><span class="grow muted">${esc(a.email)}</span></div>
        <div class="list-row"><span class="grow muted">Time zone</span><span class="mono">${esc(a.timeZone || '')}</span></div>
        <div class="list-row"><span class="grow muted">Last sync</span><span class="mono">${a.lastSyncAt ? esc(new Date(a.lastSyncAt).toLocaleString()) : 'never'}</span></div>
        ${a.scopes ? `<div class="list-row"><span class="grow muted">Scopes</span><span class="mono">${esc(a.scopes)}</span></div>` : ''}
        <div class="btn-row" style="margin-top:9px">
          <button class="btn sm" data-act="sync-account" data-id="${esc(a.id)}"><svg><use href="#i-refresh"/></svg>Sync</button>
          <button class="btn sm ghost" data-act="disconnect-account" data-id="${esc(a.id)}">Disconnect</button>
        </div>
      </div>`).join('')}
    <div class="card">
      <div class="card-head"><svg><use href="#i-plus"/></svg><h3>Connect another calendar</h3></div>
      <p class="hint" style="margin-bottom:10px">OAuth 2.0 with PKCE and least-privilege scopes. CalDAV uses an app-specific password stored encrypted.</p>
      <div class="form-grid">
        <div class="field"><label>Provider</label>
          <select id="newProvider">${state.boot.providers.filter((p) => p.kind !== 'local').map((p) => `<option value="${esc(p.kind)}">${esc(p.label)}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Email</label><input id="newEmail" type="email" placeholder="you@example.com"></div>
        <div class="field"><label>Label</label><input id="newLabel" type="text" placeholder="Work Calendar"></div>
        <button class="btn primary" data-act="connect-account">Connect</button>
      </div>
    </div>
  </div>`;
}

/* ---------------------------- privacy ---------------------------- */

function renderPrivacy() {
  const p = state.privacy;
  if (!p) return '<div class="pane"><div class="empty">Loading privacy report…</div></div>';
  return `<div class="pane">
    <div class="pane-head">
      <h2>Privacy Center</h2>
      <p>Everything ZCal knows about you, what it can do, and how to revoke it.</p>
    </div>

    <div class="stat-row">
      <div class="stat"><b>${p.accounts.length}</b><span>Accounts</span></div>
      <div class="stat"><b>${p.calendars.length}</b><span>Calendars</span></div>
      <div class="stat"><b>${p.cache.cachedEvents}</b><span>Cached events</span></div>
      <div class="stat"><b>${(p.aiAccess.permissions || []).length}</b><span>AI grants</span></div>
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-lock"/></svg><h3>Local cache</h3></div>
      <div class="list-row"><span class="grow muted">File</span><span class="mono">${esc(p.cache.cacheFile)}</span></div>
      <div class="list-row"><span class="grow muted">Cipher</span><span class="mono">${esc(p.cache.cipher)}</span></div>
      <div class="list-row"><span class="grow muted">Size</span><span class="mono">${(p.cache.cacheBytes / 1024).toFixed(1)} KB</span></div>
      <div class="list-row"><span class="grow muted">Events</span><span class="mono">${p.cache.cachedEvents}</span></div>
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-spark"/></svg><h3>AI access</h3></div>
      <div class="list-row"><span class="grow muted">Provider</span><span class="mono">${esc(p.aiAccess.provider.kind)}</span></div>
      <div class="list-row"><span class="grow muted">Agent mode</span><span class="mono">${p.aiAccess.agentMode ? 'on' : 'off'}</span></div>
      <div class="list-row"><span class="grow muted">Grants</span><span class="mono">${(p.aiAccess.permissions || []).length}</span></div>
      <div class="btn-row" style="margin-top:9px">
        <button class="btn sm danger" data-act="revoke-all-ai">Revoke all AI access</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-grid"/></svg><h3>Browser sandbox</h3></div>
      <div class="list-row"><span class="grow muted">Enabled</span><span class="mono">${p.browserAccess.enabled ? 'yes' : 'no'}</span></div>
      <div class="list-row"><span class="grow muted">Isolated sessions</span><span class="mono">${p.sessions}</span></div>
      <div class="list-row"><span class="grow muted">Local file access</span><span class="mono">denied</span></div>
      <div class="list-row"><span class="grow muted">Saved passwords</span><span class="mono">denied</span></div>
    </div>

    <div class="card">
      <div class="card-head"><svg><use href="#i-clock"/></svg><h3>Recent AI actions</h3></div>
      ${(p.aiActions || []).slice(0, 10).map((a) => `<div class="list-row">
        <span class="mono" style="width:60px">${esc(new Date(a.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</span>
        <span class="grow">${esc(a.detail)}</span>
      </div>`).join('') || '<div class="empty" style="padding:14px">No AI actions yet.</div>'}
    </div>
  </div>`;
}

/* ---------------------------- activity ---------------------------- */

function renderActivity() {
  const log = state.activity || [];
  return `<div class="pane">
    <div class="pane-head">
      <h2>AI Activity</h2>
      <p>Every consequential action is auditable. Nothing is acted on without a recorded approval.</p>
    </div>
    ${log.length ? `<div class="card" style="padding:8px">${log.map((a) => `
      <div class="list-row">
        <span class="mono" style="width:74px">${esc(new Date(a.at).toLocaleDateString([], { month: 'short', day: 'numeric' }))}</span>
        <span class="sim-chip" style="background:var(--bg-soft-2)">${esc(a.action)}</span>
        <span class="grow" style="font-size:11.5px">${esc(a.detail)}</span>
      </div>`).join('')}</div>` : '<div class="empty">No activity recorded.</div>'}
  </div>`;
}

/* ---------------------------- settings ---------------------------- */

function renderSettings() {
  const s = state.settings;
  return `<div class="pane">
    <div class="pane-head">
      <h2>Settings</h2>
      <p>Time zone, working hours and agent defaults. These are what the scheduling engine uses — no hidden assumptions.</p>
    </div>

    <div class="card">
      <div class="card-head"><h3>Time</h3></div>
      <div class="form-grid">
        <div class="field"><label>Time zone</label>
          <input id="setTz" type="text" value="${esc(s.timeZone)}" placeholder="Asia/Karachi">
          <span class="hint">IANA time zone name. Events keep their own zone; this only changes how you see them.</span>
        </div>
        <div class="field-row">
          <div class="field"><label>Work starts</label><input id="setStart" type="text" value="${esc(s.workingHours.start)}"></div>
          <div class="field"><label>Work ends</label><input id="setEnd" type="text" value="${esc(s.workingHours.end)}"></div>
        </div>
        <div class="field"><label>Travel buffer (minutes)</label>
          <input id="setBuffer" type="number" min="0" max="120" value="${s.travelBufferMinutes}">
          <span class="hint">Used to flag potential travel conflicts. Travel time is never estimated automatically.</span>
        </div>
        <div class="field"><label>Default event length (minutes)</label>
          <input id="setDuration" type="number" min="5" max="480" value="${s.defaultDurationMinutes}">
        </div>
        <button class="btn primary" data-act="save-settings">Save settings</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>AI provider</h3></div>
      <div class="form-grid">
        <div class="field"><label>Provider</label>
          <select id="setAI">${state.boot.aiProviders.map((p) => `<option value="${esc(p.kind)}" ${p.kind === state.boot.aiProvider.kind ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}</select>
          <span class="hint">Deterministic local reasoning is the default: nothing leaves your machine. Remote providers are opt-in per organisation.</span>
        </div>
        <button class="btn" data-act="save-ai">Apply provider</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Interface</h3></div>
      <div class="list-row"><span class="grow muted">Theme</span>
        <div class="btn-row">
          <button class="btn sm" data-act="theme-light">Light</button>
          <button class="btn sm" data-act="theme-dark">Dark</button>
        </div>
      </div>
      <div class="list-row"><span class="grow muted">Keyboard shortcuts</span><span class="mono">C · / · T · K · ⌘K · ← →</span></div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Import / export</h3></div>
      <div class="btn-row">
        <button class="btn sm" data-act="export-ics">Export week as .ics</button>
      </div>
      <p class="hint" style="margin-top:8px">Exports are generated locally; nothing is uploaded.</p>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ *
 * Rail
 * ------------------------------------------------------------------ */

async function renderRail() {
  const body = $('#railBody');
  if (!body) return;

  if (state.railTab === 'agent') return renderAgentRail(body);
  if (state.railTab === 'sandbox') return renderSandboxRail(body);

  const ev = state.events.find((e) => e.id === state.selectedEvent || e.instanceId === state.selectedEvent);
  if (!ev) return renderDayRail(body);

  let brief = null;
  try {
    brief = await apiGet(`/api/ai/brief/${encodeURIComponent(ev.id)}`);
  } catch {
    brief = null;
  }

  const conflicts = (state.view?.events ? [] : []).concat([]);
  void conflicts;

  body.innerHTML = `
    <div class="rail-hero">
      <div class="rail-kicker">${esc(ev.calendarName || '')} · ${esc(providerShort(ev.provider))}</div>
      <h3 class="rail-title">${esc(ev.title)}</h3>
      <div class="rail-time"><svg><use href="#i-clock"/></svg>${ev.allDay ? 'All day' : `${fmtTime(ev.start)} – ${fmtTime(ev.end)}`}</div>
      <div class="rail-meta">
        <span>${esc(fmtDayShort(ev.start))}</span>
        <span class="src-badge"><i></i>${esc(ev.timeZone || TZ())}</span>
        ${ev.availability === 'free' ? '<span class="src-badge">Free</span>' : ''}
        ${ev.recurrenceLabel ? `<span class="src-badge">${esc(ev.recurrenceLabel)}</span>` : ''}
      </div>
      ${ev.location ? `<div class="rail-time" style="margin-top:6px"><svg><use href="#i-pin"/></svg>${esc(ev.location)}</div>` : ''}
      ${ev.conference ? `<div class="rail-time"><svg><use href="#i-video"/></svg><a href="${esc(ev.conference.url)}" target="_blank" rel="noopener noreferrer">${esc(ev.conference.label || 'Join')}</a></div>` : ''}
    </div>

    <div class="btn-row" style="margin-bottom:14px">
      <button class="btn sm" data-act="edit-event" data-id="${esc(ev.id)}"><svg><use href="#i-edit"/></svg>Edit</button>
      <button class="btn sm" data-act="delete-event" data-id="${esc(ev.id)}"><svg><use href="#i-trash"/></svg>Delete</button>
      ${(ev.attendees || []).some((a) => a.self && a.status === 'needs-action') ? `
        <button class="btn sm primary" data-act="rsvp" data-id="${esc(ev.id)}" data-rsvp="accept">Accept</button>` : ''}
    </div>

    ${brief?.attendees?.length ? `<div class="rail-section">
      <h4><svg><use href="#i-users"/></svg>Attendees (${brief.attendees.length})</h4>
      ${brief.attendees.map((a) => `
        <div class="attendee">
          <span class="avatar">${initials(a.name || a.email)}</span>
          <span class="attendee-name">${esc(a.name || a.email)}${a.organizer ? ' · organizer' : ''}</span>
          <span class="attendee-status st-${esc(a.status)}">${esc(a.status)}</span>
        </div>`).join('')}
    </div>` : ''}

    <div class="rail-section">
      <h4><svg><use href="#i-spark"/></svg>AI summary</h4>
      <div class="ai-note">
        <b>${esc(ev.title)}</b> runs ${Math.round((new Date(ev.end) - new Date(ev.start)) / 60000)} minutes
        in ${esc(ev.timeZone || TZ())}${(ev.attendees || []).length > 1 ? ` with ${ev.attendees.length} attendees` : ''}.
        ${(ev.attendees || []).filter((a) => a.status === 'needs-action').length
          ? `${(ev.attendees || []).filter((a) => a.status === 'needs-action').length} person(s) haven't responded yet.`
          : 'Everyone has responded.'}
        ${!ev.description ? ' There is no agenda — worth adding one.' : ''}
      </div>
    </div>

    ${brief?.previousMeetings?.length ? `<div class="rail-section">
      <h4><svg><use href="#i-clock"/></svg>Previous related</h4>
      ${brief.previousMeetings.map((p) => `<div class="bullet">${esc(p.title)} · ${esc(p.when)}</div>`).join('')}
    </div>` : ''}

    <div class="rail-section">
      <h4><svg><use href="#i-link"/></svg>Related email</h4>
      ${brief?.emailContext?.available
        ? `<div class="bullet ok">ZMail bridge connected — threads fetched on demand.</div>`
        : `<div class="bullet warn">${esc(brief?.emailContext?.note || 'Connect ZMail to see related email.')}</div>`}
    </div>

    ${ev.description ? `<div class="rail-section">
      <h4><svg><use href="#i-agenda"/></svg>Notes</h4>
      <div style="font-size:11.5px;color:var(--ink-2);line-height:1.6;white-space:pre-wrap">${esc(ev.description)}</div>
    </div>` : ''}

    <div class="rail-section">
      <h4><svg><use href="#i-wand"/></svg>Suggested actions</h4>
      <div class="btn-row">
        <button class="btn sm" data-act="suggest-move" data-id="${esc(ev.id)}">Find a better time</button>
        <button class="btn sm" data-act="suggest-prep" data-id="${esc(ev.id)}">Add prep block</button>
      </div>
    </div>

    <div class="rail-section">
      <h4>Native reference</h4>
      <div class="list-row"><span class="grow muted">Provider</span><span class="mono">${esc(ev.provider)}</span></div>
      <div class="list-row"><span class="grow muted">Calendar</span><span class="mono">${esc(ev.calendarName || ev.calendarId)}</span></div>
      <div class="list-row"><span class="grow muted">Remote ID</span><span class="mono" style="max-width:170px;overflow:hidden;text-overflow:ellipsis">${esc(ev.remoteId || ev.id)}</span></div>
    </div>
  `;
}

function renderDayRail(body) {
  const plan = state.dailyPlan;
  if (!plan) {
    body.innerHTML = '<div class="empty"><svg><use href="#i-spark"/></svg><b>Nothing selected</b>Pick an event to see context, or ask the AI to plan your day.</div>';
    return;
  }
  body.innerHTML = `
    <div class="rail-hero">
      <div class="rail-kicker">AI plan</div>
      <h3 class="rail-title">${esc(plan.label)}</h3>
      <div class="rail-meta">
        <span>${plan.summary.meetingCount} meetings</span>
        <span>${plan.summary.busyHours}h committed</span>
        ${plan.summary.conflictCount ? `<span class="src-badge" style="background:var(--red-soft);color:var(--red)">${plan.summary.conflictCount} conflict</span>` : ''}
      </div>
    </div>

    ${plan.timeline.length ? `<div class="rail-section">
      <h4><svg><use href="#i-agenda"/></svg>Timeline</h4>
      ${plan.timeline.map((t) => `<div class="list-row" data-evt="${esc(t.id)}" style="padding:6px 4px">
        <span class="mono" style="width:48px">${esc(t.time)}</span>
        <span class="grow" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.title)}</span>
      </div>`).join('')}
    </div>` : ''}

    ${plan.freeGaps.filter((g) => g.withinWorkingHours && g.minutes >= 30).length ? `<div class="rail-section">
      <h4><svg><use href="#i-clock"/></svg>Free inside working hours</h4>
      ${plan.freeGaps.filter((g) => g.withinWorkingHours && g.minutes >= 30).slice(0, 4).map((g) => `
        <div class="free-slot">
          <time>${esc(fmtTimeShort(g.start))}</time>
          <span class="grow">${g.minutes}m free</span>
          <button class="btn sm ghost" data-act="block-slot" data-start="${esc(g.start)}" data-end="${esc(g.end)}">Block</button>
        </div>`).join('')}
    </div>` : ''}

    ${plan.suggestions.length ? `<div class="rail-section">
      <h4><svg><use href="#i-wand"/></svg>Suggestions</h4>
      ${plan.suggestions.map((s) => `<div class="agent-item"><b>${esc(s.title)}</b><span>${esc(s.detail)}</span></div>`).join('')}
    </div>` : ''}

    ${state.agent?.conflicts?.length ? `<div class="rail-section">
      <h4><svg><use href="#i-alert"/></svg>Conflicts</h4>
      ${state.agent.conflicts.map((c) => `<div class="conflict-card"><b>${esc(c.title)}</b><span>Overlap ${esc(c.overlap)}</span></div>`).join('')}
    </div>` : ''}

    <div class="rail-section">
      <h4>Ask</h4>
      <div class="btn-row">
        <button class="btn sm" data-act="ask" data-q="Handle my calendar">Handle my calendar</button>
        <button class="btn sm" data-act="ask" data-q="What's my day looking like?">What's my day look like?</button>
      </div>
    </div>
  `;
}

function renderAgentRail(body) {
  const agent = state.agent;
  if (!agent) {
    body.innerHTML = '<div class="empty">Loading agent…</div>';
    return;
  }
  body.innerHTML = `
    <div class="rail-hero">
      <div class="rail-kicker">Agent mode</div>
      <h3 class="rail-title">${esc(agent.today.headline)}</h3>
      <div class="rail-meta">
        <span>${agent.today.focusHours}h focus available</span>
        <span>${agent.today.prepTasks} prep task(s)</span>
      </div>
    </div>

    <div class="agent-block">
      <h4>Needs me (${agent.needsMe.length})</h4>
      ${agent.needsMe.map((n) => `<div class="agent-item">
        <b>${esc(n.title)}</b><span>${esc(n.detail)}</span>
        <div class="btn-row">
          ${(n.actions || []).map((a) => `<button class="btn sm ${a.destructive ? 'danger' : a.type === 'rsvp' && a.rsvp === 'accept' ? 'primary' : ''}"
            data-act="${a.type === 'rsvp' ? 'rsvp' : 'noop'}" data-id="${esc(n.eventId || '')}" data-rsvp="${esc(a.rsvp || '')}">${esc(a.label)}</button>`).join('')}
        </div>
      </div>`).join('') || '<div class="bullet ok">Nothing needs you right now.</div>'}
    </div>

    <div class="agent-block">
      <h4>AI can handle (${agent.aiCanHandle.length})</h4>
      ${agent.aiCanHandle.map((a) => `<div class="agent-item">
        <b>${esc(a.title)}</b><span>${esc(a.detail)}</span>
        <div class="btn-row"><button class="btn sm" data-act="agent-handle" data-id="${esc(a.id)}">Prepare</button></div>
      </div>`).join('') || '<div class="bullet">Nothing to automate.</div>'}
    </div>

    <div class="agent-block">
      <h4>Conflicts (${agent.conflicts.length})</h4>
      ${agent.conflicts.map((c) => `<div class="conflict-card"><b>${esc(c.title)}</b><span>${esc(c.overlap)} · ${esc(c.resolution)}</span></div>`).join('') || '<div class="bullet ok">No conflicts.</div>'}
    </div>

    <div class="btn-row">
      <button class="btn sm primary" data-act="approve-agent-group">Prepare all in sandbox</button>
    </div>
  `;
}

function renderSandboxRail(body) {
  const pending = state.sandbox.filter((p) => p.status === 'pending');
  body.innerHTML = `
    <div class="rail-hero">
      <div class="rail-kicker">Sandbox</div>
      <h3 class="rail-title">${pending.length} proposal(s) awaiting you</h3>
      <div class="rail-meta"><span>Real calendars untouched</span></div>
    </div>
    ${pending.length ? pending.map((p) => `
      <div class="agent-item" style="margin-bottom:8px">
        <b>${esc(p.intent)}</b>
        <span>${p.operations.length} operation(s) · ${esc(p.status)}</span>
        <div class="btn-row">
          <button class="btn sm primary" data-act="apply-proposal" data-id="${esc(p.id)}">Apply</button>
          <button class="btn sm ghost" data-act="discard-proposal" data-id="${esc(p.id)}">Discard</button>
        </div>
      </div>`).join('') : '<div class="bullet ok">Nothing pending. Ask the AI for a change.</div>'}
    <div class="btn-row" style="margin-top:10px">
      <button class="btn sm" data-act="goto" data-view="sandbox">Open sandbox</button>
    </div>
  `;
}

/* ------------------------------------------------------------------ *
 * Events / interaction
 * ------------------------------------------------------------------ */

function bindStage() {
  for (const el of $$('[data-evt]', $('#stage'))) {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectEvent(el.dataset.evt);
    });
  }
  for (const head of $$('.day-head', $('#stage'))) {
    head.addEventListener('click', () => {
      state.mode = 'day';
      state.anchor = new Date(`${head.dataset.day}T12:00:00Z`);
      renderViewSwitch();
      loadView();
    });
  }
  for (const cell of $$('.month-cell', $('#stage'))) {
    cell.addEventListener('dblclick', () => {
      state.mode = 'day';
      state.anchor = new Date(`${cell.dataset.day}T12:00:00Z`);
      renderViewSwitch();
      loadView();
    });
  }
  bindActions($('#stage'));

  // click empty day column = create event at that time
  for (const col of $$('.day-col', $('#stage'))) {
    col.addEventListener('dblclick', (e) => {
      if (e.target.closest('[data-evt]')) return;
      const rect = col.getBoundingClientRect();
      const offsetY = e.clientY - rect.top + col.parentElement.parentElement.scrollTop;
      const minutes = HOURS.start * 60 + Math.round((offsetY / ROW_H()) * 4) * 15;
      openEventModal({ dayKey: col.dataset.day, minutes });
    });
  }
}

async function selectEvent(id) {
  state.selectedEvent = id;
  state.railTab = 'context';
  for (const t of $$('.rail-tab')) t.classList.toggle('active', t.dataset.rail === 'context');
  openRail();
  const ev = state.events.find((e) => e.id === id || e.instanceId === id);
  if (ev) await apiGet(`/api/ai/brief/${encodeURIComponent(ev.id)}`).then((brief) => { state.brief = brief; }).catch(() => { state.brief = null; });
  renderStage();
  await renderRail();
}

function openRail() {
  state.railOpen = true;
  $('#app').classList.remove('rail-hidden');
}

function closeRail() {
  state.railOpen = false;
  $('#app').classList.add('rail-hidden');
}

/* ------------------------------------------------------------------ *
 * AI interaction
 * ------------------------------------------------------------------ */

async function ask(text) {
  if (!text?.trim()) return;
  toast('Thinking…', 'info', 900);
  try {
    const res = await apiPost('/api/ai/command', { text });
    const result = res.result || {};

    if (result.search) {
      openSearchResults(text, result.search);
      return;
    }
    if (result.proposal) {
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      toast(result.message || 'Proposal ready in the sandbox.', 'ok');
      state.railTab = 'sandbox';
      for (const t of $$('.rail-tab')) t.classList.toggle('active', t.dataset.rail === 'sandbox');
      openRail();
      await renderRail();
      if (state.mode === 'sandbox' || state.mode === 'ai') {
        state.dailyPlan = await apiGet('/api/ai/plan');
        renderStage();
      }
      return;
    }
    if (result.options?.length && res.intent?.action === 'schedule') {
      showSlotPicker(result, text);
      return;
    }
    if (result.consequences) {
      toast(result.message || result.consequences.lines.join(' '), 'warn', 5200);
      return;
    }
    if (result.timeline || result.headline) {
      toast(result.headline || 'Here is your day.', 'ok');
      state.dailyPlan = result;
      state.railTab = 'context';
      openRail();
      await renderRail();
      return;
    }
    if (result.message) {
      toast(result.message, 'warn', 4200);
      return;
    }
    toast('Done.', 'ok');
  } catch (err) {
    toast(err.message, 'err', 5200);
  }
}

async function showSlotPicker(result, rawText) {
  const options = result.options || [];
  openModal({
    title: `Find a time — ${result.durationMinutes} min`,
    wide: true,
    body: `
      <p class="hint" style="margin-bottom:12px">${esc(rawText)}</p>
      <div class="form-grid">
        ${options.map((o, i) => `
          <div class="sr-hit" data-slot="${i}">
            <div class="bar" style="background:var(--accent)"></div>
            <div class="grow">
              <b>${esc(fmtDayShort(o.start))} · ${esc(fmtTime(o.start))} – ${esc(fmtTime(o.end))}</b>
              <span>${esc((o.reasons || []).slice(0, 3).join(' · ') || 'Fits working hours and has no conflicts')}</span>
            </div>
            <button class="btn sm primary" data-pick="${i}">Schedule</button>
          </div>`).join('') || '<div class="empty">No free options found.</div>'}
      </div>
      <p class="hint" style="margin-top:12px">Choosing a time creates a sandbox proposal. Nothing is written to a real calendar until you press Apply.</p>
    `
  });

  for (const btn of $$('[data-pick]', $('#modalBody'))) {
    btn.addEventListener('click', async () => {
      const opt = options[Number(btn.dataset.pick)];
      const calendar = state.boot.calendars.find((c) => c.visible !== false && !c.readOnly);
      const proposal = await apiPost('/api/sandbox/proposals', {
        intent: `Schedule ${result.title || 'meeting'} · ${fmtTime(opt.start)}`,
        rationale: (opt.reasons || []).slice(0, 2).join('; '),
        operations: [{
          type: 'create',
          calendarId: calendar.id,
          title: result.title || 'New meeting',
          start: opt.start,
          end: opt.end,
          invitees: result.attendees || [],
          availability: 'busy',
          reason: 'chosen slot'
        }]
      });
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      closeModal();
      toast('Added to sandbox. Review, then apply.', 'ok');
      state.railTab = 'sandbox';
      openRail();
      await renderRail();
    });
  }
}

async function openSearch(q) {
  const results = await apiGet(`/api/search?q=${encodeURIComponent(q)}&timeZone=${encodeURIComponent(TZ())}`);
  openSearchResults(q, results);
}

function openSearchResults(q, results) {
  const hits = results.events || [];
  openModal({
    title: `Search — “${q}”`,
    wide: true,
    body: `
      <p class="hint" style="margin-bottom:12px">${results.count} result(s). Interpreted as: ${esc(results.interpreted?.join(', ') || 'full text')}</p>
      ${hits.length ? hits.map((e) => `
        <div class="sr-hit" data-open="${esc(e.id)}">
          <div class="bar" style="background:var(--${catFor(e) === 'blue' ? 'accent' : catFor(e)})"></div>
          <div class="grow">
            <b>${esc(e.title)}</b>
            <span>${esc(fmtDayShort(e.start))} · ${esc(e.calendarName || '')}${e.location ? ` · ${esc(e.location)}` : ''}</span>
          </div>
          <time>${esc(fmtTimeShort(e.start))}</time>
        </div>`).join('') : '<div class="empty">No events match that search.</div>'}
    `
  });
  for (const hit of $$('[data-open]', $('#modalBody'))) {
    hit.addEventListener('click', () => {
      closeModal();
      selectEvent(hit.dataset.open);
    });
  }
}

/* ------------------------------------------------------------------ *
 * Modal: event editor
 * ------------------------------------------------------------------ */

async function openEventModal({ dayKey = null, minutes = null, event = null } = {}) {
  const calendars = state.boot.calendars.filter((c) => !c.readOnly);
  const tz = TZ();
  let startValue;
  let endValue;
  if (event) {
    startValue = toLocalInput(event.start);
    endValue = toLocalInput(event.end);
  } else {
    const base = dayKey ? new Date(`${dayKey}T00:00:00`) : state.anchor;
    const min = minutes ?? 9 * 60;
    const ymd = dayKey || localYmd(base);
    startValue = `${ymd}T${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
    endValue = `${ymd}T${pad(Math.floor((min + state.settings.defaultDurationMinutes) / 60))}:${pad((min + state.settings.defaultDurationMinutes) % 60)}`;
  }

  openModal({
    title: event ? 'Edit event' : 'New event',
    body: `
      <form class="form-grid" id="eventForm">
        <div class="field"><label>Title</label><input name="title" required value="${esc(event?.title || '')}" placeholder="Meeting title"></div>
        <div class="field-row">
          <div class="field"><label>Starts</label><input name="start" type="datetime-local" required value="${startValue}"></div>
          <div class="field"><label>Ends</label><input name="end" type="datetime-local" required value="${endValue}"></div>
        </div>
        <div class="field"><label>Calendar</label>
          <select name="calendarId">
            ${calendars.map((c) => `<option value="${esc(c.id)}" ${event?.calendarId === c.id ? 'selected' : ''}>${esc(c.name)} · ${esc(providerShort(c.provider))}</option>`).join('')}
          </select>
          <span class="hint">The event is created in the provider that owns this calendar — it will not be copied elsewhere.</span>
        </div>
        <div class="field"><label>Attendees (comma separated)</label>
          <input name="attendees" value="${esc((event?.attendees || []).filter((a) => !a.self).map((a) => a.email).join(', '))}" placeholder="john@varizen.co, sarah.k@varizen.co">
        </div>
        <div class="field"><label>Location</label><input name="location" value="${esc(event?.location || '')}" placeholder="Room 4B or a video link"></div>
        <div class="field"><label>Notes</label><textarea name="description" placeholder="Agenda, context, links…">${esc(event?.description || '')}</textarea></div>
        <div class="field"><label>Time zone</label><input name="timeZone" value="${esc(event?.timeZone || tz)}"></div>
        <div class="btn-row">
          <button class="btn primary" type="submit">${event ? 'Save changes' : 'Create event'}</button>
          <button class="btn ghost" type="button" data-close>Cancel</button>
          ${event ? `<button class="btn danger" type="button" data-act="delete-event" data-id="${esc(event.id)}">Delete</button>` : ''}
        </div>
      </form>
    `
  });

  $('#eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = {
      title: f.get('title'),
      start: new Date(f.get('start')).toISOString(),
      end: new Date(f.get('end')).toISOString(),
      calendarId: f.get('calendarId'),
      location: f.get('location'),
      description: f.get('description'),
      timeZone: f.get('timeZone') || tz,
      attendees: String(f.get('attendees') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((email) => ({ email }))
    };
    try {
      if (event) {
        await apiPatch(`/api/events/${encodeURIComponent(event.id)}`, payload);
        toast('Event updated in the native calendar.', 'ok');
      } else {
        await apiPost('/api/events', payload);
        toast('Event created in the native calendar.', 'ok');
      }
      closeModal();
      await loadView();
      state.agent = await apiGet('/api/ai/agent');
      await renderRail();
    } catch (err) {
      toast(err.message, 'err', 5200);
    }
  });
}

function toLocalInput(iso) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ(), year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

function localYmd(date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ(), year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

const pad = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ *
 * Modal plumbing
 * ------------------------------------------------------------------ */

function openModal({ title, body, wide = false }) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = body;
  $('#modal').classList.toggle('wide', wide);
  $('#overlay').hidden = false;
  bindActions($('#modalBody'));
  for (const b of $$('[data-close]', $('#modalBody'))) b.addEventListener('click', closeModal);
}

function closeModal() {
  $('#overlay').hidden = true;
  $('#modalBody').innerHTML = '';
}

/* ------------------------------------------------------------------ *
 * Toasts
 * ------------------------------------------------------------------ */

function toast(message, kind = 'info', ms = 3200) {
  const icons = { ok: 'i-check', err: 'i-alert', warn: 'i-alert', info: 'i-spark' };
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<svg><use href="#${icons[kind] || 'i-spark'}"/></svg><span>${esc(message)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 200);
  }, ms);
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */

function bindActions(root) {
  for (const el of $$('[data-act]', root)) {
    if (el.dataset.bound) continue;
    el.dataset.bound = '1';
    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      const act = el.dataset.act;
      try {
        await handleAction(act, el);
      } catch (err) {
        toast(err.message, 'err', 5200);
      }
    });
  }
}

async function handleAction(act, el) {
  switch (act) {
    case 'goto':
      setMode(el.dataset.view);
      return;

    case 'toggle-task': {
      const t = await apiPatch(`/api/tasks/${encodeURIComponent(el.dataset.id)}`, {});
      state.tasks = state.tasks.map((x) => (x.id === t.id ? t : x));
      renderStage();
      return;
    }

    case 'new-task': {
      openModal({
        title: 'New task',
        body: `<form class="form-grid" id="taskForm">
          <div class="field"><label>Task</label><input name="title" required placeholder="Prepare board deck"></div>
          <div class="field"><label>Minutes</label><input name="minutes" type="number" value="30" min="5" max="240"></div>
          <div class="btn-row"><button class="btn primary" type="submit">Add</button></div>
        </form>`
      });
      $('#taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        await apiPost('/api/tasks', { title: f.get('title'), minutes: Number(f.get('minutes')) });
        state.tasks = await apiGet('/api/tasks');
        closeModal();
        renderStage();
        renderSidebar();
        toast('Task added.', 'ok');
      });
      return;
    }

    case 'apply-proposal': {
      const res = await apiPost(`/api/sandbox/proposals/${encodeURIComponent(el.dataset.id)}/apply`, {});
      const ok = (res.results || []).filter((r) => r.ok).length;
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      await loadView();
      state.agent = await apiGet('/api/ai/agent');
      renderStage();
      await renderRail();
      toast(`Applied ${ok} operation(s) to native providers.`, 'ok');
      return;
    }

    case 'discard-proposal': {
      await apiPost(`/api/sandbox/proposals/${encodeURIComponent(el.dataset.id)}/discard`, {});
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      renderStage();
      await renderRail();
      toast('Proposal discarded. Nothing was written.', 'ok');
      return;
    }

    case 'simulate-proposal': {
      const prop = await apiGet(`/api/sandbox/proposals/${encodeURIComponent(el.dataset.id)}`);
      const preview = prop.preview;
      openModal({
        title: 'Preview — nothing written yet',
        wide: true,
        body: renderDiff(preview)
      });
      return;
    }

    case 'rsvp': {
      const id = el.dataset.id;
      const rsvp = el.dataset.rsvp;
      await apiPost(`/api/events/${encodeURIComponent(id)}/respond`, { rsvp });
      await loadView();
      state.agent = await apiGet('/api/ai/agent');
      for (const t of $$('.rail-tab')) t.classList.toggle('active', t.dataset.rail === 'agent');
      state.railTab = 'agent';
      await renderRail();
      toast(`Responded: ${rsvp}. Synced to the native calendar.`, 'ok');
      return;
    }

    case 'delete-event': {
      const ev = state.events.find((e) => e.id === el.dataset.id);
      if (!ev) return;
      if (!confirm(`Delete “${ev.title}” from ${ev.calendarName}? This writes to ${ev.provider}.`)) return;
      await apiDelete(`/api/events/${encodeURIComponent(ev.id)}`);
      state.selectedEvent = null;
      closeModal();
      await loadView();
      state.agent = await apiGet('/api/ai/agent');
      await renderRail();
      toast('Event deleted from the native calendar.', 'ok');
      return;
    }

    case 'edit-event': {
      const ev = state.events.find((e) => e.id === el.dataset.id);
      if (!ev) return;
      await openEventModal({ event: ev });
      return;
    }

    case 'suggest-move': {
      const ev = state.events.find((e) => e.id === el.dataset.id);
      if (!ev) return;
      await ask(`move ${ev.title}`);
      return;
    }

    case 'suggest-prep': {
      const ev = state.events.find((e) => e.id === el.dataset.id);
      if (!ev) return;
      const start = new Date(new Date(ev.start).getTime() - 20 * 60000).toISOString();
      await apiPost('/api/sandbox/proposals', {
        intent: `Prep block before “${ev.title}”`,
        rationale: '20 minutes of preparation before the meeting.',
        operations: [{
          type: 'create',
          calendarId: ev.calendarId,
          title: `Prep: ${ev.title}`,
          start,
          end: new Date(new Date(ev.start).getTime() - 5 * 60000).toISOString(),
          availability: 'busy',
          reason: 'preparation'
        }]
      });
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      toast('Prep block proposed in the sandbox.', 'ok');
      return;
    }

    case 'block-slot': {
      await apiPost('/api/sandbox/proposals', {
        intent: 'Protect a focus block',
        rationale: 'Time inside your working hours with no meetings.',
        operations: [{
          type: 'create',
          calendarId: state.boot.calendars.find((c) => c.visible !== false && !c.readOnly)?.id,
          title: 'Focus Block',
          start: el.dataset.start,
          end: el.dataset.end,
          availability: 'busy',
          reason: 'focus'
        }]
      });
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      toast('Focus block added to the sandbox.', 'ok');
      return;
    }

    case 'ask':
      await ask(el.dataset.q);
      return;

    case 'agent-handle': {
      const agent = state.agent;
      const item = (agent?.aiCanHandle || []).find((a) => a.id === el.dataset.id);
      if (!item) return;
      const calendar = state.boot.calendars.find((c) => c.visible !== false && !c.readOnly);
      if (item.kind === 'prep-blocks') {
        const plan = state.dailyPlan || await apiGet('/api/ai/plan');
        const gaps = (plan.freeGaps || []).filter((g) => g.withinWorkingHours && g.minutes >= 30).slice(0, 2);
        const operations = gaps.map((g, i) => ({
          type: 'create',
          calendarId: calendar.id,
          title: `Preparation block ${i + 1}`,
          start: g.start,
          end: new Date(new Date(g.start).getTime() + 30 * 60000).toISOString(),
          availability: 'busy',
          reason: 'prep'
        }));
        if (operations.length) {
          await apiPost('/api/sandbox/proposals', { intent: item.title, rationale: item.impact, operations });
          state.sandbox = await apiGet('/api/sandbox/proposals');
          updateBadges();
          toast('Preparation blocks queued in the sandbox.', 'ok');
          renderStage();
          await renderRail();
        } else {
          toast('No qualifying free window for a prep block today.', 'warn');
        }
        return;
      }
      if (item.kind === 'reschedule-group') {
        const tomorrow = await apiGet(`/api/ai/plan`);
        const gaps = (tomorrow.freeGaps || []).filter((g) => g.withinWorkingHours && g.minutes >= 30);
        const operations = (item.targets || []).slice(0, gaps.length).map((id, i) => {
          const ev = state.events.find((e) => e.id === id);
          if (!ev) return null;
          const gap = gaps[i];
          return {
            type: 'move',
            eventId: id,
            title: ev.title,
            targetStart: gap.start,
            targetEnd: new Date(new Date(gap.start).getTime() + (new Date(ev.end) - new Date(ev.start))).toISOString(),
            reason: 'AI realignment'
          };
        }).filter(Boolean);
        if (operations.length) {
          await apiPost('/api/sandbox/proposals', { intent: item.title, rationale: item.impact, operations });
          state.sandbox = await apiGet('/api/sandbox/proposals');
          updateBadges();
          toast('Reschedule proposal ready in the sandbox.', 'ok');
          renderStage();
          await renderRail();
        } else {
          toast('No free windows available to move those meetings.', 'warn');
        }
        return;
      }
      toast(item.impact || 'This action needs the sandbox.', 'warn');
      return;
    }

    case 'approve-agent-group': {
      await ask('Handle my calendar');
      const plan = await apiGet('/api/ai/plan');
      const calendar = state.boot.calendars.find((c) => c.visible !== false && !c.readOnly);
      const gaps = (plan.freeGaps || []).filter((g) => g.withinWorkingHours && g.minutes >= 30).slice(0, 2);
      if (!gaps.length) {
        toast('Nothing to prepare — no free windows today.', 'warn');
        return;
      }
      const operations = gaps.map((g, i) => ({
        type: 'create',
        calendarId: calendar.id,
        title: `Preparation block ${i + 1}`,
        start: g.start,
        end: new Date(new Date(g.start).getTime() + 30 * 60000).toISOString(),
        availability: 'busy',
        reason: 'agent batch'
      }));
      await apiPost('/api/sandbox/proposals', { intent: 'Agent batch preparation', rationale: 'Prep blocks before heavy meetings.', operations });
      state.sandbox = await apiGet('/api/sandbox/proposals');
      updateBadges();
      toast('Agent batch prepared in the sandbox.', 'ok');
      await renderRail();
      return;
    }

    case 'sync-account': {
      toast('Syncing from provider…', 'info', 1200);
      await apiPost(`/api/accounts/${encodeURIComponent(el.dataset.id)}/sync`, {});
      state.boot = { ...state.boot, accounts: await apiGet('/api/accounts') };
      await loadView();
      toast('Sync complete.', 'ok');
      return;
    }

    case 'disconnect-account': {
      if (!confirm('Disconnect this account and purge its cached events?')) return;
      await apiDelete(`/api/accounts/${encodeURIComponent(el.dataset.id)}`);
      state.boot = {
        ...state.boot,
        accounts: await apiGet('/api/accounts'),
        calendars: await apiGet('/api/calendars')
      };
      renderSidebar();
      renderStage();
      toast('Account disconnected. Cached data purged.', 'ok');
      return;
    }

    case 'connect-account': {
      const provider = $('#newProvider').value;
      const email = $('#newEmail').value.trim();
      const label = $('#newLabel').value.trim();
      if (!email) {
        toast('Email is required.', 'warn');
        return;
      }
      await apiPost('/api/accounts', { provider, email, label });
      state.boot = {
        ...state.boot,
        accounts: await apiGet('/api/accounts'),
        calendars: await apiGet('/api/calendars')
      };
      renderSidebar();
      renderStage();
      toast('Account connected. Provider scopes are least-privilege.', 'ok');
      return;
    }

    case 'revoke-all-ai': {
      if (!confirm('Revoke every AI capability and clear browser sandbox sessions?')) return;
      await apiPost('/api/privacy/revoke-ai', {});
      state.privacy = await apiGet('/api/privacy');
      state.boot = { ...state.boot, permissions: [] };
      renderStage();
      toast('All AI access revoked.', 'ok');
      return;
    }

    case 'save-settings': {
      const patch = {
        timeZone: $('#setTz').value.trim(),
        workingHours: {
          ...state.settings.workingHours,
          start: $('#setStart').value.trim(),
          end: $('#setEnd').value.trim()
        },
        travelBufferMinutes: Number($('#setBuffer').value),
        defaultDurationMinutes: Number($('#setDuration').value)
      };
      state.settings = await apiPatch('/api/settings', patch);
      $('#tzChip').textContent = `${tzLabel()} · ${TZ()}`;
      await loadView();
      toast('Settings saved.', 'ok');
      return;
    }

    case 'save-ai': {
      await apiPost('/api/ai/provider', { kind: $('#setAI').value, allowRemote: $('#setAI').value !== 'deterministic' });
      toast('AI provider updated.', 'ok');
      return;
    }

    case 'theme-light':
      setTheme('light');
      return;
    case 'theme-dark':
      setTheme('dark');
      return;

    case 'export-ics': {
      const res = await apiGet(`/api/export/ics?timeZone=${encodeURIComponent(TZ())}`);
      const blob = new Blob([res.ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zcal-week.ics';
      a.click();
      URL.revokeObjectURL(url);
      toast(`Exported ${res.exported} events.`, 'ok');
      return;
    }

    case 'noop':
      return;

    default:
      return;
  }
}

function renderDiff(preview) {
  if (!preview) return '<div class="empty">No preview available.</div>';
  const item = (e, cls = '') =>
    `<div class="diff-item ${cls}"><time>${esc(fmtTimeShort(e.start))}</time><span>${esc(e.title)}</span></div>`;
  const movedIds = new Set((preview.moved || []).map((m) => m.id));
  const removedIds = new Set((preview.removed || []).map((r) => r.id));

  return `
    <div class="diff">
      <div class="diff-col">
        <div class="diff-label">Now</div>
        ${(preview.before || []).map((e) => item(e, removedIds.has(e.id) ? 'removed' : '')).join('') || '<div class="diff-item">Empty</div>'}
      </div>
      <div class="diff-col">
        <div class="diff-label">After (proposed)</div>
        ${(preview.after || []).map((e) => item(e, movedIds.has(e.id) || e.isProposed ? 'moved' : '')).join('') || '<div class="diff-item">Empty</div>'}
      </div>
    </div>
    <div class="sim-strip">
      ${preview.stats.moved ? `<span class="sim-chip">${preview.stats.moved} moved</span>` : ''}
      ${preview.stats.added ? `<span class="sim-chip ok">${preview.stats.added} added</span>` : ''}
      ${preview.stats.removed ? `<span class="sim-chip bad">${preview.stats.removed} removed</span>` : ''}
      ${preview.conflictsIntroduced.length ? `<span class="sim-chip bad">${preview.conflictsIntroduced.length} new conflict(s)</span>` : '<span class="sim-chip ok">No new conflicts</span>'}
    </div>
    <p class="hint" style="margin-top:12px">This is a sandbox diff. No provider has been contacted.</p>
  `;
}

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('zencal.theme', theme);
  $('#btnTheme').innerHTML = `<svg><use href="#${theme === 'dark' ? 'i-moon' : 'i-sun'}"/></svg>`;
}

async function setMode(mode) {
  const calendarModes = ['day', 'week', 'month', 'agenda'];
  if (calendarModes.includes(mode)) {
    state.mode = mode;
    renderViewSwitch();
    await loadView();
    return;
  }
  state.mode = mode;
  renderViewSwitch();
  if (mode === 'ai') {
    state.dailyPlan = await apiGet('/api/ai/plan');
    state.agent = await apiGet('/api/ai/agent');
    state.settings = await apiGet('/api/settings');
    state.boot.permissions = (await apiGet('/api/permissions')).grants;
  }
  if (mode === 'tasks') state.tasks = await apiGet('/api/tasks');
  if (mode === 'sandbox') state.sandbox = await apiGet('/api/sandbox/proposals');
  if (mode === 'accounts') {
    state.boot.accounts = await apiGet('/api/accounts');
    state.boot.calendars = await apiGet('/api/calendars');
  }
  if (mode === 'privacy') state.privacy = await apiGet('/api/privacy');
  if (mode === 'activity') state.activity = await apiGet('/api/activity');
  if (mode === 'settings') state.settings = await apiGet('/api/settings');
  renderStage();
}

function shift(direction) {
  const d = new Date(state.anchor);
  if (state.mode === 'day') d.setDate(d.getDate() + direction);
  else if (state.mode === 'week') d.setDate(d.getDate() + direction * 7);
  else if (state.mode === 'month') d.setMonth(d.getMonth() + direction);
  else d.setDate(d.getDate() + direction * 30);
  state.anchor = d;
  loadView();
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

function wireEvents() {
  $('#btnCreate').addEventListener('click', () => openEventModal({}));
  $('#btnFab').addEventListener('click', () => openEventModal({}));
  $('#btnToday').addEventListener('click', () => {
    state.anchor = new Date();
    loadView();
  });
  $('#btnPrev').addEventListener('click', () => shift(-1));
  $('#btnNext').addEventListener('click', () => shift(1));
  $('#btnTheme').addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  $('#btnModalClose').addEventListener('click', closeModal);
  $('#overlay').addEventListener('click', (e) => {
    if (e.target.id === 'overlay') closeModal();
  });

  for (const b of $$('#viewSwitch button')) b.addEventListener('click', () => setMode(b.dataset.mode));
  for (const b of $$('#primaryNav .nav-item')) b.addEventListener('click', () => setMode(b.dataset.view));
  for (const b of $$('.mnav-item')) {
    b.addEventListener('click', () => {
      if (b.dataset.view === 'more') {
        setMode('accounts');
      } else setMode(b.dataset.view);
    });
  }

  $('#btnSearch').addEventListener('click', toggleSearch);
  $('#btnCloseSearch').addEventListener('click', toggleSearch);
  $('#searchInput').addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (!q) return;
      openSearch(q);
    }
  });

  $('#aiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#aiInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    ask(text);
  });

  $('#btnAISuggest').addEventListener('click', () => {
    const samples = [
      'Find a free hour with John next week',
      "What's my day looking like?",
      'Prepare my schedule for tomorrow',
      'Find all meetings related to Varizen',
      'Give me three hours of uninterrupted work this week',
      'What if I add a 2-hour meeting tomorrow?',
      'Handle my calendar',
      'Move anything non-essential out of my morning'
    ];
    $('#aiInput').value = samples[Math.floor(Math.random() * samples.length)];
    $('#aiInput').focus();
  });

  $('#btnAIPanel').addEventListener('click', () => {
    if (state.railOpen) closeRail();
    else openRail();
  });
  $('#btnRailClose').addEventListener('click', closeRail);

  for (const t of $$('.rail-tab')) {
    t.addEventListener('click', async () => {
      state.railTab = t.dataset.rail;
      for (const x of $$('.rail-tab')) x.classList.toggle('active', x === t);
      openRail();
      await renderRail();
    });
  }

  $('#btnAgent').addEventListener('click', async () => {
    const on = !state.boot.agentMode;
    await apiPatch('/api/settings', { agentMode: on });
    state.boot.agentMode = on;
    state.settings.agentMode = on;
    $('#btnAgent').classList.toggle('on', on);
    if (on) {
      state.railTab = 'agent';
      for (const x of $$('.rail-tab')) x.classList.toggle('active', x.dataset.rail === 'agent');
      openRail();
      state.agent = await apiGet('/api/ai/agent');
      await renderRail();
      toast('Agent mode on — I will prepare changes in the sandbox, never write directly.', 'ok', 4200);
    } else {
      toast('Agent mode off.', 'ok');
    }
  });

  $('#btnSync').addEventListener('click', async () => {
    toast('Syncing all accounts…', 'info', 1200);
    const res = await apiPost('/api/sync', {});
    const total = (res.results || []).reduce((n, r) => n + (r.events || 0), 0);
    state.boot.accounts = await apiGet('/api/accounts');
    await loadView();
    toast(`Sync complete — ${total} event(s).`, 'ok');
  });

  document.addEventListener('keydown', (e) => {
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (e.key === 'Escape') {
      if (!$('#overlay').hidden) closeModal();
      else if (state.searchOpen) toggleSearch();
      return;
    }
    if (typing) return;
    if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      openEventModal({});
    } else if (e.key === '/') {
      e.preventDefault();
      toggleSearch();
    } else if (e.key === 't' || e.key === 'T') {
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
    } else if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      $('#aiInput').focus();
    } else if (e.key === 'ArrowLeft') {
      shift(-1);
    } else if (e.key === 'ArrowRight') {
      shift(1);
    } else if (e.key === 'd') {
      setMode('day');
    } else if (e.key === 'w') {
      setMode('week');
    } else if (e.key === 'm') {
      setMode('month');
    } else if (e.key === 'a') {
      setMode('agenda');
    }
  });

  // auto-refresh agent context every 2 minutes (cheap, read-only)
  setInterval(async () => {
    try {
      state.agent = await apiGet('/api/ai/agent');
      if (state.railTab === 'agent') await renderRail();
      updateBadges();
    } catch {
      /* offline — keep the last good state */
    }
  }, 120000);
}

function toggleSearch() {
  state.searchOpen = !state.searchOpen;
  $('#searchBar').hidden = !state.searchOpen;
  $('#btnSearch').classList.toggle('on', state.searchOpen);
  if (state.searchOpen) $('#searchInput').focus();
  else $('#searchInput').value = '';
}

/* ------------------------------------------------------------------ *
 * Start
 * ------------------------------------------------------------------ */

boot().catch((err) => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px;font-family:system-ui;color:#111">
    <h1 style="font-size:20px;margin-bottom:8px">ZCal could not start</h1>
    <p style="color:#555;font-size:14px">${esc(err.message)}</p>
    <p style="color:#888;font-size:13px;margin-top:12px">Make sure the server is running: <code>npm start</code> in the <code>cal/</code> folder.</p>
  </div>`;
});
