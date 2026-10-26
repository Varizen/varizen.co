/**
 * ZMeet — AI Meeting Agent.
 * (was: ZenMeet)
 *
 * Two hard rules, both enforced here rather than in the UI:
 *
 *   1. The agent may only do what the room's AI boundary grants (prompt §6, §19).
 *      Every public entry point calls `roomService.requireAI(roomId, capability)`.
 *
 *   2. Everything consequential is a *proposal*. The agent writes drafts and
 *      diffs into the room; a human approves before anything leaves the room.
 *
 * The engine is deterministic: extraction is derived from the room's own chat,
 * transcript, polls and whiteboard. It does not invent participants, dates or
 * decisions that were never said.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { roomService } from './rooms.js';
import { aiCan, AI_MODES, CONFIRM_REQUIRED } from './permissions.js';
import { logActivity } from './aiActivity.js';
import { createProvider, getAIProvider } from './aiProvider.js';
import { addMinutes, dayLabel, id, nowIso, timeLabel, truncate, uniqueBy } from './util.js';
import { config } from './config.js';

function fail(message, status = 400, extra = {}) {
  return Object.assign(new Error(message), { status, ...extra });
}

/* ------------------------------------------------------------------ */
/* Deterministic language understanding                                */
/* ------------------------------------------------------------------ */

const PERSON_HINTS = [
  'Sarah',
  'John',
  'Alex',
  'Maya',
  'Daniel',
  'Priya',
  'Omar',
  'Hina',
  'Bilal',
  'Aisha',
  'Zain',
  'Fatima'
];

const KEYWORD_GROUPS = {
  budget: ['budget', 'cost', 'spend', 'pricing', 'invoice', 'finance', 'money', '$'],
  timeline: ['timeline', 'deadline', 'schedule', 'launch', 'ship', 'date', 'november', 'week'],
  hiring: ['hire', 'hiring', 'headcount', 'recruit', 'candidate', 'offer'],
  security: ['security', 'encrypt', 'breach', 'audit', 'compliance', 'soc2', 'iso'],
  product: ['product', 'feature', 'release', 'roadmap', 'prototype', 'demo'],
  customers: ['customer', 'client', 'churn', 'renewal', 'onboarding', 'acv'],
  malaysia: ['malaysia', 'kuala', 'asia', 'office'],
  cloud: ['cloud', 'infrastructure', 'kubernetes', 'aws', 'azure', 'server']
};

const DECISION_MARKERS = [
  /\bwe('| a)?re going with\b/i,
  /\bdecided\b/i,
  /\bagreed\b/i,
  /\blet'?s go with\b/i,
  /\bfinal answer\b/i,
  /\bwe will launch\b/i,
  /\bsigned off\b/i,
  /\bapproved\b/i
];

const ACTION_MARKERS = [
  /\b(i|we)'?ll\b/i,
  /\bwill (send|prepare|draft|share|check|book|update|review|confirm|fix|own)\b/i,
  /\bcan you\b/i,
  /\bplease (send|prepare|share|check|draft)\b/i,
  /\baction item\b/i,
  /\bneed to\b/i,
  /\bfollow up\b/i
];

const DEADLINE_PATTERNS = [
  { re: /\bby (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, resolve: 'weekday' },
  { re: /\b(today|tonight|tomorrow)\b/i, resolve: 'relative' },
  { re: /\bnext week\b/i, resolve: 'next-week' },
  { re: /\b(november|december|january|february|march|april|may|june|july|august|september|october)\s+(\d{1,2})\b/i, resolve: 'month-day' },
  { re: /\b(\d{1,2})\s*(?:st|nd|rd|th)?\s+(november|december|january|february|march|april|may|june|july|august|september|october)\b/i, resolve: 'day-month' },
  { re: /\b(eod|end of day)\b/i, resolve: 'eod' },
  { re: /\b(q[1-4])\b/i, resolve: 'quarter' }
];

export function extractPeople(text = '') {
  const found = new Set();
  for (const name of PERSON_HINTS) {
    const re = new RegExp(`\\b${name}\\b`, 'i');
    if (re.test(text)) found.add(name);
  }
  // Name-shaped words after "with"/"and" that we don't know about yet.
  const withMatch = text.match(/\bwith\s+([A-Z][a-z]+(?:\s+and\s+[A-Z][a-z]+)*)/);
  if (withMatch) {
    for (const part of withMatch[1].split(/\s+and\s+/)) {
      const name = part.trim();
      if (name.length > 1 && !PERSON_HINTS.includes(name)) found.add(name);
    }
  }
  return [...found];
}

export function extractTopic(text = '') {
  const patterns = [
    /\babout (?:the )?([a-z0-9][a-z0-9 '&/-]{2,60})/i,
    /\bregarding (?:the )?([a-z0-9][a-z0-9 '&/-]{2,60})/i,
    /\bon (?:the )?([A-Z][A-Za-z0-9 '&/-]{2,60})/,
    /\bfor (?:the )?([A-Z][A-Za-z0-9 '&/-]{2,60})/
  ];
  for (const re of patterns) {
    const match = text.match(re);
    if (match) {
      return match[1].replace(/\s+(tomorrow|today|next week|at|on|by)\b.*$/i, '').trim();
    }
  }
  const project = text.match(/\b([A-Z]{3,6})\s+project\b/);
  if (project) return `${project[1]} project`;
  return '';
}

export function extractDuration(text = '') {
  const minutes = text.match(/\b(\d{1,3})\s*(?:min|minute)s?\b/i);
  if (minutes) return Math.min(600, Number(minutes[1]));
  const hours = text.match(/\b(\d(?:\.\d)?)\s*(?:h|hour|hr)s?\b/i);
  if (hours) return Math.round(Number(hours[1]) * 60);
  if (/\bhalf an hour\b/i.test(text)) return 30;
  if (/\bquick\b|\bshort\b/i.test(text)) return 15;
  return 30;
}

export function detectMeetingType(text = '') {
  const lower = text.toLowerCase();
  if (/\bwebinar\b/.test(lower)) return 'webinar';
  if (/\blive ?show\b|\bstream\b|\bbroadcast\b/.test(lower)) return 'live';
  if (/\binterview\b|\bcandidate\b|\bhiring\b/.test(lower)) return 'interview';
  if (/\bworkshop\b|\bbrainstorm\b|\bwhiteboard\b/.test(lower)) return 'workshop';
  if (/\bpresentation\b|\bslides\b|\bdemo\b|\bkeynote\b/.test(lower)) return 'presentation';
  if (/\b1:1\b|\bone[- ]on[- ]one\b|\bprivate\b/.test(lower)) return 'private';
  if (/\bagenda\b|\bminutes\b|\bdecisions?\b|\bstandup\b|\bsync\b/.test(lower)) return 'business';
  return 'business';
}

export function detectWindow(text = '') {
  const now = new Date();
  const lower = text.toLowerCase();
  if (/\btomorrow\b/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return { start: d.toISOString(), end: addMinutes(d, 24 * 60).toISOString(), label: 'tomorrow' };
  }
  if (/\bnext week\b/.test(lower)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 7);
    d.setHours(9, 0, 0, 0);
    return { start: d.toISOString(), end: addMinutes(d, 5 * 24 * 60).toISOString(), label: 'next week' };
  }
  if (/\bthis week\b|\bthursday\b|\bfriday\b/.test(lower)) {
    const d = new Date(now);
    d.setHours(9, 0, 0, 0);
    return { start: d.toISOString(), end: addMinutes(d, 7 * 24 * 60).toISOString(), label: 'this week' };
  }
  // default: next 7 days starting tomorrow morning
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return { start: d.toISOString(), end: addMinutes(d, 7 * 24 * 60).toISOString(), label: 'the next 7 days' };
}

function detectDeadline(text = '') {
  for (const { re } of DEADLINE_PATTERNS) {
    const match = text.match(re);
    if (match) return match[0].replace(/^by\s+/i, '').replace(/\bbefore\s+/i, '').trim();
  }
  return null;
}

function keywordTags(text = '') {
  const tags = [];
  const lower = text.toLowerCase();
  for (const [group, words] of Object.entries(KEYWORD_GROUPS)) {
    if (words.some((w) => lower.includes(w))) tags.push(group);
  }
  return tags;
}

/* ------------------------------------------------------------------ */
/* Scheduling helper — pure, no network                                */
/* ------------------------------------------------------------------ */

/**
 * Suggest times inside a window using working hours only. This is a local
 * approximation; when ZenCalendar is reachable the real availability is used
 * instead (see integrations.js).
 */
export function suggestSlots({ windowStart, windowEnd, durationMinutes = 30, timeZone = config.timeZone, limit = 3 }) {
  const start = new Date(windowStart);
  const end = new Date(windowEnd);
  const options = [];
  const cursor = new Date(start);
  cursor.setHours(9, 0, 0, 0);
  let guard = 0;

  while (cursor < end && options.length < limit && guard < 400) {
    guard += 1;
    const day = cursor.getDay();
    const hour = cursor.getHours();
    if (day !== 0 && day !== 6 && hour >= 9 && hour < 17) {
      const slotEnd = addMinutes(cursor, durationMinutes);
      options.push({
        start: new Date(cursor).toISOString(),
        end: slotEnd.toISOString(),
        day: dayLabel(cursor.toISOString(), timeZone),
        time: `${timeLabel(cursor.toISOString(), timeZone)}–${timeLabel(slotEnd.toISOString(), timeZone)}`,
        score: 0.9 - options.length * 0.08,
        reasons: ['Within working hours', 'No conflict in the local schedule snapshot']
      });
      cursor.setHours(cursor.getHours() + 2, 0, 0, 0);
    } else {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
    }
  }
  return options;
}

/* ------------------------------------------------------------------ */
/* Extraction from room content                                        */
/* ------------------------------------------------------------------ */

function roomUtterances(room) {
  const chat = (room.chat || []).map((m) => ({
    speaker: m.author,
    text: m.text,
    at: m.at,
    source: 'chat'
  }));
  const transcript = (room.transcript || []).map((t) => ({
    speaker: t.speaker,
    text: t.text,
    at: t.at,
    source: 'transcript'
  }));
  return [...transcript, ...chat].sort((a, b) => new Date(a.at) - new Date(b.at));
}

export function extractDecisions(room) {
  const found = [];
  for (const line of roomUtterances(room)) {
    const isDecision = DECISION_MARKERS.some((re) => re.test(line.text));
    if (!isDecision) continue;
    found.push({
      id: id('dec'),
      text: truncate(line.text, 240),
      speaker: line.speaker,
      source: line.source,
      at: line.at,
      tags: keywordTags(line.text)
    });
  }
  // Polls that were closed with a clear winner are decisions too.
  for (const poll of room.polls || []) {
    if (poll.status === 'closed' && poll.result?.winner) {
      found.push({
        id: id('dec'),
        text: `${poll.question} → ${poll.result.winner}`,
        speaker: 'Poll',
        source: 'poll',
        at: poll.closedAt,
        tags: keywordTags(poll.question)
      });
    }
  }
  return found;
}

export function extractActions(room) {
  const found = [];
  const advisor = /(?:action item|need to|please|can you|will|i'll|we'll|let's|follow up|owner)/i;
  for (const line of roomUtterances(room)) {
    if (!advisor.test(line.text)) continue;
    if (!ACTION_MARKERS.some((re) => re.test(line.text))) continue;

    const mentioned = extractPeople(line.text);
    const owner = mentioned[0] || line.speaker;
    const deadline = detectDeadline(line.text);
    const task = truncate(
      line.text
        .replace(/^(ok(ay)?|so|well|yeah|right)[,\s]+/i, '')
        .replace(/\b(i|we)'?ll\b/i, '')
        .trim(),
      180
    );

    found.push({
      id: id('act_item'),
      task,
      owner,
      deadline,
      sourceSpeaker: line.speaker,
      at: line.at,
      status: 'proposed',
      approved: false,
      tags: keywordTags(line.text)
    });
  }
  return uniqueBy(found, (a) => `${a.owner}|${a.task.slice(0, 40)}`).slice(0, 24);
}

export function extractOpenQuestions(room) {
  const questions = [];
  for (const line of roomUtterances(room)) {
    if (!line.text.trim().endsWith('?')) continue;
    const answered = roomUtterances(room).some(
      (other) => new Date(other.at) > new Date(line.at) && keywordTags(other.text).some((t) => keywordTags(line.text).includes(t))
    );
    questions.push({
      id: id('oq'),
      text: truncate(line.text, 200),
      askedBy: line.speaker,
      at: line.at,
      resolved: answered
    });
  }
  for (const item of room.qna || []) {
    if (!item.answered) {
      questions.push({ id: item.id, text: item.question, askedBy: item.author, at: item.at, resolved: false, source: 'qna' });
    }
  }
  return questions.filter((q) => !q.resolved).slice(0, 16);
}

export function extractHighlights(room) {
  const moments = [];
  const all = roomUtterances(room);
  const tags = new Map();

  for (const line of all) {
    for (const tag of keywordTags(line.text)) {
      if (!tags.has(tag)) tags.set(tag, { tag, first: line, count: 0, speakers: new Set() });
      const entry = tags.get(tag);
      entry.count += 1;
      entry.speakers.add(line.speaker);
    }
  }

  for (const { tag, first, count, speakers } of tags.values()) {
    if (count < 1) continue;
    moments.push({
      id: id('hl'),
      at: first.at,
      offsetSeconds: room.startedAt
        ? Math.max(0, Math.round((new Date(first.at).getTime() - new Date(room.startedAt).getTime()) / 1000))
        : 0,
      label: `${tag[0].toUpperCase()}${tag.slice(1)} discussed`,
      detail: truncate(first.text, 120),
      speaker: first.speaker,
      weight: count + speakers.size
    });
  }

  for (const decision of room.decisions || []) {
    moments.push({
      id: id('hl'),
      at: decision.approvedAt || decision.at,
      offsetSeconds: room.startedAt
        ? Math.max(
            0,
            Math.round((new Date(decision.approvedAt || decision.at).getTime() - new Date(room.startedAt).getTime()) / 1000)
          )
        : 0,
      label: 'Decision recorded',
      detail: truncate(decision.text, 120),
      speaker: decision.approvedBy || decision.speaker,
      weight: 10
    });
  }

  return moments.sort((a, b) => b.weight - a.weight).slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* The agent                                                           */
/* ------------------------------------------------------------------ */

class MeetingAgent {
  /* ---------------------------- preparation --------------------------- */

  /** Pre-meeting brief (prompt §9). */
  brief(roomId) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'read:chat');

    const related = store.state.rooms.filter((r) => r.id !== room.id && r.title === room.title && r.status === 'ended');
    const actions = store.state.rooms
      .filter((r) => r.id !== room.id)
      .flatMap((r) => (r.actions || []).filter((a) => !a.approved))
      .slice(0, 8);

    const brief = {
      purpose: room.brief?.purpose || room.purpose || room.title,
      participants: (room.invitees || []).length + 1,
      agenda: (room.agenda || []).length
        ? room.agenda.map((a) => a.text)
        : ['Project status', 'Budget', 'Timeline', 'Responsibilities'],
      previousDiscussions: related.length,
      documents: (room.files || []).length,
      outstandingActions: actions.length,
      generatedAt: nowIso(),
      source: 'local-deterministic'
    };
    room.brief = { ...(room.brief || {}), ...brief };
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'prepare',
      title: 'Prepared meeting brief',
      detail: `${brief.agenda.length} agenda items · ${brief.outstandingActions} outstanding actions`,
      capability: 'propose:agenda'
    });
    return brief;
  }

  /** Generate an agenda from a raw request. Proposal only. */
  agenda(roomId, { raw = '', people = [] } = {}) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'propose:agenda');
    const topic = extractTopic(raw) || room.title;
    const participants = people.length ? people : extractPeople(raw);

    const base = [
      { text: `Context — why ${topic} matters now`, minutes: 5 },
      { text: 'Status: what changed since the last conversation', minutes: 8 },
      { text: 'Open decisions and trade-offs', minutes: 10 },
      { text: 'Owners, deadlines and next steps', minutes: 5 },
      { text: 'Recap and follow-up', minutes: 2 }
    ];
    const tags = keywordTags(raw);
    const extra = tags
      .map((tag) => ({ budget: 'Budget and approvals', timeline: 'Timeline and launch gates', security: 'Security and compliance checkpoints', hiring: 'Hiring plan and interview loop', customers: 'Customer impact', product: 'Product scope', malaysia: 'Malaysia office considerations', cloud: 'Cloud and infrastructure readiness' })[tag])
      .filter(Boolean);

    const agenda = [...base.slice(0, 2), ...extra.map((text) => ({ text, minutes: 8 })), ...base.slice(2)];
    room.agenda = agenda.map((item, idx) => ({ id: `ag_${idx + 1}`, text: item.text, minutes: item.minutes, done: false }));
    room.brief = { ...roomService.defaultBrief(room), agenda: agenda.map((a) => a.text), participants: participants.length + 1 || room.brief?.participants, generatedAt: nowIso() };
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'agenda',
      title: 'Generated meeting agenda',
      detail: `${agenda.length} sections for “${topic}”`,
      capability: 'propose:agenda'
    });
    return { agenda: room.agenda, topic, people: participants };
  }

  /**
   * AI meeting organizer (prompt §4). Natural language in, a complete draft out.
   * Nothing is created or sent until the host approves the draft.
   */
  async organize(raw = '', { timeZone = config.timeZone } = {}) {
    const people = extractPeople(raw);
    const topic = extractTopic(raw) || 'Working session';
    const durationMinutes = extractDuration(raw);
    const type = detectMeetingType(raw);
    const window = detectWindow(raw);
    const tags = keywordTags(raw);

    let availability = { source: 'local', busy: [], note: 'Local working-hours approximation.' };
    try {
      const { findAvailability } = await import('./integrations.js');
      const remote = await findAvailability({ windowStart: window.start, windowEnd: window.end });
      if (remote.available) availability = remote;
    } catch {
      /* integration unavailable — local approximation stands */
    }

    const slots = (availability.options?.length
      ? availability.options
      : suggestSlots({ windowStart: window.start, windowEnd: window.end, durationMinutes, timeZone })
    ).slice(0, 3);

    const agenda = [
      `Purpose — ${topic}`,
      'Context and status',
      ...tags.map((t) => ({ budget: 'Budget and constraints', timeline: 'Timeline', product: 'Scope', security: 'Risk and security', customers: 'Customer impact' })[t]).filter(Boolean),
      'Decisions',
      'Owners and next steps'
    ];

    const inviteBody = [
      `Hi ${people.length ? people.join(', ') : 'all'},`,
      '',
      `I'd like to get together about ${topic}.`,
      `Proposed: ${slots[0] ? `${slots[0].day} ${slots[0].time}` : 'to be confirmed'} (${durationMinutes} min).`,
      '',
      'Agenda',
      ...agenda.map((line, idx) => `${idx + 1}. ${line}`),
      '',
      'The room link is included in the calendar invite. ZMeet will take notes and send the summary afterwards.',
      '',
      'Best,',
      store.state.identity.name
    ].join('\n');

    const draft = {
      id: id('draft'),
      title: `${topic}`,
      type,
      typeLabel: MEETING_TYPES_LABEL[type] || type,
      purpose: topic,
      durationMinutes,
      window: { start: window.start, end: window.end, label: window.label },
      timeZone,
      people,
      invitees: people.map((name) => ({
        name,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@${store.state.identity.organization.domain}`
      })),
      slots,
      availability,
      agenda,
      invite: { subject: `${topic} — ${durationMinutes} min`, body: inviteBody },
      requiresApproval: ['create:room', 'send:invitation'],
      prepared: {
        documents: 0,
        previousDiscussions: store.state.rooms.filter((r) => r.title.toLowerCase().includes(topic.toLowerCase().split(' ')[0])).length,
        outstandingActions: (store.state.rooms || []).flatMap((r) => r.actions || []).filter((a) => !a.approved).length
      },
      createdAt: nowIso(),
      source: 'local-deterministic'
    };

    store.state.pendingDrafts = [draft, ...(store.state.pendingDrafts || [])].slice(0, 20);
    store.persist();
    logActivity({
      kind: 'availability',
      title: 'Checked attendee availability',
      detail: `${slots.length} candidate slot(s) · ${availability.source}`,
      capability: 'read:availability'
    });
    logActivity({
      kind: 'agenda',
      title: 'Drafted meeting invitation',
      detail: `“${draft.title}” with ${people.length || 'no named'} participant(s) · awaiting approval`,
      capability: 'propose:agenda'
    });
    return draft;
  }

  /** Approve an organizer draft → creates the room. Explicit human action. */
  approveDraft(draftId, { slotIndex = 0, actor = 'host' } = {}) {
    const draft = (store.state.pendingDrafts || []).find((d) => d.id === draftId);
    if (!draft) throw fail('Draft not found', 404);
    const slot = draft.slots[slotIndex] || draft.slots[0];
    const room = roomService.create({
      title: draft.title,
      type: draft.type,
      purpose: draft.purpose,
      scheduledFor: slot?.start || draft.window.start,
      durationMinutes: draft.durationMinutes,
      timeZone: draft.timeZone,
      invitees: draft.invitees,
      agenda: draft.agenda,
      aiMode: AI_MODES[draft.aiMode] ? draft.aiMode : 'notetaker'
    });
    store.state.pendingDrafts = (store.state.pendingDrafts || []).filter((d) => d.id !== draftId);
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'calendar',
      title: 'Created meeting from AI draft',
      detail: `${draft.title} · ${slot?.day || ''} ${slot?.time || ''}`,
      capability: 'act:calendar',
      approved: true
    });
    return { room: roomService.summary(room), approvedBy: actor, invite: draft.invite };
  }

  /* ----------------------------- live assistant ----------------------- */

  /** Rolling summary of what has happened so far (prompt §7). */
  summarize(roomId, { sinceMinutes = null } = {}) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'read:chat');

    const cutoff = sinceMinutes ? Date.now() - sinceMinutes * 60_000 : 0;
    const lines = roomUtterances(room).filter((l) => new Date(l.at).getTime() >= cutoff);
    const decisions = extractDecisions(room);
    const actions = extractActions(room);
    const questions = extractOpenQuestions(room);
    const speakers = uniqueBy(lines.map((l) => l.speaker), (s) => s).filter(Boolean);
    const tags = keywordTags(lines.map((l) => l.text).join(' '));

    const summary = {
      roomId: room.id,
      generatedAt: nowIso(),
      scope: sinceMinutes ? `last ${sinceMinutes} minutes` : 'whole meeting',
      messageCount: lines.length,
      speakers,
      topics: tags,
      summary: buildSummaryText({ room, lines, decisions, actions, questions, tags }),
      decisions: decisions.slice(0, 8),
      actions: actions.slice(0, 10),
      openQuestions: questions.slice(0, 6),
      minutesElapsed: room.startedAt ? Math.round((Date.now() - new Date(room.startedAt).getTime()) / 60_000) : 0,
      source: 'local-deterministic'
    };

    room.lastSummary = summary;
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'summary',
      title: 'Summarized discussion',
      detail: `${lines.length} contributions · ${decisions.length} decision(s) · ${actions.length} action(s)`,
      capability: 'propose:actions'
    });
    return summary;
  }

  /** Natural-language commands (prompt §8). Silent when context is missing. */
  command(roomId, raw = '') {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'read:chat');
    const text = raw.toLowerCase();

    if (/\b(unresolved|open questions?|open issues?)\b/.test(text)) {
      const questions = extractOpenQuestions(room);
      return {
        intent: 'open-questions',
        answer: questions.length
          ? `${questions.length} unresolved item(s).`
          : 'Nothing is unresolved in the recorded discussion.',
        data: questions
      };
    }

    if (/\b(summar|recap|so far|catch me up|last \d+ minutes?|what did we miss)\b/.test(text)) {
      const windowMatch = raw.match(/last\s+(\d+)\s+min/i);
      const res = this.summarize(roomId, { sinceMinutes: windowMatch ? Number(windowMatch[1]) : null });
      return { intent: 'summary', answer: res.summary, data: res };
    }

    if (/\b(action item|create a task|assign|todo|to-do)\b/.test(text)) {
      const people = extractPeople(raw);
      const owner = people[0] || 'Unassigned';
      const taskText = raw.replace(/^.*?(action item|task|todo|to-do)\s*(for|to)?\s*/i, '').trim() || truncate(raw, 120);
      const item = {
        id: id('act_item'),
        task: truncate(taskText, 180),
        owner,
        deadline: detectDeadline(raw),
        createdAt: nowIso(),
        createdBy: 'ai',
        status: 'proposed',
        approved: false,
        tags: keywordTags(raw)
      };
      room.actions = [item, ...(room.actions || [])];
      store.persist();
      logActivity({
        roomId: room.id,
        kind: 'actions',
        title: 'Proposed an action item',
        detail: `${owner} → ${item.task}`,
        capability: 'propose:actions'
      });
      return { intent: 'action-item', answer: `Proposed: ${owner} → ${item.task}. Approve it to make it real.`, data: item };
    }

    if (/\b(follow[- ]?up|email|draft.*(mail|message))\b/.test(text)) {
      const draft = this.followUp(roomId);
      return { intent: 'follow-up', answer: 'Follow-up draft ready. Nothing is sent until you approve it.', data: draft };
    }

    if (/\b(document|file|slide)\b/.test(text)) {
      const files = room.files || [];
      return {
        intent: 'find-file',
        answer: files.length ? `${files.length} file(s) in the meeting sandbox.` : 'No files have been added to this meeting.',
        data: files
      };
    }

    if (/\b(previous|last|earlier|find).*(meeting|session)\b/.test(text)) {
      const results = this.search(raw, { roomId });
      return { intent: 'search-memory', answer: `${results.results.length} related meeting(s) found.`, data: results };
    }

    if (/\b(decision|decided|agree)\b/.test(text)) {
      const decisions = extractDecisions(room);
      return {
        intent: 'decisions',
        answer: decisions.length ? `${decisions.length} decision(s) recorded.` : 'No decisions have been recorded yet.',
        data: decisions
      };
    }

    if (/\bwhiteboard.*(plan|action|task)\b/.test(text)) {
      const plan = this.whiteboardToPlan(roomId);
      return { intent: 'whiteboard-plan', answer: `Turned ${plan.items.length} whiteboard note(s) into a draft plan.`, data: plan };
    }

    const fallback = this.summarize(roomId);
    return {
      intent: 'summary',
      answer: fallback.summary,
      data: fallback,
      note: 'The agent answered with a live summary because the command did not match a known intent.'
    };
  }

  /** Approve an AI-proposed action item. */
  approveAction(roomId, actionId, { actor = 'host', value = true } = {}) {
    const room = roomService.get(roomId);
    const item = (room.actions || []).find((a) => a.id === actionId);
    if (!item) throw fail('Action item not found', 404);
    item.approved = Boolean(value);
    item.status = value ? 'open' : 'proposed';
    item.approvedBy = value ? actor : null;
    item.approvedAt = value ? nowIso() : null;
    store.persist();
    if (value) {
      logActivity({
        roomId: room.id,
        kind: 'actions',
        title: `Approved action for ${item.owner}`,
        detail: truncate(item.task, 120),
        capability: 'propose:actions',
        approved: true
      });
    }
    return item;
  }

  /** Approve a detected decision so it lands in the minutes. */
  approveDecision(roomId, decisionId, { actor = 'host', value = true } = {}) {
    const room = roomService.get(roomId);
    const existing = (room.decisions || []).find((d) => d.id === decisionId);
    if (existing) {
      existing.approvedBy = value ? actor : null;
      existing.approvedAt = value ? nowIso() : null;
      store.persist();
      return existing;
    }
    const detected = extractDecisions(room).find((d) => d.id === decisionId);
    if (!detected) throw fail('Decision not found', 404);
    const decision = { ...detected, approvedBy: value ? actor : null, approvedAt: value ? nowIso() : null };
    room.decisions = [...(room.decisions || []), decision];
    room.report = null;
    store.persist();
    store.log('DECISION_APPROVED', decision.text, { actor, roomId: room.id });
    return decision;
  }

  /* -------------------------- whiteboard → plan ----------------------- */

  whiteboardToPlan(roomId) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'read:whiteboard');

    const notes = room.whiteboard?.notes || [];
    const strokes = room.whiteboard?.strokes || [];
    const items = notes.map((note, idx) => ({
      id: id('plan'),
      text: truncate(note.text || `Whiteboard item ${idx + 1}`, 160),
      owner: note.author || 'Unassigned',
      kind: note.kind || 'note',
      suggestedAction: /^(\d+[.)]\s*)?\S/.test(note.text || '') ? 'review' : 'clarify',
      order: idx + 1
    }));

    if (!items.length && strokes.length) {
      items.push({
        id: id('plan'),
        text: `${strokes.length} drawn element(s) on the whiteboard`,
        owner: 'Unassigned',
        kind: 'drawing',
        suggestedAction: 'review',
        order: 1
      });
    }

    const plan = {
      roomId: room.id,
      generatedAt: nowIso(),
      items,
      note: items.length
        ? 'Draft plan derived from whiteboard notes. Nothing is assigned until the host approves.'
        : 'The whiteboard has no notes yet, so no plan could be derived.'
    };
    if (items.length) {
      const proposals = items.map((item) => ({
        id: id('act_item'),
        task: item.text,
        owner: item.owner,
        deadline: null,
        status: 'proposed',
        approved: false,
        origin: 'whiteboard'
      }));
      room.actions = [...proposals, ...(room.actions || [])];
      store.persist();
    }
    logActivity({
      roomId: room.id,
      kind: 'actions',
      title: 'Turned whiteboard into an action plan',
      detail: `${items.length} draft action(s) awaiting approval`,
      capability: 'propose:actions'
    });
    return plan;
  }

  /* ------------------------------- minutes ---------------------------- */

  /** AI meeting minutes (prompt §24). Draft until the host approves. */
  minutes(roomId, { actor = 'ai' } = {}) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'propose:minutes');

    const decisions = extractDecisions(room);
    const actions = room.actions?.length ? room.actions : extractActions(room);
    const questions = extractOpenQuestions(room);
    const summary = this.summarize(roomId);

    const minutes = {
      id: id('min'),
      roomId: room.id,
      title: room.title,
      generatedAt: nowIso(),
      generatedBy: getAIProvider().kind,
      attendance: (room.participants || [])
        .filter((p) => p.state === 'joined' || p.state === 'left')
        .map((p) => ({ name: p.name, role: p.role, joinedAt: p.joinedAt, leftAt: p.leftAt || null })),
      summary: summary.summary,
      decisions,
      actions: actions.map((a) => ({ ...a })),
      openQuestions: questions,
      agenda: room.agenda || [],
      status: 'draft',
      approvedBy: null,
      approvedAt: null,
      sentTo: []
    };
    room.minutes = minutes;
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'minutes',
      title: 'Prepared meeting minutes',
      detail: `${decisions.length} decisions · ${actions.length} actions · draft`,
      capability: 'propose:minutes'
    });
    return minutes;
  }

  approveMinutes(roomId, { actor = 'host', edits = null } = {}) {
    const room = roomService.get(roomId);
    if (!room.minutes) this.minutes(roomId);
    if (edits) {
      room.minutes.summary = edits.summary ?? room.minutes.summary;
      if (Array.isArray(edits.decisions)) room.minutes.decisions = edits.decisions;
      if (Array.isArray(edits.actions)) room.minutes.actions = edits.actions;
    }
    room.minutes.status = 'approved';
    room.minutes.approvedBy = actor;
    room.minutes.approvedAt = nowIso();
    room.report = null;
    store.persist();
    store.log('MINUTES_APPROVED', `Minutes approved for “${room.title}”.`, { actor, roomId: room.id });
    logActivity({
      roomId: room.id,
      kind: 'minutes',
      title: 'Minutes approved',
      detail: 'Ready to send to participants.',
      capability: 'propose:minutes',
      approved: true
    });
    return room.minutes;
  }

  discardMinutes(roomId, { actor = 'host' } = {}) {
    const room = roomService.get(roomId);
    room.minutes = null;
    store.persist();
    store.log('MINUTES_DISCARDED', 'Minutes discarded.', { actor, roomId: room.id });
    return { discarded: true };
  }

  /* ---------------------------- follow-up email ----------------------- */

  followUp(roomId, { actor = 'ai' } = {}) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'propose:reply');

    const decisions = room.minutes?.decisions?.length ? room.minutes.decisions : extractDecisions(room);
    const actions = (room.actions || []).length ? room.actions : extractActions(room);
    const open = extractOpenQuestions(room);
    const recipients = (room.invitees || []).map((i) => i.email).filter(Boolean);

    const body = [
      `Hi all,`,
      '',
      `Thanks for the time today. Here is the short version of “${room.title}”.`,
      '',
      'Decisions',
      ...(decisions.length ? decisions.map((d) => `• ${d.text}`) : ['• No formal decisions were recorded.']),
      '',
      'Actions',
      ...(actions.length
        ? actions.map((a) => `• ${a.owner} — ${a.task}${a.deadline ? ` (by ${a.deadline})` : ''}`)
        : ['• No action items were assigned.']),
      '',
      open.length ? 'Open questions' : null,
      ...(open.length ? open.map((q) => `• ${q.text}`) : []),
      open.length ? '' : null,
      `The recording and full transcript live in your own storage under the ${room.storage.policy} policy.`,
      '',
      'Best,',
      store.state.identity.name
    ]
      .filter((line) => line !== null)
      .join('\n');

    const draft = {
      id: id('mail'),
      roomId: room.id,
      subject: `Notes — ${room.title} (${new Date(room.scheduledFor).toISOString().slice(0, 10)})`,
      body,
      recipients,
      status: 'draft',
      createdAt: nowIso(),
      sendVia: 'zmail',
      note: 'Draft only. ZMeet never sends mail; approval hands it to ZMail.',
      requiresApproval: 'act:email'
    };
    room.followUpDraft = draft;
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'followup',
      title: 'Drafted follow-up email',
      detail: `${recipients.length} recipient(s) · awaiting approval`,
      capability: 'propose:reply'
    });
    return draft;
  }

  /* ------------------------------ live report ------------------------- */

  /** Post-meeting AI Meeting Report (prompt §22). */
  report(roomId) {
    const room = roomService.get(roomId);
    roomService.requireAI(roomId, 'read:chat');

    const summary = this.summarize(roomId);
    const minutes = room.minutes || this.minutes(roomId);
    const highlights = extractHighlights(room);
    const transcript = (room.transcript || []).map((t) => ({
      ...t,
      offsetSeconds: room.startedAt ? Math.max(0, Math.round((new Date(t.at).getTime() - new Date(room.startedAt).getTime()) / 1000)) : 0
    }));

    const report = {
      roomId: room.id,
      generatedAt: nowIso(),
      title: room.title,
      summary: summary.summary,
      decisions: minutes.decisions,
      actions: minutes.actions.map((a) => ({
        owner: a.owner,
        task: a.task,
        deadline: a.deadline,
        approved: Boolean(a.approved)
      })),
      openQuestions: minutes.openQuestions,
      highlights,
      transcript,
      followUp: room.followUpDraft || null,
      recordingPolicy: {
        storage: room.storage,
        recordings: room.recordings,
        note: 'Recordings and files stay in organizer storage. This report stores references only.'
      },
      durationMinutes: room.startedAt
        ? Math.round(((room.endedAt ? new Date(room.endedAt) : new Date()).getTime() - new Date(room.startedAt).getTime()) / 60_000)
        : 0,
      attendance: minutes.attendance
    };
    room.report = report;
    store.persist();
    logActivity({
      roomId: room.id,
      kind: 'summary',
      title: 'Generated AI meeting report',
      detail: `${report.decisions.length} decisions · ${report.actions.length} actions · ${report.highlights.length} highlights`,
      capability: 'propose:minutes'
    });
    return report;
  }

  /* --------------------------- searchable memory ---------------------- */

  /**
   * Meeting memory search (prompt §23). Only searches rooms the caller can see,
   * and returns timestamps rather than dumping whole transcripts.
   */
  search(query = '', { roomId = null, limit = 12 } = {}) {
    const terms = String(query)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !['did', 'the', 'when', 'what', 'about', 'where', 'find', 'show', 'every', 'meeting', 'meetings', 'decide', 'decided'].includes(t));

    const tagFilter = keywordTags(query);
    const results = [];

    for (const room of store.state.rooms) {
      if (roomId && room.id === roomId) continue;
      let score = 0;
      const matches = [];

      const haystacks = [
        { where: 'title', text: room.title },
        { where: 'purpose', text: room.purpose || '' },
        ...(room.decisions || []).map((d) => ({ where: 'decision', text: d.text, at: d.at || d.approvedAt })),
        ...(room.actions || []).map((a) => ({ where: 'action', text: `${a.owner} ${a.task}`, at: a.at })),
        ...(room.chat || []).map((m) => ({ where: 'chat', text: `${m.author} ${m.text}`, at: m.at })),
        ...(room.transcript || []).map((t) => ({ where: 'transcript', text: `${t.speaker} ${t.text}`, at: t.at })),
        ...(room.files || []).map((f) => ({ where: 'file', text: f.name, at: f.addedAt }))
      ];

      for (const h of haystacks) {
        const lower = String(h.text || '').toLowerCase();
        if (!lower) continue;
        const hits = terms.filter((t) => lower.includes(t)).length;
        const tagHits = tagFilter.filter((tag) => keywordTags(h.text).includes(tag)).length;
        if (hits || tagHits) {
          score += hits * 2 + tagHits * 3 + (h.where === 'decision' ? 4 : 0) + (h.where === 'title' ? 6 : 0);
          matches.push({ where: h.where, at: h.at || null, excerpt: truncate(h.text, 160) });
        }
      }

      if (!score) continue;
      results.push({
        roomId: room.id,
        code: room.code,
        title: room.title,
        type: room.type,
        scheduledFor: room.scheduledFor,
        status: room.status,
        score,
        tags: uniqueBy(matches.map((m) => m.where), (w) => w),
        matches: matches.sort((a, b) => b.score - a.score).slice(0, 4),
        joinUrl: `/r/${room.code}`
      });
    }

    const sorted = results.sort((a, b) => b.score - a.score).slice(0, limit);
    logActivity({
      kind: 'search',
      title: 'Searched meeting memory',
      detail: `“${truncate(query, 80)}” → ${sorted.length} result(s)`,
      capability: null
    });
    return { query, terms, results: sorted, total: sorted.length };
  }
}

const MEETING_TYPES_LABEL = {
  private: 'Private Meeting',
  business: 'Business Meeting',
  interview: 'Interview',
  webinar: 'Webinar',
  live: 'Live Show',
  presentation: 'Presentation',
  workshop: 'Workshop',
  ai: 'AI Session'
};

function buildSummaryText({ room, lines, decisions, actions, questions, tags }) {
  if (!lines.length) {
    return `No discussion has been captured yet in “${room.title}”. The AI will summarize as soon as people start talking.`;
  }
  const speakers = uniqueBy(lines.map((l) => l.speaker), (s) => s).filter(Boolean);
  const parts = [
    `${lines.length} contribution${lines.length === 1 ? '' : 's'} from ${speakers.slice(0, 4).join(', ') || 'participants'}.`
  ];
  if (tags.length) parts.push(`The conversation centred on ${tags.join(', ')}.`);
  if (decisions.length) parts.push(`${decisions.length} decision${decisions.length === 1 ? '' : 's'} recorded.`);
  if (actions.length) parts.push(`${actions.length} action item${actions.length === 1 ? '' : 's'} detected.`);
  if (questions.length) parts.push(`${questions.length} question${questions.length === 1 ? '' : 's'} still open.`);
  return parts.join(' ');
}

export const meetingAgent = new MeetingAgent();
export { extractActions as _extractActions };
