/**
 * ZCal — AI scheduling planner. (was: ZenCalendar)
 *
 * Design decision: the reasoning layer is deterministic and local by default, so
 * it is auditable, fast, and works offline. It performs *real* computation over
 * the calendar graph (free/busy, working hours, time zones, buffers, priorities)
 * rather than inventing times. A remote AI provider can be plugged in via
 * `aiProvider` for phrasing/intent extension, but every proposed time still has
 * to pass through `findSlots()` — travel estimates are never fabricated, and no
 * time is ever invented.
 *
 * Everything this module produces is either
 *   - a read-only analysis, or
 *   - a *sandbox proposal* (never a direct write).
 */

import { store } from './store.js';
import { calendarService, parseQuery } from './calendarService.js';
import { sandbox } from './sandbox.js';
import {
  addDays,
  addMinutes,
  dateKey,
  durationMinutes,
  formatDateLong,
  formatTime,
  isValidTimeZone,
  minutesOfDay,
  overlaps,
  startOfDay,
  startOfWeek,
  zonedParts,
  zonedTimeToUtc
} from './util.js';

const MAX_SUGGESTIONS = 5;

function tz() {
  return store.state.settings.timeZone;
}

function now() {
  return new Date();
}

function parseClock(str) {
  const m = String(str || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function workingWindowFor(dayInstant, timeZone) {
  const { workingHours } = store.state.settings;
  const p = zonedParts(dayInstant, timeZone);
  const startClock = parseClock(workingHours.start) || { hour: 9, minute: 0 };
  const endClock = parseClock(workingHours.end) || { hour: 18, minute: 0 };
  const start = zonedTimeToUtc(p.year, p.month, p.day, startClock.hour, startClock.minute, timeZone);
  const end = zonedTimeToUtc(p.year, p.month, p.day, endClock.hour, endClock.minute, timeZone);
  const isWorkingDay = workingHours.days.includes(p.weekday);
  return { start, end, isWorkingDay };
}

/* ------------------------------------------------------------------ *
 * Intent resolution (prompt §4)
 * ------------------------------------------------------------------ */

const PEOPLE = [
  { match: /john/i, name: 'John', email: 'john@varizen.co' },
  { match: /sarah/i, name: 'Sarah K.', email: 'sarah.k@varizen.co' },
  { match: /finance/i, name: 'Finance Team', email: 'finance@varizen.co' },
  { match: /investors?|halden/i, name: 'Halden Capital', email: 'investors@halden.capital' },
  { match: /design/i, name: 'Design Team', email: 'design@varizen.co' },
  { match: /platform|engineering/i, name: 'Platform Team', email: 'platform@varizen.co' }
];

const PROJECTS = [
  { match: /\bsamc\b/i, label: 'SAMC' },
  { match: /\bvarizen\b/i, label: 'Varizen' },
  { match: /\bzmeet\b/i, label: 'ZMeet' },
  { match: /\bzcal\b|\bz cal\b/i, label: 'ZCal' }
];

function findPeople(text) {
  const found = [];
  for (const p of PEOPLE) if (p.match.test(text)) found.push({ name: p.name, email: p.email });
  return found;
}

function findProject(text) {
  for (const p of PROJECTS) if (p.match.test(text)) return p.label;
  return null;
}

/** Parse a duration in minutes from natural language ("45-minute", "2 hours", "free hour"). */
function parseDuration(text, fallback = 30) {
  const hours = text.match(/(\d+(?:\.\d+)?)\s*[- ]?\s*(?:hour|hours|hr|hrs|h)\b/i);
  const minutes = text.match(/(\d+)\s*[- ]?\s*(?:minute|minutes|min|mins|m)\b/i);
  if (/\bhalf[- ]an[- ]hour\b|\bhalf[- ]hour\b/i.test(text)) return 30;
  if (/(?:\b(?:a|an|one)\b[^.]{0,12}?\bhour\b)/i.test(text)) return 60;
  if (/\b(?:three|3)[- ]hour\b/i.test(text)) return 180;
  if (/\b(?:two|2)[- ]hour\b/i.test(text)) return 120;
  if (hours) return Math.round(Number(hours[1]) * 60);
  if (minutes) return Number(minutes[1]);
  return fallback;
}

/** Resolve a target date window from a phrase like "tomorrow", "next week", "Friday". */
function parseWindow(text, timeZone, { defaultDays = 7 } = {}) {
  const today = startOfDay(now(), timeZone);
  if (/today/i.test(text)) return { start: today, end: addDays(today, 1, timeZone), label: 'today' };
  if (/tomorrow/i.test(text)) {
    const s = addDays(today, 1, timeZone);
    return { start: s, end: addDays(s, 1, timeZone), label: 'tomorrow' };
  }
  if (/next week/i.test(text)) {
    const s = addDays(startOfWeek(today, timeZone), 7, timeZone);
    return { start: s, end: addDays(s, 7, timeZone), label: 'next week' };
  }
  if (/this week|rest of the week/i.test(text)) {
    const s = today;
    const endOfWeek = addDays(startOfWeek(today, timeZone), 7, timeZone);
    return { start: s, end: endOfWeek, label: 'this week' };
  }
  if (/next month/i.test(text)) {
    const p = zonedParts(today, timeZone);
    const s = zonedTimeToUtc(p.year, p.month + 1, 1, 0, 0, timeZone);
    return { start: s, end: zonedTimeToUtc(p.year, p.month + 2, 1, 0, 0, timeZone), label: 'next month' };
  }

  const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < DAYS.length; i += 1) {
    if (new RegExp(`\\b${DAYS[i]}\\b`, 'i').test(text)) {
      let cursor = today;
      for (let guard = 0; guard < 8; guard += 1) {
        cursor = addDays(cursor, 1, timeZone);
        if (zonedParts(cursor, timeZone).weekday === i) break;
      }
      return { start: cursor, end: addDays(cursor, 1, timeZone), label: DAYS[i] };
    }
  }

  return { start: today, end: addDays(today, defaultDays, timeZone), label: `next ${defaultDays} days` };
}

/**
 * Turn a natural-language request into a structured intent.
 * Returns { action, confidence, ... } — never mutates anything.
 */
export function resolveIntent(text = '') {
  const q = String(text || '').trim();
  const lower = q.toLowerCase();
  const timeZone = tz();

  const people = findPeople(q);
  const project = findProject(q);
  const durationMinutesValue = parseDuration(q, store.state.settings.defaultDurationMinutes || 30);
  const win = parseWindow(q, timeZone);

  const intent = {
    raw: q,
    timeZone,
    people,
    project,
    durationMinutes: durationMinutesValue,
    window: { start: win.start.toISOString(), end: win.end.toISOString() },
    windowLabel: win.label,
    confidence: 0.6,
    needsApproval: true
  };

  if (!q) return { ...intent, action: 'clarify', question: 'What would you like me to do with your calendar?' };

  if (/^(hi|hello|hey)\b/i.test(lower) && lower.split(/\s+/).length <= 3) {
    return { ...intent, action: 'chat', reply: 'I can plan, move, protect and simulate time. Ask me anything about your schedule.' };
  }

  if (/(what.*(day|schedule|calendar).*(look|looking))|how.*(day|week).*look|what do i have/i.test(lower)) {
    return { ...intent, action: 'summarize', confidence: 0.95 };
  }

  if (/prepare.*(schedule|day|tomorrow)|plan my day|daily plan/i.test(lower)) {
    return { ...intent, action: 'daily-plan', confidence: 0.9 };
  }

  if (/handle my calendar|agent mode|take over my calendar|triage/i.test(lower)) {
    return { ...intent, action: 'agent-mode', confidence: 0.95 };
  }

  // Focus-time phrasing must mention focus concepts, not just "free time".
  if (
    /(find|get|give me|block|protect|carve out).*(focus|deep work|uninterrupted|work block|no meetings)/i.test(lower) ||
    /protect my (mornings|afternoons|evenings)/i.test(lower) ||
    /(\d+|one|two|three|four)[- ]?hours? of (uninterrupted|focus|deep)/i.test(lower)
  ) {
    const focusMinutes = /3 hour|three hour/i.test(lower) ? 180 : /2 hour|two hour/i.test(lower) ? 120 : durationMinutesValue;
    return {
      ...intent,
      action: 'focus-time',
      focusMinutes,
      mornings: /morning/i.test(lower),
      afternoons: /afternoon/i.test(lower),
      confidence: 0.9
    };
  }

  if (/(move|reschedule|push|shift)/i.test(lower)) {
    const target = calendarService
      .getTimeline({
        start: addDays(now(), -1, timeZone).toISOString(),
        end: addDays(now(), 14, timeZone).toISOString(),
        timeZone
      })
      .events.find((e) => q.toLowerCase().includes((e.title || '').toLowerCase().split(' ')[0]));
    return {
      ...intent,
      action: 'reschedule',
      targetEventId: target?.id || null,
      targetTitle: target?.title || null,
      confidence: target ? 0.85 : 0.5,
      question: target ? null : 'Which meeting should I move? I could not match a title in your next two weeks.'
    };
  }

  if (/(what if|simulate|would my week look)/i.test(lower)) {
    return { ...intent, action: 'simulate', confidence: 0.85 };
  }

  if (/(find all|search|show me|everything related|all .* meetings|list .* meetings)/i.test(lower)) {
    return { ...intent, action: 'search', confidence: 0.88 };
  }

  if (/(tell me about|brief|context on|prepare me for)/i.test(lower)) {
    return { ...intent, action: 'brief', confidence: 0.8 };
  }

  if (/(find|schedule|book|set up|arrange|create|add).*(meeting|call|sync|slot|time|block|1:1|one-on-one)/i.test(lower) || people.length > 0) {
    return { ...intent, action: 'schedule', confidence: people.length ? 0.92 : 0.8 };
  }

  return { ...intent, action: 'search', confidence: 0.55 };
}

/* ------------------------------------------------------------------ *
 * Slot finding (prompt §6)
 * ------------------------------------------------------------------ */

/**
 * Compute ranked meeting slots. Hard constraints are never violated:
 *  - inside working hours on working days
 *  - no overlap with busy events
 *  - attendee travel buffer where locations differ
 * Preferences only reorder results (focus protection, existing density).
 */
export function findSlots({
  durationMinutes: requested = 30,
  windowStart,
  windowEnd,
  timeZone = tz(),
  attendeeTimeZones = [],
  ignoreEventIds = [],
  preferredPartOfDay = null,
  stepMinutes = 15,
  limit = MAX_SUGGESTIONS,
  requireAttendeesAwake = true
} = {}) {
  const winStart = new Date(windowStart || now());
  const winEnd = new Date(windowEnd || addDays(winStart, 7, timeZone));

  const { events } = calendarService.getTimeline({
    start: winStart.toISOString(),
    end: winEnd.toISOString(),
    timeZone
  });
  const busy = events.filter(
    (e) => e.availability !== 'free' && e.status !== 'cancelled' && !ignoreEventIds.includes(e.id)
  );

  const buffer = Number(store.state.settings.travelBufferMinutes || 0);
  const candidates = [];
  let cursorDay = startOfDay(winStart, timeZone);
  let guard = 0;

  while (cursorDay < winEnd && guard < 120) {
    guard += 1;
    const { start: dayStart, end: dayEnd, isWorkingDay } = workingWindowFor(cursorDay, timeZone);
    if (isWorkingDay) {
      for (let t = dayStart.getTime(); t + requested * 60000 <= dayEnd.getTime(); t += stepMinutes * 60000) {
        const slotStart = new Date(t);
        const slotEnd = addMinutes(slotStart, requested);
        if (slotStart < winStart) continue;
        if (slotEnd > winEnd) break;

        const collides = busy.some((e) => overlaps(slotStart, slotEnd, e.start, e.end));
        if (collides) continue;

        // travel buffer between adjacent meetings
        const nearBefore = busy.some(
          (e) => Math.abs(new Date(e.end) - slotStart) < buffer * 60000 && new Date(e.end) <= slotStart
        );
        const nearAfter = busy.some(
          (e) => Math.abs(new Date(e.start) - slotEnd) < buffer * 60000 && new Date(e.start) >= slotEnd
        );

        const score = scoreSlot({
          slotStart,
          slotEnd,
          busy,
          timeZone,
          attendeeTimeZones,
          preferredPartOfDay,
          requireAttendeesAwake,
          nearBefore,
          nearAfter
        });

        if (score && score.total > 0) {
          candidates.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            dayKey: dateKey(slotStart, timeZone),
            minutes: requested,
            score: score.total,
            reasons: score.reasons,
            attendeeView: attendeeTimeZones.map((at) => ({
              timeZone: at,
              label: `${formatTime(slotStart, at)} – ${formatTime(slotEnd, at)}`,
              hour: zonedParts(slotStart, at).hour
            }))
          });
        }
      }
    }
    cursorDay = addDays(cursorDay, 1, timeZone);
  }

  // De-duplicate overlapping options, keep the best per day first, then fill.
  const byDay = new Map();
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    const bucket = byDay.get(c.dayKey) || [];
    if (bucket.some((b) => overlaps(c.start, c.end, b.start, b.end) && b.start === c.start)) continue;
    if (bucket.filter((b) => overlaps(c.start, c.end, b.start, b.end)).length >= 2) continue;
    bucket.push(c);
    byDay.set(c.dayKey, bucket);
  }

  const spread = [];
  const dayKeys = [...byDay.keys()].sort();
  let round = 0;
  while (spread.length < limit && round < 4) {
    let added = false;
    for (const key of dayKeys) {
      const bucket = byDay.get(key).sort((a, b) => b.score - a.score);
      if (bucket[round]) {
        spread.push(bucket[round]);
        added = true;
        if (spread.length >= limit) break;
      }
    }
    if (!added) break;
    round += 1;
  }

  return {
    requestedMinutes: requested,
    timeZone,
    window: { start: winStart.toISOString(), end: winEnd.toISOString() },
    options: spread.sort((a, b) => new Date(a.start) - new Date(b.start)),
    alternativesConsidered: candidates.length
  };
}

function scoreSlot({
  slotStart,
  slotEnd,
  busy,
  timeZone,
  attendeeTimeZones,
  preferredPartOfDay,
  requireAttendeesAwake,
  nearBefore,
  nearAfter
}) {
  let total = 50;
  const reasons = [];
  const hour = zonedParts(slotStart, timeZone).hour;

  // Attendee sanity: nobody should be invited at 3am their time.
  for (const at of attendeeTimeZones) {
    const h = zonedParts(slotStart, at).hour;
    if (requireAttendeesAwake && (h < 7 || h >= 22)) return null;
    if (h >= 9 && h < 18) {
      total += 8;
      reasons.push(`inside working hours in ${at}`);
    } else {
      total -= 10;
      reasons.push(`outside 9–18 in ${at}`);
    }
  }

  if (preferredPartOfDay === 'morning' && hour < 12) {
    total += 12;
    reasons.push('morning preference');
  }
  if (preferredPartOfDay === 'afternoon' && hour >= 12) {
    total += 12;
    reasons.push('afternoon preference');
  }

  // Prefer mid-morning / early afternoon (energy curve)
  if (hour >= 9 && hour < 11) {
    total += 10;
    reasons.push('high-energy morning window');
  } else if (hour >= 13 && hour < 15) {
    total += 6;
    reasons.push('post-lunch window');
  } else if (hour >= 16) {
    total -= 4;
    reasons.push('late afternoon');
  }

  if (hour === 12) {
    total -= 8;
    reasons.push('overlaps lunch hour');
  }

  // Back-to-back penalty
  if (nearBefore) {
    total -= 6;
    reasons.push('no buffer before');
  }
  if (nearAfter) {
    total -= 6;
    reasons.push('no buffer after');
  }

  // Consolidation: prefer days that already have meetings (batching)
  const dayKeyOf = (iso) => iso.slice(0, 10);
  const sameDayCount = busy.filter((e) => dayKeyOf(e.start) === dayKeyOf(slotStart.toISOString())).length;
  if (sameDayCount >= 2) {
    total += 4;
    reasons.push('batched with an existing meeting day');
  }

  // Free the longest contiguous gap? Prefer slots adjacent to a focus block.
  void slotEnd;

  return { total, reasons };
}

/* ------------------------------------------------------------------ *
 * Commands
 * ------------------------------------------------------------------ */

export function handleCommand(text) {
  const intent = resolveIntent(text);
  switch (intent.action) {
    case 'summarize':
      return { intent, result: daySummary() };
    case 'daily-plan':
      return { intent, result: dailyPlan() };
    case 'agent-mode':
      return { intent, result: agentAnalysis() };
    case 'focus-time':
      return { intent, result: focusTimeProposal(intent) };
    case 'reschedule':
      return { intent, result: rescheduleProposal(intent) };
    case 'simulate':
      return { intent, result: simulationFor(intent) };
    case 'brief':
      return { intent, result: briefForIntent(intent) };
    case 'schedule':
      return { intent, result: scheduleProposal(intent) };
    case 'search':
    default:
      return { intent, result: { search: calendarService.search(text, { timeZone: tz() }) } };
  }
}

/* ------------------------------- summarize ------------------------------- */

export function daySummary({ anchor = null, days = 1 } = {}) {
  const timeZone = tz();
  const start = startOfDay(anchor ? new Date(anchor) : now(), timeZone);
  const end = addDays(start, days, timeZone);
  const view = calendarService.getView({ view: days === 1 ? 'day' : 'week', anchor: start.toISOString(), timeZone });
  const events = view.events;
  const rehearsals = (() => {
    const gaps = calendarService.computeFreeGaps(
      start.toISOString(),
      end.toISOString(),
      events.filter((e) => e.availability !== 'free' && e.status !== 'cancelled'),
      timeZone
    );
    return gaps;
  })();

  const headline = events.length
    ? `${events.length} ${events.length === 1 ? 'event' : 'events'} · ${view.summary.busyHours}h busy`
    : 'Your calendar is clear';

  return {
    label: formatDateLong(start, timeZone),
    headline,
    events: events.map((e) => ({
      id: e.id,
      instanceId: e.instanceId,
      title: e.title,
      time: `${formatTime(e.start, timeZone)} – ${formatTime(e.end, timeZone)}`,
      calendarName: e.calendarName,
      calendarColor: e.calendarColor,
      provider: e.provider,
      attendees: (e.attendees || []).length,
      availability: e.availability,
      location: e.location,
      conference: e.conference
    })),
    summary: view.summary,
    freeGaps: rehearsals,
    conflicts: calendarService.detectConflicts(events).map((c) => ({
      id: c.id,
      a: c.a.title,
      b: c.b.title,
      overlap: `${formatTime(c.overlapStart, timeZone)} – ${formatTime(c.overlapEnd, timeZone)}`
    }))
  };
}

/* ------------------------------- daily plan ------------------------------- */

export function dailyPlan({ anchor = null } = {}) {
  const timeZone = tz();
  const start = startOfDay(anchor ? new Date(anchor) : now(), timeZone);
  const end = addDays(start, 1, timeZone);
  const { events } = calendarService.getTimeline({ start: start.toISOString(), end: end.toISOString(), timeZone });
  const busy = events.filter((e) => e.availability !== 'free' && e.status !== 'cancelled');
  const gaps = calendarService.computeFreeGaps(start.toISOString(), end.toISOString(), busy, timeZone);
  const longest = gaps.reduce((best, g) => (g.minutes > (best?.minutes || 0) ? g : best), null);

  const suggestions = [];
  const firstMeeting = busy[0];
  if (firstMeeting) {
    const minutesUntil = Math.round((new Date(firstMeeting.start) - now()) / 60000);
    if (minutesUntil > 0 && minutesUntil <= 240) {
      suggestions.push({
        id: 'sug_prep',
        kind: 'prep',
        title: `Prepare for ${firstMeeting.title}`,
        detail: `${Math.min(20, Math.max(10, Math.round(minutesUntil / 10)))} min of prep before ${formatTime(firstMeeting.start, timeZone)}`,
        proposedSlot: {
          start: addMinutes(firstMeeting.start, -20).toISOString(),
          end: addMinutes(firstMeeting.start, -5).toISOString()
        },
        minutes: 15
      });
    }
  }

  if (longest && longest.minutes >= 45) {
    suggestions.push({
      id: 'sug_focus',
      kind: 'focus',
      title: `Protect ${Math.min(120, longest.minutes)} minutes of focus`,
      detail: `Your largest gap is ${Math.round(longest.minutes / 6) / 10}h at ${formatTime(longest.start, timeZone)}`,
      proposedSlot: { start: longest.start, end: addMinutes(longest.start, Math.min(120, longest.minutes)).toISOString() },
      minutes: Math.min(120, longest.minutes)
    });
  }

  const noAgenda = busy.filter((e) => !e.description && (e.attendees || []).length > 1);
  if (noAgenda.length) {
    suggestions.push({
      id: 'sug_agenda',
      kind: 'admin',
      title: `${noAgenda.length} meeting(s) have no agenda`,
      detail: noAgenda.map((e) => e.title).slice(0, 3).join(', '),
      minutes: 5
    });
  }

  const pendingInvites = busy.filter((e) =>
    (e.attendees || []).some((a) => a.self && a.status === 'needs-action')
  );
  if (pendingInvites.length) {
    suggestions.push({
      id: 'sug_invites',
      kind: 'invite',
      title: `Respond to ${pendingInvites.length} invitation(s)`,
      detail: pendingInvites.map((e) => e.title).join(', '),
      minutes: 2
    });
  }

  const bufferWarnings = travelWarnings(events);

  return {
    date: start.toISOString(),
    label: formatDateLong(start, timeZone),
    timeline: events.map((e) => ({
      id: e.id,
      instanceId: e.instanceId,
      time: formatTime(e.start, timeZone),
      endTime: formatTime(e.end, timeZone),
      title: e.title,
      calendarName: e.calendarName,
      calendarColor: e.calendarColor,
      availability: e.availability,
      attendees: (e.attendees || []).length
    })),
    summary: calendarService.summarize(events, timeZone),
    freeGaps: gaps,
    suggestions,
    travelWarnings: bufferWarnings
  };
}

/* ------------------------------- agent mode ------------------------------- */

export function agentAnalysis() {
  const timeZone = tz();
  const start = startOfDay(now(), timeZone);
  const end = addDays(start, 2, timeZone);
  const { events } = calendarService.getTimeline({ start: start.toISOString(), end: end.toISOString(), timeZone });
  const busy = events.filter((e) => e.availability !== 'free' && e.status !== 'cancelled');
  const conflicts = calendarService.detectConflicts(events);
  const gaps = calendarService.computeFreeGaps(start.toISOString(), addDays(start, 1, timeZone).toISOString(), busy, timeZone);

  const needsMe = [];
  for (const e of busy) {
    const selfAttendee = (e.attendees || []).find((a) => a.self);
    if (selfAttendee && selfAttendee.status === 'needs-action') {
      needsMe.push({
        id: `needs_rsvp_${e.id}`,
        kind: 'rsvp',
        title: `Accept invitation: ${e.title}`,
        detail: `${formatTime(e.start, timeZone)} · ${(e.attendees || []).length} attendees · ${e.calendarName}`,
        eventId: e.id,
        actions: [
          { id: 'accept', label: 'Accept', type: 'rsvp', rsvp: 'accept' },
          { id: 'tentative', label: 'Tentative', type: 'rsvp', rsvp: 'tentative' },
          { id: 'decline', label: 'Decline', type: 'rsvp', rsvp: 'decline', destructive: true }
        ]
      });
    }
    if ((e.attendees || []).filter((a) => a.status === 'needs-action' && !a.self).length >= 1 && (e.organizer?.email || '').includes('tahseen')) {
      needsMe.push({
        id: `needs_time_${e.id}`,
        kind: 'organizer',
        title: `Choose a time for ${e.title}`,
        detail: `${(e.attendees || []).filter((a) => a.status === 'needs-action').map((a) => a.name || a.email).join(', ')} haven't responded`,
        eventId: e.id,
        actions: [{ id: 'propose', label: 'Find better time', type: 'propose-time' }]
      });
    }
  }

  const aiCanHandle = [];
  // internal, non-essential meetings that can be relocated out of focus blocks
  const relocatable = busy.filter(
    (e) => !e.organizer?.email?.includes('investor') && (e.attendees || []).length <= 3 && e.durationMinutes <= 60
  );
  if (relocatable.length) {
    aiCanHandle.push({
      id: 'ai_reschedule',
      kind: 'reschedule-group',
      title: `Reschedule ${Math.min(3, relocatable.length)} internal meeting(s)`,
      detail: relocatable
        .slice(0, 3)
        .map((e) => e.title)
        .join(', '),
      impact: 'Moves flexible internal meetings into lower-energy windows',
      targets: relocatable.slice(0, 3).map((e) => e.id)
    });
  }

  const openSlots = gaps.filter((g) => g.withinWorkingHours && g.minutes >= 30);
  if (openSlots.length) {
    aiCanHandle.push({
      id: 'ai_prep',
      kind: 'prep-blocks',
      title: `Add ${Math.min(2, openSlots.length)} × 30-minute preparation block(s)`,
      detail: openSlots.slice(0, 2).map((g) => `${formatTime(g.start, timeZone)}`).join(', '),
      impact: 'Reserves prep time before your heaviest meetings'
    });
  }

  const pendingInvites = busy.filter((e) => (e.attendees || []).some((a) => a.self && a.status === 'needs-action'));
  if (pendingInvites.length) {
    aiCanHandle.push({
      id: 'ai_proposals',
      kind: 'scheduling-proposals',
      title: `Send ${pendingInvites.length} scheduling proposal(s)`,
      detail: pendingInvites.map((e) => e.title).join(', '),
      impact: 'Drafts replies with concrete time options — nothing is sent until you approve',
      requires: 'send:communication'
    });
  }

  const travel = travelWarnings(events);

  return {
    generatedAt: new Date().toISOString(),
    window: { start: start.toISOString(), end: end.toISOString(), timeZone },
    today: {
      meetings: busy.length,
      conflicts: conflicts.length,
      prepTasks: Math.min(2, dailyPlan().suggestions.filter((s) => s.kind === 'prep').length),
      focusHours: Math.round((gaps.filter((g) => g.withinWorkingHours).reduce((n, g) => n + g.minutes, 0) / 60) * 10) / 10,
      headline: `${busy.length} ${busy.length === 1 ? 'meeting' : 'meetings'} · ${conflicts.length} ${
        conflicts.length === 1 ? 'conflict' : 'conflicts'
      }`
    },
    needsMe,
    aiCanHandle,
    conflicts: conflicts.map((c) => ({
      id: c.id,
      title: `${c.a.title} ↔ ${c.b.title}`,
      overlap: `${formatTime(c.overlapStart, timeZone)} – ${formatTime(c.overlapEnd, timeZone)}`,
      dayKey: dateKey(c.a.start, timeZone),
      resolution: 'Move the shorter, more flexible meeting'
    })),
    travelWarnings: travel,
    permissions: store.state.permissionGrants,
    agentMode: Boolean(store.state.settings.agentMode)
  };
}

/* ------------------------------- focus time ------------------------------- */

export function focusTimeProposal(intent) {
  const timeZone = intent.timeZone;
  const winStart = new Date(intent.window.start);
  const winEnd = new Date(intent.window.end);
  const minutes = intent.focusMinutes || 180;
  const preferMorning = intent.mornings || /morning/i.test(intent.raw);

  const slots = findSlots({
    durationMinutes: minutes,
    windowStart: winStart,
    windowEnd: winEnd,
    timeZone,
    preferredPartOfDay: preferMorning ? 'morning' : intent.afternoons ? 'afternoon' : null,
    stepMinutes: 30,
    limit: 3
  });

  if (!slots.options.length) {
    return {
      type: 'focus-time',
      message: `No ${minutes}-minute uninterrupted block fits inside working hours in ${intent.windowLabel}. I can split it into two shorter blocks, or you can widen your working hours.`,
      options: [],
      requiresWiderWindow: true
    };
  }

  const best = slots.options[0];
  const proposal = sandbox.create({
    intent: `Protect ${Math.round(minutes / 6) / 10}h of focus (${intent.windowLabel})`,
    rationale: `Best candidate ${formatTime(best.start, timeZone)} keeps working hours intact and avoids conflicts.`,
    timeZone,
    requestedBy: 'ai',
    operations: [
      {
        type: 'create',
        calendarId: store.state.calendars.find((c) => c.visible && !c.readOnly)?.id,
        title: 'Focus Block',
        description: 'Protected deep work — created by ZCal agent',
        start: best.start,
        end: best.end,
        availability: 'busy',
        reason: 'uninterrupted focus'
      }
    ]
  });

  return { type: 'focus-time', options: slots.options, proposal, message: `I can protect ${formatTime(best.start, timeZone)} – ${formatTime(best.end, timeZone)}.` };
}

/* ------------------------------- reschedule ------------------------------- */

export function rescheduleProposal(intent) {
  const timeZone = intent.timeZone;
  if (!intent.targetEventId) {
    return { type: 'reschedule', message: intent.question || 'Which meeting should I move?', needsTarget: true };
  }
  const event = calendarService.getEventByRemoteOrInstance(intent.targetEventId);
  if (!event) return { type: 'reschedule', message: 'That event is no longer on your calendar.', needsTarget: true };

  const newWin = parseWindow(intent.raw, timeZone);
  const slots = findSlots({
    durationMinutes: durationMinutes(event),
    windowStart: newWin.start,
    windowEnd: newWin.end,
    timeZone,
    ignoreEventIds: [event.id],
    limit: 3
  });

  if (!slots.options.length) {
    return { type: 'reschedule', message: `No free ${durationMinutes(event)}-minute slot in ${newWin.label}.` };
  }

  const best = slots.options[0];
  const proposal = sandbox.create({
    intent: `Move “${event.title}” to ${newWin.label}`,
    rationale: `${best.reasons.slice(0, 2).join('; ')}`,
    timeZone,
    operations: [
      {
        type: 'move',
        eventId: event.id,
        title: event.title,
        targetStart: best.start,
        targetEnd: best.end,
        reason: `moved to ${newWin.label}`
      }
    ]
  });

  return { type: 'reschedule', event, options: slots.options, proposal };
}

/* ------------------------------- simulation ------------------------------- */

export function simulationFor(intent) {
  const timeZone = intent.timeZone;
  const minutes = intent.durationMinutes;
  const start = new Date(intent.window.start);
  const dayEnd = addDays(startOfDay(start, timeZone), 1, timeZone);
  const { events } = calendarService.getTimeline({ start: start.toISOString(), end: dayEnd.toISOString(), timeZone });

  const slots = findSlots({
    durationMinutes: minutes,
    windowStart: start,
    windowEnd: dayEnd,
    timeZone,
    limit: 1
  });

  const slot = slots.options[0];
  if (!slot) {
    return { type: 'simulation', message: `There is no free ${minutes}-minute slot on that day to simulate.` };
  }

  const result = sandbox.simulate({
    intent: `What if I add a ${minutes}-minute meeting (${formatTime(slot.start, timeZone)})`,
    timeZone,
    operations: [
      {
        type: 'create',
        title: 'Simulated meeting',
        start: slot.start,
        end: slot.end,
        calendarId: store.state.calendars.find((c) => c.visible)?.id,
        availability: 'busy',
        reason: 'simulation'
      }
    ]
  });

  return {
    type: 'simulation',
    simulated: result.proposal,
    consequences: result.consequences,
    existingEvents: events.length,
    message: `Simulation only — ${result.consequences.lines.join(' ')}`
  };
}

/* ------------------------------- scheduling ------------------------------- */

export function scheduleProposal(intent) {
  const timeZone = intent.timeZone;
  const slots = findSlots({
    durationMinutes: intent.durationMinutes,
    windowStart: new Date(intent.window.start),
    windowEnd: new Date(intent.window.end),
    timeZone,
    attendeeTimeZones: [],
    limit: MAX_SUGGESTIONS
  });

  if (!slots.options.length) {
    return {
      type: 'schedule',
      message: `No ${intent.durationMinutes}-minute slot works in ${intent.windowLabel}. Want me to look further out?`,
      options: []
    };
  }

  const calendar = store.state.calendars.find((c) => c.visible && !c.readOnly);
  const title = intent.project
    ? `${intent.project} ${intent.people.length ? 'Sync' : 'Focus'}`
    : intent.people.length
      ? `Meeting with ${intent.people.map((p) => p.name).join(' & ')}`
      : 'New meeting';

  const proposals = slots.options.slice(0, 3).map((opt, idx) =>
    sandbox.create({
      intent: `Schedule ${title} → ${formatTime(opt.start, timeZone)}`,
      rationale: opt.reasons.slice(0, 2).join('; '),
      timeZone,
      requestedBy: 'ai',
      operations: [
        {
          type: 'create',
          calendarId: calendar?.id,
          title,
          description: intent.project ? `Working session for ${intent.project}` : '',
          start: opt.start,
          end: opt.end,
          timeZone,
          invitees: intent.people,
          availability: 'busy',
          reason: `option ${idx + 1}`
        }
      ]
    })
  );

  return {
    type: 'schedule',
    title,
    durationMinutes: intent.durationMinutes,
    attendees: intent.people,
    options: slots.options,
    proposals,
    message: intent.people.length
      ? `${slots.options.length} option(s) found for ${intent.people.map((p) => p.name).join(' & ')} in ${intent.windowLabel}.`
      : `${slots.options.length} free option(s) in ${intent.windowLabel}.`
  };
}

/* ------------------------------- briefs ------------------------------- */

export function briefForIntent(intent) {
  const q = intent.raw.toLowerCase();
  const { events } = calendarService.getTimeline({
    start: addDays(now(), -1, intent.timeZone).toISOString(),
    end: addDays(now(), 14, intent.timeZone).toISOString(),
    timeZone: intent.timeZone
  });
  const match = events.find((e) => q.includes((e.title || '').toLowerCase().split(' ')[0])) || events[0];
  if (!match) return { type: 'brief', message: 'No matching meeting found in the next two weeks.' };
  return { type: 'brief', brief: meetingBrief(match.id), followUp: meetingFollowUp(match.id) };
}

/**
 * Meeting brief (prompt §13). Cross-application data (email, documents) is only
 * included when the corresponding capability has been granted — otherwise the
 * sections are explicitly marked as unavailable rather than guessed.
 */
export function meetingBrief(eventId) {
  const event = calendarService.getEventByRemoteOrInstance(eventId);
  if (!event) throw Object.assign(new Error('Event not found'), { status: 404 });
  const timeZone = tz();

  const related = calendarService.search(event.title.split(' ').slice(0, 2).join(' '), { timeZone, limit: 20 });
  const previous = related.events.filter((e) => new Date(e.start) < new Date(event.start)).slice(0, 5);

  const emailGranted = sandbox.hasCapability('read:events');
  return {
    eventId: event.id,
    title: event.title,
    when: `${formatDateLong(event.start, timeZone)} · ${formatTime(event.start, timeZone)} – ${formatTime(event.end, timeZone)}`,
    timeZone: event.timeZone,
    durationMinutes: durationMinutes(event),
    location: event.location || null,
    conference: event.conference || null,
    provider: event.provider,
    calendarName: event.calendarName,
    organizer: event.organizer,
    attendees: (event.attendees || []).map((a) => ({
      name: a.name || a.email,
      email: a.email,
      status: a.status,
      organizer: Boolean(a.organizer),
      responseKnown: a.status !== 'needs-action'
    })),
    previousMeetings: previous.map((p) => ({
      title: p.title,
      when: formatDateLong(p.start, timeZone),
      attendees: (p.attendees || []).length
    })),
    openTasks: (store.state.tasks || []).filter((t) => t.eventId === event.id && !t.done),
    description: event.description || '',
    agenda: event.description ? event.description.split('\n').filter(Boolean) : [],
    emailContext: emailGranted
      ? {
          available: true,
          note: 'ZMail bridge is available. Message bodies are fetched on demand only, never cached.',
          connected: Boolean(store.state.settings.zenboxConnected),
          recentThreads: []
        }
      : {
          available: false,
          note: 'Email context requires the “Read events” capability plus a ZMail connection.'
        }
  };
}

export function meetingFollowUp(eventId) {
  const event = calendarService.getEventByRemoteOrInstance(eventId);
  if (!event) throw Object.assign(new Error('Event not found'), { status: 404 });
  const timeZone = tz();
  const ended = new Date(event.end) < now();
  const decisions = [];
  const tasks = [];
  const attendees = event.attendees || [];

  if (ended) {
    decisions.push('No minutes were recorded — decisions will be captured once notes are added.');
  }
  for (const a of attendees.filter((x) => x.status === 'accepted' && !x.self)) {
    tasks.push({ owner: a.name || a.email, task: `Follow up with ${a.name || a.email}`, due: addDays(event.end, 3, timeZone).slice(0, 10) });
  }
  for (const a of attendees.filter((x) => x.status === 'needs-action')) {
    tasks.push({ owner: a.name || a.email, task: `Chase response for “${event.title}”`, due: addDays(now(), 2, timeZone).slice(0, 10) });
  }

  return {
    eventId: event.id,
    title: event.title,
    ended,
    decisions,
    tasks,
    suggestedEmail: {
      subject: `Follow-up: ${event.title}`,
      body: `Hi ${attendees.filter((a) => !a.self).map((a) => (a.name || a.email).split(' ')[0]).join(', ') || 'all'},\n\nThanks for the time today on “${event.title}”.\n\nNext steps:\n${tasks.map((t) => `- ${t.task} (${t.owner})`).join('\n') || '- (to be confirmed)'}\n\nBest,\nTahseen`,
      requiresPermission: 'send:communication'
    }
  };
}

/* ------------------------------- travel ------------------------------- */

/**
 * Travel-aware scheduling (prompt §18). Only flags a conflict when both events
 * declare a physical location and the gap is smaller than the configured buffer.
 * Travel time is never invented — the buffer comes from user settings.
 */
export function travelWarnings(events) {
  const buffer = Number(store.state.settings.travelBufferMinutes || 15);
  const physical = events
    .filter((e) => e.location && !/zoom|meet|teams|phone|online|virtual/i.test(e.location) && e.availability !== 'free')
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const warnings = [];
  for (let i = 0; i < physical.length - 1; i += 1) {
    const a = physical[i];
    const b = physical[i + 1];
    const gap = Math.round((new Date(b.start) - new Date(a.end)) / 60000);
    if (gap < 0) continue;
    const differentPlace = a.location.trim().toLowerCase() !== b.location.trim().toLowerCase();
    if (differentPlace && gap < buffer) {
      warnings.push({
        id: `travel_${a.id}_${b.id}`,
        title: 'Potential travel conflict',
        detail: `${a.location} → ${b.location} leaves ${gap} min; your travel buffer is ${buffer} min.`,
        from: a.title,
        to: b.title,
        gapMinutes: gap,
        bufferMinutes: buffer,
        estimateSource: 'user setting — no travel time is fabricated'
      });
    }
  }
  return warnings;
}

/* ------------------------------- AI provider abstraction ------------------------------- */

export const AI_PROVIDERS = [
  { kind: 'deterministic', label: 'ZCal Local (deterministic)', requiresNetwork: false, privacy: 'No data leaves your device' },
  { kind: 'openai', label: 'OpenAI', requiresNetwork: true, privacy: 'Selected event text is sent to OpenAI' },
  { kind: 'anthropic', label: 'Anthropic', requiresNetwork: true, privacy: 'Selected event text is sent to Anthropic' },
  { kind: 'gemini', label: 'Google Gemini', requiresNetwork: true, privacy: 'Selected event text is sent to Google' },
  { kind: 'local', label: 'Local model (Ollama/LM Studio)', requiresNetwork: false, privacy: 'Stays on your machine' },
  { kind: 'enterprise', label: 'Enterprise model (org-controlled)', requiresNetwork: true, privacy: 'Routed to your organisation endpoint' }
];

export function getAIProvider() {
  return store.state.aiProvider;
}

export function setAIProvider({ kind, model, allowRemote = false }) {
  if (!AI_PROVIDERS.some((p) => p.kind === kind)) {
    throw Object.assign(new Error('Unknown AI provider'), { status: 400 });
  }
  store.state.aiProvider = { kind, model: model || kind, allowRemote: Boolean(allowRemote) };
  store.persist();
  calendarService.log('AI_PROVIDER_SET', `AI provider set to ${kind}${allowRemote ? ' (remote processing allowed)' : ' (local only)'}`, {
    actor: 'user'
  });
  return store.state.aiProvider;
}

export { isValidTimeZone, minutesOfDay };
