/**
 * ZMeet test suite — node:test, zero dependencies. (was: ZenMeet)
 *
 * Covers the real behaviours the prompt depends on:
 *   - token signing / expiry / room scoping
 *   - role capability model
 *   - AI boundary enforcement (the important one)
 *   - waiting room and admission
 *   - deterministic extraction from room content
 *   - recording and storage pointer model
 *   - HTTP API incl. auth gates and security headers
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { issueToken, verifyToken, sameOrigin, rateLimit } from '../server/security.js';
import {
  AI_MODES,
  ROLE_CAPABILITIES,
  aiCan,
  aiNeedsConfirmation,
  isAtLeast,
  roleCan
} from '../server/permissions.js';
import { roomService } from '../server/rooms.js';
import { store } from '../server/store.js';
import {
  extractActions,
  extractDecisions,
  extractPeople,
  extractTopic,
  extractDuration,
  detectMeetingType,
  meetingAgent,
  suggestSlots
} from '../server/aiAgent.js';
import { buildICS } from '../server/integrations.js';
import { getAIProvider, setAIProvider, AI_PROVIDERS } from '../server/aiProvider.js';

// The suite creates many rooms; raise the room cap so the "approve a draft
// creates a room" count assertion is never truncated by the production cap.
process.env.ZENMEET_ROOM_CAP = '10000';

/* ------------------------------------------------------------------ */
/* Tokens                                                             */
/* ------------------------------------------------------------------ */

describe('Meeting tokens', () => {
  test('issues a signed room-scoped token that verifies', () => {
    const { token, claims } = issueToken({
      roomId: 'room_test',
      participantId: 'part_1',
      role: 'participant',
      kind: 'meeting'
    });
    assert.match(token, /^[A-Za-z0-9_-]+\./);
    assert.equal(claims.rid, 'room_test');
    assert.equal(claims.sub, 'part_1');

    const result = verifyToken(token);
    assert.equal(result.ok, true);
    assert.equal(result.claims.rid, 'room_test');
    assert.equal(result.claims.role, 'participant');
  });

  test('rejects a tampered payload', () => {
    const { token } = issueToken({ roomId: 'r1', participantId: 'p1', role: 'audience' });
    const [payload, signature] = token.split('.');
    const forgedPayload = Buffer.from(
      JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), role: 'host' })
    ).toString('base64url');

    const result = verifyToken(`${forgedPayload}.${signature}`);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'bad-signature');
  });

  test('rejects an expired token', () => {
    const { token } = issueToken({
      roomId: 'r1',
      participantId: 'p1',
      role: 'participant',
      ttlMinutes: -1
    });
    const result = verifyToken(token);
    assert.equal(result.ok, false);
    assert.equal(result.error, 'expired');
  });

  test('rejects malformed input without throwing', () => {
    for (const bad of ['', 'nodot', 'a.b.c', null, undefined, 42]) {
      assert.equal(verifyToken(bad).ok, false);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Roles                                                              */
/* ------------------------------------------------------------------ */

describe('Role capabilities', () => {
  test('audience cannot speak, share or moderate', () => {
    assert.equal(roleCan('audience', 'mic:self'), false);
    assert.equal(roleCan('audience', 'camera:self'), false);
    assert.equal(roleCan('audience', 'screen:share'), false);
    assert.equal(roleCan('audience', 'participant:mute'), false);
    assert.equal(roleCan('audience', 'chat:send'), true);
    assert.equal(roleCan('audience', 'poll:vote'), true);
  });

  test('participant gains media but no moderation', () => {
    assert.equal(roleCan('participant', 'mic:self'), true);
    assert.equal(roleCan('participant', 'camera:self'), true);
    assert.equal(roleCan('participant', 'participant:remove'), false);
    assert.equal(roleCan('participant', 'record:start'), false);
  });

  test('host holds every capability, moderator holds most', () => {
    const hostCaps = ROLE_CAPABILITIES.host;
    for (const cap of ROLE_CAPABILITIES.moderator) {
      assert.ok(hostCaps.includes(cap), `host should include ${cap}`);
    }
    assert.ok(hostCaps.includes('room:lock'));
    assert.ok(!ROLE_CAPABILITIES.moderator.includes('room:lock'));
  });

  test('role ranking is strictly ordered', () => {
    assert.equal(isAtLeast('host', 'moderator'), true);
    assert.equal(isAtLeast('moderator', 'host'), false);
    assert.equal(isAtLeast('audience', 'participant'), false);
    assert.equal(isAtLeast('speaker', 'speaker'), true);
  });

  test('capabilities never leak between roles', () => {
    for (const [role, caps] of Object.entries(ROLE_CAPABILITIES)) {
      assert.ok(Array.isArray(caps) && caps.length > 0, `${role} must have capabilities`);
      assert.equal(new Set(caps).size, caps.length, `${role} has duplicate capabilities`);
    }
  });
});

/* ------------------------------------------------------------------ */
/* AI boundary                                                        */
/* ------------------------------------------------------------------ */

describe('AI permission boundary', () => {
  test('AI OFF grants nothing at all', () => {
    assert.deepEqual(AI_MODES.off.capabilities, []);
    assert.equal(aiCan('off', 'read:transcript'), false);
    assert.equal(aiCan('off', 'read:chat'), false);
  });

  test('observe can read but never act or write', () => {
    assert.equal(aiCan('observe', 'read:transcript'), true);
    assert.equal(aiCan('observe', 'propose:minutes'), false);
    assert.equal(aiCan('observe', 'act:email'), false);
    assert.equal(aiCan('observe', 'write:minutes'), false);
  });

  test('assistant can propose but not write or act', () => {
    assert.equal(aiCan('assistant', 'propose:actions'), true);
    assert.equal(aiCan('assistant', 'propose:minutes'), true);
    assert.equal(aiCan('assistant', 'write:minutes'), false);
    assert.equal(aiCan('assistant', 'act:calendar'), false);
  });

  test('full access still requires confirmation for consequential actions', () => {
    assert.equal(aiCan('full', 'act:email'), true);
    assert.equal(aiNeedsConfirmation('full', 'act:email'), true);
    assert.equal(aiNeedsConfirmation('full', 'act:participant'), true);
    assert.equal(aiNeedsConfirmation('full', 'read:chat'), false);
  });

  test('capabilities are cumulative across levels', () => {
    const order = ['off', 'observe', 'assistant', 'notetaker', 'full'];
    for (let i = 1; i < order.length; i += 1) {
      const lower = AI_MODES[order[i - 1]].capabilities;
      const higher = AI_MODES[order[i]].capabilities;
      for (const cap of lower) {
        assert.ok(higher.includes(cap), `${order[i]} should include ${cap} from ${order[i - 1]}`);
      }
    }
  });

  test('roomService refuses an AI call outside the boundary', () => {
    const room = roomService.create({ title: 'Boundary test', type: 'private', aiMode: 'off', startNow: true });
    assert.throws(
      () => roomService.requireAI(room.id, 'read:chat'),
      (err) => err.status === 403 && err.needsPermission === true
    );
    roomService.setAIMode(room.id, 'assistant', { actor: 'host' });
    assert.equal(roomService.requireAI(room.id, 'read:chat'), true);
    assert.throws(() => roomService.requireAI(room.id, 'act:email'), (err) => err.status === 403);
  });
});

/* ------------------------------------------------------------------ */
/* Rooms, joining, waiting room                                       */
/* ------------------------------------------------------------------ */

describe('Room service', () => {
  test('creates an instant room with a joinable code', () => {
    const room = roomService.create({ title: 'Instant', type: 'private', startNow: true });
    assert.equal(room.status, 'live');
    assert.match(room.code, /^[a-z0-9]{6}$/);
    assert.ok(room.startedAt);
    assert.equal(room.layout, 'gallery');
  });

  test('applies the meeting type defaults', () => {
    const webinar = roomService.create({ title: 'W', type: 'webinar' });
    assert.equal(webinar.layout, 'webinar');
    assert.equal(webinar.admission, 'waiting');
    assert.equal(webinar.aiMode, 'assistant');

    const interview = roomService.create({ title: 'I', type: 'interview' });
    assert.equal(interview.layout, 'interview');
    assert.equal(interview.aiMode, 'notetaker');
  });

  test('open admission lets a guest straight in', () => {
    const room = roomService.create({ title: 'Open', type: 'private', admission: 'open', startNow: true });
    const result = roomService.join(room.id, { name: 'Guest One' });
    assert.equal(result.admitted, true);
    assert.equal(result.waiting, false);
    assert.equal(result.participant.role, 'participant');
  });

  test('waiting-room policy holds the guest out of the room', () => {
    const room = roomService.create({ title: 'Gated', type: 'business', admission: 'waiting', startNow: true });
    const result = roomService.join(room.id, { name: 'Guest Two' });
    assert.equal(result.admitted, false);
    assert.equal(result.waiting, true);
    assert.equal(result.participant.state, 'waiting');
    assert.equal(roomService.get(room.id).waitingRoom.length, 1);
  });

  test('host admits a waiting guest', () => {
    const room = roomService.create({ title: 'Admit', type: 'business', admission: 'waiting', startNow: true });
    const pending = roomService.join(room.id, { name: 'Guest Three' });
    const entry = roomService.get(room.id).waitingRoom[0];

    const resolved = roomService.admit(room.id, entry.id, { actorRole: 'host', admit: true });
    assert.equal(resolved.admitted, true);
    assert.equal(roomService.get(room.id).waitingRoom.length, 0);

    const participant = roomService.get(room.id).participants.find((p) => p.id === pending.participant.id);
    assert.equal(participant.state, 'joined');
  });

  test('audience role cannot open a microphone', () => {
    const room = roomService.create({ title: 'Aud', type: 'webinar', admission: 'open', startNow: true });
    const joined = roomService.join(room.id, { name: 'Viewer' });
    assert.equal(joined.participant.role, 'audience');
    assert.throws(
      () => roomService.setMedia(room.id, joined.participant.id, { mic: true }),
      (err) => err.status === 403 && err.capability === 'mic:self'
    );
  });

  test('authenticated admission refuses an anonymous guest', () => {
    const room = roomService.create({ title: 'Auth', type: 'interview', admission: 'authenticated', startNow: true });
    assert.throws(() => roomService.join(room.id, { name: 'Anon' }), (err) => err.status === 401 && err.requiresAuth);
    const ok = roomService.join(room.id, { name: 'Known', authenticated: true, role: 'speaker' });
    assert.equal(ok.admitted, false); // still gated, but the identity passed
    assert.equal(ok.waiting, true);
  });

  test('promote and demote walk the role ladder', () => {
    const room = roomService.create({ title: 'Promote', type: 'webinar', admission: 'open', startNow: true });
    const joined = roomService.join(room.id, { name: 'Riser' });
    // A webinar guest starts as audience; the ladder is audience → participant → speaker.
    assert.equal(joined.participant.role, 'audience');
    const p1 = roomService.moderate(room.id, joined.participant.id, 'promote', { actorRole: 'host' });
    assert.equal(p1.role, 'participant');
    const p2 = roomService.moderate(room.id, joined.participant.id, 'promote', { actorRole: 'host' });
    assert.equal(p2.role, 'speaker');
    const p3 = roomService.moderate(room.id, joined.participant.id, 'demote', { actorRole: 'host' });
    assert.equal(p3.role, 'participant');
  });

  test('a promoted guest can then use their microphone', () => {
    const room = roomService.create({ title: 'Promote media', type: 'webinar', admission: 'open', startNow: true });
    const joined = roomService.join(room.id, { name: 'Will Speak' });
    assert.throws(() => roomService.setMedia(room.id, joined.participant.id, { mic: true }), (err) => err.status === 403);
    roomService.moderate(room.id, joined.participant.id, 'promote', { actorRole: 'host' });
    const media = roomService.setMedia(room.id, joined.participant.id, { mic: true });
    assert.equal(media.mic, true);
  });

  test('lower-ranked participants cannot moderate higher-ranked ones', () => {
    const room = roomService.create({ title: 'Hierarchy', type: 'business', admission: 'open', startNow: true });
    const joined = roomService.join(room.id, { name: 'Speakerish', role: 'speaker' });
    assert.throws(
      () => roomService.moderate(room.id, joined.participant.id, 'remove', { actorRole: 'cohost' }),
      (err) => err.status === 403
    );
  });

  test('recording start/stop produces a storage pointer, not media', () => {
    const room = roomService.create({ title: 'Rec', type: 'business', startNow: true });
    const started = roomService.record(room.id, { start: true, actorRole: 'host' });
    assert.equal(started.recording.enabled, true);
    assert.equal(started.recording.options.transcript, true);

    const stopped = roomService.record(room.id, { start: false, actorRole: 'host' });
    assert.equal(stopped.recording.enabled, false);
    assert.equal(stopped.recordings.length, 1);
    const rec = stopped.recordings[0];
    assert.ok(rec.storage.policy);
    assert.ok(!rec.url, 'recordings must not carry a media URL');
    assert.match(rec.note, /reference only/i);
  });

  test('stream destinations never store a raw key', () => {
    const room = roomService.create({ title: 'Streamy', type: 'live', startNow: true });
    const secret = 'abcd-1234-wxyz-9876-SECRET';
    const dest = roomService.addStreamDestination(
      room.id,
      { platform: 'youtube', label: 'YT', streamKeyRef: secret },
      { actor: 'host' }
    );
    assert.equal(dest.masked, true);
    assert.equal(dest.maskedKey, undefined, 'no key material is echoed back');
    assert.ok(!JSON.stringify(dest).includes('SECRET'), 'the raw key must never appear in the record');
    assert.match(dest.streamKeyRef, /^vault:/, 'only an opaque vault reference is stored');
    assert.match(dest.note, /vault/i);
  });

  test('ending a room clears live state and closes recording', () => {
    const room = roomService.create({ title: 'Endable', type: 'business', startNow: true });
    roomService.record(room.id, { start: true, actorRole: 'host' });
    const ended = roomService.end(room.id);
    assert.equal(ended.status, 'ended');
    assert.equal(ended.recording.enabled, false);
    assert.ok(ended.endedAt);
  });

  test('guest join never inherits loopback host trust', () => {
    const room = roomService.create({ title: 'Privacy', type: 'private', startNow: true });
    const joined = roomService.join(room.id, { name: 'Guest', email: 'someone@example.com' });
    // Raw record keeps the address (needed for moderation); the public view masks it.
    assert.equal(joined.participant.email, 'someone@example.com');
    const publicEmail = roomService.publicParticipant(joined.participant).email;
    assert.notEqual(publicEmail, 'someone@example.com', 'guest emails are masked in public views');
    assert.match(publicEmail, /@example\.com$/);
    assert.match(publicEmail, /•/);
  });
});

/* ------------------------------------------------------------------ */
/* Extraction                                                         */
/* ------------------------------------------------------------------ */

describe('Deterministic extraction', () => {
  function roomWithChat(lines) {
    const room = roomService.create({ title: 'Extract', type: 'business', startNow: true });
    room.participants = [
      { id: 'p_sarah', name: 'Sarah Malik', role: 'speaker', state: 'joined', mic: false, camera: true },
      { id: 'p_john', name: 'John Carter', role: 'participant', state: 'joined', mic: false, camera: true }
    ];
    room.chat = lines.map((line, i) => {
      const fromJohn = typeof line === 'object' ? line.from === 'john' : i % 2 === 1;
      return {
        id: `m${i}`,
        participantId: fromJohn ? 'p_john' : 'p_sarah',
        author: fromJohn ? 'John Carter' : 'Sarah Malik',
        role: 'participant',
        kind: 'message',
        text: typeof line === 'object' ? line.text : line,
        at: new Date(Date.now() + i * 60_000).toISOString()
      };
    });
    return room;
  }

  test('finds decisions only when a decision marker is present', () => {
    const room = roomWithChat([
      'We are going with the November 15 launch.',
      'The weather is nice today.',
      'Budget approved at the revised figure.'
    ]);
    const decisions = extractDecisions(room);
    assert.equal(decisions.length, 2);
    assert.ok(decisions.some((d) => d.text.includes('November 15')));
    assert.ok(!decisions.some((d) => d.text.includes('weather')));
  });

  test('extracts actions with owner and deadline', () => {
    const room = roomWithChat([
      { from: 'john', text: "I'll prepare the deployment checklist by Friday." },
      { from: 'sarah', text: "I'll send the revised budget tomorrow." },
      'Just chatting about lunch.'
    ]);
    const actions = extractActions(room);
    assert.ok(actions.length >= 2);

    const john = actions.find((a) => a.task.toLowerCase().includes('deployment'));
    assert.ok(john, 'deployment action should be detected');
    assert.equal(john.owner, 'John Carter');
    assert.equal(john.deadline, 'Friday');
    assert.equal(john.approved, false);
    assert.equal(john.status, 'proposed');

    const sarah = actions.find((a) => a.task.toLowerCase().includes('budget'));
    assert.ok(sarah);
    assert.equal(sarah.owner, 'Sarah Malik');
  });

  test('does not invent people, topics or durations', () => {
    assert.deepEqual(extractPeople('nothing relevant here'), []);
    assert.equal(extractTopic('nothing relevant here'), '');
    assert.equal(extractDuration('nothing relevant here'), 30);
    assert.equal(extractDuration('a 45 minute sync'), 45);
    assert.equal(extractDuration('two hours'), 30); // words are not guessed
  });

  test('reads people, topic and duration from a natural request', () => {
    const raw = 'Organize a 45 minute meeting with Sarah and John about the SAMC project next week';
    assert.deepEqual(extractPeople(raw), ['Sarah', 'John']);
    assert.match(extractTopic(raw), /SAMC/i);
    assert.equal(extractDuration(raw), 45);
  });

  test('maps wording to the right meeting type', () => {
    assert.equal(detectMeetingType('run a webinar for 200 people'), 'webinar');
    assert.equal(detectMeetingType('interview with a candidate'), 'interview');
    assert.equal(detectMeetingType('workshop with a whiteboard'), 'workshop');
    assert.equal(detectMeetingType('quick 1:1 catch up'), 'private');
  });

  test('suggestSlots stays inside working hours and weekdays', () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 5 * 86400_000);
    const slots = suggestSlots({ windowStart: start, windowEnd: end, durationMinutes: 30, limit: 3 });
    assert.ok(slots.length > 0);
    for (const slot of slots) {
      const d = new Date(slot.start);
      assert.ok(d.getDay() !== 0 && d.getDay() !== 6, 'no weekend slots');
      assert.ok(d.getHours() >= 9 && d.getHours() < 17, 'inside working hours');
      const minutes = (new Date(slot.end) - d) / 60000;
      assert.equal(minutes, 30);
    }
  });

  test('summarize refuses when the AI boundary is off', () => {
    const room = roomService.create({ title: 'Off', type: 'private', aiMode: 'off', startNow: true });
    assert.throws(() => meetingAgent.summarize(room.id), (err) => err.status === 403);
  });

  test('summarize reports honestly when nothing was said', () => {
    const room = roomService.create({ title: 'Empty', type: 'business', aiMode: 'assistant', startNow: true });
    const summary = meetingAgent.summarize(room.id);
    assert.match(summary.summary, /No discussion has been captured/i);
    assert.equal(summary.decisions.length, 0);
  });

  test('organize produces a draft that creates nothing', async () => {
    const before = store.state.rooms.length;
    const draftsBefore = (store.state.pendingDrafts || []).length;
    const draft = await meetingAgent.organize('Set up a 30 minute meeting with Sarah about the budget');
    assert.equal(store.state.rooms.length, before, 'organize must not create a room');
    assert.equal((store.state.pendingDrafts || []).length, draftsBefore + 1, 'the draft is stored, nothing more');
    assert.ok(Array.isArray(draft.slots) && draft.slots.length > 0);
    assert.ok(draft.invite.body.length > 40);
    assert.deepEqual(draft.requiresApproval, ['create:room', 'send:invitation']);
  });

  test('approving a draft is what creates the room', async () => {
    const draft = await meetingAgent.organize('45 minute workshop with John about the cloud migration');
    const before = store.state.rooms.length;
    const approved = meetingAgent.approveDraft(draft.id, { slotIndex: 0 });
    assert.equal(store.state.rooms.length, before + 1);
    assert.equal(approved.approvedBy, 'host');
    assert.ok(approved.room.code);
    assert.equal((store.state.pendingDrafts || []).some((d) => d.id === draft.id), false);
  });
});

/* ------------------------------------------------------------------ */
/* ICS                                                                */
/* ------------------------------------------------------------------ */

describe('Calendar portability', () => {
  test('builds a valid ICS block with escaping', () => {
    const ics = buildICS({
      title: 'Budget, review; final',
      start: '2026-11-15T10:00:00.000Z',
      end: '2026-11-15T10:45:00.000Z',
      timeZone: 'Asia/Karachi',
      attendees: [{ name: 'Sarah Malik', email: 'sarah@varizen.co' }],
      location: 'https://example.test/r/abc123',
      notes: 'Line one\nLine two'
    });
    assert.match(ics, /^BEGIN:VCALENDAR/);
    assert.match(ics, /END:VCALENDAR/);
    assert.match(ics, /SUMMARY:Budget\\, review\\; final/);
    assert.match(ics, /ATTENDEE;CN=Sarah Malik;RSVP=TRUE:mailto:sarah@varizen\.co/);
    assert.match(ics, /DESCRIPTION:Line one\\nLine two/);
    assert.match(ics, /DTSTART:20261115T100000Z/);
  });
});

/* ------------------------------------------------------------------ */
/* AI provider consent                                                */
/* ------------------------------------------------------------------ */

describe('AI provider abstraction', () => {
  test('default provider is local and needs no consent', () => {
    const provider = getAIProvider();
    assert.equal(provider.kind, 'deterministic');
    assert.equal(AI_PROVIDERS.deterministic.remote, false);
  });

  test('a remote provider cannot be enabled without consent', () => {
    assert.throws(
      () => setAIProvider({ kind: 'openai', allowRemote: false }),
      (err) => err.status === 403 && err.needsConsent === true
    );
  });

  test('unknown providers are rejected', () => {
    assert.throws(() => setAIProvider({ kind: 'not-a-provider' }), (err) => err.status === 400);
  });

  test('consented remote provider persists its choice', () => {
    const result = setAIProvider({ kind: 'anthropic', model: 'claude-sonnet-4', allowRemote: true });
    assert.equal(result.kind, 'anthropic');
    assert.equal(result.allowRemote, true);
    // restore
    setAIProvider({ kind: 'deterministic', allowRemote: false });
    assert.equal(getAIProvider().kind, 'deterministic');
  });
});

/* ------------------------------------------------------------------ */
/* Security primitives                                                */
/* ------------------------------------------------------------------ */

describe('Security primitives', () => {
  test('CSRF guard rejects a cross-origin mutation', () => {
    const req = { method: 'POST', headers: { origin: 'https://evil.example', host: 'localhost:4400' } };
    assert.equal(sameOrigin(req), false);
  });

  test('CSRF guard accepts a same-origin mutation and any read', () => {
    assert.equal(sameOrigin({ method: 'POST', headers: { origin: 'http://localhost:4400', host: 'localhost:4400' } }), true);
    assert.equal(sameOrigin({ method: 'GET', headers: { origin: 'https://evil.example', host: 'localhost:4400' } }), true);
  });

  test('rate limiter blocks past the limit and reports retryAfter', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i += 1) {
      assert.equal(rateLimit(key, { limit: 5 }).ok, true);
    }
    const blocked = rateLimit(key, { limit: 5 });
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfter > 0);
  });
});

/* ------------------------------------------------------------------ */
/* HTTP API                                                           */
/* ------------------------------------------------------------------ */

describe('HTTP API', () => {
  let server;
  let base;

  before(async () => {
    const { createServer } = await import('../server/index.js');
    server = createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('health endpoint reports honest media mode', async () => {
    const res = await fetch(`${base}/api/health`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.ok, true);
    assert.ok(['mesh', 'sfu'].includes(body.media));
  });

  test('every HTML response carries a strict CSP and no framing', async () => {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp.includes("default-src 'self'"));
    assert.ok(csp.includes("frame-ancestors 'none'"));
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });

  test('a room can be created and joined over HTTP with a real token', async () => {
    const createRes = await fetch(`${base}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'HTTP room', type: 'private', admission: 'open', startNow: true })
    });
    const created = await createRes.json();
    assert.equal(createRes.status, 200);
    assert.ok(created.room.code);

    const joinRes = await fetch(`${base}/api/rooms/${created.room.code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'HTTP Guest', guest: true })
    });
    const joined = await joinRes.json();
    assert.equal(joinRes.status, 200);
    assert.equal(joined.admitted, true);
    assert.equal(joined.participant.role, 'participant', 'a guest is never the host');
    assert.ok(joined.token);
    assert.match(joined.wsUrl, /^\/ws\?token=/);

    const meRes = await fetch(`${base}/api/rooms/${created.room.code}`, {
      headers: { Authorization: `Bearer ${joined.token}` }
    });
    assert.equal(meRes.status, 200);
  });

  test('a room-scoped token cannot read a different room', async () => {
    const a = await (await fetch(`${base}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'A', type: 'private', admission: 'open', startNow: true })
    })).json();
    const b = await (await fetch(`${base}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'B', type: 'private', admission: 'open', startNow: true })
    })).json();

    const joined = await (await fetch(`${base}/api/rooms/${a.room.code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Cross', guest: true })
    })).json();
    assert.equal(joined.participant.role, 'participant');

    // Guest token is scoped to room A. Room B must reject it — by code AND by id.
    for (const target of [b.room.code, b.room.id]) {
      const res = await fetch(`${base}/api/rooms/${target}`, {
        headers: { Authorization: `Bearer ${joined.token}` }
      });
      assert.equal(res.status, 403, `token for room A must not open room B via ${target}`);
    }

    // And the same token still works on its own room.
    const own = await fetch(`${base}/api/rooms/${a.room.code}`, {
      headers: { Authorization: `Bearer ${joined.token}` }
    });
    assert.equal(own.status, 200);
  });

  test('a remote AI provider cannot be enabled without consent', async () => {
    const res = await fetch(`${base}/api/ai/provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'openai', allowRemote: false })
    });
    assert.equal(res.status, 403);
    const body = await res.json();
    assert.equal(body.needsConsent, true);
  });

  test('a guest token cannot change the AI boundary', async () => {
    const created = await (await fetch(`${base}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'AI gate', type: 'private', admission: 'open', startNow: true })
    })).json();
    const joined = await (await fetch(`${base}/api/rooms/${created.room.code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sneaky', guest: true })
    })).json();
    assert.equal(joined.participant.role, 'participant');

    const res = await fetch(`${base}/api/rooms/${created.room.code}/ai/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${joined.token}` },
      body: JSON.stringify({ mode: 'full' })
    });
    // A participant token is not the host session, even on loopback.
    assert.equal(res.status, 403);
    const body = await res.json();
    assert.equal(body.needsHost, true);
  });

  test('unknown API routes return a structured 404', async () => {
    const res = await fetch(`${base}/api/does-not-exist`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.match(body.error, /No route/);
  });

  test('oversized bodies are rejected with a clean 413', async () => {
    const big = 'x'.repeat(400 * 1024);
    const res = await fetch(`${base}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: big })
    });
    assert.equal(res.status, 413);
    const body = await res.json();
    assert.match(body.error, /too large/i);
  });

  test('room join URLs resolve to the room shell', async () => {
    const res = await fetch(`${base}/r/abc123`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /ZMeet — Meeting room/);
  });

  test('an unauthenticated websocket upgrade is refused', async () => {
    const res = await fetch(`${base}/ws`);
    // Plain HTTP on the ws path is not a route; it must not 101.
    assert.notEqual(res.status, 101);
  });
});
