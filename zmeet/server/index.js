/**
 * ZMeet — HTTP API + static server (was: ZenMeet). Zero dependencies, Node built-ins only.
 *
 * Security posture (prompt §37):
 *   - CSP, nosniff, frame-ancestors 'none', Referrer-Policy, COOP
 *   - same-origin enforcement on every mutating request (CSRF guard)
 *   - in-process rate limiting per client and method
 *   - a real host session: HttpOnly SameSite=Strict cookie, issued only to a
 *     loopback request or with the host key from `.data/host-token`
 *   - room-scoped, short-lived participant tokens for guests
 *   - strict JSON body limits
 *   - every consequential action lands in the audit log
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { store } from './store.js';
import { roomService } from './rooms.js';
import { meetingAgent, suggestSlots, extractPeople, extractTopic } from './aiAgent.js';
import { AI_MODES, ADMISSION_POLICIES, LAYOUTS, MEETING_TYPES, ROLES, ROLE_CAPABILITIES } from './permissions.js';
import { getAIProvider, providerStatus, setAIProvider, AI_PROVIDERS } from './aiProvider.js';
import { listActivity, activitySummary, clearActivity, ACTIVITY_KINDS } from './aiActivity.js';
import {
  buildICS,
  cancelCalendarEvent,
  draftFollowUpInZenBox,
  integrationStatus,
  pushEventToCalendar,
  scanEmailForMeetings,
  STORAGE_ADAPTERS
} from './integrations.js';
import {
  addDestination,
  getStudio,
  listDestinations,
  PLATFORMS,
  removeDestination,
  saveScenes,
  setCountdown,
  setLowerThird,
  switchScene
} from './production.js';
import { issueToken, rateLimit, requestKey, sameOrigin, securityHeaders, verifyToken } from './security.js';
import { handleUpgrade } from './signaling.js';
import { seedIfEmpty } from './seed.js';
import { clamp, id, nowIso, truncate } from './util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DATA_DIR = path.join(__dirname, '..', '.data');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8'
};

/* ---------------------------- host session ---------------------------- */

function loadHostKey() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  const file = path.join(DATA_DIR, 'host-token');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  const key = crypto.randomBytes(24).toString('base64url');
  fs.writeFileSync(file, key, { mode: 0o600 });
  return key;
}

const HOST_KEY = loadHostKey();

function isLoopback(req) {
  const remote = req.socket?.remoteAddress || '';
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1';
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function bearer(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/**
 * Identify the actor. Priority: participant token → host cookie → host header key.
 * Room-scoped participant tokens can never act outside their own room.
 */
function identify(req) {
  const token = bearer(req);
  if (token) {
    const result = verifyToken(token);
    if (result.ok) {
      const claims = result.claims;
      if (claims.kind === 'host') return { kind: 'host', actor: 'host', role: 'host', claims };
      return {
        kind: 'participant',
        actor: claims.sub,
        role: claims.role,
        participantId: claims.sub,
        roomId: claims.rid,
        claims
      };
    }
    return { kind: 'anonymous', actor: 'anonymous', error: result.error };
  }
  if (parseCookies(req).zm_host) return { kind: 'host', actor: 'host', role: 'host', viaCookie: true };
  if (req.headers['x-zenmeet-host-key'] && req.headers['x-zenmeet-host-key'] === HOST_KEY) {
    return { kind: 'host', actor: 'host', role: 'host', viaKey: true };
  }
  if (isLoopback(req)) return { kind: 'host', actor: 'host', role: 'host', viaLoopback: true };
  return { kind: 'anonymous', actor: 'anonymous' };
}

function requireHost(actor) {
  if (actor.kind !== 'host') {
    throw Object.assign(new Error('This action requires the host session.'), { status: 403, needsHost: true });
  }
  return true;
}

/** A room action needs either the host session or a token for that same room. */
function requireRoom(actor, roomIdOrCode) {
  if (actor.kind === 'host') return true;
  if (actor.kind === 'participant') {
    // Route params may be a room id *or* a join code; compare canonical ids so a
    // token for room A can never be replayed against room B.
    const room = roomService.get(roomIdOrCode);
    if (actor.roomId === room.id) return true;
  }
  throw Object.assign(new Error('You are not authorised for this room.'), { status: 403, needsToken: true });
}

function requireRole(actor, capability) {
  if (actor.kind === 'host') return true;
  const caps = ROLE_CAPABILITIES[actor.role] || [];
  if (!caps.includes(capability)) {
    throw Object.assign(new Error(`Your role (${ROLES[actor.role] || actor.role}) cannot do this.`), {
      status: 403,
      capability
    });
  }
  return true;
}

/* ------------------------------ helpers ------------------------------- */

const MAX_BODY = config.limits.bodyBytes;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let overflow = false;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        // Keep draining so the client gets a clean 413 instead of a TCP reset,
        // but stop buffering.
        overflow = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (overflow) {
        return reject(Object.assign(new Error('Request body too large'), { status: 413 }));
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed && typeof parsed === 'object' ? parsed : {});
      } catch {
        reject(Object.assign(new Error('Malformed JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...securityHeaders,
    'Content-Security-Policy': "default-src 'none'"
  });
  res.end(body);
}

function sendError(res, err) {
  const status = err.status || 500;
  sendJson(res, status, {
    error: err.message || 'Unexpected error',
    status,
    capability: err.capability || null,
    needsPermission: Boolean(err.needsPermission),
    needsConsent: Boolean(err.needsConsent),
    needsRole: Boolean(err.needsRole),
    needsHost: Boolean(err.needsHost),
    needsName: Boolean(err.needsName),
    needsAuth: Boolean(err.requiresAuth),
    aiMode: err.aiMode || null
  });
}

/* ------------------------------- routes ------------------------------- */

const routes = [];

function route(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

function matchRoute(method, pathname) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const parts = r.pattern.split('/').filter(Boolean);
    const target = pathname.split('/').filter(Boolean);
    if (parts.length !== target.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].startsWith(':')) params[parts[i].slice(1)] = decodeURIComponent(target[i]);
      else if (parts[i] !== target[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}

/* ----------------------------- meta routes ---------------------------- */

route('POST', '/api/session', (req) => {
  if (!isLoopback(req) && req.headers['x-zenmeet-host-key'] !== HOST_KEY) {
    throw Object.assign(
      new Error('Host session can only be created from this machine, or with the host key from .data/host-token.'),
      { status: 403 }
    );
  }
  const { token, expiresAt } = issueToken({ roomId: null, participantId: 'host', role: 'host', kind: 'host', ttlMinutes: config.sessionTtlMinutes });
  return {
    token,
    expiresAt,
    identity: store.state.identity,
    setCookie: `zm_host=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${config.sessionTtlMinutes * 60}`
  };
});

route('GET', '/api/state', (_req, _url, { actor }) => ({
  identity: store.state.identity,
  settings: store.state.settings,
  stats: roomService.stats(),
  aiProvider: getAIProvider(),
  actor: { kind: actor.kind, role: actor.role },
  config: {
    publicUrl: config.publicUrl,
    timeZone: config.timeZone,
    media: config.media,
    roomTokenTtlMinutes: config.roomTokenTtlMinutes
  },
  vocabulary: {
    meetingTypes: Object.entries(MEETING_TYPES).map(([key, value]) => ({ key, label: value.label, blurb: value.blurb })),
    roles: Object.entries(ROLES).map(([key, label]) => ({ key, label })),
    aiModes: Object.entries(AI_MODES).map(([key, value]) => ({ key, label: value.label, description: value.description })),
    layouts: Object.entries(LAYOUTS).map(([key, label]) => ({ key, label })),
    admissions: Object.entries(ADMISSION_POLICIES).map(([key, blurb]) => ({ key, blurb })),
    storage: Object.values(STORAGE_ADAPTERS),
    activityKinds: ACTIVITY_KINDS
  }
}));

route('GET', '/api/health', () => ({
  ok: true,
  at: nowIso(),
  rooms: store.state.rooms.length,
  live: roomService.stats().live,
  media: config.media.mode,
  ai: getAIProvider().kind
}));

/* ------------------------------- rooms -------------------------------- */

route('GET', '/api/rooms', (_req, url) => ({
  rooms: roomService.list({ filter: url.searchParams.get('filter') || 'all' }),
  stats: roomService.stats()
}));

route('POST', '/api/rooms', async (_req, _url, { body, actor }) => {
  requireHost(actor);
  const room = roomService.create(body);
  const pushed = await pushEventToCalendar(room, { actor: 'host' }).catch(() => ({ pushed: false, unavailable: true }));
  return { room: roomService.summary(room), calendar: pushed };
});

route('GET', '/api/rooms/:id', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const room = roomService.get(roomId);
  const staff = actor.kind === 'host' || ['host', 'moderator', 'cohost'].includes(actor.role);
  return staff ? roomService.staffView(room) : roomService.publicView(room);
});

route('PATCH', '/api/rooms/:id', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  const room = roomService.patch(roomId, body);
  return roomService.summary(room);
});

route('DELETE', '/api/rooms/:id', (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  return roomService.remove(roomId);
});

route('POST', '/api/rooms/:id/start', (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  return roomService.summary(roomService.start(roomId));
});

route('POST', '/api/rooms/:id/end', (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  const room = roomService.end(roomId);
  return { room: roomService.summary(room), report: meetingAgent.report(roomId) };
});

/* -------------------------------- join -------------------------------- */

/**
 * Guest entry (prompt §33): link → name → (maybe email) → join.
 * Returns a room-scoped token. No account required unless the host asked for it.
 */
route('POST', '/api/rooms/:id/join', (_req, _url, { id: roomId, body, actor }) => {
  const room = roomService.get(roomId);
  const authenticated = actor.kind === 'host' || actor.kind === 'participant';
  // A loopback request is trusted as the host, so guests must say so explicitly.
  // Without this, opening a guest link on the host machine would silently grant
  // host powers in the room.
  const wantsHost = actor.kind === 'host' && body.guest !== true;
  const name = truncate(body.name || (wantsHost ? store.state.identity.name : ''), 60);

  if (!name && !body.participantId && !authenticated) {
    throw Object.assign(new Error('A display name is required to join.'), { status: 400, needsName: true });
  }

  // The host is never made to wait, and always gets the host participant record.
  if (wantsHost) {
    let hostParticipant = (room.participants || []).find((p) => p.isHost);
    if (!hostParticipant) {
      hostParticipant = {
        id: id('part'),
        name: store.state.identity.name,
        email: store.state.identity.email,
        role: 'host',
        state: 'joined',
        mic: false,
        camera: false,
        screen: false,
        handRaised: false,
        isHost: true,
        joinedAt: nowIso(),
        lastSeenAt: nowIso(),
        connectionCount: 0,
        colorIndex: 0
      };
      room.participants.push(hostParticipant);
    }
    hostParticipant.isHost = true;
    hostParticipant.role = 'host';
    hostParticipant.state = 'joined';
    hostParticipant.leftAt = null;
    room.waitingRoom = (room.waitingRoom || []).filter((w) => w.participantId !== hostParticipant.id);
    store.persist();

    const { token, expiresAt } = issueToken({
      roomId: room.id,
      participantId: hostParticipant.id,
      role: 'host',
      kind: 'host',
      ttlMinutes: config.sessionTtlMinutes
    });

    return {
      token,
      expiresAt,
      admitted: true,
      waiting: false,
      message: null,
      participant: roomService.publicParticipant(hostParticipant),
      room: roomService.staffView(room),
      roomMeta: roomMeta(room),
      wsUrl: `/ws?token=${encodeURIComponent(token)}`,
      media: mediaInfo()
    };
  }

  const result = roomService.join(roomId, {
    name,
    email: body.email,
    role: body.role,
    participantId: body.participantId || null,
    authenticated
  });

  const ttl = result.waiting ? 15 : config.roomTokenTtlMinutes;
  const { token, expiresAt } = issueToken({
    roomId: room.id,
    participantId: result.participant.id,
    role: result.participant.role,
    kind: 'meeting',
    ttlMinutes: ttl
  });

  return {
    token,
    expiresAt,
    admitted: result.admitted,
    waiting: result.waiting,
    message: result.message || null,
    participant: roomService.publicParticipant(result.participant),
    room: result.admitted ? roomService.publicView(roomService.get(roomId)) : null,
    roomMeta: roomMeta(room),
    wsUrl: `/ws?token=${encodeURIComponent(token)}`,
    media: mediaInfo()
  };
});

function roomMeta(room) {
  return {
    id: room.id,
    code: room.code,
    title: room.title,
    type: room.type,
    typeLabel: MEETING_TYPES[room.type]?.label,
    hostName: room.host?.name,
    organizer: room.organizer,
    secure: room.secure,
    admission: room.admission,
    scheduledFor: room.scheduledFor,
    durationMinutes: room.durationMinutes
  };
}

function mediaInfo() {
  return {
    mode: config.media.mode,
    sfuUrl: config.media.sfuUrl || null,
    maxMeshPeers: config.media.maxMeshPeers,
    note: 'Media is peer-to-peer. This server only relays signaling.'
  };
}

route('POST', '/api/rooms/:id/leave', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? body.participantId : actor.participantId;
  return roomService.leave(roomId, participantId);
});

route('GET', '/api/rooms/:id/token', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? roomId : actor.participantId;
  const { token, expiresAt } = issueToken({
    roomId,
    participantId,
    role: actor.role,
    kind: 'meeting',
    ttlMinutes: config.roomTokenTtlMinutes
  });
  return { token, expiresAt };
});

/* ------------------------------ meeting brief ------------------------------ */

route('GET', '/api/rooms/:id/brief', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const room = roomService.get(roomId);
  return room.brief || meetingAgent.brief(roomId);
});

route('PUT', '/api/rooms/:id/brief', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return roomService.updateBrief(roomId, body);
});

/* --------------------------------- chat --------------------------------- */

route('POST', '/api/rooms/:id/chat', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? body.participantId : actor.participantId;
  if (!participantId) throw Object.assign(new Error('participantId is required'), { status: 400 });
  return roomService.addChat(roomId, participantId, { text: body.text, kind: body.kind });
});

/* ------------------------------ participants ------------------------------ */

route('POST', '/api/rooms/:id/moderate', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'participant:mute');
  return roomService.moderate(roomId, body.participantId, body.action, {
    actorRole: actor.role,
    actor: actor.kind === 'host' ? 'host' : actor.participantId,
    value: body.value
  });
});

route('POST', '/api/rooms/:id/role', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'participant:promote');
  return roomService.setRole(roomId, body.participantId, body.role, {
    actorRole: actor.role,
    actor: actor.kind === 'host' ? 'host' : actor.participantId
  });
});

route('POST', '/api/rooms/:id/waiting/:waitingId', (_req, _url, { id: roomId, waitingId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, body.admit === false ? 'waiting:reject' : 'waiting:admit');
  return roomService.admit(roomId, waitingId, {
    actorRole: actor.role,
    actor: actor.kind === 'host' ? 'host' : actor.participantId,
    admit: body.admit !== false,
    message: body.message || null
  });
});

route('POST', '/api/rooms/:id/waiting/admit-all', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'waiting:admit');
  return roomService.admitAll(roomId, { actorRole: actor.role, actor: 'host' });
});

route('GET', '/api/rooms/:id/waiting', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'waiting:admit');
  const room = roomService.get(roomId);
  return {
    count: (room.waitingRoom || []).length,
    policy: room.admission,
    entries: room.waitingRoom || []
  };
});

/* --------------------------------- layout -------------------------------- */

route('POST', '/api/rooms/:id/layout', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  return roomService.setLayout(roomId, body.layout, { actor: actor.kind === 'host' ? 'host' : actor.participantId });
});

/* ------------------------------- recording ------------------------------- */

route('POST', '/api/rooms/:id/record', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, body.start === false ? 'record:stop' : 'record:start');
  return roomService.record(roomId, {
    start: body.start !== false,
    options: body.options || null,
    actor: actor.kind === 'host' ? 'host' : actor.participantId,
    actorRole: actor.role
  });
});

/* --------------------------------- files -------------------------------- */

route('POST', '/api/rooms/:id/files', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'file:share');
  return roomService.addFile(roomId, {
    name: body.name,
    sizeBytes: body.sizeBytes,
    mime: body.mime,
    kind: body.kind,
    addedBy: actor.kind === 'host' ? store.state.identity.name : body.addedBy || 'participant',
    policy: body.policy,
    storage: body.storage
  });
});

route('PATCH', '/api/rooms/:id/files/:fileId/policy', (_req, _url, { id: roomId, fileId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'file:policy');
  return roomService.updateFilePolicy(roomId, fileId, body, { actorRole: actor.role });
});

route('POST', '/api/rooms/:id/files/:fileId/present', (_req, _url, { id: roomId, fileId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'file:present');
  return roomService.presentFile(roomId, fileId, { participantId: body.participantId || actor.participantId });
});

/* ------------------------------- whiteboard ------------------------------- */

route('POST', '/api/rooms/:id/whiteboard', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'whiteboard:draw');
  return roomService.whiteboard(roomId, {
    strokes: body.strokes,
    notes: body.notes,
    actor: actor.kind === 'host' ? 'host' : actor.participantId
  });
});

/* --------------------------------- polls --------------------------------- */

route('POST', '/api/rooms/:id/polls', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'poll:create');
  return roomService.createPoll(roomId, {
    question: body.question,
    options: body.options,
    anonymous: Boolean(body.anonymous),
    actorRole: actor.role,
    actor: actor.kind === 'host' ? 'host' : actor.participantId
  });
});

route('POST', '/api/rooms/:id/polls/:pollId/vote', (_req, _url, { id: roomId, pollId, body, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? body.participantId : actor.participantId;
  if (!participantId) throw Object.assign(new Error('participantId is required'), { status: 400 });
  return roomService.vote(roomId, pollId, participantId, body.optionId);
});

route('POST', '/api/rooms/:id/polls/:pollId/close', (_req, _url, { id: roomId, pollId, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'poll:close');
  return roomService.closePoll(roomId, pollId, { actorRole: actor.role, actor: 'host' });
});

route('POST', '/api/rooms/:id/polls/:pollId/decision', (_req, _url, { id: roomId, pollId, actor }) => {
  requireHost(actor);
  return roomService.pollToDecision(roomId, pollId, { actor: 'host' });
});

/* ---------------------------------- Q&A ---------------------------------- */

route('POST', '/api/rooms/:id/qna', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? body.participantId : actor.participantId;
  if (!participantId) throw Object.assign(new Error('participantId is required'), { status: 400 });
  return roomService.askQuestion(roomId, participantId, body.question);
});

route('POST', '/api/rooms/:id/qna/:questionId/answer', (_req, _url, { id: roomId, questionId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'qna:moderate');
  return roomService.answerQuestion(roomId, questionId, { answer: body.answer, actorRole: actor.role, actor: 'host' });
});

route('POST', '/api/rooms/:id/qna/:questionId/upvote', (_req, _url, { id: roomId, questionId, body, actor }) => {
  requireRoom(actor, roomId);
  const participantId = actor.kind === 'host' ? body.participantId : actor.participantId;
  return roomService.upvoteQuestion(roomId, questionId, participantId);
});

/* ------------------------------ AI boundary ------------------------------ */

route('POST', '/api/rooms/:id/ai/mode', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return roomService.setAIMode(roomId, body.mode, { actor: 'host', grantedBy: body.mode });
});

route('POST', '/api/rooms/:id/ai/organize', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  const room = roomService.get(roomId);
  return meetingAgent.agenda(roomId, { raw: body.raw || room.title, people: body.people || [] });
});

route('POST', '/api/rooms/:id/ai/command', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.command(roomId, body.query || '');
});

route('POST', '/api/rooms/:id/ai/summarize', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.summarize(roomId, { sinceMinutes: body.sinceMinutes || null });
});

route('POST', '/api/rooms/:id/ai/minutes', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.minutes(roomId, { actor: actor.kind === 'host' ? 'host' : 'ai' });
});

route('POST', '/api/rooms/:id/ai/followup', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.followUp(roomId);
});

route('GET', '/api/rooms/:id/ai/report', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.report(roomId);
});

route('POST', '/api/rooms/:id/ai/whiteboard-plan', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return meetingAgent.whiteboardToPlan(roomId);
});

route('GET', '/api/rooms/:id/ai/actions', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const room = roomService.get(roomId);
  return { actions: room.actions || [], decisions: room.decisions || [], openQuestions: room.openQuestions || [] };
});

route('POST', '/api/rooms/:id/ai/actions/:actionId', (_req, _url, { id: roomId, actionId, body, actor }) => {
  requireHost(actor);
  return meetingAgent.approveAction(roomId, actionId, { actor: 'host', value: body.approved !== false });
});

route('POST', '/api/rooms/:id/ai/decisions/:decisionId', (_req, _url, { id: roomId, decisionId, body, actor }) => {
  requireHost(actor);
  return meetingAgent.approveDecision(roomId, decisionId, { actor: 'host', value: body.approved !== false });
});

/* -------------------------------- minutes -------------------------------- */

route('GET', '/api/rooms/:id/minutes', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const room = roomService.get(roomId);
  return room.minutes || meetingAgent.minutes(roomId);
});

route('POST', '/api/rooms/:id/minutes/approve', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return meetingAgent.approveMinutes(roomId, { actor: 'host', edits: body.edits || null });
});

route('POST', '/api/rooms/:id/minutes/discard', (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  return meetingAgent.discardMinutes(roomId, { actor: 'host' });
});

/* ------------------------------ live studio ------------------------------ */

route('GET', '/api/rooms/:id/studio', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return getStudio(roomId);
});

route('PUT', '/api/rooms/:id/scenes', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return { scenes: saveScenes(roomId, body.scenes, { actor: 'host' }) };
});

route('POST', '/api/rooms/:id/scenes/:sceneId/switch', (_req, _url, { id: roomId, sceneId, actor }) => {
  requireRoom(actor, roomId);
  return switchScene(roomId, sceneId, { actor: 'host', actorRole: actor.kind === 'host' ? 'host' : actor.role });
});

route('POST', '/api/rooms/:id/lower-third', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return setLowerThird(roomId, body, { actor: 'host' });
});

route('POST', '/api/rooms/:id/countdown', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return setCountdown(roomId, body);
});

route('GET', '/api/rooms/:id/destinations', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  return listDestinations(roomId);
});

route('POST', '/api/rooms/:id/destinations', (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  return addDestination(roomId, body, { actor: 'host' });
});

route('DELETE', '/api/rooms/:id/destinations/:destId', (_req, _url, { id: roomId, destId, actor }) => {
  requireHost(actor);
  return removeDestination(roomId, destId, { actor: 'host' });
});

route('POST', '/api/rooms/:id/stream/start', (_req, _url, { id: roomId, body, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'stream:start');
  return roomService.startStream(roomId, {
    destinations: body.destinationIds || null,
    actorRole: actor.role,
    actor: 'host'
  });
});

route('POST', '/api/rooms/:id/stream/stop', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  requireRole(actor, 'stream:stop');
  return roomService.stopStream(roomId, { actorRole: actor.role, actor: 'host' });
});

/* ------------------------------- organizer ------------------------------- */

route('POST', '/api/ai/organize', async (_req, _url, { body, actor }) => {
  requireHost(actor);
  return meetingAgent.organize(body.request || body.raw || '', { timeZone: body.timeZone || config.timeZone });
});

route('GET', '/api/ai/drafts', (_req, _url, { actor }) => {
  requireHost(actor);
  return { drafts: store.state.pendingDrafts || [] };
});

route('POST', '/api/ai/drafts/:draftId/approve', async (_req, _url, { draftId, body, actor }) => {
  requireHost(actor);
  const result = meetingAgent.approveDraft(draftId, { slotIndex: body.slotIndex || 0, actor: 'host' });
  const room = roomService.get(result.room.id);
  const calendar = await pushEventToCalendar(room, { actor: 'host' }).catch(() => ({ pushed: false, unavailable: true }));
  return { ...result, calendar };
});

route('DELETE', '/api/ai/drafts/:draftId', (_req, _url, { draftId, actor }) => {
  requireHost(actor);
  store.state.pendingDrafts = (store.state.pendingDrafts || []).filter((d) => d.id !== draftId);
  store.persist();
  return { discarded: true };
});

route('GET', '/api/ai/providers', () => providerStatus());

route('POST', '/api/ai/provider', (_req, _url, { body, actor }) => {
  requireHost(actor);
  return setAIProvider({ kind: body.kind, model: body.model, allowRemote: Boolean(body.allowRemote) }, { actor: 'host' });
});

route('GET', '/api/ai/activity', (_req, url) => {
  const roomId = url.searchParams.get('roomId');
  return {
    activity: listActivity({
      roomId: roomId || null,
      kind: url.searchParams.get('kind') || null,
      limit: Number(url.searchParams.get('limit') || 80)
    }),
    summary: activitySummary()
  };
});

route('DELETE', '/api/ai/activity', (_req, url, { actor }) => {
  requireHost(actor);
  return clearActivity({ roomId: url.searchParams.get('roomId') || null, actor: 'host' });
});

/* --------------------------------- memory -------------------------------- */

route('GET', '/api/memory/search', (_req, url) =>
  meetingAgent.search(url.searchParams.get('q') || '', { limit: Number(url.searchParams.get('limit') || 12) })
);

/* ------------------------------ integrations ----------------------------- */

route('GET', '/api/integrations', () => integrationStatus());

route('POST', '/api/rooms/:id/calendar/push', async (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  const room = roomService.get(roomId);
  return pushEventToCalendar(room, { actor: 'host' });
});

route('POST', '/api/rooms/:id/calendar/cancel', async (_req, _url, { id: roomId, actor }) => {
  requireHost(actor);
  const room = roomService.get(roomId);
  return cancelCalendarEvent(room, { actor: 'host' });
});

route('GET', '/api/rooms/:id/ics', (_req, _url, { id: roomId, actor }) => {
  requireRoom(actor, roomId);
  const room = roomService.get(roomId);
  return {
    filename: `${room.code}.ics`,
    ics: buildICS({
      title: room.title,
      start: room.scheduledFor,
      end: new Date(new Date(room.scheduledFor).getTime() + room.durationMinutes * 60_000).toISOString(),
      timeZone: room.timeZone,
      attendees: room.invitees || [],
      location: `${config.publicUrl}/r/${room.code}`,
      notes: room.purpose
    })
  };
});

route('GET', '/api/integrations/zenbox/suggestions', async (_req, url, { actor }) => {
  requireHost(actor);
  return scanEmailForMeetings({ limit: Number(url.searchParams.get('limit') || 20) });
});

route('POST', '/api/rooms/:id/followup/zenbox', async (_req, _url, { id: roomId, body, actor }) => {
  requireHost(actor);
  const room = roomService.get(roomId);
  roomService.requireAI(roomId, 'act:email');
  const draft = room.followUpDraft || meetingAgent.followUp(roomId);
  const result = await draftFollowUpInZenBox(draft, { actor: 'host' });
  if (result.handedOff) {
    draft.status = 'handed-off';
    draft.handedOffAt = nowIso();
    store.persist();
  }
  return { ...result, draft };
});

/* ------------------------------- permissions ----------------------------- */

route('GET', '/api/permissions', () => ({
  roles: Object.entries(ROLES).map(([key, label]) => ({ key, label, capabilities: ROLE_CAPABILITIES[key] })),
  aiModes: Object.entries(AI_MODES).map(([key, value]) => ({ key, ...value })),
  admissions: ADMISSION_POLICIES,
  storage: Object.values(STORAGE_ADAPTERS),
  meetingTypes: MEETING_TYPES
}));

route('GET', '/api/privacy', () => ({
  aiProvider: getAIProvider(),
  roomsWithAI: store.state.rooms.filter((r) => r.aiMode !== 'off').length,
  roomsWithoutAI: store.state.rooms.filter((r) => r.aiMode === 'off').length,
  recordings: {
    count: store.state.recordings.length,
    note: 'ZMeet stores references only. Media stays in organizer storage.'
  },
  retention: {
    default: store.state.identity.organization.storagePolicy,
    days: store.state.rooms[0]?.storage?.retentionDays || 90
  },
  statement:
    'ZMeet does not monetize meeting content or personal data. AI access is per-room, explicit and revocable. Group calls are transport-encrypted, not end-to-end encrypted, and the UI says so.',
  secureModeNote:
    'ZMeet Secure Sessions add host-controlled admission, verification and signed access. They do not claim end-to-end encryption. If you enable secure mode with AI or cloud recording, the server necessarily sees the media — the UI states this before you enable it.'
}));

/* -------------------------------- dispatch ------------------------------- */

function serveStatic(req, res, pathname) {
  let rel = pathname;
  if (pathname === '/') rel = '/index.html';
  else if (pathname.startsWith('/r/')) rel = '/room.html';
  else if (/^\/join\//.test(pathname)) rel = '/join.html';

  const filePath = path.join(PUBLIC_DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, securityHeaders);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...securityHeaders });
      return res.end('404 Not Found');
    }
    const ext = path.extname(filePath);
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=300';
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': cache,
      ...securityHeaders
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
}

export function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS' });
      return res.end();
    }

    if (!sameOrigin(req)) {
      return sendJson(res, 403, { error: 'Cross-origin state change rejected (CSRF guard).' });
    }

    const limit = rateLimit(requestKey(req), { limit: req.method === 'GET' ? 400 : 120 });
    if (!limit.ok) {
      return sendJson(res, 429, { error: 'Too many requests', retryAfter: limit.retryAfter });
    }

    if (pathname.startsWith('/api/')) {
      const match = matchRoute(req.method, pathname);
      if (!match) return sendJson(res, 404, { error: `No route for ${req.method} ${pathname}` });

      try {
        const actor = identify(req);
        const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readBody(req) : {};
        const result = await match.handler(req, url, { ...match.params, body, actor, query: url.searchParams });

        // `/api/session` sets the host cookie in-process; never expose the token in a header.
        if (result && result.setCookie) {
          res.setHeader('Set-Cookie', result.setCookie);
          const { setCookie, ...rest } = result;
          return sendJson(res, 200, rest);
        }

        if (pathname.endsWith('/ics') && result?.ics) {
          res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${result.filename}"`,
            ...securityHeaders
          });
          return res.end(result.ics);
        }

        return sendJson(res, 200, result ?? { ok: true });
      } catch (err) {
        return sendError(res, err);
      }
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, securityHeaders);
      return res.end('Method Not Allowed');
    }
    return serveStatic(req, res, pathname);
  });

  server.on('upgrade', (req, socket, head) => handleUpgrade(req, socket, head));

  return server;
}

/* ---------------------------------- boot --------------------------------- */

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const seedResult = seedIfEmpty();
  const server = createServer();
  server.listen(config.port, config.host, () => {
    console.log('');
    console.log('  ZMeet — Meet. Present. Decide. Done.');
    console.log(`  → http://${config.host}:${config.port}`);
    console.log('');
    console.log(`  Media mode   : ${config.media.mode} (signaling only, media is peer-to-peer)`);
    console.log(`  AI provider  : ${getAIProvider().kind} (${getAIProvider().model})`);
    console.log(`  Store        : ${DATA_DIR}`);
    console.log(`  Host key     : .data/host-token  (needed for non-localhost access)`);
    if (seedResult.seeded) {
      console.log(`  Demo data    : seeded ${seedResult.rooms} rooms · live room /r/${seedResult.liveRoom.code}`);
    }
    console.log('');
    console.log('  Siblings: ZCal :4300 · ZMail :4200 (optional, auto-detected)');
    console.log('');
  });

  const shutdown = () => {
    try {
      store.flush();
    } catch {
      /* ignore */
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export { HOST_KEY };
