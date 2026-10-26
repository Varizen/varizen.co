/**
 * Zlet — portfolio intelligence (prompt §3, §23, §52).
 *
 * Core rule: never blindly add balances that cannot actually be spent,
 * transferred or withdrawn. Every balance carries an explicit STATE, and the
 * total is always presented as a set of states rather than one misleading number.
 *
 *   spendable     immediately usable
 *   transferable  can be moved, not directly spent
 *   invested      locked or deployed (DeFi, staking)
 *   pending       unsettled
 *   restricted    requires provider/jurisdiction action
 *
 * `estimated: true` marks a fiat value derived from market prices rather than a
 * native fiat balance. Facts and estimates are never blended silently.
 */

import { store } from './store.js';
import { ASSET_DECIMALS, ASSET_KIND, STABLECOIN_PROFILES, usdPerUnit } from './fx.js';
import { multiply, fromMinor, ratioBps } from './money.js';
import { activeCountryCodes, country as countryMeta } from './countries.js';
import { KIND_LABELS, getProvider } from './providers.js';

export const BALANCE_STATES = ['spendable', 'transferable', 'invested', 'pending', 'restricted'];

export const STATE_LABELS = {
  spendable: 'Spendable',
  transferable: 'Transferable',
  invested: 'Invested',
  pending: 'Pending',
  restricted: 'Restricted'
};

export const STATE_NOTES = {
  spendable: 'Immediately usable for a payment.',
  transferable: 'Can be moved to another account, but not spent directly.',
  invested: 'Deployed or locked in a position.',
  pending: 'Not yet settled at the provider.',
  restricted: 'Requires provider or jurisdiction action before use.'
};

/** USD value of a balance record, as a bigint in USD minor units (2dp). */
export function usdMinor(record) {
  const rate = usdPerUnit(record.asset);
  if (!rate) return 0n;
  const decimals = record.decimals ?? ASSET_DECIMALS[record.asset] ?? 2;
  // minor * rate(num/den) * 10^2 / 10^decimals
  return multiply(
    BigInt(record.minor),
    rate.num * 100n,
    rate.den * 10n ** BigInt(decimals)
  );
}

/** All balance + position records inside the 2-country scope. */
export function scopedRecords(profile = store.state.profile) {
  const scope = activeCountryCodes(profile);
  const balances = store.state.balances
    .filter((b) => !b.country || scope.includes(b.country))
    .map((b) => ({ ...b, recordType: 'balance' }));
  const positions = store.state.positions
    .filter((p) => !p.country || scope.includes(p.country))
    .map((p) => ({ ...p, recordType: 'position', state: p.state || 'invested' }));
  return [...balances, ...positions];
}

/** Asset-group buckets used by the "My Assets" cards. */
const GROUP_FOR_KIND = {
  mfs: 'mobile',
  'payment-wallet': 'payment',
  remittance: 'payment',
  'payment-network': 'payment',
  'card-wallet': 'others',
  exchange: 'others',
  'crypto-wallet': 'crypto',
  stablecoin: 'crypto',
  defi: 'defi',
  dex: 'defi'
};

export const ASSET_GROUPS = {
  mobile: { id: 'mobile', label: 'Mobile Wallets', hint: 'MFS & telecom wallets' },
  payment: { id: 'payment', label: 'Payment Apps', hint: 'Wallets, QR & remittance' },
  crypto: { id: 'crypto', label: 'Crypto', hint: 'Coins & stablecoins' },
  defi: { id: 'defi', label: 'DeFi', hint: 'Lending, LP & staking' },
  others: { id: 'others', label: 'Others', hint: 'Cards, venues & loyalty' }
};

function groupFor(record) {
  const provider = getProvider(record.providerId);
  const kind = record.kind || provider?.kind || 'other';
  return GROUP_FOR_KIND[kind] || 'others';
}

/**
 * Full portfolio summary.
 * `totalMinor` is the market value. `spendableMinor` is the only number that can
 * honestly be labelled "available to spend".
 */
export function summarize(profile = store.state.profile) {
  const records = scopedRecords(profile);

  const byState = Object.fromEntries(BALANCE_STATES.map((s) => [s, 0n]));
  let total = 0n;
  let estimatedTotal = 0n;
  let factTotal = 0n;

  for (const r of records) {
    const value = usdMinor(r);
    total += value;
    if (r.estimated) estimatedTotal += value;
    else factTotal += value;
    const state = BALANCE_STATES.includes(r.state) ? r.state : 'transferable';
    byState[state] += value;
  }

  const providerIds = new Set(records.map((r) => r.providerId));
  const chains = new Set(records.map((r) => r.chain).filter(Boolean));
  const countries = new Set(records.map((r) => r.country).filter(Boolean));

  const states = BALANCE_STATES.map((state) => ({
    state,
    label: STATE_LABELS[state],
    note: STATE_NOTES[state],
    minor: byState[state].toString(),
    shareBps: total > 0n ? ratioBps(byState[state], total) : 0
  }));

  return {
    totalMinor: total.toString(),
    factMinor: factTotal.toString(),
    estimatedMinor: estimatedTotal.toString(),
    spendableMinor: byState.spendable.toString(),
    transferableMinor: byState.transferable.toString(),
    investedMinor: byState.invested.toString(),
    pendingMinor: byState.pending.toString(),
    restrictedMinor: byState.restricted.toString(),
    byState: states,
    counts: {
      records: records.length,
      providers: providerIds.size,
      chains: chains.size,
      countries: countries.size,
      pendingTransactions: store.state.transactions.filter((t) =>
        ['CREATED', 'QUOTED', 'SIMULATED', 'AWAITING_APPROVAL', 'AUTHORIZED', 'SUBMITTED', 'PROCESSING'].includes(t.state)
      ).length
    },
    currencies: [...new Set(records.map((r) => r.asset))],
    lastSyncAt: store.state.settings.lastSyncAt,
    /** Honest disclosure of what this number includes. */
    disclosure: {
      marketValue: 'Estimated at sandbox reference prices; on-chain values move.',
      spendable: 'Only balances with state = spendable are counted here.',
      excludes: [
        'Wallet ecosystems that do not permit aggregation (Google Pay, Apple Pay, Samsung Wallet, PayNow)',
        'Anything outside your home + visiting country scope'
      ]
    }
  };
}

/** The five "My Assets" cards from the universal home screen. */
export function assetGroups(profile = store.state.profile) {
  const records = scopedRecords(profile);
  const buckets = new Map(Object.keys(ASSET_GROUPS).map((id) => [id, { total: 0n, items: [], providers: new Set(), states: new Set() }]));

  for (const r of records) {
    const id = groupFor(r);
    const bucket = buckets.get(id);
    bucket.total += usdMinor(r);
    bucket.providers.add(r.providerId);
    bucket.states.add(r.state || 'transferable');
    bucket.items.push({
      id: r.id,
      providerId: r.providerId,
      providerName: r.providerName || getProvider(r.providerId)?.name || r.providerId,
      asset: r.asset,
      chain: r.chain || null,
      label: r.label || `${r.asset}${r.chain ? ` — ${r.chain}` : ''}`,
      minor: String(r.minor),
      decimals: r.decimals ?? ASSET_DECIMALS[r.asset] ?? 2,
      usdMinor: usdMinor(r).toString(),
      state: r.state || 'transferable',
      estimated: Boolean(r.estimated),
      positionType: r.positionType || null,
      apy: r.apy ?? null,
      protocol: r.protocol || null,
      kind: r.kind || getProvider(r.providerId)?.kind || null
    });
  }

  return Object.values(ASSET_GROUPS).map((group) => {
    const bucket = buckets.get(group.id);
    const byState = {};
    for (const item of bucket.items) byState[item.state] = (byState[item.state] || 0n) + BigInt(item.usdMinor);
    return {
      ...group,
      totalMinor: bucket.total.toString(),
      providerCount: bucket.providers.size,
      itemCount: bucket.items.length,
      states: [...bucket.states],
      byState: Object.fromEntries(Object.entries(byState).map(([k, v]) => [k, v.toString()])),
      /** Caption under the number, mirroring the reference design. */
      caption:
        group.id === 'crypto'
          ? bucket.items.map((i) => i.asset).slice(0, 3).join(', ') || '—'
          : group.id === 'defi'
            ? `${bucket.providers.size} protocol${bucket.providers.size === 1 ? '' : 's'}`
            : `${bucket.providers.size} connected`,
      items: bucket.items.sort((a, b) => Number(BigInt(b.usdMinor) - BigInt(a.usdMinor)))
    };
  });
}

/** Stablecoin hub (§22) — chain, balance, capability, risk classification. */
export function stablecoinHub(profile = store.state.profile) {
  const records = scopedRecords(profile).filter((r) => ASSET_KIND(r.asset) === 'stablecoin');
  return records.map((r) => {
    const profileMeta = STABLECOIN_PROFILES[r.asset] || { risk: 'unknown' };
    return {
      id: r.id,
      asset: r.asset,
      chain: r.chain,
      label: `${r.asset} — ${r.chain}`,
      minor: String(r.minor),
      decimals: r.decimals ?? ASSET_DECIMALS[r.asset] ?? 6,
      usdMinor: usdMinor(r).toString(),
      state: r.state,
      providerId: r.providerId,
      providerName: r.providerName,
      country: r.country,
      transfer: r.state !== 'restricted',
      exchange: r.state === 'spendable' || r.state === 'transferable',
      defiDeployable: Boolean(r.chain) && r.state !== 'restricted',
      risk: profileMeta.risk,
      backing: profileMeta.backing,
      issuer: profileMeta.issuer,
      attestation: profileMeta.attestation,
      regulated: profileMeta.regulated,
      note: 'Stablecoins are not interchangeable: issuer, backing and redemption terms differ.'
    };
  });
}

/** Chain exposure (§20) — always "Asset + Chain", never an asset alone. */
export function chainExposure(profile = store.state.profile) {
  const records = scopedRecords(profile).filter((r) => r.chain);
  const map = new Map();
  for (const r of records) {
    const key = r.chain;
    const entry = map.get(key) || { chain: key, totalMinor: 0n, assets: new Map() };
    const value = usdMinor(r);
    entry.totalMinor += value;
    entry.assets.set(r.asset, (entry.assets.get(r.asset) || 0n) + value);
    map.set(key, entry);
  }
  return [...map.values()]
    .sort((a, b) => Number(b.totalMinor - a.totalMinor))
    .map((e) => ({
      chain: e.chain,
      totalMinor: e.totalMinor.toString(),
      assets: [...e.assets.entries()].map(([asset, minor]) => ({ asset, usdMinor: minor.toString() }))
    }));
}

/** Category breakdown for Portfolio Intelligence (§52), facts vs estimates. */
export function breakdown(profile = store.state.profile) {
  const records = scopedRecords(profile);
  const totals = new Map();
  for (const r of records) {
    const kind = ASSET_KIND(r.asset);
    const key = r.recordType === 'position' ? 'defi' : kind;
    totals.set(key, (totals.get(key) || 0n) + usdMinor(r));
  }
  const total = [...totals.values()].reduce((a, b) => a + b, 0n);
  const labels = { fiat: 'Cash-like', stablecoin: 'Stablecoins', crypto: 'Crypto', defi: 'DeFi positions' };
  return [...totals.entries()]
    .map(([key, minor]) => ({
      key,
      label: labels[key] || key,
      usdMinor: minor.toString(),
      shareBps: total > 0n ? ratioBps(minor, total) : 0
    }))
    .sort((a, b) => Number(BigInt(b.usdMinor) - BigInt(a.usdMinor)));
}

/** Human sentence for the AI (§52). Facts, then estimates, clearly separated. */
export function describePortfolio(profile = store.state.profile) {
  const parts = breakdown(profile);
  const summary = summarize(profile);
  const facts = parts.slice(0, 4).map((p) => `${(p.shareBps / 100).toFixed(0)}% ${p.label}`);
  return {
    fact: `Your portfolio is ${facts.join(', ')}.`,
    estimate:
      `Market value is $${fromMinor(BigInt(summary.totalMinor), 2)}. ` +
      `Of that, $${fromMinor(BigInt(summary.spendableMinor), 2)} is genuinely spendable right now.`,
    opinion: null,
    caveat: 'Percentages are estimates based on sandbox reference prices, not investment advice.'
  };
}

export { KIND_LABELS, countryMeta };
