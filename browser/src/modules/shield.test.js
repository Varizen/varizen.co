// Eye Shield tests. Uses a fake Electron session object so no Electron runtime is needed.
// Run: node --test src/modules/shield.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const shield = require('./shield');

// Minimal stand-in for Electron's session.webRequest / permission handlers.
function fakeSession() {
  const handlers = {};
  return {
    handlers,
    webRequest: {
      onBeforeRequest: (fn) => { handlers.beforeRequest = fn; }
    },
    setPermissionRequestHandler: (fn) => { handlers.permissionRequest = fn; },
    setPermissionCheckHandler: (fn) => { handlers.permissionCheck = fn; }
  };
}

// Drive the registered onBeforeRequest handler and capture its callback argument.
function request(ses, details) {
  let result;
  ses.handlers.beforeRequest(details, (r) => { result = r; });
  return result;
}

function install(overrides = {}) {
  const ses = fakeSession();
  const blocked = [];
  shield.install(ses, {
    allow: () => [],
    httpsFirst: () => true,
    onBlock: (h) => blocked.push(h),
    ...overrides
  });
  return { ses, blocked };
}

// ---- Tracker blocking ----

test('blocks a known tracker subresource', () => {
  const { ses, blocked } = install();
  const r = request(ses, {
    url: 'https://www.google-analytics.com/collect',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, { cancel: true });
  assert.deepStrictEqual(blocked, ['www.google-analytics.com']);
});

test('blocks a tracker on a subdomain of a listed domain', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'https://stats.g.doubleclick.net/x',
    resourceType: 'image'
  });
  assert.deepStrictEqual(r, { cancel: true });
});

test('does not block a non-tracker subresource', () => {
  const { ses, blocked } = install();
  const r = request(ses, {
    url: 'https://cdn.example.com/app.js',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, {});
  assert.deepStrictEqual(blocked, []);
});

test('does not block a lookalike domain that merely contains a tracker name', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'https://notdoubleclick.net.evil.com/x',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, {});
});

test('never blocks a mainFrame navigation to a tracker host', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'https://www.google-analytics.com/',
    resourceType: 'mainFrame'
  });
  assert.deepStrictEqual(r, {});
});

// ---- Per-site exemptions ----

test('exempt host is allowed through', () => {
  const { ses, blocked } = install({ allow: () => ['google-analytics.com'] });
  const r = request(ses, {
    url: 'https://www.google-analytics.com/collect',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, {});
  assert.deepStrictEqual(blocked, []);
});

test('exemption covers subdomains of the exempt host', () => {
  const { ses } = install({ allow: () => ['google-analytics.com'] });
  const r = request(ses, {
    url: 'https://www.google-analytics.com/collect',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, {});
});

test('exemption for one host does not exempt another tracker', () => {
  const { ses } = install({ allow: () => ['google-analytics.com'] });
  const r = request(ses, {
    url: 'https://connect.facebook.net/en_US/sdk.js',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, { cancel: true });
});

// ---- HTTPS-first ----

test('upgrades a plain http mainFrame navigation to https', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'http://example.com/page',
    resourceType: 'mainFrame'
  });
  assert.strictEqual(r.redirectURL, 'https://example.com/page');
});

test('does not upgrade when httpsFirst is off', () => {
  const { ses } = install({ httpsFirst: () => false });
  const r = request(ses, {
    url: 'http://example.com/page',
    resourceType: 'mainFrame'
  });
  assert.deepStrictEqual(r, {});
});

test('does not upgrade a subresource over http', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'http://cdn.example.com/app.js',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, {});
});

test('leaves an https navigation untouched', () => {
  const { ses } = install();
  const r = request(ses, {
    url: 'https://example.com/page',
    resourceType: 'mainFrame'
  });
  assert.deepStrictEqual(r, {});
});

// ---- Malformed input ----

test('a malformed URL does not throw and is allowed', () => {
  const { ses } = install();
  const r = request(ses, { url: 'not a url', resourceType: 'script' });
  assert.deepStrictEqual(r, {});
});

// ---- Permissions ----

test('allows only the whitelisted permissions', () => {
  const { ses } = install();
  const results = {};
  for (const p of ['fullscreen', 'clipboard-sanitized-write', 'pointerLock', 'geolocation', 'media', 'notifications']) {
    ses.handlers.permissionRequest(null, p, (v) => { results[p] = v; });
  }
  assert.strictEqual(results.fullscreen, true);
  assert.strictEqual(results['clipboard-sanitized-write'], true);
  assert.strictEqual(results.pointerLock, true);
  assert.strictEqual(results.geolocation, false);
  assert.strictEqual(results.media, false);
  assert.strictEqual(results.notifications, false);
});

test('permission check handler agrees with the request handler', () => {
  const { ses } = install();
  assert.strictEqual(ses.handlers.permissionCheck(null, 'fullscreen'), true);
  assert.strictEqual(ses.handlers.permissionCheck(null, 'geolocation'), false);
});

// ---- Adware, Malware & Permanent Shield Protection ----

test('blocks aggressive adware and popunder domains', () => {
  const { ses, blocked } = install();
  const r = request(ses, {
    url: 'https://cdn.popads.net/serve.js',
    resourceType: 'script'
  });
  assert.deepStrictEqual(r, { cancel: true });
  assert.ok(blocked.length > 0);
});

test('blocks known malware and phishing domain even on mainFrame navigation', () => {
  const { ses, blocked } = install();
  const r = request(ses, {
    url: 'http://auth-verify-portal.top/login',
    resourceType: 'mainFrame'
  });
  assert.deepStrictEqual(r, { cancel: true });
  assert.ok(blocked.includes('auth-verify-portal.top'));
});
