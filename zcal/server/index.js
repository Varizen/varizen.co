/**
 * ZCal — HTTP server (was: ZenCalendar). Zero dependencies, Node built-ins only.
 *
 * Security posture (prompt §27):
 *  - CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors 'none'
 *  - same-origin enforcement for all mutating requests (CSRF)
 *  - in-memory rate limiting per client
 *  - strict JSON body limits and type validation
 *  - provider credentials never leave the process
 *  - every consequential action is written to the audit log
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { calendarService } from './calendarService.js';
import { sandbox, CAPABILITIES, PERMISSION_LEVELS } from './sandbox.js';
import {
  handleCommand,
  dailyPlan,
  agentAnalysis,
  meetingBrief,
  meetingFollowUp,
  findSlots,
  resolveIntent,
  daySummary,
  AI_PROVIDERS,
  getAIProvider,
  setAIProvider
} from './planner.js';
import { zenboxStatus, scanForSchedulingRequests } from './zenboxBridge.js';
import { buildICS, parseICS } from './ical.js';
import { browserSandboxTargets } from './providers.js';
import { store } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const MAX_BODY_BYTES = 240 * 1024;

/* ----------------------------- rate limiting ----------------------------- */

const buckets = new Map();

function rateLimit(key, { limit = 180, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  bucket.count += 1;
  if (bucket.count > limit) return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  return { ok: true, remaining: limit - bucket.count };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.resetAt < now) buckets.delete(key);
}, 60_000).unref();

/* ----------------------------- helpers ----------------------------- */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return reject(Object.assign(new Error('Body must be a JSON object'), { status: 400 }));
        }
        resolve(parsed);
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

const securityHeaders = {
  'Content-Security-Policy': config.csp,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()'
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    ...securityHeaders
  });
  res.end(body);
}

function sendError(res, err) {
  const status = err?.status || 500;
  if (status >= 500) console.error('[zcal]', err);
  sendJson(res, status, {
    error: err?.message || 'Internal error',
    ...(err?.needsPermission ? { needsPermission: true, capability: err.capability } : {})
  });
}

/** Same-origin check for state-changing requests (CSRF defence). */
function sameOrigin(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser client (CLI/tests) with no Origin header
  try {
    const host = new URL(origin).host;
    return host === req.headers.host;
  } catch {
    return false;
  }
}

/* ----------------------------- routes ----------------------------- */

const routes = [];
function route(method, pattern, handler, options = {}) {
  routes.push({ method, pattern, handler, options });
}

/* --- health + bootstrap --- */

route('GET', '/api/health', () => ({
  status: 'ok',
  app: 'zcal',
  version: '1.0.0',
  demoData: config.demoAccountEnabled,
  timeZone: calendarService.getSettings().timeZone,
  cache: store.stats()
}));

route('GET', '/api/bootstrap', () => ({
  settings: calendarService.getSettings(),
  identities: calendarService.getIdentities(),
  accounts: calendarService.listAccounts(),
  calendars: calendarService.listCalendars(),
  providers: calendarService.listProviders(),
  aiProviders: AI_PROVIDERS,
  aiProvider: getAIProvider(),
  permissions: sandbox.grants(),
  capabilities: CAPABILITIES,
  permissionLevels: PERMISSION_LEVELS,
  browserSandboxTargets,
  tasks: calendarService.listTasks(),
  activity: calendarService.getActivity(40),
  proposals: sandbox.list().slice(0, 10),
  cache: store.stats(),
  demo: config.demoAccountEnabled
}));

/* --- calendar views --- */

route('GET', '/api/view', (_req, url) => {
  const view = url.searchParams.get('view') || 'week';
  const anchor = url.searchParams.get('anchor') || null;
  const timeZone = url.searchParams.get('timeZone') || undefined;
  return calendarService.getView({ view, anchor, timeZone });
});

route('GET', '/api/events', (_req, url) => {
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const timeZone = url.searchParams.get('timeZone') || undefined;
  return calendarService.getTimeline({
    start: start || undefined,
    end: end || undefined,
    timeZone,
    includeHidden: url.searchParams.get('includeHidden') === '1'
  });
});

route('GET', '/api/events/:id', (_req, url, { id }) => {
  const event = calendarService.getEventByRemoteOrInstance(id);
  if (!event) throw Object.assign(new Error('Event not found'), { status: 404 });
  return event;
});

route('GET', '/api/availability', (_req, url) =>
  calendarService.getAvailability({
    start: url.searchParams.get('start') || undefined,
    end: url.searchParams.get('end') || undefined,
    timeZone: url.searchParams.get('timeZone') || undefined
  })
);

route('GET', '/api/search', (_req, url) =>
  calendarService.search(url.searchParams.get('q') || '', {
    timeZone: url.searchParams.get('timeZone') || undefined,
    limit: Number(url.searchParams.get('limit') || 60)
  })
);

route('GET', '/api/conflicts', (_req, url) => {
  const view = calendarService.getView({
    view: 'week',
    anchor: url.searchParams.get('anchor') || undefined,
    timeZone: url.searchParams.get('timeZone') || undefined
  });
  return {
    conflicts: calendarService.detectConflicts(view.events).map((c) => ({
      id: c.id,
      a: { id: c.a.id, title: c.a.title, start: c.a.start, end: c.a.end, calendarName: c.a.calendarName },
      b: { id: c.b.id, title: c.b.title, start: c.b.start, end: c.b.end, calendarName: c.b.calendarName },
      overlapStart: c.overlapStart,
      overlapEnd: c.overlapEnd
    }))
  };
});

/* --- event mutations (routed to native providers) --- */

route('POST', '/api/events', async (_req, _url, { body }) => calendarService.createEvent(body, { actor: 'user' }));

route('PATCH', '/api/events/:id', async (_req, _url, { id, body }) =>
  calendarService.updateEvent(id, body, { actor: 'user' })
);

route('DELETE', '/api/events/:id', async (_req, _url, { id }) => calendarService.deleteEvent(id, { actor: 'user' }));

route('POST', '/api/events/:id/respond', async (_req, _url, { id, body }) =>
  calendarService.respondToEvent(id, body.rsvp, { actor: 'user' })
);

/* --- accounts + calendars --- */

route('GET', '/api/accounts', () => calendarService.listAccounts());
route('POST', '/api/accounts', (_req, _url, { body }) => calendarService.connectAccount(body));
route('DELETE', '/api/accounts/:id', (_req, _url, { id }) => calendarService.disconnectAccount(id));
route('POST', '/api/accounts/:id/sync', (_req, _url, { id }) => calendarService.sync({ accountId: id }));
route('POST', '/api/accounts/:id/calendars/refresh', (_req, _url, { id }) => calendarService.refreshCalendars(id));
route('GET', '/api/calendars', () => calendarService.listCalendars());
route('PATCH', '/api/calendars/:id', (_req, _url, { id, body }) =>
  calendarService.setCalendarVisibility(id, body.visible)
);

route('POST', '/api/sync', () => calendarService.sync({}));

/* --- settings / identity --- */

route('GET', '/api/settings', () => calendarService.getSettings());
route('PATCH', '/api/settings', (_req, _url, { body }) => calendarService.updateSettings(body));
route('GET', '/api/identities', () => calendarService.getIdentities());

/* --- tasks --- */

route('GET', '/api/tasks', () => calendarService.listTasks());
route('POST', '/api/tasks', (_req, _url, { body }) => calendarService.addTask(body));
route('PATCH', '/api/tasks/:id', (_req, _url, { id, body }) => calendarService.toggleTask(id, body.done));

/* --- AI --- */

route('POST', '/api/ai/command', async (_req, _url, { body }) => {
  if (!body.text) throw Object.assign(new Error('text is required'), { status: 400 });
  return handleCommand(body.text);
});

route('POST', '/api/ai/intent', (_req, _url, { body }) => resolveIntent(body.text || ''));

route('POST', '/api/ai/find-slots', (_req, _url, { body }) =>
  findSlots({
    durationMinutes: body.durationMinutes || 30,
    windowStart: body.windowStart,
    windowEnd: body.windowEnd,
    timeZone: body.timeZone,
    attendeeTimeZones: body.attendeeTimeZones || [],
    preferredPartOfDay: body.preferredPartOfDay || null,
    limit: body.limit || 5
  })
);

route('GET', '/api/ai/plan', (_req, url) => dailyPlan({ anchor: url.searchParams.get('anchor') || null }));
route('GET', '/api/ai/daily-plan', (_req, url) => dailyPlan({ anchor: url.searchParams.get('anchor') || null }));
route('GET', '/api/ai/summary', (_req, url) => daySummary({ anchor: url.searchParams.get('anchor') || null }));
route('GET', '/api/ai/agent', () => agentAnalysis());
route('GET', '/api/ai/brief/:id', (_req, _url, { id }) => meetingBrief(id));
route('GET', '/api/ai/follow-up/:id', (_req, _url, { id }) => meetingFollowUp(id));

route('GET', '/api/ai/provider', () => ({ providers: AI_PROVIDERS, active: getAIProvider() }));
route('POST', '/api/ai/provider', (_req, _url, { body }) => setAIProvider(body));

/* --- sandbox --- */

route('GET', '/api/sandbox/proposals', (_req, url) => sandbox.list({ status: url.searchParams.get('status') }));
route('POST', '/api/sandbox/proposals', (_req, _url, { body }) =>
  sandbox.create({
    intent: body.intent,
    operations: body.operations || [],
    rationale: body.rationale,
    simulation: Boolean(body.simulation),
    timeZone: body.timeZone,
    requestedBy: 'user'
  })
);
route('GET', '/api/sandbox/proposals/:id', (_req, _url, { id }) => sandbox.get(id));
route('POST', '/api/sandbox/proposals/:id/preview', (_req, _url, { id }) => sandbox.get(id).preview);
route('POST', '/api/sandbox/proposals/:id/apply', async (_req, _url, { id, body }) =>
  sandbox.apply(id, { actor: 'user', opIds: body.opIds || null, dryRun: Boolean(body.dryRun) })
);
route('POST', '/api/sandbox/proposals/:id/discard', (_req, _url, { id }) => sandbox.discard(id, { actor: 'user' }));
route('PATCH', '/api/sandbox/proposals/:id', (_req, _url, { id, body }) => sandbox.modify(id, body, { actor: 'user' }));
route('POST', '/api/sandbox/proposals/apply-group', async (_req, _url, { body }) =>
  sandbox.applyGroup(body.proposalIds || [], { actor: 'user' })
);
route('POST', '/api/sandbox/simulate', (_req, _url, { body }) => sandbox.simulate(body));

/* --- permissions --- */

route('GET', '/api/permissions', () => ({
  capabilities: CAPABILITIES,
  levels: PERMISSION_LEVELS,
  grants: sandbox.grants()
}));
route('POST', '/api/permissions/grant', (_req, _url, { body }) =>
  sandbox.grant(body.level || body.capability, { level: body.level, scope: body.scope || 'all', expiresInMinutes: body.expiresInMinutes || null })
);
route('DELETE', '/api/permissions/:capability', (_req, _url, { capability }) => sandbox.revoke(capability));

/* --- privacy + activity --- */

route('GET', '/api/privacy', () => calendarService.privacyReport());
route('POST', '/api/privacy/revoke-ai', () => calendarService.revokeAllAIAccess({ actor: 'user' }));
route('GET', '/api/activity', (_req, url) => calendarService.getActivity(Number(url.searchParams.get('limit') || 60)));

/* --- zenbox bridge --- */

route('GET', '/api/zenbox/status', () => zenboxStatus());
route('GET', '/api/zenbox/requests', (_req, url) =>
  scanForSchedulingRequests({ limit: Number(url.searchParams.get('limit') || 25) })
);

/* --- browser sandbox --- */

route('GET', '/api/browser-sandbox', () => ({
  ...store.state.browserSandbox,
  targets: browserSandboxTargets,
  policy: {
    allowed: ['isolated session cookies', 'read rendered availability', 'screenshot of scheduling page'],
    denied: ['local files', 'saved passwords', 'personal browser profile', 'other applications', 'OS keychain'],
    note: 'The automation browser runs in an isolated partition. Nothing from your personal browser is shared.'
  }
}));

route('POST', '/api/browser-sandbox', (_req, _url, { body }) => {
  const next = {
    ...store.state.browserSandbox,
    enabled: Boolean(body.enabled)
  };
  store.state.browserSandbox = next;
  store.persist();
  calendarService.log('BROWSER_SANDBOX_TOGGLED', `Browser sandbox ${next.enabled ? 'enabled' : 'disabled'}.`, { actor: 'user' });
  return next;
});

route('POST', '/api/browser-sandbox/session', (_req, _url, { body }) => {
  if (!store.state.browserSandbox.enabled) {
    throw Object.assign(new Error('Enable the browser sandbox first.'), { status: 403 });
  }
  const target = browserSandboxTargets.find((t) => t.id === body.targetId);
  if (!target) throw Object.assign(new Error('Unknown sandbox target'), { status: 400 });
  const session = {
    id: `bs_${crypto.randomUUID()}`,
    targetId: target.id,
    label: target.label,
    isolated: true,
    sharesPersonalProfile: false,
    startedAt: new Date().toISOString(),
    capabilities: target.capabilities
  };
  store.state.browserSandbox.isolatedSessions = [session, ...(store.state.browserSandbox.isolatedSessions || [])].slice(0, 10);
  store.persist();
  calendarService.log('BROWSER_SESSION_STARTED', `Isolated browser session opened for ${target.label}.`, { actor: 'user' });
  return session;
});

/* --- import / export --- */

route('GET', '/api/export/ics', (_req, url) => {
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const { events } = calendarService.getTimeline({
    start: start || undefined,
    end: end || undefined,
    timeZone: url.searchParams.get('timeZone') || undefined
  });
  const chunks = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZCal//ZCal 1.0//EN',
    'CALSCALE:GREGORIAN',
    ...events.map((e) => buildICS(e, { method: null }).split('\r\n').slice(1, -1).join('\r\n'))
  ];
  return { ics: chunks.join('\r\n') + '\r\nEND:VCALENDAR\r\n', exported: events.length };
});

route('POST', '/api/import/ics', async (_req, _url, { body }) => {
  if (!body.ics) throw Object.assign(new Error('ics content is required'), { status: 400 });
  const parsed = parseICS(body.ics);
  return {
    calendarName: parsed.calendarName,
    timeZone: parsed.timeZone,
    eventCount: parsed.events.length,
    events: parsed.events.map((e) => ({
      title: e.title,
      start: e.start,
      end: e.end,
      timeZone: e.timeZone,
      attendees: e.attendees.length,
      recurrence: e.recurrence
    }))
  };
});

/* ----------------------------- dispatch ----------------------------- */

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

function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? '/index.html' : pathname;
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
    // Revalidate always: this app ships as a single page and a stale bundle is
    // far more costly than a 304 round-trip on localhost.
    const cache = 'no-cache';
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
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS' });
      return res.end();
    }

    if (!sameOrigin(req)) {
      return sendJson(res, 403, { error: 'Cross-origin state change rejected (CSRF guard).' });
    }

    const clientKey = `${req.socket.remoteAddress}|${req.method}`;
    const limit = rateLimit(clientKey, { limit: req.method === 'GET' ? 300 : 90 });
    if (!limit.ok) {
      return sendJson(res, 429, { error: 'Too many requests', retryAfter: limit.retryAfter });
    }

    if (pathname.startsWith('/api/')) {
      const match = matchRoute(req.method, pathname);
      if (!match) return sendJson(res, 404, { error: `No route for ${req.method} ${pathname}` });
      try {
        const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readBody(req) : {};
        const result = await match.handler(req, url, { ...match.params, body });
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
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(config.port, config.host, () => {
    console.log(`\n  ZCal — all your calendars, one intelligent schedule`);
    console.log(`  → http://${config.host}:${config.port}\n`);
    console.log(`  Sandbox: plan first, approve once. Real calendars stay untouched until you apply.`);
    console.log(`  Local encrypted cache: ${store.dataDir}\n`);
  });
  const shutdown = () => {
    try {
      store.flush();
    } catch {
      /* ignore */
    }
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
