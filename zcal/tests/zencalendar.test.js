/**
 * ZCal test suite — node:test, no dependencies. (was: ZenCalendar)
 *
 * Coverage:
 *  - time zone / DST-correct wall clock conversions
 *  - iCalendar round-trip (parse + build)
 *  - RRULE expansion (incl. COUNT / UNTIL / BYDAY)
 *  - unified view + conflict detection
 *  - natural-language intent resolution
 *  - slot finding respects working hours + conflicts
 *  - sandbox: proposals never touch providers until apply; permission gating
 *  - native data principle: writes route to the owning provider
 *  - encrypted cache round-trip
 *  - HTTP API smoke tests against a real server on an ephemeral port
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  zonedParts,
  zonedTimeToUtc,
  dateKey,
  startOfWeek,
  addDays,
  isValidTimeZone,
  overlaps,
  durationMinutes
} from '../server/util.js';
import { parseICS, buildICS, describeRecurrence } from '../server/ical.js';
import { expandEvent } from '../server/recurrence.js';
import { calendarService, parseQuery } from '../server/calendarService.js';
import { sandbox, SENSITIVE_CAPABILITIES, PERMISSION_LEVELS } from '../server/sandbox.js';
import { resolveIntent, findSlots, handleCommand, travelWarnings } from '../server/planner.js';
import { store } from '../server/store.js';
import { createServer } from '../server/index.js';

/** Anchor for demo-data assertions: Monday of the current week (seed data is relative).
 *  Must mirror seed.js `mondayOfThisWeek()` which computes Monday in Asia/Karachi
 *  (UTC+5), not UTC. Using UTC here breaks the UTC↔Karachi date-rollover window. */
const WEEK_ANCHOR = (() => {
  const TZ = 'Asia/Karachi';
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const shift = (weekday + 6) % 7; // Monday-first offset
  const utcMidnight = Date.UTC(Number(get('year')), Number(get('month')) - 1, Number(get('day')) - shift);
  return new Date(utcMidnight - 5 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString();
})();

/* ------------------------------------------------------------------ *
 * Time zones
 * ------------------------------------------------------------------ */

test('time zone: wall clock parts in a fixed-offset zone', () => {
  const instant = new Date('2025-04-14T04:00:00.000Z'); // 09:00 in Asia/Karachi (UTC+5)
  const p = zonedParts(instant, 'Asia/Karachi');
  assert.equal(p.year, 2025);
  assert.equal(p.month, 4);
  assert.equal(p.day, 14);
  assert.equal(p.hour, 9);
  assert.equal(p.minute, 0);
});

test('time zone: DST transition keeps 09:00 local across the switch', () => {
  // Europe/London: 2025-03-30 01:00 UTC is the spring-forward boundary.
  const before = zonedTimeToUtc(2025, 3, 29, 9, 0, 'Europe/London');
  const after = zonedTimeToUtc(2025, 3, 31, 9, 0, 'Europe/London');
  assert.equal(zonedParts(before, 'Europe/London').hour, 9);
  assert.equal(zonedParts(after, 'Europe/London').hour, 9);
  // 09:00 GMT = 09:00Z, 09:00 BST = 08:00Z
  assert.equal(before.toISOString(), '2025-03-29T09:00:00.000Z');
  assert.equal(after.toISOString(), '2025-03-31T08:00:00.000Z');
});

test('time zone: never silently re-zones an event', () => {
  const instant = new Date('2025-04-14T04:00:00.000Z');
  assert.equal(dateKey(instant, 'Asia/Karachi'), '2025-04-14');
  assert.equal(dateKey(instant, 'America/New_York'), '2025-04-14');
  assert.equal(dateKey(new Date('2025-04-14T23:30:00.000Z'), 'Asia/Karachi'), '2025-04-15');
});

test('time zone: validation rejects garbage', () => {
  assert.equal(isValidTimeZone('Asia/Karachi'), true);
  assert.equal(isValidTimeZone('Europe/London'), true);
  assert.equal(isValidTimeZone('Mars/Olympus'), false);
  assert.equal(isValidTimeZone(''), false);
  assert.equal(isValidTimeZone(null), false);
});

test('time: week starts on Monday', () => {
  const tz = 'Asia/Karachi';
  const wed = new Date('2025-04-16T06:00:00.000Z');
  const ws = startOfWeek(wed, tz);
  assert.equal(dateKey(ws, tz), '2025-04-14');
  assert.equal(zonedParts(addDays(ws, 6, tz), tz).weekday, 0); // Sunday
});

test('time: overlap + duration helpers', () => {
  assert.equal(overlaps('2025-01-01T09:00:00Z', '2025-01-01T10:00:00Z', '2025-01-01T09:30:00Z', '2025-01-01T11:00:00Z'), true);
  assert.equal(overlaps('2025-01-01T09:00:00Z', '2025-01-01T10:00:00Z', '2025-01-01T10:00:00Z', '2025-01-01T11:00:00Z'), false);
  assert.equal(durationMinutes({ start: '2025-01-01T09:00:00Z', end: '2025-01-01T10:45:00Z' }), 105);
});

/* ------------------------------------------------------------------ *
 * iCalendar
 * ------------------------------------------------------------------ */

const SAMPLE_ICS = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Test//EN\r\nBEGIN:VEVENT\r\nUID:test-1@example.com\r\nSUMMARY:Team Sync\r\nDESCRIPTION:Weekly sync\\nwith agenda\r\nLOCATION:Room 4B\r\nDTSTART;TZID=Asia/Karachi:20250414T090000\r\nDTEND;TZID=Asia/Karachi:20250414T093000\r\nORGANIZER;CN=Tahseen:mailto:tahseen@varizen.co\r\nATTENDEE;CN=John;PARTSTAT=ACCEPTED:mailto:john@varizen.co\r\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

test('ical: parses a VEVENT with time zone, attendee and recurrence', () => {
  const { events } = parseICS(SAMPLE_ICS);
  assert.equal(events.length, 1);
  const ev = events[0];
  assert.equal(ev.title, 'Team Sync');
  assert.equal(ev.location, 'Room 4B');
  assert.equal(ev.description, 'Weekly sync\nwith agenda');
  assert.equal(ev.timeZone, 'Asia/Karachi');
  assert.equal(ev.organizer.email, 'tahseen@varizen.co');
  assert.equal(ev.attendees.length, 1);
  assert.equal(ev.attendees[0].status, 'accepted');
  assert.deepEqual(ev.recurrence, ['RRULE:FREQ=WEEKLY;BYDAY=MO,WE']);
});

test('ical: escapes and round-trips text with commas and newlines', () => {
  const event = {
    id: 'e1',
    remoteId: 'e1',
    iCalUID: 'e1@local',
    title: 'Review: design, build & ship',
    description: 'Line one\nLine two',
    location: 'Room 1; floor 2',
    start: '2025-04-14T09:00:00.000Z',
    end: '2025-04-14T10:00:00.000Z',
    timeZone: 'UTC',
    attendees: [{ email: 'a@b.co', name: 'A Person', status: 'accepted' }],
    recurrence: [],
    reminders: [{ minutesBefore: 15 }]
  };
  const ics = buildICS(event);
  const { events } = parseICS(ics);
  assert.equal(events[0].title, 'Review: design, build & ship');
  assert.equal(events[0].description, 'Line one\nLine two');
  assert.equal(events[0].location, 'Room 1; floor 2');
  assert.equal(events[0].attendees[0].email, 'a@b.co');
});

test('ical: describes recurrence in human terms', () => {
  assert.equal(describeRecurrence('RRULE:FREQ=DAILY'), 'Every day');
  assert.equal(describeRecurrence('RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=5'), 'Every 2 weeks · 5 times');
  assert.equal(describeRecurrence(null), null);
});

/* ------------------------------------------------------------------ *
 * Recurrence
 * ------------------------------------------------------------------ */

test('recurrence: weekly BYDAY expands inside a window only', () => {
  const master = {
    id: 'r1',
    start: '2025-04-14T04:00:00.000Z', // Mon 09:00 Karachi
    end: '2025-04-14T04:30:00.000Z',
    timeZone: 'Asia/Karachi',
    recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO,WE'],
    exdates: []
  };
  const instances = expandEvent(master, '2025-04-14T00:00:00.000Z', '2025-04-21T00:00:00.000Z');
  // Mon 14, Wed 16, Mon 21(exclusive of window end) → 2
  assert.equal(instances.length, 2);
  assert.equal(new Date(instances[0].start).toISOString(), '2025-04-14T04:00:00.000Z');
  assert.equal(new Date(instances[1].start).toISOString(), '2025-04-16T04:00:00.000Z');
});

test('recurrence: COUNT is honoured', () => {
  const master = {
    id: 'r2',
    start: '2025-04-14T04:00:00.000Z',
    end: '2025-04-14T05:00:00.000Z',
    timeZone: 'Asia/Karachi',
    recurrence: ['RRULE:FREQ=DAILY;COUNT=3'],
    exdates: []
  };
  const instances = expandEvent(master, '2025-04-01T00:00:00.000Z', '2025-06-01T00:00:00.000Z');
  assert.equal(instances.length, 3);
});

test('recurrence: UNTIL stops expansion (inclusive of the UNTIL instant)', () => {
  const master = {
    id: 'r3',
    start: '2025-04-14T04:00:00.000Z',
    end: '2025-04-14T05:00:00.000Z',
    timeZone: 'Asia/Karachi',
    recurrence: ['RRULE:FREQ=DAILY;UNTIL=20250416T000000Z'],
    exdates: []
  };
  const instances = expandEvent(master, '2025-04-01T00:00:00.000Z', '2025-06-01T00:00:00.000Z');
  // 14th and 15th fall before UNTIL; the 16th 04:00 occurrence is after it.
  assert.equal(instances.length, 2);
});

test('recurrence: a non-recurring event appears once', () => {
  const master = {
    id: 'r4',
    start: '2025-04-14T04:00:00.000Z',
    end: '2025-04-14T05:00:00.000Z',
    timeZone: 'Asia/Karachi',
    recurrence: [],
    exdates: []
  };
  assert.equal(expandEvent(master, '2025-04-14T00:00:00.000Z', '2025-04-15T00:00:00.000Z').length, 1);
  assert.equal(expandEvent(master, '2025-04-15T00:00:00.000Z', '2025-04-20T00:00:00.000Z').length, 0);
});

/* ------------------------------------------------------------------ *
 * Unified view
 * ------------------------------------------------------------------ */

test('calendar: unified week view merges providers', () => {
  const view = calendarService.getView({ view: 'week', anchor: WEEK_ANCHOR, timeZone: 'Asia/Karachi' });
  assert.equal(view.days.length, 7);
  const providers = new Set(view.events.map((e) => e.provider));
  assert.ok(providers.size >= 3, `expected multiple providers, got ${[...providers].join(',')}`);
  assert.ok(view.events.length >= 8);
});

test('calendar: conflict detection finds the deliberate overlap', () => {
  const view = calendarService.getView({ view: 'week', anchor: WEEK_ANCHOR, timeZone: 'Asia/Karachi' });
  const conflicts = calendarService.detectConflicts(view.events);
  assert.ok(conflicts.length >= 1);
  assert.ok(conflicts.every((c) => new Date(c.overlapStart) < new Date(c.overlapEnd)));
});

test('calendar: free/busy gaps never overlap busy blocks', () => {
  const day = calendarService.getAvailability({
    start: WEEK_ANCHOR,
    end: addDays(new Date(WEEK_ANCHOR), 1, 'Asia/Karachi').toISOString(),
    timeZone: 'Asia/Karachi'
  });
  for (const gap of day.free) {
    for (const b of day.busy) {
      assert.equal(overlaps(gap.start, gap.end, b.start, b.end), false, 'gap must not overlap a busy block');
    }
  }
});

test('calendar: hidden calendars are excluded from the timeline', () => {
  const target = store.state.calendars[0];
  calendarService.setCalendarVisibility(target.id, false);
  const view = calendarService.getView({ view: 'week', anchor: WEEK_ANCHOR, timeZone: 'Asia/Karachi' });
  assert.equal(view.events.some((e) => e.calendarId === target.id), false);
  calendarService.setCalendarVisibility(target.id, true);
  const restored = calendarService.getView({ view: 'week', anchor: WEEK_ANCHOR, timeZone: 'Asia/Karachi' });
  assert.equal(restored.events.some((e) => e.calendarId === target.id), true);
});

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

test('search: attendee filter', () => {
  const res = calendarService.search('meetings with John', { timeZone: 'Asia/Karachi' });
  assert.ok(res.count >= 1);
  assert.ok(res.events.every((e) => (e.attendees || []).some((a) => `${a.name} ${a.email}`.toLowerCase().includes('john'))));
});

test('search: duration constraint', () => {
  const res = calendarService.search('meetings longer than 2 hours', { timeZone: 'Asia/Karachi' });
  assert.ok(res.events.every((e) => e.durationMinutes >= 120));
});

test('search: organizer filter', () => {
  const res = calendarService.search('meetings where I am the organizer', { timeZone: 'Asia/Karachi' });
  assert.ok(res.events.every((e) => (e.organizer?.email || '').includes('@')));
});

test('search: query parser understands windows and durations', () => {
  const p = parseQuery('all Varizen meetings next week longer than 90 minutes', 'Asia/Karachi');
  assert.ok(p.window);
  assert.equal(p.minDuration, 90);
  assert.ok(p.terms.some((t) => t.key === 'varizen'));
});

/* ------------------------------------------------------------------ *
 * Intent + slots
 * ------------------------------------------------------------------ */

test('intent: resolves scheduling, summarising, focus and simulate', () => {
  assert.equal(resolveIntent('Find a free time with John next week').action, 'schedule');
  assert.equal(resolveIntent("What's my day looking like?").action, 'summarize');
  assert.equal(resolveIntent('Handle my calendar').action, 'agent-mode');
  assert.equal(resolveIntent('Give me three hours of uninterrupted work this week').action, 'focus-time');
  assert.equal(resolveIntent('What if I add a 2-hour meeting tomorrow?').action, 'simulate');
  assert.equal(resolveIntent('Find all meetings related to Varizen').action, 'search');
});

test('intent: extracts people, duration and project', () => {
  const i = resolveIntent('Schedule a 45-minute meeting with Sarah and John next week');
  assert.equal(i.durationMinutes, 45);
  assert.ok(i.people.some((p) => p.name === 'John'));
  assert.equal(i.windowLabel, 'next week');
});

test('slots: never returns a slot overlapping a busy event', () => {
  const res = findSlots({
    durationMinutes: 45,
    windowStart: WEEK_ANCHOR,
    windowEnd: addDays(new Date(WEEK_ANCHOR), 7, 'Asia/Karachi').toISOString(),
    timeZone: 'Asia/Karachi'
  });
  assert.ok(res.options.length > 0);
  const { events } = calendarService.getTimeline({
    start: WEEK_ANCHOR,
    end: addDays(new Date(WEEK_ANCHOR), 7, 'Asia/Karachi').toISOString(),
    timeZone: 'Asia/Karachi'
  });
  const busy = events.filter((e) => e.availability !== 'free');
  for (const opt of res.options) {
    for (const b of busy) {
      assert.equal(overlaps(opt.start, opt.end, b.start, b.end), false, `slot ${opt.start} overlaps ${b.title}`);
    }
  }
});

test('slots: stays inside working hours', () => {
  const res = findSlots({
    durationMinutes: 60,
    windowStart: WEEK_ANCHOR,
    windowEnd: addDays(new Date(WEEK_ANCHOR), 7, 'Asia/Karachi').toISOString(),
    timeZone: 'Asia/Karachi'
  });
  for (const opt of res.options) {
    const p = zonedParts(opt.start, 'Asia/Karachi');
    assert.ok(p.hour >= 9 && p.hour < 18, `slot at ${p.hour}:00 is outside working hours`);
  }
});

test('slots: attendee time zones are surfaced, never fabricated', () => {
  const res = findSlots({
    durationMinutes: 30,
    windowStart: WEEK_ANCHOR,
    windowEnd: addDays(new Date(WEEK_ANCHOR), 7, 'Asia/Karachi').toISOString(),
    timeZone: 'Asia/Karachi',
    attendeeTimeZones: ['Europe/London']
  });
  for (const opt of res.options) {
    const view = opt.attendeeView.find((v) => v.timeZone === 'Europe/London');
    assert.ok(view);
    assert.ok(view.label.includes('–'));
  }
});

/* ------------------------------------------------------------------ *
 * Sandbox + permissions
 * ------------------------------------------------------------------ */

test('sandbox: creating a proposal writes nothing to providers', () => {
  const eventsBefore = store.state.events.length;
  const proposal = sandbox.create({
    intent: 'Test move',
    operations: [{ type: 'create', title: 'Sandbox only', start: '2025-04-15T05:00:00.000Z', end: '2025-04-15T06:00:00.000Z' }],
    requestedBy: 'test'
  });
  assert.equal(store.state.events.length, eventsBefore, 'no event may be written before apply');
  assert.equal(proposal.status, 'pending');
  assert.ok(proposal.preview.stats.operations >= 1);
  sandbox.discard(proposal.id, { actor: 'test' });
});

test('sandbox: apply is blocked without the Act capability', async () => {
  store.state.permissionGrants = [];
  const proposal = sandbox.create({
    intent: 'Needs permission',
    operations: [{ type: 'create', title: 'x', start: '2025-04-15T05:00:00.000Z', end: '2025-04-15T06:00:00.000Z' }]
  });
  await assert.rejects(sandbox.apply(proposal.id, { actor: 'test' }), /Permission required|Act/);
  sandbox.discard(proposal.id, { actor: 'test' });
});

test('sandbox: send:invitation and cancel are flagged sensitive', () => {
  assert.ok(SENSITIVE_CAPABILITIES.has('send:invitation'));
  assert.ok(SENSITIVE_CAPABILITIES.has('send:communication'));
  assert.ok(SENSITIVE_CAPABILITIES.has('cancel'));
  assert.ok(!SENSITIVE_CAPABILITIES.has('read:events'));
});

test('sandbox: grant + revoke round-trip', () => {
  store.state.permissionGrants = [];
  sandbox.grant('read', { actor: 'test' });
  assert.equal(sandbox.hasCapability('read:events'), true);
  assert.equal(sandbox.hasCapability('modify'), false);
  sandbox.revoke('read:events', { actor: 'test' });
  assert.equal(sandbox.hasCapability('read:events'), false);
  store.state.permissionGrants = [];
});

test('sandbox: permission levels include the expected capabilities', () => {
  assert.ok(PERMISSION_LEVELS.read.includes('read:availability'));
  assert.ok(PERMISSION_LEVELS.prepare.includes('modify'));
  assert.ok(PERMISSION_LEVELS.act.includes('send:invitation'));
  assert.ok(PERMISSION_LEVELS.communicate.includes('send:communication'));
});

test('sandbox: simulation never writes and reports consequences', () => {
  const before = store.state.events.length;
  const sim = sandbox.simulate({
    intent: 'What if I add a meeting',
    operations: [{ type: 'create', title: 'Sim', start: '2025-04-16T05:00:00.000Z', end: '2025-04-16T07:00:00.000Z' }]
  });
  assert.equal(store.state.events.length, before);
  assert.equal(sim.proposal.simulation, true);
  assert.ok(Array.isArray(sim.consequences.lines));
  sandbox.discard(sim.proposal.id, { actor: 'test' });
});

test('sandbox: applying a create writes through to the native calendar', async () => {
  store.state.permissionGrants = [];
  sandbox.grant('act', { actor: 'test' });
  const calendar = store.state.calendars.find((c) => c.visible !== false && !c.readOnly);
  const proposal = sandbox.create({
    intent: 'Create a real event',
    operations: [{
      type: 'create',
      calendarId: calendar.id,
      title: 'Applied by test',
      start: '2025-04-17T05:00:00.000Z',
      end: '2025-04-17T06:00:00.000Z'
    }],
    requestedBy: 'test'
  });
  const res = await sandbox.apply(proposal.id, { actor: 'test' });
  assert.equal(res.results.every((r) => r.ok), true);
  const created = store.state.events.find((e) => e.title === 'Applied by test');
  assert.ok(created, 'event should exist after apply');
  assert.equal(created.calendarId, calendar.id);
  assert.equal(created.provider, calendar.provider);
  // cleanup
  await calendarService.deleteEvent(created.id, { actor: 'test' });
  store.state.permissionGrants = [];
});

/* ------------------------------------------------------------------ *
 * Native data principle
 * ------------------------------------------------------------------ */

test('native data: created events keep provider + remote id + calendar', async () => {
  const calendar = store.state.calendars.find((c) => c.provider === 'microsoft' || c.provider === 'google');
  const created = await calendarService.createEvent({
    calendarId: calendar.id,
    title: 'Native check',
    start: '2025-04-18T05:00:00.000Z',
    end: '2025-04-18T06:00:00.000Z'
  }, { actor: 'test' });
  assert.equal(created.provider, calendar.provider);
  assert.equal(created.calendarId, calendar.id);
  assert.equal(created.accountId, calendar.accountId);
  assert.ok(created.remoteId);
  assert.ok(created.iCalUID);
  await calendarService.deleteEvent(created.id, { actor: 'test' });
});

test('native data: read-only calendars reject writes', async () => {
  const calendar = store.state.calendars[0];
  const original = calendar.readOnly;
  calendar.readOnly = true;
  await assert.rejects(
    calendarService.createEvent({
      calendarId: calendar.id,
      title: 'Should fail',
      start: '2025-04-18T05:00:00.000Z',
      end: '2025-04-18T06:00:00.000Z'
    }, { actor: 'test' }),
    /read-only/
  );
  calendar.readOnly = original;
});

test('native data: invalid event input is rejected', async () => {
  const calendar = store.state.calendars[0];
  await assert.rejects(
    calendarService.createEvent({ calendarId: calendar.id, title: '', start: '', end: '' }),
    /title is required|start and end/
  );
  await assert.rejects(
    calendarService.createEvent({
      calendarId: calendar.id,
      title: 'Bad range',
      start: '2025-04-18T06:00:00.000Z',
      end: '2025-04-18T05:00:00.000Z'
    }),
    /end must be after start/
  );
});

/* ------------------------------------------------------------------ *
 * Planner commands
 * ------------------------------------------------------------------ */

test('planner: day summary reports events and conflicts', () => {
  const res = handleCommand("What's my day looking like?");
  assert.equal(res.intent.action, 'summarize');
  assert.ok('headline' in res.result);
  assert.ok(Array.isArray(res.result.events));
});

test('planner: agent analysis produces actionable groups', () => {
  const res = handleCommand('Handle my calendar');
  assert.equal(res.intent.action, 'agent-mode');
  assert.ok('needsMe' in res.result);
  assert.ok('aiCanHandle' in res.result);
  assert.ok('conflicts' in res.result);
});

test('planner: travel warnings only use the configured buffer', () => {
  const warnings = travelWarnings([
    { id: 'a', title: 'A', start: '2025-04-14T04:00:00Z', end: '2025-04-14T05:00:00Z', location: 'Office A', availability: 'busy' },
    { id: 'b', title: 'B', start: '2025-04-14T05:05:00Z', end: '2025-04-14T06:00:00Z', location: 'Office B', availability: 'busy' }
  ]);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].bufferMinutes, store.state.settings.travelBufferMinutes);
  assert.match(warnings[0].estimateSource, /never|no travel time/i);
});

test('planner: virtual meetings never raise travel warnings', () => {
  const warnings = travelWarnings([
    { id: 'a', title: 'A', start: '2025-04-14T04:00:00Z', end: '2025-04-14T05:00:00Z', location: 'Zoom', availability: 'busy' },
    { id: 'b', title: 'B', start: '2025-04-14T05:05:00Z', end: '2025-04-14T06:00:00Z', location: 'Google Meet', availability: 'busy' }
  ]);
  assert.equal(warnings.length, 0);
});

/* ------------------------------------------------------------------ *
 * Encrypted cache
 * ------------------------------------------------------------------ */

test('store: encrypted cache round-trip preserves state', () => {
  const marker = `test-${Date.now()}`;
  store.state.settings.__marker = marker;
  store.flush();
  const raw = store.stats();
  assert.ok(raw.cacheBytes > 0);
  assert.equal(raw.encrypted, true);
  assert.equal(raw.cipher, 'AES-256-GCM');
  assert.equal(store.state.settings.__marker, marker);
  delete store.state.settings.__marker;
});

test('store: cache metadata never contains provider secrets', () => {
  const stats = store.stats();
  assert.equal(typeof stats.cacheFile, 'string');
  assert.equal(JSON.stringify(stats).includes('accessToken'), false);
});

/* ------------------------------------------------------------------ *
 * Privacy
 * ------------------------------------------------------------------ */

test('privacy: report lists accounts, cache and AI access', () => {
  const report = calendarService.privacyReport();
  assert.ok(Array.isArray(report.accounts));
  assert.ok(report.cache.encrypted);
  assert.ok('aiAccess' in report);
  assert.ok('browserAccess' in report);
  assert.ok(Array.isArray(report.aiActions));
});

test('privacy: revoke all AI access clears grants', () => {
  sandbox.grant('act', { actor: 'test' });
  assert.ok(calendarService.privacyReport().aiAccess.permissions.length > 0);
  const report = calendarService.revokeAllAIAccess({ actor: 'test' });
  assert.equal(report.aiAccess.permissions.length, 0);
  assert.equal(report.aiAccess.agentMode, false);
});

/* ------------------------------------------------------------------ *
 * HTTP API
 * ------------------------------------------------------------------ */

test('http: bootstrap, view, search, sandbox and privacy endpoints', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${base}/api/health`).then((r) => r.json());
    assert.equal(health.status, 'ok');

    const boot = await fetch(`${base}/api/bootstrap`).then((r) => r.json());
    assert.ok(boot.calendars.length >= 5);
    assert.ok(boot.providers.length >= 5);
    assert.ok(boot.capabilities['read:events']);

    const view = await fetch(`${base}/api/view?view=week&anchor=${WEEK_ANCHOR}`).then((r) => r.json());
    assert.equal(view.days.length, 7);
    assert.ok(view.events.length >= 8);

    const search = await fetch(`${base}/api/search?q=${encodeURIComponent('meetings with John')}`).then((r) => r.json());
    assert.ok(search.count >= 1);

    const agent = await fetch(`${base}/api/ai/agent`).then((r) => r.json());
    assert.ok('needsMe' in agent);

    const plan = await fetch(`${base}/api/ai/plan`).then((r) => r.json());
    assert.ok(Array.isArray(plan.suggestions));

    const proposal = await fetch(`${base}/api/sandbox/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'API simulation',
        operations: [{ type: 'create', title: 'API sim', start: '2025-04-15T05:00:00.000Z', end: '2025-04-15T06:00:00.000Z' }]
      })
    }).then((r) => r.json());
    assert.equal(proposal.proposal.simulation, true);

    const privacy = await fetch(`${base}/api/privacy`).then((r) => r.json());
    assert.ok(privacy.cache.encrypted);

    const activity = await fetch(`${base}/api/activity`).then((r) => r.json());
    assert.ok(Array.isArray(activity));

    const ics = await fetch(`${base}/api/export/ics`).then((r) => r.json());
    assert.match(ics.ics, /BEGIN:VCALENDAR/);

    const blackhole = await fetch(`${base}/api/no-such-route`).then((r) => r.status);
    assert.equal(blackhole, 404);

    const badJson = await fetch(`${base}/api/sandbox/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json'
    }).then((r) => r.status);
    assert.equal(badJson, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('http: cross-origin state changes are rejected', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/sandbox/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
      body: JSON.stringify({ intent: 'x', operations: [] })
    });
    assert.equal(res.status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('http: security headers are present', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`);
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp.includes("default-src 'self'"));
    assert.ok(csp.includes("frame-ancestors 'none'"));
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
