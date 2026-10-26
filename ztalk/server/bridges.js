/**
 * ZTalk — ZenMeet + ZenCalendar bridges (was: ZenChat).
 *
 * Design rules that keep this honest and safe:
 *
 *   1. FAIL-SAFE, NEVER FAKE. If a sibling service is down, the bridge returns
 *      `{ available: false, error }` and the UI shows the real reason. It never
 *      invents a room code or a calendar event.
 *   2. NO SILENT WRITES. Nothing is created in ZenMeet or ZenCalendar until the
 *      user presses the action button. Detections are proposals, not effects.
 *   3. NO CREDENTIAL STORAGE. ZenMeet/ZenCalendar are same-machine siblings. If
 *      a deployment puts them behind auth, the operator sets a token env var;
 *      ZTalk forwards it, it never persists it.
 */

import { config } from './config.js';
import { store } from './store.js';

async function call(base, path, { method = 'GET', body = null, token = null, timeout = 4000 } = {}) {
  const url = `${base.replace(/\/$/, '')}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(timeout)
    });
    const text = await res.text();
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text.slice(0, 400) };
    }
    if (!res.ok) {
      return { ok: false, status: res.status, error: parsed?.error || `Responded ${res.status}`, body: parsed };
    }
    return { ok: true, status: res.status, body: parsed };
  } catch (err) {
    const reason = err?.name === 'TimeoutError' ? 'timed out' : err?.message || 'unreachable';
    return { ok: false, status: 0, error: `${base} is ${reason}` };
  }
}

/* ------------------------------- ZenMeet -------------------------------- */

export async function meetingStatus() {
  const probe = await call(config.zenMeetUrl, '/api/health');
  return {
    connected: probe.ok,
    url: config.zenMeetUrl,
    health: probe.ok ? probe.body : null,
    note: probe.ok
      ? 'ZenMeet is reachable. ZTalk can create rooms and reveal join links.'
      : `${probe.error}. Start ZMeet with \`npm start\` inside the zmeet/ folder.`
  };
}

/**
 * Turn a detected meeting signal into a real ZenMeet room.
 * Called ONLY from an explicit user action in the UI.
 */
export async function createMeetingFromDetection({ detection, conversation, durationMinutes = 30 }) {
  if (!detection) {
    throw Object.assign(new Error('A detection is required.'), { status: 400 });
  }
  const startsAt = detection.when || nextHalfHour();
  const title = meetingTitleFrom(detection, conversation);

  const payload = {
    title,
    type: 'business',
    purpose: detection.detail || title,
    scheduledFor: startsAt,
    durationMinutes,
    timeZone: conversation?.timeZone || config.timeZone,
    invitees: (conversation?.participants || [])
      .filter((p) => !p.isSelf)
      .map((p) => ({ name: p.name, email: p.handle })),
    origin: {
      product: 'ZTalk',
      conversationId: conversation?.id || null,
      conversationTitle: conversation?.title || null,
      platform: conversation?.platform || null,
      detectionId: detection.id || null,
      messageId: detection.messageId || null
    }
  };

  const res = await call(config.zenMeetUrl, '/api/rooms', { method: 'POST', body: payload });
  if (!res.ok) {
    return {
      created: false,
      available: false,
      error: res.error,
      note: 'ZenMeet could not be reached, so no room was created. Nothing was faked.',
      payload,
      joinUrl: null
    };
  }

  const room = res.body?.room || res.body;
  const code = room?.code || room?.id;
  const joinUrl = code ? `${config.zenMeetUrl}/r/${code}` : null;

  store.log('zenmeet.created', `Room "${title}" created from ${conversation?.title || 'a conversation'}`, {
    conversationId: conversation?.id,
    actor: store.state.identity.email,
    detail: { roomId: room?.id, code, detectionId: detection.id }
  });
  store.activity('meeting.created', `Created ZenMeet room "${title}"`, {
    conversationId: conversation?.id,
    conversationName: conversation?.title
  });

  return {
    created: true,
    available: true,
    room,
    code,
    joinUrl,
    calendar: res.body?.calendar || null,
    note: 'Room created in ZenMeet. The join link is ready to paste into any conversation.'
  };
}

function meetingTitleFrom(detection, conversation) {
  const contact = (conversation?.participants || []).find((p) => p.role === 'contact');
  const base = detection.title || 'Meeting';
  const cleaned = base.replace(/^Meeting\s*[·:-]\s*/i, '').trim();
  if (cleaned && cleaned.length > 3 && !/^(requested|proposed)$/i.test(cleaned)) {
    return `${conversation?.title || 'Meeting'} · ${cleaned}`;
  }
  return contact ? `${conversation.title} sync` : 'ZTalk meeting';
}

function nextHalfHour(base = new Date()) {
  const d = new Date(base);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() > 30 ? 60 : 30);
  return d.toISOString();
}

/** Suggested slots from ZenCalendar availability, or a local fallback. */
export async function suggestMeetingTimes({ conversation, durationMinutes = 30, count = 3 } = {}) {
  const now = new Date();
  const windowStart = new Date(now.getTime() + 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const res = await call(config.zenCalendarUrl, '/api/ai/find-slots', {
    method: 'POST',
    body: {
      durationMinutes,
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      limit: count
    }
  });

  if (res.ok) {
    const options = res.body?.options || res.body?.slots || [];
    return {
      available: true,
      source: 'zencalendar',
      options: options.slice(0, count).map((o) => ({
        start: o.start,
        end: o.end,
        score: o.score ?? null,
        reasons: o.reasons || []
      })),
      note: 'Times come from ZenCalendar availability, so real conflicts are excluded.'
    };
  }

  return {
    available: false,
    source: 'local-fallback',
    error: res.error,
    options: localSlots({ durationMinutes, count }),
    note: `${res.error}. These are generic business-hours suggestions, not availability-checked.`
  };
}

function localSlots({ durationMinutes = 30, count = 3 }) {
  const out = [];
  const base = new Date();
  base.setMinutes(base.getMinutes() > 30 ? 0 : 30, 0, 0);
  if (base.getMinutes() === 0) base.setHours(base.getHours() + 1);

  let cursor = new Date(base.getTime() + 60 * 60 * 1000);
  while (out.length < count) {
    const day = cursor.getDay();
    const hour = cursor.getHours();
    if (day !== 0 && day !== 6 && hour >= 9 && hour < 17) {
      out.push({
        start: cursor.toISOString(),
        end: new Date(cursor.getTime() + durationMinutes * 60000).toISOString(),
        score: null,
        reasons: ['Business hours', 'Not availability-checked']
      });
      cursor = new Date(cursor.getTime() + 90 * 60000);
    } else {
      cursor = new Date(cursor.getTime() + 30 * 60000);
    }
  }
  return out;
}

/* ----------------------------- ZenCalendar ------------------------------ */

export async function calendarStatus() {
  const probe = await call(config.zenCalendarUrl, '/api/health');
  return {
    connected: probe.ok,
    url: config.zenCalendarUrl,
    note: probe.ok
      ? 'ZenCalendar is reachable. Detected events can be pushed as real calendar entries.'
      : `${probe.error}. Start ZCal with \`npm start\` inside the zcal/ folder.`
  };
}

/** Push a detection into ZenCalendar. Explicit action only. */
export async function addToCalendar({ detection, conversation, durationMinutes = 30 }) {
  const startsAt = detection?.when || nextHalfHour();
  const endsAt = new Date(new Date(startsAt).getTime() + durationMinutes * 60000).toISOString();

  const payload = {
    title: detection?.title || `Follow-up with ${conversation?.title || 'contact'}`,
    description: detection?.detail || '',
    start: startsAt,
    end: endsAt,
    timeZone: conversation?.timeZone || config.timeZone,
    source: 'ztalk',
    attendees: (conversation?.participants || [])
      .filter((p) => !p.isSelf)
      .map((p) => ({ name: p.name, email: p.handle })),
    origin: {
      product: 'ZTalk',
      conversationId: conversation?.id || null,
      platform: conversation?.platform || null,
      detectionId: detection?.id || null,
      messageId: detection?.messageId || null
    }
  };

  const res = await call(config.zenCalendarUrl, '/api/events', { method: 'POST', body: payload });
  if (!res.ok) {
    return {
      created: false,
      available: false,
      error: res.error,
      payload,
      note: 'ZenCalendar could not be reached, so no event was created.'
    };
  }

  store.log('zencalendar.created', `Event "${payload.title}" created`, {
    conversationId: conversation?.id,
    actor: store.state.identity.email,
    detail: { eventId: res.body?.id || res.body?.event?.id || null }
  });
  store.activity('calendar.created', `Added "${payload.title}" to ZenCalendar`, {
    conversationId: conversation?.id,
    conversationName: conversation?.title
  });

  return {
    created: true,
    available: true,
    event: res.body?.event || res.body,
    startsAt,
    endsAt,
    note: 'Event created in ZenCalendar.'
  };
}

/* -------------------------------- tasks --------------------------------- */

/** Local task list — ZTalk owns these; ZenCalendar can mirror them later. */
export function addTask({ title, dueAt = null, owner = null, conversationId = null, detectionId = null, priority = 'normal' }) {
  const text = String(title || '').trim();
  if (!text) throw Object.assign(new Error('A task title is required.'), { status: 400 });
  const task = {
    id: `task_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: text.slice(0, 200),
    dueAt,
    owner: owner || store.state.identity.name,
    conversationId,
    detectionId,
    priority,
    done: false,
    createdAt: new Date().toISOString(),
    source: 'zenchat'
  };
  store.state.tasks.push(task);
  store.persist();
  store.log('task.created', `Task "${task.title}"`, { conversationId, actor: store.state.identity.email });
  store.activity('task.created', `Created task "${task.title}"`, { conversationId });
  store.emit('tasks:update', { task });
  return task;
}

export function listTasks({ done = null } = {}) {
  let list = store.state.tasks || [];
  if (done === false) list = list.filter((t) => !t.done);
  if (done === true) list = list.filter((t) => t.done);
  return list.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.dueAt || a.createdAt) - new Date(b.dueAt || b.createdAt);
  });
}

export function toggleTask(taskId, done) {
  const task = (store.state.tasks || []).find((t) => t.id === taskId);
  if (!task) throw Object.assign(new Error('Task not found.'), { status: 404 });
  task.done = typeof done === 'boolean' ? done : !task.done;
  task.completedAt = task.done ? new Date().toISOString() : null;
  store.persist();
  store.emit('tasks:update', { task });
  return task;
}

/* ----------------------------- aggregation ------------------------------ */

export async function integrationStatus() {
  const [meet, cal] = await Promise.all([meetingStatus(), calendarStatus()]);
  return {
    zenMeet: meet,
    zenCalendar: cal,
    zenBox: {
      connected: null,
      url: config.zenBoxUrl,
      note: 'ZMail is the email sibling. ZTalk links out to it but does not read mailboxes.'
    },
    note: 'Every bridge is fail-safe: unavailable siblings degrade with a visible reason instead of silently doing nothing.'
  };
}
