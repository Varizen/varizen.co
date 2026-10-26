/**
 * Zlet — Exchange Point / routing engine (prompt §5, §6, §12, §15, §21, §37, §67).
 *
 * The router's ONLY job is to answer:
 *   "What is the best legitimate way to accomplish what the user wants?"
 *
 * It therefore composes candidate routes from connected rails, then applies, in
 * this order:
 *   1. capability check          — can this provider even do it?
 *   2. 2-country scope check     — is the country inside home + visiting?
 *   3. availability check        — is the feature permitted there?
 *   4. compliance check          — KYC / limits / licensing / sanctions
 *   5. risk check                — Zlet Guard policy
 *   6. cost/speed comparison     — only among the survivors
 *
 * A route that fails 1–5 is reported as excluded *with the reason*, never hidden.
 * Nothing here can "find a way around" a control.
 */

import crypto from 'crypto';
import { store } from './store.js';
import { config } from './config.js';
import {
  AVAILABILITY,
  activeCountryCodes,
  availabilityMatrix,
  country as countryMeta,
  featureAvailability,
  inScope,
  routeAllowed
} from './countries.js';
import { CAPABILITY, can, getProvider, providersForScope, supportsAsset } from './providers.js';
import {
  ASSET_DECIMALS,
  CHAINS,
  FIAT,
  buildQuote,
  convert,
  networkFeeFor,
  rateNumber
} from './fx.js';
import { fromMinor, multiply, ratioBps, toMinor, displayAmount } from './money.js';
import { logActivity } from './sandbox.js';

/* ------------------------------------------------------------------ *
 * Compliance engine (§66)
 * ------------------------------------------------------------------ */

const SANCTIONED_PLACEHOLDER = /^(sanctioned|ofac|blocked)/i;

/**
 * Evaluate compliance for a candidate action. Returns a decision, never throws,
 * so the router can explain *why* a route was excluded.
 */
export function evaluateCompliance({
  profile = store.state.profile,
  countryCode,
  feature,
  amountMinor,
  asset,
  destination = null,
  kyc = profile.kyc,
  isCrossBorder = false
}) {
  const meta = countryMeta(countryCode);
  if (!meta) return { decision: 'unavailable', reason: `Unknown country ${countryCode}.` };

  if (!inScope(profile, countryCode)) {
    return {
      decision: 'unavailable',
      reason: `${meta.name} is outside your ${config.maxActiveCountries}-country scope (home + visiting).`
    };
  }

  const availability = featureAvailability(countryCode, feature);
  if (availability.status === AVAILABILITY.NOT_SUPPORTED) {
    return { decision: 'unavailable', reason: availability.reason, availability };
  }
  if (availability.status === AVAILABILITY.REQUIRES_LICENSED_PARTNER) {
    return { decision: 'partner_required', reason: availability.reason, availability };
  }

  if (kyc !== 'verified') {
    return { decision: 'verification_required', reason: 'Identity verification is incomplete for this jurisdiction.' };
  }

  if (destination && SANCTIONED_PLACEHOLDER.test(String(destination))) {
    return { decision: 'blocked', reason: 'Destination matches a sanctions screening block. This cannot be overridden.' };
  }

  const limit = meta.limits?.dailyCrossBorderMinor;
  if (isCrossBorder && limit && amountMinor != null && BigInt(amountMinor) > BigInt(limit)) {
    return {
      decision: 'limit_exceeded',
      reason: `Amount exceeds the ${meta.name} cross-border daily limit of ${fromMinor(BigInt(limit), 2)} USD equivalent.`
    };
  }

  if (availability.status === AVAILABILITY.LIMITED) {
    return { decision: 'allowed_with_limits', reason: availability.reason, availability };
  }
  if (availability.status === AVAILABILITY.REQUIRES_VERIFICATION) {
    return { decision: 'verification_required', reason: availability.reason, availability };
  }

  return { decision: 'allowed', reason: availability.reason, availability };
}

/* ------------------------------------------------------------------ *
 * Route builders
 * ------------------------------------------------------------------ */

function pushCandidate(list, candidate) {
  list.push({
    id: `rt_${crypto.randomUUID()}`,
    excluded: false,
    ...candidate
  });
}

function exclude(list, candidate, reason, code = 'ineligible') {
  list.push({
    id: `rt_${crypto.randomUUID()}`,
    excluded: true,
    exclusionReason: reason,
    exclusionCode: code,
    ...candidate
  });
}

/**
 * Build every candidate route for a SEND request, then filter.
 *
 * @param {object} p
 * @param {string} p.amount          decimal string
 * @param {string} p.asset           source asset (e.g. 'MYR', 'USDC')
 * @param {string} p.targetAsset     what the recipient receives
 * @param {string} p.destinationCountry  recipient country code
 * @param {string} [p.recipient]
 * @param {boolean} [p.crossBorder]
 */
export function buildSendRoutes({
  amount,
  asset = 'USD',
  targetAsset = null,
  destinationCountry,
  recipient = 'Recipient',
  crossBorder = null
}) {
  const profile = store.state.profile;
  const decimals = ASSET_DECIMALS[asset] ?? 2;
  const amountMinor = toMinor(amount, decimals);
  if (amountMinor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });

  const dest = String(destinationCountry || profile.homeCountry).toUpperCase();
  const isCrossBorder = crossBorder ?? dest !== profile.homeCountry;
  const target = targetAsset || countryMeta(dest)?.currency || asset;

  const candidates = [];
  const scope = activeCountryCodes(profile);

  /* --- rail 1: domestic / cross-border MFS & payment wallets --- */
  /** Kinds that genuinely pay out to a person or merchant. */
  const PAYOUT_KINDS = new Set(['mfs', 'payment-wallet', 'payment-network', 'remittance']);

  for (const p of providersForScope(scope, CAPABILITY.SEND)) {
    // Stablecoin and remittance rails are handled by their own dedicated loops
    // below so each gets its correct fee model and disclosure.
    if (['stablecoin', 'remittance'].includes(p.kind)) continue;
    if (p.nonCustodial && !p.stablecoin) continue;
    // An exchange or crypto wallet cannot pay out to a mobile number or IBAN.
    if (!PAYOUT_KINDS.has(p.kind)) {
      exclude(candidates, {
        kind: p.kind,
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} → ${dest}`,
        countryCode: dest,
        feature: 'send'
      }, `${p.name} is a trading venue, not a payout rail. It cannot send funds directly to a recipient.`, 'not_a_payout_rail');
      continue;
    }

    const supportsDest = p.countries.includes(dest);
    const countryCode = supportsDest ? dest : p.countries.find((c) => scope.includes(c));
    const compliance = evaluateCompliance({
      profile,
      countryCode,
      feature: isCrossBorder ? 'send_global' : 'send_local',
      amountMinor,
      asset,
      isCrossBorder
    });

    if (!supportsDest) {
      exclude(candidates, {
        kind: p.kind,
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} → ${dest}`,
        countryCode,
        feature: 'send'
      }, `${p.name} cannot pay out to ${dest}.`, 'no_payout_corridor');
      continue;
    }

    if (compliance.decision === 'unavailable' || compliance.decision === 'blocked') {
      exclude(candidates, {
        kind: p.kind,
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} → ${dest}`,
        countryCode,
        feature: 'send'
      }, compliance.reason, compliance.decision);
      continue;
    }

    const quote = buildQuote({
      from: asset,
      to: target,
      amountMinor,
      providerFeeBps: p.fee.pctBps,
      providerFeeFixed: p.fee.fixedMinor,
      spreadBps: p.kind === 'mfs' ? 45 : 25,
      networkFeeMinor: 0,
      provider: p.name,
      route: `${p.kind} → ${dest}`,
      universe: ['connected wallets', 'MFS', 'remittance']
    });

    pushCandidate(candidates, {
      kind: p.kind,
      providerId: p.id,
      providerName: p.name,
      label: `${p.name} → ${dest}`,
      countryCode,
      feature: 'send',
      etaMinutes: p.etaMinutes,
      settlement: p.settlement,
      risk: p.risk,
      compliance: compliance.decision,
      complianceReason: compliance.reason,
      quote
    });
  }

  /* --- rail 2: stablecoin transfer --- */
  const stable = providersForScope(scope, CAPABILITY.SEND).filter((p) => p.stablecoin);
  for (const p of stable) {
    const chain = p.chains?.[1] || 'base';
    const networkFee = networkFeeFor(chain, 'USDC');
    const compliance = evaluateCompliance({
      profile,
      countryCode: dest,
      feature: 'stablecoin',
      amountMinor,
      asset: 'USDC',
      isCrossBorder
    });
    if (compliance.decision === 'unavailable' || compliance.decision === 'blocked') {
      exclude(candidates, {
        kind: 'stablecoin',
        providerId: p.id,
        providerName: `${p.name} (${chain})`,
        label: `USDC — ${CHAINS[chain]?.name || chain}`,
        countryCode: dest,
        feature: 'stablecoin'
      }, compliance.reason, compliance.decision);
      continue;
    }
    const quote = buildQuote({
      from: asset,
      to: 'USDC',
      amountMinor,
      providerFeeBps: 0,
      providerFeeFixed: 0,
      spreadBps: 5,
      networkFeeMinor: Number(networkFee),
      provider: `${p.name} (${chain})`,
      route: `stablecoin → ${dest}`,
      universe: ['stablecoin rails']
    });
    pushCandidate(candidates, {
      kind: 'stablecoin',
      providerId: p.id,
      providerName: `${p.name} (${chain})`,
      label: `USDC — ${CHAINS[chain]?.name || chain}`,
      countryCode: dest,
      feature: 'stablecoin',
      etaMinutes: [0, 2],
      settlement: 'chain',
      risk: 'low',
      networkFeeMinor: networkFee,
      /** Honest framing: the recipient receives USDC, not local fiat. */
      settlementAssetNote:
        `Recipient receives USDC on ${CHAINS[chain]?.name || chain}. ` +
        `They still need a route to local ${target} — this is not a fiat payout.`,
      notDirectlyComparable: true,
      compliance: compliance.decision,
      complianceReason: compliance.reason,
      quote
    });
  }

  /* --- rail 3: licensed remittance --- */
  for (const p of providersForScope(scope, CAPABILITY.SEND).filter((x) => x.kind === 'remittance')) {
    if (!p.countries.includes(dest)) continue;
    const compliance = evaluateCompliance({
      profile,
      countryCode: dest,
      feature: 'send_global',
      amountMinor,
      asset,
      isCrossBorder: true
    });
    const quote = buildQuote({
      from: asset,
      to: target,
      amountMinor,
      providerFeeBps: p.fee.pctBps,
      providerFeeFixed: p.fee.fixedMinor,
      spreadBps: 60,
      provider: p.name,
      route: `remittance → ${dest}`,
      universe: ['licensed remittance']
    });
    if (compliance.decision === 'unavailable' || compliance.decision === 'blocked') {
      exclude(candidates, {
        kind: 'remittance',
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} → ${dest}`,
        countryCode: dest,
        feature: 'send_global'
      }, compliance.reason, compliance.decision);
      continue;
    }
    pushCandidate(candidates, {
      kind: 'remittance',
      providerId: p.id,
      providerName: p.name,
      label: `${p.name} → ${dest}`,
      countryCode: dest,
      feature: 'send_global',
      etaMinutes: p.etaMinutes,
      settlement: p.settlement,
      risk: p.risk,
      compliance: compliance.decision,
      complianceReason: compliance.reason,
      quote
    });
  }

  /* --- rail 4: DeFi / on-chain (only if permitted at both ends) --- */
  const defiAvailability = featureAvailability(dest, 'defi');
  const targetIsFiatSend = FIAT.has(String(target).toUpperCase());
  const dexProviders = providersForScope(scope, CAPABILITY.SWAP).filter((p) => p.kind === 'dex' || p.kind === 'defi');
  for (const p of dexProviders.slice(0, 2)) {
    const chain = p.chains?.[1] || 'base';

    // An on-chain swap delivers a token, not fiat. It can only legitimately
    // serve a send when the recipient's target asset is on-chain as well.
    if (targetIsFiatSend) {
      exclude(candidates, {
        kind: 'defi',
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} on ${CHAINS[chain]?.name || chain}`,
        countryCode: dest,
        feature: 'defi'
      },
      `${p.name} delivers an on-chain token, not ${target}. A fiat payout needs a licensed provider.`,
      'no_fiat_payout');
      continue;
    }

    if (defiAvailability.status === AVAILABILITY.NOT_SUPPORTED) {
      exclude(candidates, {
        kind: 'defi',
        providerId: p.id,
        providerName: p.name,
        label: `${p.name} on ${CHAINS[chain]?.name || chain}`,
        countryCode: dest,
        feature: 'defi'
      }, `DeFi routes are not permitted in ${dest}.`, 'jurisdiction');
      continue;
    }
    const networkFee = networkFeeFor(chain, 'USDC');
    const quote = buildQuote({
      from: asset,
      to: 'USDC',
      amountMinor,
      providerFeeBps: p.fee.pctBps,
      providerFeeFixed: p.fee.fixedMinor,
      spreadBps: 15,
      provider: `${p.name} (${chain})`,
      route: `DeFi → ${dest}`,
      universe: ['DEX / DeFi']
    });
    pushCandidate(candidates, {
      kind: 'defi',
      providerId: p.id,
      providerName: `${p.name} (${chain})`,
      label: `${p.name} — ${CHAINS[chain]?.name || chain}`,
      countryCode: dest,
      feature: 'defi',
      etaMinutes: [0, 3],
      settlement: 'chain',
      risk: 'medium',
      networkFeeMinor: networkFee,
      requiresHighRisk: true,
      compliance: 'allowed_with_limits',
      complianceReason: defiAvailability.reason,
      quote
    });
  }

  return rank(candidates, { amountMinor, asset });
}

/**
 * Rank candidates: eligible first, then by effective cost, then ETA.
 * The "recommended" flag is only ever set among legitimate routes.
 */
export function rank(candidates, { amountMinor } = {}) {
  const eligible = candidates.filter((c) => !c.excluded);
  const excluded = candidates.filter((c) => c.excluded);

  const costOf = (c) => {
    const q = c.quote;
    if (!q) return Infinity;
    return Number(q.effectiveCostBps);
  };
  const etaOf = (c) => (Array.isArray(c.etaMinutes) ? c.etaMinutes[1] : c.etaMinutes ?? 0);

  eligible.sort((a, b) => {
    // Routes that do not deliver the requested target asset (e.g. a stablecoin
    // transfer where the recipient asked for local fiat) are never "the best
    // way to accomplish what the user wants" — rank them last, and label them.
    const na = a.notDirectlyComparable ? 1 : 0;
    const nb = b.notDirectlyComparable ? 1 : 0;
    if (na !== nb) return na - nb;

    const cost = costOf(a) - costOf(b);
    if (Math.abs(cost) > 5) return cost;
    return etaOf(a) - etaOf(b);
  });

  const ranked = eligible.map((c, index) => ({
    ...c,
    rank: index + 1,
    recommended: index === 0,
    alternative: index > 0,
    costBps: costOf(c),
    etaMinutes: Array.isArray(c.etaMinutes) ? c.etaMinutes : [c.etaMinutes, c.etaMinutes],
    /** Material disclosure for the chosen route (§49). */
    disclosure: {
      providerFee: c.quote ? `${displayAmount(c.quote.providerFeeMinor, c.quote.amountDecimals)} ${c.quote.from}` : null,
      networkFee: c.quote ? `${displayAmount(c.quote.networkFeeMinor, c.quote.amountDecimals)} ${c.quote.from}` : null,
      spreadBps: c.quote?.spreadBps ?? null,
      slippageBps: c.quote?.slippageBps ?? null,
      totalCost: c.quote ? `${displayAmount(c.quote.totalCostMinor, c.quote.amountDecimals)} ${c.quote.from}` : null,
      recipientReceives: c.quote ? `${displayAmount(c.quote.receiveMinor, c.quote.receiveDecimals)} ${c.quote.to}` : null
    }
  }));

  return {
    recommended: ranked[0] || null,
    alternatives: ranked.slice(1),
    ranked,
    excluded: excluded.map((c) => ({
      id: c.id,
      label: c.label,
      providerName: c.providerName,
      kind: c.kind,
      countryCode: c.countryCode,
      reason: c.exclusionReason,
      code: c.exclusionCode
    })),
    comparedAt: new Date().toISOString(),
    comparisonUniverse: [...new Set(eligible.map((c) => c.kind))],
    /** If nothing is eligible, say so plainly with the legitimate next step. */
    message: ranked.length
      ? null
      : 'This route isn’t currently supported. The excluded list shows why, and every legitimate alternative available to you.',
    eligibleCount: ranked.length
  };
}

/* ------------------------------------------------------------------ *
 * Exchange / convert routes (§15, §33)
 * ------------------------------------------------------------------ */

export function buildExchangeRoutes({ from, to, amount, chain = 'base' }) {
  const profile = store.state.profile;
  const scope = activeCountryCodes(profile);
  const decimals = ASSET_DECIMALS[from] ?? 2;
  const amountMinor = toMinor(amount, decimals);
  if (amountMinor <= 0n) throw Object.assign(new Error('Amount must be greater than zero.'), { status: 400 });

  const candidates = [];
  const homeAvailability = featureAvailability(profile.homeCountry, 'exchange');

  for (const p of providersForScope(scope, CAPABILITY.EXCHANGE)) {
    const compliance = evaluateCompliance({
      profile,
      countryCode: profile.homeCountry,
      feature: 'exchange',
      amountMinor,
      asset: from
    });

    // A venue must be able to handle BOTH legs. Otherwise the route is not real.
    const canDeliver = supportsAsset(p, to);
    const canAccept = supportsAsset(p, from);
    if (!canDeliver || !canAccept) {
      exclude(candidates, {
        kind: p.kind, providerId: p.id, providerName: p.name,
        label: `${p.name} ${from}→${to}`, countryCode: profile.homeCountry, feature: 'exchange'
      },
      `${p.name} cannot settle ${!canAccept ? from : to}. It does not offer that pair.`,
      'no_pair');
      continue;
    }

    const quote = buildQuote({
      from,
      to,
      amountMinor,
      providerFeeBps: p.fee.pctBps,
      providerFeeFixed: p.fee.fixedMinor,
      spreadBps: 40,
      provider: p.name,
      route: 'licensed exchange',
      universe: ['licensed exchanges', 'DEX', 'stablecoin rails']
    });
    if (compliance.decision === 'unavailable' || compliance.decision === 'blocked') {
      exclude(candidates, {
        kind: p.kind, providerId: p.id, providerName: p.name,
        label: `${p.name} ${from}→${to}`, countryCode: profile.homeCountry, feature: 'exchange'
      }, compliance.reason, compliance.decision);
      continue;
    }
    pushCandidate(candidates, {
      kind: p.kind, providerId: p.id, providerName: p.name,
      label: `${p.name} ${from}→${to}`,
      countryCode: profile.homeCountry, feature: 'exchange',
      etaMinutes: p.etaMinutes, settlement: p.settlement, risk: p.risk,
      compliance: compliance.decision, complianceReason: compliance.reason, quote
    });
  }

  const dexAllowed = featureAvailability(profile.homeCountry, 'defi').status !== AVAILABILITY.NOT_SUPPORTED;
  const targetIsFiat = FIAT.has(String(to).toUpperCase());
  const sourceIsFiat = FIAT.has(String(from).toUpperCase());

  /**
   * Composed two-hop routes: on-chain leg on a DEX, then a licensed off-ramp.
   * This is genuine composition — both legs are real, both providers are named,
   * and the user sees each fee. It is never presented as a single swap.
   */
  const offRamps = providersForScope(scope, CAPABILITY.EXCHANGE).filter(
    (p) => p.settles?.fiat && supportsAsset(p, to) && p.kind === 'exchange'
  );
  const swapLegs = providersForScope(scope, CAPABILITY.SWAP).filter((p) => p.kind === 'dex' || p.kind === 'defi');

  if (dexAllowed && (targetIsFiat || sourceIsFiat) && offRamps.length && swapLegs.length) {
    // On-chain intermediate asset: use a stablecoin as the bridge asset when the
    // target is fiat, otherwise the target itself.
    const intermediate = targetIsFiat ? 'USDC' : to;
    const offRamp = offRamps[0];

    for (const dex of swapLegs.slice(0, 3)) {
      if (!(dex.chains || []).includes(chain)) continue;
      if (!supportsAsset(dex, from) || !supportsAsset(dex, intermediate)) continue;

      const chainName = CHAINS[chain]?.name || chain;
      const networkFee = networkFeeFor(chain, from === 'USDC' ? 'USDC' : 'ETH');

      // Hop 1: from → intermediate on the DEX.
      const leg1 = buildQuote({
        from,
        to: intermediate,
        amountMinor,
        providerFeeBps: dex.fee.pctBps,
        providerFeeFixed: dex.fee.fixedMinor,
        spreadBps: 10,
        slippageBps: 30,
        networkFeeMinor: networkFee,
        provider: `${dex.name} (${chainName})`,
        route: `hop 1: ${from} → ${intermediate}`,
        universe: ['composed routes']
      });

      // Hop 2: intermediate → fiat on the licensed off-ramp.
      const leg2 = buildQuote({
        from: intermediate,
        to,
        amountMinor: BigInt(leg1.receiveMinor),
        providerFeeBps: offRamp.fee.pctBps,
        providerFeeFixed: offRamp.fee.fixedMinor,
        spreadBps: 35,
        provider: offRamp.name,
        route: `hop 2: ${intermediate} → ${to}`,
        universe: ['composed routes']
      });

      const totalCost =
        BigInt(leg1.totalCostMinor) +
        multiply(BigInt(leg1.receiveMinor), BigInt(leg2.totalCostMinor), BigInt(leg2.amountMinor || 1n));
      const composedCostMinor = totalCost > 0n ? totalCost : 0n;

      pushCandidate(candidates, {
        kind: 'composed',
        providerId: dex.id,
        providerName: `${dex.name} → ${offRamp.name}`,
        label: `${from} → ${intermediate} (${chainName}) → ${to} (${offRamp.name})`,
        countryCode: profile.homeCountry,
        feature: 'exchange',
        etaMinutes: [
          (leg1.midRate ? 0 : 0) + 1,
          (dex.etaMinutes?.[1] ?? 2) + (offRamp.etaMinutes?.[1] ?? 10)
        ],
        settlement: 'two-hop',
        risk: 'medium',
        requiresHighRisk: true,
        multiHop: [
          { hop: 1, provider: `${dex.name} (${chainName})`, from, to: intermediate, quote: leg1 },
          { hop: 2, provider: offRamp.name, from: intermediate, to, quote: leg2 }
        ],
        hopNote: 'Two separate executions. Each hop can fail independently — Zlet will show both confirmations.',
        compliance: 'allowed_with_limits',
        complianceReason: `Composed from a DeFi leg (limited in ${countryMeta(profile.homeCountry)?.name}) and a licensed off-ramp.`,
        quote: {
          ...leg2,
          from,
          to,
          amountMinor: String(amountMinor),
          amountDecimals: decimals,
          receiveMinor: leg2.receiveMinor,
          receiveDecimals: leg2.receiveDecimals,
          totalCostMinor: String(composedCostMinor),
          providerFeeMinor: String(BigInt(leg1.providerFeeMinor) + BigInt(leg2.providerFeeMinor)),
          networkFeeMinor: leg1.networkFeeMinor,
          spreadBps: leg1.spreadBps + leg2.spreadBps,
          slippageBps: leg1.slippageBps,
          midRate: leg1.midRate,
          providerRate: leg1.providerRate,
          /** Composed routes carry their own effective-cost basis. */
          effectiveCostBps: ratioBps(composedCostMinor, amountMinor),
          effectiveRate: Number(fromMinor(leg2.receiveMinor, leg2.receiveDecimals)) / Number(fromMinor(amountMinor, decimals)),
          provider: `${dex.name} → ${offRamp.name}`,
          route: `composed (${chainName} → ${offRamp.name})`,
          universe: ['composed routes'],
          comparison: {
            universe: ['composed routes'],
            midRateSource: 'sandbox reference snapshot',
            note: 'Composed route: DEX leg + licensed off-ramp leg. Fees shown for both hops.'
          }
        }
      });
    }
  }

  for (const p of providersForScope(scope, CAPABILITY.SWAP)) {
    if (p.kind !== 'dex' && p.kind !== 'defi') continue;

    // A DEX on its own cannot deliver fiat, and cannot take fiat as input.
    // Claiming otherwise would fabricate interoperability, which Zlet never does.
    if (targetIsFiat || sourceIsFiat) {
      exclude(candidates, {
        kind: p.kind, providerId: p.id, providerName: p.name,
        label: `${p.name} ${from}→${to}`, countryCode: profile.homeCountry, feature: 'defi'
      },
      `${p.name} settles on-chain only and cannot deliver or accept fiat ${targetIsFiat ? to : from} on its own. ` +
        'A composed DEX + off-ramp route is listed above where one is available.',
      'no_fiat_leg');
      continue;
    }

    if (!dexAllowed) {
      exclude(candidates, {
        kind: p.kind, providerId: p.id, providerName: p.name,
        label: `${p.name} ${from}→${to}`, countryCode: profile.homeCountry, feature: 'defi'
      }, `DeFi swaps are not permitted in ${countryMeta(profile.homeCountry)?.name}.`, 'jurisdiction');
      continue;
    }
    const networkFee = networkFeeFor(chain, from === 'USDC' ? 'USDC' : 'ETH');
    const quote = buildQuote({
      from, to, amountMinor,
      providerFeeBps: p.fee.pctBps,
      providerFeeFixed: p.fee.fixedMinor,
      spreadBps: 10,
      slippageBps: 30,
      networkFeeMinor: networkFee,
      provider: `${p.name} (${chain})`,
      route: 'DEX swap',
      universe: ['licensed exchanges', 'DEX', 'stablecoin rails']
    });
    pushCandidate(candidates, {
      kind: 'defi', providerId: p.id, providerName: `${p.name} (${chain})`,
      label: `${p.name} ${from}→${to} on ${CHAINS[chain]?.name || chain}`,
      countryCode: profile.homeCountry, feature: 'defi',
      etaMinutes: [0, 2], settlement: 'chain', risk: 'medium',
      requiresHighRisk: true,
      compliance: 'allowed_with_limits',
      complianceReason: `DeFi limited to vetted protocols in ${countryMeta(profile.homeCountry)?.name}.`,
      quote
    });
  }

  // Always offer the informational mid-market reference so the user can see the
  // spread they are paying (never presented as an executable route).
  const mid = rateNumber(from, to);
  return {
    ...rank(candidates, { amountMinor }),
    midMarketReference: {
      rate: mid,
      label: `1 ${from} = ${mid ? mid.toFixed(6) : 'n/a'} ${to}`,
      source: 'sandbox reference snapshot',
      at: new Date().toISOString(),
      note: 'Reference only. Not an executable quote.'
    },
    availability: homeAvailability
  };
}

/* ------------------------------------------------------------------ *
 * Remittance corridors (§37)
 * ------------------------------------------------------------------ */

export function remittanceCorridors(profile = store.state.profile) {
  const scope = activeCountryCodes(profile);
  const from = profile.homeCountry;
  const to = profile.visitingCountry || null;
  const candidates = [];

  for (const p of providersForScope(scope, CAPABILITY.SEND).filter((x) => x.kind === 'remittance')) {
    const corridors = p.countries.filter((c) => c !== from);
    for (const corridor of corridors) {
      candidates.push({
        providerId: p.id,
        providerName: p.name,
        from,
        to: corridor,
        inScope: inScope(profile, corridor),
        etaMinutes: p.etaMinutes,
        risk: p.risk,
        feeBps: p.fee.pctBps,
        feeFixed: p.fee.fixedMinor
      });
    }
  }

  return {
    from,
    visiting: to,
    corridors: candidates.sort((a, b) => Number(b.inScope) - Number(a.inScope) || a.feeBps - b.feeBps),
    note: 'Only corridors where a licensed provider operates are listed. No corridor is fabricated.'
  };
}

/* ------------------------------------------------------------------ *
 * Route validity check used by the execution layer
 * ------------------------------------------------------------------ */

export function assertRouteLegitimate({ countryCode, feature, amountMinor, destination }) {
  const profile = store.state.profile;
  const scope = routeAllowed(profile, { countryCode, feature });
  if (!scope.allowed) throw Object.assign(new Error(scope.reason), { status: 403, code: 'OUT_OF_SCOPE' });

  const compliance = evaluateCompliance({ profile, countryCode, feature, amountMinor, destination });
  if (compliance.decision === 'unavailable' || compliance.decision === 'blocked') {
    throw Object.assign(new Error(compliance.reason), { status: 403, code: 'COMPLIANCE_BLOCKED' });
  }
  if (compliance.decision === 'verification_required') {
    throw Object.assign(new Error(compliance.reason), { status: 403, code: 'VERIFICATION_REQUIRED' });
  }
  return compliance;
}

export { availabilityMatrix, featureAvailability, activeCountryCodes, convert };

