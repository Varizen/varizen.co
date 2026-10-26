/**
 * ZMeet — Room Service. (was: ZenMeet)
 *
 * Owns the meeting sandbox (prompt §5): participants, media state, chat, files,
 * whiteboard, polls, waiting room, layout, recording, streaming and the AI
 * boundary for each room. Nothing here touches a real media path — media stays
 * peer-to-peer or on an SFU. This is the authoritative state machine.
 *
 * Permission model is enforced here, not in the UI.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { logActivity } from './aiActivity.js';
import {
  ADMISSION_POLICIES,
  AI_MODES,
  DEFAULT_LAYOUT_BY_TYPE,
  MEETING_TYPES,
  ROLES,
  ROLE_RANK,
  aiCan,
  capabilitiesFor,
  isAtLeast,
  roleCan
} from './permissions.js';
import { addMinutes, clamp, id, nowIso, roomCode, truncate } from './util.js';

const MAX_CHAT = 400;
const MAX_EVENTS = 120;

function fail(message, status = 400, extra = {}) {
  return Object.assign(new Error(message), { status, ...extra });
}

/* ------------------------------------------------------------------ */
/* Live room registry — in-memory, authoritative while a room is open   */
/* ------------------------------------------------------------------ */

class RoomService {
  constructor() {
    /** roomId -> Set<connection> */
    this.connections = new Map();
    /** roomId -> timer handle */
    this.timers = new Map();
    this.bootstrapped = false;
  }

  /* ------------------------------ bootstrap ------------------------------ */

  bootstrap() {
    if (this.bootstrapped) return;
    this.bootstrapped = true;
    if (!Array.isArray(store.state.rooms)) store.state.rooms = [];
  }

  /* ------------------------------- queries ------------------------------- */

  list({ filter = 'upcoming' } = {}) {
    this.bootstrap();
    const rooms = [...store.state.rooms];
    const now = Date.now();

    const buckets = {
      live: (r) => r.status === 'live',
      upcoming: (r) => r.status === 'scheduled' && new Date(r.scheduledFor).getTime() >= now - 60 * 60_000,
      scheduled: (r) => r.status === 'scheduled',
      ended: (r) => r.status === 'ended',
      recurring: (r) => Boolean(r.recurrence),
      recorded: (r) => (r.recordings || []).length > 0 || r.recording?.enabled
    };

    const predicate = buckets[filter];
    const list = predicate ? rooms.filter(predicate) : rooms;
    return list
      .sort((a, b) => {
        const aLive = a.status === 'live' ? 0 : 1;
        const bLive = b.status === 'live' ? 0 : 1;
        if (aLive !== bLive) return aLive - bLive;
        return new Date(b.scheduledFor || b.createdAt).getTime() - new Date(a.scheduledFor || a.createdAt).getTime();
      })
      .map((room) => this.summary(room));
  }

  summary(room) {
    const participants = room.participants || [];
    return {
      id: room.id,
      code: room.code,
      title: room.title,
      type: room.type,
      typeLabel: MEETING_TYPES[room.type]?.label || room.type,
      status: room.status,
      scheduledFor: room.scheduledFor,
      durationMinutes: room.durationMinutes,
      organizer: room.organizer,
      host: room.host,
      recurrence: room.recurrence || null,
      secure: Boolean(room.secure),
      layout: room.layout,
      aiMode: room.aiMode,
      aiModeLabel: AI_MODES[room.aiMode]?.label || room.aiMode,
      admission: room.admission,
      participants: participants.filter((p) => p.state === 'joined').length,
      invited: (room.invitees || []).length,
      waiting: (room.waitingRoom || []).length,
      hasRecording: Boolean(room.recording?.enabled || (room.recordings || []).length),
      joinUrl: `${store.state.settings.publicBase || ''}/r/${room.code}`,
      unreadChat: 0,
      startedAt: room.startedAt || null,
      endedAt: room.endedAt || null,
      tags: room.tags || []
    };
  }

  get(roomId) {
    this.bootstrap();
    const room = store.state.rooms.find((r) => r.id === roomId || r.code === roomId);
    if (!room) throw fail('Room not found', 404);
    return room;
  }

  /* ------------------------------- creation ------------------------------ */

  create(input = {}) {
    this.bootstrap();
    const type = MEETING_TYPES[input.type] ? input.type : 'private';
    const defaults = MEETING_TYPES[type].defaults;
    const identity = store.state.identity;

    const scheduledFor = input.scheduledFor ? new Date(input.scheduledFor).toISOString() : nowIso();
    const durationMinutes = clamp(Number(input.durationMinutes) || 30, 5, 600);
    const organizer = input.organizer || {
      organization: identity.organization.name,
      organizationId: identity.organization.id,
      name: identity.name,
      email: identity.email
    };

    const room = {
      id: id('room'),
      code: roomCode(),
      title: input.title?.trim() || 'Instant meeting',
      type,
      purpose: input.purpose || '',
      status: input.startNow ? 'live' : 'scheduled',
      scheduledFor,
      durationMinutes,
      timeZone: input.timeZone || store.state.settings.timeZone,
      organizer,
      host: input.host || { name: organizer.name, email: organizer.email },
      cohosts: [],
      invitees: (input.invitees || []).map((person) => ({
        id: id('inv'),
        name: person.name || person.email,
        email: person.email,
        role: person.role || 'participant',
        invitedAt: nowIso(),
        status: 'invited'
      })),
      participants: [],
      waitingRoom: [],
      admission: input.admission || (defaults.waitingRoom ? 'waiting' : 'open'),
      secure: Boolean(input.secure ?? defaults.secure),
      layout: input.layout || DEFAULT_LAYOUT_BY_TYPE[type] || defaults.layout,
      layoutLocked: false,
      aiMode: AI_MODES[input.aiMode] ? input.aiMode : defaults.aiMode || store.state.aiProvider?.mode || 'assistant',
      aiCapabilityGrants: [],
      agenda: (input.agenda || []).map((item, idx) => ({
        id: `ag_${idx + 1}`,
        text: typeof item === 'string' ? item : item.text,
        minutes: typeof item === 'object' ? item.minutes || null : null,
        done: false
      })),
      brief: input.brief || null,
      chat: [],
      files: [],
      whiteboard: { strokes: [], notes: [], updatedAt: null },
      polls: [],
      qna: [],
      breakoutRooms: [],
      scenes: [],
      recording: { enabled: false, options: null, startedAt: null, startedBy: null },
      recordings: [],
      transcript: [],
      notes: [],
      decisions: [],
      actions: [],
      openQuestions: [],
      highlights: [],
      minutes: null,
      report: null,
      recurrence: input.recurrence || null,
      tags: input.tags || [],
      storage: input.storage || {
        policy: identity.organization.storagePolicy,
        adapter: 'organization',
        location: `${identity.organization.name} workspace`,
        retentionDays: 90
      },
      streaming: { active: false, destinations: [], startedAt: null },
      createdAt: nowIso(),
      startedAt: input.startNow ? nowIso() : null,
      endedAt: null
    };

    if (room.status === 'live') room.startedAt = nowIso();
    room.brief = room.brief || this.defaultBrief(room);

    const ROOM_CAP = Number(process.env.ZENMEET_ROOM_CAP) > 0 ? Number(process.env.ZENMEET_ROOM_CAP) : 300;
    store.state.rooms = [room, ...store.state.rooms].slice(0, ROOM_CAP);
    store.persist();
    store.log('ROOM_CREATED', `Created “${room.title}” (${MEETING_TYPES[type].label}).`, {
      actor: organizer.email,
      roomId: room.id
    });
    logActivity({
      roomId: room.id,
      kind: 'room',
      title: 'Created meeting sandbox',
      detail: `${MEETING_TYPES[type].label} · ${durationMinutes} min · AI ${AI_MODES[room.aiMode].label}`,
      capability: null
    });

    return room;
  }

  defaultBrief(room) {
    return {
      purpose: room.purpose || room.title,
      participants: (room.invitees || []).length + 1,
      agenda: room.agenda.length ? room.agenda.map((a) => a.text) : ['Status', 'Open items', 'Decisions', 'Next steps'],
      previousDiscussions: 0,
      documents: 0,
      outstandingActions: 0,
      generatedAt: nowIso(),
      editedBy: null
    };
  }

  updateBrief(roomId, patch) {
    const room = this.get(roomId);
    room.brief = { ...this.defaultBrief(room), ...(room.brief || {}), ...patch, editedBy: 'host', generatedAt: nowIso() };
    if (Array.isArray(patch.agenda)) {
      room.agenda = patch.agenda.map((text, idx) => room.agenda[idx] || { id: `ag_${idx + 1}`, text, done: false });
      room.agenda = patch.agenda.map((text, idx) => ({
        id: `ag_${idx + 1}`,
        text,
        minutes: room.agenda[idx]?.minutes || null,
        done: false
      }));
    }
    store.persist();
    store.log('BRIEF_UPDATED', `Meeting brief edited for “${room.title}”.`, { actor: 'host', roomId: room.id });
    return room.brief;
  }

  patch(roomId, patch, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    const allowed = ['title', 'purpose', 'scheduledFor', 'durationMinutes', 'layout', 'admission', 'secure', 'tags', 'timeZone', 'recurrence'];
    for (const key of allowed) {
      if (patch[key] !== undefined) room[key] = patch[key];
    }
    if (patch.aiMode) this.setAIMode(roomId, patch.aiMode, { actor });
    if (patch.agenda) {
      room.agenda = patch.agenda.map((item, idx) => ({
        id: `ag_${idx + 1}`,
        text: typeof item === 'string' ? item : item.text,
        minutes: typeof item === 'object' ? item.minutes || null : null,
        done: Boolean(item.done)
      }));
    }
    if (patch.startNow && room.status !== 'live') this.start(roomId);
    store.persist();
    store.log('ROOM_UPDATED', `Updated “${room.title}”.`, { actor, roomId: room.id });
    return room;
  }

  /* ------------------------------- lifecycle ----------------------------- */

  start(roomId, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (room.status === 'live') return room;
    room.status = 'live';
    room.startedAt = nowIso();
    room.endedAt = null;
    store.persist();
    store.log('ROOM_STARTED', `“${room.title}” started.`, { actor, roomId: room.id });
    logActivity({
      roomId: room.id,
      kind: 'room',
      title: 'Meeting started',
      detail: 'Sandbox opened for participants.',
      capability: null
    });
    this.broadcast(room.id, { t: 'room', event: 'started', roomId: room.id, startedAt: room.startedAt });
    return room;
  }

  end(roomId, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    room.status = 'ended';
    room.endedAt = nowIso();
    if (room.recording?.enabled) {
      room.recording.enabled = false;
      room.recording.stoppedAt = nowIso();
    }
    room.streaming = { active: false, destinations: room.streaming?.destinations || [], startedAt: null };
    for (const participant of room.participants) {
      if (participant.state === 'joined') participant.state = 'left';
    }
    store.persist();
    store.log('ROOM_ENDED', `“${room.title}” ended.`, { actor, roomId: room.id });
    logActivity({
      roomId: room.id,
      kind: 'room',
      title: 'Meeting ended',
      detail: 'AI is preparing minutes and follow-ups.',
      capability: null
    });
    this.broadcast(room.id, { t: 'room', event: 'ended', roomId: room.id, endedAt: room.endedAt });
    return room;
  }

  remove(roomId, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    store.state.rooms = store.state.rooms.filter((r) => r.id !== room.id);
    store.persist();
    store.log('ROOM_DELETED', `Deleted “${room.title}”.`, { actor, roomId: room.id });
    return { deleted: true, roomId: room.id };
  }

  /* ------------------------------ participants --------------------------- */

  /**
   * Guest entry (prompt §33). The flow is deliberately tiny: link → name → join,
   * unless the host's admission policy requires authentication.
   */
  join(roomId, { name, email, role = null, participantId = null, authenticated = false } = {}) {
    const room = this.get(roomId);
    const cleanName = truncate(name || email || 'Guest', 60);

    if (room.admission === 'authenticated' && !authenticated) {
      throw fail('This room requires sign-in before joining.', 401, { requiresAuth: true });
    }
    if (room.admission === 'verified' && !authenticated) {
      throw fail('This secure room requires a verified identity.', 401, { requiresAuth: true, verified: true });
    }
    if ((room.participants || []).filter((p) => p.state === 'joined').length >= 500) {
      throw fail('Room is full', 403);
    }

    const existing = participantId
      ? room.participants.find((p) => p.id === participantId)
      : email
        ? room.participants.find((p) => p.email === email && p.state !== 'left')
        : null;

    const invitee = email ? (room.invitees || []).find((i) => i.email === email) : null;
    const assignedRole = existing?.role || role || invitee?.role || (room.type === 'webinar' || room.type === 'live' ? 'audience' : 'participant');

    const needsAdmission =
      room.admission === 'waiting' ||
      room.admission === 'authenticated' ||
      room.admission === 'verified' ||
      assignedRole === 'audience';

    if (existing && existing.state === 'joined') {
      existing.lastSeenAt = nowIso();
      existing.name = existing.name || cleanName;
      store.persist();
      return { participant: existing, room: this.publicView(room), admitted: true, waiting: false };
    }

    const participant = existing || {
      id: id('part'),
      name: cleanName,
      email: email || '',
      role: assignedRole,
      state: 'joined',
      mic: false,
      camera: false,
      screen: false,
      handRaised: false,
      isHost: false,
      joinedAt: nowIso(),
      lastSeenAt: nowIso(),
      connectionCount: 0,
      colorIndex: (room.participants.length + 1) % 8
    };

    participant.name = participant.name || cleanName;
    participant.email = participant.email || email || '';

    if (needsAdmission && !participant.isHost) {
      participant.state = 'waiting';
      room.waitingRoom = room.waitingRoom || [];
      if (!room.waitingRoom.find((w) => w.participantId === participant.id)) {
        room.waitingRoom.push({
          id: id('wait'),
          participantId: participant.id,
          name: participant.name,
          email: participant.email,
          requestedAt: nowIso(),
          requestedRole: assignedRole,
          message: null
        });
      }
      if (!room.participants.find((p) => p.id === participant.id)) room.participants.push(participant);
      store.persist();
      store.log('WAITING_ROOM_JOIN', `${participant.name} is waiting for admission.`, {
        actor: participant.email || 'guest',
        roomId: room.id
      });
      this.broadcast(room.id, {
        t: 'waiting',
        roomId: room.id,
        waiting: room.waitingRoom.map((w) => ({ id: w.id, name: w.name, email: w.email, requestedAt: w.requestedAt })),
        count: room.waitingRoom.length
      });
      return {
        participant,
        room: this.publicView(room),
        admitted: false,
        waiting: true,
        message: 'The host will admit you shortly.'
      };
    }

    participant.state = 'joined';
    participant.joinedAt = participant.joinedAt || nowIso();
    if (!room.participants.find((p) => p.id === participant.id)) room.participants.push(participant);
    room.waitingRoom = (room.waitingRoom || []).filter((w) => w.participantId !== participant.id);
    store.persist();
    store.log('PARTICIPANT_JOINED', `${participant.name} joined “${room.title}”.`, {
      actor: participant.email || 'guest',
      roomId: room.id
    });
    this.broadcast(room.id, { t: 'room', event: 'participant-joined', participant: this.publicParticipant(participant) });
    return { participant, room: this.publicView(room), admitted: true, waiting: false };
  }

  leave(roomId, participantId) {
    const room = this.get(roomId);
    const participant = room.participants.find((p) => p.id === participantId);
    if (!participant) return { left: false };
    participant.state = 'left';
    participant.mic = false;
    participant.camera = false;
    participant.screen = false;
    participant.leftAt = nowIso();
    store.persist();
    this.broadcast(room.id, { t: 'room', event: 'participant-left', participantId });
    return { left: true };
  }

  setMedia(roomId, participantId, patch) {
    const room = this.get(roomId);
    const participant = room.participants.find((p) => p.id === participantId);
    if (!participant) throw fail('Participant not found', 404);

    if (patch.mic !== undefined) {
      this.assertSelf(participant, 'mic:self');
      participant.mic = Boolean(patch.mic);
    }
    if (patch.camera !== undefined) {
      this.assertSelf(participant, 'camera:self');
      participant.camera = Boolean(patch.camera);
    }
    if (patch.screen !== undefined) {
      this.assertSelf(participant, 'screen:share');
      participant.screen = Boolean(patch.screen);
      if (participant.screen) {
        room.layout = room.type === 'presentation' ? 'presentation' : room.layout;
      }
    }
    if (patch.handRaised !== undefined) {
      participant.handRaised = Boolean(patch.handRaised);
      if (participant.handRaised) {
        participant.handRaisedAt = nowIso();
        store.log('HAND_RAISED', `${participant.name} raised a hand.`, { actor: participant.name, roomId: room.id });
      }
    }
    participant.lastSeenAt = nowIso();
    store.persist();
    this.broadcast(room.id, { t: 'room', event: 'media', participantId, media: this.publicParticipant(participant) });
    return this.publicParticipant(participant);
  }

  assertSelf(participant, capability) {
    if (!roleCan(participant.role, capability)) {
      throw fail(
        `${ROLES[participant.role]} cannot ${capability.replace(':', ' ')}. The host must change this participant's role first.`,
        403,
        { capability, needsRole: true }
      );
    }
  }

  /** Host/moderator participant management (prompt §16). */
  moderate(roomId, targetId, action, { actorRole = 'host', actor = 'host', value } = {}) {
    const room = this.get(roomId);
    const target = room.participants.find((p) => p.id === targetId);
    if (!target) throw fail('Participant not found', 404);
    if (target.isHost && action !== 'mute') throw fail('The host cannot be moderated in this way.', 403);

    const allowed = {
      mute: 'participant:mute',
      unmute: 'participant:mute',
      camera: 'participant:camera',
      screen: 'participant:screen',
      chat: 'participant:chat',
      promote: 'participant:promote',
      demote: 'participant:demote',
      remove: 'participant:remove',
      waiting: 'participant:waiting'
    };
    const capability = allowed[action];
    if (!capability) throw fail(`Unknown moderation action “${action}”`, 400);
    if (!roleCan(actorRole, capability)) {
      throw fail(`Your role cannot perform “${action}”.`, 403, { capability });
    }
    if (ROLE_RANK[target.role] >= ROLE_RANK[actorRole] && !target.isHost) {
      throw fail('You cannot moderate a peer or higher-ranked participant.', 403);
    }

    switch (action) {
      case 'mute':
        target.mic = false;
        target.forceMuted = true;
        break;
      case 'unmute':
        target.mic = true;
        target.forceMuted = false;
        break;
      case 'camera':
        target.camera = Boolean(value);
        target.forceCameraOff = !value;
        break;
      case 'screen':
        target.screen = Boolean(value);
        target.screenSharingBlocked = !value;
        break;
      case 'chat':
        target.chatRestricted = value === false;
        break;
      case 'promote':
        target.role = this.nextRole(target.role);
        break;
      case 'demote':
        target.role = this.previousRole(target.role);
        break;
      case 'remove':
        target.state = 'removed';
        target.mic = false;
        target.camera = false;
        target.screen = false;
        break;
      case 'waiting':
        target.state = 'waiting';
        room.waitingRoom = room.waitingRoom || [];
        room.waitingRoom.push({
          id: id('wait'),
          participantId: target.id,
          name: target.name,
          email: target.email,
          requestedAt: nowIso(),
          requestedRole: target.role,
          message: 'Moved to the waiting room by the host.'
        });
        break;
      default:
        break;
    }

    store.persist();
    store.log('MODERATION', `${action} applied to ${target.name}.`, { actor, roomId: room.id, detail: { action } });
    this.broadcast(room.id, {
      t: 'room',
      event: 'moderated',
      action,
      participant: this.publicParticipant(target)
    });
    return this.publicParticipant(target);
  }

  nextRole(role) {
    const order = ['audience', 'participant', 'speaker', 'cohost', 'moderator'];
    const idx = order.indexOf(role);
    return idx === -1 || idx === order.length - 1 ? role : order[idx + 1];
  }

  previousRole(role) {
    const order = ['audience', 'participant', 'speaker', 'cohost', 'moderator'];
    const idx = order.indexOf(role);
    return idx <= 0 ? role : order[idx - 1];
  }

  setRole(roomId, targetId, role, { actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    const target = room.participants.find((p) => p.id === targetId);
    if (!target) throw fail('Participant not found', 404);
    if (!ROLES[role]) throw fail('Unknown role', 400);
    if (target.isHost && role !== 'host') throw fail('The host role is fixed for this meeting.', 403);
    if (!roleCan(actorRole, role === 'host' ? 'room:settings' : 'participant:promote')) {
      throw fail('Your role cannot change participant roles.', 403);
    }
    if (ROLE_RANK[role] >= ROLE_RANK[actorRole] && role !== 'host') {
      throw fail('You cannot grant a role equal to or above your own.', 403);
    }
    target.role = role;
    store.persist();
    store.log('ROLE_CHANGED', `${target.name} is now ${ROLES[role]}.`, { actor, roomId: room.id });
    this.broadcast(room.id, { t: 'room', event: 'role', participant: this.publicParticipant(target) });
    return this.publicParticipant(target);
  }

  /* ------------------------------ waiting room --------------------------- */

  admit(roomId, waitingId, { actorRole = 'host', actor = 'host', admit = true, message = null } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, admit ? 'waiting:admit' : 'waiting:reject')) {
      throw fail('Your role cannot manage the waiting room.', 403);
    }
    const entry = (room.waitingRoom || []).find((w) => w.id === waitingId || w.participantId === waitingId);
    if (!entry) throw fail('Waiting-room entry not found', 404);

    const participant = room.participants.find((p) => p.id === entry.participantId);
    if (admit) {
      if (participant) {
        participant.state = 'joined';
        participant.joinedAt = participant.joinedAt || nowIso();
        participant.mic = false;
        participant.camera = false;
      }
      room.waitingRoom = room.waitingRoom.filter((w) => w.id !== entry.id);
      store.log('ADMITTED', `${entry.name} admitted to “${room.title}”.`, { actor, roomId: room.id });
    } else {
      if (participant) participant.state = 'rejected';
      room.waitingRoom = room.waitingRoom.filter((w) => w.id !== entry.id);
      store.log('REJECTED', `${entry.name} was not admitted.`, { actor, roomId: room.id });
    }
    if (message && participant) participant.waitingMessage = message;
    store.persist();
    this.broadcast(room.id, {
      t: 'waiting',
      roomId: room.id,
      waiting: (room.waitingRoom || []).map((w) => ({ id: w.id, name: w.name, email: w.email, requestedAt: w.requestedAt })),
      count: (room.waitingRoom || []).length,
      resolved: { waitingId: entry.id, admitted: admit }
    });
    if (admit && participant) {
      this.broadcast(room.id, { t: 'room', event: 'participant-joined', participant: this.publicParticipant(participant) });
    }
    return { admitted: admit, participant: participant ? this.publicParticipant(participant) : null };
  }

  admitAll(roomId, opts = {}) {
    const room = this.get(roomId);
    const entries = [...(room.waitingRoom || [])];
    const results = entries.map((entry) => this.admit(roomId, entry.id, opts));
    return { admitted: results.filter((r) => r.admitted).length };
  }

  /* --------------------------------- AI mode ----------------------------- */

  setAIMode(roomId, mode, { actor = 'host', grantedBy = null } = {}) {
    const room = this.get(roomId);
    if (!AI_MODES[mode]) throw fail('Unknown AI mode', 400);
    const previous = room.aiMode;
    room.aiMode = mode;
    room.aiModeChangedAt = nowIso();
    room.aiModeChangedBy = actor;
    if (grantedBy) room.aiCapabilityGrants = AI_MODES[mode].capabilities;
    store.persist();
    store.log('AI_BOUNDARY_CHANGED', `AI boundary ${previous} → ${mode}.`, { actor, roomId: room.id });
    logActivity({
      roomId: room.id,
      kind: 'permission',
      title: 'AI permission changed',
      detail: `${AI_MODES[previous]?.label || previous} → ${AI_MODES[mode].label}`,
      capability: null
    });
    this.broadcast(room.id, { t: 'ai', event: 'mode', mode, label: AI_MODES[mode].label });
    return { mode, label: AI_MODES[mode].label, capabilities: AI_MODES[mode].capabilities };
  }

  requireAI(roomId, capability) {
    const room = this.get(roomId);
    if (!aiCan(room.aiMode, capability)) {
      throw fail(
        `AI capability “${capability}” is not granted at ${AI_MODES[room.aiMode].label}. Ask the host to widen the AI boundary.`,
        403,
        { capability, aiMode: room.aiMode, needsPermission: true }
      );
    }
    return true;
  }

  /* ---------------------------------- chat -------------------------------- */

  addChat(roomId, participantId, { text, kind = 'message', attachments = [] } = {}) {
    const room = this.get(roomId);
    const participant = room.participants.find((p) => p.id === participantId);
    if (!participant) throw fail('Participant not found', 404);
    if (!roleCan(participant.role, 'chat:send') || participant.chatRestricted) {
      throw fail('Chat is restricted for this participant.', 403);
    }
    const body = truncate(text, 4000);
    if (!body) throw fail('Message is empty', 400);

    const message = {
      id: id('msg'),
      participantId,
      author: participant.name,
      role: participant.role,
      kind,
      text: body,
      attachments,
      at: nowIso()
    };
    room.chat = [...(room.chat || []), message].slice(-MAX_CHAT);
    room.lastChatAt = message.at;
    store.persist();
    this.broadcast(room.id, { t: 'chat', message });
    return message;
  }

  /* --------------------------------- files -------------------------------- */

  addFile(roomId, { name, sizeBytes = 0, mime = 'application/octet-stream', kind = 'document', storage, addedBy = 'host', policy } = {}) {
    const room = this.get(roomId);
    if (!name) throw fail('File name is required', 400);
    const file = {
      id: id('file'),
      name,
      sizeBytes: Number(sizeBytes) || 0,
      mime,
      kind,
      addedBy,
      addedAt: nowIso(),
      policy: {
        viewOnly: policy?.viewOnly ?? false,
        downloadAllowed: policy?.downloadAllowed ?? true,
        collaborate: policy?.collaborate ?? false,
        aiAccess: policy?.aiAccess ?? false
      },
      storage: storage || {
        adapter: room.storage.adapter,
        location: room.storage.location,
        signedUrl: null,
        note: 'Stored in organizer storage. ZMeet keeps only this pointer.'
      },
      presented: false
    };
    room.files = [...(room.files || []), file];
    store.persist();
    store.log('FILE_SHARED', `${name} added to the meeting sandbox.`, { actor: addedBy, roomId: room.id });
    this.broadcast(room.id, { t: 'files', files: room.files });
    return file;
  }

  updateFilePolicy(roomId, fileId, policy, { actorRole = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'file:policy')) throw fail('Only the host can change file policy.', 403);
    const file = room.files.find((f) => f.id === fileId);
    if (!file) throw fail('File not found', 404);
    file.policy = { ...file.policy, ...policy };
    store.persist();
    this.broadcast(room.id, { t: 'files', files: room.files });
    return file;
  }

  presentFile(roomId, fileId, { participantId } = {}) {
    const room = this.get(roomId);
    const file = room.files.find((f) => f.id === fileId);
    if (!file) throw fail('File not found', 404);
    for (const f of room.files) f.presented = false;
    file.presented = true;
    room.layout = 'presentation';
    store.persist();
    this.broadcast(room.id, { t: 'files', files: room.files, presenting: file.id });
    return file;
  }

  /* ------------------------------- whiteboard ----------------------------- */

  whiteboard(roomId, { strokes, notes, actor = 'host' } = {}) {
    const room = this.get(roomId);
    room.whiteboard = {
      strokes: Array.isArray(strokes) ? strokes.slice(-400) : room.whiteboard?.strokes || [],
      notes: Array.isArray(notes) ? notes.slice(-120) : room.whiteboard?.notes || [],
      updatedAt: nowIso(),
      updatedBy: actor
    };
    store.persist();
    this.broadcast(room.id, { t: 'whiteboard', whiteboard: room.whiteboard });
    return room.whiteboard;
  }

  /* --------------------------------- polls -------------------------------- */

  createPoll(roomId, { question, options = [], anonymous = false, actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'poll:create')) throw fail('Your role cannot create polls.', 403);
    if (!question) throw fail('Poll question is required', 400);
    const poll = {
      id: id('poll'),
      question: truncate(question, 240),
      options: options.filter(Boolean).map((label, idx) => ({ id: `opt_${idx + 1}`, label: truncate(label, 120), votes: [] })),
      anonymous,
      status: 'open',
      createdAt: nowIso(),
      createdBy: actor,
      closedAt: null,
      result: null
    };
    if (poll.options.length < 2) throw fail('A poll needs at least two options', 400);
    room.polls = [...(room.polls || []), poll].slice(-20);
    store.persist();
    this.broadcast(room.id, { t: 'polls', polls: room.polls });
    return poll;
  }

  vote(roomId, pollId, participantId, optionId) {
    const room = this.get(roomId);
    const poll = room.polls.find((p) => p.id === pollId);
    if (!poll) throw fail('Poll not found', 404);
    if (poll.status !== 'open') throw fail('This poll is closed', 400);
    const participant = room.participants.find((p) => p.id === participantId);
    if (!participant || !roleCan(participant.role, 'poll:vote')) throw fail('You cannot vote in this poll.', 403);
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) throw fail('Option not found', 404);

    for (const o of poll.options) o.votes = o.votes.filter((v) => v.participantId !== participantId);
    option.votes.push({ participantId, name: poll.anonymous ? null : participant.name, at: nowIso() });
    store.persist();
    this.broadcast(room.id, { t: 'polls', polls: room.polls });
    return poll;
  }

  closePoll(roomId, pollId, { actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'poll:close')) throw fail('Your role cannot close polls.', 403);
    const poll = room.polls.find((p) => p.id === pollId);
    if (!poll) throw fail('Poll not found', 404);
    poll.status = 'closed';
    poll.closedAt = nowIso();
    const total = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
    const winner = [...poll.options].sort((a, b) => b.votes.length - a.votes.length)[0];
    poll.result = {
      total,
      winner: winner?.label || null,
      winnerVotes: winner?.votes.length || 0,
      summary:
        total && winner
          ? `${winner.votes.length}/${total} participants selected ${winner.label}.`
          : 'No votes were cast.'
    };
    room.polls = room.polls.map((p) => (p.id === poll.id ? poll : p));
    store.persist();
    this.broadcast(room.id, { t: 'polls', polls: room.polls });
    return poll;
  }

  /** Promote a closed poll result into a decision — requires host approval. */
  pollToDecision(roomId, pollId, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    const poll = room.polls.find((p) => p.id === pollId);
    if (!poll) throw fail('Poll not found', 404);
    if (poll.status !== 'closed') throw fail('Close the poll first.', 400);
    const decision = {
      id: id('dec'),
      text: `${poll.question} → ${poll.result.winner}`,
      source: 'poll',
      approvedBy: actor,
      approvedAt: nowIso(),
      confidence: poll.result.total ? poll.result.winnerVotes / poll.result.total : 0
    };
    room.decisions = [...(room.decisions || []), decision];
    room.report = null;
    store.persist();
    store.log('DECISION_RECORDED', decision.text, { actor, roomId: room.id });
    return decision;
  }

  /* ---------------------------------- Q&A --------------------------------- */

  askQuestion(roomId, participantId, question) {
    const room = this.get(roomId);
    const participant = room.participants.find((p) => p.id === participantId);
    if (!participant) throw fail('Participant not found', 404);
    const item = {
      id: id('qna'),
      participantId,
      author: participant.name,
      question: truncate(question, 600),
      at: nowIso(),
      upvotes: [],
      answered: false,
      answer: null
    };
    room.qna = [...(room.qna || []), item].slice(-100);
    store.persist();
    this.broadcast(room.id, { t: 'qna', qna: room.qna });
    return item;
  }

  answerQuestion(roomId, questionId, { answer, actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'qna:moderate')) throw fail('Your role cannot answer questions.', 403);
    const item = room.qna.find((q) => q.id === questionId);
    if (!item) throw fail('Question not found', 404);
    item.answered = true;
    item.answer = truncate(answer, 1200);
    item.answeredAt = nowIso();
    item.answeredBy = actor;
    store.persist();
    this.broadcast(room.id, { t: 'qna', qna: room.qna });
    return item;
  }

  upvoteQuestion(roomId, questionId, participantId) {
    const room = this.get(roomId);
    const item = room.qna.find((q) => q.id === questionId);
    if (!item) throw fail('Question not found', 404);
    item.upvotes = item.upvotes.includes(participantId)
      ? item.upvotes.filter((p) => p !== participantId)
      : [...item.upvotes, participantId];
    store.persist();
    this.broadcast(room.id, { t: 'qna', qna: room.qna });
    return item;
  }

  /* -------------------------------- layouts ------------------------------- */

  setLayout(roomId, layout, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    const valid = ['gallery', 'speaker', 'presentation', 'interview', 'webinar', 'ai', 'studio'];
    if (!valid.includes(layout)) throw fail('Unknown layout', 400);
    room.layout = layout;
    store.persist();
    this.broadcast(room.id, { t: 'layout', layout });
    store.log('LAYOUT_CHANGED', `Layout set to ${layout}.`, { actor, roomId: room.id });
    return { layout };
  }

  /* ------------------------------- recording ------------------------------ */

  record(roomId, { start = true, options = null, actor = 'host', actorRole = 'host' } = {}) {
    const room = this.get(roomId);
    const capability = start ? 'record:start' : 'record:stop';
    if (!roleCan(actorRole, capability)) throw fail('Your role cannot control recording.', 403);

    if (start) {
      room.recording = {
        enabled: true,
        options: options || { video: true, audio: true, presentation: true, screen: false, speakerTracks: false, transcript: true },
        startedAt: nowIso(),
        startedBy: actor
      };
      logActivity({
        roomId: room.id,
        kind: 'recording',
        title: 'Recording started',
        detail: `Stored under ${room.storage.policy} policy · ${room.storage.location}`,
        capability: 'record:start'
      });
    } else {
      const startedAt = room.recording?.startedAt;
      const durationSeconds = startedAt ? Math.round((Date.now() - new Date(startedAt).getTime()) / 1000) : 0;
      room.recording.enabled = false;
      room.recording.stoppedAt = nowIso();
      const item = {
        id: id('rec'),
        startedAt,
        stoppedAt: nowIso(),
        durationSeconds,
        options: room.recording.options,
        storage: room.storage,
        owner: room.organizer.organization,
        startedBy: room.recording.startedBy,
        shares: [],
        note: 'Media lives in organizer storage. ZMeet stores this reference only.'
      };
      room.recordings = [item, ...(room.recordings || [])];
      store.state.recordings = [item, ...(store.state.recordings || [])].slice(0, 200);
      logActivity({
        roomId: room.id,
        kind: 'recording',
        title: 'Recording stopped',
        detail: `${Math.round(durationSeconds / 60)} min · ${item.storage.location}`,
        capability: 'record:stop'
      });
    }
    store.persist();
    this.broadcast(room.id, { t: 'recording', recording: room.recording, recordings: room.recordings });
    return { recording: room.recording, recordings: room.recordings };
  }

  /* -------------------------------- streaming ----------------------------- */

  addStreamDestination(roomId, destination, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    const allowed = ['youtube', 'facebook', 'linkedin', 'custom-rtmp'];
    if (!allowed.includes(destination.platform)) throw fail('Unsupported streaming platform', 400);
    // Credentials are never stored here — only an opaque vault reference.
    // A raw key, masked fragment or any caller-supplied key material is
    // discarded; the record proves possession via a mask and a vault ref.
    const suppliedKey = destination.streamKeyRef || destination.streamKey;
    const hasKey = Boolean(suppliedKey);
    const entry = {
      id: id('dest'),
      platform: destination.platform,
      label: destination.label || destination.platform,
      // Never echo caller-supplied key material. Only ever a vault: reference.
      streamKeyRef: `vault:${room.id}:${destination.platform}`,
      masked: true,
      hasKey,
      status: 'ready',
      addedAt: nowIso(),
      addedBy: actor,
      note: 'Stream keys live in the credential vault, never in the meeting record.'
    };
    room.streaming.destinations = [...(room.streaming.destinations || []), entry];
    store.state.streams.destinations = [...(store.state.streams.destinations || []), entry].slice(0, 40);
    store.persist();
    store.log('STREAM_DESTINATION_ADDED', `${entry.label} destination added.`, { actor, roomId: room.id });
    return entry;
  }

  startStream(roomId, { destinations = null, actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'stream:start')) throw fail('Your role cannot start streaming.', 403);
    const list = destinations || (room.streaming.destinations || []).map((d) => d.id);
    if (!list.length) throw fail('Add a streaming destination first.', 400);
    room.streaming = {
      ...room.streaming,
      active: true,
      startedAt: nowIso(),
      startedBy: actor,
      destinations: (room.streaming.destinations || []).map((d) => ({
        ...d,
        status: list.includes(d.id) ? 'live' : 'ready'
      }))
    };
    store.persist();
    store.log('STREAM_STARTED', `Live stream started to ${list.length} destination(s).`, { actor, roomId: room.id });
    logActivity({
      roomId: room.id,
      kind: 'stream',
      title: 'Live stream started',
      detail: `${list.length} destination(s) · scene ${room.scenes?.find((s) => s.active)?.name || 'main'}`,
      capability: 'stream:start'
    });
    this.broadcast(room.id, { t: 'streaming', streaming: room.streaming });
    return room.streaming;
  }

  stopStream(roomId, { actorRole = 'host', actor = 'host' } = {}) {
    const room = this.get(roomId);
    if (!roleCan(actorRole, 'stream:stop')) throw fail('Your role cannot stop streaming.', 403);
    room.streaming = {
      ...room.streaming,
      active: false,
      stoppedAt: nowIso(),
      destinations: (room.streaming.destinations || []).map((d) => ({ ...d, status: 'ready' }))
    };
    store.persist();
    store.log('STREAM_STOPPED', 'Live stream stopped.', { actor, roomId: room.id });
    this.broadcast(room.id, { t: 'streaming', streaming: room.streaming });
    return room.streaming;
  }

  /* --------------------------------- scenes ------------------------------- */

  saveScenes(roomId, scenes, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    room.scenes = scenes.slice(0, 12).map((scene, idx) => ({
      id: scene.id || `scene_${idx + 1}`,
      name: scene.name || `Scene ${idx + 1}`,
      layout: scene.layout || 'presentation',
      slots: scene.slots || [],
      overlay: scene.overlay || null,
      lowerThird: scene.lowerThird || null,
      active: Boolean(scene.active)
    }));
    store.persist();
    this.broadcast(room.id, { t: 'scenes', scenes: room.scenes });
    store.log('SCENES_SAVED', `${room.scenes.length} scene(s) saved.`, { actor, roomId: room.id });
    return room.scenes;
  }

  switchScene(roomId, sceneId, { actor = 'host' } = {}) {
    const room = this.get(roomId);
    const scene = (room.scenes || []).find((s) => s.id === sceneId);
    if (!scene) throw fail('Scene not found', 404);
    room.scenes = room.scenes.map((s) => ({ ...s, active: s.id === sceneId }));
    room.layout = scene.layout || room.layout;
    store.persist();
    this.broadcast(room.id, { t: 'scenes', scenes: room.scenes, layout: room.layout });
    logActivity({
      roomId: room.id,
      kind: 'stream',
      title: `Scene switched to “${scene.name}”`,
      detail: `${scene.slots?.length || 0} source slot(s)`,
      capability: 'act:scene'
    });
    return scene;
  }

  /* ------------------------------- connection ----------------------------- */

  attach(roomId, connection) {
    if (!this.connections.has(roomId)) this.connections.set(roomId, new Set());
    this.connections.get(roomId).add(connection);
  }

  detach(roomId, connection) {
    const set = this.connections.get(roomId);
    if (!set) return;
    set.delete(connection);
    if (!set.size) this.connections.delete(roomId);
  }

  connectionCount(roomId) {
    return this.connections.get(roomId)?.size || 0;
  }

  broadcast(roomId, payload) {
    const set = this.connections.get(roomId);
    if (!set) return 0;
    let sent = 0;
    for (const connection of set) {
      try {
        connection.send(payload);
        sent += 1;
      } catch {
        /* a dead socket is removed by its own close handler */
      }
    }
    return sent;
  }

  broadcastAll(payload) {
    for (const roomId of this.connections.keys()) this.broadcast(roomId, payload);
  }

  /* -------------------------------- views -------------------------------- */

  publicParticipant(participant) {
    return {
      id: participant.id,
      name: participant.name,
      email: participant.email ? maskEmail(participant.email) : '',
      role: participant.role,
      roleLabel: ROLES[participant.role],
      state: participant.state,
      mic: Boolean(participant.mic),
      camera: Boolean(participant.camera),
      screen: Boolean(participant.screen),
      handRaised: Boolean(participant.handRaised),
      isHost: Boolean(participant.isHost),
      forceMuted: Boolean(participant.forceMuted),
      chatRestricted: Boolean(participant.chatRestricted),
      colorIndex: participant.colorIndex ?? 0,
      joinedAt: participant.joinedAt,
      capabilities: capabilitiesFor(participant.role)
    };
  }

  publicView(room) {
    return {
      id: room.id,
      code: room.code,
      title: room.title,
      type: room.type,
      typeLabel: MEETING_TYPES[room.type]?.label || room.type,
      status: room.status,
      scheduledFor: room.scheduledFor,
      durationMinutes: room.durationMinutes,
      timeZone: room.timeZone,
      organizer: room.organizer,
      host: room.host,
      admission: room.admission,
      admissionLabel: ADMISSION_POLICIES[room.admission],
      secure: room.secure,
      layout: room.layout,
      aiMode: room.aiMode,
      aiModeLabel: AI_MODES[room.aiMode]?.label || room.aiMode,
      aiCapabilities: AI_MODES[room.aiMode]?.capabilities || [],
      agenda: room.agenda,
      brief: room.brief,
      participants: room.participants
        .filter((p) => p.state === 'joined' || p.state === 'waiting')
        .map((p) => this.publicParticipant(p)),
      waitingCount: (room.waitingRoom || []).length,
      chat: room.chat,
      files: room.files,
      whiteboard: room.whiteboard,
      polls: room.polls,
      qna: room.qna,
      scenes: room.scenes,
      layoutLocked: room.layoutLocked,
      recording: room.recording,
      recordings: room.recordings,
      streaming: room.streaming,
      decisions: room.decisions,
      actions: room.actions,
      openQuestions: room.openQuestions,
      highlights: room.highlights,
      transcript: room.transcript,
      notes: room.notes,
      minutes: room.minutes,
      report: room.report,
      storage: room.storage,
      recurrence: room.recurrence,
      startedAt: room.startedAt,
      endedAt: room.endedAt,
      isAtLeastModerator: true
    };
  }

  /** Moderator-only view additions (waiting-room identities, full emails). */
  staffView(room) {
    const base = this.publicView(room);
    return {
      ...base,
      waitingRoom: room.waitingRoom || [],
      participants: room.participants.map((p) => ({
        ...this.publicParticipant(p),
        email: p.email,
        state: p.state
      }))
    };
  }

  stats() {
    this.bootstrap();
    const rooms = store.state.rooms;
    const live = rooms.filter((r) => r.status === 'live');
    const participants = live.reduce(
      (sum, r) => sum + (r.participants || []).filter((p) => p.state === 'joined').length,
      0
    );
    return {
      total: rooms.length,
      live: live.length,
      scheduled: rooms.filter((r) => r.status === 'scheduled').length,
      ended: rooms.filter((r) => r.status === 'ended').length,
      participants,
      waiting: rooms.reduce((sum, r) => sum + (r.waitingRoom || []).length, 0),
      recordings: store.state.recordings.length,
      aiActions: store.state.aiActivity.length,
      storagePolicy: store.state.identity.organization.storagePolicy,
      plan: store.state.identity.organization.plan
    };
  }
}

function maskEmail(email = '') {
  const [user, domain] = String(email).split('@');
  if (!domain) return email;
  const head = user.slice(0, 2);
  return `${head}${'•'.repeat(Math.max(2, Math.min(6, user.length - 2)))}@${domain}`;
}

export const roomService = new RoomService();
export { maskEmail };
