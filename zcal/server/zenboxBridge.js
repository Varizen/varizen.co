/**
 * ZCal — ZMail bridge (prompt §14).
 * (was: ZenCalendar — ZenBox bridge)
 *
 * ZMail exposes an HTTP API on :4200. ZCal reads *only* scheduling-related
 * signals and never copies mailbox contents into the calendar cache.
 *
 * Two directions:
 *   1. Inbound  — an email asks "can we meet Thursday afternoon?"; we extract the
 *                 request and propose times (never auto-send).
 *   2. Outbound — a calendar invitation that arrived by email can be surfaced in
 *                 the calendar with a link back to the source message.
 *
 * The bridge is fail-safe: if ZMail is not running, the feature degrades to a
 * clearly labelled "unavailable" state instead of fabricating context.
 */

import { findSlots, scheduleProposal, resolveIntent } from './planner.js';
import { config } from './config.js';

const ZENBOX_URL = config.zenboxUrl;

async function zenboxFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${ZENBOX_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: AbortSignal.timeout(4000)
    });
  } catch {
    return { ok: false, unavailable: true, error: `ZMail is not reachable at ${ZENBOX_URL}` };
  }
  if (!res.ok) {
    return { ok: false, error: `ZMail responded ${res.status}` };
  }
  const body = await res.json().catch(() => ({}));
  return { ok: true, body };
}

export async function zenboxStatus() {
  const probe = await zenboxFetch('/api/counts');
  return {
    connected: probe.ok,
    url: ZENBOX_URL,
    note: probe.ok
      ? 'ZMail bridge active. Only scheduling signals are read; message bodies stay in ZMail.'
      : probe.error || 'ZMail not detected. Start it with `npm start` in the zmail/ folder.'
  };
}

/** Scan the last N messages for scheduling intents. Read-only. */
export async function scanForSchedulingRequests({ limit = 25 } = {}) {
  const res = await zenboxFetch(`/api/messages?folder=inbox`);
  if (!res.ok) {
    return { available: false, error: res.error, requests: [] };
  }
  const messages = Array.isArray(res.body) ? res.body : res.body.messages || [];
  const requests = [];

  for (const msg of messages.slice(0, limit)) {
    const text = `${msg.subject || ''} ${msg.preview || msg.snippet || ''} ${msg.body || ''}`;
    const isScheduling =
      /(can we meet|are you available|let'?s meet|schedule a|book a|free on|available on|meet (on|at)|call on|thursday|friday|next week)/i.test(
        text
      );
    if (!isScheduling) continue;

    const intent = resolveIntent(text);
    const slotResult = findSlots({
      durationMinutes: intent.durationMinutes || 30,
      windowStart: new Date(intent.window.start),
      windowEnd: new Date(intent.window.end),
      timeZone: config.defaultTimeZone,
      limit: 3
    });

    requests.push({
      messageId: msg.id,
      subject: msg.subject,
      from: msg.from || msg.sender || '',
      receivedAt: msg.receivedAt || msg.date || null,
      summary: msg.preview || msg.snippet || text.slice(0, 160),
      proposedTimes: slotResult.options.map((o) => ({
        start: o.start,
        end: o.end,
        score: o.score,
        reasons: o.reasons
      })),
      suggestedReply: buildSchedulingReply(msg, slotResult.options),
      requiresPermission: 'send:communication'
    });
  }

  return { available: true, scanned: Math.min(messages.length, limit), requests };
}

function buildSchedulingReply(message, options) {
  const firstName = (message.from || message.sender || '').split('@')[0].split(' ')[0] || 'there';
  const lines = options.slice(0, 3).map((o, i) => `${i + 1}. ${new Date(o.start).toUTCString()}`);
  return {
    subject: `Re: ${message.subject || 'Finding a time'}`,
    body: `Hi ${firstName},\n\nHappy to meet. Here are a few times that work on my side:\n\n${lines.join(
      '\n'
    )}\n\nDo any of these suit you? If not, send me two windows that work and I'll make one fit.\n\nBest,\nTahseen`,
    note: 'Draft only — ZCal never sends scheduling mail without the “Communicate” permission and your approval.'
  };
}

/** Turn a scanned request into a sandbox proposal for the primary visible calendar. */
export function proposeFromEmail(request, { calendarId, timeZone } = {}) {
  const first = request.proposedTimes?.[0];
  if (!first) {
    return { created: false, reason: 'No free slot was found for this request.' };
  }
  return scheduleProposal({
    raw: request.subject || '',
    timeZone: timeZone || config.defaultTimeZone,
    durationMinutes: Math.round((new Date(first.end) - new Date(first.start)) / 60000),
    window: { start: first.start, end: first.end },
    windowLabel: 'proposed window',
    people: [],
    project: null,
    calendarId
  });
}

export { ZENBOX_URL };
