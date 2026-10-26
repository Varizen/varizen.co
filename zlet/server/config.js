/**
 * Zlet — runtime configuration.
 *
 * Zero dependencies, zero required environment variables. Environment variables
 * only switch on optional behaviour (live provider credentials, data directory,
 * encryption key). Nothing here ever holds a user secret.
 */

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function bool(value, fallback = false) {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

export const config = {
  app: 'zlet',
  version: '1.0.0',
  port: num(process.env.PORT, 4400),
  host: process.env.HOST || '127.0.0.1',

  /** Demo account is on by default so the product is explorable out of the box. */
  demoAccountEnabled: !bool(process.env.ZLET_DISABLE_DEMO, false),

  /** Demo settlement acceleration: 1 real second = N seconds of provider ETA. */
  demoSettlementScale: num(process.env.ZLET_SETTLEMENT_SCALE, 8),

  /** Finance defaults. */
  baseCurrency: 'USD',
  maxActiveCountries: 2,
  stalenessWarnMinutes: 5,

  /**
   * Sandbox acceleration for blockchain confirmations. Real confirmation times are
   * always shown in the UI; this only controls how fast the demo reaches them.
   */
  chainConfirmSeconds: num(process.env.ZLET_CHAIN_CONFIRM_SECONDS, 6),

  /** Content-Security-Policy applied to every response. No external origins. */
  csp: [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ')
};

export default config;
