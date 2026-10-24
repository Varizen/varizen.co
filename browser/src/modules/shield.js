// Eye Shield: tracker blocking, per-site exemptions, HTTPS-first, strict permissions.
const TRACKERS = [
  'doubleclick.net', 'googlesyndication.com', 'google-analytics.com', 'googletagmanager.com',
  'googleadservices.com', 'adservice.google.com', 'facebook.net', 'connect.facebook.net',
  'scorecardresearch.com', 'quantserve.com', 'taboola.com', 'outbrain.com', 'criteo.com',
  'adnxs.com', 'hotjar.com', 'amazon-adsystem.com', 'moatads.com', 'pubmatic.com', 'rubiconproject.com'
];
const ALLOWED_PERMISSIONS = new Set(['fullscreen', 'clipboard-sanitized-write', 'pointerLock']);

const isTracker = (host) => TRACKERS.some((d) => host === d || host.endsWith('.' + d));

// opts: { allow: () => string[], httpsFirst: () => boolean, onBlock: (host) => void }
function install(ses, opts) {
  ses.webRequest.onBeforeRequest((details, cb) => {
    try {
      const url = new URL(details.url);
      // HTTPS-first: upgrade plain http navigations.
      if (details.resourceType === 'mainFrame' && url.protocol === 'http:' && opts.httpsFirst()) {
        url.protocol = 'https:';
        return cb({ redirectURL: url.toString() });
      }
      if (details.resourceType !== 'mainFrame' && isTracker(url.hostname)) {
        const exempt = opts.allow().some((h) => url.hostname === h || url.hostname.endsWith('.' + h));
        if (!exempt) { opts.onBlock(url.hostname); return cb({ cancel: true }); }
      }
    } catch {}
    cb({});
  });
  ses.setPermissionRequestHandler((_wc, perm, cb) => cb(ALLOWED_PERMISSIONS.has(perm)));
  ses.setPermissionCheckHandler((_wc, perm) => ALLOWED_PERMISSIONS.has(perm));
}

module.exports = { install };
