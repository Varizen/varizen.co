/**
 * Zlet — provider adapters (prompt §7, §8, §9, §39, §64, §65).
 *
 * Every provider is an adapter that ADVERTISES what it can do. The router never
 * assumes a provider supports an operation; it asks the capability set.
 *
 * Non-negotiables encoded here:
 *  - No raw card numbers, CVV or seed phrases exist anywhere in the model.
 *  - Wallet ecosystems (Apple/Google/Samsung) are integrated at the *platform
 *    boundary*: Zlet can present them and orchestrate a payment, but it never
 *    extracts or clones credentials. `aggregatable: false` means "we cannot read
 *    a balance from this provider" — and therefore we never display one.
 *  - A provider's availability is jurisdiction-scoped (see countries.js).
 */

import { featureAvailability } from './countries.js';

export const CAPABILITY = {
  PAY: 'PAY',
  SEND: 'SEND',
  RECEIVE: 'RECEIVE',
  EXCHANGE: 'EXCHANGE',
  SWAP: 'SWAP',
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  STAKE: 'STAKE',
  BORROW: 'BORROW',
  LEND: 'LEND',
  STREAM: 'STREAM',
  REQUEST: 'REQUEST',
  QR: 'QR',
  NFC: 'NFC',
  BALANCE: 'BALANCE',
  HISTORY: 'HISTORY',
  BRIDGE: 'BRIDGE',
  LIMITS: 'LIMITS'
};

export const CAPABILITY_LABELS = {
  PAY: 'Pay', SEND: 'Send', RECEIVE: 'Receive', EXCHANGE: 'Exchange', SWAP: 'Swap',
  DEPOSIT: 'Deposit', WITHDRAW: 'Withdraw', STAKE: 'Stake', BORROW: 'Borrow',
  LEND: 'Lend', STREAM: 'Stream', REQUEST: 'Request', QR: 'QR', NFC: 'NFC',
  BALANCE: 'Balance', HISTORY: 'History', BRIDGE: 'Bridge', LIMITS: 'Limits'
};

export const PROVIDER_KIND = {
  PAYMENT_WALLET: 'payment-wallet',
  MOBILE_MONEY: 'mfs',
  CARD_WALLET: 'card-wallet',
  REMITTANCE: 'remittance',
  EXCHANGE: 'exchange',
  CRYPTO_WALLET: 'crypto-wallet',
  STABLECOIN: 'stablecoin',
  DEFI: 'defi',
  DEX: 'dex',
  PAYMENT_NETWORK: 'payment-network'
};

export const KIND_LABELS = {
  'payment-wallet': 'Payment wallet',
  mfs: 'Mobile money',
  'card-wallet': 'Card wallet',
  remittance: 'Remittance',
  exchange: 'Exchange',
  'crypto-wallet': 'Crypto wallet',
  stablecoin: 'Stablecoin',
  defi: 'DeFi protocol',
  dex: 'DEX',
  'payment-network': 'Payment network'
};

/**
 * Fee model: charged on the send amount unless `mode: 'fixed'`.
 * `pctBps` is basis points (35 = 0.35%).
 */
const fee = (pctBps = 0, fixedMinor = 0, currency = 'USD') => ({ pctBps, fixedMinor, currency });

/**
 * The sandbox provider catalog. These are *demo adapters* that mirror the
 * capability shape of real integrations. `sandbox: true` is surfaced in the UI
 * so nobody mistakes demo data for a live provider balance.
 */
export const CATALOG = [
  /* ---------------------------- payment wallets --------------------------- */
  {
    id: 'google-pay',
    name: 'Google Pay',
    kind: PROVIDER_KIND.PAYMENT_WALLET,
    color: '#4285F4',
    glyph: 'GPay',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.NFC, CAPABILITY.LIMITS],
    aggregatable: false,
    balanceNote: 'Credentials stay inside Google Pay tokenisation. Zlet never reads or clones them.',
    rails: ['card-token', 'nfc', 'qr'],
    fee: fee(90, 0),
    etaMinutes: [0, 1],
    settlement: 'instant',
    risk: 'low',
    sandbox: true
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    kind: PROVIDER_KIND.PAYMENT_WALLET,
    color: '#111315',
    glyph: '',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.NFC, CAPABILITY.LIMITS],
    aggregatable: false,
    balanceNote: 'Credentials stay in the Secure Element. Zlet cannot and does not read them.',
    rails: ['card-token', 'nfc', 'qr'],
    fee: fee(90, 0),
    etaMinutes: [0, 1],
    settlement: 'instant',
    risk: 'low',
    sandbox: true
  },
  {
    id: 'samsung-wallet',
    name: 'Samsung Wallet',
    kind: PROVIDER_KIND.PAYMENT_WALLET,
    color: '#1428A0',
    glyph: 'SW',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'IN', 'AU'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.RECEIVE, CAPABILITY.NFC, CAPABILITY.LIMITS],
    aggregatable: false,
    balanceNote: 'Integrated at the platform boundary only.',
    rails: ['card-token', 'nfc'],
    fee: fee(90, 0),
    etaMinutes: [0, 1],
    settlement: 'instant',
    risk: 'low',
    sandbox: true
  },

  /* ------------------------------ mobile money ---------------------------- */
  {
    id: 'tng-ewallet',
    name: "Touch 'n Go eWallet",
    kind: PROVIDER_KIND.MOBILE_MONEY,
    color: '#0A5CD8',
    glyph: 'TnG',
    countries: ['MY'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY, CAPABILITY.REQUEST],
    aggregatable: true,
    rails: ['mfs', 'qr'],
    fee: fee(70, 0),
    etaMinutes: [0, 2],
    settlement: 'instant',
    risk: 'low',
    limitMinor: 2_000_000,
    sandbox: true
  },
  {
    id: 'boost-wallet',
    name: 'Boost Wallet',
    kind: PROVIDER_KIND.MOBILE_MONEY,
    color: '#E4002B',
    glyph: 'BO',
    countries: ['MY'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY],
    aggregatable: true,
    rails: ['mfs', 'qr'],
    fee: fee(80, 0),
    etaMinutes: [0, 3],
    settlement: 'instant',
    risk: 'low',
    limitMinor: 1_500_000,
    sandbox: true
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    kind: PROVIDER_KIND.PAYMENT_WALLET,
    color: '#00B14F',
    glyph: 'GP',
    countries: ['MY', 'SG'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY],
    aggregatable: true,
    rails: ['payment-wallet', 'qr'],
    fee: fee(110, 0),
    etaMinutes: [0, 2],
    settlement: 'instant',
    risk: 'low',
    sandbox: true
  },
  {
    id: 'bkash',
    name: 'bKash',
    kind: PROVIDER_KIND.MOBILE_MONEY,
    color: '#E2136E',
    glyph: 'bK',
    countries: ['BD'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY, CAPABILITY.REQUEST],
    aggregatable: true,
    rails: ['mfs', 'qr'],
    fee: fee(145, 0),
    etaMinutes: [0, 3],
    settlement: 'instant',
    risk: 'low',
    limitMinor: 2_500_000,
    sandbox: true
  },
  {
    id: 'nagad',
    name: 'Nagad',
    kind: PROVIDER_KIND.MOBILE_MONEY,
    color: '#F26522',
    glyph: 'NG',
    countries: ['BD'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY],
    aggregatable: true,
    rails: ['mfs', 'qr'],
    fee: fee(130, 0),
    etaMinutes: [0, 4],
    settlement: 'instant',
    risk: 'low',
    limitMinor: 2_000_000,
    sandbox: true
  },
  {
    id: 'upay',
    name: 'Upay',
    kind: PROVIDER_KIND.MOBILE_MONEY,
    color: '#0F9D58',
    glyph: 'UP',
    countries: ['BD'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.BALANCE, CAPABILITY.HISTORY],
    aggregatable: true,
    rails: ['mfs'],
    fee: fee(120, 0),
    etaMinutes: [0, 5],
    settlement: 'instant',
    risk: 'medium',
    limitMinor: 1_000_000,
    sandbox: true
  },
  {
    id: 'paynow',
    name: 'PayNow',
    kind: PROVIDER_KIND.PAYMENT_NETWORK,
    color: '#7B1FA2',
    glyph: 'PN',
    countries: ['SG'],
    capabilities: [CAPABILITY.PAY, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.QR, CAPABILITY.REQUEST, CAPABILITY.LIMITS],
    aggregatable: false,
    balanceNote: 'PayNow settles bank-to-bank. Balance stays with the linked account provider.',
    rails: ['payment-network', 'qr'],
    fee: fee(0, 0),
    etaMinutes: [0, 1],
    settlement: 'instant',
    risk: 'low',
    sandbox: true
  },

  /* ------------------------------- remittance ----------------------------- */
  {
    id: 'wise',
    name: 'Wise',
    kind: PROVIDER_KIND.REMITTANCE,
    color: '#163300',
    glyph: 'W',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD', 'PK'],
    capabilities: [CAPABILITY.SEND, CAPABILITY.EXCHANGE, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: false,
    balanceNote: 'Multi-currency balances remain at Wise; Zlet stores a reference only.',
    rails: ['remittance', 'bank-settlement'],
    fee: fee(65, 60),
    etaMinutes: [60, 1440],
    settlement: 'same-day',
    risk: 'low',
    /** Wise converts fiat only. It is not a crypto venue. */
    settles: { fiat: ['USD', 'MYR', 'BDT', 'SGD', 'AED', 'GBP', 'EUR', 'INR', 'PKR', 'AUD'], crypto: false },
    sandbox: true
  },
  {
    id: 'western-union',
    name: 'Western Union',
    kind: PROVIDER_KIND.REMITTANCE,
    color: '#FFDD00',
    glyph: 'WU',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD', 'PK'],
    capabilities: [CAPABILITY.SEND, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: false,
    rails: ['remittance', 'cash-pickup'],
    fee: fee(210, 200),
    etaMinutes: [10, 2880],
    settlement: 'same-day',
    risk: 'medium',
    sandbox: true
  },
  {
    id: 'remitly',
    name: 'Remitly',
    kind: PROVIDER_KIND.REMITTANCE,
    color: '#2E7D32',
    glyph: 'RE',
    countries: ['MY', 'SG', 'GB', 'US', 'AU'],
    capabilities: [CAPABILITY.SEND, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: false,
    rails: ['remittance', 'mfs-payout'],
    fee: fee(85, 299),
    etaMinutes: [5, 240],
    settlement: 'minutes',
    risk: 'low',
    sandbox: true
  },

  /* -------------------------------- exchange ------------------------------ */
  {
    id: 'luno',
    name: 'Luno',
    kind: PROVIDER_KIND.EXCHANGE,
    color: '#0B6EFF',
    glyph: 'LU',
    countries: ['MY', 'SG', 'GB', 'DE', 'AU'],
    capabilities: [CAPABILITY.EXCHANGE, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: true,
    balanceNote: 'Exchange balances remain at Luno under your own account.',
    rails: ['exchange', 'fiat-onramp', 'fiat-offramp'],
    fee: fee(95, 40),
    etaMinutes: [2, 30],
    settlement: 'minutes',
    risk: 'low',
    /** A licensed exchange that genuinely settles both legs: crypto ↔ local fiat. */
    settles: { fiat: ['MYR', 'SGD', 'GBP', 'EUR', 'AUD', 'USD'], crypto: true },
    sandbox: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    kind: PROVIDER_KIND.EXCHANGE,
    color: '#0052FF',
    glyph: 'CB',
    countries: ['SG', 'AE', 'GB', 'US', 'DE', 'AU'],
    capabilities: [CAPABILITY.EXCHANGE, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: false,
    balanceNote: 'Custodial venue balances stay at Coinbase under your own account.',
    rails: ['exchange', 'onchain'],
    fee: fee(140, 0),
    etaMinutes: [1, 5],
    settlement: 'minutes',
    risk: 'low',
    /** Coinbase does not offer MYR or BDT fiat pairs. */
    settles: { fiat: ['USD', 'EUR', 'GBP', 'SGD', 'AUD', 'AED'], crypto: true },
    sandbox: true
  },
  {
    id: 'kraken',
    name: 'Kraken',
    kind: PROVIDER_KIND.EXCHANGE,
    color: '#5741D9',
    glyph: 'KR',
    countries: ['SG', 'AE', 'GB', 'US', 'DE', 'AU'],
    capabilities: [CAPABILITY.EXCHANGE, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.LIMITS, CAPABILITY.HISTORY],
    aggregatable: false,
    rails: ['exchange', 'onchain'],
    fee: fee(120, 0),
    etaMinutes: [1, 5],
    settlement: 'minutes',
    risk: 'low',
    settles: { fiat: ['USD', 'EUR', 'GBP', 'AUD'], crypto: true },
    sandbox: true
  },

  /* ------------------------------ crypto wallets -------------------------- */
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    kind: PROVIDER_KIND.CRYPTO_WALLET,
    color: '#3B99FC',
    glyph: 'WC',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD'],
    capabilities: [CAPABILITY.SWAP, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW, CAPABILITY.STAKE, CAPABILITY.LEND, CAPABILITY.BALANCE, CAPABILITY.HISTORY, CAPABILITY.BRIDGE],
    aggregatable: true,
    nonCustodial: true,
    rails: ['walletconnect', 'onchain'],
    fee: fee(0, 0),
    etaMinutes: [0, 2],
    settlement: 'chain',
    risk: 'medium',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'bnb', 'solana'],
    sandbox: true
  },
  {
    id: 'ledger',
    name: 'Ledger (hardware)',
    kind: PROVIDER_KIND.CRYPTO_WALLET,
    color: '#1A1A1A',
    glyph: 'LD',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD'],
    capabilities: [CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.BALANCE, CAPABILITY.SWAP, CAPABILITY.STAKE],
    aggregatable: true,
    nonCustodial: true,
    hardware: true,
    rails: ['hardware-wallet', 'onchain'],
    fee: fee(0, 0),
    etaMinutes: [1, 5],
    settlement: 'chain',
    risk: 'low',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'bnb', 'solana', 'bitcoin'],
    sandbox: true
  },
  {
    id: 'phantom',
    name: 'Phantom',
    kind: PROVIDER_KIND.CRYPTO_WALLET,
    color: '#AB9FF2',
    glyph: 'PH',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD'],
    capabilities: [CAPABILITY.SWAP, CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.BALANCE, CAPABILITY.STAKE],
    aggregatable: true,
    nonCustodial: true,
    rails: ['wallet', 'onchain'],
    fee: fee(0, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['solana', 'ethereum', 'polygon', 'base'],
    sandbox: true
  },

  /* ------------------------------- stablecoin ----------------------------- */
  {
    id: 'circle-usdc',
    name: 'Circle USDC',
    kind: PROVIDER_KIND.STABLECOIN,
    color: '#2775CA',
    glyph: 'USDC',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN', 'BD'],
    capabilities: [CAPABILITY.SEND, CAPABILITY.RECEIVE, CAPABILITY.SWAP, CAPABILITY.WITHDRAW, CAPABILITY.BALANCE, CAPABILITY.HISTORY],
    aggregatable: true,
    nonCustodial: true,
    rails: ['stablecoin', 'onchain'],
    fee: fee(0, 12),
    etaMinutes: [0, 2],
    settlement: 'chain',
    risk: 'low',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'solana'],
    stablecoin: 'USDC',
    sandbox: true
  },

  /* ---------------------------------- DEX --------------------------------- */
  {
    id: 'uniswap',
    name: 'Uniswap',
    kind: PROVIDER_KIND.DEX,
    color: '#FF007A',
    glyph: 'UN',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.SWAP, CAPABILITY.LEND, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW],
    aggregatable: false,
    nonCustodial: true,
    rails: ['onchain', 'dex'],
    fee: fee(30, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon'],
    tvl: 3_800_000_000,
    audited: true,
    age: 'since 2018',
    sandbox: true
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: PROVIDER_KIND.DEX,
    color: '#19FB9B',
    glyph: 'JU',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.SWAP],
    aggregatable: false,
    nonCustodial: true,
    rails: ['onchain', 'dex-aggregator'],
    fee: fee(20, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['solana'],
    tvl: 1_200_000_000,
    audited: true,
    age: 'since 2021',
    sandbox: true
  },
  {
    id: 'aerodrome',
    name: 'Aerodrome',
    kind: PROVIDER_KIND.DEX,
    color: '#0052FF',
    glyph: 'AE',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.SWAP, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW, CAPABILITY.STAKE],
    aggregatable: false,
    nonCustodial: true,
    rails: ['onchain', 'dex'],
    fee: fee(25, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['base'],
    tvl: 620_000_000,
    audited: true,
    age: 'since 2023',
    sandbox: true
  },

  /* --------------------------------- lending ------------------------------ */
  {
    id: 'aave',
    name: 'Aave',
    kind: PROVIDER_KIND.DEFI,
    color: '#B6509E',
    glyph: 'AA',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.LEND, CAPABILITY.BORROW, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW, CAPABILITY.BALANCE],
    aggregatable: true,
    nonCustodial: true,
    rails: ['onchain', 'lending'],
    fee: fee(0, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['ethereum', 'base', 'arbitrum', 'optimism', 'polygon'],
    tvl: 11_400_000_000,
    audited: true,
    age: 'since 2020',
    oracle: 'Chainlink',
    sandbox: true
  },
  {
    id: 'lido',
    name: 'Lido',
    kind: PROVIDER_KIND.DEFI,
    color: '#00A3FF',
    glyph: 'LI',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.STAKE, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW, CAPABILITY.BALANCE],
    aggregatable: true,
    nonCustodial: true,
    rails: ['onchain', 'staking'],
    fee: fee(0, 0),
    etaMinutes: [0, 2],
    settlement: 'chain',
    risk: 'medium',
    chains: ['ethereum'],
    tvl: 24_100_000_000,
    audited: true,
    age: 'since 2020',
    oracle: 'Chainlink',
    sandbox: true
  },
  {
    id: 'curve',
    name: 'Curve',
    kind: PROVIDER_KIND.DEFI,
    color: '#F5AC37',
    glyph: 'CU',
    countries: ['MY', 'SG', 'AE', 'GB', 'US', 'DE', 'AU', 'IN'],
    capabilities: [CAPABILITY.LEND, CAPABILITY.DEPOSIT, CAPABILITY.WITHDRAW, CAPABILITY.SWAP],
    aggregatable: true,
    nonCustodial: true,
    rails: ['onchain', 'liquidity'],
    fee: fee(40, 0),
    etaMinutes: [0, 1],
    settlement: 'chain',
    risk: 'medium',
    chains: ['ethereum', 'arbitrum', 'base', 'optimism', 'polygon'],
    tvl: 2_100_000_000,
    audited: true,
    age: 'since 2020',
    sandbox: true
  }
];

export const CATALOG_BY_ID = new Map(CATALOG.map((p) => [p.id, p]));

export function getProvider(id) {
  return CATALOG_BY_ID.get(id) || null;
}

const FIAT_CODES = new Set(['USD', 'MYR', 'BDT', 'SGD', 'AED', 'GBP', 'EUR', 'INR', 'PKR', 'AUD']);
const STABLE_CODES = new Set(['USDC', 'USDT', 'DAI']);

/**
 * Can this provider actually deliver/accept this asset?
 *
 * This is the guard against fabricated interoperability (prompt §9, §31): a DEX
 * cannot deliver fiat, and Wise cannot deliver crypto. Providers that do not
 * declare `settles` are treated conservatively: on-chain kinds are crypto-only,
 * everything else is fiat-only.
 */
export function supportsAsset(providerOrId, asset) {
  const p = typeof providerOrId === 'string' ? getProvider(providerOrId) : providerOrId;
  if (!p) return false;
  const code = String(asset || '').toUpperCase();
  const isFiat = FIAT_CODES.has(code);
  const isStable = STABLE_CODES.has(code);

  if (p.settles) {
    if (isFiat) return (p.settles.fiat || []).includes(code);
    if (p.settles.crypto) return true;
    return false;
  }

  // Conservative defaults when a provider does not declare settlement support.
  if (isFiat) return p.kind !== 'dex' && p.kind !== 'defi';
  return p.kind === 'dex' || p.kind === 'defi' || Boolean(p.nonCustodial) || isStable;
}

/** Capability check (prompt §64/§65). Never assume support. */
export function can(providerOrId, capability) {
  const p = typeof providerOrId === 'string' ? getProvider(providerOrId) : providerOrId;
  if (!p) return false;
  return (p.capabilities || []).includes(capability);
}

export function capabilitiesOf(providerOrId) {
  const p = typeof providerOrId === 'string' ? getProvider(providerOrId) : providerOrId;
  if (!p) return [];
  return Object.values(CAPABILITY).map((capability) => ({
    capability,
    label: CAPABILITY_LABELS[capability],
    supported: can(p, capability)
  }));
}

/**
 * Providers valid in the account's 2-country scope, filtered by capability.
 * `countryCodes` comes from countries.activeCountryCodes(profile).
 */
export function providersForScope(countryCodes, capability = null) {
  return CATALOG.filter((p) => {
    if (capability && !can(p, capability)) return false;
    return (p.countries || []).some((c) => countryCodes.includes(c));
  });
}

/** Availability decision for a provider in a specific country. */
export function providerAvailability(providerId, countryCode, feature) {
  const p = getProvider(providerId);
  if (!p) return { status: 'not_supported', reason: 'Unknown provider' };
  if (!(p.countries || []).includes(countryCode)) {
    return { status: 'not_supported', reason: `${p.name} is not available in ${countryCode}.` };
  }
  return featureAvailability(countryCode, feature);
}

/** Human-readable capability matrix for the Privacy/Security screens. */
export function capabilityMatrix() {
  return CATALOG.map((p) => ({
    id: p.id,
    name: p.name,
    kind: p.kind,
    kindLabel: KIND_LABELS[p.kind],
    color: p.color,
    countries: p.countries,
    aggregatable: p.aggregatable,
    nonCustodial: Boolean(p.nonCustodial),
    balanceNote: p.balanceNote || null,
    capabilities: p.capabilities
  }));
}
