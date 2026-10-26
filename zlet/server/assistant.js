/**
 * Zlet — AI financial assistant (prompt §4, §24, §25, §32, §45, §52, §58).
 *
 * Design decision: the reasoning layer is deterministic and local by default, so
 * it is auditable and can never hallucinate. It resolves intent, then calls the
 * REAL engines (portfolio, router, fx, transactions) and reports their output.
 *
 * Hard rule (§25): the assistant is structurally incapable of inventing a
 * balance, rate, fee, address or status — every number in a reply comes from a
 * generator that reads the encrypted store or an engine result. When data is
 * stale it says so with a timestamp.
 */

import { store } from './store.js';
import { config } from './config.js';
import { ASSET_DECIMALS } from './fx.js';
import { formatMoney, fromMinor, toMinor } from './money.js';
import { activeCountries, country as countryMeta, featureAvailability } from './countries.js';
import { buildExchangeRoutes, buildSendRoutes, remittanceCorridors } from './router.js';
import { describePortfolio, summarize, breakdown, stablecoinHub, scopedRecords, usdMinor } from './portfolio.js';
import { defiPositions } from './defi.js';
import { listTransactions, STATE_LABELS } from './transactions.js';
import { listSubscriptions } from './merchant.js';
import { logActivity } from './sandbox.js';

const PEOPLE = [
  { match: /\bjohn\b/i, name: 'John Tan', handle: 'john@varizen.co', country: 'MY' },
  { match: /\bsarah\b/i, name: 'Sarah K.', handle: 'sarah.k@varizen.co', country: 'MY' },
  { match: /\b(rakib|rahim)\b/i, name: 'Rakib Hasan', handle: '+8801700000000', country: 'BD' },
  { match: /\bmum|mother|mom\b/i, name: 'Mother', handle: '+60123456789', country: 'MY' }
];

const INTENTS = [
  { id: 'portfolio_total', re: /(how much|what.s my|total).*(have|worth|value|available|balance)/i },
  { id: 'spendable', re: /(actually|really).*(spend|available)|spend(able)? (now|today)|available to spend/i },
  { id: 'idle', re: /idle|sitting (idle|there)|not earning|unused/i },
  { id: 'send_cost', re: /(cheapest|best|cheaper|lowest).*(way|route|cost).*(send|transfer|remit)|send.*(cheapest|best route)/i },
  { id: 'send', re: /\bsend\b.+/i },
  { id: 'convert', re: /\b(convert|swap|exchange)\b/i },
  { id: 'defi_exposure', re: /defi (exposure|positions?)|my defi|liquidity|staking|yield/i },
  { id: 'pending', re: /pending|in progress|not (yet )?settled|why.*(pending|fail)/i },
  { id: 'stablecoins', re: /stablecoin|usdc|usdt|dai/i },
  { id: 'countries', re: /(which|what) countries|home country|visiting|travel|jurisdiction|where am i/i },
  { id: 'availability', re: /available|supported|allowed|can i (use|do)|permitted/i },
  { id: 'transactions', re: /(show|find|list).*(transaction|spent|paid|received)|this week|last month/i },
  { id: 'fees', re: /highest fee|fee(s)? (this|last)|how much.*fee|expensive/i },
  { id: 'subscriptions', re: /subscription|recurring/i },
  { id: 'prepare', re: /prepare|draft|don.t execute|unsigned/i },
  { id: 'why_failed', re: /why.*(fail|reject)|failed transaction/i },
  { id: 'assets', re: /my (assets|wallets|accounts|balances)/i }
];

function freshLabel() {
  const at = store.state.settings.lastSyncAt;
  if (!at) return 'Never synchronized.';
  const minutes = Math.round((Date.now() - new Date(at).getTime()) / 60_000);
  if (minutes <= 0) return 'Last synchronized just now.';
  if (minutes < 60) return `Last synchronized ${minutes} minute${minutes === 1 ? '' : 's'} ago.`;
  return `Last synchronized ${Math.round(minutes / 60)} hour${minutes < 120 ? '' : 's'} ago.`;
}

function isStale() {
  const at = store.state.settings.lastSyncAt;
  if (!at) return true;
  return Date.now() - new Date(at).getTime() > config.stalenessWarnMinutes * 60_000;
}

function findPerson(text) {
  for (const p of PEOPLE) if (p.match.test(text)) return p;
  return null;
}

/** Parse "RM500", "$1,000", "1000 USDC", "500 ringgit". */
function parseAmount(text) {
  const currencyMap = [
    { re: /\b(rm|myr|ringgit)\b|\brm\s*\d|^rm/i, asset: 'MYR' },
    { re: /\b(bdt|taka|\u09f3)\b|\u09f3\s*\d/i, asset: 'BDT' },
    { re: /\b(sgd|s\$)\b|s\$\s*\d/i, asset: 'SGD' },
    { re: /\b(aed|dirham)\b/i, asset: 'AED' },
    { re: /\b(gbp|\u00a3|pound)\b|\u00a3\s*\d/i, asset: 'GBP' },
    { re: /\b(eur|\u20ac|euro)\b|\u20ac\s*\d/i, asset: 'EUR' },
    { re: /\b(inr|\u20b9|rupee)\b|\u20b9\s*\d/i, asset: 'INR' },
    { re: /\b(pkr|\u20a8)\b|\u20a8\s*\d/i, asset: 'PKR' },
    { re: /\b(aud|a\$)\b|a\$\s*\d/i, asset: 'AUD' },
    { re: /\busdc\b/i, asset: 'USDC' },
    { re: /\busdt\b/i, asset: 'USDT' },
    { re: /\b(eth|ethereum)\b/i, asset: 'ETH' },
    { re: /\b(btc|bitcoin)\b/i, asset: 'BTC' },
    { re: /\b(sol|solana)\b/i, asset: 'SOL' }
  ];
  const numberMatch = text.match(/(?:rm|myr|\$|৳|s\$|£|€|₹|₨|a\$)?\s*([\d][\d,]*(?:\.\d+)?)\s*(?:k\b)?/i);
  if (!numberMatch) return null;

  let value = numberMatch[1].replace(/,/g, '');
  if (/\d\s*k\b/i.test(numberMatch[0])) value = String(Number(value) * 1000);

  let asset = store.state.profile.currency || 'USD';
  for (const entry of currencyMap) if (entry.re.test(text)) { asset = entry.asset; break; }

  const decimals = ASSET_DECIMALS[asset] ?? 2;
  return { value, asset, minor: toMinor(value, decimals), decimals };
}

function transactionIntent(text) {
  const person = findPerson(text);
  const amount = parseAmount(text);
  if (!amount) return null;
  const destination = person?.country || store.state.profile.visitingCountry || store.state.profile.homeCountry;
  try {
    const routes = buildSendRoutes({
      amount: amount.value,
      asset: amount.asset,
      destinationCountry: destination,
      recipient: person?.name || 'Recipient'
    });
    return { person, amount, destination, routes };
  } catch (err) {
    return { person, amount, destination, error: err.message };
  }
}

function convertIntent(text) {
  const amount = parseAmount(text);
  if (!amount) return null;
  const toMatch = text.match(/(?:to|into)\s+([A-Z]{2,5})\b/i) || text.match(/\b(usdc|usdt|eth|btc|sol|myr|bdt|sgd|aed|gbp|eur|inr|pkr|aud)\b/i);
  if (!toMatch) return null;
  const to = toMatch[1].toUpperCase();
  try {
    return { routes: buildExchangeRoutes({ from: amount.asset, to, amount: amount.value }), from: amount.asset, to, amount };
  } catch (err) {
    return { error: err.message, from: amount.asset, to, amount };
  }
}

/**
 * Handle a natural-language command.
 * @returns {{ reply: string, facts: object, cards: object[], actions: object[] }}
 */
export function handleCommand(rawText) {
  const text = String(rawText || '').trim();
  if (!text) throw Object.assign(new Error('Ask Zlet something first.'), { status: 400 });

  const intent = INTENTS.find((i) => i.re.test(text)) || { id: 'help' };
  const summary = summarize();
  const cards = [];
  const actions = [];
  const facts = { intent: intent.id, at: new Date().toISOString(), qualifiesAsFacts: true };

  const guardPrefix = () => {
    if (isStale()) return `Provider data is not fresh — ${freshLabel()} `;
    return '';
  };

  switch (intent.id) {
    case 'portfolio_total':
    case 'assets': {
      const desc = describePortfolio();
      facts.totalMinor = summary.totalMinor;
      facts.spendableMinor = summary.spendableMinor;
      cards.push({ type: 'portfolio', ...summary });
      return {
        reply:
          `${guardPrefix()}${desc.estimate} ${desc.fact} ` +
          `Pending: ${shotPending()}. Invested: ${formatMoney(BigInt(summary.investedMinor), 'USD')}. ` +
          `${desc.caveat}`,
        facts,
        cards,
        actions: [{ label: 'Open portfolio', view: 'assets' }]
      };
    }

    case 'spendable': {
      facts.spendableMinor = summary.spendableMinor;
      const restrictedNote = BigInt(summary.restrictedMinor) > 0n
        ? ` ${formatMoney(BigInt(summary.restrictedMinor), 'USD')} is restricted by a provider or jurisdiction rule.`
        : '';
      cards.push({ type: 'states', states: summary.byState });
      return {
        reply:
          `${guardPrefix()}You can spend ${formatMoney(BigInt(summary.spendableMinor), 'USD')} right now. ` +
          `${formatMoney(BigInt(summary.transferableMinor), 'USD')} is transferable but not directly spendable, and ` +
          `${formatMoney(BigInt(summary.investedMinor), 'USD')} is deployed.${restrictedNote}`,
        facts,
        cards,
        actions: [{ label: 'See breakdown', view: 'assets' }]
      };
    }

    case 'idle': {
      const idle = BigInt(summary.spendableMinor) + BigInt(summary.transferableMinor);
      facts.idleMinor = idle.toString();
      return {
        reply:
          `${formatMoney(idle, 'USD')} is sitting idle — spendable or transferable but not deployed. ` +
          'Moving it into any yield position is your decision: Zlet will show the risk before you confirm, and never suggests yield as advice.',
        facts,
        cards: [{ type: 'portfolio', ...summary }],
        actions: [{ label: 'Open DeFi sandbox', view: 'defi' }]
      };
    }

    case 'send_cost':
    case 'send':
    case 'prepare': {
      const parsed = transactionIntent(text);
      if (!parsed) {
        return {
          reply: 'Tell me the amount and who it is for — for example “send RM500 to John” or “cheapest way to send $2,000 to Bangladesh”.',
          facts,
          cards: [],
          actions: []
        };
      }
      if (parsed.error) return { reply: `I can’t quote that route: ${parsed.error}`, facts, cards: [], actions: [] };

      const { routes, amount, person, destination } = parsed;
      facts.destination = destination;
      facts.amountMinor = amount.minor.toString();
      facts.asset = amount.asset;
      facts.eligibleRoutes = routes.eligibleCount;

      if (!routes.eligibleCount) {
        return {
          reply: `${guardPrefix()}${routes.message}`,
          facts,
          cards: [{ type: 'routes', routes }],
          actions: [{ label: 'See availability', view: 'availability' }]
        };
      }
      const best = routes.recommended;
      const alt = routes.alternatives[0];
      const prepareOnly = intent.id === 'prepare';

      cards.push({ type: 'routes', routes });
      actions.push({ label: prepareOnly ? 'Prepare payment' : 'Review & confirm', view: 'send', routeId: best.id });
      if (!prepareOnly) actions.push({ label: 'Prepare only', view: 'sandbox' });

      return {
        reply:
          `${guardPrefix()}I compared ${routes.eligibleCount} legitimate route${routes.eligibleCount === 1 ? '' : 's'} ` +
          `for ${fromMinor(amount.minor, amount.decimals)} ${amount.asset} to ${person?.name || countryMeta(destination)?.name}. ` +
          `Best: ${best.providerName} — ${best.disclosure.recipientReceives} received, total cost ${best.disclosure.totalCost}, ` +
          `ETA ${best.etaMinutes[0]}–${best.etaMinutes[1]} min.` +
          (alt ? ` Alternative: ${alt.providerName} at ${alt.disclosure.totalCost} with a ${alt.etaMinutes[1]} min ETA.` : '') +
          ` ${routes.excluded.length ? `${routes.excluded.length} route(s) were excluded for compliance or corridor reasons.` : ''}` +
          `${prepareOnly ? ' Nothing will be submitted until you approve it.' : ''}`,
        facts,
        cards,
        actions
      };
    }

    case 'convert': {
      const parsed = convertIntent(text);
      if (!parsed) {
        return {
          reply: 'Tell me the pair and the amount — for example “convert 500 USDC to ETH”.',
          facts,
          cards: [],
          actions: []
        };
      }
      if (parsed.error) return { reply: `No route for that conversion: ${parsed.error}`, facts, cards: [], actions: [] };
      const routes = parsed.routes;
      facts.from = parsed.from;
      facts.to = parsed.to;
      facts.eligibleRoutes = routes.eligibleCount;
      cards.push({ type: 'routes', routes });

      if (!routes.eligibleCount) {
        return { reply: `${routes.message} The reference mid rate is ${routes.midMarketReference.label}, but no compliant venue in your scope can execute it.`, facts, cards, actions: [{ label: 'Availability', view: 'availability' }] };
      }
      const best = routes.recommended;
      return {
        reply:
          `Mid-market reference: ${routes.midMarketReference.label} (${routes.midMarketReference.source}). ` +
          `Best executable: ${best.providerName} — you receive ${best.disclosure.recipientReceives}; ` +
          `total cost ${best.disclosure.totalCost} (${(best.costBps / 100).toFixed(2)}% effective). ` +
          `Compared ${routes.eligibleCount} venue(s) inside your two-country scope.`,
        facts,
        cards,
        actions: [{ label: 'Review conversion', view: 'exchange', routeId: best.id }]
      };
    }

    case 'defi_exposure': {
      const positions = defiPositions();
      const total = positions.reduce((acc, p) => acc + usdMinor(p), 0n);
      facts.defiMinor = total.toString();
      facts.positionCount = positions.length;
      cards.push({ type: 'defi', positions });
      return {
        reply: positions.length
          ? `You have ${positions.length} DeFi position${positions.length === 1 ? '' : 's'} worth about ${formatMoney(total, 'USD')} at reference prices. ` +
            `Positions: ${positions.map((p) => `${p.protocolName} (${p.valueLabel})`).join(', ')}. Market value is an estimate; on-chain values move.`
          : 'You have no DeFi positions in your current country scope.',
        facts,
        cards,
        actions: [{ label: 'Open DeFi', view: 'defi' }]
      };
    }

    case 'pending':
    case 'why_failed': {
      const pending = store.state.transactions.filter((t) =>
        ['CREATED', 'QUOTED', 'SIMULATED', 'AWAITING_APPROVAL', 'AUTHORIZED', 'SUBMITTED', 'PROCESSING'].includes(t.state)
      );
      const failed = store.state.transactions.filter((t) => ['FAILED', 'REJECTED', 'EXPIRED'].includes(t.state));
      facts.pendingCount = pending.length;
      cards.push({ type: 'transactions', transactions: listTransactions({ limit: 12 }) });
      const detail = pending.map((t) => `${t.typeLabel} ${fromMinor(BigInt(t.amountMinor), t.amountDecimals)} ${t.asset} — ${STATE_LABELS[t.state]}`).join('; ');
      return {
        reply: pending.length
          ? `${pending.length} transaction${pending.length === 1 ? '' : 's'} not settled: ${detail}. ` +
            'A provider request being accepted is not settlement — each one moves to Confirmed only after the provider confirms, and settlement is verified separately.'
          : 'Nothing is pending. Every transaction has reached a terminal state.',
        facts,
        cards,
        actions: failed.length ? [{ label: `Review ${failed.length} failed`, view: 'activity', filter: 'failed' }] : [{ label: 'Open activity', view: 'activity' }]
      };
    }

    case 'stablecoins': {
      const hub = stablecoinHub();
      const total = hub.reduce((acc, s) => acc + BigInt(s.usdMinor), 0n);
      facts.stablecoinMinor = total.toString();
      cards.push({ type: 'stablecoins', coins: hub });
      return {
        reply: hub.length
          ? `${hub.length} stablecoin balance${hub.length === 1 ? '' : 's'} totalling about ${formatMoney(total, 'USD')}: ` +
            hub.map((s) => `${s.label} — ${s.risk} risk`).join(', ') +
            '. Stablecoins are not equivalent — issuer, backing and redemption terms differ.'
          : 'No stablecoin balances inside your country scope.',
        facts,
        cards,
        actions: [{ label: 'Open stablecoins', view: 'assets' }]
      };
    }

    case 'countries':
    case 'availability': {
      const scope = activeCountries(store.state.profile);
      facts.scope = scope.map((c) => c.code);
      cards.push({ type: 'availability', scope });
      const list = scope.map((c) => `${c.flag} ${c.name} (${c.code === store.state.profile.homeCountry ? 'home' : 'visiting'})`).join(' and ');
      return {
        reply:
          `Your account is scoped to ${list || 'no country'} — Zlet supports at most ${config.maxActiveCountries} countries: ` +
          'one home country and one visiting country. ' +
          'Any route outside that scope is excluded before it is compared, and features are checked against each country’s rules individually.',
        facts,
        cards,
        actions: [{ label: 'Open availability', view: 'availability' }, { label: 'Manage countries', view: 'settings' }]
      };
    }

    case 'transactions': {
      const txs = listTransactions({ limit: 25 });
      const total = txs.filter((t) => t.isSuccess && t.type !== 'receive').reduce((acc, t) => acc + BigInt(t.amountMinor), 0n);
      facts.transactionCount = txs.length;
      facts.confirmedSpendMinor = total.toString();
      cards.push({ type: 'transactions', transactions: txs });
      return {
        reply: txs.length
          ? `${txs.length} transaction${txs.length === 1 ? '' : 's'} in your activity. ` +
            `Confirmed outgoing total: ${formatMoney(total, 'USD')}. Search matches source, provider, recipient, asset and state.`
          : 'No transactions yet.',
        facts,
        cards,
        actions: [{ label: 'Open activity', view: 'activity' }]
      };
    }

    case 'fees': {
      const withFees = store.state.transactions.filter((t) => t.feeBreakdown);
      const ranked = [...withFees].sort((a, b) => Number(b.quoteId ? 1 : 0) - Number(a.quoteId ? 1 : 0)).slice(0, 5);
      facts.feeSampleSize = withFees.length;
      return {
        reply: withFees.length
          ? `I can rank the last ${withFees.length} transactions that recorded a fee breakdown. Open any transaction to see provider fee, network fee, spread, slippage and total cost — Zlet never hides a material fee.`
          : 'No transaction has recorded a fee breakdown yet, so there is nothing to rank.',
        facts,
        cards: [{ type: 'transactions', transactions: ranked.map((t) => ({ ...t, stateLabel: STATE_LABELS[t.state] })) }],
        actions: [{ label: 'Open activity', view: 'activity' }]
      };
    }

    case 'subscriptions': {
      const subs = listSubscriptions();
      facts.subscriptionCount = subs.length;
      return {
        reply: subs.length
          ? `${subs.length} recurring payment${subs.length === 1 ? '' : 's'} tracked: ` +
            subs.map((s) => `${s.merchant} (${formatMoney(BigInt(s.amountMinor), s.asset)} ${s.frequency})`).join(', ') +
            '. Zlet never cancels a service automatically.'
          : 'No recurring payments detected in your connected providers.',
        facts,
        cards: [{ type: 'subscriptions', subscriptions: subs }],
        actions: [{ label: 'Manage subscriptions', view: 'merchant' }]
      };
    }

    default: {
      const desc = describePortfolio();
      return {
        reply:
          `I can answer questions about your real connected data. Try: “How much can I actually spend?”, ` +
          `“What’s the cheapest way to send $2,000 to Bangladesh?”, “Convert 500 USDC to ETH”, “Show my DeFi exposure”, ` +
          `“What’s pending?”, “Which countries am I scoped to?”. ${desc.estimate}`,
        facts,
        cards: [{ type: 'portfolio', ...summary }],
        actions: [{ label: 'Open portfolio', view: 'assets' }]
      };
    }
  }
}

function shotPending() {
  const pending = store.state.transactions.filter((t) => !['CONFIRMED', 'REJECTED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REVERSED'].includes(t.state));
  return pending.length ? `${pending.length} transaction${pending.length === 1 ? '' : 's'}` : 'none';
}

/** AI activity log (§45). */
export function aiActivity(limit = 40) {
  return store.state.activityLog
    .filter((a) => /^AI_|ROUTE|QUOTE|SIMULAT|COMPAR|PREPAR|GUARD|PERMISSION|ZLET_/.test(a.type))
    .slice(0, limit);
}

/** Natural-language transaction search (§32). */
export function searchTransactions(query) {
  const text = String(query || '').toLowerCase();
  if (!text) return listTransactions({ limit: 40 });

  const filters = {};
  if (/failed|rejected|expired/.test(text)) filters.state = null;
  const txs = listTransactions({ limit: 200, search: text.replace(/\b(this|last|week|month|all|show|find|me|my)\b/g, '').trim() || null });

  let results = txs;
  if (/failed/.test(text)) results = results.filter((t) => ['FAILED', 'REJECTED', 'EXPIRED'].includes(t.state));
  if (/pending/.test(text)) results = results.filter((t) => !t.isTerminal);
  if (/defi/.test(text)) results = results.filter((t) => t.type === 'defi');
  if (/this week/.test(text)) {
    const start = Date.now() - 7 * 24 * 3600_000;
    results = results.filter((t) => new Date(t.createdAt).getTime() >= start);
  }
  if (/this month/.test(text)) {
    const start = Date.now() - 30 * 24 * 3600_000;
    results = results.filter((t) => new Date(t.createdAt).getTime() >= start);
  }

  logActivity('AI_SEARCH', `Searched transactions: “${query}”`, { refs: { results: results.length } });
  return results;
}

export { STATE_LABELS, breakdown, scopedRecords, featureAvailability };
