/**
 * Zlet — Global FX engine (prompt §33).
 *
 * Rates are rational numbers, never floats. Each asset declares `usdPerUnit` as
 * an exact fraction { num, den } of USD, plus its display decimals. Conversion is
 * a single rational multiplication, so a chain of conversions cannot drift.
 *
 * Every quote exposes:
 *   midRate          — the mid-market reference used for comparison
 *   providerRate     — the rate the provider actually applies
 *   spreadBps        — the gap between the two, in basis points
 *   effectiveRate    — what the user really gets after all fees
 *   effectiveCostBps — total cost expressed in bps of the send amount
 *
 * We never say a rate is "best" without naming the comparison universe and the
 * timestamp — both travel with every quote.
 */

import { fromMinor, multiply, ratioBps, toMinor } from './money.js';

/** Minor-unit decimals per asset. On-chain decimals are respected exactly. */
export const ASSET_DECIMALS = {
  USD: 2, MYR: 2, BDT: 2, SGD: 2, AED: 2, GBP: 2, EUR: 2, INR: 2, PKR: 2, AUD: 2,
  USDC: 6, USDT: 6, DAI: 18,
  BTC: 8, ETH: 18, SOL: 9, MATIC: 18, ARB: 18, OP: 18, BNB: 18
};

export const FIAT = new Set(['USD', 'MYR', 'BDT', 'SGD', 'AED', 'GBP', 'EUR', 'INR', 'PKR', 'AUD']);
export const STABLECOINS = new Set(['USDC', 'USDT', 'DAI']);
export const CRYPTO = new Set(['BTC', 'ETH', 'SOL', 'MATIC', 'ARB', 'OP', 'BNB']);

export const ASSET_KIND = (code) => (FIAT.has(code) ? 'fiat' : STABLECOINS.has(code) ? 'stablecoin' : 'crypto');

/**
 * Mid-market reference table (sandbox snapshot). `usdPerUnit` is exact.
 * Fiat: 1 unit of currency = 1/rate USD. Crypto: 1 unit = price USD.
 */
const FIAT_RATES_VS_USD = {
  USD: 1, MYR: 4.42, BDT: 120.5, SGD: 1.34, AED: 3.6725,
  GBP: 0.79, EUR: 0.92, INR: 83.2, PKR: 278.5, AUD: 1.51
};

const CRYPTO_PRICES_USD = {
  BTC: 67250, ETH: 3120, SOL: 148.5, MATIC: 0.62, ARB: 0.94, OP: 1.86, BNB: 585
};

/** Exact USD value of one unit. */
export function usdPerUnit(code) {
  const c = String(code || '').toUpperCase();
  if (STABLECOINS.has(c)) return { num: 1n, den: 1n };
  if (FIAT.has(c)) {
    const rate = FIAT_RATES_VS_USD[c];
    if (!rate) return null;
    // 1 unit = (1/rate) USD. Keep 1e6 precision in the rate for exactness.
    return { num: 1_000_000n, den: BigInt(Math.round(rate * 1_000_000)) };
  }
  if (CRYPTO.has(c)) {
    const price = CRYPTO_PRICES_USD[c];
    if (!price) return null;
    return { num: BigInt(Math.round(price * 1_000_000)), den: 1_000_000n };
  }
  return null;
}

/** USD value of a minor-unit amount, as a rational. */
export function usdValue(minor, code) {
  const decimals = ASSET_DECIMALS[String(code).toUpperCase()] ?? 2;
  const rate = usdPerUnit(code);
  if (!rate) return null;
  return {
    num: BigInt(minor) * rate.num,
    den: rate.den * 10n ** BigInt(decimals)
  };
}

/** Mid rate: how many `to` units for one `from` unit, as a rational. */
export function midRate(from, to) {
  const a = usdPerUnit(from);
  const b = usdPerUnit(to);
  if (!a || !b) return null;
  return { num: a.num * b.den, den: a.den * b.num };
}

/**
 * Convert a minor-unit amount exactly.
 * @returns {{ minor: bigint, decimals: number, currency: string }}
 */
export function convert(amountMinor, from, to) {
  const df = ASSET_DECIMALS[String(from).toUpperCase()] ?? 2;
  const dt = ASSET_DECIMALS[String(to).toUpperCase()] ?? 2;
  const rate = midRate(from, to);
  if (!rate) throw Object.assign(new Error(`No FX path from ${from} to ${to}`), { status: 400 });
  // amount * rate * 10^dt / 10^df
  const numerator = rate.num * 10n ** BigInt(dt);
  const denominator = rate.den * 10n ** BigInt(df);
  return {
    minor: multiply(amountMinor, numerator, denominator),
    decimals: dt,
    currency: String(to).toUpperCase()
  };
}

/** Human-readable mid rate, e.g. "1 USDC = 4.42 MYR". */
export function formatRate(from, to) {
  const rate = midRate(from, to);
  if (!rate) return 'n/a';
  const value = Number(rate.num) / Number(rate.den);
  const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return `1 ${from} = ${value.toFixed(digits)} ${to}`;
}

export function rateNumber(from, to) {
  const rate = midRate(from, to);
  if (!rate) return null;
  return Number(rate.num) / Number(rate.den);
}

/** Inverse rate, useful for "you receive" summaries. */
export function inverseRateNumber(from, to) {
  const r = rateNumber(from, to);
  return r ? 1 / r : null;
}

/**
 * Build a fully-described quote.
 *
 * @param {object} p
 * @param {string} p.from            source asset code
 * @param {string} p.to              destination asset code
 * @param {bigint} p.amountMinor     amount the user sends, in `from` minor units
 * @param {number} p.providerFeeBps  provider percentage fee in bps
 * @param {number} p.providerFeeFixed provider fixed fee in minor units of `from`
 * @param {number} p.spreadBps       provider FX spread in bps (applied to rate)
 * @param {number} p.networkFeeMinor network/gas fee in minor units of `from`
 * @param {number} p.slippageBps     expected slippage in bps
 * @param {string} p.provider        provider id/name
 * @param {string} p.route           route label
 * @param {string[]} p.universe      comparison universe (for honesty about "best")
 */
export function buildQuote({
  from,
  to,
  amountMinor,
  providerFeeBps = 0,
  providerFeeFixed = 0,
  spreadBps = 0,
  networkFeeMinor = 0,
  slippageBps = 0,
  provider = 'unknown',
  route = 'direct',
  universe = []
}) {
  const amount = BigInt(amountMinor);
  const decimals = ASSET_DECIMALS[from] ?? 2;

  // Provider fee.
  const pctFee = multiply(amount, BigInt(Math.round(providerFeeBps)), 10_000n);
  const fixedFee = BigInt(Math.round(providerFeeFixed));
  const providerFee = pctFee + fixedFee;
  const networkFee = BigInt(Math.round(networkFeeMinor));

  // Gross amount that actually gets converted.
  const convertAmount = amount - providerFee - networkFee;
  if (convertAmount <= 0n) {
    throw Object.assign(new Error('Fees exceed the send amount. Increase the amount and try again.'), { status: 400 });
  }

  // Apply the FX spread by shrinking the mid rate.
  const mid = midRate(from, to);
  if (!mid) throw Object.assign(new Error(`No FX path from ${from} to ${to}`), { status: 400 });

  const dt = ASSET_DECIMALS[to] ?? 2;
  const spreadFactorNum = BigInt(10_000 - Math.round(spreadBps));
  const numerator = mid.num * spreadFactorNum * 10n ** BigInt(dt);
  const denominator = mid.den * 10_000n * 10n ** BigInt(decimals);

  const grossTarget = multiply(convertAmount, numerator, denominator);
  const slippage = multiply(grossTarget, BigInt(Math.round(slippageBps)), 10_000n);
  const receive = grossTarget - slippage;

  const midNumber = Number(mid.num) / Number(mid.den);
  const providerRate = Number(numerator) / Number(denominator);

  // Effective rate: units received per unit sent, fees included.
  const sentUnits = Number(fromMinor(amount, decimals));
  const receivedUnits = Number(fromMinor(receive, dt));
  const effectiveRate = sentUnits > 0 ? receivedUnits / sentUnits : 0;

  const totalCostMinor = providerFee + networkFee;
  return {
    id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    from,
    to,
    amountMinor: amount.toString(),
    amountDecimals: decimals,
    receiveMinor: receive.toString(),
    receiveDecimals: dt,
    providerFeeMinor: providerFee.toString(),
    providerFeeBps,
    providerFeeFixed,
    networkFeeMinor: networkFee.toString(),
    slippageBps,
    slippageMinor: slippage.toString(),
    spreadBps,
    totalCostMinor: totalCostMinor.toString(),
    midRate: midNumber,
    providerRate,
    effectiveRate,
    effectiveCostBps: ratioBps(totalCostMinor, amount),
    provider,
    route,
    universe,
    comparedAt: new Date().toISOString(),
    /** Honest framing (prompt §33): exactly what was compared, and when. */
    comparison: {
      universe,
      midRateSource: 'sandbox reference snapshot',
      note: 'Mid-market reference is a sandbox snapshot, not a live institutional feed.'
    }
  };
}

/** Standard gas estimates, in the source asset's minor units. */
export const NETWORK_FEE_MINOR = {
  'ethereum:USDC': '3200000',   // ~$3.20 in USDC (6dp)
  'ethereum:ETH': '3200000000000000',
  'base:USDC': '12000',         // ~$0.012
  'base:ETH': '12000000000000',
  'arbitrum:USDC': '40000',
  'optimism:USDC': '35000',
  'polygon:USDC': '9000',
  'solana:USDC': '1200',
  'solana:SOL': '1800000'
};

export function networkFeeFor(chain, asset) {
  const key = `${chain}:${asset}`;
  if (NETWORK_FEE_MINOR[key]) return NETWORK_FEE_MINOR[key];
  if (chain === 'bitcoin') return '180000';
  return '0';
}

export const CHAINS = {
  ethereum: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', confirmSeconds: 45, bridgeRisk: 'medium', l2: false, explorer: 'https://etherscan.io' },
  base: { id: 'base', name: 'Base', symbol: 'ETH', confirmSeconds: 3, bridgeRisk: 'low', l2: true, explorer: 'https://basescan.org' },
  arbitrum: { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', confirmSeconds: 3, bridgeRisk: 'low', l2: true, explorer: 'https://arbiscan.io' },
  optimism: { id: 'optimism', name: 'Optimism', symbol: 'ETH', confirmSeconds: 3, bridgeRisk: 'low', l2: true, explorer: 'https://optimistic.etherscan.io' },
  polygon: { id: 'polygon', name: 'Polygon', symbol: 'MATIC', confirmSeconds: 4, bridgeRisk: 'low', l2: true, explorer: 'https://polygonscan.com' },
  solana: { id: 'solana', name: 'Solana', symbol: 'SOL', confirmSeconds: 2, bridgeRisk: 'low', l2: false, explorer: 'https://solscan.io' },
  bitcoin: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', confirmSeconds: 600, bridgeRisk: 'medium', l2: false, explorer: 'https://mempool.space' },
  bnb: { id: 'bnb', name: 'BNB Chain', symbol: 'BNB', confirmSeconds: 4, bridgeRisk: 'medium', l2: false, explorer: 'https://bscscan.com' }
};

export const CHAIN_LIST = Object.values(CHAINS);

/** Stablecoin risk classification — never assume all stablecoins are equivalent. */
export const STABLECOIN_PROFILES = {
  USDC: { issuer: 'Circle', backing: 'Cash + short-dated US Treasuries', attestation: 'Monthly', risk: 'low', regulated: true },
  USDT: { issuer: 'Tether', backing: 'Mixed reserves', attestation: 'Quarterly', risk: 'medium', regulated: 'partial' },
  DAI: { issuer: 'Sky (MakerDAO)', backing: 'Crypto-collateralised', attestation: 'On-chain', risk: 'medium', regulated: false }
};
