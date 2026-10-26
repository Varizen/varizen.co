/**
 * ZCal — runtime configuration. (was: ZenCalendar)
 *
 * Everything is optional. The server runs with zero dependencies and zero
 * environment variables; env vars only enable live provider synchronisation.
 */

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: num(process.env.PORT, 4300),
  host: process.env.HOST || '127.0.0.1',
  defaultTimeZone: process.env.ZENCAL_TIME_ZONE || 'Asia/Karachi',
  zenboxUrl: process.env.ZENBOX_URL || 'http://localhost:4200',
  demoAccountEnabled: process.env.ZENCAL_DISABLE_DEMO !== '1',

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || ''
    },
    microsoft: {
      clientId: process.env.MS_CLIENT_ID || '',
      clientSecret: process.env.MS_CLIENT_SECRET || '',
      redirectUri: process.env.MS_REDIRECT_URI || ''
    }
  },

  /** Content-Security-Policy applied to every HTML response. */
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
