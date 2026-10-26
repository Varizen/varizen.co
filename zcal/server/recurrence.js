/**
 * ZCal — RRULE expansion (was: ZenCalendar). RFC 5545 subset, no dependencies.
 *
 * Supports FREQ (DAILY/WEEKLY/MONTHLY/YEARLY), INTERVAL, COUNT, UNTIL,
 * BYDAY (incl. ordinal like 3TU), BYMONTHDAY, BYMONTH, WKST.
 *
 * Expansion is bounded by a window so a rogue rule can never stall a request.
 */

import { zonedParts, zonedTimeToUtc, addDays } from './util.js';

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MAX_INSTANCES = 750;

function parseRule(rrule = '') {
  const body = rrule.replace(/^RRULE:/i, '');
  const out = {};
  for (const chunk of body.split(';')) {
    if (!chunk) continue;
    const [k, v] = chunk.split('=');
    out[k.toUpperCase()] = v;
  }
  return out;
}

function parseByDay(value = '') {
  return value
    .split(',')
    .map((token) => {
      const m = token.trim().match(/^([+-]?\d+)?(SU|MO|TU|WE|TH|FR|SA)$/i);
      if (!m) return null;
      return { ordinal: m[1] ? Number(m[1]) : null, weekday: WEEKDAY_CODES.indexOf(m[2].toUpperCase()) };
    })
    .filter(Boolean);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Expand one event into concrete occurrences overlapping [windowStart, windowEnd].
 * Master event `start`/`end` are absolute ISO instants; `timeZone` defines the
 * wall clock used for recurrence stepping so DST does not shift meeting times.
 */
export function expandEvent(event, windowStart, windowEnd) {
  const winStart = new Date(windowStart).getTime();
  const winEnd = new Date(windowEnd).getTime();
  const tz = event.timeZone || 'UTC';
  const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
  const exdates = new Set((event.exdates || []).map((d) => new Date(d).getTime()));

  if (!event.recurrence?.length) {
    const s = new Date(event.start).getTime();
    const e = s + duration;
    return e > winStart && s < winEnd ? [{ start: new Date(s).toISOString(), end: new Date(e).toISOString(), isRecurring: false }] : [];
  }

  const rule = parseRule(event.recurrence[0]);
  const freq = (rule.FREQ || 'WEEKLY').toUpperCase();
  const interval = Math.max(1, Number(rule.INTERVAL || 1));
  const count = rule.COUNT ? Number(rule.COUNT) : null;
  const until = rule.UNTIL ? parseUntil(rule.UNTIL, tz) : null;
  const byDay = parseByDay(rule.BYDAY);
  const byMonthDay = rule.BYMONTHDAY ? rule.BYMONTHDAY.split(',').map(Number) : null;
  const byMonth = rule.BYMONTH ? rule.BYMONTH.split(',').map(Number) : null;

  const anchor = zonedParts(event.start, tz);
  const pad = (n) => String(n).padStart(2, '0');

  const instances = [];
  let emitted = 0;
  let guard = 0;
  const hardStop = new Date(winEnd + duration);

  const pushInstance = (year, month, day) => {
    if (guard > MAX_INSTANCES * 6) return false;
    const startInstant = zonedTimeToUtc(year, month, day, anchor.hour, anchor.minute, tz);
    const s = startInstant.getTime();
    const e = s + duration;
    if (until && s > until) return false;
    if (count && emitted >= count) return false;
    if (exdates.has(s)) {
      // an explicit exclusion still consumes the occurrence count
      emitted += 1;
      return true;
    }
    emitted += 0;
    if (s < hardStop.getTime() && e > winStart) {
      instances.push({
        start: startInstant.toISOString(),
        end: new Date(e).toISOString(),
        isRecurring: true,
        occurrenceKey: `${event.id}::${new Date(s).toISOString()}`
      });
    }
    return startInstant <= hardStop;
  };

  if (freq === 'DAILY') {
    const startDay = zonedTimeToUtc(anchor.year, anchor.month, anchor.day, 0, 0, tz);
    let cursor = startDay;
    while (guard < MAX_INSTANCES * 6) {
      guard += 1;
      const p = zonedParts(cursor, tz);
      if (byMonth && !byMonth.includes(p.month)) {
        cursor = addDays(cursor, 1, tz);
        continue;
      }
      const okDay = !byMonthDay || byMonthDay.includes(p.day);
      if (okDay && !pushInstance(p.year, p.month, p.day)) break;
      if (okDay) emitted += 1;
      cursor = addDays(cursor, interval, tz);
      if (cursor.getTime() > hardStop.getTime()) break;
    }
    return instances;
  }

  if (freq === 'WEEKLY') {
    const weekdays = byDay.length ? byDay.map((d) => d.weekday) : [anchor.weekday];
    // Weeks are Monday-first here, but weekday indexes are Sunday-based:
    // convert to a Monday-based offset before stepping.
    const mondayOffset = (wd) => (wd + 6) % 7;
    const baseWeek = addDays(
      zonedTimeToUtc(anchor.year, anchor.month, anchor.day, 0, 0, tz),
      -mondayOffset(anchor.weekday),
      tz
    );
    let week = baseWeek;
    while (guard < MAX_INSTANCES * 6) {
      guard += 1;
      for (const wd of [...weekdays].sort((a, b) => mondayOffset(a) - mondayOffset(b))) {
        const day = addDays(week, mondayOffset(wd), tz);
        const p = zonedParts(day, tz);
        if (count && emitted >= count) break;
        const keep = pushInstance(p.year, p.month, p.day);
        emitted += 1;
        if (!keep) {
          guard = MAX_INSTANCES * 6;
          break;
        }
      }
      week = addDays(week, 7 * interval, tz);
      if (week.getTime() > hardStop.getTime()) break;
    }
    return instances;
  }

  if (freq === 'MONTHLY') {
    const ordinalDays = byDay.filter((d) => d.ordinal !== null);
    let cursor = zonedTimeToUtc(anchor.year, anchor.month, 1, 0, 0, tz);
    while (guard < MAX_INSTANCES * 6) {
      guard += 1;
      const p = zonedParts(cursor, tz);
      if (byMonth && !byMonth.includes(p.month)) {
        cursor = shiftMonth(cursor, interval, tz);
        continue;
      }
      const targetDays = new Set();
      if (byMonthDay) byMonthDay.forEach((d) => targetDays.add(d > 0 ? d : daysInMonth(p.year, p.month) + d + 1));
      if (ordinalDays.length) {
        for (const od of ordinalDays) {
          const day = nthWeekdayOfMonth(p.year, p.month, od.weekday, od.ordinal, tz);
          if (day) targetDays.add(zonedParts(day, tz).day);
        }
      }
      if (!byMonthDay && !ordinalDays.length) targetDays.add(anchor.day);
      for (const day of [...targetDays].sort((a, b) => a - b)) {
        if (day < 1 || day > daysInMonth(p.year, p.month)) continue;
        if (count && emitted >= count) break;
        const keep = pushInstance(p.year, p.month, day);
        emitted += 1;
        if (!keep) {
          guard = MAX_INSTANCES * 6;
          break;
        }
      }
      cursor = shiftMonth(cursor, interval, tz);
      if (cursor.getTime() > hardStop.getTime()) break;
    }
    return instances;
  }

  // YEARLY
  let year = anchor.year;
  while (guard < MAX_INSTANCES * 6) {
    guard += 1;
    if (!byMonth || byMonth.includes(anchor.month)) {
      if (count && emitted >= count) break;
      const keep = pushInstance(year, anchor.month, anchor.day);
      emitted += 1;
      if (!keep) break;
    }
    year += interval;
    if (zonedTimeToUtc(year, anchor.month, anchor.day, anchor.hour, anchor.minute, tz).getTime() > hardStop.getTime()) break;
  }
  return instances;
}

function shiftMonth(instant, months, tz) {
  const p = zonedParts(instant, tz);
  return zonedTimeToUtc(p.year, p.month + months, 1, 0, 0, tz);
}

function nthWeekdayOfMonth(year, month, weekday, ordinal, tz) {
  const total = daysInMonth(year, month);
  const days = [];
  for (let d = 1; d <= total; d += 1) {
    if (zonedParts(zonedTimeToUtc(year, month, d, 0, 0, tz), tz).weekday === weekday) days.push(d);
  }
  if (!days.length) return null;
  const idx = ordinal > 0 ? ordinal - 1 : days.length + ordinal;
  if (idx < 0 || idx >= days.length) return null;
  return zonedTimeToUtc(year, month, days[idx], 0, 0, tz);
}

function parseUntil(raw, tz) {
  const v = raw.trim();
  if (/^\d{8}$/.test(v)) {
    return zonedTimeToUtc(Number(v.slice(0, 4)), Number(v.slice(4, 6)), Number(v.slice(6, 8)), 23, 59, tz).getTime();
  }
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (!m) return null;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
}

/** Expand many events at once, preserving provider metadata. */
export function expandEvents(events, windowStart, windowEnd) {
  const out = [];
  for (const event of events) {
    for (const instance of expandEvent(event, windowStart, windowEnd)) {
      out.push({
        ...event,
        instanceId: instance.occurrenceKey || event.id,
        start: instance.start,
        end: instance.end,
        isRecurring: instance.isRecurring,
        masterStart: event.start
      });
    }
  }
  return out.sort((a, b) => new Date(a.start) - new Date(b.start));
}
