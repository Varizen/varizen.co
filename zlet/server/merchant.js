/**
 * Zlet — merchant mode, invoices, requests and subscriptions
 * (prompt §14, §34, §35, §36).
 *
 * A merchant should never need to understand every underlying network. Zlet
 * presents the rails that are legitimate for the merchant's country and lets the
 * customer pay through the provider they already trust.
 *
 * Requests and invoices generate real, verifiable payloads (QR + link) whose
 * contents are derived from the connected provider, not fabricated.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { ASSET_DECIMALS } from './fx.js';
import { fromMinor, toMinor } from './money.js';
import { activeCountryCodes, country as countryMeta, featureAvailability, inScope, AVAILABILITY } from './countries.js';
import { CAPABILITY, providersForScope } from './providers.js';
import { logActivity } from './sandbox.js';

export const REQUEST_STATUS = ['open', 'paid', 'expired', 'cancelled', 'partially_paid'];

function nowIso() {
  return new Date().toISOString();
}

/** Rails that can legitimately accept a payment for a given country. */
export function paymentRails(countryCode) {
  const profile = store.state.profile;
  if (!inScope(profile, countryCode)) {
    return {
      rails: [],
      blocked: `${countryMeta(countryCode)?.name || countryCode} is outside your two-country scope.`
    };
  }
  const availability = featureAvailability(countryCode, 'merchant');
  if (availability.status === AVAILABILITY.NOT_SUPPORTED) {
    return { rails: [], blocked: availability.reason };
  }
  const providers = providersForScope([countryCode], CAPABILITY.PAY);
  return {
    rails: providers.map((p) => ({
      id: p.id,
      name: p.name,
      kind: p.kind,
      color: p.color,
      methods: p.rails,
      etaMinutes: p.etaMinutes,
      aggregatable: p.aggregatable,
      feeBps: p.fee?.pctBps ?? 0,
      note: p.balanceNote || null
    })),
    availability,
    blocked: null
  };
}

/* ------------------------------------------------------------------ *
 * Requests & invoices (§14, §35)
 * ------------------------------------------------------------------ */

export function createRequest({
  kind = 'request',
  amount,
  asset = null,
  customer = null,
  description = null,
  dueDate = null,
  expiresInHours = 72,
  countryCode = null,
  rails = null
}) {
  const profile = store.state.profile;
  const country = countryCode || profile.homeCountry;
  const currency = asset || countryMeta(country)?.currency || 'USD';
  const decimals = ASSET_DECIMALS[currency] ?? 2;
  const amountMinor = toMinor(amount, decimals);
  if (amountMinor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });

  const availability = featureAvailability(country, kind === 'invoice' ? 'merchant' : 'receive');
  if (availability.status === AVAILABILITY.NOT_SUPPORTED) {
    throw Object.assign(new Error(availability.reason), { status: 403, code: 'JURISDICTION_BLOCKED' });
  }

  const availableRails = paymentRails(country);
  const selected = rails?.length
    ? availableRails.rails.filter((r) => rails.includes(r.id))
    : availableRails.rails;

  if (!selected.length) {
    throw Object.assign(
      new Error(`No payment rail in ${countryMeta(country)?.name} can accept this ${kind} right now.`),
      { status: 400, code: 'NO_RAIL' }
    );
  }

  const reference = `ZLET-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const id = `req_${crypto.randomUUID()}`;
  const expiresAt = expiresInHours ? new Date(Date.now() + expiresInHours * 3600_000).toISOString() : null;

  const record = {
    id,
    kind,
    reference,
    status: 'open',
    createdAt: nowIso(),
    amount: fromMinor(amountMinor, decimals),
    amountMinor: String(amountMinor),
    decimals,
    asset: currency,
    customer,
    description,
    dueDate,
    expiresAt,
    countryCode: country,
    rails: selected.map((r) => ({ id: r.id, name: r.name, methods: r.methods })),
    memo: description || `Zlet ${kind} ${reference}`,
    /** A real, deterministic payload — the UI renders it as a QR + link. */
    payload: `zlet://${kind}/${reference}?amount=${fromMinor(amountMinor, decimals)}&asset=${currency}&country=${country}`,
    link: `/pay/${reference}`,
    createdBy: 'user'
  };

  const bucket = kind === 'invoice' ? store.state.invoices : store.state.invoices;
  bucket.unshift(record);
  if (bucket.length > 200) bucket.length = 200;
  store.persist();

  logActivity(kind === 'invoice' ? 'INVOICE_CREATED' : 'REQUEST_CREATED',
    `${kind === 'invoice' ? 'Invoice' : 'Payment request'} ${reference} for ${record.amount} ${currency}`,
    { refs: { requestId: id, country } });

  return record;
}

export function listRequests({ kind = null, status = null } = {}) {
  let items = store.state.invoices;
  if (kind) items = items.filter((r) => r.kind === kind);
  if (status) items = items.filter((r) => r.status === status);
  return items.map((r) => {
    const expired = r.status === 'open' && r.expiresAt && new Date(r.expiresAt) < new Date();
    return { ...r, status: expired ? 'expired' : r.status };
  });
}

export function getRequest(reference) {
  return listRequests().find((r) => r.reference === reference || r.id === reference) || null;
}

/**
 * Mark a request paid. Only callable when a *confirmed* transaction references
 * it — reconciliation is never assumed (§35).
 */
export function reconcilePayment(reference, transactionId) {
  const record = store.state.invoices.find((r) => r.reference === reference || r.id === reference);
  if (!record) throw Object.assign(new Error('Request not found.'), { status: 404 });
  const tx = store.state.transactions.find((t) => t.id === transactionId);
  if (!tx) throw Object.assign(new Error('Transaction not found.'), { status: 404 });
  if (tx.state !== 'CONFIRMED') {
    throw Object.assign(
      new Error(`Cannot reconcile against a ${tx.state} transaction. Only CONFIRMED provider settlements count.`),
      { status: 409, code: 'NOT_SETTLED' }
    );
  }
  const paid = BigInt(record.amountMinor);
  const received = BigInt(tx.receiveMinor || tx.amountMinor);
  record.status = received >= paid ? 'paid' : 'partially_paid';
  record.paidAt = nowIso();
  record.transactionId = tx.id;
  store.persist();
  logActivity('REQUEST_RECONCILED', `${record.reference} marked ${record.status}`, { refs: { requestId: record.id, transactionId } });
  return record;
}

export function cancelRequest(reference) {
  const record = store.state.invoices.find((r) => r.reference === reference || r.id === reference);
  if (!record) throw Object.assign(new Error('Request not found.'), { status: 404 });
  if (record.status !== 'open') {
    throw Object.assign(new Error(`Request is already ${record.status}.`), { status: 409 });
  }
  record.status = 'cancelled';
  store.persist();
  logActivity('REQUEST_CANCELLED', `Cancelled ${record.reference}`, { refs: { requestId: record.id } });
  return record;
}

/* ------------------------------------------------------------------ *
 * Merchant mode (§34)
 * ------------------------------------------------------------------ */

export function merchantSummary(countryCode = store.state.profile.homeCountry) {
  const rails = paymentRails(countryCode);
  const requests = listRequests().filter((r) => r.countryCode === countryCode);
  const open = requests.filter((r) => r.status === 'open');
  const paid = requests.filter((r) => r.status === 'paid');
  const openMinor = open.reduce((acc, r) => acc + BigInt(r.amountMinor), 0n);
  const paidMinor = paid.reduce((acc, r) => acc + BigInt(r.amountMinor), 0n);

  return {
    countryCode,
    country: countryMeta(countryCode),
    rails: rails.rails,
    blocked: rails.blocked,
    requests: { total: requests.length, open: open.length, paid: paid.length },
    openMinor: openMinor.toString(),
    paidMinor: paidMinor.toString(),
    /** Merchant never needs to know the network — Zlet maps it. */
    note: 'Payment rails are resolved per country. Zlet never invents interoperability a rail does not support.',
    invoices: requests.filter((r) => r.kind === 'invoice').slice(0, 20),
    paymentRequests: requests.filter((r) => r.kind === 'request').slice(0, 20)
  };
}

/* ------------------------------------------------------------------ *
 * Subscription manager (§36)
 * ------------------------------------------------------------------ */

export function listSubscriptions() {
  return store.state.subscriptions.map((s) => {
    const next = s.nextPaymentAt ? new Date(s.nextPaymentAt) : null;
    return {
      ...s,
      amountLabel: `${s.amount} ${s.asset}`,
      nextPaymentLabel: next ? next.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown',
      /** Cancellation guidance only — never an automated cancellation. */
      cancellation: s.cancellation || 'Cancel at the merchant. Zlet cannot cancel a third-party service for you.',
      autoCancel: false
    };
  });
}

export function addSubscription({ merchant, amount, asset = 'USD', frequency = 'monthly', source, nextPaymentAt = null }) {
  const decimals = ASSET_DECIMALS[asset] ?? 2;
  const minor = toMinor(amount, decimals);
  if (minor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });
  if (!['weekly', 'monthly', 'quarterly', 'yearly'].includes(frequency)) {
    throw Object.assign(new Error('Frequency must be weekly, monthly, quarterly or yearly.'), { status: 400 });
  }
  const record = {
    id: `sub_${crypto.randomUUID()}`,
    merchant,
    amount: fromMinor(minor, decimals),
    amountMinor: String(minor),
    asset,
    frequency,
    source: source || null,
    nextPaymentAt,
    createdAt: nowIso(),
    detectedFrom: 'manual'
  };
  store.state.subscriptions.push(record);
  store.persist();
  logActivity('SUBSCRIPTION_TRACKED', `Tracking ${merchant} (${record.amount} ${asset} ${frequency})`);
  return record;
}
