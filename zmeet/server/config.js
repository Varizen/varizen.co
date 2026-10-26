/**
 * ZMeet — runtime configuration.
 * (was: ZenMeet)
 *
 * Zero dependencies, zero required environment variables. Env vars only enable
 * optional capabilities (remote AI, an external SFU, sibling Zen products).
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
  port: num(process.env.PORT, 4400),
  host: process.env.HOST || '127.0.0.1',
  publicUrl: process.env.ZENMEET_PUBLIC_URL || `http://localhost:${num(process.env.PORT, 4400)}`,
  timeZone: process.env.ZENMEET_TIME_ZONE || 'Asia/Karachi',

  /** Sibling Zen products. Both bridges are fail-safe when unavailable. */
  zenCalendarUrl: process.env.ZENCAL_URL || 'http://localhost:4300',
  zenBoxUrl: process.env.ZENBOX_URL || 'http://localhost:4200',

  /** Room tokens are short-lived and scoped to a single room + participant. */
  roomTokenTtlMinutes: num(process.env.ZENMEET_ROOM_TOKEN_TTL, 360),
  guestTokenTtlMinutes: num(process.env.ZENMEET_GUEST_TOKEN_TTL, 120),
  sessionTtlMinutes: num(process.env.ZENMEET_SESSION_TTL, 720),

  /** Media strategy. Mesh for small rooms; point this at an SFU for scale. */
  media: {
    mode: process.env.ZENMEET_SFU_URL ? 'sfu' : 'mesh',
    sfuUrl: process.env.ZENMEET_SFU_URL || '',
    maxMeshPeers: num(process.env.ZENMEET_MAX_MESH_PEERS, 8),
    note: 'Media never passes through this server. Signaling only.'
  },

  /** AI provider abstraction (prompt §36). Remote providers are opt-in. */
  ai: {
    provider: process.env.ZENMEET_AI_PROVIDER || 'deterministic',
    model: process.env.ZENMEET_AI_MODEL || 'rule-based',
    endpoint: process.env.ZENMEET_AI_ENDPOINT || '',
    allowRemote: bool(process.env.ZENMEET_AI_ALLOW_REMOTE, false),
    providerKey: process.env.ZENMEET_AI_KEY || ''
  },

  /** Default AI boundary for a brand-new room (prompt §19). */
  aiDefaultMode: process.env.ZENMEET_AI_DEFAULT || 'assistant',

  limits: {
    maxChatLength: 4000,
    maxParticipants: num(process.env.ZENMEET_MAX_PARTICIPANTS, 500),
    bodyBytes: 320 * 1024
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
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ')
};
