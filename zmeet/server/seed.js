/**
 * ZMeet — first-run demo seed. (was: ZenMeet)
 * (ZMeet; legacy product name retained in code identifiers)
 *
 * Gives the dashboard, meeting room and AI report something real to render.
 * Everything here is fictional demo data for one organization and is only
 * written when the store is empty. Remove `.data/zmeet.json.enc` to reset.
 */

import { store } from './store.js';
import { roomService } from './rooms.js';
import { logActivity } from './aiActivity.js';
import { addMinutes, nowIso, timeLabel } from './util.js';

function at(dayOffset, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const PEOPLE = {
  sarah: { name: 'Sarah Malik', email: 'sarah.malik@varizen.co' },
  john: { name: 'John Carter', email: 'john.carter@varizen.co' },
  alex: { name: 'Alex Rivera', email: 'alex.rivera@varizen.co' },
  maya: { name: 'Maya Chen', email: 'maya.chen@varizen.co' },
  daniel: { name: 'Daniel Osei', email: 'daniel.osei@varizen.co' },
  priya: { name: 'Priya Nair', email: 'priya.nair@varizen.co' }
};

export function seedIfEmpty() {
  roomService.bootstrap();
  if (store.state.rooms.length) return { seeded: false, reason: 'store already has rooms' };

  const identity = store.state.identity;
  const org = identity.organization;

  /* ---------------- 1. Live business meeting (matches the mockup) ---------------- */

  const live = roomService.create({
    title: 'Project Planning',
    purpose: 'SAMC project planning — status, budget, timeline and ownership',
    type: 'business',
    scheduledFor: at(0, 10, 0),
    durationMinutes: 45,
    startNow: true,
    invitees: [PEOPLE.sarah, PEOPLE.john, PEOPLE.alex, PEOPLE.maya],
    agenda: ['Project status', 'Budget', 'Timeline', 'Responsibilities'],
    aiMode: 'notetaker'
  });

  live.code = 'abc123';
  live.tags = ['SAMC', 'planning'];
  live.participants = [
    { id: 'part_host', name: identity.name, email: identity.email, role: 'host', state: 'joined', mic: true, camera: true, screen: false, handRaised: false, isHost: true, joinedAt: at(0, 10, 2), colorIndex: 0 },
    { id: 'part_sarah', name: 'Sarah Malik', email: PEOPLE.sarah.email, role: 'speaker', state: 'joined', mic: false, camera: true, screen: false, handRaised: false, joinedAt: at(0, 10, 3), colorIndex: 1 },
    { id: 'part_john', name: 'John Carter', email: PEOPLE.john.email, role: 'participant', state: 'joined', mic: false, camera: true, screen: false, handRaised: false, joinedAt: at(0, 10, 4), colorIndex: 2 },
    { id: 'part_alex', name: 'Alex Rivera', email: PEOPLE.alex.email, role: 'participant', state: 'joined', mic: false, camera: true, screen: false, handRaised: false, joinedAt: at(0, 10, 5), colorIndex: 3 }
  ];
  live.chat = [
    { id: 'msg_seed_1', participantId: 'part_alex', author: 'Alex Rivera', role: 'participant', kind: 'message', text: 'Welcome everyone!', at: at(0, 10, 2) },
    { id: 'msg_seed_2', participantId: 'part_sarah', author: 'Sarah Malik', role: 'speaker', kind: 'message', text: "Let's get started.", at: at(0, 10, 3) },
    { id: 'msg_seed_3', participantId: 'part_john', author: 'John Carter', role: 'participant', kind: 'message', text: 'Budget revised numbers are in the shared sheet — 12% under plan.', at: at(0, 18) },
    { id: 'msg_seed_4', participantId: 'part_sarah', author: 'Sarah Malik', role: 'speaker', kind: 'message', text: 'I think we agreed the launch moves to November 15. Can you confirm that?', at: at(0, 24) },
    { id: 'msg_seed_5', participantId: 'part_host', author: identity.name, role: 'host', kind: 'message', text: 'Confirmed. We decided the launch is November 15.', at: at(0, 25) },
    { id: 'msg_seed_6', participantId: 'part_john', author: 'John Carter', role: 'participant', kind: 'message', text: "I'll prepare the deployment checklist by Friday.", at: at(0, 31) },
    { id: 'msg_seed_7', participantId: 'part_sarah', author: 'Sarah Malik', role: 'speaker', kind: 'message', text: "I'll send the revised budget tomorrow.", at: at(0, 33) },
    { id: 'msg_seed_8', participantId: 'part_alex', author: 'Alex Rivera', role: 'participant', kind: 'message', text: 'Should we involve the security team before we ship?', at: at(0, 39) }
  ];
  live.transcript = [
    { id: 'tr_1', speaker: 'Sarah Malik', text: 'Status is green on the SAMC project. Two items slipped by a week.', at: at(0, 11, 10), confidence: 0.94 },
    { id: 'tr_2', speaker: 'John Carter', text: 'Budget revised numbers are in the shared sheet — 12% under plan.', at: at(0, 18), confidence: 0.92 },
    { id: 'tr_3', speaker: 'Sarah Malik', text: 'I think we agreed the launch moves to November 15.', at: at(0, 24), confidence: 0.95 },
    { id: 'tr_4', speaker: identity.name, text: 'Confirmed. We decided the launch is November 15.', at: at(0, 25), confidence: 0.97 },
    { id: 'tr_5', speaker: 'John Carter', text: "I'll prepare the deployment checklist by Friday.", at: at(0, 31), confidence: 0.93 },
    { id: 'tr_6', speaker: 'Sarah Malik', text: "I'll send the revised budget tomorrow.", at: at(0, 33), confidence: 0.91 },
    { id: 'tr_7', speaker: 'Alex Rivera', text: 'Should we involve the security team before we ship?', at: at(0, 39), confidence: 0.9 }
  ];
  live.decisions = [
    { id: 'dec_seed_1', text: 'Launch scheduled for November 15.', source: 'transcript', approvedBy: identity.email, approvedAt: at(0, 26), confidence: 0.95 },
    { id: 'dec_seed_2', text: 'Budget stays at the revised figure — 12% under plan.', source: 'chat', approvedBy: identity.email, approvedAt: at(0, 20), confidence: 0.88 }
  ];
  live.actions = [
    { id: 'act_seed_1', task: 'Prepare deployment checklist', owner: 'John', deadline: 'Friday', status: 'open', approved: true, approvedBy: identity.email, approvedAt: at(0, 32) },
    { id: 'act_seed_2', task: 'Send revised budget', owner: 'Sarah', deadline: 'Tomorrow', status: 'open', approved: true, approvedBy: identity.email, approvedAt: at(0, 34) },
    { id: 'act_seed_3', task: 'Confirm security review scope before ship', owner: 'Alex', deadline: null, status: 'proposed', approved: false }
  ];
  live.openQuestions = [
    { id: 'oq_seed_1', text: 'Should we involve the security team before we ship?', askedBy: 'Alex Rivera', resolved: false }
  ];
  live.highlights = [
    { id: 'hl_seed_1', offsetSeconds: 840, label: 'Decision recorded', detail: 'Launch scheduled for November 15.', speaker: identity.name, weight: 12 },
    { id: 'hl_seed_2', offsetSeconds: 480, label: 'Budget discussed', detail: 'Budget revised numbers are in the shared sheet — 12% under plan.', speaker: 'John Carter', weight: 8 },
    { id: 'hl_seed_3', offsetSeconds: 1260, label: 'Action assigned', detail: 'John to prepare the deployment checklist.', speaker: 'John Carter', weight: 7 }
  ];
  live.files = [
    { id: 'file_seed_1', name: 'SAMC-status-deck.pdf', sizeBytes: 3_411_200, mime: 'application/pdf', kind: 'presentation', addedBy: identity.name, addedAt: at(0, 11, 5), policy: { viewOnly: false, downloadAllowed: true, collaborate: false, aiAccess: true }, storage: { adapter: 'organization', location: `${org.name} workspace`, signedUrl: null, note: 'Stored in organizer storage.' }, presented: true },
    { id: 'file_seed_2', name: 'Budget-revised.xlsx', sizeBytes: 892_000, mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', kind: 'spreadsheet', addedBy: 'John Carter', addedAt: at(0, 17), policy: { viewOnly: true, downloadAllowed: false, collaborate: true, aiAccess: true }, storage: { adapter: 'organization', location: `${org.name} workspace`, signedUrl: null, note: 'Stored in organizer storage.' }, presented: false },
    { id: 'file_seed_3', name: 'Deployment-checklist.docx', sizeBytes: 148_000, mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', kind: 'document', addedBy: 'John Carter', addedAt: at(0, 30), policy: { viewOnly: false, downloadAllowed: true, collaborate: true, aiAccess: false }, storage: { adapter: 'organization', location: `${org.name} workspace`, signedUrl: null, note: 'Stored in organizer storage.' }, presented: false }
  ];
  live.whiteboard = {
    strokes: [],
    notes: [
      { id: 'wb_1', text: 'Launch — Nov 15', author: 'Sarah Malik', kind: 'sticky', color: 'amber', x: 40, y: 40 },
      { id: 'wb_2', text: 'Deployment checklist — John', author: 'John Carter', kind: 'sticky', color: 'blue', x: 200, y: 40 },
      { id: 'wb_3', text: 'Budget revised — Sarah', author: 'Sarah Malik', kind: 'sticky', color: 'green', x: 40, y: 160 },
      { id: 'wb_4', text: 'Security review?', author: 'Alex Rivera', kind: 'sticky', color: 'rose', x: 200, y: 160 }
    ],
    updatedAt: at(0, 34)
  };
  live.recording = { enabled: true, options: { video: true, audio: true, presentation: true, screen: false, speakerTracks: false, transcript: true }, startedAt: at(0, 10, 10), startedBy: identity.email };
  live.scenes = [
    { id: 'scene_1', name: 'Host', layout: 'speaker', slots: [{ kind: 'host', position: 'full' }], overlay: null, lowerThird: null, active: true },
    { id: 'scene_2', name: 'Host + Guest', layout: 'interview', slots: [{ kind: 'host', position: 'left' }, { kind: 'guest', position: 'right' }], overlay: null, lowerThird: null },
    { id: 'scene_3', name: 'Guest + Slides', layout: 'presentation', slots: [{ kind: 'guest', position: 'pip' }, { kind: 'slides', position: 'full' }], overlay: null, lowerThird: null },
    { id: 'scene_4', name: 'Screen + Speaker', layout: 'presentation', slots: [{ kind: 'screen', position: 'full' }, { kind: 'host', position: 'pip' }], overlay: null, lowerThird: null },
    { id: 'scene_5', name: 'Video + Lower Third', layout: 'presentation', slots: [{ kind: 'video', position: 'full' }], overlay: 'video', lowerThird: { name: 'Sarah Malik', title: 'Head of Platform', enabled: true }, active: false },
    { id: 'scene_6', name: 'Full Presentation', layout: 'presentation', slots: [{ kind: 'presentation', position: 'full' }], overlay: null, lowerThird: null }
  ];
  live.streaming = {
    active: false,
    startedAt: null,
    destinations: [
      { id: 'dest_1', platform: 'youtube', label: 'Varizen — YouTube', vaultRef: 'vault:stream:live:youtube:8f31aa', maskedKey: 'xQ••••9k', hasKey: true, status: 'ready', addedAt: at(-2, 12), note: 'Key written to the vault reference only.' }
    ]
  };
  live.brief = {
    purpose: 'SAMC project planning',
    participants: 5,
    agenda: ['Project status', 'Budget', 'Timeline', 'Responsibilities'],
    previousDiscussions: 3,
    documents: 4,
    outstandingActions: 6,
    generatedAt: at(0, 9, 30)
  };
  live.minutes = {
    id: 'min_seed_1',
    roomId: live.id,
    title: live.title,
    generatedAt: at(0, 40),
    generatedBy: 'deterministic',
    attendance: live.participants.map((p) => ({ name: p.name, role: p.role, joinedAt: p.joinedAt, leftAt: null })),
    summary: '4 contributions from Sarah Malik, John Carter, Alex Rivera. The conversation centred on budget, timeline, security. 2 decisions recorded. 2 action items detected. 1 question still open.',
    decisions: live.decisions,
    actions: live.actions,
    openQuestions: live.openQuestions,
    agenda: live.agenda,
    status: 'draft',
    approvedBy: null,
    approvedAt: null,
    sentTo: []
  };
  live.storage = { policy: 'organization', adapter: 'organization', location: `${org.name} workspace`, retentionDays: 90 };

  /* ---------------------- 2. Upcoming interview ---------------------- */

  const interview = roomService.create({
    title: 'Senior Platform Engineer — Interview',
    purpose: 'Second-round technical interview with Priya',
    type: 'interview',
    scheduledFor: at(1, 14, 0),
    durationMinutes: 45,
    invitees: [{ ...PEOPLE.priya, role: 'speaker' }],
    agenda: ['Background (5)', 'System design (25)', 'Questions (10)', 'Next steps (5)'],
    aiMode: 'notetaker'
  });

  /* ------------------------ 3. Webinar next week ------------------------ */

  const webinar = roomService.create({
    title: 'Governed AI for Regulated Teams',
    purpose: 'Public webinar — 200 seats, Q&A and polls',
    type: 'webinar',
    scheduledFor: at(4, 16, 0),
    durationMinutes: 60,
    invitees: [PEOPLE.sarah, PEOPLE.maya, PEOPLE.daniel],
    agenda: ['Why governance matters', 'Live demo', 'Q&A', 'Next steps'],
    aiMode: 'assistant'
  });
  webinar.polls = [
    {
      id: 'poll_seed_1',
      question: 'Which constraint slows your AI rollout the most?',
      options: [
        { id: 'opt_1', label: 'Data residency', votes: [] },
        { id: 'opt_2', label: 'Audit evidence', votes: [] },
        { id: 'opt_3', label: 'Model choice', votes: [] }
      ],
      anonymous: true,
      status: 'open',
      createdAt: at(0, 9)
    }
  ];

  /* ------------------------- 4. Recurring weekly ------------------------- */

  const weekly = roomService.create({
    title: 'Weekly Operations',
    purpose: 'Recurring operations review — AI prepares the brief each Monday',
    type: 'business',
    scheduledFor: at(2, 9, 0),
    durationMinutes: 30,
    invitees: [PEOPLE.sarah, PEOPLE.john, PEOPLE.maya, PEOPLE.daniel],
    agenda: ['Scorecard', 'Blockers', 'Decisions', 'Actions'],
    recurrence: { frequency: 'weekly', interval: 1, byDay: ['MO'], until: null, preparedByAI: true },
    aiMode: 'notetaker'
  });

  /* ------------------------ 5. Ended workshop ------------------------ */

  const workshop = roomService.create({
    title: 'Zero Trust Rollout Workshop',
    purpose: 'Interactive workshop with whiteboard and polls',
    type: 'workshop',
    scheduledFor: at(-3, 13, 0),
    durationMinutes: 90,
    invitees: [PEOPLE.sarah, PEOPLE.alex, PEOPLE.maya],
    aiMode: 'assistant'
  });
  workshop.status = 'ended';
  workshop.startedAt = at(-3, 13, 1);
  workshop.endedAt = at(-3, 14, 22);
  workshop.participants = [
    { id: 'part_host', name: identity.name, email: identity.email, role: 'host', state: 'left', isHost: true, joinedAt: at(-3, 13, 1), leftAt: at(-3, 14, 22), colorIndex: 0 },
    { id: 'part_sarah', name: 'Sarah Malik', email: PEOPLE.sarah.email, role: 'speaker', state: 'left', joinedAt: at(-3, 13, 2), leftAt: at(-3, 14, 20), colorIndex: 1 },
    { id: 'part_alex', name: 'Alex Rivera', email: PEOPLE.alex.email, role: 'participant', state: 'left', joinedAt: at(-3, 13, 4), leftAt: at(-3, 14, 18), colorIndex: 3 }
  ];
  workshop.transcript = [
    { id: 'tr_w1', speaker: 'Sarah Malik', text: 'We agreed to start the zero-trust rollout with the Malaysia office first.', at: at(-3, 13, 20), confidence: 0.93 },
    { id: 'tr_w2', speaker: 'Alex Rivera', text: "I'll draft the device posture policy next week.", at: at(-3, 13, 48), confidence: 0.9 },
    { id: 'tr_w3', speaker: identity.name, text: 'What about the legacy VPN users?', at: at(-3, 14, 5), confidence: 0.91 }
  ];
  workshop.decisions = [
    { id: 'dec_w1', text: 'Zero-trust rollout starts with the Malaysia office.', source: 'transcript', approvedBy: identity.email, approvedAt: at(-3, 13, 25), confidence: 0.93 }
  ];
  workshop.actions = [
    { id: 'act_w1', task: 'Draft device posture policy', owner: 'Alex', deadline: 'next week', status: 'open', approved: true, approvedBy: identity.email, approvedAt: at(-3, 13, 50) }
  ];
  workshop.openQuestions = [{ id: 'oq_w1', text: 'What happens to legacy VPN users during migration?', askedBy: identity.name, resolved: false }];
  workshop.recordings = [
    {
      id: 'rec_seed_w1',
      startedAt: at(-3, 13, 2),
      stoppedAt: at(-3, 14, 22),
      durationSeconds: 4812,
      options: { video: true, audio: true, presentation: true, screen: true, speakerTracks: true, transcript: true },
      storage: { policy: 'organization', adapter: 'organization', location: `${org.name} workspace`, retentionDays: 90 },
      owner: org.name,
      startedBy: identity.email,
      shares: [],
      note: 'Media lives in organizer storage. ZMeet stores this reference only.'
    }
  ];
  workshop.whiteboard = {
    strokes: [],
    notes: [
      { id: 'wb_w1', text: 'Phase 1 — Malaysia', author: 'Sarah Malik', kind: 'sticky', color: 'amber', x: 40, y: 40 },
      { id: 'wb_w2', text: 'Device posture policy — Alex', author: 'Alex Rivera', kind: 'sticky', color: 'blue', x: 200, y: 40 }
    ],
    updatedAt: at(-3, 14, 0)
  };

  /* ------------------------ 6. AI session room ------------------------ */

  const aiRoom = roomService.create({
    title: 'AI Strategy — Open Session',
    purpose: 'AI participates as facilitator and note-taker',
    type: 'ai',
    scheduledFor: at(3, 11, 0),
    durationMinutes: 30,
    invitees: [PEOPLE.maya, PEOPLE.daniel],
    aiMode: 'full'
  });

  /* ------------------------- shared files + memory ------------------------- */

  store.state.sharedFiles = live.files.map((f) => ({ ...f, roomId: live.id, roomTitle: live.title }));
  store.state.recordings = workshop.recordings.map((r) => ({ ...r, roomId: workshop.id, roomTitle: workshop.title }));

  /* ----------------------------- AI activity ----------------------------- */

  const activitySeed = [
    { roomId: live.id, kind: 'agenda', title: 'Generated meeting agenda', detail: '4 sections for “SAMC project planning”', capability: 'propose:agenda' },
    { roomId: live.id, kind: 'availability', title: 'Checked attendee availability', detail: '3 candidate slots · zcal', capability: 'read:availability' },
    { roomId: live.id, kind: 'room', title: 'Created meeting sandbox', detail: 'Business Meeting · 45 min · AI Note-taker', capability: null },
    { roomId: live.id, kind: 'prepare', title: 'Prepared meeting brief', detail: '4 agenda items · 6 outstanding actions', capability: 'propose:agenda' },
    { roomId: live.id, kind: 'summary', title: 'Summarized discussion', detail: '4 contributions · 2 decisions · 2 actions', capability: 'propose:actions' },
    { roomId: live.id, kind: 'actions', title: 'Created 2 action items', detail: 'John → deployment checklist · Sarah → revised budget', capability: 'propose:actions' },
    { roomId: live.id, kind: 'followup', title: 'Drafted follow-up email', detail: '3 recipients · awaiting approval', capability: 'propose:reply' },
    { roomId: live.id, kind: 'calendar', title: 'Updated calendar', detail: 'Proposal sent to ZCal', capability: 'act:calendar' },
    { roomId: interview.id, kind: 'prepare', title: 'Prepared interview kit', detail: 'Role scorecard · 6 probe questions', capability: 'propose:agenda' },
    { roomId: webinar.id, kind: 'stream', title: 'Prepared live scenes', detail: '6 scenes · 1 destination ready', capability: 'act:scene' },
    { roomId: workshop.id, kind: 'actions', title: 'Turned whiteboard into an action plan', detail: '2 draft actions awaiting approval', capability: 'propose:actions' }
  ];
  for (const entry of activitySeed.reverse()) logActivity(entry);

  store.state.aiProvider = {
    kind: 'deterministic',
    model: 'rule-based',
    allowRemote: false,
    note: 'Local deterministic engine. Switch providers in Settings when an organization policy allows it.'
  };

  roomService.bootstrap();
  store.state.rooms = store.state.rooms.map((r) => (r.id === live.id ? live : r));
  store.persist();
  store.flush();

  return {
    seeded: true,
    rooms: store.state.rooms.length,
    liveRoom: { id: live.id, code: live.code, title: live.title }
  };
}

export { PEOPLE as SEED_PEOPLE };
