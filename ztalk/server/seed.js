/**
 * ZTalk — demo sandbox seed (was: ZenChat).
 *
 * Seeded data is explicitly marked `source: 'demo'`. Nothing here is a live
 * connection, and every seeded conversation reports `simulated: true` in the API
 * so the UI never implies a real WhatsApp/Telegram link exists.
 *
 * The shape mirrors the reference design: 10 conversations across 6 platforms,
 * one active thread with an attachment and an AI-detected meeting, plus the
 * sidebar account counters.
 */

import { store } from './store.js';
import { id, nowIso } from './util.js';

const MINUTE = 60_000;

function at(minutesAgo) {
  return new Date(Date.now() - minutesAgo * MINUTE).toISOString();
}

/** Sidebar "Connected Accounts" — the counts in the design. */
const ACCOUNTS = [
  { platform: 'whatsapp', label: 'WhatsApp', handle: '+92 300 000 0000', count: 12, state: 'sandbox' },
  { platform: 'wechat', label: 'WeChat', handle: 'tahseen_wx', count: 2, state: 'sandbox' },
  { platform: 'telegram', label: 'Telegram', handle: '@tahseen', count: 4, state: 'sandbox' },
  { platform: 'line', label: 'LINE', handle: 'tahseen.line', count: 4, state: 'sandbox' },
  { platform: 'kakaotalk', label: 'KakaoTalk', handle: 'tahseen.kr', count: 1, state: 'sandbox' },
  { platform: 'zalo', label: 'Zalo', handle: 'tahseen.zl', count: 1, state: 'sandbox' },
  { platform: 'messenger', label: 'Messenger', handle: 'tahseen.ahmed', count: 2, state: 'sandbox' },
  { platform: 'instagram', label: 'Instagram', handle: '@tahseen', count: 1, state: 'sandbox' },
  { platform: 'teams', label: 'Microsoft Teams', handle: 'business@varizen.co', count: 1, state: 'sandbox' },
  { platform: 'slack', label: 'Slack', handle: 'varizen.slack.com', count: 3, state: 'sandbox' },
  { platform: 'discord', label: 'Discord', handle: 'varizen#0001', count: 1, state: 'sandbox' },
  { platform: 'dingtalk', label: 'DingTalk', handle: 'varizen.dt', count: 1, state: 'sandbox' }
];

function participant(name, handle, extra = {}) {
  return { name, handle, role: 'contact', isSelf: false, ...extra };
}

const CONVERSATIONS = [
  {
    key: 'sarah',
    title: 'Sarah Chen',
    platform: 'whatsapp',
    kind: 'direct',
    important: true,
    needsReply: true,
    unread: 3,
    participants: [participant('Sarah Chen', '+1 415 555 0134', { verified: true, online: true })],
    messages: [
      { minutesAgo: 96, outbound: false, body: 'Hi Tahseen,\n\nCan you review the proposal?' },
      { minutesAgo: 88, outbound: false, body: "I've attached the latest version. Let me know your thoughts. We're hoping to finalize by Friday." },
      {
        minutesAgo: 84,
        outbound: false,
        body: 'Sharing the proposal deck now.',
        attachments: [
          {
            id: 'att_samc_v3',
            name: 'SAMC_Proposal_v3.pdf',
            mime: 'application/pdf',
            sizeBytes: 15_400_000,
            kind: 'pdf',
            pages: 14,
            uploadedBy: 'Sarah Chen'
          }
        ]
      },
      {
        minutesAgo: 62,
        outbound: true,
        body: "Hi Sarah,\n\nI'll review it today and share my feedback by this evening.",
        readAt: null
      },
      { minutesAgo: 44, outbound: false, body: "Great! Also, let's discuss the budget items. Are you available for a quick call tomorrow?" },
      { minutesAgo: 31, outbound: false, body: 'Would 3 PM work on your side? I can send a calendar invite with the agenda.' }
    ]
  },
  {
    key: 'liwei',
    title: 'Li Wei (Philip)',
    platform: 'wechat',
    kind: 'direct',
    important: false,
    needsReply: true,
    unread: 2,
    participants: [participant('Li Wei (Philip)', 'liwei_wx', { verified: true })],
    messages: [
      { minutesAgo: 210, outbound: false, body: '会议改到下午三点可以吗？' },
      { minutesAgo: 205, outbound: true, body: '可以，我会更新日历。' },
      { minutesAgo: 190, outbound: false, body: '好的，谢谢！会议室还是 8 楼那间。' }
    ]
  },
  {
    key: 'ahmed',
    title: 'Ahmed Khan',
    platform: 'telegram',
    kind: 'direct',
    important: false,
    needsReply: true,
    unread: 1,
    participants: [participant('Ahmed Khan', '@ahmedk')],
    messages: [
      { minutesAgo: 300, outbound: false, body: 'Sending the documents now. Includes the signed contract and the vendor list.' },
      { minutesAgo: 288, outbound: false, body: 'Let me know if anything is missing.' }
    ]
  },
  {
    key: 'marketing',
    title: 'Marketing Team',
    platform: 'slack',
    kind: 'group',
    important: true,
    needsReply: true,
    unread: 8,
    participants: [
      participant('John Reyes', '@john', { role: 'contact' }),
      participant('Priya Nair', '@priya', { role: 'contact' }),
      participant('Dan Whitfield', '@dan', { role: 'contact' })
    ],
    messages: [
      { minutesAgo: 420, outbound: false, author: 'Priya Nair', body: 'Campaign brief v2 is in the channel. Key change: we moved the launch to November 15.' },
      { minutesAgo: 400, outbound: false, author: 'John Reyes', body: "Here's the latest update — the landing page copy is final, waiting on design assets." },
      { minutesAgo: 360, outbound: false, author: 'Dan Whitfield', body: 'Please send the revised budget by Friday so we can lock the media buy.' },
      { minutesAgo: 350, outbound: false, author: 'Priya Nair', body: 'Also we need a decision on the paid social split by end of week.' }
    ]
  },
  {
    key: 'maria',
    title: 'Maria Lopez',
    platform: 'messenger',
    kind: 'direct',
    important: false,
    needsReply: true,
    unread: 2,
    participants: [participant('Maria Lopez', 'maria.lopez')],
    messages: [
      { minutesAgo: 480, outbound: false, body: 'Are you joining tomorrow? The workshop starts at 9 and we need your section on the roadmap.' }
    ]
  },
  {
    key: 'project',
    title: 'Project Group',
    platform: 'line',
    kind: 'group',
    important: true,
    needsReply: false,
    unread: 5,
    participants: [
      participant('Kenji Mori', 'kenji', { role: 'contact' }),
      participant('Aiko Tanaka', 'aiko', { role: 'contact' })
    ],
    messages: [
      { minutesAgo: 520, outbound: false, author: 'Kenji Mori', body: '皆、ありがとうございます。次のマイルストーンは11月15日です。' },
      { minutesAgo: 500, outbound: false, author: 'Aiko Tanaka', body: '資料を共有しました。ご確認ください。' },
      { minutesAgo: 495, outbound: true, body: 'ありがとう。今日中に確認します。' }
    ]
  },
  {
    key: 'vietnam',
    title: 'Client - Vietnam',
    platform: 'zalo',
    kind: 'direct',
    important: true,
    needsReply: false,
    unread: 1,
    participants: [participant('Nguyen Van Minh', 'minh.nv', { verified: true })],
    messages: [
      { minutesAgo: 700, outbound: false, body: 'Chúng tôi đã nhận được thanh toán. Cảm ơn bạn!' },
      { minutesAgo: 690, outbound: false, body: 'Hóa đơn tháng 11 sẽ được gửi vào tuần sau.' },
      { minutesAgo: 680, outbound: true, body: 'Thank you — invoice received and recorded.' }
    ]
  },
  {
    key: 'design',
    title: 'Design Team',
    platform: 'teams',
    kind: 'group',
    important: false,
    needsReply: true,
    unread: 3,
    participants: [
      participant('Elena Rossi', 'elena@varizen.co', { role: 'contact' }),
      participant('Marcus Bell', 'marcus@varizen.co', { role: 'contact' })
    ],
    messages: [
      { minutesAgo: 800, outbound: false, author: 'Elena Rossi', body: 'New design ready for review. The tokens are locked, so it should drop straight into the build.' },
      { minutesAgo: 790, outbound: false, author: 'Marcus Bell', body: 'Can you check the mobile breakpoints? The list column overflows at 380px.' }
    ]
  },
  {
    key: 'family',
    title: 'Family',
    platform: 'whatsapp',
    kind: 'group',
    important: false,
    needsReply: false,
    unread: 0,
    participants: [
      participant('Amma', '+92 321 555 0100', { role: 'contact' }),
      participant('Zainab', '+92 321 555 0101', { role: 'contact' })
    ],
    messages: [
      { minutesAgo: 1400, outbound: false, author: 'Amma', body: 'Dinner at 7 tonight? Bring the kids.' },
      { minutesAgo: 1390, outbound: true, body: 'In sha Allah, we will be there at 7.' }
    ]
  },
  {
    key: 'alex',
    title: 'Alex Johnson',
    platform: 'discord',
    kind: 'direct',
    important: false,
    needsReply: true,
    unread: 1,
    participants: [participant('Alex Johnson', 'alexj')],
    messages: [
      { minutesAgo: 1600, outbound: false, body: 'Liked a message' },
      { minutesAgo: 1580, outbound: false, body: 'Hey — can you look at the deployment checklist before we ship tomorrow? The rollback step is missing.' }
    ]
  }
];

export function seedDemoData({ force = false } = {}) {
  if (!force && store.state.conversations.length > 0) {
    return { seeded: false, reason: 'Sandbox already populated.' };
  }

  store.state.accounts = ACCOUNTS.map((a) => ({
    id: id('acct', 6),
    ...a,
    connectedAt: nowIso(),
    note: 'Sandbox handle. Connect a real bridge to send and receive for real.'
  }));

  store.state.conversations = [];
  store.state.messages = [];

  for (const spec of CONVERSATIONS) {
    const conv = {
      id: `conv_${spec.key}`,
      code: `zc${spec.key.slice(0, 3)}`,
      title: spec.title,
      platform: spec.platform,
      kind: spec.kind,
      source: 'demo',
      important: spec.important,
      needsReply: spec.needsReply,
      muted: false,
      pinned: false,
      unread: spec.unread,
      tags: [],
      timeZone: store.state.settings.timeZone,
      participants: [
        {
          name: store.state.identity.name,
          handle: store.state.identity.email,
          role: 'self',
          isSelf: true
        },
        ...spec.participants
      ],
      createdAt: at(4000),
      lastMessageAt: null,
      lastPreview: ''
    };

    // Messages are declared newest-last in the spec; `minutesAgo` descends.
    const ordered = [...spec.messages].sort((a, b) => b.minutesAgo - a.minutesAgo);
    const total = ordered.length;
    let lastMade = null;

    ordered.forEach((m, index) => {
      const message = {
        id: id('msg', 8),
        conversationId: conv.id,
        outbound: Boolean(m.outbound),
        author: m.outbound ? store.state.identity.name : m.author || spec.title,
        body: m.body,
        preview: m.body.replace(/\s+/g, ' ').slice(0, 140),
        kind: m.attachments?.length ? 'file' : 'text',
        attachments: (m.attachments || []).map((a) => ({ ...a, id: a.id || id('att', 6) })),
        at: at(m.minutesAgo),
        read: m.outbound ? true : index < total - spec.unread,
        source: 'demo',
        ai: null
      };
      store.state.messages.push(message);
      lastMade = message;
    });

    if (lastMade) {
      conv.lastMessageAt = lastMade.at;
      conv.lastPreview = lastMade.preview;
    }
    store.state.conversations.push(conv);
  }

  store.state.tasks = [
    {
      id: 'task_seed_1',
      title: 'Review SAMC_Proposal_v3.pdf and send feedback',
      dueAt: at(-240),
      owner: store.state.identity.name,
      conversationId: 'conv_sarah',
      priority: 'high',
      done: false,
      createdAt: at(60),
      source: 'ztalk'
    },
    {
      id: 'task_seed_2',
      title: 'Send revised budget to Marketing Team',
      dueAt: at(-1440),
      owner: store.state.identity.name,
      conversationId: 'conv_marketing',
      priority: 'high',
      done: false,
      createdAt: at(360),
      source: 'ztalk'
    },
    {
      id: 'task_seed_3',
      title: 'Confirm 3 PM call with Sarah',
      dueAt: at(-90),
      owner: store.state.identity.name,
      conversationId: 'conv_sarah',
      priority: 'normal',
      done: false,
      createdAt: at(31),
      source: 'ztalk'
    }
  ];

  store.state.aiActivity = [
    {
      id: id('act', 6),
      kind: 'summary.generated',
      message: 'Summarised the Sarah Chen thread (6 messages)',
      at: at(28),
      conversationId: 'conv_sarah',
      conversationName: 'Sarah Chen',
      actor: 'ai',
      reversible: true
    },
    {
      id: id('act', 6),
      kind: 'detection.meeting',
      message: 'Detected a proposed meeting in Sarah Chen',
      at: at(29),
      conversationId: 'conv_sarah',
      conversationName: 'Sarah Chen',
      actor: 'ai',
      reversible: true
    },
    {
      id: id('act', 6),
      kind: 'translation.generated',
      message: 'Translated a reply into Chinese for Li Wei (Philip)',
      at: at(200),
      conversationId: 'conv_liwei',
      conversationName: 'Li Wei (Philip)',
      actor: 'ai',
      reversible: true
    }
  ];

  store.log('sandbox.seeded', `Seeded ${CONVERSATIONS.length} demo conversations`, { actor: 'system' });
  store.flush();
  return {
    seeded: true,
    conversations: store.state.conversations.length,
    messages: store.state.messages.length,
    accounts: store.state.accounts.length
  };
}

export { ACCOUNTS, CONVERSATIONS };
