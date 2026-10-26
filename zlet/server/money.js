/**
 * Zlet — money primitives (prompt §48 Decimal / financial math).
 *
 * Rule: never use floating point for money. Every amount is stored as an integer
 * in the asset's smallest unit ("minor units") plus an explicit decimals value.
 *
 *   money = { minor: 1245050n-ish as string, decimals: 2, currency: 'MYR' }
 *
 * Integers are kept as JS `number` when safe (fiat minor units) and as decimal
 * strings for on-chain values that can exceed 2^53. All arithmetic goes through
 * this module so every result is deterministic and auditable.
 */

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

/** Parse "1,234.56" / 1234.56 / "1234" into integer minor units. No float math. */
export function toMinor(amount, decimals = 2) {
  const raw = String(amount ?? '').replace(/[,\s_]/g, '').trim();
  if (raw === '' || raw === '-' || raw === '.') return 0n;
  const neg = raw.startsWith('-');
  const body = neg ? raw.slice(1) : raw;
  if (!/^\d*\.?\d*$/.test(body)) throw Object.assign(new Error(`Invalid amount: ${amount}`), { status: 400 });

  const [whole = '0', frac = ''] = body.split('.');
  if (frac.length > decimals) {
    // Round half-up on the first dropped digit; never silently truncate.
    const keep = frac.slice(0, decimals).padEnd(decimals, '0');
    const nextDigit = Number(frac[decimals] || '0');
    let value = BigInt(`${whole || '0'}${keep || ''}` || '0');
    if (nextDigit >= 5) value += 1n;
    return neg ? -value : value;
  }
  const padded = frac.padEnd(decimals, '0');
  const value = BigInt(`${whole || '0'}${padded}`);
  return neg ? -value : value;
}

/** Integer minor units -> canonical decimal string without float math. */
export function fromMinor(minor, decimals = 2) {
  const value = BigInt(minor);
  const neg = value < 0n;
  const abs = neg ? -value : value;
  const s = abs.toString().padStart(decimals + 1, '0');
  const whole = s.slice(0, s.length - decimals) || '0';
  const frac = decimals ? s.slice(s.length - decimals) : '';
  return `${neg ? '-' : ''}${whole}${decimals ? `.${frac}` : ''}`;
}

/** Human/number form for charts and formatting only. Never for arithmetic. */
export function toNumber(minor, decimals = 2) {
  return Number(fromMinor(minor, decimals));
}

/** Multiply a minor-unit amount by a rational rate, rounding half-up. */
export function multiply(minor, numerator, denominator = 1n, { round = 'half-up' } = {}) {
  const n = BigInt(minor) * BigInt(numerator);
  const d = BigInt(denominator);
  if (d === 0n) throw Object.assign(new Error('Division by zero'), { status: 400 });
  const neg = (n < 0n) !== (d < 0n);
  const an = n < 0n ? -n : n;
  const ad = d < 0n ? -d : d;
  let q = an / ad;
  const r = an % ad;
  if (round === 'half-up' && r * 2n >= ad) q += 1n;
  if (round === 'down') q = an / ad;
  return neg ? -q : q;
}

/** Basis-point helper: 9_500 bps = 95%. */
export function applyBps(minor, bps, opts) {
  return multiply(minor, BigInt(Math.round(bps)), 10_000n, opts);
}

/** Sum minor units. */
export function sum(values) {
  return values.reduce((acc, v) => acc + BigInt(v), 0n);
}

/**
 * Compute a ratio in basis points without floats:
 *   bps(1, 3) = 3333  (0.3333)
 */
export function ratioBps(numerator, denominator) {
  if (BigInt(denominator) === 0n) return 0;
  return Number(multiply(numerator, 10_000n, denominator, { round: 'down' }));
}

/** Format minor units for display, e.g. "$1,234.56". */
export function formatMoney(minor, currency = 'USD', decimals = 2) {
  const body = fromMinor(minor, decimals);
  const [whole, frac] = body.split('.');
  const sign = whole.startsWith('-') ? '-' : '';
  const digits = sign ? whole.slice(1) : whole;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${grouped}${frac ? `.${frac}` : ''} ${currency}`;
}

/**
 * Display amount with trailing zeros trimmed — for crypto/stablecoin values
 * where 18 decimals of padding is noise, not information. Rounds half-up at
 * `maxFractionDigits` using string arithmetic only.
 *   5.000000000000000000 -> "5"
 *   0.159292802873076923 -> "0.159293"
 */
export function displayAmount(minor, decimals = 2, { maxFractionDigits = 6 } = {}) {
  const body = fromMinor(minor, decimals);
  if (!body.includes('.')) return body;
  const [wholeRaw, frac] = body.split('.');
  const neg = wholeRaw.startsWith('-');
  const whole = neg ? wholeRaw.slice(1) : wholeRaw;

  let kept = frac.slice(0, maxFractionDigits);
  const nextDigit = Number(frac[maxFractionDigits] || '0');

  if (nextDigit >= 5) {
    // Increment the kept fraction as an integer string, carrying into the whole.
    const scaled = (BigInt(`${whole}${kept}` || '0') + 1n).toString().padStart(whole.length + kept.length, '0');
    const newWhole = scaled.slice(0, scaled.length - kept.length) || '0';
    const newFrac = scaled.slice(scaled.length - kept.length);
    const trimmed = newFrac.replace(/0+$/, '');
    return `${neg ? '-' : ''}${newWhole}${trimmed ? `.${trimmed}` : ''}`;
  }

  const trimmed = kept.replace(/0+$/, '');
  return `${neg ? '-' : ''}${whole}${trimmed ? `.${trimmed}` : ''}`;
}

/** True when a minor amount fits in a JS safe integer. */
export function isSafe(minor) {
  const v = BigInt(minor);
  return v <= MAX_SAFE && v >= -MAX_SAFE;
}

export const ZERO = 0n;
