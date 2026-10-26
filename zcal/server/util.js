/**
 * ZCal — time zone and date utilities. (was: ZenCalendar)
 *
 * All calendar state is stored as absolute UTC instants plus the IANA time zone
 * the event was authored in. Nothing is ever silently re-zoned: rendering and
 * computation always convert explicitly, and the originating time zone travels
 * with the event through every layer (provider -> cache -> UI).
 */

const MS_MIN = 60 * 1000;
const MS_DAY = 24 * 60 * MS_MIN;

const partsCache = new Map();

function partsFormatter(timeZone) {
  let fmt = partsCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short'
    });
    partsCache.set(timeZone, fmt);
  }
  return fmt;
}

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function isValidTimeZone(tz) {
  if (typeof tz !== 'string' || !tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Wall-clock parts of an instant, as seen from `timeZone`. */
export function zonedParts(instant, timeZone) {
  const date = instant instanceof Date ? instant : new Date(instant);
  const parts = partsFormatter(timeZone).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')) % 24,
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: WEEKDAY_INDEX[get('weekday')] ?? 0
  };
}

/** Time zone offset in ms at a given instant (positive east of UTC). */
export function zoneOffset(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const instantMs = (instant instanceof Date ? instant : new Date(instant)).getTime();
  return asUtc - Math.floor(instantMs / 1000) * 1000;
}

/** Convert wall-clock time in `timeZone` to the matching UTC instant (DST safe). */
export function zonedTimeToUtc(year, month, day, hour = 0, minute = 0, timeZone = 'UTC') {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstOffset = zoneOffset(new Date(guess), timeZone);
  let candidate = guess - firstOffset;
  const secondOffset = zoneOffset(new Date(candidate), timeZone);
  if (secondOffset !== firstOffset) candidate = guess - secondOffset;
  return new Date(candidate);
}

/** Midnight (local) of the day containing `instant`, returned as a UTC instant. */
export function startOfDay(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  return zonedTimeToUtc(p.year, p.month, p.day, 0, 0, timeZone);
}

export function addDays(instant, days, timeZone = 'UTC') {
  const p = zonedParts(instant, timeZone);
  return zonedTimeToUtc(p.year, p.month, p.day + days, p.hour, p.minute, timeZone);
}

export function addMinutes(instant, minutes) {
  return new Date(new Date(instant).getTime() + minutes * MS_MIN);
}

export function addMonths(instant, months, timeZone = 'UTC') {
  const p = zonedParts(instant, timeZone);
  return zonedTimeToUtc(p.year, p.month + months, p.day, p.hour, p.minute, timeZone);
}

/** Monday-first week start for the week containing `instant`. */
export function startOfWeek(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  const shift = (p.weekday + 6) % 7;
  return zonedTimeToUtc(p.year, p.month, p.day - shift, 0, 0, timeZone);
}

export function startOfMonth(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  return zonedTimeToUtc(p.year, p.month, 1, 0, 0, timeZone);
}

export function dateKey(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

export function minutesOfDay(instant, timeZone) {
  const p = zonedParts(instant, timeZone);
  return p.hour * 60 + p.minute;
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function durationMinutes(event) {
  return Math.round((new Date(event.end) - new Date(event.start)) / MS_MIN);
}

export function formatTime(instant, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(instant));
}

export function formatDateLong(instant, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(instant));
}

/** UTC offset label, e.g. "GMT+6". */
export function zoneLabel(instant, timeZone) {
  const offset = Math.round(zoneOffset(instant, timeZone) / MS_MIN);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `GMT${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}

export const constants = { MS_MIN, MS_DAY };
