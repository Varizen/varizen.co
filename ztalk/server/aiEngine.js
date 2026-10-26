/**
 * ZTalk — AI engine (was: ZenChat).
 *
 * Everything here is *deterministic and extractive*: the engine reads the actual
 * conversation and reports what it finds. It never fabricates participants,
 * amounts or dates. Where the local engine cannot ground a claim, it says so.
 *
 * Capabilities (mirrors AI_MODES in aiProvider.js):
 *   summarize  — conversation summary bullets + next-step inference
 *   suggest    — tone-shifted reply drafts (professional / short / friendly / direct)
 *   translate  — reply translated into the contact's language
 *   detect     — meeting / task / payment / deadline / follow-up / decision
 *
 * Nothing in this module sends anything. Drafts always require an explicit user
 * action, which is enforced in the HTTP layer.
 */

import { extractMoney, extractMentions, formatInZone, initials, parseWhen, relativeLabel, timeOnly, truncate } from './util.js';
import { detectLanguage, translate } from './translate.js';
import { DETECTION_KINDS } from './platforms.js';
import { config } from './config.js';
import { getAIProvider } from './aiProvider.js';

/* ------------------------------ lexicons ------------------------------- */

const QUESTION = /\?|？|how|what|when|where|who|why|can you|could you|would you|are you|do you|is it|shall we|should we/i;

const MEETING_CUES = [
  /\b(meet|meeting|call|sync|standup|stand-up|1:1|one-on-one|catch ?up|huddle|interview|demo|review session|kickoff|kick-off)\b/i,
  /\b(zoom|google meet|teams|webex|join the call|hop on a call|get on a call)\b/i,
  /\b(discuss|talk about|walk through|go over)\b/i,
  /\b(jump on|jump into|dial in)\b/i
];

const TASK_CUES = [
  /\b(please|kindly)\s+(send|prepare|review|update|share|confirm|check|finali[sz]e|draft|schedule|book|create|fix|deploy|upload|approve)\b/i,
  /\b(can you|could you|would you|need you to|i need|we need|you should|make sure|don'?t forget|remember to)\b/i,
  /\b(action item|action:|todo|to-do|follow up|follow-up|next step|deliverable|owner)\b/i,
  /\bby (monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|eod|end of day|next week|friday|eow)\b/i
];

const PAYMENT_CUES = [
  /\b(invoice|payment|paid|pay|receipt|billing|wire|transfer|deposit|remittance|refund|balance due|amount due|purchase order|po number)\b/i,
  /[$€£¥₹]\s?\d|\b(usd|eur|gbp|myr|pkr|aed|inr|sgd|rm)\s?\d/i,
  /\b(overdue|due on|due date|net 30|net 15|terms)\b/i
];

const DEADLINE_CUES = [
  /\b(deadline|due by|due on|closes? on|last date|cut-?off|expires?)\b/i,
  /\bby (monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|eod|end of day|end of week|eow)\b/i,
  /\b\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
];

const DECISION_CUES = [
  /\b(decided|decision|agreed|approved|signed off|signed-off|going with|we will go with|final answer|settled on|chose|chosen|confirmed)\b/i
];

const FOLLOWUP_CUES = [
  /\b(follow up|follow-up|checking in|circling back|any update|still waiting|waiting on|reminder|gentle nudge|ping me|let me know)\b/i
];

const COURTESY = [/^(hi|hello|hey|dear|good morning|good afternoon|good evening|thanks|thank you|regards|best)\b/i];

/* --------------------------- higher-order model ------------------------- */

/** Build a compact, grounded view of a conversation for the engine. */
export function buildContext(conversation, messages, { me = 'me' } = {}) {
  const peers = (conversation.participants || []).filter((p) => p.handle !== conversation.platform || !p.isSelf);
  const contact = (conversation.participants || []).find((p) => p.role === 'contact') || peers[0] || {};
  const recent = messages.slice(-40);
  const inbound = recent.filter((m) => !m.outbound);
  const outbound = recent.filter((m) => m.outbound);
  const lastInbound = inbound.at(-1) || null;
  const unanswered = lastInbound && (!recent.at(-1) || !recent.at(-1).outbound) ? lastInbound : null;

  const allText = recent.map((m) => m.body).join('\n');
  const contactLanguage = detectLanguage(inbound.map((m) => m.body).join(' ')).language;

  return {
    conversation,
    contact,
    language: contactLanguage,
    recent,
    inbound,
    outbound,
    lastInbound,
    unanswered,
    allText,
    money: extractMoney(allText),
    mentions: extractMentions(allText),
    unansweredFor: unanswered ? relativeLabel(unanswered.at, new Date()) : null,
    me
  };
}

/* ----------------------------- summarization ---------------------------- */

const STOP = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'have', 'will', 'from', 'your', 'just', 'about', 'they', 'them',
  'there', 'here', 'what', 'when', 'were', 'been', 'being', 'would', 'could', 'should', 'into', 'than', 'then',
  'also', 'very', 'much', 'more', 'some', 'any', 'all', 'can', 'our', 'you', 'are', 'was', 'has', 'had', 'not'
]);

function keywords(text, limit = 6) {
  const counts = new Map();
  for (const raw of String(text).toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    const w = raw.trim();
    if (w.length < 4 || STOP.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function sentences(text) {
  return String(text)
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

/** Extractive summary: score sentences by keyword density + recency + cues. */
export function summarizeConversation(ctx) {
  const { conversation, recent, contact, language } = ctx;
  const source = recent.filter((m) => m.kind !== 'system');
  if (source.length === 0) {
    return {
      bullets: [],
      topics: [],
      openQuestion: null,
      sentiment: 'neutral',
      note: 'No messages to summarise yet.'
    };
  }

  const topicWords = keywords(source.map((m) => m.body).join(' '), 5);
  const cues = new Set();
  for (const m of source) {
    for (const pattern of [...MEETING_CUES, ...TASK_CUES, ...PAYMENT_CUES, ...DECISION_CUES]) {
      if (pattern.test(m.body)) cues.add(pattern.source.slice(0, 24));
    }
  }

  const scored = [];
  source.forEach((m, index) => {
    const recency = index / Math.max(1, source.length - 1);
    for (const sentence of sentences(m.body)) {
      let score = recency * 1.4;
      const lowered = sentence.toLowerCase();
      for (const { word, count } of topicWords) {
        if (lowered.includes(word)) score += count * 0.6;
      }
      if (QUESTION.test(sentence)) score += 0.9;
      if (/\b(decided|agreed|approved|deadline|invoice|budget|launch|deploy)\b/i.test(sentence)) score += 1.2;
      if (sentence.length > 220) score -= 0.4;
      scored.push({ sentence: truncate(sentence.replace(/\s+/g, ' '), 200), score, at: m.at, outbound: m.outbound, author: m.author });
    }
  });

  const unique = [];
  const seen = new Set();
  for (const item of scored.sort((a, b) => b.score - a.score)) {
    const key = item.sentence.toLowerCase().slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= 5) break;
  }

  // Only the contact's last unanswered question is a genuine open question.
  const openQuestion = ctx.unanswered && QUESTION.test(ctx.unanswered.body)
    ? { text: truncate(ctx.unanswered.body, 180), at: ctx.unanswered.at, from: ctx.contact.name || 'contact' }
    : null;

  const sentiment = scoreSentiment(source.map((m) => m.body).join(' '));

  const bullets = unique.map((u) => ({
    text: u.sentence,
    at: u.at,
    author: u.outbound ? 'You' : u.author || contact.name || 'Contact',
    outbound: u.outbound
  }));

  const subtitle = [
    `${source.length} message${source.length === 1 ? '' : 's'}`,
    topicWords.length ? `topics: ${topicWords.map((t) => t.word).join(', ')}` : null,
    language !== 'en' ? `contact writes in ${language.toUpperCase()}` : null
  ].filter(Boolean).join(' · ');

  return {
    title: conversation.title,
    subtitle,
    bullets,
    topics: topicWords.map((t) => t.word),
    openQuestion,
    sentiment: sentiment.label,
    sentimentScore: sentiment.score,
    unansweredFor: ctx.unansweredFor,
    engine: getAIProvider().effective,
    note: bullets.length === 0 ? 'Messages are too short to extract a meaningful summary.' : null
  };
}

function scoreSentiment(text) {
  const positive = /\b(thanks|great|perfect|good|excellent|appreciate|agreed|approved|excited|happy|well done|nice|love|ready)\b/gi;
  const negative = /\b(problem|issue|delay|late|sorry|concern|worried|blocked|fail|failed|broken|angry|unfortunately|cancel)\b/gi;
  const pos = (text.match(positive) || []).length;
  const neg = (text.match(negative) || []).length;
  const score = pos - neg;
  if (score >= 2) return { label: 'positive', score };
  if (score <= -2) return { label: 'negative', score };
  return { label: 'neutral', score };
}

/* ------------------------------- detection ------------------------------ */

function firstRegexMatch(text, patterns) {
  for (const pattern of patterns) {
    const m = String(text).match(pattern);
    if (m) return m[0];
  }
  return null;
}

/**
 * Detect actionable signals in recent inbound messages.
 * Every detection carries the evidence sentence it came from — no black box.
 */
export function detectSignals(ctx) {
  const { conversation, inbound, contact } = ctx;
  const detections = [];
  const seen = new Set();

  const push = (kind, source, extra = {}) => {
    if (!DETECTION_KINDS[kind]) return;
    const evidence = truncate(source.body.replace(/\s+/g, ' '), 220);
    const dedupe = `${kind}:${evidence.slice(0, 80)}`;
    if (seen.has(dedupe)) return;
    seen.add(dedupe);

    const when = extra.when || parseWhen(source.body, { timeZone: conversation.timeZone || config.timeZone });

    detections.push({
      id: `det_${kind}_${detections.length}_${Math.abs(hash(evidence))}`,
      kind,
      label: DETECTION_KINDS[kind].label,
      icon: DETECTION_KINDS[kind].icon,
      accent: DETECTION_KINDS[kind].accent,
      action: DETECTION_KINDS[kind].action,
      secondary: DETECTION_KINDS[kind].secondary,
      title: extra.title || defaultTitle(kind, when, conversation.timeZone || config.timeZone),
      detail: extra.detail || evidence,
      evidence,
      messageId: source.id,
      at: source.at,
      from: source.author || contact.name || 'contact',
      when: when || null,
      whenLabel: when ? formatInZone(when, conversation.timeZone || config.timeZone, { weekday: true }) : null,
      amount: extra.amount || null,
      owner: extra.owner || null,
      status: 'suggested',
      requiresApproval: true
    });
  };

  for (const message of inbound.slice(-12)) {
    const body = message.body || '';

    if (MEETING_CUES[0].test(body) || MEETING_CUES[1].test(body)) {
      const timeCue = parseWhen(body, { timeZone: conversation.timeZone || config.timeZone });
      if (timeCue || /\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|week|call|meet)\b/i.test(body)) {
        push('meeting', message, {
          when: timeCue,
          title: timeCue
            ? `Meeting proposed · ${formatInZone(timeCue, conversation.timeZone || config.timeZone, { weekday: true })}`
            : 'Meeting requested'
        });
      }
    }

    if (TASK_CUES.some((p) => p.test(body))) {
      const verb = firstRegexMatch(body, [
        /\b(send|prepare|review|update|share|confirm|check|finali[sz]e|draft|schedule|book|create|fix|deploy|upload|approve)\b/i
      ]);
      push('task', message, {
        title: verb ? `Task · ${verb[0].toUpperCase()}${verb.slice(1)}` : 'Task requested',
        owner: extractMentions(body)[0] || contact.name || null
      });
    }

    if (PAYMENT_CUES.some((p) => p.test(body))) {
      const amount = extractMoney(body)[0] || null;
      if (amount || /\b(invoice|payment|overdue|due)\b/i.test(body)) {
        push('payment', message, {
          amount,
          title: amount ? `Payment · ${amount}` : 'Payment mentioned'
        });
      }
    }

    if (DEADLINE_CUES.some((p) => p.test(body))) {
      const when = parseWhen(body, { timeZone: conversation.timeZone || config.timeZone });
      push('deadline', message, {
        when,
        title: when
          ? `Deadline · ${formatInZone(when, conversation.timeZone || config.timeZone, { weekday: true })}`
          : 'Deadline mentioned'
      });
    }

    if (DECISION_CUES[0].test(body)) {
      push('decision', message, { title: 'Decision stated' });
    }

    if (FOLLOWUP_CUES[0].test(body) && !QUESTION.test(body)) {
      push('followup', message, { title: 'Follow-up requested' });
    }
  }

  // Keep the newest, cap the list so the panel stays readable.
  return detections
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5);
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}

function defaultTitle(kind, when, timeZone) {
  switch (kind) {
    case 'meeting':
      return when ? `Meeting · ${formatInZone(when, timeZone, { weekday: true })}` : 'Meeting requested';
    case 'task':
      return 'Task requested';
    case 'payment':
      return 'Payment mentioned';
    case 'deadline':
      return when ? `Deadline · ${formatInZone(when, timeZone, { weekday: true })}` : 'Deadline mentioned';
    case 'decision':
      return 'Decision stated';
    default:
      return 'Needs a reply';
  }
}

/* ---------------------------- reply drafting ---------------------------- */

const TONE_TEMPLATES = {
  professional: ({ greeting, ack, commitment, close, contact }) =>
    [
      greeting,
      `${ack}`,
      `${commitment}`,
      'Please let me know if anything needs adjusting on your side.',
      close
    ].filter(Boolean).join('\n\n'),
  short: ({ commitment, close }) => `${commitment}\n\n${close}`,
  friendly: ({ greeting, ack, commitment, contact }) =>
    `${greeting} ${ack}\n\n${commitment}\n\nThanks so much — talk soon!\n${contact?.name ? '' : ''}`.trim(),
  direct: ({ commitment, close }) => `${commitment}\n\n${close}`
};

/**
 * Draft replies in every tone. The commitment sentence is derived from the
 * contact's actual question/ask so the draft is never generic filler.
 */
export function suggestReplies(ctx, { tones = ['professional', 'short', 'friendly'] } = {}) {
  const { conversation, contact, unanswered, language } = ctx;
  const firstName = String(contact?.name || contact?.handle || 'there').split(/\s+/)[0];
  const ask = unanswered ? unanswered.body : (ctx.lastInbound?.body || '');
  const timeCue = parseWhen(ask, { timeZone: conversation.timeZone || config.timeZone });

  const ack = commitmentFor(ask, { timeCue, firstName, conversation });
  const greeting = `Hi ${firstName},`;
  const close = `Best,\n${ctx.me || 'Tahseen'}`;

  const replies = tones.map((tone) => {
    const tpl = TONE_TEMPLATES[tone] || TONE_TEMPLATES.professional;
    let body = tpl({ greeting, ack, commitment: ack, close, contact });
    if (tone === 'friendly') body = `Hi ${firstName}! ${ack}\n\nThanks so much — talk soon!`;
    return {
      tone,
      body: body.replace(/\n{3,}/g, '\n\n').trim(),
      groundedIn: unanswered ? truncate(unanswered.body, 140) : null,
      language: 'en'
    };
  });

  return {
    replies,
    contactLanguage: language,
    needsReply: Boolean(unanswered),
    unansweredFor: ctx.unansweredFor,
    note: replies.length
      ? 'Drafts are derived from the last inbound message. ZTalk never sends without you pressing Send.'
      : 'No inbound message to reply to.'
  };
}

function commitmentFor(ask, { timeCue, firstName, conversation }) {
  const lowered = String(ask).toLowerCase();
  const cal = conversation.timeZone || config.timeZone;

  if (timeCue) {
    return `That time works for me — I'll confirm ${formatInZone(timeCue, cal, { weekday: true })} on my calendar and send an invite.`;
  }
  if (/\b(proposal|deck|document|doc|file|pdf|attach|attachment|version|v\d)\b/.test(lowered)) {
    return 'I have the document. I will review it today and share my feedback by tomorrow.';
  }
  if (/\b(budget|cost|price|quote|invoice|payment|amount)\b/.test(lowered)) {
    return 'I will go through the numbers and come back with a clear position by the end of tomorrow.';
  }
  if (/\b(timeline|schedule|deadline|when|date|eta)\b/.test(lowered)) {
    return 'Let me confirm the timeline against the current plan and I will send you a firm date.';
  }
  if (/\b(deploy|release|launch|ship|production)\b/.test(lowered)) {
    return 'I will verify the release checklist and confirm the deployment window.';
  }
  if (/\?\s*$/.test(lowered) || QUESTION.test(ask)) {
    return `Good question — I'll check on this and come back to you with a clear answer today.`;
  }
  return 'Thanks for the update — I have noted it and will follow up shortly.';
}

/** Reply translated into the contact's language, with honest coverage reporting. */
export function translateReply(body, targetLanguage) {
  const result = translate(body, targetLanguage);
  return {
    ...result,
    label: 'Translate reply',
    caveat: result.coverage < 1
      ? 'Partial phrasebook coverage. Review before sending — unmatched sentences stayed in English.'
      : null
  };
}

/* -------------------------- cross-platform composer ---------------------- */

/**
 * Build the per-platform variants of one message. Each platform gets a version
 * that respects its real constraints (length, media support, formatting).
 */
export function composeCrossPlatform({ body, targets = [], subject = null, attachments = [] }) {
  const text = String(body || '').trim();
  if (!text) {
    throw Object.assign(new Error('Message body is required.'), { status: 400 });
  }
  const variants = targets.map((platform) => {
    const limit = platform === 'kakaotalk' ? 1000 : platform === 'slack' ? 3800 : platform === 'discord' ? 1900 : 4000;
    const clipped = text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
    return {
      platform,
      text: clipped,
      truncated: clipped !== text,
      supportsMedia: !['kakaotalk', 'wecom'].includes(platform) || attachments.length === 0,
      attachmentsIncluded: attachments.length > 0 && ['whatsapp', 'telegram', 'slack', 'discord', 'messenger', 'wechat', 'line', 'zalo'].includes(platform),
      note: clipped !== text ? `Clipped to ${limit} characters for this platform.` : null
    };
  });
  return { subject, body: text, variants };
}

/* --------------------------------- digest ------------------------------- */

/** Inbox-wide digest used by the "All Messages" AI badge and the dashboard. */
export function inboxDigest(conversations, messageLookup) {
  const needsReply = [];
  const meetingSignals = [];
  const tasks = [];
  const payments = [];

  for (const conv of conversations) {
    const messages = messageLookup(conv.id);
    const ctx = buildContext(conv, messages);
    if (ctx.unanswered) {
      needsReply.push({
        conversationId: conv.id,
        title: conv.title,
        platform: conv.platform,
        from: conv.title,
        preview: truncate(ctx.unanswered.body, 120),
        at: ctx.unanswered.at,
        for: ctx.unansweredFor
      });
    }
    const dets = detectSignals(ctx);
    for (const d of dets) {
      const entry = {
        conversationId: conv.id,
        conversationTitle: conv.title,
        platform: conv.platform,
        ...d
      };
      if (d.kind === 'meeting' || d.kind === 'deadline') meetingSignals.push(entry);
      else if (d.kind === 'task') tasks.push(entry);
      else if (d.kind === 'payment') payments.push(entry);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    needsReply: needsReply.sort((a, b) => new Date(a.at) - new Date(b.at)).slice(0, 8),
    meetingSignals: meetingSignals.slice(0, 5),
    tasks: tasks.slice(0, 5),
    payments: payments.slice(0, 5),
    counts: {
      conversations: conversations.length,
      needsReply: needsReply.length,
      meetings: meetingSignals.length,
      tasks: tasks.length,
      payments: payments.length
    },
    note: 'All signals are extracted from message text on this machine. Nothing is sent automatically.'
  };
}

export { DETECTION_KINDS, TONE_TEMPLATES };
