/**
 * Zlet — transaction engine (prompt §26, §27, §28, §46, §47, §49, §50, §62).
 *
 * A transaction is a state machine. It is NEVER shown as successful because an
 * API returned 200:
 *
 *   CREATED → QUOTED → SIMULATED → AWAITING_APPROVAL → AUTHORIZED
 *          → SUBMITTED → PROCESSING → CONFIRMED
 *
 * Failure states: REJECTED · FAILED · EXPIRED · CANCELLED · REVERSED
 *
 * Zlet Guard policies are evaluated BEFORE submission. Every create requires an
 * idempotency key, so a retry can never double-pay.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { config } from './config.js';
import { fromMinor, toMinor } from './money.js';
import { ASSET_DECIMALS } from './fx.js';
import { getProvider } from './providers.js';
import { activeCountryCodes } from './countries.js';
import { assertRouteLegitimate } from './router.js';
import { logActivity, sandbox } from './sandbox.js';

export const TRANSACTION_STATES = [
  'CREATED', 'QUOTED', 'SIMULATED', 'AWAITING_APPROVAL', 'AUTHORIZED',
  'SUBMITTED', 'PROCESSING', 'CONFIRMED'
];

export const FAILURE_STATES = ['REJECTED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REVERSED'];

export const TERMINAL_STATES = ['CONFIRMED', ...FAILURE_STATES];

export const STATE_LABELS = {
  CREATED: 'Created',
  QUOTED: 'Quoted',
  SIMULATED: 'Simulated',
  AWAITING_APPROVAL: 'Awaiting approval',
  AUTHORIZED: 'Authorized',
  SUBMITTED: 'Submitted',
  PROCESSING: 'Processing',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
  REVERSED: 'Reversed'
};

/** Legal transitions. Anything else is a bug, not a retry. */
export const TRANSITIONS = {
  // AWAITING_APPROVAL is deliberately reachable straight from CREATED: a type
  // that needs no quote or simulation (receive, request) has nothing to quote.
  CREATED: ['QUOTED', 'SIMULATED', 'AWAITING_APPROVAL', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  QUOTED: ['SIMULATED', 'AWAITING_APPROVAL', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  SIMULATED: ['AWAITING_APPROVAL', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  AWAITING_APPROVAL: ['AUTHORIZED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  AUTHORIZED: ['SUBMITTED', 'FAILED', 'CANCELLED'],
  SUBMITTED: ['PROCESSING', 'FAILED'],
  PROCESSING: ['CONFIRMED', 'FAILED', 'REVERSED'],
  CONFIRMED: ['REVERSED'],
  REJECTED: [],
  FAILED: [],
  EXPIRED: [],
  CANCELLED: [],
  REVERSED: []
};

function nowIso() {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ *
 * Zlet Guard (§28)
 * ------------------------------------------------------------------ */

export function evaluateGuard({ amountMinor, asset, providerId, route, isBridge = false, isNewRecipient = false, countryCode }) {
  const guard = store.state.guard;
  const checks = [];
  const add = (rule, pass, detail, severity = 'block') => checks.push({ rule, pass, detail, severity });

  if (guard.frozen) add('zlet-locked', false, 'Zlet is locked. Unlock it in the Security Center first.');

  add(
    'country-scope',
    activeCountryCodes(store.state.profile).includes(countryCode),
    countryCode
      ? `${countryCode} must be your home or visiting country.`
      : 'Country scope is enforced by the router.'
  );

  if (guard.requireNewRecipientConfirm && isNewRecipient) {
    add('new-recipient', false, 'This recipient is new. Confirm the addition explicitly.', 'confirm');
  }

  if (guard.requireBridgeApproval && isBridge) {
    add('bridge-approval', false, 'Cross-chain bridges require explicit approval.', 'confirm');
  }

  const autoMax = BigInt(guard.autoExecuteMaxMinor || 0);
  if (autoMax > 0n && BigInt(amountMinor) <= autoMax) {
    add('auto-execute-limit', true, `Within your automatic-execution limit of ${fromMinor(autoMax, 2)} USD.`, 'info');
  } else if (autoMax === 0n) {
    add('auto-execute-limit', true, 'Automatic execution is disabled — every transaction needs your approval.', 'info');
  }

  const biometricThreshold = BigInt(guard.requireBiometricAboveMinor || 0);
  const needsBiometric = biometricThreshold > 0n && BigInt(amountMinor) > biometricThreshold;
  if (needsBiometric) add('biometric', false, 'Biometric confirmation required above your threshold.', 'confirm');

  if (providerId) {
    const p = getProvider(providerId);
    add('known-provider', Boolean(p), p ? `${p.name} is in the provider catalog.` : 'Unknown provider.', p ? 'info' : 'block');
  }

  const blocking = checks.filter((c) => !c.pass && c.severity === 'block');
  const confirming = checks.filter((c) => !c.pass && c.severity === 'confirm');
  return {
    passed: blocking.length === 0,
    checks,
    blocking,
    confirming,
    needsBiometric,
    summary: blocking.length
      ? `Blocked by ${blocking.length} Zlet Guard rule${blocking.length === 1 ? '' : 's'}.`
      : confirming.length
        ? `${confirming.length} confirmation${confirming.length === 1 ? '' : 's'} required.`
        : 'All Zlet Guard checks passed.'
  };
}

/* ------------------------------------------------------------------ *
 * State machine
 * ------------------------------------------------------------------ */

export function transition(tx, next, meta = {}) {
  const allowed = TRANSITIONS[tx.state] || [];
  if (!allowed.includes(next)) {
    throw Object.assign(
      new Error(`Illegal transaction transition ${tx.state} → ${next}.`),
      { status: 409, code: 'ILLEGAL_TRANSITION' }
    );
  }
  const previous = tx.state;
  tx.state = next;
  tx.updatedAt = nowIso();
  tx.timeline = tx.timeline || [];
  tx.timeline.push({ at: tx.updatedAt, from: previous, to: next, note: meta.note || null });
  store.persist();

  logActivity(`TX_${next}`, `${tx.typeLabel || tx.type} ${next.toLowerCase().replace(/_/g, ' ')}`, {
    refs: { transactionId: tx.id },
    detail: meta.note || null
  });

  if (next === 'CONFIRMED') settle(tx);
  return tx;
}

/**
 * Settlement simulation. The provider timestamp/ETA is what the UI shows; the
 * demo clock only decides when the sandbox reaches that state.
 */
function settle(tx) {
  const eta = tx.etaMinutes || [0, 2];
  const seconds = Math.max(1, Math.round((eta[1] * 60) / config.demoSettlementScale));
  tx.confirmationDeadline = new Date(Date.now() + seconds * 1000).toISOString();
  store.persist();

  const timer = setTimeout(() => {
    const live = store.state.transactions.find((t) => t.id === tx.id);
    if (!live || live.state !== 'CONFIRMED') return;
    live.settledAt = nowIso();
    live.providerReference = live.providerReference || `prov_${crypto.randomBytes(6).toString('hex')}`;
    applyBalanceEffect(live);
    store.persist();
    logActivity('SETTLEMENT_VERIFIED', `Settlement verified with ${live.providerName || 'provider'}`, {
      refs: { transactionId: live.id }
    });
  }, seconds * 1000);
  if (typeof timer.unref === 'function') timer.unref();
}

/** Apply the balance delta at the owning provider — never a Zlet ledger. */
function applyBalanceEffect(tx) {
  const deltaMinor = BigInt(tx.amountMinorNumber || 0);
  const record = store.state.balances.find((b) => b.id === tx.sourceBalanceId);
  if (record) {
    const before = BigInt(record.minor);
    const after = before - deltaMinor;
    record.minor = String(after > 0n ? after : 0n);
    record.syncedAt = nowIso();
    record.lastTransactionId = tx.id;
  }
  if (tx.destinationBalanceId) {
    const dest = store.state.balances.find((b) => b.id === tx.destinationBalanceId);
    if (dest) {
      const receive = BigInt(tx.receiveMinorNumber || 0);
      dest.minor = String(BigInt(dest.minor) + receive);
      dest.syncedAt = nowIso();
      dest.lastTransactionId = tx.id;
    }
  }
}

/**
 * Create a transaction (idempotent).
 *
 * @param {object} input
 * @param {string} input.idempotencyKey  caller-supplied; repeated keys return the
 *                                       original transaction, never a duplicate
 */
export function createTransaction(input, { actor = 'user' } = {}) {
  const {
    type = 'send',
    amount,
    asset = 'USD',
    sourceBalanceId = null,
    receiveMinor = null,
    receiveAsset = null,
    recipient = null,
    destinationCountry = null,
    providerId = null,
    providerName = null,
    routeLabel = null,
    quote = null,
    simulation = null,
    idempotencyKey,
    countryCode = null,
    feature = null,
    etaMinutes = [0, 3],
    isBridge = false,
    isNewRecipient = false,
    memo = null,
    feeBreakdown = null
  } = input;

  const key = idempotencyKey || `idem_${crypto.randomUUID()}`;
  const existingId = store.state.idempotency[key];
  if (existingId) {
    const existing = store.state.transactions.find((t) => t.id === existingId);
    if (existing) {
      logActivity('IDEMPOTENT_REPLAY', 'Duplicate request suppressed by idempotency key', {
        refs: { transactionId: existing.id }
      });
      return { transaction: existing, replayed: true };
    }
  }

  const decimals = ASSET_DECIMALS[asset] ?? 2;
  const amountMinor = toMinor(amount, decimals);
  if (amountMinor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });

  const scopeCountry = countryCode || destinationCountry || store.state.profile.homeCountry;
  if (feature) {
    assertRouteLegitimate({ countryCode: scopeCountry, feature, amountMinor, destination: recipient });
  }

  const guard = evaluateGuard({
    amountMinor,
    asset,
    providerId,
    isBridge,
    isNewRecipient,
    countryCode: scopeCountry
  });
  if (!guard.passed) {
    throw Object.assign(new Error(guard.summary), {
      status: 403,
      code: 'GUARD_BLOCKED',
      guard
    });
  }

  const typeLabels = {
    send: 'Send', pay: 'Payment', receive: 'Receive', convert: 'Convert',
    defi: 'DeFi action', request: 'Request', bridge: 'Bridge'
  };

  const tx = {
    id: `tx_${crypto.randomUUID()}`,
    type,
    typeLabel: typeLabels[type] || type,
    state: 'CREATED',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    idempotencyKey: key,

    amount,
    amountMinor: String(amountMinor),
    amountMinorNumber: String(amountMinor),
    amountDecimals: decimals,
    asset,
    receiveMinor: receiveMinor != null ? String(receiveMinor) : null,
    receiveMinorNumber: receiveMinor != null ? String(receiveMinor) : null,
    receiveAsset: receiveAsset || asset,

    sourceBalanceId,
    destinationBalanceId: input.destinationBalanceId || null,
    recipient,
    destinationCountry,
    countryCode: scopeCountry,
    providerId,
    providerName: providerName || getProvider(providerId)?.name || null,
    routeLabel,
    quoteId: quote?.id || null,
    simulationId: simulation?.id || null,
    etaMinutes,
    memo,
    actor,
    guard,
    feeBreakdown,
    timeline: [{ at: nowIso(), from: null, to: 'CREATED', note: 'Transaction created' }],
    createdAtLabel: new Date().toLocaleString('en-US', { hour12: false })
  };

  store.state.transactions.unshift(tx);
  if (store.state.transactions.length > 400) store.state.transactions.length = 400;
  store.state.idempotency[key] = tx.id;
  store.persist();

  if (quote) transition(tx, 'QUOTED', { note: `Quoted via ${quote.provider}` });
  if (simulation) transition(tx, 'SIMULATED', { note: 'Simulation complete' });
  transition(tx, 'AWAITING_APPROVAL', { note: guard.summary });

  return { transaction: tx, replayed: false };
}

/** User approves. Requires the Execute capability unless it is a receive/request. */
export function authorizeTransaction(txId, { biometric = false, actor = 'user' } = {}) {
  const tx = store.state.transactions.find((t) => t.id === txId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  if (tx.state !== 'AWAITING_APPROVAL') {
    throw Object.assign(new Error(`Transaction is ${STATE_LABELS[tx.state]}, not awaiting approval.`), { status: 409 });
  }

  const needsExecute = !['receive', 'request'].includes(tx.type);
  if (needsExecute) sandbox.require('execute');

  const biometricThreshold = BigInt(store.state.guard.requireBiometricAboveMinor || 0);
  if (biometricThreshold > 0n && BigInt(tx.amountMinor) > biometricThreshold && !biometric) {
    throw Object.assign(
      new Error('Biometric confirmation is required for this amount. Approve with a device confirmation.'),
      { status: 403, code: 'BIOMETRIC_REQUIRED', needsBiometric: true }
    );
  }

  transition(tx, 'AUTHORIZED', { note: `Approved by ${actor}${biometric ? ' with device confirmation' : ''}` });
  return tx;
}

/** Submit to the provider. Requires Execute. */
export function submitTransaction(txId) {
  const tx = store.state.transactions.find((t) => t.id === txId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  if (tx.state !== 'AUTHORIZED') {
    throw Object.assign(new Error(`Transaction is ${STATE_LABELS[tx.state]}, not authorized.`), { status: 409 });
  }
  sandbox.require('execute');
  if (store.state.guard.frozen) {
    throw Object.assign(new Error('Zlet is locked — execution is disabled.'), { status: 403, code: 'ZLET_LOCKED' });
  }

  transition(tx, 'SUBMITTED', { note: `Submitted to ${tx.providerName || 'provider'}` });
  tx.providerReference = `prov_${crypto.randomBytes(6).toString('hex')}`;
  transition(tx, 'PROCESSING', { note: 'Provider accepted — awaiting settlement' });
  transition(tx, 'CONFIRMED', { note: 'Provider confirmed' });
  return tx;
}

export function rejectTransaction(txId, reason = 'User rejected') {
  const tx = store.state.transactions.find((t) => t.id === txId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  transition(tx, 'REJECTED', { note: reason });
  return tx;
}

export function cancelTransaction(txId, reason = 'User cancelled') {
  const tx = store.state.transactions.find((t) => t.id === txId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  transition(tx, 'CANCELLED', { note: reason });
  return tx;
}

/** Convert a CONFIRMED tx to REVERSED (provider-initiated reversal only). */
export function reverseTransaction(txId, reason) {
  const tx = store.state.transactions.find((t) => t.id === txId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  transition(tx, 'REVERSED', { note: reason || 'Reversed by provider' });
  const record = store.state.balances.find((b) => b.id === tx.sourceBalanceId);
  if (record && tx.amountMinorNumber) {
    record.minor = String(BigInt(record.minor) + BigInt(tx.amountMinorNumber));
    store.persist();
  }
  return tx;
}

/** Public view of a transaction, with labels and honest settlement status. */
export function presentTransaction(tx) {
  const isTerminal = TERMINAL_STATES.includes(tx.state);
  const isSuccess = tx.state === 'CONFIRMED';
  return {
    ...tx,
    stateLabel: STATE_LABELS[tx.state],
    amountLabel: `${fromMinor(BigInt(tx.amountMinor), tx.amountDecimals)} ${tx.asset}`,
    receiveLabel:
      tx.receiveMinor != null
        ? `${fromMinor(BigInt(tx.receiveMinor), ASSET_DECIMALS[tx.receiveAsset] ?? 2)} ${tx.receiveAsset}`
        : null,
    isTerminal,
    isSuccess,
    /**
     * A submitted provider request is not success. Only CONFIRMED counts, and
     * even then settlement verification is a separate, visible step.
     */
    statusNote: isSuccess
      ? tx.settledAt
        ? `Settlement verified with ${tx.providerName || 'provider'}`
        : 'Provider confirmed — verifying settlement'
      : isTerminal
        ? STATE_LABELS[tx.state]
        : 'In progress — not yet settled'
  };
}

export function listTransactions({ limit = 50, type = null, state = null, search = null } = {}) {
  let items = store.state.transactions;
  if (type) items = items.filter((t) => t.type === type);
  if (state) items = items.filter((t) => t.state === state);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((t) =>
      [t.type, t.providerName, t.recipient, t.asset, t.receiveAsset, t.state, t.memo, t.routeLabel]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }
  return items.slice(0, limit).map(presentTransaction);
}

/** Fee transparency payload (§49). */
export function feeBreakdown(quote) {
  if (!quote) return null;
  const d = quote.amountDecimals;
  return [
    { label: 'Amount', value: `${fromMinor(BigInt(quote.amountMinor), d)} ${quote.from}` },
    { label: 'Provider fee', value: `${fromMinor(BigInt(quote.providerFeeMinor), d)} ${quote.from}`, note: `${(quote.providerFeeBps / 100).toFixed(2)}% + fixed` },
    { label: 'Network fee', value: `${fromMinor(BigInt(quote.networkFeeMinor), d)} ${quote.from}` },
    { label: 'Exchange spread', value: `${(quote.spreadBps / 100).toFixed(2)}%`, note: `mid ${quote.midRate?.toFixed(6)} → provider ${quote.providerRate?.toFixed(6)}` },
    { label: 'Slippage', value: `${(quote.slippageBps / 100).toFixed(2)}%` },
    { label: 'Total cost', value: `${fromMinor(BigInt(quote.totalCostMinor), d)} ${quote.from}`, emphasis: true },
    { label: 'Recipient receives', value: `${fromMinor(BigInt(quote.receiveMinor), quote.receiveDecimals)} ${quote.to}`, emphasis: true }
  ];
}
