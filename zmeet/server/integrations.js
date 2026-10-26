/**
 * ZMeet — sibling product bridges (prompt §25, §26).
 * (was: ZenMeet)
 *
 * Both bridges are strictly fail-safe and read-only by default:
 *   - ZCal: read availability, create/update/cancel events — but only
 *     after the host approves, and only via ZCal's own sandbox API.
 *   - ZMail: hand a drafted follow-up email over. ZMeet never sends mail.
 *
 * If a sibling product is not running the feature degrades to a clearly labelled
 * "unavailable" state. Nothing is fabricated.
 */

import { config } from './config.js';
import { store } from './store.js';

async function call(base, path, options = {}) {
  try {
    const res = await fetch(`${base}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) return { ok: false, error: `Responded ${res.status}` };
    const body = await res.json().catch(() => ({}));
    return { ok: true, body };
  } catch {
    return { ok: false, unavailable: true, error: `Not reachable at ${base}` };
  }
}

/* -------------------------------- ZCal ---------------------------------- */

export async function calendarStatus() {
  const probe = await call(config.zenCalendarUrl, '/api/calendar/summary');
  return {
    product: 'ZCal',
    url: config.zenCalendarUrl,
    connected: probe.ok,
    note: probe.ok
      ? 'Availability is read live. ZMeet never writes to your calendar without approval.'
      : `${probe.error}. Start ZCal with \`npm start\` in the zcal/ folder.`
  };
}

/** Read real availability when ZCal is present, else report unavailable. */
export async function findAvailability({ windowStart, windowEnd, durationMinutes = 30 }) {
  const params = new URLSearchParams({
    start: windowStart,
    end: windowEnd,
    durationMinutes: String(durationMinutes)
  });
  const res = await call(config.zenCalendarUrl, `/api/availability?${params.toString()}`);
  if (!res.ok) {
    return {
      available: false,
      source: 'local',
      error: res.error,
      note: 'ZCal is unavailable, so times are a local working-hours approximation.'
    };
  }
  const raw = res.body?.options || res.body?.slots || res.body?.free || [];
  return {
    available: true,
    source: 'zcal',
    options: raw.map((slot) => ({
      start: slot.start,
      end: slot.end,
      day: slot.day || null,
      time: slot.time || slot.label || null,
      score: slot.score ?? 0.9,
      reasons: slot.reasons || ['Free in ZCal']
    })),
    busy: res.body?.busy || [],
    note: 'Live availability from ZCal.'
  };
}

/**
 * Push a meeting to ZCal. Creates a sandbox proposal there first — that
 * product's own approval model decides when it becomes a real event.
 */
export async function pushEventToCalendar(room, { actor = 'host' } = {}) {
  const payload = {
    title: room.title,
    purpose: room.purpose || '',
    start: room.scheduledFor,
    end: new Date(new Date(room.scheduledFor).getTime() + room.durationMinutes * 60_000).toISOString(),
    timeZone: room.timeZone,
    attendees: (room.invitees || []).map((i) => ({ name: i.name, email: i.email })),
    location: `${config.publicUrl}/r/${room.code}`,
    notes: `ZMeet room · AI ${room.aiModeLabel || room.aiMode}`,
    source: { product: 'ZMeet', roomId: room.id, code: room.code }
  };

  const res = await call(config.zenCalendarUrl, '/api/sandbox/proposals/from-source', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    store.log('CALENDAR_PUSH_FAILED', `ZCal unavailable: ${res.error}`, { actor, roomId: room.id });
    return {
      pushed: false,
      unavailable: true,
      error: res.error,
      fallback: {
        ics: buildICS(payload),
        note: 'ZCal is not running. Download the .ics file instead — nothing was written to any calendar.'
      }
    };
  }

  store.log('CALENDAR_PUSHED', `Sent “${room.title}” to ZCal as a proposal.`, { actor, roomId: room.id });
  return { pushed: true, proposal: res.body, note: 'ZCal holds it as a proposal until you apply it there.' };
}

export async function cancelCalendarEvent(room, { actor = 'host' } = {}) {
  const res = await call(config.zenCalendarUrl, `/api/integrations/zenmeet/cancel`, {
    method: 'POST',
    body: JSON.stringify({ roomId: room.id, code: room.code })
  });
  if (!res.ok) return { cancelled: false, unavailable: true, error: res.error };
  store.log('CALENDAR_CANCELLED', `Cancellation sent to ZCal for “${room.title}”.`, { actor, roomId: room.id });
  return { cancelled: true, result: res.body };
}

/** Minimal, correct ICS so a meeting is portable even without ZCal. */
export function buildICS({ title, start, end, timeZone, attendees = [], location = '', notes = '' }) {
  const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = (text = '') => String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const uid = `zenmeet-${Math.random().toString(36).slice(2)}@varizen.co`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZMeet//ZMeet 1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`,
    location ? `LOCATION:${escape(location)}` : null,
    notes ? `DESCRIPTION:${escape(notes)}` : null,
    timeZone ? `X-WR-TIMEZONE:${timeZone}` : null,
    ...attendees.map((a) => `ATTENDEE;CN=${escape(a.name || a.email)};RSVP=TRUE:mailto:${a.email}`),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean);

  return `${lines.join('\r\n')}\r\n`;
}

/* ----------------------------------- ZMail ------------------------------ */

export async function zenboxStatus() {
  const probe = await call(config.zenBoxUrl, '/api/counts');
  return {
    product: 'ZMail',
    url: config.zenBoxUrl,
    connected: probe.ok,
    note: probe.ok
      ? 'Email can become a meeting, and meeting follow-ups can be handed to ZMail as drafts.'
      : `${probe.error}. Start ZMail with \`npm start\` in the zmail/ folder.`
  };
}

/**
 * Scan recent mail for scheduling intent (prompt §25). Read-only; ZMeet never
 * copies message bodies into its own store.
 */
export async function scanEmailForMeetings({ limit = 20 } = {}) {
  const res = await call(config.zenBoxUrl, '/api/messages?folder=inbox');
  if (!res.ok) {
    return { available: false, error: res.error, suggestions: [] };
  }
  const messages = Array.isArray(res.body) ? res.body : res.body.messages || [];
  const pattern = /(can we (meet|talk|discuss)|are you available|let'?s meet|schedule a|book a|free on|available on|meet (on|at)|call (on|at)|catch up|discuss this)/i;

  const suggestions = [];
  for (const msg of messages.slice(0, limit)) {
    const text = `${msg.subject || ''} ${msg.preview || msg.snippet || ''}`;
    if (!pattern.test(text)) continue;
    const from = msg.from || msg.sender || '';
    suggestions.push({
      messageId: msg.id,
      subject: msg.subject,
      from,
      summary: msg.preview || msg.snippet || '',
      receivedAt: msg.receivedAt || msg.date || null,
      suggestedTitle: `Re: ${msg.subject || 'Discussion'}`,
      requiresApproval: 'act:calendar'
    });
  }
  return {
    available: true,
    scanned: Math.min(messages.length, limit),
    suggestions,
    note: 'Only subject lines and previews were read. Message bodies stay in ZMail.'
  };
}

/** Hand a drafted follow-up to ZMail. Draft only — never sends. */
export async function draftFollowUpInZenBox(draft, { actor = 'host' } = {}) {
  const res = await call(config.zenBoxUrl, '/api/drafts', {
    method: 'POST',
    body: JSON.stringify({
      to: draft.recipients,
      subject: draft.subject,
      body: draft.body,
      source: { product: 'ZMeet', roomId: draft.roomId, kind: 'meeting-follow-up' }
    })
  });
  if (!res.ok) {
    return {
      handedOff: false,
      unavailable: true,
      error: res.error,
      copyable: draft,
      note: 'ZMail is not running. The draft is available here to copy.'
    };
  }
  store.log('FOLLOWUP_TO_ZENBOX', 'Follow-up draft handed to ZMail.', { actor, roomId: draft.roomId });
  return { handedOff: true, draftId: res.body?.id || null, note: 'ZMail holds it as a draft. You send it there.' };
}

/* --------------------------------- storage --------------------------------- */

/**
 * Storage adapters (prompt §21). ZMeet stores metadata; media lives elsewhere.
 * These adapters describe *where* an artifact would go — they never upload on
 * their own without a signed, explicit action.
 */
export const STORAGE_ADAPTERS = {
  organization: {
    id: 'organization',
    label: 'Organization storage',
    blurb: 'Recordings live in your organization workspace.',
    requiresConfig: false
  },
  personal: {
    id: 'personal',
    label: 'My cloud storage',
    blurb: 'Google Drive, OneDrive, Dropbox or iCloud — your account, your quota.',
    requiresConfig: true
  },
  native: {
    id: 'native',
    label: 'Provider-native storage',
    blurb: 'YouTube for streams, the platform’s own library for recordings.',
    requiresConfig: false
  },
  object: {
    id: 'object',
    label: 'S3-compatible object storage',
    blurb: 'Any S3-compatible bucket with your own credentials.',
    requiresConfig: true
  },
  local: {
    id: 'local',
    label: 'This device',
    blurb: 'Stay entirely on the host machine. Nothing uploaded.',
    requiresConfig: false
  }
};

export async function integrationStatus() {
  const [calendar, box] = await Promise.all([calendarStatus(), zenboxStatus()]);
  return {
    calendar,
    box,
    storage: {
      adapters: Object.values(STORAGE_ADAPTERS),
      active: store.state.identity.organization.storagePolicy,
      note: 'ZMeet stores meeting metadata only. Recordings, transcripts and files stay where you put them.'
    }
  };
}
