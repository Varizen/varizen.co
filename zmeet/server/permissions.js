/**
 * ZMeet — access model. (was: ZenMeet)
 *
 * Two orthogonal concepts, deliberately separate:
 *   ROLE          — what a human may do in the room (prompt §16)
 *   AI PERMISSION — what the meeting AI may do on the host's behalf (prompt §6)
 */

/* --------------------------------- roles --------------------------------- */

export const ROLES = {
  audience: 'Audience',
  participant: 'Participant',
  speaker: 'Speaker',
  cohost: 'Co-host',
  moderator: 'Moderator',
  host: 'Host'
};

export const ROLE_RANK = {
  audience: 0,
  participant: 1,
  speaker: 2,
  cohost: 3,
  moderator: 4,
  host: 5
};

/** Capabilities granted by each role. Audience gains nothing by accident. */
export const ROLE_CAPABILITIES = {
  audience: ['chat:send', 'react', 'hand:raise', 'poll:vote', 'qna:ask'],
  participant: [
    'chat:send',
    'react',
    'hand:raise',
    'poll:vote',
    'qna:ask',
    'mic:self',
    'camera:self',
    'screen:share',
    'file:view',
    'whiteboard:draw',
    'note:create'
  ],
  speaker: [
    'chat:send',
    'react',
    'hand:raise',
    'poll:vote',
    'qna:ask',
    'mic:self',
    'camera:self',
    'screen:share',
    'file:view',
    'file:present',
    'whiteboard:draw',
    'note:create',
    'spotlight:self'
  ],
  cohost: [
    'chat:send',
    'react',
    'hand:raise',
    'poll:vote',
    'qna:ask',
    'mic:self',
    'camera:self',
    'screen:share',
    'file:view',
    'file:present',
    'whiteboard:draw',
    'note:create',
    'spotlight:self',
    'participant:mute',
    'participant:promote',
    'poll:create',
    'poll:close',
    'waiting:admit',
    'scene:switch',
    'record:start',
    'record:stop'
  ],
  moderator: [
    'chat:send',
    'react',
    'hand:raise',
    'poll:vote',
    'qna:ask',
    'mic:self',
    'camera:self',
    'screen:share',
    'file:view',
    'file:present',
    'whiteboard:draw',
    'note:create',
    'spotlight:self',
    'participant:mute',
    'participant:promote',
    'participant:demote',
    'participant:remove',
    'participant:camera',
    'participant:screen',
    'participant:chat',
    'participant:waiting',
    'poll:create',
    'poll:close',
    'qna:moderate',
    'waiting:admit',
    'waiting:reject',
    'scene:switch',
    'record:start',
    'record:stop',
    'stream:start',
    'stream:stop'
  ],
  host: [
    'chat:send',
    'react',
    'hand:raise',
    'poll:vote',
    'qna:ask',
    'mic:self',
    'camera:self',
    'screen:share',
    'file:view',
    'file:present',
    'file:share',
    'file:policy',
    'whiteboard:draw',
    'note:create',
    'spotlight:self',
    'participant:mute',
    'participant:promote',
    'participant:demote',
    'participant:remove',
    'participant:camera',
    'participant:screen',
    'participant:chat',
    'participant:waiting',
    'poll:create',
    'poll:close',
    'qna:moderate',
    'waiting:admit',
    'waiting:reject',
    'scene:switch',
    'record:start',
    'record:stop',
    'stream:start',
    'stream:stop',
    'room:lock',
    'room:settings',
    'minute:approve',
    'close:meeting'
  ]
};

export function capabilitiesFor(role) {
  return ROLE_CAPABILITIES[role] || ROLE_CAPABILITIES.audience;
}

export function roleCan(role, capability) {
  return capabilitiesFor(role).includes(capability);
}

export function isAtLeast(role, minimum) {
  return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[minimum] ?? 99);
}

/* -------------------------------- layouts -------------------------------- */

/**
 * Speaker-focused layouts (prompt §11). The meeting type picks a default; the
 * host can override at any time.
 */
export const LAYOUTS = {
  gallery: 'Gallery',
  speaker: 'Speaker',
  presentation: 'Presentation',
  interview: 'Interview',
  webinar: 'Webinar',
  ai: 'AI'
};

export const DEFAULT_LAYOUT_BY_TYPE = {
  private: 'gallery',
  business: 'speaker',
  interview: 'interview',
  webinar: 'webinar',
  live: 'presentation',
  presentation: 'presentation',
  workshop: 'gallery',
  ai: 'ai'
};

/* ------------------------------- AI boundary ------------------------------- */

/**
 * AI permission levels (prompt §6 + §19). Escalation is always explicit.
 *  off       – no AI access at all; content never leaves the room
 *  observe   – may listen/read for context, may not act
 *  assistant – may summarize, answer, extract tasks (read + propose)
 *  notetaker – assistant + writes minutes/transcripts
 *  full      – may perform meeting actions the host has separately approved
 */
export const AI_MODES = {
  off: {
    label: 'AI OFF',
    description: 'No AI access. Nothing is read, transcribed or summarized.',
    capabilities: []
  },
  observe: {
    label: 'AI Observe',
    description: 'AI may read the meeting for context. It cannot act or write.',
    capabilities: ['read:transcript', 'read:chat', 'read:whiteboard']
  },
  assistant: {
    label: 'AI Assistant',
    description: 'AI summarizes, answers questions, extracts tasks and drafts follow-ups.',
    capabilities: [
      'read:transcript',
      'read:chat',
      'read:whiteboard',
      'read:files',
      'propose:agenda',
      'propose:actions',
      'propose:minutes',
      'propose:reply'
    ]
  },
  notetaker: {
    label: 'AI Note-taker',
    description: 'Assistant plus always-on minute and transcript drafting.',
    capabilities: [
      'read:transcript',
      'read:chat',
      'read:whiteboard',
      'read:files',
      'propose:agenda',
      'propose:actions',
      'propose:minutes',
      'propose:reply',
      'write:transcript',
      'write:minutes'
    ]
  },
  full: {
    label: 'AI Full Access',
    description:
      'AI may perform meeting actions you approve individually — never silently, never outside this room.',
    capabilities: [
      'read:transcript',
      'read:chat',
      'read:whiteboard',
      'read:files',
      'propose:agenda',
      'propose:actions',
      'propose:minutes',
      'propose:reply',
      'write:transcript',
      'write:minutes',
      'act:calendar',
      'act:tasks',
      'act:invite',
      'act:email',
      'act:scene',
      'act:participant'
    ]
  }
};

/** Actions that can never run without a per-action confirmation, even at `full`. */
export const CONFIRM_REQUIRED = new Set([
  'act:email',
  'act:invite',
  'act:calendar',
  'act:participant',
  'act:scene'
]);

export function aiCapabilities(mode) {
  return AI_MODES[mode]?.capabilities || [];
}

export function aiCan(mode, capability) {
  return aiCapabilities(mode).includes(capability);
}

export function aiNeedsConfirmation(mode, capability) {
  return aiCan(mode, capability) && CONFIRM_REQUIRED.has(capability);
}

/* ----------------------------- meeting types ----------------------------- */

export const MEETING_TYPES = {
  private: {
    label: 'Private Meeting',
    blurb: 'Small group video/audio. Nothing extra, nothing missing.',
    defaults: { layout: 'gallery', waitingRoom: false, record: false, aiMode: 'assistant', audience: 0, secure: false }
  },
  business: {
    label: 'Business Meeting',
    blurb: 'Structured meeting with agenda, notes, actions and follow-up.',
    defaults: { layout: 'speaker', waitingRoom: true, record: true, aiMode: 'notetaker', audience: 0, secure: false }
  },
  interview: {
    label: 'Interview',
    blurb: 'Host + guest, recorded, with AI interview assistance.',
    defaults: { layout: 'interview', waitingRoom: true, record: true, aiMode: 'notetaker', audience: 0, secure: false }
  },
  webinar: {
    label: 'Webinar',
    blurb: 'Host, speakers and an audience that stays audience until invited up.',
    defaults: { layout: 'webinar', waitingRoom: true, record: true, aiMode: 'assistant', audience: 200, secure: false }
  },
  live: {
    label: 'Live Show',
    blurb: 'Scene-based live production with lower thirds and multi-destination streaming.',
    defaults: { layout: 'presentation', waitingRoom: false, record: true, aiMode: 'assistant', audience: 500, secure: false }
  },
  presentation: {
    label: 'Presentation',
    blurb: 'Speaker-focused with slides and screen sharing front and centre.',
    defaults: { layout: 'presentation', waitingRoom: true, record: true, aiMode: 'assistant', audience: 0, secure: false }
  },
  workshop: {
    label: 'Workshop',
    blurb: 'Interactive room with whiteboard, polls and collaborative tools.',
    defaults: { layout: 'gallery', waitingRoom: true, record: false, aiMode: 'assistant', audience: 0, secure: false }
  },
  ai: {
    label: 'AI Session',
    blurb: 'AI participates as assistant, moderator, note-taker or facilitator.',
    defaults: { layout: 'ai', waitingRoom: false, record: false, aiMode: 'full', audience: 0, secure: false }
  }
};

/* --------------------------- waiting-room policy --------------------------- */

/**
 * Guest experience (prompt §33): click link → enter name → join.
 * Authentication is only required when the host's security policy demands it.
 */
export const ADMISSION_POLICIES = {
  open: 'Anyone with the link joins immediately',
  waiting: 'Everyone waits until the host admits them',
  authenticated: 'Sign-in required, then waiting room',
  verified: 'Sign-in + verified identity required, then waiting room'
};
