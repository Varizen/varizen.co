/**
 * ZTalk — HTTP server (was: ZenChat).
 *
 * Zero npm dependencies. Built-in http + an SSE stream for live updates.
 * Routes are registered in a small table so the surface stays auditable.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { store } from './store.js';
import {
  counts,
  createConversation,
  getConversation,
  getMessages,
  listConversations,
  markRead,
  receiveMessage,
  search,
  sendMessage,
  toggleImportant,
  updateConversation
} from './chatEngine.js';
import {
  buildContext,
  composeCrossPlatform,
  detectSignals,
  inboxDigest,
  suggestReplies,
  summarizeConversation,
  translateReply
} from './aiEngine.js';
import { AI_MODES, getAIProvider, providerStatus, requireAIMode, setAIProvider } from './aiProvider.js';
import { LANGUAGES, detectLanguage, phrasebook, translate, translationCapability } from './translate.js';
import { HEADER_TRAY, PLATFORMS, PLATFORM_KEYS, TONES, TRANSLATION_TARGETS, platformMeta } from './platforms.js';
import {
  addTask,
  addToCalendar,
  calendarStatus,
  createMeetingFromDetection,
  integrationStatus,
  listTasks,
  meetingStatus,
  suggestMeetingTimes,
  toggleTask
} from './bridges.js';
import { rateLimit, requestKey, sameOrigin, securityHeaders, verifyWebhook } from './security.js';
import { seedDemoData } from './seed.js';
import { clamp, escapeHtml, id, nowIso, truncate } from './util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon'
};

const MAX_BODY = config.limits.bodyBytes;

/* ------------------------------- plumbing ------------------------------- */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let overflow = false;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        overflow = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (overflow) return reject(Object.assign(new Error('Request body too large'), { status: 413 }));
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
    ...securityHeaders
  });
  res.end(body);
}

function sendError(res, err) {
  const status = err.status || 500;
  sendJson(res, status, {
    error: err.message || 'Unexpected error',
    status,
    capability: err.capability || null,
    aiMode: err.aiMode || null,
    needsKey: Boolean(err.needsKey),
    needsConsent: Boolean(err.needsConsent)
  });
}

/* -------------------------------- routes -------------------------------- */

const routes = [];
const route = (method, pattern, handler) => routes.push({ method, pattern, handler });

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

/** Loads a conversation + messages and builds the AI context. */
function contextFor(cid) {
  const conv = store.conversation(cid);
  if (!conv) throw Object.assign(new Error('Conversation not found.'), { status: 404 });
  const messages = store.messagesFor(conv.id);
  return { conversation: conv, messages, ctx: buildContext(conv, messages) };
}

/* --------------------------------- meta --------------------------------- */

route('GET', '/api/health', () => ({
  ok: true,
  at: nowIso(),
  product: 'ZTalk',
  conversations: store.state.conversations.length,
  messages: store.state.messages.length,
  ai: getAIProvider().effective,
  translation: translationCapability().engine,
  siblings: { zenMeet: config.zenMeetUrl, zenCalendar: config.zenCalendarUrl, zenBox: config.zenBoxUrl }
}));

route('GET', '/api/state', async () => {
  const [integrations] = await Promise.all([integrationStatus()]);
  return {
    identity: store.state.identity,
    settings: store.state.settings,
    counts: counts(),
    aiProvider: getAIProvider(),
    aiModes: Object.values(AI_MODES),
    integrations,
    vocabulary: {
      platforms: PLATFORM_KEYS.map((k) => PLATFORMS[k]),
      headerTray: HEADER_TRAY,
      tones: TONES,
      translationTargets: TRANSLATION_TARGETS,
      languages: Object.values(LANGUAGES),
      translation: translationCapability()
    }
  };
});

route('PATCH', '/api/settings', (_req, _url, { body }) => {
  const allowed = ['timeZone', 'displayName', 'language', 'aiMode', 'density', 'showTranslationByDefault', 'theme'];
  for (const key of allowed) {
    if (body[key] !== undefined) store.state.settings[key] = body[key];
  }
  if (body.displayName) {
    store.state.identity.name = truncate(body.displayName, 60);
  }
  store.persist();
  store.log('settings.updated', 'Settings updated', { actor: store.state.identity.email });
  return { settings: store.state.settings, identity: store.state.identity };
});

/* ----------------------------- conversations ---------------------------- */

route('GET', '/api/conversations', (_req, url) =>
  ({
    conversations: listConversations({
      filter: url.searchParams.get('filter') || 'all',
      platform: url.searchParams.get('platform') || null,
      search: url.searchParams.get('search') || null
    }),
    counts: counts()
  }));

route('POST', '/api/conversations', (_req, _url, { body }) => createConversation(body));

route('GET', '/api/conversations/:cid', (_req, _url, { cid }) => {
  const conversation = getConversation(cid);
  return {
    conversation,
    messages: getMessages(cid, { limit: clamp(_url.searchParams.get('limit') || 120, 1, 400) })
  };
});

route('PATCH', '/api/conversations/:cid', (_req, _url, { cid, body }) => updateConversation(cid, body));

route('POST', '/api/conversations/:cid/read', (_req, _url, { cid }) => markRead(cid));

route('POST', '/api/conversations/:cid/important', (_req, _url, { cid, body }) =>
  toggleImportant(cid, body.value));

route('GET', '/api/conversations/:cid/messages', (_req, url, { cid }) =>
  ({
    messages: getMessages(cid, {
      limit: clamp(url.searchParams.get('limit') || 120, 1, 400),
      before: url.searchParams.get('before') || null
    })
  }));

/** Send a message. Optionally records that an AI draft was accepted. */
route('POST', '/api/conversations/:cid/messages', (_req, _url, { cid, body }) => {
  const { conversation } = contextFor(cid);
  const simulated = conversation.source !== 'live';
  return sendMessage({
    conversationId: conversation.id,
    body: body.body,
    attachments: body.attachments || [],
    ai: body.ai || null,
    deliver: simulated ? null : { live: true, ok: true, detail: 'Forwarded to the platform bridge.' }
  });
});

/* ---------------------------------- AI ---------------------------------- */

route('POST', '/api/conversations/:cid/ai/summary', (_req, _url, { cid }) => {
  const { conversation, ctx } = contextFor(cid);
  requireAIMode(store.state.settings.aiMode, 'summarize');
  const summary = summarizeConversation(ctx);
  store.activity('summary.generated', `Summarised ${conversation.title}`, {
    conversationId: conversation.id,
    conversationName: conversation.title
  });
  return { conversationId: conversation.id, summary, aiMode: store.state.settings.aiMode };
});

route('POST', '/api/conversations/:cid/ai/replies', (_req, _url, { cid, body }) => {
  const { conversation, ctx } = contextFor(cid);
  requireAIMode(store.state.settings.aiMode, 'suggest');
  const result = suggestReplies(ctx, { tones: body.tones || ['professional', 'short', 'friendly'] });
  store.activity('replies.suggested', `Drafted ${result.replies.length} replies for ${conversation.title}`, {
    conversationId: conversation.id,
    conversationName: conversation.title
  });
  return { conversationId: conversation.id, ...result, aiMode: store.state.settings.aiMode };
});

route('POST', '/api/conversations/:cid/ai/translate', (_req, _url, { cid, body }) => {
  const { conversation, ctx } = contextFor(cid);
  requireAIMode(store.state.settings.aiMode, 'translate');
  const target = body.target || ctx.language || store.state.settings.language;
  const input = body.text || (ctx.unanswered ? ctx.unanswered.body : (ctx.lastInbound?.body ?? ''));

  if (!String(input || '').trim()) {
    return { conversationId: conversation.id, empty: true, note: 'Nothing to translate in this conversation yet.' };
  }

  const result = translate(input, target);
  store.activity('translation.generated', `Translated into ${LANGUAGES[target]?.label || target} for ${conversation.title}`, {
    conversationId: conversation.id,
    conversationName: conversation.title
  });
  return {
    conversationId: conversation.id,
    original: input,
    originalLanguage: result.source,
    ...result,
    aiMode: store.state.settings.aiMode
  };
});

route('POST', '/api/conversations/:cid/ai/translate-reply', (_req, _url, { cid, body }) => {
  const { conversation, ctx } = contextFor(cid);
  requireAIMode(store.state.settings.aiMode, 'translate');
  const target = body.target || ctx.language;
  const text = body.text || suggestReplies(ctx).replies[0]?.body || '';
  if (!text) return { conversationId: conversation.id, empty: true };
  return {
    conversationId: conversation.id,
    target,
    ...translateReply(text, target)
  };
});

route('GET', '/api/conversations/:cid/detections', (_req, _url, { cid }) => {
  const { conversation, ctx } = contextFor(cid);
  const detections = detectSignals(ctx);
  return {
    conversationId: conversation.id,
    detections,
    counts: detections.reduce((acc, d) => ({ ...acc, [d.kind]: (acc[d.kind] || 0) + 1 }), {}),
    note: 'Detections are proposals. Nothing is created until you approve it.'
  };
});

route('POST', '/api/conversations/:cid/detections/:detectionId/dismiss', (_req, _url, { cid, detectionId }) => {
  store.state.detections = (store.state.detections || []).filter(
    (d) => !(d.conversationId === cid && d.id === detectionId)
  );
  store.persist();
  return { conversationId: cid, detectionId, dismissed: true };
});

route('GET', '/api/digest', () => {
  const digest = inboxDigest(store.state.conversations, (cid) => store.messagesFor(cid));
  return digest;
});

/* ------------------------------ AI provider ----------------------------- */

route('GET', '/api/ai/status', () => providerStatus());

route('POST', '/api/ai/provider', (_req, _url, { body }) =>
  setAIProvider(
    { kind: body.kind, model: body.model, allowRemote: Boolean(body.allowRemote) },
    { actor: store.state.identity.email }
  ));

route('GET', '/api/ai/activity', (_req, url) => ({
  activity: (store.state.aiActivity || []).filter(
    (a) => !url.searchParams.get('conversationId') || a.conversationId === url.searchParams.get('conversationId')
  ).slice(0, clamp(url.searchParams.get('limit') || 60, 1, 200))
}));

route('GET', '/api/ai/translation', () => translationCapability());

route('GET', '/api/ai/phrasebook', (_req, url) => ({
  phrases: phrasebook().slice(0, clamp(url.searchParams.get('limit') || 200, 1, 400)),
  capability: translationCapability()
}));

/* ------------------------------ integrations ---------------------------- */

route('GET', '/api/integrations', () => integrationStatus());

route('POST', '/api/integrations/zenmeet/from-detection', async (_req, _url, { body }) => {
  const { conversation, ctx } = contextFor(body.conversationId);
  const detections = detectSignals(ctx);
  const detection = body.detection || detections.find((d) => d.id === body.detectionId) || detections[0];
  if (!detection) {
    throw Object.assign(new Error('No meeting signal found in this conversation.'), { status: 404 });
  }
  return createMeetingFromDetection({
    detection,
    conversation,
    durationMinutes: clamp(body.durationMinutes || 30, 15, 240)
  });
});

route('POST', '/api/integrations/zenmeet/slots', async (_req, _url, { body }) => {
  const conversation = body.conversationId ? store.conversation(body.conversationId) : null;
  return suggestMeetingTimes({
    conversation,
    durationMinutes: clamp(body.durationMinutes || 30, 15, 240),
    count: clamp(body.count || 3, 1, 6)
  });
});

route('GET', '/api/integrations/zenmeet', () => meetingStatus());
route('GET', '/api/integrations/zencalendar', () => calendarStatus());

route('POST', '/api/integrations/zencalendar/from-detection', async (_req, _url, { body }) => {
  const { conversation, ctx } = contextFor(body.conversationId);
  const detections = detectSignals(ctx);
  const detection =
    body.detection ||
    detections.find((d) => d.id === body.detectionId) ||
    detections.find((d) => d.kind === 'deadline' || d.kind === 'meeting') ||
    detections[0];
  if (!detection) {
    throw Object.assign(new Error('No calendar-worthy signal found in this conversation.'), { status: 404 });
  }
  return addToCalendar({
    detection,
    conversation,
    durationMinutes: clamp(body.durationMinutes || 30, 15, 480)
  });
});

/* --------------------------------- tasks -------------------------------- */

route('GET', '/api/tasks', (_req, url) => {
  const done = url.searchParams.get('done');
  return { tasks: listTasks({ done: done === null ? null : done === 'true' }) };
});

route('POST', '/api/tasks', (_req, _url, { body }) => addTask(body));

route('PATCH', '/api/tasks/:taskId', (_req, _url, { taskId, body }) => toggleTask(taskId, body.done));

/* --------------------------- cross-platform ----------------------------- */

route('POST', '/api/compose/cross-platform', (_req, _url, { body }) => {
  const variants = composeCrossPlatform({
    body: body.body,
    targets: body.targets || [],
    subject: body.subject || null,
    attachments: body.attachments || []
  });
  return {
    ...variants,
    targets: (body.targets || []).map((p) => platformMeta(p)),
    simulated: true,
    note: 'Cross-platform fan-out is composed and previewed here. Each variant is delivered only through its platform bridge.'
  };
});

route('POST', '/api/broadcast', async (_req, _url, { body }) => {
  const body_ = String(body.body || '').trim();
  const targets = body.targets || [];
  if (!body_) throw Object.assign(new Error('A broadcast body is required.'), { status: 400 });
  if (targets.length === 0) throw Object.assign(new Error('Select at least one platform.'), { status: 400 });
  if (targets.length > config.limits.maxBroadcastTargets) {
    throw Object.assign(new Error(`At most ${config.limits.maxBroadcastTargets} platforms per broadcast.`), { status: 400 });
  }

  const record = {
    id: id('bc', 6),
    body: body_,
    subject: body.subject || null,
    targets,
    variants: composeCrossPlatform({ body: body_, targets }).variants,
    status: 'queued',
    simulated: true,
    createdAt: nowIso(),
    note: 'Queued in the sandbox. A platform bridge is required for real delivery.'
  };
  store.state.broadcasts = [record, ...(store.state.broadcasts || [])].slice(0, 40);
  store.persist();
  store.log('broadcast.queued', `Broadcast queued for ${targets.length} platform(s)`, {
    actor: store.state.identity.email,
    detail: { targets }
  });
  store.activity('broadcast.queued', `Queued a broadcast to ${targets.length} platform(s)`);
  return record;
});

route('POST', '/api/compose/schedule', (_req, _url, { body }) => {
  const when = body.when || null;
  if (!when) throw Object.assign(new Error('A send time is required.'), { status: 400 });
  const record = {
    id: id('sch', 6),
    body: body.body,
    subject: body.subject || null,
    when,
    targets: body.targets || [],
    status: 'scheduled',
    simulated: true,
    createdAt: nowIso()
  };
  store.state.broadcasts = [record, ...(store.state.broadcasts || [])].slice(0, 40);
  store.persist();
  return record;
});

/* -------------------------------- search -------------------------------- */

route('GET', '/api/search', (_req, url) =>
  search({
    q: url.searchParams.get('q') || '',
    platform: url.searchParams.get('platform') || null,
    limit: clamp(url.searchParams.get('limit') || 40, 1, 100)
  }));

/* -------------------------------- accounts ------------------------------- */

route('GET', '/api/accounts', () => ({
  accounts: store.state.accounts,
  platforms: PLATFORM_KEYS.map((k) => PLATFORMS[k]),
  note: 'Handles are sandbox placeholders. Secrets are never stored by ZTalk — an operator sets them as env vars on their own deployment.'
}));

route('POST', '/api/accounts', (_req, _url, { body }) => {
  const meta = platformMeta(body.platform);
  if (!PLATFORMS[body.platform]) {
    throw Object.assign(new Error(`Unknown platform "${body.platform}".`), { status: 400 });
  }
  const account = {
    id: id('acct', 6),
    platform: meta.id,
    label: body.label || meta.label,
    handle: truncate(body.handle || '', 80),
    count: 0,
    state: 'sandbox',
    connectedAt: nowIso(),
    note: `Sandbox handle. Real connections need ${meta.secretHint || 'provider credentials'} set server-side.`
  };
  store.state.accounts.push(account);
  store.persist();
  store.log('account.added', `${meta.label} handle added`, { actor: store.state.identity.email });
  return account;
});

route('DELETE', '/api/accounts/:accountId', (_req, _url, { accountId }) => {
  const before = store.state.accounts.length;
  store.state.accounts = store.state.accounts.filter((a) => a.id !== accountId);
  if (store.state.accounts.length === before) {
    throw Object.assign(new Error('Account not found.'), { status: 404 });
  }
  store.persist();
  return { removed: true };
});

/* -------------------------------- webhooks ------------------------------- */

/**
 * Inbound platform webhook. Disabled unless ZENCHAT_WEBHOOK_SECRET is set —
 * an anonymous write endpoint would be a spoofing vector.
 */
route('POST', '/api/webhooks/:platform', (_req, _url, { platform, body, req }) => {
  const check = verifyWebhook(req);
  if (!check.ok) throw Object.assign(new Error(check.error), { status: check.status });
  if (!PLATFORMS[platform]) throw Object.assign(new Error('Unknown platform.'), { status: 404 });

  const conversationId = body.conversationId;
  if (!conversationId) throw Object.assign(new Error('conversationId is required.'), { status: 400 });

  // Only conversations already owned by this platform may receive a webhook.
  const conv = store.conversation(conversationId);
  if (!conv || conv.platform !== platform) {
    throw Object.assign(new Error('No conversation on this platform matches that id.'), { status: 404 });
  }

  const message = receiveMessage({
    conversationId: conv.id,
    body: body.text || body.body || '',
    author: body.author || conv.title,
    attachments: body.attachments || [],
    source: 'live'
  });
  return { received: true, messageId: message.id, conversationId: conv.id };
});

/* ------------------------------ audit trail ------------------------------ */

route('GET', '/api/audit', (_req, url) => ({
  entries: (store.state.auditLog || []).slice(0, clamp(url.searchParams.get('limit') || 80, 1, 300))
}));

route('GET', '/api/privacy', () => ({
  aiProvider: getAIProvider(),
  aiMode: store.state.settings.aiMode,
  translation: translationCapability(),
  statement:
    'ZTalk does not sell or monetise message content. The local engine runs on this machine. Remote providers are opt-in, require an operator key, and are disclosed before use.',
  storage: {
    engine: process.env.ZENCHAT_EPHEMERAL === '1' ? 'ephemeral (memory only)' : 'AES-256-GCM at .data/ztalk.json.enc',
    note: 'Conversation text is stored locally. Third-party platform credentials are never persisted by ZTalk.'
  },
  bridges: {
    zenMeet: 'Rooms are created in ZMeet only when you approve a detection.',
    zenCalendar: 'Events are created in ZCal only when you approve a detection.',
    zenBox: 'No mailbox contents are read. ZTalk links out to ZMail.'
  }
}));

/* -------------------------------- sandbox -------------------------------- */

route('POST', '/api/sandbox/seed', (_req, _url, { body }) => seedDemoData({ force: Boolean(body.force) }));

route('POST', '/api/sandbox/reset', () => {
  store.state.conversations = [];
  store.state.messages = [];
  store.state.tasks = [];
  store.state.detections = [];
  store.state.aiActivity = [];
  store.state.accounts = [];
  store.state.broadcasts = [];
  store.persist();
  return { reset: true };
});

/* -------------------------------- events --------------------------------- */

route('GET', '/api/events', (_req, _url, { req, res }) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    ...securityHeaders
  });
  res.write(`event: hello\ndata: ${JSON.stringify({ at: nowIso() })}\n\n`);

  const unsubscribe = store.subscribe((event) => {
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  });
  const keepAlive = setInterval(() => res.write(': ping\n\n'), 25_000);
  keepAlive.unref?.();

  req.on('close', () => {
    clearInterval(keepAlive);
    unsubscribe();
    res.end();
  });
  return null; // response already handled
});

/* --------------------------------- static -------------------------------- */

function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  // SPA-ish entry points used by the design.
  if (/^\/c\//.test(pathname)) rel = '/index.html';
  if (/^\/meet\//.test(pathname)) rel = '/index.html';

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
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache, must-revalidate',
      'Content-Security-Policy': config.csp,
      ...securityHeaders
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
}

/* ------------------------------ server factory ---------------------------- */

export function createServer() {
  return http.createServer(async (req, res) => {
    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch {
      res.writeHead(400, securityHeaders);
      return res.end('Bad Request');
    }
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        ...securityHeaders
      });
      return res.end();
    }

    if (pathname.startsWith('/api/')) {
      if (!rateLimit(req)) {
        return sendJson(res, 429, {
          error: 'Too many requests. Slow down — this is a per-IP token bucket.',
          status: 429,
          retryAfterMs: 60_000
        });
      }
      if (!sameOrigin(req)) {
        return sendJson(res, 403, {
          error: 'Cross-origin state-changing request rejected.',
          status: 403,
          hint: 'ZTalk enforces same-origin for mutations.'
        });
      }

      const match = matchRoute(req.method, pathname);
      if (!match) {
        return sendJson(res, 404, { error: `No route for ${req.method} ${pathname}`, status: 404 });
      }

      try {
        let body = {};
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          body = await readBody(req);
        }
        const query = Object.fromEntries(url.searchParams.entries());
        const result = await match.handler(
          { params: match.params, query, body, req, res, url },
          url,
          { ...match.params, body, req, res, query, url }
        );
        if (result === null || res.writableEnded) return;
        return sendJson(res, 200, result);
      } catch (err) {
        if (res.writableEnded) return;
        return sendError(res, err);
      }
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return serveStatic(req, res, pathname);
    }

    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', ...securityHeaders });
    return res.end('Method Not Allowed');
  });
}

/* ---------------------------------- boot --------------------------------- */

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const server = createServer();
  seedDemoData();
  server.listen(config.port, config.host, () => {
    const shown = config.host === '0.0.0.0' ? 'localhost' : config.host;
    /* eslint-disable no-console */
    console.log('\n  ZTalk — Every Conversation. One Place.');
    console.log(`  → http://${shown}:${config.port}\n`);
    console.log(`  AI         : ${getAIProvider().effective}`);
    console.log(`  Sandbox    : ${store.state.conversations.length} conversations, ${store.state.messages.length} messages`);
    console.log(`  ZMeet    : ${config.zenMeetUrl}`);
    console.log(`  ZCal     : ${config.zenCalendarUrl}\n`);
    /* eslint-enable no-console */
  });
}

export { escapeHtml, requestKey };
