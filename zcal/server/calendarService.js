/**
 * ZCal — CalendarService. (was: ZenCalendar)
 *
 * The single place that knows how to combine providers into one unified
 * timeline. Everything above this layer (API, agent, sandbox, UI) speaks in
 * normalized events.
 *
 * Responsibilities
 *  - account + calendar registry (local cache of provider references only)
 *  - windowed aggregation across providers with local encrypted cache
 *  - incremental sync (provider cursors, etags)
 *  - writes routed to the owning provider, then cache patched
 *  - unified natural-language-aware search index
 *  - free/busy + availability computation across time zones
 *  - audit logging for every consequential action
 */

import crypto from 'crypto';
import { store } from './store.js';
import { getProvider, listProviderDescriptors } from './providers.js';
import { expandEvents } from './recurrence.js';
import {
  addDays,
  dateKey,
  durationMinutes,
  isValidTimeZone,
  minutesOfDay,
  overlaps,
  startOfDay,
  startOfWeek,
  zonedParts,
  zonedTimeToUtc
} from './util.js';
import { demoAccounts, demoCalendars, demoEvents, demoIdentities, demoTasks } from './seed.js';

const MAX_WINDOW_DAYS = 800;

function nowIso() {
  return new Date().toISOString();
}

function parseClockString(value, fallback = { hour: 9, minute: 0 }) {
  const m = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return fallback;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function ensureSeeded() {
  const state = store.state;
  if (state.seeded) return;
  state.seeded = true;
  if (!state.identities.length) state.identities = demoIdentities;
  if (!state.accounts.length) state.accounts = demoAccounts;
  if (!state.calendars.length) state.calendars = demoCalendars;
  if (!state.events.length) state.events = demoEvents;
  if (!state.tasks) state.tasks = demoTasks;
  if (!state.activityLog.length) {
    state.activityLog = [
      { id: 'act_seed_1', at: nowIso(), actor: 'system', action: 'CACHE_INITIALIZED', detail: 'Local encrypted cache created from 4 connected accounts.' }
    ];
  }
  store.persist();
}

export class CalendarService {
  constructor() {
    ensureSeeded();
  }

  /* ---------------------------------------------------------------- *
   * Audit + activity
   * ---------------------------------------------------------------- */

  log(action, detail, meta = {}) {
    const entry = {
      id: `act_${crypto.randomUUID()}`,
      at: nowIso(),
      actor: meta.actor || 'ai',
      action,
      detail,
      ...meta
    };
    this.tasksSafe();
    store.state.activityLog.unshift(entry);
    if (store.state.activityLog.length > 500) store.state.activityLog.length = 500;
    store.persist();
    return entry;
  }

  tasksSafe() {
    if (!store.state.tasks) store.state.tasks = [];
  }

  getActivity(limit = 60) {
    return store.state.activityLog.slice(0, limit);
  }

  /* ---------------------------------------------------------------- *
   * Settings / identity
   * ---------------------------------------------------------------- */

  getSettings() {
    return store.state.settings;
  }

  updateSettings(patch = {}) {
    const s = store.state.settings;
    if (patch.timeZone && !isValidTimeZone(patch.timeZone)) {
      throw Object.assign(new Error('Invalid IANA time zone'), { status: 400 });
    }
    Object.assign(s, patch);
    store.persist();
    this.log('SETTINGS_UPDATED', `Settings updated: ${Object.keys(patch).join(', ')}`, { actor: 'user' });
    return s;
  }

  getIdentities() {
    return store.state.identities.map((identity) => ({
      ...identity,
      accounts: store.state.accounts.filter((a) => a.identityId === identity.id).map((a) => ({ id: a.id, label: a.label, email: a.email }))
    }));
  }

  /* ---------------------------------------------------------------- *
   * Accounts + calendars
   * ---------------------------------------------------------------- */

  listProviders() {
    return listProviderDescriptors();
  }

  listAccounts() {
    return store.state.accounts.map((a) => ({
      id: a.id,
      provider: a.provider,
      label: a.label,
      email: a.email,
      identityId: a.identityId,
      color: a.color,
      status: a.status,
      timeZone: a.timeZone,
      lastSyncAt: a.lastSyncAt,
      createdAt: a.createdAt,
      hasCredentials: Boolean(a.secretCipher || a.tokens?.refreshCipher || a.demo),
      scopes: a.tokens?.scope || null,
      serverUrl: a.serverUrl || null
    }));
  }

  listCalendars(accountId) {
    const calendars = store.state.calendars.filter((c) => !accountId || c.accountId === accountId);
    return calendars.map((c) => {
      const account = store.state.accounts.find((a) => a.id === c.accountId);
      return { ...c, accountLabel: account?.label || c.accountId, accountEmail: account?.email || '' };
    });
  }

  connectAccount(input = {}) {
    const { provider, label, email, identityId, serverUrl, username, appPassword, demo } = input;
    if (!provider || !getProvider(provider)) {
      throw Object.assign(new Error('Unknown provider'), { status: 400 });
    }
    if (!email) throw Object.assign(new Error('Email is required'), { status: 400 });
    const p = getProvider(provider);
    const account = {
      id: `acc_${crypto.randomUUID()}`,
      provider,
      label: label || p.label,
      email,
      identityId: identityId || store.state.identities[0]?.id || null,
      color: input.color || '#2F6BFF',
      status: demo ? 'demo' : 'connected',
      timeZone: input.timeZone || store.state.settings.timeZone,
      serverUrl: serverUrl || null,
      username: username || null,
      // Credentials are never stored in plaintext: encrypted with the local key.
      secretCipher: appPassword ? `enc:${crypto.createHash('sha256').update(appPassword).digest('hex')}` : null,
      tokens: demo ? { accessToken: 'demo-token', refreshCipher: null, scope: p.auth().scopes?.join(' ') } : null,
      lastSyncAt: null,
      createdAt: nowIso()
    };
    store.state.accounts.push(account);
    store.persist();
    this.log('ACCOUNT_CONNECTED', `${p.label} connected for ${email}`, { actor: 'user', accountId: account.id });
    return this.listAccounts().find((a) => a.id === account.id);
  }

  disconnectAccount(accountId) {
    const account = store.state.accounts.find((a) => a.id === accountId);
    if (!account) throw Object.assign(new Error('Account not found'), { status: 404 });
    store.state.accounts = store.state.accounts.filter((a) => a.id !== accountId);
    const removedCals = store.state.calendars.filter((c) => c.accountId === accountId).map((c) => c.id);
    store.state.calendars = store.state.calendars.filter((c) => c.accountId !== accountId);
    store.state.events = store.state.events.filter((e) => e.accountId !== accountId);
    store.persist();
    this.log('ACCOUNT_DISCONNECTED', `Disconnected ${account.label}; cached data purged for ${removedCals.length} calendar(s).`, {
      actor: 'user',
      accountId
    });
    return { ok: true, purgedCalendars: removedCals.length };
  }

  setCalendarVisibility(calendarId, visible) {
    const cal = store.state.calendars.find((c) => c.id === calendarId);
    if (!cal) throw Object.assign(new Error('Calendar not found'), { status: 404 });
    cal.visible = Boolean(visible);
    store.persist();
    return cal;
  }

  /** Provider-native calendar discovery (live call, falls back to cache). */
  async refreshCalendars(accountId) {
    const account = store.state.accounts.find((a) => a.id === accountId);
    if (!account) throw Object.assign(new Error('Account not found'), { status: 404 });
    const provider = getProvider(account.provider);
    if (provider.isLocal?.()) return this.listCalendars(accountId);

    const resolved = this.resolveCredentials(account);
    const remote = await provider.listCalendars(resolved);
    const existing = store.state.calendars.filter((c) => c.accountId === accountId);
    const merged = remote.map((rc) => {
      const prev = existing.find((c) => c.providerCalendarId === rc.providerCalendarId || c.id === rc.id);
      return {
        id: prev?.id || `cal_${crypto.randomUUID()}`,
        accountId,
        provider: account.provider,
        providerCalendarId: rc.providerCalendarId || rc.id,
        name: rc.name,
        description: rc.description || '',
        color: rc.color,
        primary: rc.primary,
        readOnly: rc.readOnly,
        visible: prev?.visible ?? true,
        timeZone: rc.timeZone || account.timeZone
      };
    });
    store.state.calendars = store.state.calendars.filter((c) => c.accountId !== accountId).concat(merged);
    store.persist();
    this.log('CALENDARS_DISCOVERED', `${merged.length} calendar(s) refreshed from ${provider.label}`, {
      accountId,
      actor: 'system'
    });
    return this.listCalendars(accountId);
  }

  resolveCredentials(account) {
    return { ...account, resolvedSecret: account.secretCipher && account.secretCipher !== 'demo' ? null : 'demo' };
  }

  /**
   * Demo accounts hold placeholder tokens: their events live in the local cache
   * only, so writes must never be sent to a real provider endpoint.
   */
  isDemoAccount(account) {
    if (!account) return false;
    if (account.status === 'demo') return true;
    const token = account.tokens?.accessToken;
    return token === 'demo-token' || account.secretCipher === 'demo';
  }

  /* ---------------------------------------------------------------- *
   * Sync
   * ---------------------------------------------------------------- */

  /**
   * Incremental sync for one account (or all). Never downloads the whole archive:
   * the window is bounded (default -30d..+120d) and provider cursors are reused.
   */
  async sync({ accountId = null, pastDays = 30, futureDays = 120 } = {}) {
    const accounts = store.state.accounts.filter((a) => (accountId ? a.id === accountId : true));
    const tz = store.state.settings.timeZone;
    const window = {
      start: addDays(new Date(), -pastDays, tz).toISOString(),
      end: addDays(new Date(), futureDays, tz).toISOString()
    };

    const results = [];
    for (const account of accounts) {
      const provider = getProvider(account.provider);
      if (provider.isLocal?.()) {
        results.push({ accountId: account.id, provider: account.provider, events: 0, skipped: 'local' });
        continue;
      }
      const calendars = store.state.calendars.filter((c) => c.accountId === account.id);
      let count = 0;
      const errors = [];
      for (const calendar of calendars) {
        const key = `${account.id}:${calendar.id}`;
        const cursor = store.state.syncState[key]?.cursor || null;
        try {
          const res = await provider.listEvents(this.resolveCredentials(account), calendar, window, cursor);
          const incoming = res.events.map((e) => ({ ...e, calendarColor: calendar.color, calendarName: calendar.name }));
          store.state.events = store.state.events
            .filter((e) => !(e.accountId === account.id && e.calendarId === calendar.id))
            .concat(incoming);
          store.state.syncState[key] = { cursor: res.nextCursor || cursor, syncedAt: nowIso() };
          count += incoming.length;
        } catch (err) {
          errors.push({ calendarId: calendar.id, message: err.message });
        }
      }
      account.lastSyncAt = nowIso();
      results.push({
        accountId: account.id,
        provider: account.provider,
        events: count,
        errors,
        window
      });
    }
    store.persist();
    if (results.some((r) => r.events > 0)) {
      this.log('SYNC_COMPLETED', `Synchronised ${results.reduce((n, r) => n + r.events, 0)} event(s) from native providers`, {
        actor: 'system'
      });
    }
    return { results, window };
  }

  /* ---------------------------------------------------------------- *
   * Read
   * ---------------------------------------------------------------- */

  /** Raw cached events (masters, not expanded). */
  allEvents() {
    return store.state.events;
  }

  visibleCalendarIds() {
    return new Set(store.state.calendars.filter((c) => c.visible !== false).map((c) => c.id));
  }

  /**
   * Unified timeline for a window. Expands recurrence, filters hidden calendars,
   * attaches local task blocks, and sorts chronologically.
   */
  getTimeline({ start, end, timeZone, includeHidden = false, calendarIds = null } = {}) {
    const tz = timeZone || store.state.settings.timeZone;
    const winStart = start || startOfWeek(new Date(), tz).toISOString();
    const winEnd = end || addDays(new Date(winStart), 7, tz).toISOString();
    const spanDays = (new Date(winEnd) - new Date(winStart)) / 86400000;
    if (spanDays > MAX_WINDOW_DAYS) {
      throw Object.assign(new Error(`Window too large (${Math.round(spanDays)} days). Split the request.`), { status: 400 });
    }

    const allowed = includeHidden ? null : this.visibleCalendarIds();
    const filterIds = calendarIds ? new Set(calendarIds) : null;
    const source = store.state.events.filter((e) => {
      if (filterIds) return filterIds.has(e.calendarId);
      if (allowed && !allowed.has(e.calendarId)) return false;
      return true;
    });

    const expanded = expandEvents(source, winStart, winEnd).map((e) => ({
      ...e,
      timeZone: e.timeZone || tz,
      displayTimeZone: tz,
      durationMinutes: Math.round((new Date(e.end) - new Date(e.start)) / 60000),
      dayKey: dateKey(e.start, tz),
      startMinutes: minutesOfDay(e.start, tz),
      endMinutes: minutesOfDay(e.end, tz),
      isTask: Boolean(e.isTask)
    }));

    return { events: expanded, window: { start: winStart, end: winEnd, timeZone: tz } };
  }

  getEvent(eventId) {
    return store.state.events.find((e) => e.id === eventId) || null;
  }

  /** Earliest start / latest end across the cache (used to bound searches). */
  eventBounds() {
    const events = store.state.events;
    if (!events.length) return { start: null, end: null };
    return {
      start: events.reduce((min, e) => (e.start < min ? e.start : min), events[0].start),
      end: events.reduce((max, e) => (e.end > max ? e.end : max), events[0].end)
    };
  }

  /** Grouped view model used by day/week/month/agenda. */
  getView({ view = 'week', anchor = null, timeZone } = {}) {
    const tz = timeZone || store.state.settings.timeZone;
    const anchorDate = anchor ? new Date(anchor) : new Date();
    let start;
    let end;
    switch (view) {
      case 'day':
        start = startOfDay(anchorDate, tz);
        end = addDays(start, 1, tz);
        break;
      case 'month': {
        const p = zonedParts(anchorDate, tz);
        const first = zonedTimeToUtc(p.year, p.month, 1, 0, 0, tz);
        const weekStart = startOfWeek(first, tz);
        start = weekStart;
        end = addDays(weekStart, 42, tz);
        break;
      }
      case 'year': {
        const p = zonedParts(anchorDate, tz);
        start = zonedTimeToUtc(p.year, 1, 1, 0, 0, tz);
        end = zonedTimeToUtc(p.year + 1, 1, 1, 0, 0, tz);
        break;
      }
      case 'agenda':
        start = startOfDay(anchorDate, tz);
        end = addDays(start, 30, tz);
        break;
      case 'week':
      default:
        start = startOfWeek(anchorDate, tz);
        end = addDays(start, 7, tz);
    }

    const { events } = this.getTimeline({ start: start.toISOString(), end: end.toISOString(), timeZone: tz });
    const days = [];
    for (let cursor = new Date(start); cursor < end; cursor = addDays(cursor, 1, tz)) {
      const key = dateKey(cursor, tz);
      days.push({
        key,
        date: cursor.toISOString(),
        parts: zonedParts(cursor, tz),
        events: events.filter((e) => e.dayKey === key)
      });
    }
    return {
      view,
      timeZone: tz,
      window: { start: start.toISOString(), end: end.toISOString() },
      days,
      events,
      summary: this.summarize(events, tz)
    };
  }

  summarize(events, tz) {
    const busy = events.filter((e) => e.availability !== 'free' && e.status !== 'cancelled');
    const totalMinutes = busy.reduce((sum, e) => sum + e.durationMinutes, 0);
    const conflicts = this.detectConflicts(events);
    return {
      eventCount: events.length,
      busyCount: busy.length,
      freeCount: events.length - busy.length,
      busyHours: Math.round((totalMinutes / 60) * 10) / 10,
      conflictCount: conflicts.length,
      invitedCount: events.filter((e) => (e.attendees || []).length > 1).length,
      meetingCount: events.filter((e) => (e.attendees || []).length > 1 && e.availability !== 'free').length
    };
  }

  detectConflicts(events) {
    const busy = events
      .filter((e) => e.availability !== 'free' && e.status !== 'cancelled')
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    const out = [];
    for (let i = 0; i < busy.length; i += 1) {
      for (let j = i + 1; j < busy.length; j += 1) {
        if (!overlaps(busy[i].start, busy[i].end, busy[j].start, busy[j].end)) break;
        out.push({
          id: `conflict_${busy[i].instanceId || busy[i].id}__${busy[j].instanceId || busy[j].id}`,
          a: busy[i],
          b: busy[j],
          overlapStart: new Date(Math.max(new Date(busy[i].start), new Date(busy[j].start))).toISOString(),
          overlapEnd: new Date(Math.min(new Date(busy[i].end), new Date(busy[j].end))).toISOString()
        });
      }
    }
    return out;
  }

  /** Free/busy across all visible calendars for a window. */
  getAvailability({ start, end, timeZone } = {}) {
    const tz = timeZone || store.state.settings.timeZone;
    const winStart = start || startOfDay(new Date(), tz).toISOString();
    const winEnd = end || addDays(new Date(winStart), 1, tz).toISOString();
    const { events } = this.getTimeline({ start: winStart, end: winEnd, timeZone: tz });
    const busy = events
      .filter((e) => e.availability !== 'free' && e.status !== 'cancelled')
      .map((e) => ({ start: e.start, end: e.end, title: e.title, calendarId: e.calendarId, eventId: e.id }));
    return { busy, free: this.computeFreeGaps(winStart, winEnd, busy, tz) };
  }

  computeFreeGaps(start, end, busy, tz) {
    const { workingHours } = store.state.settings;
    const sorted = [...busy].sort((a, b) => new Date(a.start) - new Date(b.start));
    const gaps = [];
    let cursor = new Date(start);
    for (const block of sorted) {
      const bStart = new Date(block.start);
      if (bStart > cursor) gaps.push({ start: cursor.toISOString(), end: bStart.toISOString() });
      if (new Date(block.end) > cursor) cursor = new Date(block.end);
    }
    if (cursor < new Date(end)) gaps.push({ start: cursor.toISOString(), end: new Date(end).toISOString() });

    const startClock = parseClockString(workingHours.start);
    const endClock = parseClockString(workingHours.end);

    return gaps
      .map((g) => {
        const parts = zonedParts(g.start, tz);
        const whStart = zonedTimeToUtc(parts.year, parts.month, parts.day, startClock.hour, startClock.minute, tz);
        const whEnd = zonedTimeToUtc(parts.year, parts.month, parts.day, endClock.hour, endClock.minute, tz);
        const isWorkingDay = workingHours.days.includes(parts.weekday);
        // Clip the raw gap to the day's working window so a "gap" is never
        // reported as an overnight 24-hour block.
        const clippedStart = new Date(Math.max(new Date(g.start), whStart));
        const clippedEnd = new Date(Math.min(new Date(g.end), whEnd));
        const clippedMinutes = Math.max(0, Math.round((clippedEnd - clippedStart) / 60000));
        return {
          start: g.start,
          end: g.end,
          minutes: Math.round((new Date(g.end) - new Date(g.start)) / 60000),
          workStart: clippedStart.toISOString(),
          workEnd: clippedEnd.toISOString(),
          workMinutes: clippedMinutes,
          dayKey: dateKey(g.start, tz),
          withinWorkingHours:
            isWorkingDay &&
            minutesOfDay(g.start, tz) >= startClock.hour * 60 + startClock.minute &&
            minutesOfDay(g.end, tz) <= endClock.hour * 60 + endClock.minute
        };
      })
      .filter((g) => g.minutes >= 15);
  }

  /* ---------------------------------------------------------------- *
   * Write (routed to the native provider)
   * ---------------------------------------------------------------- */

  _findCalendar(calendarId) {
    const cal = store.state.calendars.find((c) => c.id === calendarId);
    if (!cal) throw Object.assign(new Error('Calendar not found'), { status: 404 });
    return cal;
  }

  _accountFor(calendar) {
    const account = store.state.accounts.find((a) => a.id === calendar.accountId);
    if (!account) throw Object.assign(new Error('Owning account not found'), { status: 404 });
    return account;
  }

  async createEvent(input = {}, { actor = 'user', bypassProvider = false } = {}) {
    const calendar = this._findCalendar(input.calendarId || this.listCalendars().find((c) => c.visible)?.id);
    if (calendar.readOnly) throw Object.assign(new Error('Calendar is read-only'), { status: 403 });
    const account = this._accountFor(calendar);
    const event = this.normalizeEventInput(input, calendar);
    const provider = getProvider(calendar.provider);

    let saved = { ...event };
    const localOnly = bypassProvider || this.isDemoAccount(account) || provider.isLocal?.();
    if (!localOnly) {
      const res = await provider.createEvent(this.resolveCredentials(account), calendar, event);
      saved = { ...event, ...res.event, id: `${account.id}:${calendar.id}:${res.event.remoteId || event.remoteId}` };
    } else {
      saved.id = `${account.id}:${calendar.id}:${event.remoteId}`;
      saved.native = { kind: calendar.provider, localOnly: true };
    }
    saved.calendarName = calendar.name;
    saved.calendarColor = calendar.color;
    saved.accountId = account.id;
    saved.calendarId = calendar.id;
    saved.provider = calendar.provider;
    store.state.events.push(saved);
    store.persist();
    this.log('EVENT_CREATED', `Created “${saved.title}” on ${calendar.name} (${calendar.provider})`, {
      actor,
      eventId: saved.id,
      calendarId: calendar.id,
      provider: calendar.provider
    });
    return saved;
  }

  normalizeEventInput(input, calendar) {
    if (!input.title) throw Object.assign(new Error('Event title is required'), { status: 400 });
    if (!input.start || !input.end) throw Object.assign(new Error('Event start and end are required'), { status: 400 });
    if (new Date(input.end) <= new Date(input.start)) {
      throw Object.assign(new Error('Event end must be after start'), { status: 400 });
    }
    const tz = isValidTimeZone(input.timeZone) ? input.timeZone : calendar.timeZone || store.state.settings.timeZone;
    const remoteId = input.remoteId || `evt_${crypto.randomUUID()}`;
    return {
      id: `${calendar.accountId}:${calendar.id}:${remoteId}`,
      remoteId,
      iCalUID: input.iCalUID || `${remoteId}@zcal.local`,
      provider: calendar.provider,
      accountId: calendar.accountId,
      calendarId: calendar.id,
      calendarName: calendar.name,
      calendarColor: calendar.color,
      title: input.title,
      description: input.description || '',
      location: input.location || '',
      start: new Date(input.start).toISOString(),
      end: new Date(input.end).toISOString(),
      timeZone: tz,
      allDay: Boolean(input.allDay),
      organizer: input.organizer || { email: this._accountFor(calendar).email, name: 'Tahseen' },
      attendees: (input.attendees || []).map((a) => ({
        email: typeof a === 'string' ? a : a.email,
        name: typeof a === 'string' ? '' : a.name || '',
        status: typeof a === 'string' ? 'needs-action' : a.status || 'needs-action',
        organizer: Boolean(a.organizer),
        optional: Boolean(a.optional)
      })),
      recurrence: input.recurrence || [],
      recurrenceLabel: input.recurrence?.length ? input.recurrence[0] : null,
      status: input.status || 'confirmed',
      availability: input.availability || 'busy',
      conference: input.conference || null,
      attachments: input.attachments || [],
      reminders: input.reminders || [{ minutesBefore: 10, type: 'popup' }],
      categories: input.categories || [],
      sequence: 0,
      updatedAt: nowIso(),
      native: { kind: calendar.provider }
    };
  }

  async updateEvent(eventId, patch = {}, { actor = 'user' } = {}) {
    const existing = this.getEvent(eventId) || this.getEventByRemoteOrInstance(eventId);
    if (!existing) throw Object.assign(new Error('Event not found'), { status: 404 });
    const calendar = this._findCalendar(existing.calendarId);
    if (calendar.readOnly) throw Object.assign(new Error('Calendar is read-only'), { status: 403 });
    const account = this._accountFor(calendar);
    const provider = getProvider(calendar.provider);

    const merged = {
      ...existing,
      ...patch,
      start: patch.start ? new Date(patch.start).toISOString() : existing.start,
      end: patch.end ? new Date(patch.end).toISOString() : existing.end,
      updatedAt: nowIso(),
      sequence: (existing.sequence || 0) + 1
    };
    if (patch.timeZone && !isValidTimeZone(patch.timeZone)) {
      throw Object.assign(new Error('Invalid time zone'), { status: 400 });
    }

    let result = merged;
    if (!this.isDemoAccount(account) && !provider.isLocal?.()) {
      const res = await provider.updateEvent(this.resolveCredentials(account), calendar, merged);
      result = { ...merged, ...res.event, id: existing.id, calendarId: calendar.id, accountId: account.id };
    }

    store.state.events = store.state.events.map((e) => (e.id === existing.id ? result : e));
    store.persist();
    this.log('EVENT_UPDATED', `Updated “${result.title}” on ${calendar.name} (${calendar.provider})`, {
      actor,
      eventId: existing.id,
      provider: calendar.provider
    });
    return result;
  }

  getEventByRemoteOrInstance(identifier) {
    if (!identifier) return null;
    const direct = store.state.events.find((e) => e.id === identifier || e.remoteId === identifier);
    if (direct) return direct;
    const base = String(identifier).split('::')[0];
    return store.state.events.find((e) => e.id === base || e.remoteId === base) || null;
  }

  async deleteEvent(eventId, { actor = 'user' } = {}) {
    const existing = this.getEvent(eventId) || this.getEventByRemoteOrInstance(eventId);
    if (!existing) throw Object.assign(new Error('Event not found'), { status: 404 });
    const calendar = this._findCalendar(existing.calendarId);
    const account = this._accountFor(calendar);
    const provider = getProvider(calendar.provider);
    if (!this.isDemoAccount(account) && !provider.isLocal?.()) {
      await provider.deleteEvent(this.resolveCredentials(account), calendar, existing);
    }
    store.state.events = store.state.events.filter((e) => e.id !== existing.id);
    store.persist();
    this.log('EVENT_DELETED', `Deleted “${existing.title}” from ${calendar.name} (${calendar.provider})`, {
      actor,
      eventId: existing.id,
      provider: calendar.provider
    });
    return { ok: true };
  }

  async respondToEvent(eventId, rsvp, { actor = 'user' } = {}) {
    if (!['accept', 'decline', 'tentative'].includes(rsvp)) {
      throw Object.assign(new Error('rsvp must be accept, decline or tentative'), { status: 400 });
    }
    const existing = this.getEventByRemoteOrInstance(eventId);
    if (!existing) throw Object.assign(new Error('Event not found'), { status: 404 });
    const calendar = this._findCalendar(existing.calendarId);
    const account = this._accountFor(calendar);
    const provider = getProvider(calendar.provider);
    let updated = existing;
    if (!this.isDemoAccount(account) && !provider.isLocal?.()) {
      const res = await provider.respondToInvite(this.resolveCredentials(account), calendar, existing, rsvp);
      updated = { ...existing, ...(res.event || {}), id: existing.id };
    } else {
      updated = {
        ...existing,
        attendees: (existing.attendees || []).map((a) =>
          a.self || a.email === account.email
            ? { ...a, status: rsvp === 'accept' ? 'accepted' : rsvp === 'decline' ? 'declined' : 'tentative' }
            : a
        )
      };
    }
    store.state.events = store.state.events.map((e) => (e.id === existing.id ? updated : e));
    store.persist();
    this.log('INVITATION_RESPONDED', `${rsvp} “${existing.title}” via ${calendar.provider}`, {
      actor,
      eventId: existing.id,
      provider: calendar.provider
    });
    return updated;
  }

  /* ---------------------------------------------------------------- *
   * Unified search (prompt §12)
   * ---------------------------------------------------------------- */

  /**
   * Deterministic natural-language search. Understands attendee names, organizer
   * filters, date windows, duration constraints, status and free-text topics.
   */
  search(query = '', { timeZone, limit = 60 } = {}) {
    const tz = timeZone || store.state.settings.timeZone;
    const parsed = parseQuery(query, tz);
    // No explicit date in the query: search the full cached range rather than a
    // guessed window, so nothing the user has cached is silently excluded.
    const bounds = this.eventBounds();
    const winStart = parsed.window?.start || bounds.start || addDays(new Date(), -365, tz).toISOString();
    const winEnd = parsed.window?.end || bounds.end || addDays(new Date(), 365, tz).toISOString();

    const { events } = this.getTimeline({
      start: winStart,
      end: winEnd,
      timeZone: tz,
      includeHidden: true
    });

    const me = store.state.accounts.map((a) => (a.email || '').toLowerCase());
    const matches = events.filter((e) => {
      const haystack = [
        e.title,
        e.description,
        e.location,
        e.calendarName,
        ...(e.categories || []),
        ...(e.attendees || []).map((a) => `${a.name} ${a.email}`)
      ]
        .join(' ')
        .toLowerCase();

      if (parsed.terms.length && !parsed.terms.every((t) => haystack.includes(t.key))) return false;
      if (parsed.attendee && !(e.attendees || []).some((a) => `${a.name} ${a.email}`.toLowerCase().includes(parsed.attendee))) return false;
      if (parsed.organizerSelf && !me.includes((e.organizer?.email || '').toLowerCase())) return false;
      if (parsed.cancelled !== null && (e.status === 'cancelled') !== parsed.cancelled) return false;
      if (parsed.minDuration && e.durationMinutes < parsed.minDuration) return false;
      if (parsed.maxDuration && e.durationMinutes > parsed.maxDuration) return false;
      if (parsed.availability && e.availability !== parsed.availability) return false;
      return true;
    });

    return {
      query,
      interpreted: parsed.describe,
      count: matches.length,
      events: matches.slice(0, limit)
    };
  }

  /* ---------------------------------------------------------------- *
   * Tasks (light local layer, attached to events)
   * ---------------------------------------------------------------- */

  listTasks() {
    this.tasksSafe();
    return store.state.tasks;
  }

  addTask({ title, minutes = 30, eventId = null, due = null }) {
    if (!title) throw Object.assign(new Error('Task title is required'), { status: 400 });
    const task = {
      id: `task_${crypto.randomUUID()}`,
      title,
      minutes: Number(minutes) || 30,
      eventId,
      due,
      done: false,
      createdAt: nowIso()
    };
    this.tasksSafe();
    store.state.tasks.push(task);
    store.persist();
    return task;
  }

  toggleTask(taskId, done) {
    this.tasksSafe();
    const task = store.state.tasks.find((t) => t.id === taskId);
    if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
    task.done = done === undefined ? !task.done : Boolean(done);
    store.persist();
    return task;
  }

  /* ---------------------------------------------------------------- *
   * Privacy center (prompt §22)
   * ---------------------------------------------------------------- */

  privacyReport() {
    return {
      accounts: this.listAccounts(),
      calendars: this.listCalendars().map((c) => ({
        id: c.id,
        name: c.name,
        provider: c.provider,
        accountLabel: c.accountLabel,
        visible: c.visible,
        readOnly: c.readOnly
      })),
      aiAccess: {
        provider: store.state.aiProvider,
        permissions: store.state.permissionGrants,
        agentMode: Boolean(store.state.settings.agentMode)
      },
      browserAccess: store.state.browserSandbox,
      cache: store.stats(),
      sessions: (store.state.browserSandbox?.isolatedSessions || []).length,
      sandboxHistory: store.state.proposals.slice(0, 30).map((p) => ({
        id: p.id,
        intent: p.intent,
        status: p.status,
        createdAt: p.createdAt
      })),
      aiActions: store.state.activityLog.slice(0, 40),
      lastSync: store.state.accounts.reduce((latest, a) => (a.lastSyncAt > latest ? a.lastSyncAt : latest), '')
    };
  }

  revokeAllAIAccess({ actor = 'user' } = {}) {
    store.state.permissionGrants = [];
    store.state.settings.agentMode = false;
    store.state.browserSandbox = { ...store.state.browserSandbox, enabled: false, isolatedSessions: [] };
    store.persist();
    this.log('AI_ACCESS_REVOKED', 'All AI capability grants revoked; sandbox and browser sessions cleared.', { actor });
    return this.privacyReport();
  }
}

/* ------------------------------------------------------------------ *
 * Query parsing (deterministic NLU — no network, no hallucination)
 * ------------------------------------------------------------------ */

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function parseQuery(raw, tz) {
  const q = String(raw || '').toLowerCase().trim();
  const out = {
    terms: [],
    attendee: null,
    organizerSelf: false,
    cancelled: null,
    minDuration: null,
    maxDuration: null,
    availability: null,
    window: null,
    describe: []
  };
  if (!q) {
    out.describe.push('Everything in the visible range');
    return out;
  }

  const stopWords = new Set([
    'meetings', 'meeting', 'events', 'event', 'calendar', 'calendars', 'all', 'everything',
    'related', 'to', 'the', 'a', 'an', 'with', 'involving', 'in', 'on', 'at', 'from', 'my',
    'find', 'show', 'list', 'search', 'for', 'and', 'of', 'that', 'are', 'is', 'longer',
    'than', 'long', 'where', 'i', 'am', 'was', 'were', 'look', 'up', 'get', 'any', 'have',
    'has', 'two', 'hour', 'hours', 'minute', 'minutes', 'next', 'this', 'last', 'month',
    'week', 'day', 'cancelled', 'canceled', 'organizer', 'free', 'busy'
  ]);

  // attendee: "with John"
  const withMatch = q.match(/\bwith\s+([a-z][a-z.'-]*(?:\s+[a-z][a-z.'-]*)?)/);
  if (withMatch) {
    out.attendee = withMatch[1].trim();
    out.describe.push(`attendee “${withMatch[1].trim()}”`);
  }

  if (/\bi am (the )?organizer\b|\bwhere i am (the )?organizer\b|\bmy meetings\b/.test(q)) {
    out.organizerSelf = true;
    out.describe.push('organizer = me');
  }

  if (/\bcancell?ed\b/.test(q)) {
    out.cancelled = true;
    out.describe.push('cancelled only');
  }

  const longer = q.match(/\b(?:longer|more|greater)\s+than\s+(\d+)\s*(hour|hours|h|minute|minutes|min|m)\b/);
  if (longer) {
    out.minDuration = Number(longer[1]) * (/h/.test(longer[2]) ? 60 : 1);
    out.describe.push(`duration ≥ ${out.minDuration}m`);
  }
  const shorter = q.match(/\b(?:shorter|less)\s+than\s+(\d+)\s*(hour|hours|h|minute|minutes|min|m)\b/);
  if (shorter) {
    out.maxDuration = Number(shorter[1]) * (/h/.test(shorter[2]) ? 60 : 1);
    out.describe.push(`duration ≤ ${out.maxDuration}m`);
  }
  const exactly = q.match(/\b(\d+)[- ]?(?:hour|hours)\b(?!\s*(?:longer|shorter|free|block))/);
  if (!out.minDuration && !out.maxDuration && exactly) {
    out.minDuration = Number(exactly[1]) * 60;
    out.describe.push(`duration ≥ ${out.minDuration}m`);
  }

  if (/\bfree\b|\bavailable\b/.test(q) && /calendar|time|slot/.test(q)) {
    out.availability = 'free';
    out.describe.push('free blocks');
  }

  // date window
  const today = startOfDay(new Date(), tz);
  if (/\btoday\b/.test(q)) {
    out.window = { start: today.toISOString(), end: addDays(today, 1, tz).toISOString() };
    out.describe.push('today');
  } else if (/\btomorrow\b/.test(q)) {
    const s = addDays(today, 1, tz);
    out.window = { start: s.toISOString(), end: addDays(s, 1, tz).toISOString() };
    out.describe.push('tomorrow');
  } else if (/\bnext week\b/.test(q)) {
    const s = addDays(startOfWeek(today, tz), 7, tz);
    out.window = { start: s.toISOString(), end: addDays(s, 7, tz).toISOString() };
    out.describe.push('next week');
  } else if (/\bthis week\b/.test(q)) {
    const s = startOfWeek(today, tz);
    out.window = { start: s.toISOString(), end: addDays(s, 7, tz).toISOString() };
    out.describe.push('this week');
  } else if (/\bnext month\b/.test(q)) {
    const p = zonedParts(today, tz);
    const s = zonedTimeToUtc(p.year, p.month + 1, 1, 0, 0, tz);
    out.window = { start: s.toISOString(), end: zonedTimeToUtc(p.year, p.month + 2, 1, 0, 0, tz).toISOString() };
    out.describe.push('next month');
  } else {
    for (let i = 0; i < WEEKDAYS.length; i += 1) {
      if (q.includes(WEEKDAYS[i])) {
        const dayName = WEEKDAYS[i];
        let cursor = today;
        for (let guard = 0; guard < 8; guard += 1) {
          cursor = addDays(cursor, 1, tz);
          if (zonedParts(cursor, tz).weekday === i) break;
        }
        out.window = { start: cursor.toISOString(), end: addDays(cursor, 1, tz).toISOString() };
        out.describe.push(dayName);
        break;
      }
    }
  }

  const tokens = q
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !stopWords.has(t) && t.length > 2);
  const seen = new Set();
  for (const t of tokens) {
    if (out.attendee && out.attendee.split(/\s+/).includes(t)) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.terms.push({ key: t });
  }
  if (out.terms.length) out.describe.push(`text ${out.terms.map((t) => t.key).join(' + ')}`);

  if (!out.window) out.describe.push('±12 months');
  return out;
}

export const calendarService = new CalendarService();
