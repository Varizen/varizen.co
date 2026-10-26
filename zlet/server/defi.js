/**
 * Zlet — DeFi Sandbox (prompt §16, §17, §18, §19, §20, §21, §50, §51).
 *
 * Every DeFi action follows the same path:
 *   simulate  →  risk assessment  →  explicit confirmation  →  submit
 *
 * Simulation always returns *specific* numbers: expected output, gas, price
 * impact, slippage, route, protocol, and the concrete risk reasons. Nothing is
 * executed without a separate confirm step, and the transaction description is
 * never opaque — protocol, contract, function and assets are always shown.
 *
 * Approval safety: exact-amount approvals are the default; unlimited approvals
 * are surfaced as a warning, never silently produced.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { activeCountryCodes, featureAvailability, country as countryMeta, AVAILABILITY } from './countries.js';
import { CAPABILITY, getProvider, providersForScope } from './providers.js';
import { ASSET_DECIMALS, CHAINS, buildQuote, networkFeeFor } from './fx.js';
import { fromMinor, multiply, ratioBps, toMinor } from './money.js';
import { logActivity, sandbox } from './sandbox.js';

/** Sandbox contract registry: verified contracts only. */
export const CONTRACTS = {
  uniswap: {
    ethereum: { address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', verified: true, function: 'exactInputSingle' },
    base: { address: '0x2626664c2603336E57B271c5C0b26F421741e481', verified: true, function: 'exactInputSingle' },
    arbitrum: { address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', verified: true, function: 'exactInputSingle' }
  },
  aave: {
    ethereum: { address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', verified: true, function: 'supply' },
    base: { address: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', verified: true, function: 'supply' },
    arbitrum: { address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD', verified: true, function: 'supply' }
  },
  lido: {
    ethereum: { address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', verified: true, function: 'submit' }
  },
  curve: {
    ethereum: { address: '0xD533a949740bb3306d119CC777fa900bA034cd52', verified: true, function: 'exchange' },
    base: { address: '0x4c5B6C1B7bC2D5a0B4d8C6e1c8F9E3d2A1b0C4f5', verified: true, function: 'exchange' }
  },
  aerodrome: {
    base: { address: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43', verified: true, function: 'swapExactTokensForTokens' }
  }
};

export const DEFI_ACTIONS = {
  swap: { label: 'Swap', capability: CAPABILITY.SWAP, requiresApproval: true },
  supply: { label: 'Supply / Lend', capability: CAPABILITY.LEND, requiresApproval: true },
  borrow: { label: 'Borrow', capability: CAPABILITY.BORROW, requiresApproval: true },
  deposit: { label: 'Deposit liquidity', capability: CAPABILITY.DEPOSIT, requiresApproval: true },
  withdraw: { label: 'Withdraw', capability: CAPABILITY.WITHDRAW, requiresApproval: false },
  stake: { label: 'Stake', capability: CAPABILITY.STAKE, requiresApproval: true }
};

/* ------------------------------------------------------------------ *
 * Risk engine (§19)
 * ------------------------------------------------------------------ */

/**
 * Understandable risk presentation. Audits are NOT proof of safety and the
 * output says so explicitly.
 */
export function assessRisk(providerId, chain, { action = 'swap', amountMinor = 0n } = {}) {
  const p = getProvider(providerId);
  const chainMeta = CHAINS[chain] || null;
  if (!p) return { level: 'unknown', score: null, reasons: ['Unknown protocol'], factors: {} };

  const factors = {
    protocolAge: p.age || 'unknown',
    tvlUsd: p.tvl ?? null,
    auditStatus: p.audited ? 'Audited' : 'Not disclosed',
    contractVerification: CONTRACTS[providerId]?.[chain]?.verified ? 'Verified source' : 'Not verified in registry',
    liquidity: p.tvl > 1_000_000_000 ? 'Deep' : p.tvl > 100_000_000 ? 'Adequate' : p.tvl ? 'Thin' : 'Unknown',
    oracleDependency: p.oracle || 'None / not disclosed',
    smartContractRisk: 'Present — immutable code can still hold bugs',
    counterpartyRisk: p.nonCustodial ? 'None (non-custodial)' : 'Provider counterparty',
    bridgeRisk: chainMeta?.bridgeRisk || 'n/a',
    stablecoinRisk: p.stablecoin ? 'Issuer / redemption risk' : 'n/a',
    governanceRisk: p.kind === 'defi' ? 'Governance can change parameters' : 'n/a',
    networkCongestion: chainMeta && chainMeta.confirmSeconds > 20 ? 'Possible on this chain' : 'Low'
  };

  let score = 0;
  const reasons = [];

  if (p.audited) { score += 1; reasons.push('Protocol has published audits (audits reduce but never eliminate risk).'); }
  else { score += 3; reasons.push('No audit disclosed for this protocol.'); }

  if ((p.tvl ?? 0) > 1_000_000_000) { score += 0; reasons.push('High liquidity — large TVL reduces slippage and exit risk.'); }
  else if ((p.tvl ?? 0) > 100_000_000) { score += 1; reasons.push('Moderate liquidity.'); }
  else { score += 2; reasons.push('Low or unknown liquidity — exit may be costly.'); }

  if (factors.contractVerification !== 'Verified source') { score += 2; reasons.push('Contract is not in the verified registry.'); }
  else reasons.push('Contract address matches the verified registry entry.');

  if (chainMeta?.bridgeRisk === 'medium') { score += 1; reasons.push('Bridge exposure is part of this chain’s security model.'); }

  score += 2; // smart-contract risk always present
  reasons.push('Smart-contract risk is always present, even for audited protocols.');

  if (action === 'borrow') { score += 2; reasons.push('Borrowing introduces liquidation risk if collateral value falls.'); }
  if (action === 'stake') { score += 1; reasons.push('Staking may include an unbonding delay before withdrawal.'); }

  const level = score <= 3 ? 'low' : score <= 6 ? 'medium' : 'high';
  return {
    level,
    score,
    reasons,
    factors,
    disclaimer: 'Risk level is a sandbox heuristic based on disclosed factors. It is not an audit, rating or advice.'
  };
}

/* ------------------------------------------------------------------ *
 * Simulation (§18, §51)
 * ------------------------------------------------------------------ */

export function simulate({ providerId, action = 'swap', chain = 'base', from, to, amount, slippageBps = 50 }) {
  const profile = store.state.profile;
  const p = getProvider(providerId);
  if (!p) throw Object.assign(new Error('Unknown protocol.'), { status: 404 });

  const spec = DEFI_ACTIONS[action];
  if (!spec) throw Object.assign(new Error(`Unknown DeFi action “${action}”.`), { status: 400 });
  if (!(p.capabilities || []).includes(spec.capability)) {
    throw Object.assign(new Error(`${p.name} does not advertise the ${spec.label} capability.`), { status: 400 });
  }

  const scope = activeCountryCodes(profile);
  const countryCode = p.countries.find((c) => scope.includes(c));
  if (!countryCode) {
    throw Object.assign(
      new Error(`${p.name} is not available inside your home + visiting country scope.`),
      { status: 403, code: 'OUT_OF_SCOPE' }
    );
  }
  const availability = featureAvailability(countryCode, 'defi');
  if (availability.status === AVAILABILITY.NOT_SUPPORTED) {
    throw Object.assign(new Error(availability.reason), { status: 403, code: 'JURISDICTION_BLOCKED' });
  }

  const chainSupported = (p.chains || []).includes(chain);
  if (!chainSupported) {
    throw Object.assign(
      new Error(`${p.name} is not deployed on ${CHAINS[chain]?.name || chain}. Supported: ${(p.chains || []).join(', ')}.`),
      { status: 400, code: 'CHAIN_UNSUPPORTED' }
    );
  }

  const fromAsset = from || (action === 'stake' ? 'ETH' : 'USDC');
  const toAsset = to || (action === 'stake' ? 'stETH' : fromAsset === 'USDC' ? 'ETH' : 'USDC');
  const decimals = ASSET_DECIMALS[fromAsset] ?? 6;
  const amountMinor = toMinor(amount, decimals);
  if (amountMinor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });

  const networkFee = networkFeeFor(chain, fromAsset === 'USDC' ? 'USDC' : 'ETH');
  const priceImpactBps = impactFor(amountMinor, decimals, p.tvl);

  const quote = buildQuote({
    from: fromAsset,
    to: toAsset,
    amountMinor,
    providerFeeBps: p.fee?.pctBps ?? 0,
    providerFeeFixed: p.fee?.fixedMinor ?? 0,
    spreadBps: 8,
    slippageBps,
    networkFeeMinor: networkFee,
    provider: `${p.name} (${CHAINS[chain]?.name || chain})`,
    route: `${fromAsset} → ${toAsset}`,
    universe: ['DeFi sandbox']
  });

  const contract = CONTRACTS[providerId]?.[chain] || null;
  const risk = assessRisk(providerId, chain, { action, amountMinor });

  const warnings = [];
  if (!contract?.verified) warnings.push('Contract is not in the verified registry. Zlet Guard blocks unknown contracts by default.');
  if (priceImpactBps > 100) warnings.push(`Price impact is ${(priceImpactBps / 100).toFixed(2)}% — consider splitting the trade.`);
  if (slippageBps > 100) warnings.push(`Slippage tolerance of ${(slippageBps / 100).toFixed(2)}% is high.`);
  if (chain === 'ethereum' && BigInt(networkFee) > 1_000_000n) warnings.push('Ethereum L1 gas is significant relative to the trade size.');
  if (action === 'borrow') warnings.push('A liquidation threshold applies. Monitor your health factor.');

  const approval = spec.requiresApproval
    ? {
        required: true,
        token: fromAsset,
        spender: contract?.address || null,
        /** Exact-amount approval by default (§50). */
        amount: String(amountMinor),
        exact: true,
        warning: null
      }
    : { required: false };

  const simulation = {
    id: `sim_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    action,
    actionLabel: spec.label,
    protocol: { id: p.id, name: p.name, kind: p.kind },
    chain: { id: chain, name: CHAINS[chain]?.name || chain, confirmSeconds: CHAINS[chain]?.confirmSeconds ?? null },
    contract: contract
      ? { address: contract.address, function: contract.function, verified: contract.verified }
      : { address: null, function: spec.label, verified: false },
    input: { asset: fromAsset, amountMinor: String(amountMinor), decimals },
    expectedOutput: { asset: toAsset, amountMinor: quote.receiveMinor, decimals: quote.receiveDecimals },
    gas: { asset: fromAsset === 'USDC' ? 'USDC' : 'ETH', amountMinor: networkFee },
    priceImpactBps,
    slippageBps,
    route: `${fromAsset} → ${toAsset}`,
    risk,
    warnings,
    approval,
    quote,
    countryCode,
    availability,
    /** Human-readable description — never an opaque blob (§51). */
    description: [
      `${spec.label} ${fromMinor(amountMinor, decimals)} ${fromAsset}`,
      `on ${p.name} (${CHAINS[chain]?.name || chain})`,
      `→ expected ${fromMinor(BigInt(quote.receiveMinor), quote.receiveDecimals)} ${toAsset}`
    ].join(' '),
    executable: Boolean(contract?.verified) || action === 'withdraw'
  };

  store.state.quotes.unshift({ ...simulation, quoteType: 'defi-simulation' });
  if (store.state.quotes.length > 120) store.state.quotes.length = 120;
  store.persist();

  logActivity('DEFI_SIMULATED', `Simulated ${spec.label} ${fromMinor(amountMinor, decimals)} ${fromAsset} on ${p.name}`, {
    refs: { simulationId: simulation.id, protocol: p.id, chain }
  });

  return simulation;
}

/** Simple price-impact model: impact grows with size relative to TVL. */
function impactFor(amountMinor, decimals, tvl) {
  if (!tvl) return 150;
  const usd = Number(fromMinor(amountMinor, decimals));
  const ratio = usd / tvl;
  // 10 bps at 0.01% of TVL, growing superlinearly.
  return Math.min(500, Math.round(Math.sqrt(ratio * 1_000_000) * 3));
}

/* ------------------------------------------------------------------ *
 * DeFi positions (§16)
 * ------------------------------------------------------------------ */

export function defiPositions(profile = store.state.profile) {
  const scope = activeCountryCodes(profile);
  return store.state.positions
    .filter((p) => !p.country || scope.includes(p.country))
    .map((p) => {
      const provider = getProvider(p.providerId);
      return {
        ...p,
        protocolName: provider?.name || p.protocol || p.providerId,
        risk: assessRisk(p.providerId, p.chain, { action: p.positionType || 'supply' }),
        valueLabel: `${p.asset}${p.chain ? ` — ${CHAINS[p.chain]?.name || p.chain}` : ''}`,
        actionRequired: p.state === 'restricted' ? 'Provider or jurisdiction action required' : null
      };
    });
}

/** Cross-chain route comparison (§21). A bridge is never disguised as a transfer. */
export function crossChainRoutes({ fromChain, toChain, asset = 'USDC', amount = '1000' }) {
  if (fromChain === toChain) {
    throw Object.assign(new Error('Source and destination chains are the same — this is a direct transfer, not a bridge.'), { status: 400 });
  }
  const decimals = ASSET_DECIMALS[asset] ?? 6;
  const amountMinor = toMinor(amount, decimals);
  const a = CHAINS[fromChain];
  const b = CHAINS[toChain];
  if (!a || !b) throw Object.assign(new Error('Unknown chain.'), { status: 400 });

  const bridges = [
    { name: 'Native rollup bridge', feeBps: 0, gas: networkFeeFor(fromChain, 'USDC'), etaMinutes: [7, 20], security: 'Native L1/L2 bridge — no third-party validator set', risk: 'low' },
    { name: 'Circle CCTP', feeBps: 2, gas: networkFeeFor(fromChain, 'USDC'), etaMinutes: [2, 15], security: 'Issuer-attested burn & mint', risk: 'low' },
    { name: 'Third-party bridge', feeBps: 12, gas: networkFeeFor(fromChain, 'USDC'), etaMinutes: [3, 12], security: 'External validator set / liquidity network', risk: 'medium' }
  ];

  const routes = bridges.map((bridge, index) => {
    const quote = buildQuote({
      from: asset,
      to: asset,
      amountMinor,
      providerFeeBps: bridge.feeBps,
      networkFeeMinor: bridge.gas,
      provider: bridge.name,
      route: `${a.name} → ${b.name}`,
      universe: ['bridges']
    });
    return {
      id: `bridge_${index}`,
      bridge: bridge.name,
      from: a.name,
      to: b.name,
      asset,
      securityModel: bridge.security,
      risk: bridge.risk,
      etaMinutes: bridge.etaMinutes,
      quote,
      /** Explicit: a bridge is a bridge. */
      disclosure: 'This is a cross-chain bridge, not a simple transfer. Bridged assets carry the bridge’s security model.'
    };
  });

  return {
    fromChain, toChain, asset,
    routes: routes.sort((x, y) => Number(x.quote.effectiveCostBps) - Number(y.quote.effectiveCostBps)),
    comparedAt: new Date().toISOString()
  };
}

export function defiProtocols(profile = store.state.profile) {
  const scope = activeCountryCodes(profile);
  return providersForScope(scope, CAPABILITY.SWAP)
    .concat(providersForScope(scope, CAPABILITY.LEND))
    .concat(providersForScope(scope, CAPABILITY.STAKE))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .filter((p) => ['dex', 'defi'].includes(p.kind))
    .map((p) => ({
      id: p.id,
      name: p.name,
      kind: p.kind,
      color: p.color,
      chains: p.chains || [],
      capabilities: p.capabilities,
      tvl: p.tvl ?? null,
      audited: Boolean(p.audited),
      age: p.age || null,
      risk: assessRisk(p.id, (p.chains || ['base'])[0]).level,
      contracts: Object.entries(CONTRACTS[p.id] || {}).map(([chain, c]) => ({ chain, address: c.address, verified: c.verified }))
    }));
}

export { countryMeta, ratioBps, multiply };
