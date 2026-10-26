/**
 * ZCal — CalendarProvider adapter layer (prompt §25). (was: ZenCalendar)
 *
 * A single interface for every provider so no provider-specific code leaks into
 * the UI, the agent, or the sandbox:
 *
 *   listCalendars(account)                        -> [{ id, name, color, primary, readOnly }]
 *   listEvents(account, calendar, window, cursor)  -> { events, nextCursor, serverTimeZone }
 *   createEvent(account, calendar, event)          -> { event }
 *   updateEvent(account, calendar, event)          -> { event }
 *   deleteEvent(account, calendar, event)          -> { ok }
 *   respondToInvite(account, calendar, event, rsvp)
 *   freeBusy(account, calendar, window)            -> [{ start, end }]
 *
 * NATIVE DATA PRINCIPLE: every write is proxied straight through to the provider
 * that owns the event. The remote event id and provider metadata always travel
 * with the normalized object.
 *
 * Access tokens are short-lived and held in memory only. Refresh tokens are
 * encrypted in the local cache (never provider passwords).
 */

import { parseICS, buildICS, describeRecurrence } from './ical.js';
import { isValidTimeZone } from './util.js';
import crypto from 'crypto';

const GOOGLE_API = 'https://www.googleapis.com/calendar/v3';
const GRAPH_API = 'https://graph.microsoft.com/v1.0';

class ProviderError extends Error {
  constructor(message, { status = 502, provider = 'unknown', retryable = false } = {}) {
    super(message);
    this.name = 'ProviderError';
    this.status = status;
    this.provider = provider;
    this.retryable = retryable;
  }
}

async function jsonFetch(url, options = {}, provider = 'unknown') {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: AbortSignal.timeout(20000)
    });
  } catch (err) {
    throw new ProviderError(`${provider} request failed: ${err.message}`, { provider, retryable: true });
  }
  const text = await res.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }
  if (!res.ok) {
    const detail = body?.error?.message || body?.error_description || body?.raw || res.statusText;
    throw new ProviderError(`${provider} ${res.status}: ${detail}`, {
      status: res.status === 401 ? 401 : 502,
      provider,
      retryable: res.status >= 500 || res.status === 429
    });
  }
  return body;
}

/* ------------------------------------------------------------------ *
 * Google Calendar
 * ------------------------------------------------------------------ */

class GoogleCalendarProvider {
  constructor() {
    this.kind = 'google';
    this.label = 'Google Calendar';
    this.supportsWrite = true;
    this.supportsFreeBusy = true;
    this.icon = 'google';
  }

  auth() {
    return {
      type: 'oauth2',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      pkce: true,
      scopes: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.freebusy'
      ],
      // least-privilege: no drive, no gmail, no contacts
      accessType: 'offline',
      prompt: 'consent'
    };
  }

  _headers(account) {
    if (!account.tokens?.accessToken) {
      throw new ProviderError('Google account is not connected (no access token)', { provider: 'google', status: 401 });
    }
    return { Authorization: `Bearer ${account.tokens.accessToken}` };
  }

  async listCalendars(account) {
    const body = await jsonFetch(`${GOOGLE_API}/users/me/calendarList`, { headers: this._headers(account) }, 'google');
    return (body.items || []).map((c) => ({
      id: c.id,
      name: c.summaryOverride || c.summary || c.id,
      description: c.description || '',
      color: c.backgroundColor || '#4285F4',
      primary: Boolean(c.primary),
      readOnly: c.accessRole === 'reader' || c.accessRole === 'freeBusyReader',
      timeZone: c.timeZone || account.timeZone,
      providerCalendarId: c.id
    }));
  }

  _normalize(apiEvent, calendar) {
    const start = apiEvent.start?.dateTime || apiEvent.start?.date;
    const end = apiEvent.end?.dateTime || apiEvent.end?.date;
    return {
      id: `${calendar.accountId}:${calendar.id}:${apiEvent.id}`,
      remoteId: apiEvent.id,
      provider: 'google',
      accountId: calendar.accountId,
      calendarId: calendar.id,
      calendarName: calendar.name,
      calendarColor: calendar.color,
      title: apiEvent.summary || '(No title)',
      description: apiEvent.description || '',
      location: apiEvent.location || '',
      start,
      end,
      timeZone: apiEvent.start?.timeZone || calendar.timeZone || 'UTC',
      allDay: Boolean(apiEvent.start?.date),
      organizer: apiEvent.organizer
        ? { email: apiEvent.organizer.email, name: apiEvent.organizer.displayName || '', self: apiEvent.organizer.self }
        : null,
      attendees: (apiEvent.attendees || []).map((a) => ({
        email: a.email,
        name: a.displayName || '',
        status: (a.responseStatus || 'needsAction').replace('needsAction', 'needs-action'),
        organizer: Boolean(a.organizer),
        self: Boolean(a.self),
        optional: a.optional || false
      })),
      recurrence: apiEvent.recurrence || [],
      recurrenceLabel: describeRecurrence((apiEvent.recurrence || [])[0]),
      status: apiEvent.status || 'confirmed',
      availability: apiEvent.transparency === 'transparent' ? 'free' : 'busy',
      conference: apiEvent.hangoutLink
        ? { url: apiEvent.hangoutLink, label: 'Google Meet' }
        : apiEvent.conferenceData?.entryPoints?.[0]
          ? { url: apiEvent.conferenceData.entryPoints[0].uri, label: 'Google Meet' }
          : null,
      attachments: (apiEvent.attachments || []).map((a) => ({ url: a.fileUrl, name: a.title })),
      reminders: (apiEvent.reminders?.overrides || []).map((r) => ({ minutesBefore: r.minutes, type: r.method })),
      updatedAt: apiEvent.updated || new Date().toISOString(),
      createdAt: apiEvent.created,
      sequence: apiEvent.sequence || 0,
      iCalUID: apiEvent.iCalUID,
      htmlLink: apiEvent.htmlLink,
      visibility: apiEvent.visibility || 'default',
      privateExtendedProps: apiEvent.extendedProperties?.private || {},
      native: { etag: apiEvent.etag, kind: 'google' }
    };
  }

  async listEvents(account, calendar, window, cursor) {
    const params = new URLSearchParams({
      timeMin: new Date(window.start).toISOString(),
      timeMax: new Date(window.end).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250'
    });
    if (cursor) params.set('syncToken', cursor);
    else params.set('showDeleted', 'false');
    const body = await jsonFetch(
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendar.id)}/events?${params}`,
      { headers: this._headers(account) },
      'google'
    );
    return {
      events: (body.items || []).filter((e) => e.status !== 'cancelled').map((e) => this._normalize(e, calendar)),
      nextCursor: body.nextSyncToken || cursor || null,
      serverTimeZone: account.timeZone
    };
  }

  _toPayload(event) {
    const payload = {
      summary: event.title,
      description: event.description || '',
      location: event.location || '',
      start: event.allDay
        ? { date: event.start.slice(0, 10) }
        : { dateTime: event.start, timeZone: event.timeZone },
      end: event.allDay ? { date: event.end.slice(0, 10) } : { dateTime: event.end, timeZone: event.timeZone },
      attendees: (event.attendees || []).map((a) => ({ email: a.email, displayName: a.name || undefined })),
      transparency: event.availability === 'free' ? 'transparent' : 'opaque'
    };
    if (event.recurrence?.length) payload.recurrence = event.recurrence;
    if (event.reminders?.length) {
      payload.reminders = {
        useDefault: false,
        overrides: event.reminders.map((r) => ({ method: r.type || 'popup', minutes: r.minutesBefore ?? 10 }))
      };
    }
    return payload;
  }

  async createEvent(account, calendar, event) {
    const q = event.attendees?.length ? '?sendUpdates=all' : '?sendUpdates=none';
    const body = await jsonFetch(
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendar.id)}/events${q}`,
      { method: 'POST', headers: this._headers(account), body: JSON.stringify(this._toPayload(event)) },
      'google'
    );
    return { event: this._normalize(body, calendar) };
  }

  async updateEvent(account, calendar, event) {
    const id = event.remoteId;
    const q = event.attendees?.length ? '?sendUpdates=all' : '?sendUpdates=none';
    const body = await jsonFetch(
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendar.id)}/events/${encodeURIComponent(id)}${q}`,
      { method: 'PATCH', headers: this._headers(account), body: JSON.stringify(this._toPayload(event)) },
      'google'
    );
    return { event: this._normalize(body, calendar) };
  }

  async deleteEvent(account, calendar, event) {
    await jsonFetch(
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendar.id)}/events/${encodeURIComponent(event.remoteId)}?sendUpdates=none`,
      { method: 'DELETE', headers: this._headers(account) },
      'google'
    );
    return { ok: true };
  }

  async respondToInvite(account, calendar, event, rsvp) {
    const statusMap = { accept: 'accepted', decline: 'declined', tentative: 'tentative' };
    const attendees = (event.attendees || []).map((a) => ({
      email: a.email,
      responseStatus: a.self ? statusMap[rsvp] || 'needsAction' : a.status
    }));
    const body = await jsonFetch(
      `${GOOGLE_API}/calendars/${encodeURIComponent(calendar.id)}/events/${encodeURIComponent(event.remoteId)}?sendUpdates=all`,
      { method: 'PATCH', headers: this._headers(account), body: JSON.stringify({ attendees }) },
      'google'
    );
    return { event: this._normalize(body, calendar) };
  }

  async freeBusy(account, calendar, window) {
    const body = await jsonFetch(
      `${GOOGLE_API}/freeBusy`,
      {
        method: 'POST',
        headers: this._headers(account),
        body: JSON.stringify({
          timeMin: new Date(window.start).toISOString(),
          timeMax: new Date(window.end).toISOString(),
          items: [{ id: calendar.id }]
        })
      },
      'google'
    );
    return body.calendars?.[calendar.id]?.busy || [];
  }
}

/* ------------------------------------------------------------------ *
 * Microsoft Graph (Outlook / Microsoft 365)
 * ------------------------------------------------------------------ */

class MicrosoftGraphProvider {
  constructor() {
    this.kind = 'microsoft';
    this.label = 'Microsoft 365';
    this.supportsWrite = true;
    this.supportsFreeBusy = true;
    this.icon = 'microsoft';
  }

  auth() {
    return {
      type: 'oauth2',
      authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      pkce: true,
      scopes: ['offline_access', 'Calendars.ReadWrite', 'Calendars.Read.Shared'],
      accessType: 'offline'
    };
  }

  _headers(account) {
    if (!account.tokens?.accessToken) {
      throw new ProviderError('Microsoft account is not connected (no access token)', { provider: 'microsoft', status: 401 });
    }
    return { Authorization: `Bearer ${account.tokens.accessToken}`, Prefer: 'outlook.timezone="UTC"' };
  }

  async listCalendars(account) {
    const body = await jsonFetch(`${GRAPH_API}/me/calendars?$top=100`, { headers: this._headers(account) }, 'microsoft');
    return (body.value || []).map((c) => ({
      id: c.id,
      name: c.name,
      color: c.hexColor || '#0F6CBD',
      primary: Boolean(c.isDefaultCalendar),
      readOnly: !c.canEdit,
      timeZone: account.timeZone,
      providerCalendarId: c.id
    }));
  }

  _normalize(apiEvent, calendar) {
    return {
      id: `${calendar.accountId}:${calendar.id}:${apiEvent.id}`,
      remoteId: apiEvent.id,
      provider: 'microsoft',
      accountId: calendar.accountId,
      calendarId: calendar.id,
      calendarName: calendar.name,
      calendarColor: calendar.color,
      title: apiEvent.subject || '(No title)',
      description: stripHtml(apiEvent.body?.content || ''),
      location: apiEvent.location?.displayName || '',
      start: apiEvent.start?.dateTime + 'Z',
      end: apiEvent.end?.dateTime + 'Z',
      timeZone: apiEvent.start?.timeZone || 'UTC',
      allDay: Boolean(apiEvent.isAllDay),
      organizer: apiEvent.organizer?.emailAddress
        ? { email: apiEvent.organizer.emailAddress.address, name: apiEvent.organizer.emailAddress.name || '' }
        : null,
      attendees: (apiEvent.attendees || []).map((a) => ({
        email: a.emailAddress?.address,
        name: a.emailAddress?.name || '',
        status: mapGraphStatus(a.status?.response),
        type: a.type
      })),
      recurrence: apiEvent.recurrence ? [graphRecurrenceToRRule(apiEvent.recurrence)] : [],
      recurrenceLabel: apiEvent.recurrence ? describeRecurrence(graphRecurrenceToRRule(apiEvent.recurrence)) : null,
      status: apiEvent.isCancelled ? 'cancelled' : 'confirmed',
      availability: apiEvent.showAs === 'free' ? 'free' : 'busy',
      conference: apiEvent.onlineMeetingUrl ? { url: apiEvent.onlineMeetingUrl, label: 'Teams' } : null,
      attachments: [],
      reminders: apiEvent.isReminderOn ? [{ minutesBefore: apiEvent.reminderMinutesBeforeStart ?? 15, type: 'popup' }] : [],
      updatedAt: apiEvent.lastModifiedDateTime || new Date().toISOString(),
      createdAt: apiEvent.createdDateTime,
      sequence: 0,
      iCalUID: apiEvent.iCalUId,
      htmlLink: apiEvent.webLink,
      sensitivity: apiEvent.sensitivity,
      responseStatus: mapGraphStatus(apiEvent.responseStatus?.response),
      native: { etag: apiEvent['@odata.etag'], kind: 'microsoft' }
    };
  }

  async listEvents(account, calendar, window, cursor) {
    const url = cursor
      ? cursor
      : `${GRAPH_API}/me/calendars/${calendar.id}/calendarView?startDateTime=${encodeURIComponent(
          new Date(window.start).toISOString()
        )}&endDateTime=${encodeURIComponent(new Date(window.end).toISOString())}&$top=200&$orderby=start/dateTime`;
    const body = await jsonFetch(url, { headers: this._headers(account) }, 'microsoft');
    return {
      events: (body.value || []).filter((e) => !e.isCancelled).map((e) => this._normalize(e, calendar)),
      nextCursor: body['@odata.nextLink'] || null,
      serverTimeZone: account.timeZone
    };
  }

  _toPayload(event) {
    const payload = {
      subject: event.title,
      body: { contentType: 'text', content: event.description || '' },
      start: { dateTime: new Date(event.start).toISOString().replace('Z', ''), timeZone: 'UTC' },
      end: { dateTime: new Date(event.end).toISOString().replace('Z', ''), timeZone: 'UTC' },
      location: { displayName: event.location || '' },
      attendees: (event.attendees || []).map((a) => ({
        emailAddress: { address: a.email, name: a.name || a.email },
        type: a.optional ? 'optional' : 'required'
      })),
      isAllDay: Boolean(event.allDay),
      showAs: event.availability === 'free' ? 'free' : 'busy'
    };
    if (event.reminders?.length) {
      payload.isReminderOn = true;
      payload.reminderMinutesBeforeStart = event.reminders[0].minutesBefore ?? 15;
    }
    return payload;
  }

  async createEvent(account, calendar, event) {
    const body = await jsonFetch(
      `${GRAPH_API}/me/calendars/${calendar.id}/events`,
      { method: 'POST', headers: this._headers(account), body: JSON.stringify(this._toPayload(event)) },
      'microsoft'
    );
    return { event: this._normalize(body, calendar) };
  }

  async updateEvent(account, calendar, event) {
    const body = await jsonFetch(
      `${GRAPH_API}/me/events/${encodeURIComponent(event.remoteId)}`,
      { method: 'PATCH', headers: this._headers(account), body: JSON.stringify(this._toPayload(event)) },
      'microsoft'
    );
    return { event: this._normalize(body, calendar) };
  }

  async deleteEvent(account, calendar, event) {
    await jsonFetch(
      `${GRAPH_API}/me/events/${encodeURIComponent(event.remoteId)}`,
      { method: 'DELETE', headers: this._headers(account) },
      'microsoft'
    );
    return { ok: true };
  }

  async respondToInvite(account, calendar, event, rsvp) {
    const action = { accept: 'accept', decline: 'decline', tentative: 'tentativelyAccept' }[rsvp] || 'accept';
    await jsonFetch(
      `${GRAPH_API}/me/events/${encodeURIComponent(event.remoteId)}/${action}`,
      {
        method: 'POST',
        headers: this._headers(account),
        body: JSON.stringify({ sendResponse: true, comment: '' })
      },
      'microsoft'
    );
    return { ok: true };
  }

  async freeBusy(account, calendar, window) {
    const body = await jsonFetch(
      `${GRAPH_API}/me/calendar/getSchedule`,
      {
        method: 'POST',
        headers: this._headers(account),
        body: JSON.stringify({
          schedules: [account.email],
          startTime: { dateTime: new Date(window.start).toISOString().replace('Z', ''), timeZone: 'UTC' },
          endTime: { dateTime: new Date(window.end).toISOString().replace('Z', ''), timeZone: 'UTC' }
        })
      },
      'microsoft'
    );
    return (body.value?.[0]?.scheduleItems || []).map((s) => ({ start: s.start.dateTime + 'Z', end: s.end.dateTime + 'Z' }));
  }
}

function mapGraphStatus(status = '') {
  const s = String(status).toLowerCase();
  if (s === 'accepted') return 'accepted';
  if (s === 'declined') return 'declined';
  if (s === 'tentativelyaccepted') return 'tentative';
  if (s === 'organizer') return 'accepted';
  return 'needs-action';
}

function graphRecurrenceToRRule(rec) {
  const freq = { daily: 'DAILY', weekly: 'WEEKLY', absoluteMonthly: 'MONTHLY', relativeMonthly: 'MONTHLY', absoluteYearly: 'YEARLY', relativeYearly: 'YEARLY' }[rec.pattern?.type] || 'WEEKLY';
  const parts = [`FREQ=${freq}`, `INTERVAL=${rec.pattern?.interval || 1}`];
  const days = (rec.pattern?.daysOfWeek || []).map((d) => d.slice(0, 2).toUpperCase());
  if (days.length) parts.push(`BYDAY=${days.join(',')}`);
  if (rec.pattern?.dayOfMonth) parts.push(`BYMONTHDAY=${rec.pattern.dayOfMonth}`);
  if (rec.range?.type === 'numbered') parts.push(`COUNT=${rec.range.numberOfOccurrences}`);
  if (rec.range?.type === 'endDate') parts.push(`UNTIL=${String(rec.range.endDate).replace(/-/g, '')}T000000Z`);
  return `RRULE:${parts.join(';')}`;
}

function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/* ------------------------------------------------------------------ *
 * CalDAV (Apple iCloud, Generic CalDAV, Exchange on-prem)
 * ------------------------------------------------------------------ */

const DAV_BODY_PROPFIND_HOME = `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" xmlns:cs="http://calendarserver.org/ns/">
  <d:prop>
    <d:displayname/>
    <d:resourcetype/>
    <c:calendar-description/>
    <cs:calendar-color/>
    <d:current-user-privilege-set/>
  </d:prop>
</d:propfind>`;

function calendarQueryBody(timeMin, timeMax) {
  return `<?xml version="1.0" encoding="utf-8"?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <d:getetag/>
    <c:calendar-data/>
  </d:prop>
  <c:filter>
    <c:comp-filter name="VCALENDAR">
      <c:comp-filter name="VEVENT">
        <c:time-range start="${timeMin.replace(/[-:]/g, '').slice(0, 15)}Z" end="${timeMax.replace(/[-:]/g, '').slice(0, 15)}Z"/>
      </c:comp-filter>
    </c:comp-filter>
  </c:filter>
</c:calendar-query>`;
}

function basicAuth(account) {
  if (!account.username || !account.secretCipher) {
    throw new ProviderError('CalDAV account is missing credentials', { provider: 'caldav', status: 401 });
  }
  // secretCipher is resolved by the caller into account.resolvedSecret (in memory only)
  const secret = account.resolvedSecret;
  if (!secret) throw new ProviderError('CalDAV credential unavailable', { provider: 'caldav', status: 401 });
  return `Basic ${Buffer.from(`${account.username}:${secret}`).toString('base64')}`;
}

class CalDAVProvider {
  constructor(kind = 'caldav') {
    this.kind = kind;
    this.label = kind === 'apple' ? 'iCloud Calendar' : kind === 'exchange' ? 'Exchange (EWS/CalDAV)' : 'CalDAV';
    this.supportsWrite = true;
    this.supportsFreeBusy = true;
    this.icon = kind;
  }

  auth() {
    return {
      type: 'basic-or-app-password',
      note: 'Apple requires an app-specific password. Credentials are encrypted locally and never sent anywhere except the CalDAV server.',
      requires: ['serverUrl', 'username', 'appPassword']
    };
  }

  async _dav(account, method, url, body, depth = '0', extraHeaders = {}) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: {
          Authorization: basicAuth(account),
          'Content-Type': 'application/xml; charset=utf-8',
          Depth: depth,
          ...extraHeaders
        },
        body,
        signal: AbortSignal.timeout(20000)
      });
    } catch (err) {
      throw new ProviderError(`${this.label} unreachable: ${err.message}`, { provider: this.kind, retryable: true });
    }
    const text = await res.text();
    if (res.status === 401) throw new ProviderError(`${this.label}: invalid credentials`, { provider: this.kind, status: 401 });
    if (!res.ok && res.status !== 207) {
      throw new ProviderError(`${this.label} ${res.status}: ${text.slice(0, 200)}`, { provider: this.kind });
    }
    return { status: res.status, text };
  }

  async listCalendars(account) {
    const base = account.serverUrl.replace(/\/$/, '');
    const home = account.calendarHome || base;
    const { text } = await this._dav(account, 'PROPFIND', home, DAV_BODY_PROPFIND_HOME, '1');
    const responses = text.split(/<(?:\w+:)?response[\s>]/i).slice(1);
    const calendars = [];
    for (const chunk of responses) {
      if (!/<calendar\s*\/?>/i.test(chunk) && !/urn:ietf:params:xml:ns:caldav/.test(chunk)) continue;
      if (!/<calendar[\s/>]/i.test(chunk)) continue;
      const href = (chunk.match(/<(?:\w+:)?href>([^<]+)</i) || [])[1];
      if (!href) continue;
      const name = (chunk.match(/<(?:\w+:)?displayname>([^<]*)</i) || [])[1] || href;
      const color = (chunk.match(/<(?:\w+:)?calendar-color[^>]*>([^<]*)</i) || [])[1] || '#5B8DEF';
      const desc = (chunk.match(/<(?:\w+:)?calendar-description[^>]*>([^<]*)</i) || [])[1] || '';
      const readOnly = /<(?:\w+:)?privilege>\s*<(?:[^:]+:)?write/i.test(chunk) ? false : /read/i.test(chunk) && !/write/i.test(chunk);
      calendars.push({
        id: href,
        name,
        description: desc,
        color: color.slice(0, 7),
        primary: calendars.length === 0,
        readOnly,
        timeZone: account.timeZone,
        providerCalendarId: href
      });
    }
    return calendars;
  }

  async listEvents(account, calendar, window) {
    const base = account.serverUrl.replace(/\/$/, '');
    const url = calendar.id.startsWith('http') ? calendar.id : `${base}${calendar.id}`;
    const { text } = await this._dav(
      account,
      'REPORT',
      url,
      calendarQueryBody(new Date(window.start).toISOString(), new Date(window.end).toISOString()),
      '1'
    );
    const events = [];
    const blocks = text.split(/<(?:\w+:)?calendar-data[^>]*>/i).slice(1);
    for (const block of blocks) {
      const ics = decodeXml((block.split(/<\/(?:\w+:)?calendar-data>/i)[0] || '')).trim();
      if (!ics.includes('BEGIN:VEVENT')) continue;
      const parsed = parseICS(ics);
      for (const ev of parsed.events) {
        events.push({
          ...ev,
          id: `${calendar.accountId}:${calendar.id}:${ev.remoteId}`,
          provider: this.kind,
          accountId: calendar.accountId,
          calendarId: calendar.id,
          calendarName: calendar.name,
          calendarColor: calendar.color,
          timeZone: ev.timeZone || account.timeZone,
          recurrenceLabel: describeRecurrence((ev.recurrence || [])[0]),
          conference: ev.conference,
          native: { href: url, kind: this.kind }
        });
      }
    }
    return { events, nextCursor: null, serverTimeZone: account.timeZone };
  }

  async createEvent(account, calendar, event) {
    const base = account.serverUrl.replace(/\/$/, '');
    const href = `${calendar.id.replace(/\/$/, '')}/${event.iCalUID || crypto.randomUUID()}.ics`;
    const url = href.startsWith('http') ? href : `${base}${href}`;
    const ics = buildICS({ ...event, iCalUID: event.iCalUID || href.split('/').pop().replace('.ics', '') }, { method: 'REQUEST' });
    await this._dav(account, 'PUT', url, ics, '0', { 'Content-Type': 'text/calendar; charset=utf-8' });
    return {
      event: { ...event, id: `${calendar.accountId}:${calendar.id}:${href}`, remoteId: href, native: { href: url, kind: this.kind } }
    };
  }

  async updateEvent(account, calendar, event) {
    const base = account.serverUrl.replace(/\/$/, '');
    const href = event.remoteId.startsWith('http') ? event.remoteId : event.native?.href || `${base}${event.remoteId}`;
    const url = href.startsWith('http') ? href : `${base}${href}`;
    const ics = buildICS({ ...event, iCalUID: event.iCalUID || event.remoteId }, { method: 'REQUEST' });
    await this._dav(account, 'PUT', url, ics, '0', {
      'Content-Type': 'text/calendar; charset=utf-8',
      'If-Match': event.native?.etag || '*'
    });
    return { event };
  }

  async deleteEvent(account, calendar, event) {
    const base = account.serverUrl.replace(/\/$/, '');
    const href = event.native?.href || event.remoteId;
    const url = href.startsWith('http') ? href : `${base}${href}`;
    await this._dav(account, 'DELETE', url, null, '0');
    return { ok: true };
  }

  async respondToInvite(account, calendar, event, rsvp) {
    const status = { accept: 'ACCEPTED', decline: 'DECLINED', tentative: 'TENTATIVE' }[rsvp] || 'NEEDS-ACTION';
    const attendees = (event.attendees || []).map((a) =>
      a.self ? { ...a, status: status.toLowerCase() } : a
    );
    return this.updateEvent(account, calendar, { ...event, attendees });
  }

  async freeBusy(account, calendar, window) {
    const { events } = await this.listEvents(account, calendar, window);
    return events
      .filter((e) => e.availability !== 'free' && e.status !== 'cancelled')
      .map((e) => ({ start: e.start, end: e.end }));
  }
}

function decodeXml(value = '') {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&');
}

/* ------------------------------------------------------------------ *
 * Local calendar (ZCal-native + demo sandbox data)
 * ------------------------------------------------------------------ */

class LocalCalendarProvider {
  constructor() {
    this.kind = 'local';
    this.label = 'ZCal Local';
    this.supportsWrite = true;
    this.supportsFreeBusy = true;
    this.icon = 'local';
  }

  auth() {
    return { type: 'none', note: 'Local calendar. Data is stored in the encrypted local cache only.' };
  }

  /** Local provider reads/writes through the aggregate service. */
  isLocal() {
    return true;
  }
}

/* ------------------------------------------------------------------ *
 * Registry
 * ------------------------------------------------------------------ */

const providers = new Map();
providers.set('google', new GoogleCalendarProvider());
providers.set('microsoft', new MicrosoftGraphProvider());
providers.set('apple', new CalDAVProvider('apple'));
providers.set('caldav', new CalDAVProvider('caldav'));
providers.set('exchange', new CalDAVProvider('exchange'));
providers.set('local', new LocalCalendarProvider());

export function getProvider(kind) {
  const p = providers.get(kind);
  if (!p) throw new ProviderError(`Unsupported provider "${kind}"`, { status: 400, provider: kind });
  return p;
}

export function listProviderDescriptors() {
  return [...providers.values()].map((p) => ({
    kind: p.kind,
    label: p.label,
    icon: p.icon,
    supportsWrite: p.supportsWrite,
    supportsFreeBusy: p.supportsFreeBusy,
    auth: p.auth()
  }));
}

/** Browser sandbox targets for providers without APIs (prompt §15). */
export const browserSandboxTargets = [
  {
    id: 'doodle',
    label: 'Doodle Poll',
    url: 'https://doodle.com',
    reason: 'No public scheduling API for creating polls',
    capabilities: ['read availability', 'create proposal']
  },
  {
    id: 'calendly',
    label: 'Calendly (organizer side)',
    url: 'https://calendly.com',
    reason: 'Some workspaces have no API-plan access',
    capabilities: ['read availability']
  },
  {
    id: 'custom-portal',
    label: 'Internal scheduling portal',
    url: 'about:blank',
    reason: 'Legacy intranet booking forms',
    capabilities: ['read availability', 'create proposal']
  }
];

export { ProviderError, isValidTimeZone };
