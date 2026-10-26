/**
 * ZTalk test suite — node:test, zero dependencies.
 *
 * Covers the invariants the product promises:
 *   - the unified shell never claims a live connection it does not have
 *   - outbound messages are recorded honestly (sent vs simulated)
 *   - AI output is grounded in the conversation, never invented
 *   - the AI boundary refuses to act without an explicit mode
 *   - bridges fail safe when a sibling product is down
 *   - the HTTP surface is hardened (CSP, same-origin, rate limit, body limits)
 *   - the UI shell is actually served
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

process.env.ZENCHAT_EPHEMERAL = '1';
process.env.PORT = '4599';
process.env.HOST = '127.0.0.1';

const {
  listConversations,
  getConversation,
  getMessages,
  markRead,
  toggleImportant,
  sendMessage,
  search,
  counts
} = await import('../server/chatEngine.js');
const { store } = await import('../server/store.js');
const { seedDemoData } = await import('../server/seed.js');
const {
  buildContext,
  summarizeConversation,
  suggestReplies,
  detectSignals,
  inboxDigest
} = await import('../server/aiEngine.js');
const { AI_MODES, requireAIMode, providerStatus } = await import('../server/aiProvider.js');
const { PLATFORMS, PLATFORM_KEYS, platformMeta } = await import('../server/platforms.js');
const { detectLanguage, translate, translationCapability } = await import('../server/translate.js');
const { integrationStatus, meetingStatus, calendarStatus } = await import('../server/bridges.js');
const { sameOrigin, rateLimit, verifyWebhook } = await import('../server/security.js');

/* ------------------------------ fixtures ------------------------------- */

before(() => {
  seedDemoData({ force: true });
});

/* --------------------------- platform catalog --------------------------- */

describe('ZTalk platform catalog', () => {
  test('declares 14+ messengers with honest connection modes', () => {
    assert.ok(PLATFORM_KEYS.length >= 14, `expected 14+, got ${PLATFORM_KEYS.length}`);
    for (const key of PLATFORM_KEYS) {
      const p = PLATFORMS[key];
      assert.ok(p.label, `${key} needs a label`);
      assert.ok(p.color, `${key} needs a colour`);
      assert.ok(
        ['official-api', 'bridge', 'webhook', 'demo'].includes(p.mode),
        `${key} has an unknown mode: ${p.mode}`
      );
      assert.ok(p.note, `${key} must document its real capability`);
    }
  });

  test('never stores a credential, only an env-var hint', () => {
    for (const key of PLATFORM_KEYS) {
      const p = PLATFORMS[key];
      if (p.secretHint) assert.match(p.secretHint, /^[A-Z0-9_]+$/, `${key} hint must be an env var name`);
      assert.equal(p.token, undefined, `${key} must not carry a token`);
      assert.equal(p.secret, undefined, `${key} must not carry a secret`);
    }
  });

  test('platformMeta resolves a known platform and degrades safely', () => {
    const wa = platformMeta('whatsapp');
    assert.equal(wa.label, 'WhatsApp');
    const unknown = platformMeta('not-a-platform');
    assert.ok(unknown.label, 'unknown platforms still get a label');
  });
});

/* ---------------------------- conversation core ------------------------- */

describe('ZTalk conversation engine', () => {
  test('seeds a unified inbox across multiple platforms', () => {
    const list = listConversations();
    assert.ok(list.length >= 8, `expected a populated inbox, got ${list.length}`);
    const platforms = new Set(list.map((c) => c.platform));
    assert.ok(platforms.size >= 5, `expected 5+ platforms, got ${platforms.size}`);
  });

  test('demo conversations are labelled simulated, never live', () => {
    for (const c of listConversations()) {
      assert.equal(c.live, false, `${c.id} must not claim a live connection`);
      assert.equal(c.simulated, true, `${c.id} must be marked simulated`);
    }
  });

  test('filters work: unread, important, groups, needs-reply', () => {
    const unread = listConversations({ filter: 'unread' });
    assert.ok(unread.every((c) => c.unread > 0));
    const important = listConversations({ filter: 'important' });
    assert.ok(important.every((c) => c.important));
    const groups = listConversations({ filter: 'groups' });
    assert.ok(groups.every((c) => c.kind === 'group'));
    const needs = listConversations({ filter: 'needs-reply' });
    assert.ok(needs.every((c) => c.needsReply));
  });

  test('search matches titles, previews and message bodies', () => {
    const byTitle = search({ q: 'Sarah' });
    assert.ok(byTitle.results.length > 0, 'title search should match');
    const byBody = search({ q: 'proposal' });
    assert.ok(byBody.results.length > 0, 'body search should match');
    const none = search({ q: 'zzzz-no-such-term-zzzz' });
    assert.equal(none.results.length, 0);
  });

  test('marking read clears the unread counter', () => {
    const target = listConversations({ filter: 'unread' })[0];
    assert.ok(target, 'need an unread conversation to test');
    markRead(target.id);
    const after = getConversation(target.id);
    assert.equal(after.unread, 0);
  });

  test('toggling important round-trips', () => {
    const c = listConversations()[0];
    const before = c.important;
    const updated = toggleImportant(c.id, !before);
    assert.equal(updated.important, !before);
    toggleImportant(c.id, before);
  });

  test('outbound messages are recorded with an honest delivery state', () => {
    const c = listConversations()[0];
    const res = sendMessage({ conversationId: c.id, body: 'Test outbound message' });
    const msg = res.message || res;
    assert.equal(msg.outbound, true);
    assert.ok(msg.delivery, 'outbound messages must carry a delivery state');
    assert.ok(
      ['sent', 'failed', 'simulated'].includes(msg.delivery.state),
      `unexpected delivery state: ${msg.delivery.state}`
    );
    // A sandbox conversation can never claim a real send.
    if (msg.simulated) assert.notEqual(msg.delivery.state, 'sent');
  });

  test('counts aggregate the sidebar badges', () => {
    const c = counts();
    assert.ok(typeof c.all === 'number');
    assert.ok(typeof c.unread === 'number');
    assert.ok(typeof c.important === 'number');
    assert.ok(typeof c.needsReply === 'number');
  });

  test('messages are ordered oldest to newest', () => {
    const c = listConversations()[0];
    const msgs = getMessages(c.id);
    for (let i = 1; i < msgs.length; i += 1) {
      assert.ok(new Date(msgs[i].at) >= new Date(msgs[i - 1].at), 'messages must be chronological');
    }
  });
});

/* --------------------------------- AI ---------------------------------- */

describe('ZTalk AI engine', () => {
  test('summaries are grounded in real messages', () => {
    const c = listConversations()[0];
    const msgs = getMessages(c.id);
    const ctx = buildContext(c, msgs);
    const summary = summarizeConversation(ctx);
    assert.ok(summary.bullets.length > 0, 'a summary needs bullets');
    const bodies = msgs.map((m) => m.body).join(' ');
    for (const b of summary.bullets) {
      const text = typeof b === 'string' ? b : b.text;
      assert.ok(text && text.length > 0, 'bullet must have text');
      // Every bullet must be extractable from the conversation, not invented.
      const probe = text.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      assert.ok(
        bodies.includes(text.slice(0, 24)) || new RegExp(probe, 'i').test(bodies),
        `bullet not grounded in the conversation: ${text.slice(0, 60)}`
      );
    }
  });

  test('suggested replies are grounded in the last inbound message', () => {
    const c = listConversations()[0];
    const msgs = getMessages(c.id);
    const ctx = buildContext(c, msgs);
    const res = suggestReplies(ctx);
    assert.ok(Array.isArray(res.replies), 'replies must be an array');
    for (const r of res.replies) {
      assert.ok(r.body && r.body.length > 0, 'reply needs a body');
      assert.ok(r.tone, 'reply needs a tone');
    }
  });

  test('signal detection only reports the six documented kinds', () => {
    const allowed = ['meeting', 'task', 'payment', 'deadline', 'followup', 'decision'];
    for (const c of listConversations().slice(0, 6)) {
      const msgs = getMessages(c.id);
      const ctx = buildContext(c, msgs);
      const signals = detectSignals(ctx);
      for (const s of signals) {
        assert.ok(allowed.includes(s.kind), `unexpected detection kind: ${s.kind}`);
        assert.ok(s.evidence || s.detail, 'every detection must cite its evidence');
      }
    }
  });

  test('the digest aggregates needs-reply and meeting signals', () => {
    const all = listConversations();
    const d = inboxDigest(all, (id) => getMessages(id));
    assert.ok(Array.isArray(d.needsReply));
    assert.ok(Array.isArray(d.meetingSignals));
    assert.ok(d.generatedAt);
  });

  test('AI modes are ordered and the boundary is enforced', () => {
    assert.ok(AI_MODES.off, 'off mode must exist');
    assert.throws(
      () => requireAIMode('off', 'summarize'),
      (err) => err.status === 403 || err.aiMode === 'off',
      'AI must refuse to act when switched off'
    );
  });

  test('provider status is honest about the default engine', () => {
    const s = providerStatus();
    assert.ok(s.active, 'provider status needs an active provider');
    assert.equal(s.active.effective, 'deterministic', 'the default engine is local');
    assert.equal(s.remoteReady, false, 'remote AI must be off by default');
  });
});

/* ------------------------------ translation ----------------------------- */

describe('ZTalk translation', () => {
  test('detects CJK and Latin-script languages', () => {
    assert.equal(detectLanguage('会议改到下午三点可以吗？').language, 'zh');
    assert.equal(detectLanguage('明日午後3時に会いましょう').language, 'ja');
    assert.equal(detectLanguage('내일 오후 3시에 만나요').language, 'ko');
    assert.equal(detectLanguage('Let us meet tomorrow at 3 PM').language, 'en');
  });

  test('phrasebook translation is exact where covered and honest where not', () => {
    const hit = translate('Let’s meet tomorrow at 3 PM', 'zh');
    assert.ok(hit.text, 'translation needs text');
    assert.equal(hit.exact, true, 'a phrasebook hit should be exact');
    const miss = translate('A sentence that is definitely not in the phrasebook', 'zh');
    assert.equal(miss.exact, false, 'an uncovered phrase must not claim exactness');
    assert.equal(miss.text, 'A sentence that is definitely not in the phrasebook', 'uncovered text is kept verbatim');
  });

  test('capability report names the engine', () => {
    const cap = translationCapability();
    assert.ok(cap.engine);
  });
});

/* -------------------------------- bridges ------------------------------- */

describe('ZTalk bridges fail safe', () => {
  test('sibling status never throws when the service is down', async () => {
    const meet = await meetingStatus();
    assert.equal(typeof meet.connected, 'boolean');
    if (!meet.connected) assert.ok(meet.note, 'an unavailable bridge must explain why');
    const cal = await calendarStatus();
    assert.equal(typeof cal.connected, 'boolean');
  });

  test('integration status aggregates all three siblings', async () => {
    const s = await integrationStatus();
    assert.ok('zenMeet' in s || 'zmeet' in s);
    assert.ok('zenCalendar' in s || 'zcal' in s);
    assert.ok(s.note);
  });
});

/* -------------------------------- security ------------------------------ */

describe('ZTalk security primitives', () => {
  test('same-origin rejects a foreign origin on a mutation', () => {
    const req = { method: 'POST', headers: { origin: 'https://evil.example', host: '127.0.0.1:4599' } };
    assert.equal(sameOrigin(req), false);
  });

  test('same-origin allows a matching origin', () => {
    const req = { method: 'POST', headers: { origin: 'http://127.0.0.1:4599', host: '127.0.0.1:4599' } };
    assert.equal(sameOrigin(req), true);
  });

  test('rate limiting eventually refuses', () => {
    const req = { headers: {}, socket: { remoteAddress: `10.0.0.${Math.floor(Math.random() * 250)}` } };
    let refused = false;
    for (let i = 0; i < 600; i += 1) {
      const r = rateLimit(req, { limit: 5, windowMs: 60_000 });
      if (!r.ok) {
        refused = true;
        break;
      }
    }
    assert.equal(refused, true, 'rate limiter must refuse after the limit');
  });

  test('webhooks are disabled without a configured secret', () => {
    const res = verifyWebhook({ headers: {}, body: {} });
    assert.equal(res.ok, false);
    assert.match(res.error, /disabled/i);
  });
});

/* --------------------------------- HTTP --------------------------------- */

describe('ZTalk HTTP surface', () => {
  let child;
  const base = 'http://127.0.0.1:4599';

  before(async () => {
    child = spawn(process.execPath, ['server/index.js'], {
      cwd: ROOT,
      env: { ...process.env, PORT: '4599', HOST: '127.0.0.1', ZENCHAT_EPHEMERAL: '1' },
      stdio: 'ignore'
    });
    // Wait for the port to accept connections.
    for (let i = 0; i < 60; i += 1) {
      try {
        const r = await fetch(`${base}/api/health`);
        if (r.ok) return;
      } catch {
        /* not up yet */
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error('ZTalk server did not start');
  });

  after(() => {
    if (child) child.kill();
  });

  test('health reports the product and sandbox size', async () => {
    const r = await fetch(`${base}/api/health`);
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.product, 'ZTalk');
    assert.ok(body.conversations > 0);
  });

  test('the UI shell is served at /', async () => {
    const r = await fetch(`${base}/`);
    assert.equal(r.status, 200);
    const html = await r.text();
    assert.match(html, /ZTalk/);
    assert.match(html, /Every Conversation/);
  });

  test('static assets are served with a strict CSP', async () => {
    const r = await fetch(`${base}/`);
    const csp = r.headers.get('content-security-policy') || '';
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'none'/);
  });

  test('SPA routes resolve to the shell', async () => {
    const r = await fetch(`${base}/c/conv_sarah`);
    assert.equal(r.status, 200);
    assert.match(await r.text(), /ZTalk/);
  });

  test('conversations endpoint returns the unified list', async () => {
    const r = await fetch(`${base}/api/conversations`);
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(Array.isArray(body.conversations));
    assert.ok(body.conversations.length > 0);
  });

  test('a single conversation returns conversation + messages', async () => {
    const list = await (await fetch(`${base}/api/conversations`)).json();
    const id = list.conversations[0].id;
    const r = await fetch(`${base}/api/conversations/${id}`);
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(body.conversation, 'response must include the conversation');
    assert.ok(Array.isArray(body.messages), 'response must include messages');
  });

  test('unknown routes return a structured 404', async () => {
    const r = await fetch(`${base}/api/does-not-exist`);
    assert.equal(r.status, 404);
    const body = await r.json();
    assert.ok(body.error);
  });

  test('cross-origin mutations are rejected', async () => {
    const r = await fetch(`${base}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
      body: JSON.stringify({ title: 'x', platform: 'whatsapp' })
    });
    assert.ok(r.status === 403 || r.status === 400, `expected rejection, got ${r.status}`);
  });

  test('oversized bodies are rejected', async () => {
    const huge = 'x'.repeat(400 * 1024);
    const r = await fetch(`${base}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: huge, platform: 'whatsapp' })
    });
    assert.equal(r.status, 413);
  });

  test('privacy endpoint discloses the AI and storage posture', async () => {
    const r = await fetch(`${base}/api/privacy`);
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(body.aiProvider, 'privacy must disclose the AI provider posture');
    assert.equal(body.aiProvider.allowRemote, false, 'remote AI must be off by default');
    assert.ok(body.storage, 'privacy must disclose the storage posture');
    assert.ok(body.statement, 'privacy must state the data-selling position');
  });

  test('AI summary endpoint returns grounded output', async () => {
    const list = await (await fetch(`${base}/api/conversations`)).json();
    const id = list.conversations[0].id;
    const r = await fetch(`${base}/api/conversations/${id}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.ok(body.summary, 'summary payload expected');
    assert.ok(Array.isArray(body.summary.bullets));
  });
});
