// Eye Shield: permanent, pre-installed ad, adware, malware, phishing and tracker blocker.
// Zero-config, hardware-fast matching, HTTPS-first upgrades, strict zero-trust permissions.

const TRACKERS = [
  'doubleclick.net', 'googlesyndication.com', 'google-analytics.com', 'googletagmanager.com',
  'googleadservices.com', 'adservice.google.com', 'facebook.net', 'connect.facebook.net',
  'scorecardresearch.com', 'quantserve.com', 'taboola.com', 'outbrain.com', 'criteo.com',
  'adnxs.com', 'hotjar.com', 'amazon-adsystem.com', 'moatads.com', 'pubmatic.com', 'rubiconproject.com',
  'chartbeat.com', 'newrelic.com', 'segment.io', 'mixpanel.com', 'clarity.ms', 'branch.io'
];

const ADS_AND_ADWARE = [
  'popads.net', 'popcash.net', 'propellerads.com', 'adsterra.com', 'adcash.com',
  'revcontent.com', 'mgid.com', 'exoclick.com', 'trafficjunky.com', 'adclick.g.doubleclick.net',
  'yieldmo.com', 'inmobi.com', 'unityads.unity3d.com', 'ironsrc.com', 'appsflyer.com',
  'smartadserver.com', 'adcolony.com', 'adform.net', 'bidswitch.net', 'casalemedia.com',
  'openx.net', 'sonobi.com', 'spotxchange.com', 'zergnet.com'
];

const MALWARE_AND_PHISHING = [
  'auth-verify-portal.top', 'account-update-alert.xyz', 'crypto-drainer.click',
  'walletconnect-auth.club', 'metamask-recover.info', 'secure-banking-login.top',
  'malware-drop.ru', 'trojan-download.biz', 'ransomware-c2.net', 'phish-cloud.cc',
  'payload-bin.online', 'exploit-kit.cc'
];

const COMBINED_BLOCKLIST = new Set([...TRACKERS, ...ADS_AND_ADWARE, ...MALWARE_AND_PHISHING]);

const ALLOWED_PERMISSIONS = new Set(['fullscreen', 'clipboard-sanitized-write', 'pointerLock']);

function isBlocked(host) {
  if (!host) return false;
  host = host.toLowerCase();
  if (COMBINED_BLOCKLIST.has(host)) return true;
  for (const domain of COMBINED_BLOCKLIST) {
    if (host.endsWith('.' + domain)) return true;
  }
  return false;
}

// opts: { allow: () => string[], httpsFirst: () => boolean, onBlock: (host, reason) => void }
function install(ses, opts) {
  ses.webRequest.onBeforeRequest((details, cb) => {
    try {
      const url = new URL(details.url);
      const host = url.hostname.toLowerCase();

      // Block dangerous malware or phishing regardless of mainFrame or subresource
      const isMalware = MALWARE_AND_PHISHING.some((d) => host === d || host.endsWith('.' + d));
      if (isMalware) {
        opts.onBlock(host, 'malware');
        return cb({ cancel: true });
      }

      // HTTPS-first: upgrade plain http navigations.
      if (details.resourceType === 'mainFrame' && url.protocol === 'http:' && opts.httpsFirst()) {
        url.protocol = 'https:';
        return cb({ redirectURL: url.toString() });
      }

      // Block ad, adware, tracker subresources
      if (details.resourceType !== 'mainFrame' && isBlocked(host)) {
        const exemptList = (opts.allow && opts.allow()) || [];
        const exempt = exemptList.some((h) => host === h || host.endsWith('.' + h));
        if (!exempt) {
          opts.onBlock(host, 'ad_or_tracker');
          return cb({ cancel: true });
        }
      }
    } catch {}
    cb({});
  });

  ses.setPermissionRequestHandler((_wc, perm, cb) => cb(ALLOWED_PERMISSIONS.has(perm)));
  ses.setPermissionCheckHandler((_wc, perm) => ALLOWED_PERMISSIONS.has(perm));
}

module.exports = {
  install,
  isBlocked,
  TRACKERS,
  ADS_AND_ADWARE,
  MALWARE_AND_PHISHING
};
