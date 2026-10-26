/**
 * Zlet test suite — node:test, zero dependencies.
 *
 * Coverage:
 *  - exact decimal money math (no floating point)
 *  - FX conversion and quote construction
 *  - the TWO-COUNTRY RULE (home + one visiting), enforced structurally
 *  - Availability Engine per country/feature
 *  - provider capability discovery (no assumed capabilities)
 *  - routing: compliance filtering, exclusion reasons, honest ranking
 *  - no fabricated interoperability (DEX cannot deliver fiat, Wise cannot deliver crypto)
 *  - portfolio states: spendable vs transferable vs invested vs pending vs restricted
 *  - DeFi simulation + risk + approval safety
 *  - transaction state machine: illegal transitions rejected
 *  - Zlet Guard blocking
 *  - idempotency: a retry never double-pays
 *  - settlement is not assumed on submit
 *  - AI never invents numbers (every reply derives from the store)
 *  - merchant requests / reconciliation only against CONFIRMED settlements
 *  - HTTP API smoke tests against a real server on an ephemeral port
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { toMinor, fromMinor, multiply, ratioBps, displayAmount, formatMoney } from '../server/money.js';
import {
  ASSET_DECIMALS,
  buildQuote,
  convert,
  midRate,
  rateNumber,
  networkFeeFor
} from '../server/fx.js';
import {
  COUNTRIES,
  MAX_ACTIVE_COUNTRIES,
  AVAILABILITY,
  activeCountries,
  activeCountryCodes,
  assertCountryChangeAllowed,
  availabilityMatrix,
  featureAvailability,
  inScope,
  routeAllowed
} from '../server/countries.js';
import {
  CAPABILITY,
  CATALOG,
  can,
  getProvider,
  providersForScope,
  supportsAsset
} from '../server/providers.js';
import { buildExchangeRoutes, buildSendRoutes, evaluateCompliance, rank } from '../server/router.js';
import {
  assetGroups,
  breakdown,
  chainExposure,
  describePortfolio,
  stablecoinHub,
  summarize,
  usdMinor
} from '../server/portfolio.js';
import { assessRisk, crossChainRoutes, defiPositions, defiProtocols, simulate, CONTRACTS } from '../server/defi.js';
import {
  FAILURE_STATES,
  TERMINAL_STATES,
  TRANSITIONS,
  authorizeTransaction,
  createTransaction,
  evaluateGuard,
  feeBreakdown,
  listTransactions,
  presentTransaction,
  rejectTransaction,
  submitTransaction,
  transition
} from '../server/transactions.js';
import { sandbox } from '../server/sandbox.js';
import { handleCommand, searchTransactions } from '../server/assistant.js';
import {
  cancelRequest,
  createRequest,
  getRequest,
  listRequests,
  paymentRails,
  reconcilePayment
} from '../server/merchant.js';
import { store } from '../server/store.js';
import { seedDemoAccount } from '../server/seed.js';
import { createServer } from '../server/index.js';

/* ------------------------------------------------------------------ *
 * Fixtures
 * ------------------------------------------------------------------ */

seedDemoAccount();

const resetProfile = (overrides = {}) => {
  store.state.profile.homeCountry = 'MY';
  store.state.profile.visitingCountry = 'BD';
  store.state.profile.travelActive = true;
  store.state.profile.kyc = 'verified';
  Object.assign(store.state.profile, overrides);
};

/* ------------------------------------------------------------------ *
 * Money — never floating point (§48)
 * ------------------------------------------------------------------ */

test('money: parse decimal strings into exact minor units', () => {
  assert.equal(toMinor('1,234.56', 2), 123456n);
  assert.equal(toMinor('1234.5', 2), 123450n);
  assert.equal(toMinor('0.001', 2), 0n);
  assert.equal(toMinor('0.005', 2), 1n); // half-up, never truncated
  assert.equal(toMinor('-12.34', 2), -1234n);
  assert.equal(toMinor('100', 6), 100000000n);
});

test('money: minor units round-trip to decimal strings', () => {
  assert.equal(fromMinor(123456n, 2), '1234.56');
  assert.equal(fromMinor(1n, 6), '0.000001');
  assert.equal(fromMinor(0n, 2), '0.00');
  assert.equal(fromMinor(-500n, 2), '-5.00');
});

test('money: 0.1 + 0.2 is exactly 0.30 (the float trap)', () => {
  const a = toMinor('0.1', 2);
  const b = toMinor('0.2', 2);
  assert.equal(fromMinor(a + b, 2), '0.30');
  // Prove the float path would have failed.
  assert.notEqual(0.1 + 0.2, 0.3);
});

test('money: bigint multiply keeps 18-decimal precision', () => {
  const oneEth = toMinor('1', 18);
  const halves = multiply(oneEth, 1n, 3n, { round: 'down' });
  assert.equal(fromMinor(halves, 18), '0.333333333333333333');
});

test('money: ratioBps reports basis points without floats', () => {
  assert.equal(ratioBps(1n, 3n), 3333);
  assert.equal(ratioBps(0n, 3n), 0);
  assert.equal(ratioBps(100n, 100n), 10000);
});

test('money: displayAmount trims crypto noise', () => {
  assert.equal(displayAmount('5000000000000000000', 18), '5');
  assert.equal(displayAmount('159292802873076923', 18), '0.159293');
  assert.equal(formatMoney(1234n, 'MYR', 2), '12.34 MYR');
});

/* ------------------------------------------------------------------ *
 * FX (§33)
 * ------------------------------------------------------------------ */

test('fx: mid rate is stated for a defined pair', () => {
  const rate = rateNumber('USD', 'MYR');
  assert.ok(rate > 4 && rate < 5, `USD/MYR should be plausible, got ${rate}`);
  assert.equal(rateNumber('USDC', 'USD'), 1);
});

test('fx: conversion is reversible within rounding', () => {
  const usd = toMinor('100', 2);
  const myr = convert(usd, 'USD', 'MYR');
  const back = convert(myr.minor, 'MYR', 'USD');
  const diff = Number(back.minor) - Number(usd);
  assert.ok(Math.abs(diff) <= 2, `round-trip drift too large: ${diff} minor units`);
});

test('fx: quote exposes mid, provider, spread and effective cost', () => {
  const q = buildQuote({
    from: 'USD',
    to: 'MYR',
    amountMinor: toMinor('1000', 2),
    providerFeeBps: 100,
    providerFeeFixed: 50,
    spreadBps: 50,
    networkFeeMinor: 0,
    provider: 'Test',
    universe: ['test venue']
  });

  assert.ok(q.midRate > 0);
  assert.ok(q.providerRate > 0);
  assert.ok(q.providerRate < q.midRate, 'provider rate must be worse than mid after spread');
  assert.ok(q.effectiveRate > 0);
  assert.ok(q.effectiveCostBps > 0);
  assert.equal(q.universe[0], 'test venue');
  assert.ok(q.comparedAt, 'a quote must carry its timestamp');
});

test('fx: a quote never hides the comparison universe or timestamp', () => {
  const q = buildQuote({
    from: 'USDC', to: 'ETH', amountMinor: 1000000n,
    provider: 'X', universe: ['licensed exchanges', 'DEX']
  });
  assert.deepEqual(q.universe, ['licensed exchanges', 'DEX']);
  assert.ok(q.comparison.note.includes('sandbox'));
});

test('fx: fees exceeding the amount are rejected, not silently zeroed', () => {
  assert.throws(
    () => buildQuote({ from: 'USD', to: 'MYR', amountMinor: 100n, providerFeeFixed: 500, provider: 'X' }),
    /Fees exceed the send amount/
  );
});

/* ------------------------------------------------------------------ *
 * THE TWO-COUNTRY RULE (home + one visiting)
 * ------------------------------------------------------------------ */

test('countries: exactly two active countries at most', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const active = activeCountries(store.state.profile);
  assert.equal(active.length, 2);
  assert.deepEqual(activeCountryCodes(store.state.profile), ['MY', 'BD']);
  assert.equal(MAX_ACTIVE_COUNTRIES, 2);
});

test('countries: travel off leaves only the home country', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: false });
  assert.deepEqual(activeCountryCodes(store.state.profile), ['MY']);
  assert.equal(inScope(store.state.profile, 'BD'), false, 'visiting country is out of scope when travel is off');
});

test('countries: a third country can never be added', () => {
  const profile = { homeCountry: 'MY', visitingCountry: 'BD', travelActive: true };
  // Replacing the visiting country is allowed (it is still two total).
  const replaced = assertCountryChangeAllowed(profile, { visitingCountry: 'SG' });
  assert.equal(replaced.ok, true);
  const codes = activeCountryCodes(replaced.profile);
  assert.equal(codes.length, 2);
  assert.deepEqual(codes, ['MY', 'SG']);

  // A home change that would collide with the visiting country is refused by the
  // helper; the HTTP route clears the visiting country before calling it.
  assert.throws(
    () => assertCountryChangeAllowed(profile, { homeCountry: 'BD' }),
    /must differ from your home country/i
  );

  // No proposed profile can ever produce three active countries.
  const attempts = [
    { visitingCountry: 'SG', travelActive: true },
    { visitingCountry: 'AE', travelActive: true },
    { homeCountry: 'SG', visitingCountry: 'AE', travelActive: true }
  ];
  for (const attempt of attempts) {
    const out = assertCountryChangeAllowed(profile, attempt);
    assert.ok(activeCountryCodes(out.profile).length <= 2);
  }
});

test('countries: travel mode requires a visiting country that differs from home', () => {
  const profile = { homeCountry: 'MY', visitingCountry: null, travelActive: false };
  assert.throws(() => assertCountryChangeAllowed(profile, { travelActive: true }), /visiting country/i);
  assert.throws(
    () => assertCountryChangeAllowed(profile, { travelActive: true, visitingCountry: 'MY' }),
    /must differ from your home country/i
  );
});

test('countries: unknown countries are rejected', () => {
  const profile = { homeCountry: 'MY', visitingCountry: null, travelActive: false };
  assert.throws(() => assertCountryChangeAllowed(profile, { visitingCountry: 'ZZ' }), /Unknown country/i);
});

test('countries: out-of-scope routing is refused by the router helper', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  assert.equal(routeAllowed(store.state.profile, { countryCode: 'MY', feature: 'pay' }).allowed, true);
  assert.equal(routeAllowed(store.state.profile, { countryCode: 'BD', feature: 'send' }).allowed, true);

  const out = routeAllowed(store.state.profile, { countryCode: 'US', feature: 'pay' });
  assert.equal(out.allowed, false);
  assert.match(out.reason, /outside your 2-country scope/);
});

test('countries: the availability matrix only ever contains in-scope countries', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const matrix = availabilityMatrix(store.state.profile);
  assert.equal(matrix.scope.length, 2);
  assert.deepEqual(matrix.scope.map((s) => s.code), ['MY', 'BD']);
  assert.ok(matrix.features.length > 5);
  for (const feature of matrix.features) {
    assert.equal(feature.countries.length, 2, `${feature.feature} must be evaluated for both countries only`);
  }
});

/* ------------------------------------------------------------------ *
 * Availability Engine (§38, §66)
 * ------------------------------------------------------------------ */

test('availability: crypto is unavailable where it is not legal', () => {
  assert.equal(featureAvailability('PK', 'crypto').status, AVAILABILITY.NOT_SUPPORTED);
  assert.equal(featureAvailability('BD', 'crypto').status, AVAILABILITY.NOT_SUPPORTED);
  // Malaysia permits it.
  assert.notEqual(featureAvailability('MY', 'crypto').status, AVAILABILITY.NOT_SUPPORTED);
});

test('availability: DeFi is prohibited where the jurisdiction prohibits it', () => {
  assert.equal(featureAvailability('BD', 'defi').status, AVAILABILITY.NOT_SUPPORTED);
  assert.equal(featureAvailability('PK', 'defi').status, AVAILABILITY.NOT_SUPPORTED);
  assert.equal(featureAvailability('MY', 'defi').status, AVAILABILITY.LIMITED);
});

test('availability: custody is never offered as a Zlet capability', () => {
  for (const code of Object.keys(COUNTRIES)) {
    const status = featureAvailability(code, 'custody').status;
    assert.notEqual(status, AVAILABILITY.AVAILABLE, `Zlet must never offer custody in ${code}`);
  }
});

test('availability: NFC is always limited by the OS secure element', () => {
  assert.equal(featureAvailability('MY', 'nfc').status, AVAILABILITY.LIMITED);
});

test('availability: every result carries a readable reason', () => {
  for (const code of Object.keys(COUNTRIES)) {
    for (const feature of ['pay', 'send', 'receive', 'convert', 'defi', 'custody']) {
      const res = featureAvailability(code, feature);
      assert.ok(res.reason && res.reason.length > 10, `${code}/${feature} needs a reason`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * Provider capabilities (§39, §64, §65)
 * ------------------------------------------------------------------ */

test('providers: capabilities are advertised, never assumed', () => {
  assert.equal(can('google-pay', CAPABILITY.NFC), true);
  assert.equal(can('google-pay', CAPABILITY.EXCHANGE), false);
  assert.equal(can('uniswap', CAPABILITY.SWAP), true);
  assert.equal(can('uniswap', CAPABILITY.SEND), false);
  assert.equal(can('nope-not-a-provider', CAPABILITY.SEND), false);
});

test('providers: wallet ecosystems that forbid aggregation are marked as such', () => {
  for (const id of ['google-pay', 'apple-pay', 'samsung-wallet']) {
    const p = getProvider(id);
    assert.equal(p.aggregatable, false, `${id} must not claim balance aggregation`);
    assert.ok(p.balanceNote, `${id} must explain why`);
  }
});

test('providers: no raw card data, CVV or seed field exists anywhere', () => {
  const json = JSON.stringify(CATALOG).toLowerCase();
  for (const forbidden of ['cvv', 'cvc', 'seedphrase', 'seed_phrase', 'cardnumber', 'pan']) {
    assert.equal(json.includes(forbidden), false, `provider catalog must not contain ${forbidden}`);
  }
});

test('providers: supportsAsset prevents fabricated interoperability', () => {
  // A DEX cannot deliver fiat.
  assert.equal(supportsAsset('uniswap', 'MYR'), false);
  assert.equal(supportsAsset('uniswap', 'USDC'), true);
  // Wise cannot deliver crypto.
  assert.equal(supportsAsset('wise', 'ETH'), false);
  assert.equal(supportsAsset('wise', 'MYR'), true);
  // An exchange that offers both legs.
  assert.equal(supportsAsset('luno', 'MYR'), true);
  assert.equal(supportsAsset('luno', 'USDC'), true);
});

test('providers: scope filtering only returns providers valid in those countries', () => {
  const my = providersForScope(['MY']);
  assert.ok(my.length > 0);
  assert.ok(my.every((p) => p.countries.includes('MY')));

  const nonexistent = providersForScope(['ZZ']);
  assert.equal(nonexistent.length, 0);
});

/* ------------------------------------------------------------------ *
 * Routing (§5, §6, §67)
 * ------------------------------------------------------------------ */

test('routing: cross-border send returns ranked legal routes', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildSendRoutes({ amount: '2000', asset: 'USD', destinationCountry: 'BD' });
  assert.ok(result.eligibleCount > 0, 'expected at least one legal route MY→BD');
  assert.ok(result.recommended);
  assert.equal(result.recommended.rank, 1);
  assert.ok(result.recommended.disclosure.recipientReceives);
  assert.ok(result.comparedAt);
});

test('routing: compliance exclusions always carry a reason and a code', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildSendRoutes({ amount: '500', asset: 'USD', destinationCountry: 'BD' });
  for (const ex of result.excluded) {
    assert.ok(ex.reason && ex.reason.length > 8, `exclusion for ${ex.label} needs a reason`);
    assert.ok(ex.code, `exclusion for ${ex.label} needs a code`);
  }
});

test('routing: a destination outside the two-country scope is refused', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  // GB is not in scope, so every GB-only path must be excluded.
  const result = buildSendRoutes({ amount: '100', asset: 'USD', destinationCountry: 'GB' });
  const eligibleProviders = result.ranked.map((r) => r.providerName);
  const reasons = result.excluded.map((e) => e.reason).join(' ');
  assert.match(reasons, /outside your 2-country scope|not available|cannot pay out/);
  assert.equal(eligibleProviders.some((n) => /Coinbase|Kraken/.test(n)), false);
});

test('routing: DeFi routes never serve a fiat payout', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildSendRoutes({ amount: '300', asset: 'MYR', destinationCountry: 'MY' });
  const defiRoutes = result.ranked.filter((r) => r.kind === 'defi');
  assert.equal(defiRoutes.length, 0, 'an on-chain swap must not be offered as a fiat send');
  const excluded = result.excluded.filter((e) => e.kind === 'defi');
  assert.ok(excluded.length > 0);
  assert.ok(excluded.every((e) => /on-chain token|licensed provider/i.test(e.reason)));
});

test('routing: exchanges are not offered as payout rails', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildSendRoutes({ amount: '300', asset: 'MYR', destinationCountry: 'MY' });
  const tradingVenues = result.ranked.filter((r) => r.kind === 'exchange');
  assert.equal(tradingVenues.length, 0);
  assert.ok(result.excluded.some((e) => e.code === 'not_a_payout_rail'));
});

test('routing: a stablecoin route is flagged as not directly comparable', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildSendRoutes({ amount: '1000', asset: 'USD', destinationCountry: 'BD' });
  const stable = result.ranked.find((r) => r.kind === 'stablecoin');
  if (stable) {
    assert.equal(stable.notDirectlyComparable, true);
    assert.ok(stable.settlementAssetNote);
    // And it must not be ranked first when a direct fiat route exists.
    assert.notEqual(stable.rank, 1);
  }
});

test('routing: if nothing is eligible the message is explicit', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  // A country pair with no corridor at all.
  const result = buildSendRoutes({ amount: '50', asset: 'USD', destinationCountry: 'AE' });
  if (result.eligibleCount === 0) {
    assert.match(result.message, /isn.t currently supported/i);
    assert.match(result.message, /legitimate alternative/i);
  }
  assert.ok(result.eligibleCount === 0 || result.recommended);
});

test('routing: convert routes only include venues that handle both legs', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildExchangeRoutes({ from: 'USDC', to: 'MYR', amount: '500' });
  assert.ok(result.eligibleCount > 0, 'a licensed off-ramp should exist');
  for (const route of result.ranked) {
    if (route.kind === 'exchange' && !route.multiHop) {
      assert.ok(supportsAsset(route.providerId, 'USDC'));
      assert.ok(supportsAsset(route.providerId, 'MYR'));
    }
  }
  // DEX-only fiat routes must be excluded with an explanation.
  const dexExcluded = result.excluded.filter((e) => e.code === 'no_fiat_leg');
  assert.ok(dexExcluded.length > 0);
});

test('routing: composed two-hop routes name both hops', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const result = buildExchangeRoutes({ from: 'USDC', to: 'MYR', amount: '500', chain: 'base' });
  const composed = result.ranked.filter((r) => r.multiHop);
  assert.ok(composed.length > 0, 'expected a composed DEX + off-ramp route');
  for (const route of composed) {
    assert.equal(route.multiHop.length, 2);
    assert.ok(route.multiHop[0].provider && route.multiHop[1].provider);
    assert.ok(route.hopNote);
    assert.ok(route.quote.effectiveCostBps >= 0);
  }
});

test('routing: exchange quote exposes the mid-market reference separately', () => {
  resetProfile();
  const result = buildExchangeRoutes({ from: 'USDC', to: 'ETH', amount: '100' });
  assert.ok(result.midMarketReference);
  assert.ok(result.midMarketReference.label.includes('USDC'));
  assert.match(result.midMarketReference.note, /not an executable quote/i);
});

test('routing: rank never recommends an excluded candidate', () => {
  const ranked = rank([
    { label: 'legal', providerName: 'A', kind: 'mfs', etaMinutes: [1, 2], quote: { effectiveCostBps: 50, providerFeeMinor: '5', networkFeeMinor: '0', totalCostMinor: '5', receiveMinor: '995', amountDecimals: 2, receiveDecimals: 2, from: 'USD', to: 'MYR', spreadBps: 0, slippageBps: 0 } },
    { label: 'illegal', providerName: 'B', kind: 'defi', excluded: true, exclusionReason: 'blocked', exclusionCode: 'blocked' }
  ]);
  assert.equal(ranked.recommended.providerName, 'A');
  assert.equal(ranked.excluded.length, 1);
});

/* ------------------------------------------------------------------ *
 * Compliance (§6, §66, §67)
 * ------------------------------------------------------------------ */

test('compliance: sanctions block cannot be overridden', () => {
  resetProfile();
  const res = evaluateCompliance({
    countryCode: 'MY',
    feature: 'send',
    amountMinor: 1000n,
    destination: 'sanctioned-address-0xdead'
  });
  assert.equal(res.decision, 'blocked');
});

test('compliance: unverified KYC requires verification, not a bypass', () => {
  resetProfile({ kyc: 'pending' });
  const res = evaluateCompliance({ countryCode: 'MY', feature: 'send', amountMinor: 1000n });
  assert.equal(res.decision, 'verification_required');
  resetProfile();
});

test('compliance: cross-border limits are enforced per country', () => {
  resetProfile();
  const limit = COUNTRIES.BD.limits.dailyCrossBorderMinor;
  const res = evaluateCompliance({
    countryCode: 'BD',
    feature: 'send_global',
    amountMinor: BigInt(limit) + 1n,
    isCrossBorder: true
  });
  assert.equal(res.decision, 'limit_exceeded');
});

test('compliance: out-of-scope country is unavailable', () => {
  resetProfile();
  const res = evaluateCompliance({ countryCode: 'US', feature: 'send', amountMinor: 100n });
  assert.equal(res.decision, 'unavailable');
  assert.match(res.reason, /outside your 2-country scope/);
});

/* ------------------------------------------------------------------ *
 * Portfolio states (§3, §23)
 * ------------------------------------------------------------------ */

test('portfolio: spendable is never the same number as market value', () => {
  resetProfile();
  const s = summarize();
  const total = BigInt(s.totalMinor);
  const spendable = BigInt(s.spendableMinor);
  assert.ok(total > 0n);
  assert.ok(spendable > 0n);
  assert.ok(spendable < total, 'some balances must be non-spendable for this assertion to be meaningful');
});

test('portfolio: every balance state is accounted for', () => {
  resetProfile();
  const s = summarize();
  const sumOfStates = s.byState.reduce((acc, st) => acc + BigInt(st.minor), 0n);
  assert.equal(sumOfStates, BigInt(s.totalMinor), 'states must sum to the total — no balance may be dropped');
  assert.equal(s.byState.length, 5);
});

test('portfolio: five asset groups are produced with captions', () => {
  resetProfile();
  const groups = assetGroups();
  assert.equal(groups.length, 5);
  for (const g of groups) {
    assert.ok(g.label);
    assert.ok(g.caption, `${g.label} needs a caption`);
    assert.ok(typeof g.totalMinor === 'string');
  }
});

test('portfolio: invested positions are not counted as spendable', () => {
  resetProfile();
  const s = summarize();
  assert.ok(BigInt(s.investedMinor) > 0n);
  const spendableRecords = store.state.positions.filter((p) => p.state === 'spendable');
  assert.equal(spendableRecords.length, 0, 'a DeFi position must never be spendable');
});

test('portfolio: stablecoins carry issuer and backing risk metadata', () => {
  resetProfile();
  const hub = stablecoinHub();
  assert.ok(hub.length > 0);
  for (const coin of hub) {
    assert.ok(coin.issuer);
    assert.ok(coin.backing);
    assert.ok(['low', 'medium', 'high'].includes(coin.risk));
    assert.ok(coin.note.includes('not interchangeable'));
  }
});

test('portfolio: chain exposure always labels asset + chain', () => {
  resetProfile();
  const chains = chainExposure();
  assert.ok(chains.length > 0);
  for (const c of chains) {
    assert.ok(c.chain);
    assert.ok(c.assets.length > 0);
    assert.ok(c.assets.every((a) => a.asset));
  }
});

test('portfolio: narrative separates facts, estimates and opinion', () => {
  resetProfile();
  const n = describePortfolio();
  assert.ok(n.fact.startsWith('Your portfolio is'));
  assert.ok(n.estimate.includes('spendable'));
  assert.equal(n.opinion, null);
  assert.match(n.caveat, /not investment advice/i);
});

test('portfolio: out-of-scope balances are excluded from the summary', () => {
  resetProfile({ homeCountry: 'MY', visitingCountry: null, travelActive: false });
  const withTravelOff = summarize();
  resetProfile({ homeCountry: 'MY', visitingCountry: 'BD', travelActive: true });
  const withTravelOn = summarize();
  assert.ok(
    BigInt(withTravelOn.totalMinor) > BigInt(withTravelOff.totalMinor),
    'adding the visiting country must add its balances'
  );
});

test('portfolio: usdMinor never invents a value for an unknown asset', () => {
  assert.equal(usdMinor({ asset: 'NOTACOIN', minor: '100', decimals: 2 }), 0n);
});

/* ------------------------------------------------------------------ *
 * DeFi (§16–§21, §50, §51)
 * ------------------------------------------------------------------ */

test('defi: simulation returns concrete numbers, never placeholders', () => {
  resetProfile();
  const sim = simulate({ providerId: 'uniswap', action: 'swap', chain: 'base', from: 'ETH', to: 'USDC', amount: '1' });
  assert.ok(BigInt(sim.input.amountMinor) > 0n);
  assert.ok(BigInt(sim.expectedOutput.amountMinor) > 0n);
  assert.ok(BigInt(sim.gas.amountMinor) >= 0n);
  assert.ok(Number.isInteger(sim.priceImpactBps));
  assert.ok(sim.route.includes('ETH'));
  assert.ok(sim.description.includes('Uniswap'));
  assert.ok(sim.chain.name);
});

test('defi: simulation shows contract address and function, never opaque', () => {
  resetProfile();
  const sim = simulate({ providerId: 'uniswap', action: 'swap', chain: 'base', from: 'ETH', to: 'USDC', amount: '1' });
  assert.ok(sim.contract.address);
  assert.ok(sim.contract.function);
  assert.equal(sim.contract.verified, true);
});

test('defi: exact-amount approval is the default, never unlimited', () => {
  resetProfile();
  const sim = simulate({ providerId: 'aave', action: 'supply', chain: 'base', from: 'USDC', to: 'USDC', amount: '100' });
  assert.equal(sim.approval.required, true);
  assert.equal(sim.approval.exact, true);
  assert.equal(sim.approval.amount, sim.input.amountMinor);
  assert.equal(sim.approval.warning, null);
});

test('defi: risk assessment names its factors and disclaims audits', () => {
  resetProfile();
  const risk = assessRisk('aave', 'base', { action: 'supply' });
  assert.ok(['low', 'medium', 'high'].includes(risk.level));
  assert.ok(risk.reasons.length >= 3);
  assert.ok(risk.factors.auditStatus);
  assert.ok(risk.factors.contractVerification);
  assert.ok(risk.factors.oracleDependency);
  assert.ok(risk.factors.bridgeRisk);
  assert.match(risk.disclaimer, /not an audit/i);
});

test('defi: borrowing adds liquidation risk', () => {
  resetProfile();
  const supply = assessRisk('aave', 'base', { action: 'supply' });
  const borrow = assessRisk('aave', 'base', { action: 'borrow' });
  assert.ok(borrow.score > supply.score);
  assert.ok(borrow.reasons.some((r) => /liquidation/i.test(r)));
});

test('defi: simulation is blocked where the jurisdiction prohibits DeFi', () => {
  resetProfile({ homeCountry: 'BD', visitingCountry: null, travelActive: false });
  assert.throws(
    () => simulate({ providerId: 'uniswap', action: 'swap', chain: 'base', from: 'ETH', to: 'USDC', amount: '1' }),
    /DeFi|not permitted|not available/i
  );
  resetProfile();
});

test('defi: a protocol on an unsupported chain is refused', () => {
  resetProfile();
  assert.throws(
    () => simulate({ providerId: 'lido', action: 'stake', chain: 'solana', from: 'ETH', to: 'ETH', amount: '1' }),
    /not deployed on Solana/i
  );
});

test('defi: an unsupported action for a protocol is refused', () => {
  resetProfile();
  assert.throws(
    () => simulate({ providerId: 'uniswap', action: 'borrow', chain: 'base', amount: '1' }),
    /does not advertise/i
  );
});

test('defi: bridge routes are labelled as bridges, never as transfers', () => {
  resetProfile();
  const routes = crossChainRoutes({ fromChain: 'ethereum', toChain: 'base', asset: 'USDC', amount: '1000' });
  assert.ok(routes.routes.length >= 2);
  for (const r of routes.routes) {
    assert.match(r.disclosure, /bridge, not a simple transfer/i);
    assert.ok(r.securityModel);
    assert.ok(r.risk);
  }
});

test('defi: same-chain "bridge" is rejected', () => {
  resetProfile();
  assert.throws(() => crossChainRoutes({ fromChain: 'base', toChain: 'base' }), /same — this is a direct transfer/i);
});

test('defi: only registry-verified contracts appear as verified', () => {
  for (const [protocol, chains] of Object.entries(CONTRACTS)) {
    for (const [chain, entry] of Object.entries(chains)) {
      assert.equal(entry.verified, true);
      assert.match(entry.address, /^0x[a-fA-F0-9]{40}$/, `${protocol}/${chain} address must be a valid hex address`);
    }
  }
});

test('defi: positions are always labelled asset + chain', () => {
  resetProfile();
  const positions = defiPositions();
  assert.ok(positions.length > 0);
  for (const p of positions) {
    assert.ok(p.valueLabel.includes('—'), 'position label must be "ASSET — Chain"');
    assert.ok(p.risk.level);
  }
});

test('defi: protocols list only vetted categories', () => {
  resetProfile();
  const protocols = defiProtocols();
  assert.ok(protocols.length > 0);
  for (const p of protocols) {
    assert.ok(['dex', 'defi'].includes(p.kind));
    assert.ok(Array.isArray(p.chains));
  }
});

/* ------------------------------------------------------------------ *
 * Transaction state machine (§46)
 * ------------------------------------------------------------------ */

test('transactions: legal transitions are enumerated and terminal states are closed', () => {
  assert.ok(TRANSITIONS.CREATED.includes('QUOTED'));
  assert.equal(TRANSITIONS.CONFIRMED.length, 1); // only REVERSED
  for (const failure of FAILURE_STATES) {
    assert.deepEqual(TRANSITIONS[failure], [], `${failure} must be terminal`);
  }
  for (const state of TERMINAL_STATES) {
    assert.ok(Object.keys(TRANSITIONS).includes(state));
  }
});

test('transactions: an illegal transition is rejected', () => {
  const tx = { id: 'tx_test', state: 'CREATED', type: 'send', typeLabel: 'Send' };
  assert.throws(() => transition(tx, 'CONFIRMED'), /Illegal transaction transition/);
  assert.equal(tx.state, 'CREATED');
});

test('transactions: creating a transaction stops at AWAITING_APPROVAL', () => {
  resetProfile();
  const { transaction } = createTransaction(
    { type: 'send', amount: '10', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  assert.equal(transaction.state, 'AWAITING_APPROVAL');
  assert.equal(transaction.guard.passed, true);
  assert.ok(transaction.timeline.length >= 2);
});

test('transactions: submitting without authorization is refused', () => {
  resetProfile();
  const { transaction } = createTransaction(
    { type: 'send', amount: '10', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  assert.throws(() => submitTransaction(transaction.id), /not authorized/i);
});

test('transactions: authorization requires the execute capability', () => {
  resetProfile();
  sandbox.revokeAll();
  const { transaction } = createTransaction(
    { type: 'send', amount: '10', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  assert.throws(() => authorizeTransaction(transaction.id), /permission required/i);

  sandbox.grant('execute', { actor: 'test' });
  const authorized = authorizeTransaction(transaction.id, { biometric: true });
  assert.equal(authorized.state, 'AUTHORIZED');

  const submitted = submitTransaction(transaction.id);
  assert.equal(submitted.state, 'CONFIRMED');
  sandbox.grant('observe', { actor: 'test' });
});

test('transactions: a rejected transaction is terminal and reversible never implies success', () => {
  resetProfile();
  sandbox.grant('execute', { actor: 'test' });
  const { transaction } = createTransaction(
    { type: 'send', amount: '5', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  rejectTransaction(transaction.id, 'test reject');
  assert.equal(transaction.state, 'REJECTED');
  const presented = presentTransaction(transaction);
  assert.equal(presented.isSuccess, false);
  assert.equal(presented.isTerminal, true);
});

test('transactions: CONFIRMED without settlement is not reported as settled', () => {
  const fake = {
    id: 'tx_fake', type: 'send', typeLabel: 'Send', state: 'CONFIRMED',
    amountMinor: '100', amountDecimals: 2, asset: 'USD', receiveMinor: null,
    createdAt: new Date().toISOString()
  };
  const presented = presentTransaction(fake);
  assert.equal(presented.isSuccess, true);
  assert.match(presented.statusNote, /verifying settlement/i);
});

/* ------------------------------------------------------------------ *
 * Zlet Guard (§28)
 * ------------------------------------------------------------------ */

test('guard: a frozen Zlet blocks every transaction', () => {
  resetProfile();
  store.state.guard.frozen = true;
  try {
    assert.throws(
      () => createTransaction(
        { type: 'send', amount: '10', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
        { actor: 'test' }
      ),
      /locked/i
    );
  } finally {
    store.state.guard.frozen = false;
  }
});

test('guard: a new recipient requires confirmation', () => {
  resetProfile();
  const result = evaluateGuard({
    amountMinor: 100n,
    asset: 'USD',
    providerId: 'wise',
    isNewRecipient: true,
    countryCode: 'MY'
  });
  assert.equal(result.passed, true);
  assert.ok(result.confirming.some((c) => c.rule === 'new-recipient'));
});

test('guard: a bridge requires explicit approval', () => {
  resetProfile();
  const result = evaluateGuard({
    amountMinor: 100n, asset: 'USD', providerId: 'walletconnect', isBridge: true, countryCode: 'MY'
  });
  assert.ok(result.confirming.some((c) => c.rule === 'bridge-approval'));
});

test('guard: an unknown provider is a blocking rule', () => {
  resetProfile();
  const result = evaluateGuard({ amountMinor: 100n, asset: 'USD', providerId: 'ghost-provider', countryCode: 'MY' });
  assert.equal(result.passed, false);
  assert.ok(result.blocking.some((c) => c.rule === 'known-provider'));
});

test('guard: biometric threshold is reported, not silently skipped', () => {
  resetProfile();
  store.state.guard.requireBiometricAboveMinor = 1000; // $10
  try {
    const result = evaluateGuard({ amountMinor: 5000n, asset: 'USD', providerId: 'wise', countryCode: 'MY' });
    assert.equal(result.needsBiometric, true);
  } finally {
    store.state.guard.requireBiometricAboveMinor = 50000;
  }
});

/* ------------------------------------------------------------------ *
 * Idempotency (§47)
 * ------------------------------------------------------------------ */

test('idempotency: the same key never creates a second transaction', () => {
  resetProfile();
  const key = 'idem_unique_test_key';
  const first = createTransaction(
    { type: 'send', amount: '25', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send', idempotencyKey: key },
    { actor: 'test' }
  );
  const second = createTransaction(
    { type: 'send', amount: '25', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send', idempotencyKey: key },
    { actor: 'test' }
  );

  assert.equal(second.replayed, true);
  assert.equal(second.transaction.id, first.transaction.id);

  const count = store.state.transactions.filter((t) => t.idempotencyKey === key).length;
  assert.equal(count, 1, 'a retry must not double-pay');
});

test('idempotency: distinct keys do create distinct transactions', () => {
  resetProfile();
  const a = createTransaction(
    { type: 'send', amount: '1', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  const b = createTransaction(
    { type: 'send', amount: '1', asset: 'USD', providerId: 'wise', countryCode: 'MY', feature: 'send' },
    { actor: 'test' }
  );
  assert.notEqual(a.transaction.id, b.transaction.id);
});

/* ------------------------------------------------------------------ *
 * Fee transparency (§49)
 * ------------------------------------------------------------------ */

test('fees: every material component is disclosed', () => {
  resetProfile();
  const quote = buildQuote({
    from: 'USD', to: 'MYR', amountMinor: toMinor('1000', 2),
    providerFeeBps: 100, providerFeeFixed: 100, spreadBps: 40, slippageBps: 10,
    networkFeeMinor: 0, provider: 'Test', universe: ['test']
  });
  const rows = feeBreakdown(quote);
  const labels = rows.map((r) => r.label);
  for (const required of ['Amount', 'Provider fee', 'Network fee', 'Exchange spread', 'Slippage', 'Total cost', 'Recipient receives']) {
    assert.ok(labels.includes(required), `fee breakdown must disclose ${required}`);
  }
});

/* ------------------------------------------------------------------ *
 * AI assistant (§24, §25, §32)
 * ------------------------------------------------------------------ */

test('ai: the assistant resolves spendable balance from the store', () => {
  resetProfile();
  const res = handleCommand('How much can I actually spend?');
  const s = summarize();
  // The reply must contain the exact figure the store reports, grouped.
  const raw = fromMinor(BigInt(s.spendableMinor), 2);
  const grouped = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  assert.ok(res.reply.includes(grouped), `reply must contain the real spendable figure ${grouped}; got: ${res.reply}`);
  assert.equal(res.facts.intent, 'spendable');
  assert.equal(res.facts.spendableMinor, String(s.spendableMinor));
});

test('ai: the assistant never invents a number for an unknown intent', () => {
  resetProfile();
  const res = handleCommand('what is the meaning of life');
  assert.ok(res.reply.length > 20);
  // It must fall back to real portfolio data, not fabricate an answer.
  assert.ok(res.cards.length > 0);
});

test('ai: send intent returns real ranked routes with real amounts', () => {
  resetProfile();
  const res = handleCommand('send RM500 to John');
  assert.ok(res.reply.includes('MYR') || res.reply.includes('500'));
  const card = res.cards.find((c) => c.type === 'routes');
  assert.ok(card, 'assistant must attach the computed routes');
  if (card.routes.eligibleCount > 0) {
    assert.ok(card.routes.recommended.disclosure.recipientReceives);
  }
});

test('ai: country intent states the 2-country rule', () => {
  resetProfile();
  const res = handleCommand('which countries am I scoped to?');
  assert.match(res.reply, /at most 2 countries/i);
  assert.deepEqual(res.facts.scope, ['MY', 'BD']);
});

test('ai: pending intent reports only unsettled transactions', () => {
  resetProfile();
  const res = handleCommand('what is pending?');
  assert.ok('pendingCount' in res.facts);
  assert.ok(res.facts.pendingCount >= 0);
});

test('ai: every reply carries provenance metadata', () => {
  resetProfile();
  for (const q of ['show my assets', 'show my defi exposure', 'what is pending?', 'help']) {
    const res = handleCommand(q);
    assert.ok(res.facts.at, `${q} must be timestamped`);
    assert.equal(res.facts.qualifiesAsFacts, true);
  }
});

test('ai: transaction search filters by state and window', () => {
  resetProfile();
  const failed = searchTransactions('failed');
  assert.ok(Array.isArray(failed));
  assert.ok(failed.every((t) => ['FAILED', 'REJECTED', 'EXPIRED'].includes(t.state)));
});

/* ------------------------------------------------------------------ *
 * Merchant / requests (§14, §34, §35, §36)
 * ------------------------------------------------------------------ */

test('merchant: rails are resolved per country and never invented', () => {
  resetProfile();
  const my = paymentRails('MY');
  assert.ok(my.rails.length > 0);
  assert.ok(my.rails.every((r) => getProvider(r.id).countries.includes('MY')));

  const outOfScope = paymentRails('US');
  assert.equal(outOfScope.rails.length, 0);
  assert.match(outOfScope.blocked, /outside your two-country scope/);
});

test('merchant: a request generates a deterministic payload and reference', () => {
  resetProfile();
  const rec = createRequest({ kind: 'request', amount: '250', asset: 'MYR', countryCode: 'MY', description: 'Test' });
  assert.match(rec.reference, /^ZLET-\d{4}-[A-F0-9]{6}$/);
  assert.ok(rec.payload.startsWith('zlet://request/'));
  assert.ok(rec.payload.includes('amount=250.00'));
  assert.ok(rec.link.includes(rec.reference));
  assert.ok(rec.rails.length > 0);
});

test('merchant: requests are refused where the country cannot receive', () => {
  // Pakistan is in the catalog but has no provider advertising PAY or RECEIVE,
  // so Zlet must refuse to generate a request rather than invent a rail.
  resetProfile({ homeCountry: 'PK', visitingCountry: null, travelActive: false });
  assert.throws(
    () => createRequest({ kind: 'request', amount: '100', asset: 'PKR', countryCode: 'PK' }),
    /No payment rail/i
  );
  resetProfile();
});

test('merchant: reconciliation only accepts CONFIRMED settlements', () => {
  resetProfile();
  sandbox.grant('execute', { actor: 'test' });
  const rec = createRequest({ kind: 'invoice', amount: '100', asset: 'MYR', countryCode: 'MY' });

  const { transaction } = createTransaction(
    { type: 'receive', amount: '100', asset: 'MYR', providerId: 'grabpay', countryCode: 'MY' },
    { actor: 'test' }
  );

  // Still awaiting approval -> must refuse.
  assert.throws(() => reconcilePayment(rec.reference, transaction.id), /Only CONFIRMED/i);

  authorizeTransaction(transaction.id, { biometric: true });
  submitTransaction(transaction.id);
  const reconciled = reconcilePayment(rec.reference, transaction.id);
  assert.ok(['paid', 'partially_paid'].includes(reconciled.status));
});

test('merchant: cancellation is only possible while open', () => {
  resetProfile();
  const rec = createRequest({ kind: 'request', amount: '10', asset: 'MYR', countryCode: 'MY' });
  const cancelled = cancelRequest(rec.reference);
  assert.equal(cancelled.status, 'cancelled');
  assert.throws(() => cancelRequest(rec.reference), /already cancelled/i);
});

/* ------------------------------------------------------------------ *
 * Sandbox / permissions (§27, §40, §41, §62)
 * ------------------------------------------------------------------ */

test('sandbox: observation is granted by default, execution is not', () => {
  sandbox.revokeAll();
  sandbox.grant('observe', { actor: 'test' });
  assert.equal(sandbox.hasCapability('read:balances'), true);
  assert.equal(sandbox.hasCapability('execute'), false);
  assert.equal(sandbox.currentLevel(), 'observe');
});

test('sandbox: locking revokes everything and freezes execution', () => {
  resetProfile();
  sandbox.grant('execute', { actor: 'test' });
  const locked = sandbox.lockZlet({ actor: 'test' });
  assert.equal(locked.frozen, true);
  assert.equal(sandbox.hasCapability('execute'), false);
  assert.equal(store.state.guard.frozen, true);

  const unlocked = sandbox.unlockZlet({ actor: 'test' });
  assert.equal(unlocked.frozen, false);
  assert.equal(sandbox.hasCapability('read:balances'), true);
  assert.equal(sandbox.hasCapability('execute'), false, 'unlock must not restore execute');
});

test('sandbox: sensitive capabilities are flagged', () => {
  const snapshot = sandbox.snapshot();
  for (const cap of ['execute', 'manage', 'defi', 'high:risk']) {
    const entry = snapshot.capabilities.find((c) => c.capability === cap);
    assert.equal(entry.sensitive, true, `${cap} must be marked sensitive`);
  }
  const read = snapshot.capabilities.find((c) => c.capability === 'read:balances');
  assert.equal(read.sensitive, false);
});

test('sandbox: an audit entry is written for every consequential action', () => {
  resetProfile();
  const before = store.state.activityLog.length;
  sandbox.grant('analyze', { actor: 'test' });
  assert.ok(store.state.activityLog.length > before);
  assert.ok(store.state.activityLog.some((a) => a.type === 'PERMISSION_GRANTED'));
});

/* ------------------------------------------------------------------ *
 * HTTP API smoke tests against a real server
 * ------------------------------------------------------------------ */

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  try {
    return await fn(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('http: health responds with the app identity', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.app, 'zlet');
    assert.equal(body.status, 'ok');
  });
});

test('http: bootstrap exposes the two-country scope and max limit', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/bootstrap`);
    const body = await res.json();
    assert.equal(body.maxActiveCountries, 2);
    assert.ok(body.scope.length <= 2);
    assert.ok(body.summary.totalMinor);
    assert.ok(Array.isArray(body.groups));
    assert.ok(body.availability);
    assert.equal(body.profile.homeCountry, 'MY');
  });
});

test('http: security headers are present', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  });
});

test('http: send routing returns ranked routes', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/route/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: '1000', asset: 'USD', destinationCountry: 'BD' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.eligibleCount >= 1);
    assert.ok(body.recommended);
  });
});

test('http: travel mode replaces the visiting country and never exceeds two', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/countries/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitingCountry: 'SG', travelActive: true })
    });
    const body = await res.json();
    assert.equal(body.profile.homeCountry, 'MY');
    assert.equal(body.profile.visitingCountry, 'SG');
    assert.ok(body.active.length <= 2);
    resetProfile();
  });
});

test('http: setting the visiting country equal to home is a 400', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/countries/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitingCountry: 'MY', travelActive: true })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.code, 'SAME_COUNTRY');
  });
});

test('http: an unknown country is a 400 with UNKNOWN_COUNTRY', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/countries/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitingCountry: 'ZZ', travelActive: true })
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).code, 'UNKNOWN_COUNTRY');
  });
});

test('http: malformed JSON is a 400, not a crash', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/route/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json'
    });
    assert.equal(res.status, 400);
  });
});

test('http: an unknown API path is a JSON 404', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/does-not-exist`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.ok(body.error);
  });
});

test('http: a cross-origin mutation is refused', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/security/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
      body: '{}'
    });
    assert.equal(res.status, 403);
    assert.equal(store.state.guard.frozen, false);
  });
});

test('http: the AI command endpoint returns provenance and cards', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/ai/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'How much can I actually spend?' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply.length > 20);
    assert.ok(body.facts.at);
    assert.ok(Array.isArray(body.cards));
  });
});

test('http: the static client is served with a CSP', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp.includes("default-src 'self'"));
    assert.ok(csp.includes("frame-ancestors 'none'"));
    const html = await res.text();
    assert.ok(html.includes('Zlet'));
  });
});

test('http: path traversal is refused', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/../server/store.js`);
    assert.ok([403, 404].includes(res.status));
  });
});

test('http: DeFi simulation endpoint returns concrete numbers', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/defi/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: 'uniswap', action: 'swap', chain: 'base', from: 'ETH', to: 'USDC', amount: '1' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(BigInt(body.expectedOutput.amountMinor) > 0n);
    assert.ok(body.contract.address);
    assert.ok(body.risk.level);
  });
});

test('http: a transaction created via the API starts at AWAITING_APPROVAL', async () => {
  resetProfile();
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'http_test_key_1' },
      body: JSON.stringify({
        type: 'send', amount: '12', asset: 'USD',
        providerId: 'wise', countryCode: 'MY', feature: 'send'
      })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.transaction.state, 'AWAITING_APPROVAL');
    assert.equal(body.replayed, false);
  });
});
