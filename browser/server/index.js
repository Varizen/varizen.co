// Varizen Eye AI Gateway — the ONLY component that holds OpenRouter credentials.
// The browser talks to this over HTTPS and never learns a key, a model id, or a key identity.
const http = require('http');
const policy = require('./policy');
const { KeyPool } = require('./keypool');

const PORT = Number(process.env.PORT || 8787);
const OPENROUTER = 'https://openrouter.ai/api/v1/chat/completions';

// Secrets come from the environment only. Never from a file in the repo.
const pool = new KeyPool([process.env.OPENROUTER_API_KEY_1, process.env.OPENROUTER_API_KEY_2]);

const ENABLED = () => process.env.EYE_AI_ENABLED !== 'false';
const INSTALL_TOKENS = new Set(
  (process.env.EYE_INSTALL_TOKENS || '').split(',').map((s) => s.trim()).filter(Boolean)
);

// ---- Abuse protection (privacy-conscious: no PII, in-memory only) ----
const buckets = new Map(); // token -> { count, reset }
const LIMIT = Number(process.env.EYE_RATE_LIMIT || 30); // requests per window
const WINDOW_MS = 60 * 1000;

function rateLimited(token) {
  const now = Date.now();
  let b = buckets.get(token);
  if (!b || b.reset <= now) { b = { count: 0, reset: now + WINDOW_MS }; buckets.set(token, b); }
  b.count++;
  return b.count > LIMIT;
}

// Prevent unbounded growth of the rate-limit map (one entry per install token).
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
}, WINDOW_MS).unref();

const UNAVAILABLE = 'Eye AI is temporarily unavailable. Please try again later.';

function json(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(data);
}

function authorized(req) {
  if (!INSTALL_TOKENS.size) return true; // dev mode: no tokens configured
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return INSTALL_TOKENS.has(token);
}

// Try each verified-free model in order, across healthy keys. Never a paid model.
async function complete(messages, task, stream) {
  const models = await policy.candidates(task);
  if (!models.length) throw new Error('no free models');

  let lastErr = null;
  for (const model of models.slice(0, 3)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const key = pool.pick();
      if (!key) throw new Error('no healthy key');

      key.inflight++;
      key.stats.requests++;
      try {
        const res = await fetch(OPENROUTER, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key.secret}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://varizen.co',
            'X-Title': 'Eye AI Gateway'
          },
          body: JSON.stringify({ model, messages, stream: !!stream })
        });

        if (res.status === 429) {
          pool.markRateLimited(key, res.headers.get('retry-after'));
          lastErr = new Error('rate limited');
          continue;
        }
        if (!res.ok) {
          pool.markError(key);
          lastErr = new Error(`upstream ${res.status}`);
          continue;
        }
        pool.markSuccess(key);
        return { res, model };
      } catch (e) {
        pool.markError(key);
        lastErr = e;
      } finally {
        key.inflight--;
      }
    }
  }
  throw lastErr || new Error('all models failed');
}

async function handleChat(req, res, body, stream) {
  if (!ENABLED()) return json(res, 503, { error: UNAVAILABLE });
  if (!authorized(req)) return json(res, 401, { error: 'unauthorized' });

  const token = (req.headers.authorization || '').slice(7) || 'anon';
  if (rateLimited(token)) return json(res, 429, { error: UNAVAILABLE });

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages) return json(res, 400, { error: 'messages required' });

  const task = ['chat', 'coding', 'vision', 'research', 'shopping', 'agent'].includes(body.task)
    ? body.task : 'chat';

  try {
    const { res: up, model } = await complete(messages, task, stream);

    if (!stream) {
      const data = await up.json();
      const text = data.choices?.[0]?.message?.content ?? '';
      return json(res, 200, { text, model: model.split('/')[0] }); // provider only, not full id
    }

    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' });
    up.body.on('data', (chunk) => res.write(chunk));
    up.body.on('end', () => res.end());
    up.body.on('error', () => res.end());
  } catch {
    // Generic message only — never leak key identity, provider, or internal detail.
    json(res, 503, { error: UNAVAILABLE });
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/api/v1/eye-ai/status') {
    return json(res, 200, {
      enabled: ENABLED(),
      freeModels: policy.freeCount(),
      keys: pool.status() // masked identifiers only
    });
  }

  // Liveness/readiness for uptime monitors and load balancers. No secrets.
  if (req.method === 'GET' && url.pathname === '/health') {
    const healthy = pool.healthy().length;
    const ok = ENABLED() && healthy > 0;
    return json(res, ok ? 200 : 503, {
      ok,
      enabled: ENABLED(),
      healthyKeys: healthy,
      freeModels: policy.freeCount(),
      catalogAgeMs: policy.cacheAge(),
      uptimeSec: Math.round(process.uptime())
    });
  }

  if (req.method === 'POST' && url.pathname.startsWith('/api/v1/eye-ai/')) {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      let body = {};
      try { body = JSON.parse(raw || '{}'); } catch { return json(res, 400, { error: 'bad json' }); }
      const stream = url.pathname.endsWith('/stream');
      handleChat(req, res, body, stream);
    });
    return;
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`Eye AI Gateway on :${PORT} — keys: ${pool.status().map((k) => `${k.id}=${k.state}`).join(' ')}`);
  if (!process.env.OPENROUTER_API_KEY_1 && !process.env.OPENROUTER_API_KEY_2) {
    console.warn('[warn] no OpenRouter keys set — Eye AI will report unavailable');
  }
  if (!INSTALL_TOKENS.size) {
    console.warn('[warn] EYE_INSTALL_TOKENS is empty — gateway accepts unauthenticated requests (dev only)');
  }
});

// Graceful shutdown so in-flight requests finish and the port is released.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    console.log(`[${sig}] draining…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  });
}

module.exports = server;
