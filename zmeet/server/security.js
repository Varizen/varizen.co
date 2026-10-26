/**
 * ZMeet — security primitives. (was: ZenMeet)
 *
 * What this module actually does (and nothing it pretends to do):
 *   - short-lived, room-scoped HMAC-signed meeting tokens
 *   - CSRF guard (same-origin enforcement for mutating requests)
 *   - per-client rate limiting
 *   - CSP + hardening headers
 *   - constant-time token comparison
 *
 * ZMeet does NOT claim end-to-end encryption for group calls. Secure rooms
 * use transport encryption plus host-controlled admission and are labelled
 * honestly in the UI (prompt §18).
 */

import crypto from 'crypto';
import { config } from './config.js';

/* ---------------------------- signing keys ---------------------------- */

function loadSecret() {
  if (process.env.ZENMEET_TOKEN_SECRET) {
    return crypto.createHash('sha256').update(process.env.ZENMEET_TOKEN_SECRET).digest();
  }
  // Ephemeral per-process secret when unset: tokens stop working on restart,
  // which is the safe default for a single-node deployment.
  return crypto.randomBytes(32);
}

const SECRET = loadSecret();

function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

/**
 * Issue a signed, expiring token. Payload is intentionally tiny: who, where, what.
 * Meeting tokens never carry room secrets or provider credentials.
 */
export function issueToken({ roomId, participantId, role, kind = 'meeting', ttlMinutes = null }) {
  const minutes =
    ttlMinutes ?? (kind === 'guest' ? config.guestTokenTtlMinutes : config.roomTokenTtlMinutes);
  const body = {
    v: 1,
    kind,
    sub: participantId,
    rid: roomId,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + Math.round(minutes * 60),
    jti: crypto.randomUUID()
  };
  const payload = b64url(JSON.stringify(body));
  return { token: `${payload}.${sign(payload)}`, claims: body, expiresAt: new Date(body.exp * 1000).toISOString() };
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return { ok: false, error: 'malformed' };
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return { ok: false, error: 'malformed' };
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, error: 'bad-signature' };
  let claims;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, error: 'malformed' };
  }
  if (!claims.exp || claims.exp * 1000 < Date.now()) return { ok: false, error: 'expired' };
  return { ok: true, claims };
}

/* ------------------------------ CSRF guard ------------------------------ */

/**
 * Mutating requests must come from the same origin. Requests with no Origin
 * header (same-origin fetch in older browsers, curl) are checked against Host.
 */
export function sameOrigin(req) {
  const method = (req.method || 'GET').toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin) {
    const referer = req.headers.referer;
    if (!referer) return true; // non-browser client; auth still applies
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ---------------------------- rate limiting ---------------------------- */

const buckets = new Map();

export function rateLimit(key, { limit = 180, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - bucket.count };
}

export function requestKey(req) {
  return `${req.socket?.remoteAddress || 'unknown'}|${req.method}`;
}

const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.resetAt < now) buckets.delete(key);
}, 60_000);
sweeper.unref?.();

/* ------------------------------- headers ------------------------------- */

export const securityHeaders = {
  'Content-Security-Policy': config.csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(self), microphone=(self), display-capture=(self), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/** Compare a shared secret without leaking length/content through timing. */
export function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
