/**
 * Zlet — HTTP server (zero dependencies, Node built-ins only).
 *
 * Security posture:
 *  - strict CSP, nosniff, no-referrer, frame-ancestors 'none'
 *  - same-origin enforcement on every mutating request (CSRF)
 *  - per-client rate limiting
 *  - bounded JSON bodies with strict object validation
 *  - provider credentials never enter the process
 *  - every consequential action lands in the audit log
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { store } from './store.js';
import { seedDemoAccount } from './seed.js';
import {
  COUNTRY_LIST,
  MAX_ACTIVE_COUNTRIES,
  activeCountries,
  activeCountryCodes,
  assertCountryChangeAllowed,
  availabilityMatrix,
  featureAvailability,
  AVAILABILITY_LABELS
} from './countries.js';
import {
  CAPABILITY,
  KIND_LABELS,
  capabilityMatrix,
  getProvider,
  providersForScope
} from './providers.js';
import {
  ASSET_DECIMALS,
  CHAIN_LIST,
  CHAINS,
  STABLECOIN_PROFILES,
  formatRate,
  midRate,
  rateNumber
} from './fx.js';
import {
  assetGroups,
  breakdown,
  chainExposure,
  describePortfolio,
  scopedRecords,
  stablecoinHub,
  summarize,
  usdMinor
} from './portfolio.js';
import {
  assertRouteLegitimate,
  availabilityMatrix as routerMatrix,
  buildExchangeRoutes,
  buildSendRoutes,
  evaluateCompliance,
  remittanceCorridors
} from './router.js';
import {
  DEFI_ACTIONS,
  crossChainRoutes,
  defiPositions,
  defiProtocols,
  simulate
} from './defi.js';
import {
  STATE_LABELS,
  authorizeTransaction,
  cancelTransaction,
  createTransaction,
  feeBreakdown,
  listTransactions,
  presentTransaction,
  rejectTransaction,
  submitTransaction,
  evaluateGuard
} from './transactions.js';
import { activityLog, logActivity, sandbox } from './sandbox.js';
import { handleCommand, searchTransactions, aiActivity } from './assistant.js';
import {
  addSubscription,
  cancelRequest,
  createRequest,
  getRequest,
  listRequests,
  listSubscriptions,
  merchantSummary,
  paymentRails,
  reconcilePayment
} from './merchant.js';
import { fromMinor, formatMoney, toMinor } from './money.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const MAX_BODY_BYTES = 160 * 1024;

/* ------------------------------ rate limit ------------------------------ */

const buckets = new Map();

function rateLimit(key, { limit = 240, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  return { ok: true };
}

const sweep = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.resetAt < now) buckets.delete(key);
}, 60_000);
if (typeof sweep.unref === 'function') sweep.unref();

/* -------------------------------- helpers ------------------------------- */

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return reject(Object.assign(new Error('Body must be a JSON object'), { status: 400 }));
        }
        resolve(parsed);
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()'
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    ...securityHeaders
  });
  res.end(body);
}

function sendError(res, err) {
  const status = err?.status || 500;
  if (status >= 500) console.error('[zlet]', err);
  sendJson(res, status, {
    error: err?.message || 'Internal error',
    ...(err?.code ? { code: err.code } : {}),
    ...(err?.needsPermission ? { needsPermission: true, capability: err.capability, level: err.level } : {}),
    ...(err?.needsBiometric ? { needsBiometric: true } : {}),
    ...(err?.guard ? { guard: err.guard } : {})
  });
}

function sameOrigin(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

/* -------------------------------- routes -------------------------------- */

const routes = [];
function route(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

/* --- bootstrap --- */

route('GET', '/api/health', () => ({
  status: 'ok',
  app: 'zlet',
  version: config.version,
  demo: config.demoAccountEnabled,
  frozen: Boolean(store.state.guard.frozen),
  cache: store.stats()
}));

function bootstrapPayload() {
  const profile = store.state.profile;
  const scope = activeCountries(profile);
  return {
    profile,
    settings: store.state.settings,
    guard: store.state.guard,
    scope: scope.map((c) => ({
      code: c.code,
      name: c.name,
      flag: c.flag,
      currency: c.currency,
      currencySymbol: c.currencySymbol,
      role: c.code === profile.homeCountry ? 'home' : 'visiting'
    })),
    maxActiveCountries: MAX_ACTIVE_COUNTRIES,
    countries: COUNTRY_LIST,
    summary: summarize(profile),
    groups: assetGroups(profile),
    breakdown: breakdown(profile),
    chains: chainExposure(profile),
    portfolioNarrative: describePortfolio(profile),
    stablecoins: stablecoinHub(profile),
    connections: store.state.connections.map((c) => {
      const p = getProvider(c.providerId);
      return {
        ...c,
        name: p?.name || c.providerId,
        kind: p?.kind || null,
        kindLabel: KIND_LABELS[p?.kind] || null,
        color: p?.color || null,
        aggregatable: Boolean(p?.aggregatable),
        balanceNote: p?.balanceNote || null,
        capabilities: p?.capabilities || []
      };
    }),
    providers: providersForScope(activeCountryCodes(profile)).map((p) => ({
      id: p.id,
      name: p.name,
      kind: p.kind,
      kindLabel: KIND_LABELS[p.kind],
      color: p.color,
      capabilities: p.capabilities,
      rails: p.rails || [],
      countries: p.countries,
      aggregatable: p.aggregatable,
      nonCustodial: Boolean(p.nonCustodial),
      fee: p.fee,
      etaMinutes: p.etaMinutes,
      risk: p.risk,
      sandbox: true
    })),
    capabilityMatrix: capabilityMatrix(),
    transactions: listTransactions({ limit: 30 }),
    requests: listRequests(),
    subscriptions: listSubscriptions(),
    defi: { positions: defiPositions(profile), protocols: defiProtocols(profile) },
    sandbox: sandbox.snapshot(),
    activity: activityLog(30),
    aiActivity: aiActivity(20),
    recipients: store.state.recipients,
    approvedContracts: store.state.approvedContracts,
    availability: availabilityMatrix(profile),
    availabilityLabels: AVAILABILITY_LABELS,
    chainsCatalog: CHAIN_LIST,
    stablecoinProfiles: STABLECOIN_PROFILES,
    assetDecimals: ASSET_DECIMALS,
    capabilities: CAPABILITY,
    transactionStates: STATE_LABELS,
    defiActions: DEFI_ACTIONS,
    fx: {
      homeToBase: profile.homeCurrency ? formatRate(profile.homeCurrency, 'USD') : null,
      baseToHome: profile.homeCurrency ? formatRate('USD', profile.homeCurrency) : null,
      homeRate: profile.homeCurrency ? rateNumber('USD', profile.homeCurrency) : null
    },
    cache: store.stats(),
    serverTime: new Date().toISOString()
  };
}

route('GET', '/api/bootstrap', () => bootstrapPayload());

/* --- portfolio --- */

route('GET', '/api/portfolio', () => {
  const profile = store.state.profile;
  return {
    summary: summarize(profile),
    groups: assetGroups(profile),
    breakdown: breakdown(profile),
    chains: chainExposure(profile),
    stablecoins: stablecoinHub(profile),
    records: scopedRecords(profile).map((r) => ({
      id: r.id,
      providerId: r.providerId,
      providerName: r.providerName,
      asset: r.asset,
      chain: r.chain,
      label: r.label,
      state: r.state,
      recordType: r.recordType,
      estimated: Boolean(r.estimated),
      minor: String(r.minor),
      decimals: r.decimals,
      usdMinor: usdMinor(r).toString()
    })),
    narrative: describePortfolio(profile)
  };
});

/* --- countries: the 2-country rule --- */

route('GET', '/api/countries', () => {
  const profile = store.state.profile;
  return {
    home: profile.homeCountry,
    visiting: profile.visitingCountry,
    travelActive: profile.travelActive,
    maxActiveCountries: MAX_ACTIVE_COUNTRIES,
    active: activeCountries(profile),
    catalog: COUNTRY_LIST,
    availability: availabilityMatrix(profile),
    rule: `A Zlet account may reference at most ${MAX_ACTIVE_COUNTRIES} countries at once: one home country and one visiting country.`,
    canSetHome: false,
    canSetVisiting: true
  };
});

route('POST', '/api/countries/travel', async (req) => {
  const body = await readBody(req);
  const profile = store.state.profile;

  const next = {
    homeCountry: profile.homeCountry,
    visitingCountry: body.visitingCountry !== undefined ? body.visitingCountry : profile.visitingCountry,
    travelActive: body.travelActive !== undefined ? Boolean(body.travelActive) : Boolean(profile.visitingCountry)
  };

  const check = assertCountryChangeAllowed(profile, next);
  Object.assign(store.state.profile, check.profile);
  store.persist();

  logActivity('TRAVEL_MODE_CHANGED',
    check.profile.travelActive
      ? `Travel mode on — visiting ${check.profile.visitingCountry} with home ${check.profile.homeCountry}`
      : 'Travel mode off — only the home country is in scope',
    { severity: 'high' });

  return {
    profile: store.state.profile,
    active: activeCountries(store.state.profile),
    availability: availabilityMatrix(store.state.profile),
    message: check.profile.travelActive
      ? `Scope is now ${check.profile.homeCountry} (home) + ${check.profile.visitingCountry} (visiting).`
      : `Scope is now ${check.profile.homeCountry} (home) only.`
  };
});

route('POST', '/api/countries/home', async (req) => {
  const body = await readBody(req);
  const profile = store.state.profile;
  if (!body.homeCountry) throw Object.assign(new Error('homeCountry is required.'), { status: 400 });

  // Home country is identity-bound: changing it is a re-onboarding event.
  const check = assertCountryChangeAllowed(profile, {
    homeCountry: body.homeCountry,
    // A home change clears any visiting country that would collide.
    visitingCountry: body.homeCountry === profile.visitingCountry ? null : profile.visitingCountry,
    travelActive: body.homeCountry === profile.visitingCountry ? false : profile.travelActive
  });

  Object.assign(store.state.profile, check.profile);
  store.persist();
  logActivity('HOME_COUNTRY_CHANGED', `Home country set to ${check.profile.homeCountry} (requires re-verification in production)`, { severity: 'high' });

  return {
    profile: store.state.profile,
    active: activeCountries(store.state.profile),
    notice: 'In production this is a regulated re-onboarding event and would require fresh identity verification.'
  };
});

/* --- routing: send / convert --- */

route('POST', '/api/route/send', async (req) => {
  const body = await readBody(req);
  return buildSendRoutes({
    amount: body.amount,
    asset: body.asset || store.state.profile.currency || 'USD',
    targetAsset: body.targetAsset || null,
    destinationCountry: body.destinationCountry || store.state.profile.homeCountry,
    recipient: body.recipient || 'Recipient',
    crossBorder: body.crossBorder
  });
});

route('POST', '/api/route/convert', async (req) => {
  const body = await readBody(req);
  return buildExchangeRoutes({
    from: body.from || 'USDC',
    to: body.to || 'MYR',
    amount: body.amount,
    chain: body.chain || 'base'
  });
});

route('GET', '/api/route/corridors', () => remittanceCorridors());

/* --- compliance + availability --- */

route('POST', '/api/compliance/check', async (req) => {
  const body = await readBody(req);
  return evaluateCompliance({
    countryCode: body.countryCode || store.state.profile.homeCountry,
    feature: body.feature || 'send',
    amountMinor: body.amount && body.asset ? toMinor(body.amount, ASSET_DECIMALS[body.asset] ?? 2) : null,
    asset: body.asset,
    destination: body.destination,
    isCrossBorder: Boolean(body.crossBorder)
  });
});

route('GET', '/api/availability', () => availabilityMatrix(store.state.profile));

/* --- transactions --- */

route('GET', '/api/transactions', (_req, url) =>
  listTransactions({
    limit: Number(url.searchParams.get('limit') || 50),
    type: url.searchParams.get('type'),
    state: url.searchParams.get('state'),
    search: url.searchParams.get('q')
  })
);

route('POST', '/api/transactions', async (req) => {
  const body = await readBody(req);
  const result = createTransaction(
    {
      type: body.type || 'send',
      amount: body.amount,
      asset: body.asset,
      sourceBalanceId: body.sourceBalanceId,
      receiveMinor: body.receiveMinor,
      receiveAsset: body.receiveAsset,
      recipient: body.recipient,
      destinationCountry: body.destinationCountry,
      providerId: body.providerId,
      providerName: body.providerName,
      routeLabel: body.routeLabel,
      quote: body.quote,
      simulation: body.simulation,
      idempotencyKey: body.idempotencyKey || req.headers['idempotency-key'],
      countryCode: body.countryCode,
      feature: body.feature,
      etaMinutes: body.etaMinutes,
      isBridge: Boolean(body.isBridge),
      isNewRecipient: Boolean(body.isNewRecipient),
      memo: body.memo,
      destinationBalanceId: body.destinationBalanceId,
      feeBreakdown: body.quote ? feeBreakdown(body.quote) : null
    },
    { actor: body.actor || 'user' }
  );
  return {
    transaction: presentTransaction(result.transaction),
    replayed: result.replayed
  };
});

route('POST', '/api/transactions/:id/authorize', async (req, _url, params) => {
  const body = await readBody(req);
  const tx = authorizeTransaction(params.id, { biometric: Boolean(body.biometric), actor: 'user' });
  return { transaction: presentTransaction(tx) };
});

route('POST', '/api/transactions/:id/submit', async (_req, _url, params) => ({
  transaction: presentTransaction(submitTransaction(params.id))
}));

route('POST', '/api/transactions/:id/reject', async (req, _url, params) => {
  const body = await readBody(req);
  return { transaction: presentTransaction(rejectTransaction(params.id, body.reason)) };
});

route('POST', '/api/transactions/:id/cancel', async (req, _url, params) => {
  const body = await readBody(req);
  return { transaction: presentTransaction(cancelTransaction(params.id, body.reason)) };
});

route('POST', '/api/transactions/guard-check', async (req) => {
  const body = await readBody(req);
  const decimals = ASSET_DECIMALS[body.asset || 'USD'] ?? 2;
  return evaluateGuard({
    amountMinor: toMinor(body.amount || '0', decimals),
    asset: body.asset || 'USD',
    providerId: body.providerId || null,
    isBridge: Boolean(body.isBridge),
    isNewRecipient: Boolean(body.isNewRecipient),
    countryCode: body.countryCode || store.state.profile.homeCountry
  });
});

/* --- DeFi --- */

route('POST', '/api/defi/simulate', async (req) => {
  const body = await readBody(req);
  return simulate({
    providerId: body.providerId,
    action: body.action || 'swap',
    chain: body.chain || 'base',
    from: body.from,
    to: body.to,
    amount: body.amount,
    slippageBps: body.slippageBps ?? store.state.settings.defaultSlippageBps
  });
});

route('GET', '/api/defi/positions', () => ({
  positions: defiPositions(store.state.profile),
  protocols: defiProtocols(store.state.profile),
  actions: DEFI_ACTIONS
}));

route('POST', '/api/defi/bridge', async (req) => {
  const body = await readBody(req);
  return crossChainRoutes({
    fromChain: body.fromChain,
    toChain: body.toChain,
    asset: body.asset || 'USDC',
    amount: body.amount || '1000'
  });
});

/* --- merchant / requests / subscriptions --- */

route('GET', '/api/merchant', (_req, url) => merchantSummary(url.searchParams.get('country') || store.state.profile.homeCountry));

route('GET', '/api/merchant/rails', (_req, url) => paymentRails(url.searchParams.get('country') || store.state.profile.homeCountry));

route('GET', '/api/requests', (_req, url) => ({
  items: listRequests({ kind: url.searchParams.get('kind'), status: url.searchParams.get('status') })
}));

route('POST', '/api/requests', async (req) => createRequest(await readBody(req)));

route('GET', '/api/requests/:ref', (_req, _url, params) => {
  const record = getRequest(params.ref);
  if (!record) throw Object.assign(new Error('Request not found.'), { status: 404 });
  return {
    request: record,
    rails: record.rails,
    country: record.countryCode,
    /** Whether a customer in that country could actually pay it. */
    payable: featureAvailability(record.countryCode, 'receive')
  };
});

route('POST', '/api/requests/:ref/cancel', (_req, _url, params) => ({ request: cancelRequest(params.ref) }));

route('POST', '/api/requests/:ref/reconcile', async (req, _url, params) => {
  const body = await readBody(req);
  return { request: reconcilePayment(params.ref, body.transactionId) };
});

route('GET', '/api/subscriptions', () => ({ items: listSubscriptions() }));
route('POST', '/api/subscriptions', async (req) => addSubscription(await readBody(req)));

/* --- AI assistant --- */

route('POST', '/api/ai/command', async (req) => {
  const body = await readBody(req);
  const result = handleCommand(body.text);
  logActivity('AI_COMMAND', `Ask Zlet: “${String(body.text).slice(0, 140)}”`, {
    actor: 'ai',
    refs: { intent: result.facts?.intent }
  });
  return { ...result, aiActivity: aiActivity(12) };
});

route('GET', '/api/ai/activity', (_req, url) => ({ items: aiActivity(Number(url.searchParams.get('limit') || 40)) }));

route('GET', '/api/ai/search', (_req, url) => ({
  query: url.searchParams.get('q') || '',
  results: searchTransactions(url.searchParams.get('q'))
}));

/* --- sandbox / permissions / security --- */

route('GET', '/api/sandbox', () => sandbox.snapshot());

route('POST', '/api/sandbox/grant', async (req) => {
  const body = await readBody(req);
  sandbox.grant(body.level || body.capability, { scope: body.scope || 'all', actor: 'user', expiresInMinutes: body.expiresInMinutes ?? null });
  logActivity('PERMISSION_GRANTED', `Granted ${body.level || body.capability} to the AI`, { severity: 'high' });
  return sandbox.snapshot();
});

route('POST', '/api/sandbox/revoke', async (req) => {
  const body = await readBody(req);
  if (!body.capability) throw Object.assign(new Error('capability is required.'), { status: 400 });
  sandbox.revoke(body.capability);
  return sandbox.snapshot();
});

route('POST', '/api/security/lock', () => {
  const result = sandbox.lockZlet();
  return { ...result, sandbox: sandbox.snapshot(), message: 'Zlet locked. AI execution, payments and DeFi disabled; sessions revoked.' };
});

route('POST', '/api/security/unlock', () => {
  const result = sandbox.unlockZlet();
  return { ...result, sandbox: sandbox.snapshot(), message: 'Zlet unlocked with observe-only permissions.' };
});

route('POST', '/api/guard', async (req) => {
  const body = await readBody(req);
  const allowedKeys = [
    'autoExecuteMaxMinor', 'requireNewRecipientConfirm', 'requireBridgeApproval',
    'requireBiometricAboveMinor', 'blockUnknownContracts', 'blockSanctioned', 'recurringApproved'
  ];
  for (const key of allowedKeys) {
    if (body[key] !== undefined) store.state.guard[key] = body[key];
  }
  store.persist();
  logActivity('GUARD_UPDATED', 'Zlet Guard policies updated', { severity: 'high', detail: Object.keys(body).join(', ') });
  return { guard: store.state.guard };
});

route('GET', '/api/security', () => ({
  guard: store.state.guard,
  frozen: Boolean(store.state.guard.frozen),
  sandbox: sandbox.snapshot(),
  connections: store.state.connections,
  approvedContracts: store.state.approvedContracts,
  recipients: store.state.recipients,
  devices: [{ id: 'dev_this', name: 'This device', trusted: true, lastSeen: new Date().toISOString(), biometric: store.state.profile.biometric }],
  cache: store.stats(),
  aiProvider: store.state.aiProvider
}));

route('GET', '/api/privacy', () => ({
  profile: {
    name: store.state.profile.name,
    homeCountry: store.state.profile.homeCountry,
    visitingCountry: store.state.profile.visitingCountry,
    kyc: store.state.profile.kyc
  },
  connections: store.state.connections.map((c) => {
    const p = getProvider(c.providerId);
    return {
      ...c,
      name: p?.name || c.providerId,
      aggregatable: Boolean(p?.aggregatable),
      balanceNote: p?.balanceNote || 'Balance stays with the provider.',
      /** What Zlet actually stores about this connection. */
      storedData: p?.aggregatable
        ? ['provider id', 'country', 'balance snapshot', 'sync timestamp', 'transaction references']
        : ['provider id', 'country', 'connection status', 'capabilities'],
      credentialsStored: false
    };
  }),
  permissions: sandbox.snapshot(),
  cache: store.stats(),
  dataRetention: {
    balances: 'snapshot only — overwritten on each sync',
    transactions: 'references and amounts only',
    credentials: 'never stored, never requested',
    seedPhrases: 'never requested under any circumstances',
    auditLog: '800 entries, encrypted at rest'
  },
  thirdPartyAI: store.state.aiProvider,
  revokeAllEndpoint: 'POST /api/sandbox/revoke'
}));

route('GET', '/api/activity', (_req, url) => ({ items: activityLog(Number(url.searchParams.get('limit') || 60)) }));

/* --- settings --- */

route('POST', '/api/settings', async (req) => {
  const body = await readBody(req);
  const settable = ['theme', 'agentMode', 'liveSync', 'defaultSlippageBps'];
  for (const key of settable) {
    if (body[key] !== undefined) store.state.settings[key] = body[key];
  }
  store.persist();
  return { settings: store.state.settings };
});

route('POST', '/api/sync', async () => {
  // A real implementation fetches each provider. Here we refresh the sandbox
  // timestamps so staleness labels behave truthfully.
  const at = new Date().toISOString();
  for (const b of store.state.balances) b.syncedAt = at;
  for (const p of store.state.positions) p.syncedAt = at;
  store.state.settings.lastSyncAt = at;
  store.persist();
  logActivity('PROVIDER_SYNC', 'Synchronised connected providers');
  return { lastSyncAt: at, cache: store.stats() };
});

route('POST', '/api/reset', () => {
  store.reset();
  seedDemoAccount();
  sandbox.grant('observe', { actor: 'system' });
  return { ok: true, bootstrap: bootstrapPayload() };
});

/* ---------------------------- static files ---------------------------- */

function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.join(PUBLIC_DIR, rel);

  // Path traversal guard.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback for /pay/<ref> style deep links.
      if (!path.extname(rel)) {
        return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, html) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Not found');
          }
          res.writeHead(200, { 'Content-Type': MIME['.html'], 'Content-Security-Policy': config.csp, ...securityHeaders });
          res.end(html);
        });
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=300',
      ...(ext === '.html' ? { 'Content-Security-Policy': config.csp } : {}),
      ...securityHeaders
    });
    res.end(data);
  });
}

/* ------------------------------- server ------------------------------- */

function matchRoute(method, pathname) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const patternParts = r.pattern.split('/');
    const pathParts = pathname.split('/');
    if (patternParts.length !== pathParts.length) continue;

    const params = {};
    let ok = true;
    for (let i = 0; i < patternParts.length; i += 1) {
      const pp = patternParts[i];
      if (pp.startsWith(':')) params[pp.slice(1)] = decodeURIComponent(pathParts[i]);
      else if (pp !== pathParts[i]) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;

      if (pathname.startsWith('/api/')) {
        const key = req.socket.remoteAddress || 'unknown';
        const limit = rateLimit(key);
        if (!limit.ok) {
          return sendJson(res, 429, { error: 'Too many requests. Try again shortly.' });
        }

        if (!sameOrigin(req)) {
          return sendJson(res, 403, { error: 'Cross-origin request blocked.' });
        }

        const match = matchRoute(req.method, pathname);
        if (!match) return sendJson(res, 404, { error: `No route for ${req.method} ${pathname}` });

        const result = await match.handler(req, url, match.params);
        if (result === undefined) return sendJson(res, 200, { ok: true });
        return sendJson(res, 200, result);
      }

      return serveStatic(req, res, pathname);
    } catch (err) {
      if (res.headersSent) return res.end();
      return sendError(res, err);
    }
  });
}

/** Start when executed directly. */
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  seedDemoAccount();
  const server = createServer();
  server.listen(config.port, config.host, () => {
    console.log(`\n  Zlet — one screen. Every wallet. Every payment. Every asset.`);
    console.log(`  ${config.host}:${config.port}\n`);
    console.log(`  Home country : ${store.state.profile.homeCountry}`);
    console.log(`  Visiting     : ${store.state.profile.visitingCountry || '— (travel mode off)'}`);
    console.log(`  Max countries: ${MAX_ACTIVE_COUNTRIES} (home + visiting)\n`);
  });
}

export default createServer;
