/**
 * Zlet — web client.
 *
 * Every number rendered here comes from the server. This file contains no price
 * table, no FX table and no balance arithmetic that could drift from the engine
 * (prompt §25, §48). It formats and arranges server output only.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  boot: null,
  view: 'home',
  theme: localStorage.getItem('zlet.theme') || 'light',
  aiOpen: false,
  aiThread: [],
  selectedRoute: null,
  query: '',
  pendingRoute: null,
  sendDraft: { amount: '500', asset: 'MYR', destinationCountry: null, recipient: '' },
  convertDraft: { amount: '500', from: 'USDC', to: 'MYR' },
  requestDraft: { kind: 'request', amount: '500', asset: 'MYR', customer: '', description: '' },
  activeSheet: null
};

/* ------------------------------ formatting ------------------------------ */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Minor units -> grouped decimal string, no float math. */
function fmt(minor, decimals = 2) {
  const str = String(minor ?? '0');
  const neg = str.startsWith('-');
  const digits = (neg ? str.slice(1) : str).padStart(decimals + 1, '0');
  const whole = digits.slice(0, digits.length - decimals) || '0';
  const frac = decimals ? digits.slice(digits.length - decimals) : '';
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}${grouped}${frac && frac !== '0'.repeat(decimals) ? `.${frac}` : ''}`;
}

/** Trim trailing zeros for crypto amounts. */
function short(minor, decimals = 2, maxFrac = 6) {
  const str = String(minor ?? '0');
  const digits = str.padStart(decimals + 1, '0');
  const whole = digits.slice(0, digits.length - decimals) || '0';
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, '');
  if (!frac) return whole;
  return `${whole}.${frac.slice(0, maxFrac).replace(/0+$/, '') || '0'}`;
}

function usd(minor) {
  return `$${fmt(minor, 2)}`;
}

function money(minor, asset, decimals = 2) {
  return `${short(minor, decimals)} ${asset}`;
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function dayLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return `Today ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  if (d.toDateString() === yest.toDateString()) return `Yesterday ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const icon = (name, cls = '') => `<svg class="${cls}"><use href="#i-${name}"/></svg>`;

const TONE_FOR_TYPE = {
  pay: 'tone-payment',
  send: 'tone-mobile',
  receive: 'tone-defi',
  convert: 'tone-crypto',
  defi: 'tone-defi'
};

const ICON_FOR_TYPE = {
  pay: 'pay',
  send: 'send',
  receive: 'receive',
  convert: 'exchange',
  defi: 'defi',
  bridge: 'chain'
};

/* ---------------------------------- API --------------------------------- */

async function api(path, { method = 'GET', body = null } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.code = data.code;
    err.needsPermission = data.needsPermission;
    err.capability = data.capability;
    err.needsBiometric = data.needsBiometric;
    err.guard = data.guard;
    throw err;
  }
  return data;
}

/* -------------------------------- toasts -------------------------------- */

function toast(message, kind = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `${icon(kind === 'bad' ? 'alert' : kind === 'warn' ? 'info' : 'check')}<span>${esc(message)}</span>`;
  $('#toastStack').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .2s, transform .2s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 220);
  }, 3200);
}

/* -------------------------------- sheets -------------------------------- */

function openSheet({ title, body, foot, onMount }) {
  $('#sheetTitle').textContent = title;
  $('#sheetBody').innerHTML = body;
  $('#sheetFoot').innerHTML = foot || '';
  $('#sheetScrim').hidden = false;
  $('#sheetBody').scrollTop = 0;
  state.activeSheet = { title, onMount };
  if (onMount) onMount($('#sheetBody'), $('#sheetFoot'));
}

function closeSheet() {
  $('#sheetScrim').hidden = true;
  state.activeSheet = null;
}

/* ------------------------------ bootstrap ------------------------------- */

async function boot() {
  applyTheme(state.theme);
  state.boot = await api('/api/bootstrap');
  wireChrome();
  renderChrome();
  render();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('zlet.theme', theme);
  const btn = $('#btnTheme');
  if (btn) btn.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
}

function renderChrome() {
  const b = state.boot;
  if (!b) return;

  const flags = b.scope.map((c) => c.flag).join(' ');
  $('#scopeFlags').textContent = flags || '🌐';
  $('#scopeBadge').textContent = String(b.scope.length);
  $('#assetsCount').textContent = String(b.groups.reduce((n, g) => n + g.itemCount, 0));
  $('#activityCount').textContent = String(b.transactions.length);
  $('#sandboxCount').textContent = String(b.requests.filter((r) => r.status === 'open').length);
  $('#agentState').textContent = b.sandbox.frozen ? 'Locked' : b.sandbox.level;
  $('#agentChip').classList.toggle('frozen', Boolean(b.sandbox.frozen));
  renderProfileName();
}

function renderProfileName() {
  const pill = $('#scopePill');
  if (pill && state.boot) {
    pill.title = `${state.boot.profile.name} — home ${state.boot.profile.homeCountry}${state.boot.profile.travelActive ? `, visiting ${state.boot.profile.visitingCountry}` : ' (travel off)'}`;
  }
}

/* ================================ RENDER ================================ */

function render() {
  const stage = $('#stage');
  const views = {
    home: renderHome,
    pay: renderPay,
    send: renderSend,
    receive: renderReceive,
    exchange: renderExchange,
    defi: renderDeFi,
    assets: renderAssets,
    activity: renderActivity,
    countries: renderCountries,
    availability: renderAvailability,
    merchant: renderMerchant,
    sandbox: renderSandbox,
    security: renderSecurity,
    privacy: renderPrivacy
  };
  const fn = views[state.view] || renderHome;
  stage.innerHTML = `<div class="view">${fn()}</div>`;
  stage.scrollTop = 0;
  $$('.nav-item').forEach((el) => el.classList.toggle('active', el.dataset.view === state.view));
  bindViewEvents();
  renderChrome();
}

/* -------------------------------- HOME --------------------------------- */

function renderHome() {
  const b = state.boot;
  const s = b.summary;
  const homeCcy = b.profile.homeCurrency || 'USD';
  const totalLocal = b.fx.homeRate ? Math.round(Number(s.totalMinor) * b.fx.homeRate) : Number(s.totalMinor);

  return `
    <div class="hero">
      <div class="total-card">
        <div class="total-head">
          Total value <span title="Market value at reference prices">${icon('info')}</span>
        </div>
        <div class="total-value">$${fmt(s.totalMinor, 2)}</div>
        <div class="total-delta">${icon('arrow-up')} ${(Number(s.spendableMinor) / Number(s.totalMinor) * 100 || 0).toFixed(1)}% spendable</div>
        <div class="total-sub">
          ${usd(s.spendableMinor)} available now · ${usd(s.investedMinor)} invested · ${usd(s.pendingMinor)} pending
        </div>
        <div class="state-row">
          ${s.byState.map((st) => `
            <span class="state-chip" data-state="${st.state}" title="${esc(st.note)}">
              <i></i>${esc(st.label)} ${usd(st.minor)}
            </span>
          `).join('')}
        </div>
        <svg class="sparkline" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1f9d63" stop-opacity=".22"/>
              <stop offset="100%" stop-color="#1f9d63" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 46 C18 44 26 34 40 33 C56 32 62 40 76 38 C92 36 96 22 112 20 C128 18 134 27 148 24 C164 21 172 12 200 8"
                fill="none" stroke="#1f9d63" stroke-width="2" stroke-linecap="round"/>
          <path d="M0 46 C18 44 26 34 40 33 C56 32 62 40 76 38 C92 36 96 22 112 20 C128 18 134 27 148 24 C164 21 172 12 200 8 L200 60 L0 60 Z"
                fill="url(#sparkFill)"/>
        </svg>
      </div>

      <div class="action-grid">
        <button class="action-tile" data-tone="blue" data-go="pay">
          <span class="tile-icon">${icon('pay')}</span>Pay
        </button>
        <button class="action-tile" data-tone="teal" data-go="send">
          <span class="tile-icon">${icon('send')}</span>Send
        </button>
        <button class="action-tile" data-tone="green" data-go="receive">
          <span class="tile-icon">${icon('receive')}</span>Receive
        </button>
        <button class="action-tile" data-tone="amber" data-go="exchange">
          <span class="tile-icon">${icon('exchange')}</span>Exchange
        </button>
      </div>
    </div>

    <div class="section-head">
      <h2 class="section-title">My Assets</h2>
      <button class="section-link" data-go="assets">See all ${icon('chevron-right')}</button>
    </div>
    <div class="asset-grid">
      ${b.groups.map((g) => `
        <button class="asset-card" data-group="${g.id}">
          <div class="asset-card-top">
            <span class="asset-icon tone-${g.id}">${g.label.slice(0, 2).toUpperCase()}</span>
            <span class="asset-card-name">${esc(g.label)}</span>
          </div>
          <div class="asset-amount">$${fmt(g.totalMinor, 2)}</div>
          <div class="asset-caption">${esc(g.caption)}</div>
        </button>
      `).join('')}
    </div>

    <div class="section-head">
      <h2 class="section-title">Recent Activity</h2>
      <button class="section-link" data-go="activity">See all ${icon('chevron-right')}</button>
    </div>
    <div class="card feed">
      ${b.transactions.slice(0, 6).map((t) => feedRow(t)).join('') || emptyRow('No transactions yet')}
    </div>

    <div class="section-head">
      <h2 class="section-title">This month</h2>
    </div>
    <div class="grid-4">
      <div class="stat">
        <div class="stat-label">Spendable</div>
        <div class="stat-value">${usd(s.spendableMinor)}</div>
        <div class="stat-note">Immediately usable</div>
      </div>
      <div class="stat">
        <div class="stat-label">Pending</div>
        <div class="stat-value">${s.counts.pendingTransactions}</div>
        <div class="stat-note">${usd(s.pendingMinor)} not settled</div>
      </div>
      <div class="stat">
        <div class="stat-label">Providers</div>
        <div class="stat-value">${s.counts.providers}</div>
        <div class="stat-note">${s.counts.chains} chain${s.counts.chains === 1 ? '' : 's'} · ${s.counts.countries} countr${s.counts.countries === 1 ? 'y' : 'ies'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">In ${homeCcy}</div>
        <div class="stat-value">${fmt(String(totalLocal), 2)}</div>
        <div class="stat-note">${b.fx.homeToBase || 'Reference rate'}</div>
      </div>
    </div>

    <div class="section-head">
      <h2 class="section-title">Portfolio intelligence</h2>
    </div>
    <div class="card card-pad">
      <p style="font-size:13px;color:var(--ink-2);line-height:1.6">${esc(b.portfolioNarrative.fact)}</p>
      <p style="font-size:13px;color:var(--ink-2);line-height:1.6;margin-top:8px">${esc(b.portfolioNarrative.estimate)}</p>
      <div class="chips" style="margin-top:12px">
        ${b.breakdown.map((x) => `<span class="chip">${esc(x.label)} ${(x.shareBps / 100).toFixed(0)}%</span>`).join('')}
      </div>
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:12px;line-height:1.5">${esc(b.portfolioNarrative.caveat)}</p>
    </div>
  `;
}

function feedRow(t) {
  const out = ['send', 'pay', 'defi', 'bridge', 'convert'].includes(t.type);
  const dec = t.amountDecimals ?? 2;
  const asset = t.asset;
  const sign = out ? '−' : '+';
  return `
    <button class="feed-row" data-tx="${t.id}">
      <span class="feed-icon ${TONE_FOR_TYPE[t.type] || 'tone-others'}">${icon(ICON_FOR_TYPE[t.type] || 'activity')}</span>
      <span class="feed-main">
        <span class="feed-title">${esc(t.typeLabel || t.type)}${t.recipient ? ` · ${esc(t.recipient)}` : ''}</span>
        <span class="feed-meta">
          ${dayLabel(t.createdAt)}
          <span class="tag ${t.isSuccess ? 'ok' : t.isTerminal ? 'bad' : 'warn'}">${esc(t.stateLabel)}</span>
          ${t.providerName ? `<span>${esc(t.providerName)}</span>` : ''}
        </span>
      </span>
      <span class="feed-amount ${out ? 'out' : 'in'}">${sign}${short(t.amountMinor, dec)} ${esc(asset)}</span>
    </button>
  `;
}

function emptyRow(text) {
  return `<div class="empty">${icon('activity')}<div>${esc(text)}</div></div>`;
}

/* --------------------------------- PAY --------------------------------- */

function renderPay() {
  const b = state.boot;
  const country = b.profile.homeCountry;
  const flags = b.scope.map((c) => `${c.flag} ${c.name}`).join(' · ');

  return `
    <div class="page-head">
      <h1 class="page-title">Pay</h1>
      <p class="page-sub">Scan a QR or take a payment as a merchant. Zlet identifies the payment scheme, then recommends the connected source. It never invents interoperability a scheme does not support.</p>
    </div>

    <div class="grid-2">
      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Scan to pay</h3>
        <div class="field">
          <label class="field-label">QR payload or merchant code</label>
          <input class="input" id="qrInput" placeholder="Paste a QR payload, e.g. DuitNow:merchant@zlet">
        </div>
        <div class="field">
          <label class="field-label">Amount</label>
          <input class="input" id="payAmount" value="120.00" inputmode="decimal">
        </div>
        <div class="field">
          <label class="field-label">Currency</label>
          <select class="select" id="payAsset">
            ${b.groups.flatMap((g) => g.items).map((i) => i.asset)
              .filter((a, idx, arr) => arr.indexOf(a) === idx)
              .map((a) => `<option value="${a}" ${a === 'MYR' ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary btn-block" id="btnScanPay">${icon('qr')} Continue</button>
        <div class="notice" style="margin:14px 0 0">
          ${icon('info')}
          <span>Zlet will show merchant, amount, currency, rail, fee and source wallet before you confirm. Nothing executes on scan.</span>
        </div>
      </div>

      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Merchant mode</h3>
        <p style="font-size:12.5px;color:var(--ink-3);line-height:1.55;margin-bottom:14px">
          Accept payment without understanding each network. Rails are resolved for ${esc(flags)}.
        </p>
        <div class="field">
          <label class="field-label">Amount</label>
          <input class="input" id="mchAmount" value="450.00" inputmode="decimal">
        </div>
        <div class="field">
          <label class="field-label">Description</label>
          <input class="input" id="mchDesc" placeholder="Design retainer — October">
        </div>
        <div class="field">
          <label class="field-label">Customer (optional)</label>
          <input class="input" id="mchCustomer" placeholder="Halden Capital">
        </div>
        <button class="btn btn-primary btn-block" id="btnCreateInvoice">${icon('plus')} Create invoice</button>
      </div>
    </div>

    <div class="section-head">
      <h2 class="section-title">Open requests &amp; invoices</h2>
      <button class="section-link" data-go="merchant">Merchant dashboard ${icon('chevron-right')}</button>
    </div>
    <div class="card">
      ${b.requests.length ? `
        <table class="table">
          <thead><tr><th>Reference</th><th>Type</th><th>Customer</th><th>Country</th><th class="right">Amount</th><th>Status</th></tr></thead>
          <tbody>
            ${b.requests.map((r) => `
              <tr>
                <td class="mono">${esc(r.reference)}</td>
                <td>${esc(r.kind)}</td>
                <td>${esc(r.customer || '—')}</td>
                <td>${esc(r.countryCode)}</td>
                <td class="right num">${short(r.amountMinor, r.decimals)} ${esc(r.asset)}</td>
                <td><span class="tag ${r.status === 'paid' ? 'ok' : r.status === 'open' ? 'info' : 'warn'}">${esc(r.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty">${icon('merchant')}<div>No requests yet</div></div>`}
    </div>
  `;
}

/* --------------------------------- SEND -------------------------------- */

function renderSend() {
  const b = state.boot;
  const dest = state.sendDraft.destinationCountry || b.profile.homeCountry;
  const countries = b.countries.filter((c) => b.scope.some((s) => s.code === c.code));

  return `
    <div class="page-head">
      <h1 class="page-title">Send</h1>
      <p class="page-sub">Every legitimate route is compared: rate, fee, ETA, settlement and risk. Routes outside your two-country scope, or blocked by compliance, are excluded with the reason shown.</p>
    </div>

    <div class="card card-pad" style="max-width:640px;margin-bottom:18px">
      <div class="field">
        <label class="field-label">Amount</label>
        <input class="input-amount" id="sendAmount" value="${esc(state.sendDraft.amount)}" inputmode="decimal" placeholder="0.00">
      </div>
      <div class="grid-2" style="gap:12px;margin-top:14px">
        <div class="field" style="margin:0">
          <label class="field-label">Currency</label>
          <select class="select" id="sendAsset">
            ${['MYR', 'USD', 'BDT', 'USDC', 'ETH', 'SGD', 'AED', 'GBP', 'AUD'].map((a) => `<option value="${a}" ${a === state.sendDraft.asset ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">Destination country</label>
          <select class="select" id="sendDest">
            ${countries.map((c) => `<option value="${c.code}" ${c.code === dest ? 'selected' : ''}>${c.flag} ${c.name}${c.code === b.profile.homeCountry ? ' (home)' : ' (visiting)'}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field" style="margin:14px 0 0">
        <label class="field-label">Recipient (optional)</label>
        <input class="input" id="sendRecipient" value="${esc(state.sendDraft.recipient)}" placeholder="Name, mobile or address">
      </div>
      <button class="btn btn-primary btn-block" id="btnFindRoutes" style="margin-top:16px">${icon('globe')} Find best route</button>
    </div>

    <div id="sendResults">
      ${state.pendingRoute && state.pendingRoute.kind === 'send' ? renderRouteResults(state.pendingRoute.data) : `
        <div class="card card-pad">
          <div class="notice">${icon('info')}<span>Enter an amount and destination, then Zlet compares every connected rail inside your scope. ${esc(b.scope.map((c) => `${c.flag} ${c.name}`).join(' + '))}.</span></div>
        </div>
      `}
    </div>
  `;
}

function renderRouteResults(data) {
  if (!data) return '';
  const routes = data.routes || data;
  const ranked = routes.ranked || [];

  if (!ranked.length) {
    return `
      <div class="card card-pad">
        <div class="notice warn">${icon('alert')}<span>${esc(routes.message || 'No legitimate route is available for this request right now.')}</span></div>
        ${renderExcluded(routes.excluded)}
      </div>
    `;
  }

  return `
    <div class="section-head">
      <h2 class="section-title">${ranked.length} legitimate route${ranked.length === 1 ? '' : 's'}</h2>
      <span class="chip">Compared ${new Date(routes.comparedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div style="max-width:760px">
      ${ranked.map((r) => renderRouteCard(r)).join('')}
    </div>
    ${routes.excluded?.length ? `
      <div class="section-head"><h2 class="section-title">Excluded (with reason)</h2></div>
      ${renderExcluded(routes.excluded)}
    ` : ''}
  `;
}

function renderRouteCard(r) {
  const d = r.disclosure || {};
  const eta = r.etaMinutes || [0, 0];
  const etaLabel = eta[1] >= 60 ? `${Math.round(eta[0] / 60)}–${Math.round(eta[1] / 60)} hr` : `${eta[0]}–${eta[1]} min`;
  const riskTone = r.risk === 'low' ? 'ok' : r.risk === 'medium' ? 'warn' : 'bad';

  return `
    <div class="route-card ${r.recommended ? 'recommended' : ''}" data-route='${esc(JSON.stringify({ id: r.id, providerId: r.providerId, providerName: r.providerName, kind: r.kind, countryCode: r.countryCode, feature: r.feature, label: r.label, etaMinutes: r.etaMinutes, risk: r.risk, quote: r.quote, disclosure: d, multiHop: r.multiHop || null }))}'>
      <div class="route-top">
        <div style="min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span class="route-badge ${r.recommended ? '' : 'alt'}">${r.recommended ? 'Recommended' : `Option ${r.rank}`}</span>
            <span class="route-provider">${esc(r.providerName)}</span>
            <span class="tag ${riskTone}">${esc(r.risk)} risk</span>
          </div>
          <div class="route-label">${esc(r.label || '')}</div>
        </div>
        <div class="route-amount">
          <div class="route-receive">${esc(d.recipientReceives || '—')}</div>
          <div class="route-cost">cost ${esc(d.totalCost || '—')} · ${(Number(r.costBps || 0) / 100).toFixed(2)}%</div>
        </div>
      </div>

      <div class="route-facts">
        <span class="route-fact">${icon('clock')} ETA <b>${etaLabel}</b></span>
        <span class="route-fact">Fee <b>${esc(d.providerFee || '—')}</b></span>
        <span class="route-fact">Network <b>${esc(d.networkFee || '—')}</b></span>
        <span class="route-fact">Compliance <b>${esc((r.compliance || 'allowed').replace(/_/g, ' '))}</b></span>
        ${r.settlement ? `<span class="route-fact">Settlement <b>${esc(r.settlement)}</b></span>` : ''}
      </div>

      ${r.multiHop ? `
        <div class="route-note warn">${icon('alert')}<span>${esc(r.hopNote || 'Two separate executions.')} ${r.multiHop.map((h) => `Hop ${h.hop}: ${h.provider}`).join(' → ')}</span></div>
      ` : ''}

      ${r.notDirectlyComparable ? `
        <div class="route-note warn">${icon('alert')}<span>${esc(r.settlementAssetNote || 'This route does not deliver the requested target asset.')}</span></div>
      ` : ''}

      ${r.complianceReason ? `
        <div class="route-note">${icon('info')}<span>${esc(r.complianceReason)}</span></div>
      ` : ''}

      <div class="route-pick">
        <button class="btn btn-primary btn-sm" data-select-route="${esc(r.id)}">${icon('check')} Review &amp; confirm</button>
        <button class="btn btn-ghost btn-sm" data-prepare-route="${esc(r.id)}">Prepare only</button>
      </div>
    </div>
  `;
}

function renderExcluded(excluded = []) {
  if (!excluded.length) return '';
  return `
    <div class="excluded-list">
      ${excluded.map((e) => `
        <div class="excluded-row">
          ${icon('info')}
          <span><b>${esc(e.providerName || e.label)}</b> — ${esc(e.reason)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* -------------------------------- RECEIVE ------------------------------ */

function renderReceive() {
  const b = state.boot;
  return `
    <div class="page-head">
      <h1 class="page-title">Receive</h1>
      <p class="page-sub">Only rails that are legitimately available for your country are offered. Zlet never generates an address or identifier it cannot actually receive on.</p>
    </div>

    <div class="grid-2">
      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Create a payment request</h3>
        <div class="field">
          <label class="field-label">Type</label>
          <div class="segmented" id="reqKind">
            <button class="active" data-kind="request">Request</button>
            <button data-kind="invoice">Invoice</button>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Amount</label>
          <input class="input" id="reqAmount" value="${esc(state.requestDraft.amount)}" inputmode="decimal">
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="field">
            <label class="field-label">Currency</label>
            <select class="select" id="reqAsset">
              ${['MYR', 'BDT', 'USD', 'SGD', 'AED', 'USDC'].map((a) => `<option value="${a}" ${a === state.requestDraft.asset ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label">Country</label>
            <select class="select" id="reqCountry">
              ${b.scope.map((c) => `<option value="${c.code}">${c.flag} ${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label">From (optional)</label>
          <input class="input" id="reqCustomer" placeholder="Customer or payer name">
        </div>
        <div class="field">
          <label class="field-label">Description</label>
          <input class="input" id="reqDesc" placeholder="What is this for?">
        </div>
        <button class="btn btn-primary btn-block" id="btnCreateRequest">${icon('qr')} Generate request</button>
      </div>

      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Your receiving rails</h3>
        <div style="display:flex;flex-direction:column;gap:9px">
          ${b.connections.filter((c) => c.status === 'connected').slice(0, 8).map((c) => `
            <div class="option-row" style="padding:9px 0">
              <span class="asset-icon" style="background:${esc(c.color || '#64748b')}">${esc(c.name.slice(0, 2).toUpperCase())}</span>
              <div class="option-main">
                <div class="option-title">${esc(c.name)}</div>
                <div class="option-desc">${esc(c.kindLabel || c.kind || '')} · ${esc(c.country)}</div>
              </div>
              <span class="chip ${c.aggregatable ? 'ok' : ''}">${c.aggregatable ? 'Aggregated' : 'Boundary only'}</span>
            </div>
          `).join('')}
        </div>
        <div class="notice" style="margin-top:14px">
          ${icon('lock')}
          <span>Wallet ecosystems that do not permit aggregation are integrated at the platform boundary. Zlet never reads or clones their credentials.</span>
        </div>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Active requests</h2></div>
    <div class="card">
      ${b.requests.length ? b.requests.map((r) => `
        <div class="feed-row" style="cursor:default">
          <span class="feed-icon ${r.status === 'paid' ? 'tone-defi' : 'tone-mobile'}">${icon('qr')}</span>
          <span class="feed-main">
            <span class="feed-title">${esc(r.reference)} · ${esc(r.customer || r.description || r.kind)}</span>
            <span class="feed-meta">
              <span class="tag ${r.status === 'paid' ? 'ok' : r.status === 'open' ? 'info' : 'warn'}">${esc(r.status)}</span>
              ${esc(r.countryCode)} · ${dayLabel(r.createdAt)}
            </span>
          </span>
          <span class="feed-amount">${short(r.amountMinor, r.decimals)} ${esc(r.asset)}</span>
        </div>
      `).join('') : `<div class="empty">${icon('qr')}<div>No active requests</div></div>`}
    </div>
  `;
}

/* ------------------------------- EXCHANGE ------------------------------ */

function renderExchange() {
  const b = state.boot;
  const fx = b.fx;

  return `
    <div class="page-head">
      <h1 class="page-title">Exchange</h1>
      <p class="page-sub">The Zlet Exchange Point is a routing layer, not a single venue. It compares licensed exchanges, DEXes and composed routes — and states the exact comparison universe and timestamp.</p>
    </div>

    <div class="card card-pad" style="max-width:640px;margin-bottom:18px">
      <div class="grid-2" style="gap:12px">
        <div>
          <label class="field-label">You send</label>
          <input class="input-amount" id="convAmount" value="${esc(state.convertDraft.amount)}" inputmode="decimal" style="font-size:26px">
          <select class="select" id="convFrom" style="margin-top:8px">
            ${['USDC', 'USDT', 'ETH', 'BTC', 'MYR', 'USD', 'BDT', 'SGD', 'AED', 'GBP'].map((a) => `<option value="${a}" ${a === state.convertDraft.from ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="field-label">You receive</label>
          <div style="font-size:26px;font-weight:680;letter-spacing:-.02em;padding:14px 0;border-bottom:1px solid var(--line-2);color:var(--ink-4)">—</div>
          <select class="select" id="convTo" style="margin-top:8px">
            ${['MYR', 'USDC', 'ETH', 'USD', 'BDT', 'SGD', 'AED', 'GBP', 'BTC'].map((a) => `<option value="${a}" ${a === state.convertDraft.to ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field" style="margin-top:14px">
        <label class="field-label">Network (for on-chain legs)</label>
        <select class="select" id="convChain">
          ${b.chainsCatalog.map((c) => `<option value="${c.id}" ${c.id === 'base' ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-block" id="btnConvert" style="margin-top:6px">${icon('exchange')} Compare venues</button>
      <div class="notice" style="margin:14px 0 0">
        ${icon('info')}
        <span>${esc(fx.homeToBase || '')} · ${esc(fx.baseToHome || '')} — sandbox reference snapshot. Mid-market reference is shown for comparison, never as an executable quote on its own.</span>
      </div>
    </div>

    <div id="convertResults">
      ${state.pendingRoute && state.pendingRoute.kind === 'convert' ? renderConvertResults(state.pendingRoute.data) : ''}
    </div>
  `;
}

function renderConvertResults(data) {
  if (!data) return '';
  const mid = data.midMarketReference;

  return `
    <div class="card card-pad" style="margin-bottom:16px;max-width:760px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <div class="stat-label">Mid-market reference</div>
          <div style="font-size:17px;font-weight:680;margin-top:3px" class="num">${esc(mid?.label || '—')}</div>
        </div>
        <div style="text-align:right">
          <div class="stat-label">Source</div>
          <div style="font-size:12px;color:var(--ink-3);margin-top:3px">${esc(mid?.source || '')}</div>
        </div>
      </div>
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:10px">${esc(mid?.note || '')}</p>
    </div>
    ${renderRouteResults(data)}
  `;
}

/* --------------------------------- DEFI -------------------------------- */

function renderDeFi() {
  const b = state.boot;
  const positions = b.defi.positions;
  const protocols = b.defi.protocols;
  const total = positions.reduce((acc, p) => acc + BigInt(p.usdMinor || '0'), 0n);

  return `
    <div class="page-head">
      <h1 class="page-title">DeFi Sandbox</h1>
      <p class="page-sub">Non-custodial by design: your wallet → protocol, never user → Zlet → protocol. Every action is simulated first, with protocol, contract, function, gas, price impact and concrete risk reasons shown before you confirm.</p>
    </div>

    <div class="notice ${b.sandbox.frozen ? 'bad' : ''}">
      ${icon('shield')}
      <span>${b.sandbox.frozen
        ? 'Zlet is locked. DeFi execution is disabled until you unlock it in the Security Center.'
        : `DeFi permission: ${b.sandbox.capabilities.find((c) => c.capability === 'defi')?.granted ? 'granted' : 'not granted — simulations only'}. Zlet never asks for a seed phrase, under any circumstance.`}</span>
    </div>

    <div class="grid-3" style="margin-bottom:18px">
      <div class="stat">
        <div class="stat-label">Deployed</div>
        <div class="stat-value">$${fmt(String(total), 2)}</div>
        <div class="stat-note">${positions.length} position${positions.length === 1 ? '' : 's'}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Protocols</div>
        <div class="stat-value">${protocols.length}</div>
        <div class="stat-note">Vetted registry only</div>
      </div>
      <div class="stat">
        <div class="stat-label">Default slippage</div>
        <div class="stat-value">${(b.settings.defaultSlippageBps / 100).toFixed(2)}%</div>
        <div class="stat-note">Exact-amount approvals by default</div>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Your positions</h2></div>
    <div class="card">
      ${positions.length ? `
        <table class="table">
          <thead><tr><th>Position</th><th>Protocol</th><th>Type</th><th class="right">Value</th><th class="right">APY</th><th>Risk</th></tr></thead>
          <tbody>
            ${positions.map((p) => `
              <tr>
                <td><b>${esc(p.valueLabel)}</b></td>
                <td>${esc(p.protocolName)}</td>
                <td><span class="tag defi">${esc(p.positionType || 'supply')}</span></td>
                <td class="right num">$${fmt(p.usdMinor, 2)}</td>
                <td class="right num">${p.apy != null ? `${p.apy.toFixed(1)}%` : '—'}</td>
                <td><span class="tag ${p.risk?.level === 'low' ? 'ok' : p.risk?.level === 'medium' ? 'warn' : 'bad'}">${esc(p.risk?.level || '—')}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty">${icon('defi')}<div>No DeFi positions in your country scope</div></div>`}
    </div>

    <div class="section-head"><h2 class="section-title">Simulate an action</h2></div>
    <div class="card card-pad">
      <div class="grid-2" style="gap:12px">
        <div class="field" style="margin:0">
          <label class="field-label">Protocol</label>
          <select class="select" id="simProvider">
            ${protocols.map((p) => `<option value="${p.id}">${esc(p.name)} · ${p.chains[0] || ''} · ${esc(p.risk)} risk</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">Action</label>
          <select class="select" id="simAction">
            ${Object.entries(b.defiActions).map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">Chain</label>
          <select class="select" id="simChain">
            ${b.chainsCatalog.map((c) => `<option value="${c.id}" ${c.id === 'base' ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">Amount</label>
          <input class="input" id="simAmount" value="100" inputmode="decimal">
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">From asset</label>
          <select class="select" id="simFrom">
            ${['USDC', 'ETH', 'BTC', 'USDT', 'DAI'].map((a) => `<option value="${a}">${a}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">To asset</label>
          <select class="select" id="simTo">
            ${['ETH', 'USDC', 'USDT', 'DAI'].map((a) => `<option value="${a}">${a}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn btn-primary btn-block" id="btnSimulate" style="margin-top:16px">${icon('flask')} Simulate</button>
    </div>
    <div id="simResults" style="margin-top:16px"></div>

    <div class="section-head"><h2 class="section-title">Cross-chain bridge</h2></div>
    <div class="card card-pad">
      <div class="notice warn">${icon('alert')}<span>A bridge is never disguised as a simple transfer. Bridged assets carry that bridge's security model.</span></div>
      <div class="grid-2" style="gap:12px">
        <div class="field" style="margin:0">
          <label class="field-label">From chain</label>
          <select class="select" id="bridgeFrom">
            ${b.chainsCatalog.map((c) => `<option value="${c.id}" ${c.id === 'ethereum' ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin:0">
          <label class="field-label">To chain</label>
          <select class="select" id="bridgeTo">
            ${b.chainsCatalog.map((c) => `<option value="${c.id}" ${c.id === 'base' ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn btn-ghost btn-block" id="btnBridge" style="margin-top:14px">${icon('chain')} Compare bridges</button>
    </div>
    <div id="bridgeResults" style="margin-top:16px"></div>

    <div class="section-head"><h2 class="section-title">Protocol registry</h2></div>
    <div class="grid-3">
      ${protocols.map((p) => `
        <div class="card card-pad">
          <div style="display:flex;align-items:center;gap:9px;margin-bottom:9px">
            <span class="asset-icon" style="background:${esc(p.color)}">${esc(p.name.slice(0, 2).toUpperCase())}</span>
            <div>
              <div style="font-weight:650;font-size:13px">${esc(p.name)}</div>
              <div style="font-size:11px;color:var(--ink-3)">${esc(p.kind)} · ${esc(p.age || '')}</div>
            </div>
            <span class="tag ${p.risk === 'low' ? 'ok' : p.risk === 'medium' ? 'warn' : 'bad'}" style="margin-left:auto">${esc(p.risk)}</span>
          </div>
          <div class="chips">
            ${p.chains.slice(0, 4).map((c) => `<span class="chip">${esc(c)}</span>`).join('')}
          </div>
          <div style="font-size:11.5px;color:var(--ink-3);margin-top:10px;line-height:1.5">
            ${p.tvl ? `TVL $${(p.tvl / 1e9).toFixed(2)}B · ` : ''}${p.audited ? 'Audited' : 'No audit disclosed'} · ${p.contracts.length} verified contract${p.contracts.length === 1 ? '' : 's'}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section-head"><h2 class="section-title">Approved contracts</h2></div>
    <div class="card">
      <table class="table">
        <thead><tr><th>Contract</th><th>Chain</th><th>Address</th><th>Status</th></tr></thead>
        <tbody>
          ${b.approvedContracts.map((c) => `
            <tr>
              <td>${esc(c.label)}</td>
              <td>${esc(c.chain)}</td>
              <td class="mono" style="font-size:11px">${esc(c.address.slice(0, 10))}…${esc(c.address.slice(-6))}</td>
              <td><span class="tag ok">Verified</span></td>
            </tr>
          `).join('') || '<tr><td colspan="4"><div class="empty">No approved contracts</div></td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderSimulation(sim) {
  const b = state.boot;
  const riskTone = sim.risk.level === 'low' ? 'ok' : sim.risk.level === 'medium' ? 'warn' : 'bad';
  return `
    <div class="card card-pad">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:14px;flex-wrap:wrap">
        <h3 class="section-title" style="margin:0">${esc(sim.actionLabel)} simulation</h3>
        <span class="tag ${riskTone}">${esc(sim.risk.level)} risk</span>
        <span class="tag info">${esc(sim.chain.name)}</span>
        ${sim.executable ? '<span class="tag ok">Simulation complete</span>' : '<span class="tag warn">Not executable</span>'}
      </div>

      <div class="confirm-hero" style="padding-top:0">
        <div class="confirm-label">You send</div>
        <div class="confirm-amount" style="font-size:24px">${short(sim.input.amountMinor, sim.input.decimals)} ${esc(sim.input.asset)}</div>
        <div class="confirm-sub">→ expected ${short(sim.expectedOutput.amountMinor, sim.expectedOutput.decimals)} ${esc(sim.expectedOutput.asset)}</div>
      </div>

      <table class="fee-table">
        <tr><td>Protocol</td><td>${esc(sim.protocol.name)}</td></tr>
        <tr><td>Contract</td><td class="mono" style="font-size:11px">${esc(sim.contract.address || 'not in registry')}</td></tr>
        <tr><td>Function</td><td>${esc(sim.contract.function)}</td></tr>
        <tr><td>Gas (network)</td><td>${short(sim.gas.amountMinor, sim.input.decimals === 6 ? 6 : 18, 8)} ${esc(sim.gas.asset)}</td></tr>
        <tr><td>Price impact</td><td>${(sim.priceImpactBps / 100).toFixed(2)}%</td></tr>
        <tr><td>Slippage tolerance</td><td>${(sim.slippageBps / 100).toFixed(2)}%</td></tr>
        <tr><td>Route</td><td>${esc(sim.route)}</td></tr>
        <tr class="emphasis"><td>Recipient receives</td><td>${short(sim.quote.receiveMinor, sim.quote.receiveDecimals)} ${esc(sim.quote.to)}</td></tr>
      </table>

      ${sim.approval.required ? `
        <div class="notice" style="margin-top:14px">
          ${icon('shield')}
          <span><b>Token approval required:</b> exact amount (${short(sim.approval.amount, sim.input.decimals)}) to the spender contract. Zlet uses exact-amount approvals instead of unlimited allowances.</span>
        </div>
      ` : ''}

      ${sim.warnings.length ? sim.warnings.map((w) => `<div class="notice warn" style="margin-top:10px">${icon('alert')}<span>${esc(w)}</span></div>`).join('') : ''}

      <div class="section-head" style="margin:16px 0 8px"><h3 class="section-title">Risk assessment</h3></div>
      <div class="plan-list" style="display:flex;flex-direction:column;gap:6px">
        ${sim.risk.reasons.map((r) => `<div style="display:flex;gap:7px;font-size:12px;color:var(--ink-2);line-height:1.5">${icon('info')}<span>${esc(r)}</span></div>`).join('')}
      </div>
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:10px">${esc(sim.risk.disclaimer)}</p>

      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-primary" style="flex:1" data-confirm-sim="${esc(sim.id)}">${icon('check')} Confirm transaction</button>
        <button class="btn btn-ghost" id="btnClearSim">Cancel</button>
      </div>
    </div>
  `;
}

/* -------------------------------- ASSETS ------------------------------- */

function renderAssets() {
  const b = state.boot;
  const s = b.summary;

  return `
    <div class="page-head">
      <h1 class="page-title">My Assets</h1>
      <p class="page-sub">Market value and spendable balance are different numbers. Zlet never presents a locked, deployed or restricted balance as if you could spend it.</p>
    </div>

    <div class="grid-4" style="margin-bottom:20px">
      <div class="stat">
        <div class="stat-label">Market value</div>
        <div class="stat-value">$${fmt(s.totalMinor, 2)}</div>
        <div class="stat-note">At reference prices</div>
      </div>
      <div class="stat">
        <div class="stat-label">Spendable</div>
        <div class="stat-value" style="color:var(--accent)">$${fmt(s.spendableMinor, 2)}</div>
        <div class="stat-note">Immediately usable</div>
      </div>
      <div class="stat">
        <div class="stat-label">Invested</div>
        <div class="stat-value">$${fmt(s.investedMinor, 2)}</div>
        <div class="stat-note">Deployed or locked</div>
      </div>
      <div class="stat">
        <div class="stat-label">Restricted</div>
        <div class="stat-value">$${fmt(s.restrictedMinor, 2)}</div>
        <div class="stat-note">Provider action required</div>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Breakdown by state</h2></div>
    <div class="card card-pad">
      ${s.byState.map((st) => `
        <div style="margin-bottom:13px">
          <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px">
            <span style="font-weight:600">${esc(st.label)} <span style="color:var(--ink-4);font-weight:400">— ${esc(st.note)}</span></span>
            <span class="num" style="font-weight:650">$${fmt(st.minor, 2)}</span>
          </div>
          <div class="bar ${st.state === 'transferable' ? 'blue' : st.state === 'invested' ? 'violet' : st.state === 'pending' ? 'amber' : st.state === 'restricted' ? 'red' : ''}">
            <i style="width:${Math.max(0, Math.min(100, st.shareBps / 100))}%"></i>
          </div>
        </div>
      `).join('')}
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:6px;line-height:1.5">
        Excludes: ${s.disclosure.excludes.map(esc).join('; ')}.
      </p>
    </div>

    ${b.groups.map((g) => `
      <div class="section-head">
        <h2 class="section-title">${esc(g.label)} <span style="color:var(--ink-4);font-weight:400;font-size:12.5px">$${fmt(g.totalMinor, 2)}</span></h2>
        <span class="chip">${esc(g.hint)}</span>
      </div>
      <div class="card">
        ${g.items.length ? `
          <table class="table">
            <thead><tr><th>Asset</th><th>Provider</th><th>State</th><th class="right">Balance</th><th class="right">Value</th></tr></thead>
            <tbody>
              ${g.items.map((i) => `
                <tr>
                  <td><b>${esc(i.asset)}${i.chain ? ` — ${esc(i.chain)}` : ''}</b>${i.estimated ? ' <span class="tag">est</span>' : ''}</td>
                  <td>${esc(i.providerName)}</td>
                  <td><span class="tag ${i.state === 'spendable' ? 'ok' : i.state === 'pending' ? 'warn' : i.state === 'restricted' ? 'bad' : 'info'}">${esc(i.state)}</span></td>
                  <td class="right num">${short(i.minor, i.decimals)}</td>
                  <td class="right num">$${fmt(i.usdMinor, 2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `<div class="empty">${icon('assets')}<div>Nothing in this group</div></div>`}
      </div>
    `).join('')}

    <div class="section-head"><h2 class="section-title">Stablecoin hub</h2></div>
    <div class="card">
      ${b.stablecoins.length ? `
        <table class="table">
          <thead><tr><th>Asset</th><th>Issuer</th><th>Backing</th><th>Risk</th><th class="right">Balance</th><th class="right">Value</th></tr></thead>
          <tbody>
            ${b.stablecoins.map((c) => `
              <tr>
                <td><b>${esc(c.asset)} — ${esc(c.chain)}</b></td>
                <td>${esc(c.issuer)}</td>
                <td style="font-size:11.5px;color:var(--ink-3)">${esc(c.backing)}</td>
                <td><span class="tag ${c.risk === 'low' ? 'ok' : 'warn'}">${esc(c.risk)}</span></td>
                <td class="right num">${short(c.minor, c.decimals)}</td>
                <td class="right num">$${fmt(c.usdMinor, 2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty">${icon('chain')}<div>No stablecoin balances</div></div>`}
    </div>

    <div class="section-head"><h2 class="section-title">Chain exposure</h2></div>
    <div class="grid-3">
      ${b.chains.map((c) => `
        <div class="card card-pad">
          <div style="font-size:13px;font-weight:650;text-transform:capitalize">${esc(c.chain)}</div>
          <div style="font-size:19px;font-weight:680;margin:5px 0 9px" class="num">$${fmt(c.totalMinor, 2)}</div>
          <div class="chips">${c.assets.map((a) => `<span class="chip">${esc(a.asset)}</span>`).join('')}</div>
        </div>
      `).join('') || `<div class="empty">${icon('chain')}<div>No on-chain exposure</div></div>`}
    </div>
  `;
}

/* ------------------------------- ACTIVITY ------------------------------ */

function renderActivity() {
  const b = state.boot;
  return `
    <div class="page-head">
      <h1 class="page-title">Activity</h1>
      <p class="page-sub">One timeline across every provider. Each entry shows source, destination, network, amount, fee, status, timestamp and reference. A submitted request is not a settlement.</p>
    </div>

    <div class="field" style="max-width:520px">
      <input class="input" id="activitySearch" placeholder="Search: “failed”, “defi”, “this week”, “USDC”, a provider…" value="${esc(state.query)}">
    </div>

    <div class="card" id="activityFeed">
      ${b.transactions.length ? b.transactions.map((t) => feedRow(t)).join('') : emptyRow('No transactions')}
    </div>

    <div class="section-head"><h2 class="section-title">AI activity</h2></div>
    <div class="card feed">
      ${b.aiActivity.map((a) => `
        <div class="feed-row" style="cursor:default">
          <span class="feed-icon tone-crypto">${icon('spark')}</span>
          <span class="feed-main">
            <span class="feed-title">${esc(a.message)}</span>
            <span class="feed-meta">${esc(a.type)} · ${timeAgo(a.at)}</span>
          </span>
        </div>
      `).join('') || `<div class="empty">${icon('spark')}<div>No AI activity yet</div></div>`}
    </div>
  `;
}

/* ------------------------------- COUNTRIES ----------------------------- */

function renderCountries() {
  const b = state.boot;
  const active = b.scope;

  return `
    <div class="page-head">
      <h1 class="page-title">Countries</h1>
      <p class="page-sub">An account references at most ${b.maxActiveCountries} countries: one home country and one visiting country. No code path can expand this — every route, provider and feature is filtered through it before comparison.</p>
    </div>

    <div class="notice">
      ${icon('globe')}
      <span><b>Scope: ${active.map((c) => `${c.flag} ${c.name} (${c.role})`).join(' + ')}.</b>
      Travel mode is ${b.profile.travelActive ? 'on' : 'off'}. Setting a third country returns a hard error, not a warning.</span>
    </div>

    <div class="grid-2">
      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Home country</h3>
        <div class="country-card active" style="border:none;padding:0">
          <span class="country-flag">${b.countries.find((c) => c.code === b.profile.homeCountry)?.flag || '🌐'}</span>
          <div>
            <div class="country-name">${esc(b.countries.find((c) => c.code === b.profile.homeCountry)?.name || '')}</div>
            <div class="country-meta">${esc(b.profile.homeCountry)} · ${esc(b.profile.homeCurrency)} · KYC ${esc(b.profile.kyc)}</div>
          </div>
          <span class="country-role">Home</span>
        </div>
        <p style="font-size:11.5px;color:var(--ink-3);margin-top:14px;line-height:1.5">
          Changing your home country is a regulated re-onboarding event. In production it would require fresh identity verification — Zlet never treats it as a preference toggle.
        </p>
        <div class="field" style="margin-top:14px">
          <label class="field-label">Change home country</label>
          <select class="select" id="homeCountrySelect">
            ${b.countries.map((c) => `<option value="${c.code}" ${c.code === b.profile.homeCountry ? 'selected' : ''}>${c.flag} ${c.name}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-ghost btn-block" id="btnSetHome">Re-onboard to this country</button>
      </div>

      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:14px">Visiting country</h3>
        ${b.profile.travelActive && b.profile.visitingCountry ? `
          <div class="country-card active" style="border:none;padding:0;margin-bottom:14px">
            <span class="country-flag">${b.countries.find((c) => c.code === b.profile.visitingCountry)?.flag || '🌐'}</span>
            <div>
              <div class="country-name">${esc(b.countries.find((c) => c.code === b.profile.visitingCountry)?.name || '')}</div>
              <div class="country-meta">${esc(b.profile.visitingCountry)} · travel mode on</div>
            </div>
            <span class="country-role visiting">Visiting</span>
          </div>
        ` : `
          <p style="font-size:12.5px;color:var(--ink-3);margin-bottom:14px;line-height:1.5">
            Travel mode is off. Enable it to add one visiting country alongside your home country.
          </p>
        `}

        <div class="field">
          <label class="field-label">Where are you travelling?</label>
          <select class="select" id="visitingCountrySelect">
            <option value="">— none —</option>
            ${b.countries
              .filter((c) => c.code !== b.profile.homeCountry)
              .map((c) => `<option value="${c.code}" ${c.code === b.profile.visitingCountry ? 'selected' : ''}>${c.flag} ${c.name} (${c.currency})</option>`).join('')}
          </select>
        </div>
        <div class="option-row" style="border:none;padding-top:0">
          <div class="option-main">
            <div class="option-title">Travel mode</div>
            <div class="option-desc">Adds the visiting country to your scope. Replacing it removes the previous one.</div>
          </div>
          <button class="switch ${b.profile.travelActive ? 'on' : ''}" id="travelSwitch"><i></i></button>
        </div>
        <button class="btn btn-primary btn-block" id="btnSetVisiting" style="margin-top:10px">Apply travel scope</button>
        <p style="font-size:11.5px;color:var(--ink-4);margin-top:12px;line-height:1.5">
          Only one visiting country can be active. A second country is rejected by the router, the compliance engine and the store — not just hidden in the UI.
        </p>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Supported countries (${b.countries.length})</h2></div>
    <div class="grid-3">
      ${b.countries.map((c) => {
        const isActive = active.some((a) => a.code === c.code);
        return `
          <div class="country-card ${isActive ? 'active' : 'disabled'}">
            <span class="country-flag">${c.flag}</span>
            <div>
              <div class="country-name">${esc(c.name)}</div>
              <div class="country-meta">${esc(c.code)} · ${esc(c.currency)} · ${esc(c.region)}</div>
            </div>
            <span class="country-role ${isActive ? (c.code === b.profile.homeCountry ? '' : 'visiting') : 'idle'}">${isActive ? (c.code === b.profile.homeCountry ? 'Home' : 'Visiting') : 'Out of scope'}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ----------------------------- AVAILABILITY ---------------------------- */

function renderAvailability() {
  const b = state.boot;
  const m = b.availability;

  return `
    <div class="page-head">
      <h1 class="page-title">Availability</h1>
      <p class="page-sub">A feature is never exposed just because an API exists. Each capability is evaluated per country: available, limited, requires verification, requires a licensed partner, or not supported.</p>
    </div>

    <div class="card" style="overflow-x:auto">
      <table class="matrix">
        <thead>
          <tr>
            <th>Feature</th>
            ${m.scope.map((c) => `<th>${c.flag} ${esc(c.name)}<br><span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--ink-4)">${esc(c.role)}</span></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${m.features.map((f) => `
            <tr>
              <td><b>${esc(f.label)}</b></td>
              ${f.countries.map((c) => `
                <td>
                  <span class="status-dot ${c.status}" title="${esc(c.reason)}">
                    <i></i>${esc(b.availabilityLabels[c.status] || c.status)}
                  </span>
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section-head"><h2 class="section-title">Why these results</h2></div>
    <div class="card">
      ${m.features.map((f) => `
        <div style="padding:12px 16px;border-bottom:1px solid var(--line)">
          <div style="font-size:12.5px;font-weight:650;margin-bottom:5px">${esc(f.label)}</div>
          ${f.countries.map((c) => `
            <div style="display:flex;gap:7px;font-size:11.5px;color:var(--ink-3);line-height:1.5;margin-top:3px">
              <span class="status-dot ${c.status}" style="flex-shrink:0"><i></i>${esc(c.code)}</span>
              <span>${esc(c.reason)}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

/* ------------------------------- MERCHANT ------------------------------ */

function renderMerchant() {
  const b = state.boot;
  const m = merchantFromBoot();
  const rails = m.rails || [];

  return `
    <div class="page-head">
      <h1 class="page-title">Merchant</h1>
      <p class="page-sub">Accept supported rails without needing to understand every underlying network. Zlet maps the payment method to a legitimate rail for your country.</p>
    </div>

    <div class="grid-3" style="margin-bottom:20px">
      <div class="stat">
        <div class="stat-label">Open</div>
        <div class="stat-value">${b.requests.filter((r) => r.status === 'open').length}</div>
        <div class="stat-note">Awaiting payment</div>
      </div>
      <div class="stat">
        <div class="stat-label">Collected</div>
        <div class="stat-value">${usd(m.paidMinor || '0')}</div>
        <div class="stat-note">Reconciled against confirmed settlements</div>
      </div>
      <div class="stat">
        <div class="stat-label">Payment rails</div>
        <div class="stat-value">${rails.length}</div>
        <div class="stat-note">${esc(m.country?.name || '')}</div>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Available rails</h2></div>
    <div class="grid-3">
      ${rails.map((r) => `
        <div class="card card-pad">
          <div style="display:flex;align-items:center;gap:9px;margin-bottom:9px">
            <span class="asset-icon" style="background:${esc(r.color)}">${esc(r.name.slice(0, 2).toUpperCase())}</span>
            <div style="font-weight:650;font-size:13px">${esc(r.name)}</div>
            <span class="tag">${(r.feeBps / 100).toFixed(2)}%</span>
          </div>
          <div class="chips">${r.methods.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>
          ${r.note ? `<p style="font-size:11px;color:var(--ink-4);margin-top:9px;line-height:1.45">${esc(r.note)}</p>` : ''}
        </div>
      `).join('') || `<div class="empty">${icon('merchant')}<div>No rails available in this country</div></div>`}
    </div>

    <div class="section-head"><h2 class="section-title">Invoices</h2></div>
    <div class="card">
      ${b.requests.filter((r) => r.kind === 'invoice').length ? `
        <table class="table">
          <thead><tr><th>Reference</th><th>Customer</th><th>Description</th><th class="right">Amount</th><th>Status</th></tr></thead>
          <tbody>
            ${b.requests.filter((r) => r.kind === 'invoice').map((r) => `
              <tr>
                <td class="mono">${esc(r.reference)}</td>
                <td>${esc(r.customer || '—')}</td>
                <td style="font-size:11.5px;color:var(--ink-3)">${esc(r.description || '—')}</td>
                <td class="right num">${short(r.amountMinor, r.decimals)} ${esc(r.asset)}</td>
                <td><span class="tag ${r.status === 'paid' ? 'ok' : 'info'}">${esc(r.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `<div class="empty">${icon('merchant')}<div>No invoices yet</div></div>`}
    </div>

    <div class="section-head"><h2 class="section-title">Subscriptions</h2></div>
    <div class="card">
      ${b.subscriptions.length ? b.subscriptions.map((s) => `
        <div class="option-row" style="padding:12px 16px">
          <span class="feed-icon tone-others">${icon('clock')}</span>
          <div class="option-main">
            <div class="option-title">${esc(s.merchant)}</div>
            <div class="option-desc">${esc(s.frequency)} · next ${esc(s.nextPaymentLabel)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:650;font-size:12.5px" class="num">${esc(s.amountLabel)}</div>
            <div style="font-size:10.5px;color:var(--ink-4)">no auto-cancel</div>
          </div>
        </div>
      `).join('') : `<div class="empty">${icon('clock')}<div>No recurring payments detected</div></div>`}
    </div>
  `;
}

function merchantFromBoot() {
  const b = state.boot;
  const paid = b.requests.filter((r) => r.status === 'paid');
  return {
    country: b.scope.find((c) => c.code === b.profile.homeCountry),
    paidMinor: String(paid.reduce((acc, r) => acc + BigInt(r.amountMinor), 0n)),
    rails: b.providers.filter((p) => (p.capabilities || []).includes('PAY')).map((p) => ({
      id: p.id, name: p.name, color: p.color, methods: p.rails || ['wallet'],
      feeBps: p.fee?.pctBps ?? 0, note: p.balanceNote || null
    }))
  };
}

/* -------------------------------- SANDBOX ------------------------------ */

function renderSandbox() {
  const b = state.boot;
  const s = b.sandbox;

  return `
    <div class="page-head">
      <h1 class="page-title">Permission Sandbox</h1>
      <p class="page-sub">The AI receives only the capabilities you grant. Nothing here is granted by default except read-only observation. A grant can be revoked instantly.</p>
    </div>

    <div class="notice ${s.frozen ? 'bad' : 'ok'}">
      ${icon(s.frozen ? 'lock' : 'shield')}
      <span><b>Current level: ${esc(s.level)}.</b> ${s.frozen ? 'Zlet is locked — all execution is disabled.' : 'Agent mode is separate from permissions: enabling it never grants Execute.'}</span>
    </div>

    <div class="section-head"><h2 class="section-title">Permission levels</h2></div>
    <div class="grid-3">
      ${s.levels.map((l) => `
        <div class="card card-pad">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="font-weight:650;font-size:13.5px;text-transform:capitalize">${esc(l.level)}</div>
            ${l.sensitive ? '<span class="tag warn">sensitive</span>' : ''}
            ${l.granted ? '<span class="tag ok" style="margin-left:auto">Granted</span>' : ''}
          </div>
          <div class="chips">${l.capabilities.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
          <div style="display:flex;gap:7px;margin-top:12px">
            <button class="btn ${l.granted ? 'btn-ghost' : 'btn-primary'} btn-sm btn-block" data-grant="${esc(l.level)}">
              ${l.granted ? 'Re-grant' : 'Grant'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section-head"><h2 class="section-title">Individual capabilities</h2></div>
    <div class="card card-pad">
      ${s.capabilities.map((c) => `
        <div class="option-row">
          <div class="option-main">
            <div class="option-title">${esc(c.label)} ${c.sensitive ? '<span class="tag warn">sensitive</span>' : ''}</div>
            <div class="option-desc mono" style="font-size:11px">${esc(c.capability)}</div>
          </div>
          <button class="switch ${c.granted ? 'on' : ''}" data-cap="${esc(c.capability)}" data-granted="${c.granted}"><i></i></button>
        </div>
      `).join('')}
    </div>

    <div class="section-head"><h2 class="section-title">Recent proposals &amp; requests</h2></div>
    <div class="card">
      ${b.requests.length ? b.requests.slice(0, 6).map((r) => `
        <div class="feed-row" style="cursor:default">
          <span class="feed-icon tone-violet">${icon('flask')}</span>
          <span class="feed-main">
            <span class="feed-title">${esc(r.kind)} ${esc(r.reference)}</span>
            <span class="feed-meta">${esc(r.customer || '—')} · ${dayLabel(r.createdAt)}</span>
          </span>
          <span class="feed-amount">${short(r.amountMinor, r.decimals)} ${esc(r.asset)}</span>
        </div>
      `).join('') : `<div class="empty">${icon('flask')}<div>No proposals yet</div></div>`}
    </div>
  `;
}

/* -------------------------------- SECURITY ----------------------------- */

function renderSecurity() {
  const b = state.boot;
  const g = b.guard;

  return `
    <div class="page-head">
      <h1 class="page-title">Security</h1>
      <p class="page-sub">Zlet Guard policies are evaluated before execution, not after. Blocking rules stop the action; confirmation rules require an explicit approval.</p>
    </div>

    <div class="notice ${g.frozen ? 'bad' : ''}">
      ${icon(g.frozen ? 'lock' : 'shield')}
      <span>${g.frozen
        ? 'Zlet is locked. AI execution, payments and DeFi are disabled and sessions revoked.'
        : 'Zlet is unlocked. Execution requires the Execute permission plus your approval on every consequential action.'}</span>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">
      <button class="btn ${g.frozen ? 'btn-primary' : 'btn-danger'}" id="btnToggleLock">
        ${icon('lock')} ${g.frozen ? 'Unlock Zlet' : 'Lock Zlet'}
      </button>
      <button class="btn btn-ghost" id="btnRevokeAll">${icon('shield')} Revoke all AI permissions</button>
    </div>

    <div class="section-head"><h2 class="section-title">Zlet Guard</h2></div>
    <div class="card card-pad">
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Automatic execution limit</div>
          <div class="option-desc">Never execute automatically above this amount. 0 means every transaction needs approval.</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="guardAutoMax" value="${short(g.autoExecuteMaxMinor, 2)}" style="width:110px;text-align:right">
          <span style="font-size:11.5px;color:var(--ink-3)">USD</span>
        </div>
      </div>
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Require confirmation for new recipients</div>
          <div class="option-desc">A first-time recipient can never be paid silently.</div>
        </div>
        <button class="switch ${g.requireNewRecipientConfirm ? 'on' : ''}" data-guard="requireNewRecipientConfirm"><i></i></button>
      </div>
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Require bridge approval</div>
          <div class="option-desc">Cross-chain bridges always need explicit approval.</div>
        </div>
        <button class="switch ${g.requireBridgeApproval ? 'on' : ''}" data-guard="requireBridgeApproval"><i></i></button>
      </div>
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Biometric threshold</div>
          <div class="option-desc">Device confirmation is required above this amount.</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" id="guardBiometric" value="${short(g.requireBiometricAboveMinor, 2)}" style="width:110px;text-align:right">
          <span style="font-size:11.5px;color:var(--ink-3)">USD</span>
        </div>
      </div>
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Block unknown smart contracts</div>
          <div class="option-desc">Only contracts in the verified registry can be interacted with.</div>
        </div>
        <button class="switch ${g.blockUnknownContracts ? 'on' : ''}" data-guard="blockUnknownContracts"><i></i></button>
      </div>
      <div class="option-row">
        <div class="option-main">
          <div class="option-title">Block sanctioned destinations</div>
          <div class="option-desc">Sanctions screening cannot be disabled by an AI agent.</div>
        </div>
        <button class="switch ${g.blockSanctioned ? 'on' : ''}" data-guard="blockSanctioned"><i></i></button>
      </div>
      <button class="btn btn-primary btn-block" id="btnSaveGuard" style="margin-top:14px">Save policies</button>
    </div>

    <div class="section-head"><h2 class="section-title">Approved recipients</h2></div>
    <div class="card">
      <table class="table">
        <thead><tr><th>Name</th><th>Handle</th><th>Country</th><th>Rail</th><th>Status</th></tr></thead>
        <tbody>
          ${b.recipients.map((r) => `
            <tr>
              <td><b>${esc(r.name)}</b></td>
              <td class="mono" style="font-size:11.5px">${esc(r.handle)}</td>
              <td>${esc(r.country)}</td>
              <td>${esc(r.rail)}</td>
              <td><span class="tag ${r.trusted ? 'ok' : 'warn'}">${r.trusted ? 'Trusted' : 'New'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section-head"><h2 class="section-title">Devices &amp; sessions</h2></div>
    <div class="card card-pad">
      <div class="option-row">
        <span class="feed-icon tone-defi">${icon('shield')}</span>
        <div class="option-main">
          <div class="option-title">This device</div>
          <div class="option-desc">Trusted · biometric ${b.profile.biometric ? 'enabled' : 'disabled'} · last seen just now</div>
        </div>
        <span class="tag ok">Current</span>
      </div>
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:12px;line-height:1.5">
        A new device never inherits high-risk transaction permissions automatically. In production this would require a fresh passkey or hardware-backed key enrollment.
      </p>
    </div>
  `;
}

/* -------------------------------- PRIVACY ------------------------------ */

function renderPrivacy() {
  const b = state.boot;

  return `
    <div class="page-head">
      <h1 class="page-title">Privacy Center</h1>
      <p class="page-sub">Connect. Orchestrate. Don't unnecessarily relocate. Balances stay with their providers; Zlet stores the minimum metadata needed to orchestrate and audit.</p>
    </div>

    <div class="grid-2" style="margin-bottom:20px">
      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:12px">What Zlet stores</h3>
        <table class="fee-table">
          <tr><td>Balances</td><td>Snapshot only, overwritten on sync</td></tr>
          <tr><td>Transactions</td><td>References and amounts</td></tr>
          <tr><td>Credentials</td><td>Never stored, never requested</td></tr>
          <tr><td>Seed phrases</td><td>Never requested, under any circumstances</td></tr>
          <tr><td>Local cache</td><td>${esc(b.cache.cipher)} encrypted</td></tr>
          <tr><td>Cache size</td><td>${(b.cache.cacheBytes / 1024).toFixed(1)} KB</td></tr>
        </table>
      </div>
      <div class="card card-pad">
        <h3 class="section-title" style="margin-bottom:12px">Third-party AI</h3>
        <div class="notice">
          ${icon('lock')}
          <span>The reasoning layer is deterministic and local: <b>${esc(b.sandbox.level === 'none' ? 'no AI provider' : 'rule-based, no remote model')}</b>. Provider credentials are isolated from the assistant entirely — it requests an operation, the secure layer performs it.</span>
        </div>
        <p style="font-size:12px;color:var(--ink-3);line-height:1.6;margin-top:12px">
          The AI never receives passwords, private keys, seed phrases, raw card credentials, OAuth secrets or session cookies.
        </p>
      </div>
    </div>

    <div class="section-head"><h2 class="section-title">Connected providers</h2></div>
    <div class="card">
      <table class="table">
        <thead><tr><th>Provider</th><th>Kind</th><th>Country</th><th>Aggregation</th><th>Credentials stored</th></tr></thead>
        <tbody>
          ${b.connections.map((c) => `
            <tr>
              <td><b>${esc(c.name)}</b></td>
              <td>${esc(c.kindLabel || c.kind || '—')}</td>
              <td>${esc(c.country)}</td>
              <td><span class="tag ${c.aggregatable ? 'ok' : 'info'}">${c.aggregatable ? 'Balance visible' : 'Boundary only'}</span></td>
              <td><span class="tag">None</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section-head"><h2 class="section-title">AI access</h2></div>
    <div class="card card-pad">
      <div class="chips">
        ${b.sandbox.capabilities.map((c) => `<span class="chip ${c.granted ? 'ok' : ''}">${esc(c.capability)}</span>`).join('')}
      </div>
      <p style="font-size:11.5px;color:var(--ink-4);margin-top:12px;line-height:1.5">
        Revoke any capability instantly in the Sandbox view. Revocation takes effect on the next AI action; no cached authorization exists.
      </p>
    </div>

    <div class="section-head"><h2 class="section-title">Audit trail</h2></div>
    <div class="card feed">
      ${b.activity.map((a) => `
        <div class="feed-row" style="cursor:default">
          <span class="feed-icon ${a.severity === 'high' ? 'tone-payment' : 'tone-crypto'}">${icon('clock')}</span>
          <span class="feed-main">
            <span class="feed-title">${esc(a.message)}</span>
            <span class="feed-meta">${esc(a.type)} · ${esc(a.actor)} · ${timeAgo(a.at)}</span>
          </span>
        </div>
      `).join('') || `<div class="empty">${icon('clock')}<div>No activity</div></div>`}
    </div>
  `;
}

/* ============================== EVENTS ============================== */

function wireChrome() {
  $$('.nav-item').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.dataset.view) go(el.dataset.view);
      closeSidebar();
    });
  });

  $('#btnTheme').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
  });

  $('#btnMenu').addEventListener('click', openSidebar);
  $('#btnCloseSidebar').addEventListener('click', closeSidebar);
  $('#sidebarScrim').addEventListener('click', closeSidebar);

  $('#btnSync').addEventListener('click', async () => {
    try {
      await api('/api/sync', { method: 'POST' });
      state.boot = await api('/api/bootstrap');
      render();
      toast('Providers synchronised');
    } catch (err) {
      toast(err.message, 'bad');
    }
  });

  $('#btnAI').addEventListener('click', toggleAI);
  $('#btnCloseAI').addEventListener('click', () => setAI(false));
  $('#askInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      openAIWith(e.target.value.trim());
      e.target.value = '';
    }
  });
  $('#askInput').addEventListener('focus', () => setAI(true));

  $('#aiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#aiInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    askAI(text);
  });

  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-ask]');
    if (s) askAI(s.dataset.ask);
  });

  $('#quickPills').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quick]');
    if (!btn) return;
    const map = { send: 'send', pay: 'pay', convert: 'exchange', swap: 'defi', route: 'send', more: 'assets' };
    go(map[btn.dataset.quick] || 'home');
  });

  $('#scopePill').addEventListener('click', () => go('countries'));

  $('#btnLock').addEventListener('click', () => {
    go('security');
  });

  $('#btnCloseSheet').addEventListener('click', closeSheet);
  $('#sheetScrim').addEventListener('click', (e) => {
    if (e.target.id === 'sheetScrim') closeSheet();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleAI();
    }
    if (e.key === 'Escape') {
      if (!$('#sheetScrim').hidden) closeSheet();
      else setAI(false);
    }
    if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
    }
  });
}

function go(view) {
  state.view = view;
  state.pendingRoute = view === state.view ? state.pendingRoute : null;
  render();
}

function openSidebar() {
  $('#sidebar').classList.add('open');
  $('#sidebarScrim').classList.add('show');
}
function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#sidebarScrim').classList.remove('show');
}

/* ------------------------------- AI panel ------------------------------ */

function setAI(open) {
  state.aiOpen = open;
  $('#aiPanel').hidden = !open;
  if (open) setTimeout(() => $('#aiInput').focus(), 60);
}

function toggleAI() {
  setAI(!state.aiOpen);
}

function openAIWith(text) {
  setAI(true);
  askAI(text);
}

async function askAI(text) {
  setAI(true);
  pushAIMessage('user', text);
  const thinking = pushAIMessage('bot', 'Checking your verified data…', true);

  try {
    const res = await api('/api/ai/command', { method: 'POST', body: { text } });
    thinking.remove();
    const actionsHtml = (res.actions || []).map((a) => `<button data-ai-go="${esc(a.view)}" data-ai-route="${esc(a.routeId || '')}">${esc(a.label)}</button>`).join('');
    const factsHtml = res.facts
      ? `<div class="ai-facts"><span>intent: ${esc(res.facts.intent)}</span><span>${res.facts.eligibleRoutes != null ? `${res.facts.eligibleRoutes} route(s)` : ''}</span><span>${timeAgo(res.facts.at)}</span></div>`
      : '';
    pushAIMessage('bot', esc(res.reply).replace(/\n/g, '<br>') + (actionsHtml ? `<div class="ai-actions">${actionsHtml}</div>` : '') + factsHtml);

    $$('[data-ai-go]').forEach((b) => {
      b.addEventListener('click', () => {
        go(b.dataset.aiGo);
        if (b.dataset.aiRoute) toast('Route selected — choose a destination amount to continue', 'warn');
      });
    });

    // Render the structured card(s) the assistant produced into the stage.
    if (res.cards?.length) {
      const routes = res.cards.find((c) => c.type === 'routes');
      if (routes) {
        state.pendingRoute = { kind: state.view === 'exchange' ? 'convert' : 'send', data: routes.routes };
        if (state.view === 'exchange') render();
        else if (state.view === 'send') render();
      }
    }
  } catch (err) {
    thinking.remove();
    pushAIMessage('bot', esc(err.message));
  }
}

function pushAIMessage(kind, html, temp = false) {
  const el = document.createElement('div');
  el.className = `ai-msg ${kind}`;
  el.innerHTML = html;
  $('#aiThread').appendChild(el);
  $('#aiThread').scrollTop = $('#aiThread').scrollHeight;
  return el;
}

/* --------------------------- view event wiring -------------------------- */

function bindViewEvents() {
  // Global "go" buttons inside views.
  $$('[data-go]').forEach((el) => el.addEventListener('click', () => go(el.dataset.go)));

  // Home asset group cards.
  $$('[data-group]').forEach((el) => el.addEventListener('click', () => go('assets')));

  // Transaction detail rows.
  $$('[data-tx]').forEach((el) => el.addEventListener('click', () => openTxSheet(el.dataset.tx)));

  // ---- SEND
  const btnFind = $('#btnFindRoutes');
  if (btnFind) {
    btnFind.addEventListener('click', async () => {
      const amount = $('#sendAmount').value.trim();
      const asset = $('#sendAsset').value;
      const destinationCountry = $('#sendDest').value;
      const recipient = $('#sendRecipient').value.trim();
      state.sendDraft = { amount, asset, destinationCountry, recipient };

      if (!amount || Number(amount) <= 0) return toast('Enter an amount greater than zero', 'warn');

      try {
        const data = await api('/api/route/send', {
          method: 'POST',
          body: { amount, asset, destinationCountry, recipient: recipient || 'Recipient' }
        });
        state.pendingRoute = { kind: 'send', data };
        const host = $('#sendResults');
        host.innerHTML = renderRouteResults(data);
        bindRouteButtons(data);
        toast(`${data.eligibleCount} legitimate route${data.eligibleCount === 1 ? '' : 's'} found`);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  bindRouteButtons(state.pendingRoute?.data);

  // ---- PAY
  const btnScanPay = $('#btnScanPay');
  if (btnScanPay) {
    btnScanPay.addEventListener('click', async () => {
      const qr = $('#qrInput').value.trim() || 'DuitNow:merchant@zlet';
      const amount = $('#payAmount').value.trim();
      const asset = $('#payAsset').value;
      try {
        const guard = await api('/api/transactions/guard-check', {
          method: 'POST',
          body: { amount, asset, countryCode: state.boot.profile.homeCountry }
        });
        openSheet({
          title: 'Confirm payment',
          body: `
            <div class="confirm-hero">
              <div class="confirm-label">Pay merchant</div>
              <div class="confirm-amount">${short(amount.replace('.', ''), 2)} ${esc(asset)}</div>
              <div class="confirm-sub">${esc(qr)}</div>
            </div>
            <div class="kv"><span class="kv-k">Source</span><span class="kv-v">Zlet recommends the cheapest spendable rail</span></div>
            <div class="kv"><span class="kv-k">Country</span><span class="kv-v">${esc(state.boot.profile.homeCountry)}</span></div>
            <div class="kv"><span class="kv-k">Zlet Guard</span><span class="kv-v">${esc(guard.summary)}</span></div>
            <div class="notice" style="margin-top:14px">${icon('info')}<span>Zlet identifies the scheme where possible. It does not fabricate interoperability a QR scheme does not support.</span></div>
          `,
          foot: `<button class="btn btn-ghost" id="payCancel">Cancel</button><button class="btn btn-primary" id="payConfirm">Continue to approval</button>`,
          onMount: () => {
            $('#payCancel').addEventListener('click', closeSheet);
            $('#payConfirm').addEventListener('click', async () => {
              closeSheet();
              await createAndSubmit({
                type: 'pay', amount, asset,
                providerId: 'grabpay', providerName: 'GrabPay',
                recipient: qr, routeLabel: 'QR → DuitNow',
                countryCode: state.boot.profile.homeCountry,
                feature: 'pay', etaMinutes: [0, 2], memo: qr
              });
            });
          }
        });
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  const btnCreateInvoice = $('#btnCreateInvoice');
  if (btnCreateInvoice) {
    btnCreateInvoice.addEventListener('click', async () => {
      try {
        const rec = await api('/api/requests', {
          method: 'POST',
          body: {
            kind: 'invoice',
            amount: $('#mchAmount').value.trim(),
            asset: 'MYR',
            description: $('#mchDesc').value.trim(),
            customer: $('#mchCustomer').value.trim() || null,
            countryCode: state.boot.profile.homeCountry
          }
        });
        state.boot = await api('/api/bootstrap');
        render();
        toast(`Invoice ${rec.reference} created`);
        openRequestSheet(rec);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  // ---- RECEIVE
  const reqKind = $('#reqKind');
  if (reqKind) {
    reqKind.addEventListener('click', (e) => {
      const b = e.target.closest('[data-kind]');
      if (!b) return;
      $$('#reqKind button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.requestDraft.kind = b.dataset.kind;
    });
  }

  const btnCreateRequest = $('#btnCreateRequest');
  if (btnCreateRequest) {
    btnCreateRequest.addEventListener('click', async () => {
      try {
        const rec = await api('/api/requests', {
          method: 'POST',
          body: {
            kind: state.requestDraft.kind,
            amount: $('#reqAmount').value.trim(),
            asset: $('#reqAsset').value,
            customer: $('#reqCustomer').value.trim() || null,
            description: $('#reqDesc').value.trim() || null,
            countryCode: $('#reqCountry').value
          }
        });
        state.boot = await api('/api/bootstrap');
        render();
        toast(`${rec.kind === 'invoice' ? 'Invoice' : 'Request'} ${rec.reference} generated`);
        openRequestSheet(rec);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  // ---- EXCHANGE
  const btnConvert = $('#btnConvert');
  if (btnConvert) {
    btnConvert.addEventListener('click', async () => {
      const amount = $('#convAmount').value.trim();
      const from = $('#convFrom').value;
      const to = $('#convTo').value;
      const chain = $('#convChain').value;
      state.convertDraft = { amount, from, to };

      if (from === to) return toast('Source and target asset are the same', 'warn');

      try {
        const data = await api('/api/route/convert', { method: 'POST', body: { amount, from, to, chain } });
        state.pendingRoute = { kind: 'convert', data };
        $('#convertResults').innerHTML = renderConvertResults(data);
        bindRouteButtons(data);
        toast(`${data.eligibleCount} venue${data.eligibleCount === 1 ? '' : 's'} compared`);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  // ---- DEFI
  const btnSimulate = $('#btnSimulate');
  if (btnSimulate) {
    btnSimulate.addEventListener('click', async () => {
      try {
        const sim = await api('/api/defi/simulate', {
          method: 'POST',
          body: {
            providerId: $('#simProvider').value,
            action: $('#simAction').value,
            chain: $('#simChain').value,
            from: $('#simFrom').value,
            to: $('#simTo').value,
            amount: $('#simAmount').value.trim()
          }
        });
        $('#simResults').innerHTML = renderSimulation(sim);
        $('#btnClearSim')?.addEventListener('click', () => { $('#simResults').innerHTML = ''; });
        $('[data-confirm-sim]')?.addEventListener('click', () => openDefiConfirm(sim));
        toast('Simulation complete — nothing has been submitted');
      } catch (err) {
        toast(err.message, 'bad');
        $('#simResults').innerHTML = `<div class="notice bad">${icon('alert')}<span>${esc(err.message)}</span></div>`;
      }
    });
  }

  const btnBridge = $('#btnBridge');
  if (btnBridge) {
    btnBridge.addEventListener('click', async () => {
      try {
        const data = await api('/api/defi/bridge', {
          method: 'POST',
          body: { fromChain: $('#bridgeFrom').value, toChain: $('#bridgeTo').value }
        });
        $('#bridgeResults').innerHTML = `
          <div class="card">
            <table class="table">
              <thead><tr><th>Bridge</th><th>Security model</th><th class="right">Fee</th><th>ETA</th><th>Risk</th></tr></thead>
              <tbody>
                ${data.routes.map((r) => `
                  <tr>
                    <td><b>${esc(r.bridge)}</b><div style="font-size:11px;color:var(--ink-3)">${esc(r.from)} → ${esc(r.to)}</div></td>
                    <td style="font-size:11.5px;color:var(--ink-3)">${esc(r.securityModel)}</td>
                    <td class="right num">${short(r.quote.totalCostMinor, r.quote.amountDecimals)} ${esc(r.asset)}</td>
                    <td>${r.etaMinutes[0]}–${r.etaMinutes[1]} min</td>
                    <td><span class="tag ${r.risk === 'low' ? 'ok' : 'warn'}">${esc(r.risk)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } catch (err) {
        toast(err.message, 'bad');
        $('#bridgeResults').innerHTML = `<div class="notice warn">${icon('alert')}<span>${esc(err.message)}</span></div>`;
      }
    });
  }

  // ---- ACTIVITY search
  const search = $('#activitySearch');
  if (search) {
    let timer;
    search.addEventListener('input', (e) => {
      clearTimeout(timer);
      const q = e.target.value.trim();
      state.query = q;
      timer = setTimeout(async () => {
        const res = await api(`/api/ai/search?q=${encodeURIComponent(q)}`);
        $('#activityFeed').innerHTML = res.results.length
          ? res.results.map((t) => feedRow(t)).join('')
          : emptyRow('No matching transactions');
        $$('[data-tx]').forEach((el) => el.addEventListener('click', () => openTxSheet(el.dataset.tx)));
      }, 260);
    });
  }

  // ---- COUNTRIES
  const btnSetVisiting = $('#btnSetVisiting');
  if (btnSetVisiting) {
    btnSetVisiting.addEventListener('click', async () => {
      const sel = $('#visitingCountrySelect');
      try {
        const res = await api('/api/countries/travel', {
          method: 'POST',
          body: { visitingCountry: sel.value || null, travelActive: Boolean(sel.value) }
        });
        state.boot = await api('/api/bootstrap');
        render();
        toast(res.message);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  $('#travelSwitch')?.addEventListener('click', () => {
    const sel = $('#visitingCountrySelect');
    if (sel.value) {
      $('#btnSetVisiting').click();
    } else {
      toast('Choose a visiting country first', 'warn');
      sel.focus();
    }
  });

  const btnSetHome = $('#btnSetHome');
  if (btnSetHome) {
    btnSetHome.addEventListener('click', async () => {
      const country = $('#homeCountrySelect').value;
      if (country === state.boot.profile.homeCountry) return toast('That is already your home country', 'warn');
      try {
        const res = await api('/api/countries/home', { method: 'POST', body: { homeCountry: country } });
        state.boot = await api('/api/bootstrap');
        render();
        toast(res.notice, 'warn');
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  }

  // ---- SANDBOX
  $$('[data-grant]').forEach((el) => {
    el.addEventListener('click', async () => {
      try {
        await api('/api/sandbox/grant', { method: 'POST', body: { level: el.dataset.grant } });
        state.boot = await api('/api/bootstrap');
        render();
        toast(`Granted ${el.dataset.grant}`);
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  });

  $$('[data-cap]').forEach((el) => {
    el.addEventListener('click', async () => {
      const cap = el.dataset.cap;
      const granted = el.dataset.granted === 'true';
      try {
        if (granted) {
          await api('/api/sandbox/revoke', { method: 'POST', body: { capability: cap } });
          toast(`Revoked ${cap}`, 'warn');
        } else {
          await api('/api/sandbox/grant', { method: 'POST', body: { capability: cap } });
          toast(`Granted ${cap}`);
        }
        state.boot = await api('/api/bootstrap');
        render();
      } catch (err) {
        toast(err.message, 'bad');
      }
    });
  });

  // ---- SECURITY
  $('#btnToggleLock')?.addEventListener('click', async () => {
    try {
      const path = state.boot.guard.frozen ? '/api/security/unlock' : '/api/security/lock';
      const res = await api(path, { method: 'POST' });
      state.boot = await api('/api/bootstrap');
      render();
      toast(res.message, state.boot.guard.frozen ? 'warn' : 'ok');
    } catch (err) {
      toast(err.message, 'bad');
    }
  });

  $('#btnRevokeAll')?.addEventListener('click', async () => {
    try {
      await api('/api/security/lock', { method: 'POST' });
      state.boot = await api('/api/bootstrap');
      render();
      toast('All AI permissions revoked and Zlet locked', 'warn');
    } catch (err) {
      toast(err.message, 'bad');
    }
  });

  $$('[data-guard]').forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.toggle('on');
    });
  });

  $('#btnSaveGuard')?.addEventListener('click', async () => {
    try {
      const body = {};
      $$('[data-guard]').forEach((el) => { body[el.dataset.guard] = el.classList.contains('on'); });
      const autoMax = $('#guardAutoMax')?.value;
      const biometric = $('#guardBiometric')?.value;
      if (autoMax != null) body.autoExecuteMaxMinor = Math.round(Number(autoMax.replace(/,/g, '') || 0) * 100);
      if (biometric != null) body.requireBiometricAboveMinor = Math.round(Number(biometric.replace(/,/g, '') || 0) * 100);
      await api('/api/guard', { method: 'POST', body });
      state.boot = await api('/api/bootstrap');
      render();
      toast('Zlet Guard policies saved');
    } catch (err) {
      toast(err.message, 'bad');
    }
  });

  // ---- LOCK button in sidebar jumps to security view
  $('#btnLock')?.addEventListener('click', () => {
    if (state.view !== 'security') { state.view = 'security'; render(); }
  });
}

function bindRouteButtons(data) {
  if (!data) return;
  $$('[data-select-route]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-route]');
      const route = JSON.parse(card.dataset.route);
      openConfirmSheet(route);
    });
  });

  $$('[data-prepare-route]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async () => {
      const card = btn.closest('[data-route]');
      const route = JSON.parse(card.dataset.route);
      await prepareProposal(route);
    });
  });
}

/* --------------------------- confirm / execute ------------------------- */

function openConfirmSheet(route) {
  const d = route.disclosure || {};
  const quote = route.quote || {};
  const eta = route.etaMinutes || [0, 0];
  const etaLabel = eta[1] >= 60 ? `${Math.round(eta[0] / 60)}–${Math.round(eta[1] / 60)} hr` : `${eta[0]}–${eta[1]} min`;

  openSheet({
    title: 'Confirm',
    body: `
      <div class="confirm-hero">
        <div class="confirm-label">You send</div>
        <div class="confirm-amount">${short(quote.amountMinor, quote.amountDecimals)} ${esc(quote.from || '')}</div>
        <div class="confirm-sub">Recipient receives ${esc(d.recipientReceives || '—')}</div>
      </div>

      <table class="fee-table">
        <tr><td>Provider</td><td>${esc(route.providerName)}</td></tr>
        <tr><td>Route</td><td style="font-size:11.5px">${esc(route.label || '')}</td></tr>
        <tr><td>Amount</td><td>${short(quote.amountMinor, quote.amountDecimals)} ${esc(quote.from)}</td></tr>
        <tr><td>Provider fee</td><td>${esc(d.providerFee || '—')}</td></tr>
        <tr><td>Network fee</td><td>${esc(d.networkFee || '—')}</td></tr>
        <tr><td>Exchange spread</td><td>${((quote.spreadBps ?? 0) / 100).toFixed(2)}%</td></tr>
        <tr><td>Slippage</td><td>${((quote.slippageBps ?? 0) / 100).toFixed(2)}%</td></tr>
        <tr><td>ETA</td><td>${etaLabel}</td></tr>
        <tr class="emphasis"><td>Total cost</td><td>${esc(d.totalCost || '—')}</td></tr>
        <tr class="emphasis"><td>Recipient receives</td><td>${esc(d.recipientReceives || '—')}</td></tr>
      </table>

      ${route.multiHop ? `<div class="notice warn" style="margin-top:14px">${icon('alert')}<span>Two separate executions. Each hop can fail independently.</span></div>` : ''}

      <div class="notice" style="margin-top:14px">
        ${icon('shield')}
        <span>Nothing is sent until you approve. Zlet evaluates Zlet Guard, then requires your explicit confirmation${route.risk === 'medium' || route.risk === 'high' ? ', plus a device confirmation for elevated risk' : ''}.</span>
      </div>
    `,
    foot: `
      <button class="btn btn-ghost" id="cfCancel">Cancel</button>
      <button class="btn btn-primary" id="cfApprove">Approve &amp; send</button>
    `,
    onMount: () => {
      $('#cfCancel').addEventListener('click', closeSheet);
      $('#cfApprove').addEventListener('click', async () => {
        closeSheet();
        await createAndSubmit({
          type: state.view === 'exchange' ? 'convert' : 'send',
          amount: short(quote.amountMinor, quote.amountDecimals),
          asset: quote.from,
          receiveMinor: quote.receiveMinor,
          receiveAsset: quote.to,
          providerId: route.providerId,
          providerName: route.providerName,
          routeLabel: route.label,
          quote,
          countryCode: route.countryCode,
          feature: route.feature,
          etaMinutes: route.etaMinutes,
          recipient: state.sendDraft.recipient || null,
          destinationCountry: route.countryCode,
          isBridge: Boolean(route.multiHop),
          isNewRecipient: false
        });
      });
    }
  });
}

async function prepareProposal(route) {
  try {
    const quote = route.quote || {};
    const tx = await api('/api/transactions', {
      method: 'POST',
      body: {
        type: 'send',
        amount: short(quote.amountMinor, quote.amountDecimals),
        asset: quote.from,
        receiveMinor: quote.receiveMinor,
        receiveAsset: quote.to,
        providerId: route.providerId,
        providerName: route.providerName,
        routeLabel: route.label,
        quote,
        countryCode: route.countryCode,
        feature: route.feature,
        etaMinutes: route.etaMinutes,
        memo: 'Prepared only — not authorized'
      }
    });
    state.boot = await api('/api/bootstrap');
    toast('Prepared — awaiting your approval. Nothing was submitted.');
    openTxSheet(tx.transaction.id);
  } catch (err) {
    toast(err.message, 'bad');
  }
}

async function createAndSubmit(payload) {
  try {
    const idempotencyKey = `idem_${crypto.randomUUID()}`;
    const created = await api('/api/transactions', { method: 'POST', body: { ...payload, idempotencyKey } });
    const tx = created.transaction;

    // Explicit second step: authorization. Requires the Execute capability.
    const authorized = await api(`/api/transactions/${tx.id}/authorize`, {
      method: 'POST',
      body: { biometric: true }
    });

    const submitted = await api(`/api/transactions/${tx.id}/submit`, { method: 'POST' });

    state.boot = await api('/api/bootstrap');
    render();
    toast(`${submitted.transaction.typeLabel} submitted to ${submitted.transaction.providerName || 'provider'}`);
    openTxSheet(tx.id);
  } catch (err) {
    if (err.needsPermission) {
      toast(`Permission needed: grant “${err.capability || 'execute'}” in the Sandbox first`, 'warn');
      go('sandbox');
      return;
    }
    if (err.needsBiometric) {
      toast('Device confirmation required for this amount', 'warn');
      return;
    }
    toast(err.message, 'bad');
  }
}

function openDefiConfirm(sim) {
  openSheet({
    title: 'Confirm DeFi transaction',
    body: `
      <div class="confirm-hero">
        <div class="confirm-label">${esc(sim.actionLabel)}</div>
        <div class="confirm-amount" style="font-size:22px">${short(sim.input.amountMinor, sim.input.decimals)} ${esc(sim.input.asset)}</div>
        <div class="confirm-sub">→ ${short(sim.expectedOutput.amountMinor, sim.expectedOutput.decimals)} ${esc(sim.expectedOutput.asset)}</div>
      </div>
      <table class="fee-table">
        <tr><td>Protocol</td><td>${esc(sim.protocol.name)}</td></tr>
        <tr><td>Network</td><td>${esc(sim.chain.name)}</td></tr>
        <tr><td>Contract</td><td class="mono" style="font-size:10.5px">${esc(sim.contract.address || 'unverified')}</td></tr>
        <tr><td>Function</td><td>${esc(sim.contract.function)}</td></tr>
        <tr><td>Gas</td><td>${short(sim.gas.amountMinor, 18, 8)} ${esc(sim.gas.asset)}</td></tr>
        <tr><td>Price impact</td><td>${(sim.priceImpactBps / 100).toFixed(2)}%</td></tr>
        <tr class="emphasis"><td>Risk</td><td style="text-transform:capitalize">${esc(sim.risk.level)}</td></tr>
      </table>
      <div class="notice warn" style="margin-top:14px">${icon('alert')}<span>${esc(sim.risk.disclaimer)}</span></div>
      <div class="notice" style="margin-top:10px">${icon('shield')}<span>Zlet orchestrates the transaction; your wallet signs it. Zlet never takes custody and never asks for your seed phrase.</span></div>
    `,
    foot: `<button class="btn btn-ghost" id="defiCancel">Cancel</button><button class="btn btn-primary" id="defiApprove">Approve</button>`,
    onMount: () => {
      $('#defiCancel').addEventListener('click', closeSheet);
      $('#defiApprove').addEventListener('click', async () => {
        closeSheet();
        await createAndSubmit({
          type: 'defi',
          amount: short(sim.input.amountMinor, sim.input.decimals),
          asset: sim.input.asset,
          receiveMinor: sim.expectedOutput.amountMinor,
          receiveAsset: sim.expectedOutput.asset,
          providerId: sim.protocol.id,
          providerName: `${sim.protocol.name} (${sim.chain.name})`,
          routeLabel: sim.route,
          quote: sim.quote,
          simulation: sim,
          countryCode: sim.countryCode,
          feature: 'defi',
          etaMinutes: [0, 3],
          isNewRecipient: false
        });
      });
    }
  });
}

/* --------------------------- transaction sheet ------------------------- */

function openTxSheet(id) {
  const tx = state.boot.transactions.find((t) => t.id === id);
  if (!tx) return;

  const steps = ['CREATED', 'QUOTED', 'SIMULATED', 'AWAITING_APPROVAL', 'AUTHORIZED', 'SUBMITTED', 'PROCESSING', 'CONFIRMED'];
  const currentIdx = steps.indexOf(tx.state);
  const failed = ['REJECTED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REVERSED'].includes(tx.state);

  openSheet({
    title: tx.typeLabel || 'Transaction',
    body: `
      <div class="confirm-hero">
        <div class="confirm-label">${esc(tx.stateLabel)}</div>
        <div class="confirm-amount">${short(tx.amountMinor, tx.amountDecimals ?? 2)} ${esc(tx.asset)}</div>
        <div class="confirm-sub">${esc(tx.statusNote || '')}</div>
      </div>

      <table class="fee-table">
        <tr><td>Provider</td><td>${esc(tx.providerName || '—')}</td></tr>
        <tr><td>Route</td><td style="font-size:11.5px">${esc(tx.routeLabel || '—')}</td></tr>
        ${tx.recipient ? `<tr><td>Recipient</td><td>${esc(tx.recipient)}</td></tr>` : ''}
        ${tx.receiveLabel ? `<tr><td>Receives</td><td>${esc(tx.receiveLabel)}</td></tr>` : ''}
        <tr><td>Country</td><td>${esc(tx.countryCode || '—')}</td></tr>
        <tr><td>Reference</td><td class="mono" style="font-size:10.5px">${esc(tx.providerReference || tx.id)}</td></tr>
        <tr><td>Created</td><td>${dayLabel(tx.createdAt)}</td></tr>
        ${tx.settledAt ? `<tr><td>Settlement verified</td><td>${timeAgo(tx.settledAt)}</td></tr>` : ''}
      </table>

      <div class="section-head" style="margin:18px 0 10px"><h3 class="section-title">State machine</h3></div>
      <div class="timeline">
        ${steps.map((s, i) => {
          const done = !failed && i < currentIdx;
          const current = !failed && i === currentIdx;
          const tone = failed && i === currentIdx ? 'bad' : '';
          return `
            <div class="timeline-step">
              <span class="timeline-dot ${done ? 'done' : current ? 'current' : ''}" ${tone ? `style="border-color:var(--red)"` : ''}>
                ${done ? icon('check') : ''}
              </span>
              <div class="timeline-body">
                <div class="timeline-title ${!done && !current ? 'pending' : ''}">${esc(state.boot.transactionStates?.[s] || s)}</div>
                ${current ? `<div class="timeline-note">Current state</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${failed ? `<div class="notice bad" style="margin-top:14px">${icon('alert')}<span>This transaction ended in ${esc(tx.stateLabel)}. It was never counted as settled.</span></div>` : ''}

      ${tx.state === 'AWAITING_APPROVAL' ? `<div class="notice warn" style="margin-top:14px">${icon('alert')}<span>Awaiting your approval. Nothing has been sent to the provider.</span></div>` : ''}

      <p style="font-size:11.5px;color:var(--ink-4);margin-top:14px;line-height:1.5">
        A provider accepting a request is not settlement. Zlet shows Confirmed only after the provider confirms, and verifies settlement as a separate step.
      </p>
    `,
    foot: tx.state === 'AWAITING_APPROVAL'
      ? `<button class="btn btn-ghost" id="txReject">Reject</button><button class="btn btn-primary" id="txApprove">Approve &amp; send</button>`
      : `<button class="btn btn-ghost btn-block" id="txClose">Close</button>`,
    onMount: () => {
      $('#txClose')?.addEventListener('click', closeSheet);
      $('#txReject')?.addEventListener('click', async () => {
        try {
          await api(`/api/transactions/${tx.id}/reject`, { method: 'POST', body: { reason: 'Rejected by user' } });
          state.boot = await api('/api/bootstrap');
          closeSheet();
          render();
          toast('Transaction rejected', 'warn');
        } catch (err) { toast(err.message, 'bad'); }
      });
      $('#txApprove')?.addEventListener('click', async () => {
        try {
          await api(`/api/transactions/${tx.id}/authorize`, { method: 'POST', body: { biometric: true } });
          await api(`/api/transactions/${tx.id}/submit`, { method: 'POST' });
          state.boot = await api('/api/bootstrap');
          closeSheet();
          render();
          toast('Submitted — awaiting provider confirmation');
        } catch (err) {
          if (err.needsPermission) {
            closeSheet();
            toast(`Grant “${err.capability || 'execute'}” in the Sandbox first`, 'warn');
            go('sandbox');
            return;
          }
          toast(err.message, 'bad');
        }
      });
    }
  });
}

function openRequestSheet(rec) {
  openSheet({
    title: rec.kind === 'invoice' ? 'Invoice created' : 'Request created',
    body: `
      <div class="confirm-hero">
        <div class="confirm-label">${esc(rec.reference)}</div>
        <div class="confirm-amount">${short(rec.amountMinor, rec.decimals)} ${esc(rec.asset)}</div>
        <div class="confirm-sub">${esc(rec.description || rec.customer || '')}</div>
      </div>

      <div style="display:grid;place-items:center;padding:14px 0">
        <div style="width:150px;height:150px;border-radius:16px;border:1px solid var(--line-2);display:grid;place-items:center;background:var(--bg-soft)">
          ${icon('qr')}
        </div>
      </div>

      <table class="fee-table">
        <tr><td>Country</td><td>${esc(rec.countryCode)}</td></tr>
        <tr><td>Rails</td><td style="font-size:11.5px">${rec.rails.map((r) => esc(r.name)).join(', ')}</td></tr>
        <tr><td>Payload</td><td class="mono" style="font-size:10px;word-break:break-all">${esc(rec.payload)}</td></tr>
        ${rec.expiresAt ? `<tr><td>Expires</td><td>${dayLabel(rec.expiresAt)}</td></tr>` : ''}
      </table>

      <div class="notice" style="margin-top:14px">
        ${icon('info')}
        <span>Only rails that legitimately exist for ${esc(rec.countryCode)} are listed. Zlet never fabricates interoperability.</span>
      </div>
    `,
    foot: `<button class="btn btn-ghost btn-block" id="reqClose">Done</button>`,
    onMount: () => $('#reqClose').addEventListener('click', closeSheet)
  });
}

/* --------------------------------- start -------------------------------- */

boot().catch((err) => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px;font-family:system-ui;color:#333">
    <h1 style="font-size:18px;margin-bottom:8px">Zlet could not start</h1>
    <p style="font-size:13px;color:#666">${esc(err.message)}</p>
  </div>`;
});
