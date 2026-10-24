// Free-model policy. The authoritative allowlist lives here, server-side only.
// The browser never names a model — it sends a task type and the gateway decides.
const CATALOG = 'https://openrouter.ai/api/v1/models';
const CACHE_MS = 10 * 60 * 1000;

let cache = { at: 0, models: [] };

// Strict: a model is free only when pricing is explicitly "0". Missing pricing is NOT free.
const isZero = (v) => v !== undefined && v !== null && v !== '' && Number(v) === 0;

function isFree(m) {
  const p = m.pricing || {};
  return isZero(p.prompt) && isZero(p.completion);
}

async function catalog() {
  if (Date.now() - cache.at < CACHE_MS && cache.models.length) return cache.models;
  try {
    const res = await fetch(CATALOG, {
      headers: { 'HTTP-Referer': 'https://varizen.co', 'X-Title': 'Eye AI Gateway' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const json = await res.json();
    const free = (json.data || []).filter(isFree);
    if (!free.length) throw new Error('no free models');
    cache = { at: Date.now(), models: free };
    return free;
  } catch (e) {
    // Stale-while-error: a catalog outage must not take Eye AI down.
    // The cached list was verified free when fetched, so it is still safe to use.
    if (cache.models.length) {
      console.warn(`[policy] catalog refresh failed (${e.message}); serving ${cache.models.length} cached models`);
      return cache.models;
    }
    throw e;
  }
}

// Optional administrator override: EYE_FREE_MODEL_ALLOWLIST="a/b:free,c/d:free"
function allowlist() {
  const raw = (process.env.EYE_FREE_MODEL_ALLOWLIST || '').trim();
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : null;
}

const HINTS = {
  coding: ['coder', 'code', 'devstral', 'qwen3-coder', 'codestral'],
  vision: ['vl', 'vision', 'multimodal', 'llava', 'pixtral'],
  research: ['reason', 'r1', 'thinking', 'deepseek', 'qwq'],
  shopping: ['vl', 'vision', 'instruct'],
  agent: ['instruct', 'tool', 'qwen', 'llama', 'mistral'],
  chat: []
};

function score(m, task) {
  const id = (m.id || '').toLowerCase();
  let s = 0;
  for (const h of HINTS[task] || []) if (id.includes(h)) s += 10;
  if (id.endsWith(':free')) s += 1;
  s += Math.min(5, Math.round((m.context_length || 0) / 32000));
  return s;
}

// Returns an ordered fallback chain of verified-free model ids. Never includes a paid model.
async function candidates(task = 'chat') {
  const free = await catalog();
  const allowed = allowlist();
  const pool = allowed ? free.filter((m) => allowed.includes(m.id)) : free;
  return pool
    .slice()
    .sort((a, b) => score(b, task) - score(a, task))
    .map((m) => m.id);
}

function freeCount() { return cache.models.length; }
function cacheAge() { return cache.at ? Date.now() - cache.at : null; }

module.exports = { candidates, freeCount, cacheAge, isFree };
