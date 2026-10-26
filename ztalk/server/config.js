/**
 * ZTalk — runtime configuration (was: ZenChat).
 *
 * Zero npm dependencies, zero required environment variables. Env vars only
 * enable optional capabilities (remote AI provider, sibling Zen products).
 * The app runs complete and honest with nothing configured.
 */

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function bool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

export const config = {
  port: num(process.env.PORT, 4500),
  host: process.env.HOST || '127.0.0.1',
  publicUrl: process.env.ZENCHAT_PUBLIC_URL || `http://localhost:${num(process.env.PORT, 4500)}`,
  timeZone: process.env.ZENCHAT_TIME_ZONE || 'Asia/Karachi',

  /** Sibling Zen products. Every bridge is fail-safe and clearly labelled. */
  zenMeetUrl: process.env.ZENMEET_URL || 'http://127.0.0.1:4400',
  zenCalendarUrl: process.env.ZENCAL_URL || 'http://127.0.0.1:4300',
  zenBoxUrl: process.env.ZENBOX_URL || 'http://127.0.0.1:4200',

  /** Default translation pair. Per-conversation overrides live in the store. */
  language: process.env.ZENCHAT_LANGUAGE || 'en',

  /** AI provider abstraction. Remote providers are opt-in and never implicit. */
  ai: {
    provider: process.env.ZENCHAT_AI_PROVIDER || 'deterministic',
    model: process.env.ZENCHAT_AI_MODEL || 'zenchat-rules-v1',
    endpoint: process.env.ZENCHAT_AI_ENDPOINT || '',
    allowRemote: bool(process.env.ZENCHAT_AI_ALLOW_REMOTE, false),
    apiKey: process.env.ZENCHAT_AI_KEY || ''
  },

  /**
   * AI privacy boundary. 'assist' is the default: AI may summarize, translate
   * and suggest, but never sends a message without an explicit user action.
   */
  aiDefaultMode: process.env.ZENCHAT_AI_DEFAULT || 'assist',

  limits: {
    maxMessageLength: 8000,
    maxBroadcastTargets: 12,
    maxAttachmentBytes: 25 * 1024 * 1024,
    bodyBytes: 320 * 1024,
    ratePerMinute: num(process.env.ZENCHAT_RATE_LIMIT, 240)
  },

  /** Content-Security-Policy applied to every HTML response. */
  csp: [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self' blob: mediastream:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss:",
    "worker-src 'self' blob:",
    "frame-ancestors 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ')
};
