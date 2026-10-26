/**
 * ZCal — minimal, dependency-free iCalendar (RFC 5545) reader/writer.
 * (was: ZenCalendar)
 *
 * Used for:
 *  - CalDAV / Apple / Exchange transport (events live natively on those servers)
 *  - invitation payloads (.ics attachments) produced by the scheduling agent
 *  - import / export of local sandbox proposals
 *
 * Only the subset ZCal actually round-trips is supported, but parsing is
 * tolerant: unknown properties are preserved in `props` so nothing is lost.
 */

const FOLD_LIMIT = 75;

function unfold(raw) {
  return String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ \t]/g, '');
}

function fold(line) {
  const chunks = [];
  let rest = line;
  while (rest.length > FOLD_LIMIT) {
    chunks.push(rest.slice(0, FOLD_LIMIT));
    rest = rest.slice(FOLD_LIMIT);
  }
  chunks.push(rest);
  return chunks.join('\r\n ');
}

function unescapeText(value = '') {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function escapeText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function parseParams(raw) {
  const params = {};
  let rest = raw;
  let i = 0;
  while (i < rest.length) {
    const eq = rest.indexOf('=', i);
    if (eq === -1) break;
    const name = rest.slice(i, eq).toUpperCase();
    let j = eq + 1;
    let value = '';
    if (rest[j] === '"') {
      const close = rest.indexOf('"', j + 1);
      value = rest.slice(j + 1, close === -1 ? rest.length : close);
      j = close === -1 ? rest.length : close + 1;
    } else {
      const semi = rest.indexOf(';', j);
      value = rest.slice(j, semi === -1 ? rest.length : semi);
      j = semi === -1 ? rest.length : semi;
    }
    params[name] = value;
    if (rest[j] === ';') j += 1;
    i = j;
  }
  return params;
}

function splitLine(line) {
  let inQuote = false;
  let colon = -1;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ':' && !inQuote) {
      colon = i;
      break;
    }
  }
  if (colon === -1) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  let name = head;
  let params = {};
  const semi = head.indexOf(';');
  if (semi !== -1) {
    name = head.slice(0, semi);
    params = parseParams(head.slice(semi + 1));
  }
  return { name: name.toUpperCase(), params, value };
}

export function parseDate(value, params = {}) {
  const v = value.trim();
  if (/^\d{8}$/.test(v)) {
    // All-day: floating date, interpreted in the event's time zone by callers.
    return {
      iso: `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T00:00:00.000Z`,
      dateOnly: true,
      utc: false
    };
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}${z ? 'Z' : ''}`;
  return { iso, dateOnly: false, utc: Boolean(z), offset: params.TZID };
}

export function formatDate(iso, { utc = true, dateOnly = false } = {}) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  if (dateOnly) {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
  }
  const base = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
  return utc ? `${base}Z` : base;
}

function parseDuration(value = '') {
  const m = value.match(/^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return 0;
  const [, , w, d, h, mi] = m;
  return Number(w || 0) * 10080 + Number(d || 0) * 1440 + Number(h || 0) * 60 + Number(mi || 0);
}

/** Expand a RECUR value into a human-ish summary (used for UI + agent context). */
export function describeRecurrence(rrule) {
  if (!rrule) return null;
  const parts = Object.fromEntries(
    rrule
      .replace(/^RRULE:/i, '')
      .split(';')
      .map((kv) => {
        const [k, v] = kv.split('=');
        return [k.toUpperCase(), v];
      })
  );
  const freq = (parts.FREQ || '').toLowerCase();
  const interval = Number(parts.INTERVAL || 1);
  const map = {
    daily: interval === 1 ? 'Every day' : `Every ${interval} days`,
    weekly: interval === 1 ? 'Every week' : `Every ${interval} weeks`,
    monthly: interval === 1 ? 'Every month' : `Every ${interval} months`,
    yearly: 'Every year'
  };
  let label = map[freq] || 'Recurring';
  if (parts.COUNT) label += ` · ${parts.COUNT} times`;
  if (parts.UNTIL) label += ` · until ${parts.UNTIL.slice(0, 8)}`;
  return label;
}

/**
 * Parse an ICS payload into events in ZCal's normalized shape.
 * @returns {{ events: Array<object>, calendarName?: string, timeZone?: string }}
 */
export function parseICS(raw) {
  const text = unfold(raw);
  const lines = text.split('\n').filter((l) => l.trim().length);
  const events = [];
  let current = null;
  let inAlarm = false;
  let calendarName = null;
  let timeZone = null;

  for (const line of lines) {
    const parsed = splitLine(line);
    if (!parsed) continue;
    const { name, params, value } = parsed;

    if (name === 'BEGIN' && value.toUpperCase() === 'VEVENT') {
      current = { props: {}, attendees: [], alarms: [], categories: [], attachments: [] };
      continue;
    }
    if (name === 'END' && value.toUpperCase() === 'VEVENT') {
      if (current) events.push(finalizeEvent(current));
      current = null;
      inAlarm = false;
      continue;
    }
    // VALARM is nested inside VEVENT: its properties must not leak into the event.
    if (name === 'BEGIN' && value.toUpperCase() === 'VALARM') {
      inAlarm = true;
      continue;
    }
    if (name === 'END' && value.toUpperCase() === 'VALARM') {
      inAlarm = false;
      continue;
    }
    if (inAlarm) {
      if (name === 'TRIGGER' && /^[+-]?P/i.test(value)) {
        current?.alarms.push({ type: 'relative', minutesBefore: Math.abs(parseDuration(value)) });
      }
      continue;
    }

    if (name === 'X-WR-CALNAME') calendarName = unescapeText(value);
    if (name === 'X-WR-TIMEZONE') timeZone = value;
    if (!current) continue;

    switch (name) {
      case 'UID':
        current.uid = value;
        break;
      case 'SUMMARY':
        current.title = unescapeText(value);
        break;
      case 'DESCRIPTION':
        current.description = unescapeText(value);
        break;
      case 'LOCATION':
        current.location = unescapeText(value);
        break;
      case 'ORGANIZER':
        current.organizer = {
          email: (value.match(/mailto:([^:;]+)/i) || [])[1] || value,
          name: params.CN || ''
        };
        break;
      case 'ATTENDEE':
        current.attendees.push({
          email: (value.match(/mailto:([^:;]+)/i) || [])[1] || value,
          name: params.CN || '',
          role: (params.ROLE || 'REQ-PARTICIPANT').toLowerCase(),
          status: (params.PARTSTAT || 'NEEDS-ACTION').toLowerCase().replace('needs-action', 'needs-action'),
          rsvp: params.RSVP !== 'FALSE'
        });
        break;
      case 'DTSTART': {
        const d = parseDate(value, params);
        if (d) {
          current.start = d.iso;
          current.startDateOnly = d.dateOnly;
          if (params.TZID) current.timeZone = params.TZID.replace(/^"|"$/g, '');
        }
        break;
      }
      case 'DTEND': {
        const d = parseDate(value, params);
        if (d) current.end = d.iso;
        break;
      }
      case 'DURATION':
        current.durationMinutes = parseDuration(value);
        break;
      case 'RRULE':
        current.rrule = `RRULE:${value}`;
        break;
      case 'EXDATE':
        current.exdates = (current.exdates || []).concat(
          value.split(',').map((v) => parseDate(v)?.iso).filter(Boolean)
        );
        break;
      case 'STATUS':
        current.status = value.toLowerCase();
        break;
      case 'TRANSP':
        current.availability = value.toUpperCase() === 'TRANSPARENT' ? 'free' : 'busy';
        break;
      case 'SEQUENCE':
        current.sequence = Number(value);
        break;
      case 'LAST-MODIFIED':
        current.updatedAt = parseDate(value)?.iso;
        break;
      case 'CATEGORIES':
        current.categories.push(...value.split(',').map((c) => unescapeText(c.trim())));
        break;
      case 'URL':
        current.url = value;
        break;
      case 'CONFERENCE':
        current.conference = { url: value, label: params.LABEL || '', feature: params.FEATURE || '' };
        break;
      case 'ATTACH':
        current.attachments.push({ url: value, name: params.FILENAME || params.FMTTYPE || 'attachment' });
        break;
      case 'RECURRENCE-ID':
        current.recurrenceId = parseDate(value)?.iso;
        break;
      default:
        current.props[name] = value;
    }
  }

  return { events, calendarName, timeZone };
}

function finalizeEvent(current) {
  const start = current.start || new Date().toISOString();
  const end =
    current.end ||
    new Date(new Date(start).getTime() + (current.durationMinutes || 60) * 60000).toISOString();

  return {
    remoteId: current.uid || `ics_${Math.random().toString(36).slice(2)}`,
    iCalUID: current.uid,
    title: current.title || '(No title)',
    description: current.description || '',
    location: current.location || '',
    start,
    end,
    timeZone: current.timeZone || null,
    allDay: Boolean(current.startDateOnly),
    organizer: current.organizer || null,
    attendees: current.attendees,
    recurrence: current.rrule ? [current.rrule] : [],
    exdates: current.exdates || [],
    status: current.status || 'confirmed',
    availability: current.availability || 'busy',
    categories: current.categories,
    conference: current.conference || null,
    attachments: current.attachments,
    reminders: current.alarms,
    sequence: current.sequence || 0,
    updatedAt: current.updatedAt || new Date().toISOString(),
    recurrenceId: current.recurrenceId || null,
    nativeProps: current.props
  };
}

/**
 * Serialize a normalized event to a complete ICS document.
 */
export function buildICS(event, { method = 'PUBLISH', productId = '-//ZCal//ZCal 1.0//EN' } = {}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${productId}`,
    'CALSCALE:GREGORIAN'
  ];
  if (method) lines.push(`METHOD:${method}`);
  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${event.iCalUID || event.remoteId || event.id}`);
  lines.push(`DTSTAMP:${formatDate(new Date().toISOString())}`);
  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatDate(event.start, { dateOnly: true })}`);
    lines.push(`DTEND;VALUE=DATE:${formatDate(event.end, { dateOnly: true })}`);
  } else {
    const tz = event.timeZone && event.timeZone !== 'UTC' ? `;TZID=${event.timeZone}` : '';
    lines.push(`DTSTART${tz}:${formatDate(event.start, { utc: !tz })}`);
    lines.push(`DTEND${tz}:${formatDate(event.end, { utc: !tz })}`);
  }
  lines.push(`SUMMARY:${escapeText(event.title || '(No title)')}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.organizer?.email) {
    lines.push(
      `ORGANIZER;CN=${escapeText(event.organizer.name || event.organizer.email)}:mailto:${event.organizer.email}`
    );
  }
  for (const a of event.attendees || []) {
    lines.push(
      `ATTENDEE;CN=${escapeText(a.name || a.email)};ROLE=${(a.role || 'req-participant').toUpperCase()};PARTSTAT=${(
        a.status || 'needs-action'
      )
        .toUpperCase()
        .replace('NEEDS-ACTION', 'NEEDS-ACTION')};RSVP=${a.rsvp === false ? 'FALSE' : 'TRUE'}:mailto:${a.email}`
    );
  }
  for (const r of event.recurrence || []) lines.push(r.startsWith('RRULE') ? r : `RRULE:${r}`);
  if (event.status && event.status !== 'confirmed') lines.push(`STATUS:${event.status.toUpperCase()}`);
  if (event.availability === 'free') lines.push('TRANSP:TRANSPARENT');
  if (event.conference?.url) lines.push(`CONFERENCE;VALUE=URI;LABEL=${escapeText(event.conference.label || 'Meet')}:${event.conference.url}`);
  for (const cat of event.categories || []) lines.push(`CATEGORIES:${escapeText(cat)}`);
  for (const reminder of event.reminders || []) {
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapeText(event.title || 'Reminder')}`);
    lines.push(`TRIGGER:-PT${reminder.minutesBefore || 10}M`, 'END:VALARM');
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(fold).join('\r\n');
}
