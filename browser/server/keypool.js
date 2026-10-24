// Server-side OpenRouter credential pool. Secrets never leave this process.
const STATES = {
  ACTIVE: 'ACTIVE',
  DEGRADED: 'DEGRADED',
  RATE_LIMITED: 'RATE_LIMITED',
  FAILED: 'FAILED',
  DISABLED: 'DISABLED'
};

const COOLDOWN_MS = 60 * 1000;
const FAIL_THRESHOLD = 3;

class KeyPool {
  constructor(secrets) {
    this.keys = secrets.map((secret, i) => ({
      id: i === 0 ? 'KEY-A' : 'KEY-B',
      secret: secret || '',
      state: secret ? STATES.ACTIVE : STATES.DISABLED,
      cooldownUntil: 0,
      failures: 0,
      inflight: 0,
      stats: { requests: 0, success: 0, rateLimits: 0, errors: 0 }
    }));
  }

  healthy() {
    const now = Date.now();
    return this.keys.filter(
      (k) => k.state !== STATES.DISABLED && k.state !== STATES.FAILED && k.cooldownUntil <= now
    );
  }

  // Prefer the least-loaded healthy key, then the least-used one.
  pick() {
    const h = this.healthy();
    if (!h.length) return null;
    h.sort((a, b) => a.inflight - b.inflight || a.stats.requests - b.stats.requests);
    return h[0];
  }

  markSuccess(k) {
    k.failures = 0;
    k.state = STATES.ACTIVE;
    k.cooldownUntil = 0;
    k.stats.success++;
  }

  markRateLimited(k, retryAfter) {
    const secs = Number(retryAfter);
    k.state = STATES.RATE_LIMITED;
    k.cooldownUntil = Date.now() + (Number.isFinite(secs) && secs > 0 ? secs * 1000 : COOLDOWN_MS);
    k.stats.rateLimits++;
  }

  markError(k) {
    k.failures++;
    k.stats.errors++;
    if (k.failures >= FAIL_THRESHOLD) {
      k.state = STATES.FAILED;
      k.cooldownUntil = Date.now() + COOLDOWN_MS * 5;
    } else {
      k.state = STATES.DEGRADED;
      k.cooldownUntil = Date.now() + COOLDOWN_MS;
    }
  }

  // Safe view: masked identifiers only, never the secret.
  status() {
    return this.keys.map((k) => ({
      id: k.id,
      state: k.state,
      masked: k.secret ? '••••••••••••' + k.secret.slice(-4) : '(not set)',
      cooldownMs: Math.max(0, k.cooldownUntil - Date.now()),
      stats: { ...k.stats }
    }));
  }

  disable(id) {
    const k = this.keys.find((x) => x.id === id);
    if (k) { k.state = STATES.DISABLED; k.secret = ''; }
  }
}

module.exports = { KeyPool, STATES };
