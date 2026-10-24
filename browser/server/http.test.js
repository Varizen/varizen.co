// Gateway HTTP route tests. Spawns the real server on an ephemeral port with
// controlled env, then asserts on actual responses. No network, no keys needed.
// Run: node --test server/http.test.js
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');

const ENTRY = path.join(__dirname, 'index.js');

// Start the gateway with a given env, wait until it answers, return { base, stop }.
async function startGateway(env = {}) {
  const port = 19000 + Math.floor(Math.random() * 1000);
  const child = spawn(process.execPath, [ENTRY], {
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 10000;
  for (;;) {
    if (Date.now() > deadline) {
      child.kill();
      throw new Error('gateway did not start within 10s');
    }
    try {
      await fetch(`${base}/health`);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return {
    base,
    stop: () =>
      new Promise((resolve) => {
        child.once('exit', resolve);
        child.kill();
      })
  };
}

const post = (base, body, headers = {}) =>
  fetch(`${base}/api/v1/eye-ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });

// ---- No keys configured: the gateway must report itself unavailable ----

test('no keys: /health is 503 and reports zero healthy keys', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: '', OPENROUTER_API_KEY_2: '' });
  try {
    const res = await fetch(`${gw.base}/health`);
    const body = await res.json();
    assert.strictEqual(res.status, 503);
    assert.strictEqual(body.ok, false);
    assert.strictEqual(body.healthyKeys, 0);
    assert.strictEqual(body.enabled, true);
  } finally {
    await gw.stop();
  }
});

test('no keys: /health exposes no secrets', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: '', OPENROUTER_API_KEY_2: '' });
  try {
    const raw = await (await fetch(`${gw.base}/health`)).text();
    assert.ok(!/sk-or-|Bearer|OPENROUTER_API_KEY/.test(raw), 'health leaked credential material');
  } finally {
    await gw.stop();
  }
});

// ---- Keys present: healthy ----

test('one key: /health is 200 with one healthy key', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001', OPENROUTER_API_KEY_2: '' });
  try {
    const res = await fetch(`${gw.base}/health`);
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.healthyKeys, 1);
  } finally {
    await gw.stop();
  }
});

test('/status masks keys and never returns the secret', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-SECRETVALUE9999', OPENROUTER_API_KEY_2: '' });
  try {
    const res = await fetch(`${gw.base}/api/v1/eye-ai/status`);
    const raw = await res.text();
    assert.strictEqual(res.status, 200);
    assert.ok(!raw.includes('SECRETVALUE'), 'status leaked the key');
    assert.ok(raw.includes('9999'), 'masked tail missing');
    const body = JSON.parse(raw);
    assert.strictEqual(body.keys.length, 2);
    assert.strictEqual(body.keys[1].state, 'DISABLED');
  } finally {
    await gw.stop();
  }
});

// ---- Kill switch ----

test('EYE_AI_ENABLED=false: /health is 503 even with a valid key', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_AI_ENABLED: 'false'
  });
  try {
    const res = await fetch(`${gw.base}/health`);
    const body = await res.json();
    assert.strictEqual(res.status, 503);
    assert.strictEqual(body.enabled, false);
    assert.strictEqual(body.healthyKeys, 1);
  } finally {
    await gw.stop();
  }
});

test('EYE_AI_ENABLED=false: chat returns 503 with the generic message', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_AI_ENABLED: 'false'
  });
  try {
    const res = await post(gw.base, { messages: [{ role: 'user', content: 'hi' }] });
    const body = await res.json();
    assert.strictEqual(res.status, 503);
    assert.match(body.error, /temporarily unavailable/i);
  } finally {
    await gw.stop();
  }
});

// ---- Routing and validation ----

test('unknown route returns 404', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001' });
  try {
    const res = await fetch(`${gw.base}/nope`);
    assert.strictEqual(res.status, 404);
    assert.deepStrictEqual(await res.json(), { error: 'not found' });
  } finally {
    await gw.stop();
  }
});

test('GET on the chat route is not routed (404)', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001' });
  try {
    const res = await fetch(`${gw.base}/api/v1/eye-ai/chat`);
    assert.strictEqual(res.status, 404);
  } finally {
    await gw.stop();
  }
});

test('malformed JSON body returns 400', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001' });
  try {
    const res = await post(gw.base, '{not json');
    assert.strictEqual(res.status, 400);
    assert.deepStrictEqual(await res.json(), { error: 'bad json' });
  } finally {
    await gw.stop();
  }
});

test('missing messages array returns 400', async () => {
  const gw = await startGateway({ OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001' });
  try {
    const res = await post(gw.base, { task: 'chat' });
    assert.strictEqual(res.status, 400);
    assert.deepStrictEqual(await res.json(), { error: 'messages required' });
  } finally {
    await gw.stop();
  }
});

// ---- Auth ----

test('install tokens configured: missing bearer is 401', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_INSTALL_TOKENS: 'tok-abc'
  });
  try {
    const res = await post(gw.base, { messages: [{ role: 'user', content: 'hi' }] });
    assert.strictEqual(res.status, 401);
    assert.deepStrictEqual(await res.json(), { error: 'unauthorized' });
  } finally {
    await gw.stop();
  }
});

test('install tokens configured: wrong bearer is 401', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_INSTALL_TOKENS: 'tok-abc'
  });
  try {
    const res = await post(gw.base, { messages: [{ role: 'user', content: 'hi' }] }, {
      Authorization: 'Bearer tok-wrong'
    });
    assert.strictEqual(res.status, 401);
  } finally {
    await gw.stop();
  }
});

test('install tokens configured: correct bearer passes auth', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_INSTALL_TOKENS: 'tok-abc'
  });
  try {
    // Passes auth, then fails validation — proving auth was not the blocker.
    const res = await post(gw.base, {}, { Authorization: 'Bearer tok-abc' });
    assert.strictEqual(res.status, 400);
    assert.deepStrictEqual(await res.json(), { error: 'messages required' });
  } finally {
    await gw.stop();
  }
});

// ---- Rate limiting ----

test('rate limit returns 429 after the configured budget', async () => {
  const gw = await startGateway({
    OPENROUTER_API_KEY_1: 'sk-or-v1-TESTKEY0001',
    EYE_RATE_LIMIT: '2'
  });
  try {
    const first = await post(gw.base, {});
    const second = await post(gw.base, {});
    const third = await post(gw.base, {});
    assert.strictEqual(first.status, 400, 'first request should pass the limiter');
    assert.strictEqual(second.status, 400, 'second request should pass the limiter');
    assert.strictEqual(third.status, 429, 'third request should be rate limited');
    assert.match((await third.json()).error, /temporarily unavailable/i);
  } finally {
    await gw.stop();
  }
});
