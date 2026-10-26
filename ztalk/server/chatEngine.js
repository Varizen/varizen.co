/**
 * ZTalk — conversation & message service (was: ZenChat).
 *
 * The store is the source of truth. This module owns every mutation so the HTTP
 * layer stays thin and the invariants live in one place:
 *
 *   - a conversation always has at least one 'contact' participant
 *   - `lastMessageAt` / `lastPreview` / `unread` are derived, never hand-set
 *   - outbound messages are the ONLY way a platform send is recorded
 *   - a demo conversation can never masquerade as a live connection
 */

import { store } from './store.js';
import { id, initials, nowIso, tintOf, truncate } from './util.js';
import { platformMeta } from './platforms.js';

function buildParticipants(conversation) {
  const meta = platformMeta(conversation.platform);
  return (conversation.participants || []).map((p) => ({
    ...p,
    initials: p.initials || initials(p.name || p.handle || '?'),
    tint: p.tint ?? tintOf(p.handle || p.name || '?'),
    platformLabel: meta.label
  }));
}

/** Derived view of a conversation — everything the list column needs. */
export function decorate(conversation, { unreadCount = 0 } = {}) {
  const meta = platformMeta(conversation.platform);
  const messages = store.messagesFor(conversation.id);
  const last = messages.at(-1) || null;
  return {
    ...conversation,
    platformMeta: {
      id: meta.id,
      label: meta.label,
      short: meta.short,
      color: meta.color,
      tint: meta.tint,
      glyph: meta.glyph,
      mode: meta.mode,
      family: meta.family
    },
    participants: buildParticipants(conversation),
    messageCount: messages.length,
    lastMessageAt: last ? last.at : conversation.lastMessageAt,
    lastPreview: last ? last.preview || truncate(last.body, 140) : conversation.lastPreview || '',
    lastAuthor: last ? (last.outbound ? 'You' : last.author) : null,
    lastOutbound: last ? Boolean(last.outbound) : false,
    unread: unreadCount,
    live: conversation.source === 'live',
    simulated: conversation.source !== 'live'
  };
}

export function listConversations({ filter = 'all', platform = null, search = null } = {}) {
  const unreadByConv = new Map();
  for (const m of store.state.messages) {
    if (!m.outbound && !m.read) {
      unreadByConv.set(m.conversationId, (unreadByConv.get(m.conversationId) || 0) + 1);
    }
  }

  let list = store.state.conversations.map((c) =>
    decorate(c, { unreadCount: unreadByConv.get(c.id) || 0 })
  );

  if (platform && platform !== 'all') list = list.filter((c) => c.platform === platform);

  if (filter === 'unread') list = list.filter((c) => c.unread > 0);
  else if (filter === 'important') list = list.filter((c) => c.important);
  else if (filter === 'groups') list = list.filter((c) => c.kind === 'group');
  else if (filter === 'needs-reply') list = list.filter((c) => c.needsReply);

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((c) => {
      if (`${c.title} ${c.lastPreview}`.toLowerCase().includes(q)) return true;
      return store.messagesFor(c.id).some((m) => String(m.body).toLowerCase().includes(q));
    });
  }

  return list.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
}

export function getConversation(cid) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  const unread = store
    .messagesFor(conv.id)
    .filter((m) => !m.outbound && !m.read).length;
  return decorate(conv, { unreadCount: unread });
}

export function getMessages(cid, { limit = 120, before = null } = {}) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  let list = store.messagesFor(conv.id);
  if (before) list = list.filter((m) => new Date(m.at) < new Date(before));
  return list.slice(-limit);
}

export function markRead(cid) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  let changed = 0;
  for (const m of store.state.messages) {
    if (m.conversationId === conv.id && !m.outbound && !m.read) {
      m.read = true;
      changed += 1;
    }
  }
  conv.unread = 0;
  store.persist();
  if (changed) store.emit('conversation:read', { conversationId: conv.id, changed });
  return { conversationId: conv.id, marked: changed };
}

export function toggleImportant(cid, value) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  conv.important = typeof value === 'boolean' ? value : !conv.important;
  store.persist();
  store.emit('conversation:update', { conversationId: conv.id });
  return { conversationId: conv.id, important: conv.important };
}

/**
 * Record an inbound message from a platform webhook or the demo sandbox.
 * `source` is explicit so the UI can never confuse simulated with live.
 */
export function receiveMessage({ conversationId, body, author = null, at = null, kind = 'text', attachments = [], source = 'demo' }) {
  const conv = store.conversation(conversationId);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  const text = truncate(String(body ?? ''), 8000);
  if (!text && attachments.length === 0) {
    throw Object.assign(new Error('A message needs text or an attachment.'), { status: 400 });
  }

  const message = {
    id: id('msg', 8),
    conversationId: conv.id,
    outbound: false,
    author: author || conv.title,
    body: text,
    preview: truncate(text.replace(/\s+/g, ' '), 140),
    kind,
    attachments,
    at: at || nowIso(),
    read: false,
    source,
    ai: null
  };

  store.state.messages.push(message);
  conv.lastMessageAt = message.at;
  conv.lastPreview = message.preview;
  if (conv.source !== 'live' && source === 'live') conv.source = 'live';
  store.persist();
  store.log('message.inbound', `Inbound message in ${conv.title}`, {
    conversationId: conv.id,
    actor: author || 'platform',
    detail: { source, platform: conv.platform }
  });
  store.emit('message', { conversationId: conv.id, message, conversation: decorate(conv) });
  return message;
}

/**
 * Send a message. In the demo sandbox this records an outbound message and
 * reports `delivered: false, simulated: true` so the UI can show the truth.
 * When a platform bridge is configured, delivery is delegated to it.
 */
export function sendMessage({ conversationId, body, attachments = [], ai = null, deliver = null }) {
  const conv = store.conversation(conversationId);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  const text = String(body ?? '').trim();
  if (!text && attachments.length === 0) {
    throw Object.assign(new Error('Cannot send an empty message.'), { status: 400 });
  }
  if (text.length > 8000) {
    throw Object.assign(new Error('Message exceeds the 8,000 character limit.'), { status: 413 });
  }

  const message = {
    id: id('msg', 8),
    conversationId: conv.id,
    outbound: true,
    author: store.state.identity.name,
    body: text,
    preview: truncate(text.replace(/\s+/g, ' '), 140),
    kind: attachments.length ? 'file' : 'text',
    attachments,
    at: nowIso(),
    read: true,
    source: deliver?.live ? 'live' : 'demo',
    ai: ai ? { assisted: true, mode: ai.mode, tone: ai.tone || null, approvedBy: store.state.identity.name } : null,
    delivery: deliver?.live
      ? { state: deliver.ok ? 'sent' : 'failed', provider: conv.platform, detail: deliver.detail || null }
      : { state: 'simulated', provider: conv.platform, detail: 'Sandbox conversation — recorded locally, not delivered to the platform.' }
  };

  store.state.messages.push(message);
  conv.lastMessageAt = message.at;
  conv.lastPreview = message.preview;
  conv.needsReply = false;
  store.persist();

  store.log('message.outbound', `Message to ${conv.title}`, {
    conversationId: conv.id,
    actor: store.state.identity.email,
    detail: { platform: conv.platform, simulated: !deliver?.live, chars: text.length }
  });
  if (ai?.assisted) {
    store.activity('draft.accepted', `AI-assisted reply sent in ${conv.title}`, {
      conversationId: conv.id,
      conversationName: conv.title
    });
  }
  store.emit('message', { conversationId: conv.id, message, conversation: decorate(conv) });

  return {
    message,
    delivered: Boolean(deliver?.live && deliver.ok),
    simulated: !deliver?.live,
    note: deliver?.live
      ? null
      : 'Sandbox conversation. The message is stored in ZTalk only — connect a platform bridge to deliver it for real.'
  };
}

export function createConversation({ title, platform = 'whatsapp', participants = [], kind = 'direct', timeZone = null, important = false, source = 'demo', handle = null }) {
  const meta = platformMeta(platform);
  const userRole = { name: store.state.identity.name, handle: store.state.identity.email, role: 'self', isSelf: true };

  const conv = {
    id: id('conv', 8),
    code: `zc${Math.random().toString(36).slice(2, 7)}`,
    title: truncate(title || 'New conversation', 80),
    platform: meta.id,
    kind,
    source,
    important,
    needsReply: false,
    unread: 0,
    lastMessageAt: nowIso(),
    lastPreview: '',
    timeZone: timeZone || store.state.settings.timeZone,
    tags: [],
    participants: [
      userRole,
      ...(participants.length
        ? participants.map((p) => ({
            name: p.name,
            handle: p.handle || handle || p.name,
            role: 'contact',
            isSelf: false,
            verified: Boolean(p.verified)
          }))
        : [{ name: title || 'Contact', handle: handle || title || 'contact', role: 'contact', isSelf: false, verified: false }])
    ],
    createdAt: nowIso()
  };

  store.state.conversations.push(conv);
  store.persist();
  store.log('conversation.created', `Created ${conv.title} on ${meta.label}`, {
    conversationId: conv.id,
    actor: store.state.identity.email
  });
  store.emit('conversation:update', { conversationId: conv.id });
  return decorate(conv);
}

export function updateConversation(cid, patch) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  const allowed = ['title', 'important', 'needsReply', 'tags', 'timeZone', 'muted', 'pinned'];
  for (const key of allowed) {
    if (patch[key] !== undefined) conv[key] = patch[key];
  }
  store.persist();
  store.emit('conversation:update', { conversationId: conv.id });
  return decorate(conv);
}

export function search({ q, platform = null, limit = 40 }) {
  const query = String(q || '').trim().toLowerCase();
  if (query.length < 2) return { query, results: [], note: 'Type at least two characters.' };

  const results = [];
  for (const conv of store.state.conversations) {
    if (platform && platform !== 'all' && conv.platform !== platform) continue;
    for (const m of store.messagesFor(conv.id)) {
      if (!String(m.body).toLowerCase().includes(query)) continue;
      const idx = String(m.body).toLowerCase().indexOf(query);
      results.push({
        messageId: m.id,
        conversationId: conv.id,
        conversationTitle: conv.title,
        platform: conv.platform,
        outbound: m.outbound,
        author: m.outbound ? 'You' : m.author,
        at: m.at,
        excerpt:
          (idx > 42 ? '…' : '') +
          String(m.body).slice(Math.max(0, idx - 42), idx + 120).replace(/\s+/g, ' ').trim()
      });
      if (results.length >= limit) break;
    }
    if (results.length >= limit) break;
  }

  return {
    query,
    results: results.sort((a, b) => new Date(b.at) - new Date(a.at)),
    note: results.length ? null : 'No messages matched. Search covers every connected conversation you own.'
  };
}

/** Counters for the sidebar badges, matching the design. */
export function counts() {
  const convs = store.state.conversations;
  const unreadMessages = store.state.messages.filter((m) => !m.outbound && !m.read);
  return {
    all: convs.length,
    unread: new Set(unreadMessages.map((m) => m.conversationId)).size,
    unreadMessages: unreadMessages.length,
    important: convs.filter((c) => c.important).length,
    groups: convs.filter((c) => c.kind === 'group').length,
    needsReply: convs.filter((c) => c.needsReply).length,
    tasks: store.state.tasks.filter((t) => !t.done).length,
    accounts: store.state.accounts.length
  };
}
