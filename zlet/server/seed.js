/**
 * Zlet — demo account seed.
 *
 * Seeds the minimum needed to make the product explorable. Every seeded record is
 * explicitly marked `sandbox: true` and carries a `syncedAt` timestamp so the UI
 * can never present demo data as a live provider balance.
 *
 * The seeded numbers match the reference design: five asset groups, a RM
 * transaction feed and DeFi positions.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { config } from './config.js';

const minutesAgo = (n) => new Date(Date.now() - n * 60_000).toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

const balance = ({
  providerId, providerName, kind, asset, minor, decimals, state, country,
  chain = null, label = null, estimated = false, positionType = null, apy = null, protocol = null
}) => ({
  id: `bal_${crypto.randomUUID()}`,
  providerId,
  providerName,
  kind,
  asset,
  minor: String(minor),
  decimals,
  state,
  country,
  chain,
  label: label || `${asset}${chain ? ` — ${chain}` : ''}`,
  estimated,
  positionType,
  apy,
  protocol,
  syncedAt: minutesAgo(2),
  sandbox: true
});

export function seedDemoAccount() {
  if (!config.demoAccountEnabled) return false;
  if (store.state.connections.length > 0) return false;

  store.state.profile = {
    ...store.state.profile,
    name: 'Shoeb Tahseen',
    homeCountry: 'MY',
    visitingCountry: 'BD',
    travelActive: true,
    homeCurrency: 'MYR',
    currency: 'USD',
    kyc: 'verified',
    biometric: true
  };

  store.state.connections = [
    { id: 'con_tng', providerId: 'tng-ewallet', status: 'connected', country: 'MY', connectedAt: daysAgo(120), sandbox: true },
    { id: 'con_boost', providerId: 'boost-wallet', status: 'connected', country: 'MY', connectedAt: daysAgo(90), sandbox: true },
    { id: 'con_grab', providerId: 'grabpay', status: 'connected', country: 'MY', connectedAt: daysAgo(64), sandbox: true },
    { id: 'con_bkash', providerId: 'bkash', status: 'connected', country: 'BD', connectedAt: daysAgo(40), sandbox: true },
    { id: 'con_wc', providerId: 'walletconnect', status: 'connected', country: 'MY', connectedAt: daysAgo(30), sandbox: true },
    { id: 'con_circle', providerId: 'circle-usdc', status: 'connected', country: 'MY', connectedAt: daysAgo(28), sandbox: true },
    { id: 'con_aave', providerId: 'aave', status: 'connected', country: 'MY', connectedAt: daysAgo(21), sandbox: true },
    { id: 'con_lido', providerId: 'lido', status: 'connected', country: 'MY', connectedAt: daysAgo(18), sandbox: true },
    { id: 'con_gpay', providerId: 'google-pay', status: 'linked', country: 'MY', connectedAt: daysAgo(15), sandbox: true, aggregatable: false },
    { id: 'con_wise', providerId: 'wise', status: 'connected', country: 'MY', connectedAt: daysAgo(12), sandbox: true },
    { id: 'con_luno', providerId: 'luno', status: 'connected', country: 'MY', connectedAt: daysAgo(26), sandbox: true }
  ];

  store.state.balances = [
    // Mobile wallets — RM 4,320.00 spendable
    balance({ providerId: 'tng-ewallet', providerName: "Touch 'n Go eWallet", kind: 'mfs', asset: 'MYR', minor: 268_000, decimals: 2, state: 'spendable', country: 'MY' }),
    balance({ providerId: 'boost-wallet', providerName: 'Boost Wallet', kind: 'mfs', asset: 'MYR', minor: 164_000, decimals: 2, state: 'spendable', country: 'MY' }),

    // Payment apps — RM 2,180.50
    balance({ providerId: 'grabpay', providerName: 'GrabPay', kind: 'payment-wallet', asset: 'MYR', minor: 138_050, decimals: 2, state: 'spendable', country: 'MY' }),
    balance({ providerId: 'bkash', providerName: 'bKash', kind: 'mfs', asset: 'BDT', minor: 80_000, decimals: 2, state: 'transferable', country: 'BD' }),

    // Crypto — $8,240.30
    balance({ providerId: 'circle-usdc', providerName: 'Circle USDC', kind: 'stablecoin', asset: 'USDC', minor: 4_120_500_000n, decimals: 6, state: 'spendable', country: 'MY', chain: 'base' }),
    balance({ providerId: 'walletconnect', providerName: 'WalletConnect', kind: 'crypto-wallet', asset: 'ETH', minor: 900_000_000_000_000_000n, decimals: 18, state: 'transferable', country: 'MY', chain: 'ethereum', estimated: true }),
    balance({ providerId: 'walletconnect', providerName: 'WalletConnect', kind: 'crypto-wallet', asset: 'BTC', minor: 12_500_000n, decimals: 8, state: 'transferable', country: 'MY', chain: 'bitcoin', estimated: true }),

    // Pending
    balance({ providerId: 'wise', providerName: 'Wise', kind: 'remittance', asset: 'MYR', minor: 41_200, decimals: 2, state: 'pending', country: 'MY' }),

    // Restricted
    balance({ providerId: 'boost-wallet', providerName: 'Boost Wallet', kind: 'mfs', asset: 'MYR', minor: 25_000, decimals: 2, state: 'restricted', country: 'MY', label: 'MYR — loyalty balance' })
  ];

  store.state.positions = [
    {
      id: `pos_${crypto.randomUUID()}`,
      providerId: 'aave',
      providerName: 'Aave',
      protocol: 'Aave',
      kind: 'defi',
      asset: 'USDC',
      minor: String(2_000_000_000n),
      decimals: 6,
      state: 'invested',
      positionType: 'supply',
      apy: 4.8,
      chain: 'base',
      country: 'MY',
      label: 'USDC — Base',
      estimated: true,
      syncedAt: minutesAgo(2),
      sandbox: true
    },
    {
      id: `pos_${crypto.randomUUID()}`,
      providerId: 'lido',
      providerName: 'Lido',
      protocol: 'Lido',
      kind: 'defi',
      asset: 'ETH',
      minor: String(300_000_000_000_000_000n),
      decimals: 18,
      state: 'invested',
      positionType: 'stake',
      apy: 3.2,
      chain: 'ethereum',
      country: 'MY',
      label: 'ETH — Ethereum',
      estimated: true,
      syncedAt: minutesAgo(2),
      sandbox: true
    },
    {
      id: `pos_${crypto.randomUUID()}`,
      providerId: 'aerodrome',
      providerName: 'Aerodrome',
      protocol: 'Aerodrome',
      kind: 'dex',
      asset: 'USDC',
      minor: String(500_000_000n),
      decimals: 6,
      state: 'invested',
      positionType: 'deposit',
      apy: 12.4,
      chain: 'base',
      country: 'MY',
      label: 'USDC/ETH LP — Base',
      estimated: true,
      syncedAt: minutesAgo(2),
      sandbox: true
    }
  ];

  store.state.recipients = [
    { id: 'rcp_john', name: 'John Tan', handle: 'john@varizen.co', country: 'MY', rail: 'grabpay', trusted: true, addedAt: daysAgo(60) },
    { id: 'rcp_rakib', name: 'Rakib Hasan', handle: '+8801700000000', country: 'BD', rail: 'bkash', trusted: true, addedAt: daysAgo(35) },
    { id: 'rcp_mother', name: 'Mother', handle: '+60123456789', country: 'MY', rail: 'tng-ewallet', trusted: true, addedAt: daysAgo(200) }
  ];

  store.state.subscriptions = [
    { id: 'sub_spotify', merchant: 'Spotify', amount: '19.90', amountMinor: '1990', asset: 'MYR', frequency: 'monthly', source: 'grabpay', nextPaymentAt: new Date(Date.now() + 9 * 86_400_000).toISOString(), createdAt: daysAgo(300), detectedFrom: 'provider-history' },
    { id: 'sub_icloud', merchant: 'iCloud+', amount: '11.90', amountMinor: '1190', asset: 'MYR', frequency: 'monthly', source: 'tng-ewallet', nextPaymentAt: new Date(Date.now() + 3 * 86_400_000).toISOString(), createdAt: daysAgo(400), detectedFrom: 'provider-history' }
  ];

  /* --------------------------- activity feed --------------------------- */
  const tx = (overrides) => ({
    id: `tx_${crypto.randomUUID()}`,
    state: 'CONFIRMED',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    settledAt: daysAgo(1),
    amountDecimals: 2,
    timeline: [],
    ...overrides
  });

  store.state.transactions = [
    tx({
      type: 'pay', typeLabel: 'Payment', amount: '120.00', amountMinor: '12000', asset: 'MYR',
      providerId: 'grabpay', providerName: 'GrabPay', recipient: 'Paid Merchant',
      routeLabel: 'QR → DuitNow', countryCode: 'MY', createdAt: minutesAgo(48), updatedAt: minutesAgo(46),
      memo: 'Merchant QR payment', providerReference: 'prov_8f21ac40e1'
    }),
    tx({
      type: 'receive', typeLabel: 'Received', amount: '500.00', amountMinor: '500000000', asset: 'USDC',
      amountDecimals: 6, receiveMinor: '500000000', receiveAsset: 'USDC',
      providerId: 'circle-usdc', providerName: 'Circle USDC', recipient: 'From Sarah K.',
      routeLabel: 'USDC — Base', countryCode: 'MY', createdAt: minutesAgo(72), updatedAt: minutesAgo(70)
    }),
    tx({
      type: 'convert', typeLabel: 'Swapped', amount: '1.25', amountMinor: '1250000000000000000',
      amountDecimals: 18, asset: 'ETH', receiveMinor: '3825000000', receiveAsset: 'USDC',
      providerId: 'uniswap', providerName: 'Uniswap (Base)', routeLabel: 'ETH → USDC',
      countryCode: 'MY', createdAt: daysAgo(1), updatedAt: daysAgo(1)
    }),
    tx({
      type: 'send', typeLabel: 'MFS transfer', amount: '300.00', amountMinor: '30000', asset: 'MYR',
      providerId: 'tng-ewallet', providerName: "Touch 'n Go eWallet", recipient: 'Mother',
      routeLabel: 'MFS → MY', countryCode: 'MY', createdAt: daysAgo(1), updatedAt: daysAgo(1)
    }),
    tx({
      type: 'defi', typeLabel: 'DeFi deposit', amount: '2.00', amountMinor: '2000000000000000000',
      amountDecimals: 18, asset: 'ETH', providerId: 'aave', providerName: 'Aave (Base)',
      routeLabel: 'Supply ETH', countryCode: 'MY', createdAt: daysAgo(2), updatedAt: daysAgo(2)
    }),
    tx({
      type: 'pay', typeLabel: 'Card payment', amount: '80.00', amountMinor: '8000', asset: 'MYR',
      providerId: 'grabpay', providerName: 'GrabPay', recipient: 'Card payment',
      routeLabel: 'Tokenised card', countryCode: 'MY', createdAt: daysAgo(4), updatedAt: daysAgo(4)
    }),
    tx({
      type: 'send', typeLabel: 'Send', amount: '200.00', amountMinor: '20000', asset: 'MYR',
      providerId: 'wise', providerName: 'Wise', recipient: 'Rakib Hasan', routeLabel: 'Remittance → BD',
      countryCode: 'BD', state: 'PROCESSING', createdAt: minutesAgo(6), updatedAt: minutesAgo(4),
      etaMinutes: [5, 240]
    })
  ];

  store.state.invoices = [
    {
      id: 'inv_seed_1', kind: 'invoice', reference: 'ZLET-2026-A31C', status: 'open',
      createdAt: daysAgo(3), amount: '450.00', amountMinor: '45000', decimals: 2, asset: 'MYR',
      customer: 'Halden Capital', description: 'Design retainer — October', dueDate: daysAgo(-11),
      expiresAt: null, countryCode: 'MY',
      rails: [{ id: 'grabpay', name: 'GrabPay', methods: ['payment-wallet', 'qr'] }],
      payload: 'zlet://invoice/ZLET-2026-A31C?amount=450.00&asset=MYR&country=MY',
      link: '/pay/ZLET-2026-A31C', createdBy: 'user'
    }
  ];

  store.state.approvedContracts = [
    { id: 'ac_uniswap_base', providerId: 'uniswap', chain: 'base', address: '0x2626664c2603336E57B271c5C0b26F421741e481', label: 'Uniswap SwapRouter02 (Base)', verified: true, approvedAt: daysAgo(20) },
    { id: 'ac_aave_base', providerId: 'aave', chain: 'base', address: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', label: 'Aave Pool (Base)', verified: true, approvedAt: daysAgo(19) }
  ];

  store.state.settings.lastSyncAt = minutesAgo(2);
  store.state.activityLog = [
    { id: `log_${crypto.randomUUID()}`, at: minutesAgo(2), type: 'AI_COMPARED_ROUTES', message: 'Compared 7 payment routes for a RM500 transfer', actor: 'ai', severity: 'info', refs: {}, detail: null },
    { id: `log_${crypto.randomUUID()}`, at: minutesAgo(2), type: 'PROVIDER_SYNC', message: 'Synchronised 10 connected providers', actor: 'system', severity: 'info', refs: {}, detail: null },
    { id: `log_${crypto.randomUUID()}`, at: minutesAgo(48), type: 'TX_CONFIRMED', message: 'Payment confirmed via GrabPay', actor: 'system', severity: 'info', refs: {}, detail: null }
  ];

  store.persist();
  return true;
}

export default seedDemoAccount;
