/**
 * ZTalk — transport security helpers (was: ZenChat).
 *
 * Deliberately conservative:
 *   - a strict CSP is applied to HTML (see config.csp)
 *   - same-origin is enforced for state-changing requests (CSRF defence)
 *   - a simple in-process token bucket rate limits every IP
 *   - inbound platform webhooks must present a shared secret when configured
 *
 * No dependency on a reverse proxy being configured correctly; these are
 * enforced in-process so a bare `node server/index.js` is already safe.
 */

import crypto from 'crypto';
import { config } from './config.js';

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

export function requestKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim();
  return ip || req.socket?.remoteAddress || 'unknown';
}

/** Same-origin check for mutations. Loopback is trusted (local-first app). */
export function sameOrigin(req) {
  const method = (req.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

  const origin = req.headers.origin;
  const host = req.headers.host || '';
  if (!origin) {
    // No Origin header: a same-origin form post or a non-browser client.
    // Verify Sec-Fetch-Site when the browser provides it.
    const site = req.headers['sec-fetch-site'];
    return !site || site === 'same-origin' || site === 'none';
  }
  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    // Allow the configured public URL (reverse-proxied deployments).
    const publicHost = new URL(config.publicUrl).host;
    if (originHost === publicHost) return true;
    return false;
  } catch {
    return false;
  }
}

const buckets = new Map();

/** Token bucket per IP. Returns false when the caller is over budget. */
export function rateLimit(req, { key = null, limit = config.limits.ratePerMinute, windowMs = 60_000 } = {}) {
  const bucketKey = key || requestKey(req);
  const now = Date.now();
  let bucket = buckets.get(bucketKey);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
    buckets.set(bucketKey, bucket);
  }
  bucket.count += 1;
  if (buckets.size > 4000) {
    for (const [k, v] of buckets) {
      if (now - v.start > windowMs * 2) buckets.delete(k);
    }
  }
  return bucket.count <= limit;
}

/** Constant-time secret comparison for webhook verification. */
export function safeEqual(a = '', b = '') {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Verifies an inbound webhook. When ZENCHAT_WEBHOOK_SECRET is unset the endpoint
 * refuses to serve at all rather than accepting anonymous writes.
 */
export function verifyWebhook(req) {
  const secret = process.env.ZENCHAT_WEBHOOK_SECRET || '';
  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: 'Inbound webhooks are disabled. Set ZENCHAT_WEBHOOK_SECRET on the server to enable them.'
    };
  }
  const presented =
    req.headers['x-zenchat-signature'] ||
    req.headers['x-webhook-secret'] ||
    (String(req.headers.authorization || '').startsWith('Bearer ')
      ? String(req.headers.authorization).slice(7)
      : '');
  if (!safeEqual(presented, secret)) {
    return { ok: false, status: 401, error: 'Invalid webhook signature.' };
  }
  return { ok: true };
}

/** A short-lived, signed state token for OAuth flows (PKCE support). */
export function createOAuthState() {
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return {
    state: crypto.randomBytes(24).toString('base64url'),
    verifier,
    challenge,
    createdAt: new Date().toISOString()
  };
}
