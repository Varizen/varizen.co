/**
 * Zlet — country profiles + Availability Engine (prompt §38) + the
 * two-country travel rule.
 *
 * THE TRAVEL RULE
 * ---------------
 * A Zlet account may reference at most TWO countries at any time:
 *
 *   1. the user's HOME country   (where the account is established / KYC'd)
 *   2. the VISITING country      (where they currently are, e.g. travelling)
 *
 * This is an architectural constraint, not a UI hint. It is enforced in
 * `assertCountryChangeAllowed()` for every path that can introduce a country
 * (connection creation, travel mode, quote filtering, provider discovery), so no
 * code path can silently expand the account to a third jurisdiction.
 *
 * Why: Zlet's availability, licensing, limits and provider set are all
 * jurisdiction-scoped. Supporting exactly one home + one visiting jurisdiction
 * keeps the compliance surface honest and auditable — the router can only ever
 * present routes that are legitimate for those two countries.
 */

import { config } from './config.js';

/** Country registry. Deliberately explicit: no assumptions about a country's rails. */
export const COUNTRIES = {
  MY: {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
    region: 'APAC',
    dial: '+60',
    timeZone: 'Asia/Kuala_Lumpur',
    /** Local rails typically available. Adapters still advertise their own caps. */
    rails: ['mfs', 'qr', 'payment-wallet', 'card-wallet', 'remittance', 'stablecoin', 'crypto', 'defi'],
    /** Regulated activity: who must be licensed for each capability. */
    licensing: {
      send: 'licensed',
      exchange: 'licensed',
      custody: 'prohibited-unless-partner',
      defi: 'limited'
    },
    signals: { instantPayments: true, qrStandard: 'DuitNow', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 5_000_000_00, kycTier: 2 }
  },
  BD: {
    code: 'BD',
    name: 'Bangladesh',
    flag: '🇧🇩',
    currency: 'BDT',
    currencySymbol: '৳',
    region: 'APAC',
    dial: '+880',
    timeZone: 'Asia/Dhaka',
    rails: ['mfs', 'payment-wallet', 'remittance', 'stablecoin', 'card-wallet'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'prohibited-unless-partner', defi: 'prohibited' },
    signals: { instantPayments: true, qrStandard: 'Bangla QR', cardNetwork: true, cryptoLegal: false, defiLegal: 'prohibited' },
    limits: { dailyCrossBorderMinor: 1_200_000_00, kycTier: 2 }
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    region: 'APAC',
    dial: '+65',
    timeZone: 'Asia/Singapore',
    rails: ['payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin', 'crypto', 'defi'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'PayNow', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 8_000_000_00, kycTier: 2 }
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'د.إ',
    region: 'MEA',
    dial: '+971',
    timeZone: 'Asia/Dubai',
    rails: ['payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin', 'crypto'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'UAEQR', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 9_000_000_00, kycTier: 2 }
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    region: 'EMEA',
    dial: '+44',
    timeZone: 'Europe/London',
    rails: ['payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin', 'crypto', 'defi'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'FPS QR', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 10_000_000_00, kycTier: 2 }
  },
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    region: 'AMER',
    dial: '+1',
    timeZone: 'America/New_York',
    rails: ['payment-wallet', 'card-wallet', 'remittance', 'stablecoin', 'crypto'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'None', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 12_000_000_00, kycTier: 2 }
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    region: 'APAC',
    dial: '+91',
    timeZone: 'Asia/Kolkata',
    rails: ['mfs', 'payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'prohibited-unless-partner', defi: 'prohibited' },
    signals: { instantPayments: true, qrStandard: 'UPI', cardNetwork: true, cryptoLegal: 'restricted', defiLegal: 'prohibited' },
    limits: { dailyCrossBorderMinor: 3_000_000_00, kycTier: 2 }
  },
  PK: {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    currencySymbol: '₨',
    region: 'APAC',
    dial: '+92',
    timeZone: 'Asia/Karachi',
    rails: ['mfs', 'payment-wallet', 'qr', 'remittance'],
    licensing: { send: 'licensed', exchange: 'partner', custody: 'prohibited-unless-partner', defi: 'prohibited' },
    signals: { instantPayments: true, qrStandard: 'Raast QR', cardNetwork: true, cryptoLegal: false, defiLegal: 'prohibited' },
    limits: { dailyCrossBorderMinor: 900_000_00, kycTier: 2 }
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    region: 'EMEA',
    dial: '+49',
    timeZone: 'Europe/Berlin',
    rails: ['payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin', 'crypto', 'defi'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'EPC QR', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 10_000_000_00, kycTier: 2 }
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    region: 'APAC',
    dial: '+61',
    timeZone: 'Australia/Sydney',
    rails: ['payment-wallet', 'qr', 'card-wallet', 'remittance', 'stablecoin', 'crypto', 'defi'],
    licensing: { send: 'licensed', exchange: 'licensed', custody: 'licensed-partner', defi: 'limited' },
    signals: { instantPayments: true, qrStandard: 'PayID', cardNetwork: true, cryptoLegal: true, defiLegal: 'limited' },
    limits: { dailyCrossBorderMinor: 9_000_000_00, kycTier: 2 }
  }
};

export const COUNTRY_LIST = Object.values(COUNTRIES);

export const AVAILABILITY = {
  AVAILABLE: 'available',
  LIMITED: 'limited',
  NOT_SUPPORTED: 'not_supported',
  REQUIRES_VERIFICATION: 'requires_verification',
  REQUIRES_LICENSED_PARTNER: 'requires_licensed_partner'
};

export const AVAILABILITY_LABELS = {
  [AVAILABILITY.AVAILABLE]: 'Available',
  [AVAILABILITY.LIMITED]: 'Limited',
  [AVAILABILITY.NOT_SUPPORTED]: 'Not supported',
  [AVAILABILITY.REQUIRES_VERIFICATION]: 'Requires verification',
  [AVAILABILITY.REQUIRES_LICENSED_PARTNER]: 'Requires licensed partner'
};

/**
 * Zlet supports at most two active countries: home + one visiting.
 * `profile` must contain { homeCountry, visitingCountry, travelActive }.
 */
export const MAX_ACTIVE_COUNTRIES = config.maxActiveCountries;

export function isKnownCountry(code) {
  return Boolean(code && COUNTRIES[String(code).toUpperCase()]);
}

export function country(code) {
  const c = COUNTRIES[String(code || '').toUpperCase()];
  return c || null;
}

/** The set of countries currently in scope for this account (1 or 2 entries). */
export function activeCountries(profile) {
  const codes = [];
  if (profile?.homeCountry && isKnownCountry(profile.homeCountry)) codes.push(profile.homeCountry.toUpperCase());
  if (profile?.travelActive && profile?.visitingCountry && isKnownCountry(profile.visitingCountry)) {
    const visit = profile.visitingCountry.toUpperCase();
    if (!codes.includes(visit)) codes.push(visit);
  }
  return codes.map((c) => COUNTRIES[c]);
}

export function activeCountryCodes(profile) {
  return activeCountries(profile).map((c) => c.code);
}

/** Is `code` inside the account's 2-country scope? */
export function inScope(profile, code) {
  return activeCountryCodes(profile).includes(String(code || '').toUpperCase());
}

/**
 * The single gate every country-touching path must call.
 *
 * @param {object} profile      current profile
 * @param {object} next         proposed change: { homeCountry?, visitingCountry?, travelActive? }
 * @returns {{ ok: true, profile: object }}
 * @throws 400 with `code: 'COUNTRY_LIMIT'` when a 3rd country would be introduced
 */
export function assertCountryChangeAllowed(profile, next = {}) {
  const proposed = {
    homeCountry: next.homeCountry ? String(next.homeCountry).toUpperCase() : profile.homeCountry,
    visitingCountry: next.visitingCountry !== undefined
      ? (next.visitingCountry ? String(next.visitingCountry).toUpperCase() : null)
      : profile.visitingCountry,
    travelActive: next.travelActive !== undefined ? Boolean(next.travelActive) : Boolean(profile.travelActive)
  };

  for (const [key, value] of [['homeCountry', proposed.homeCountry], ['visitingCountry', proposed.visitingCountry]]) {
    if (value && !isKnownCountry(value)) {
      throw Object.assign(new Error(`Unknown country “${value}” for ${key}.`), { status: 400, code: 'UNKNOWN_COUNTRY' });
    }
  }

  if (proposed.travelActive && !proposed.visitingCountry) {
    throw Object.assign(
      new Error('Travel mode requires a visiting country. Set where you are travelling first.'),
      { status: 400, code: 'VISITING_COUNTRY_REQUIRED' }
    );
  }

  if (proposed.visitingCountry && proposed.visitingCountry === proposed.homeCountry) {
    throw Object.assign(
      new Error('Your visiting country must differ from your home country.'),
      { status: 400, code: 'SAME_COUNTRY' }
    );
  }

  const scope = new Set([proposed.homeCountry, proposed.visitingCountry].filter(Boolean));
  if (scope.size > MAX_ACTIVE_COUNTRIES) {
    throw Object.assign(
      new Error(
        `Zlet supports at most ${MAX_ACTIVE_COUNTRIES} countries at a time: your home country and one visiting country. ` +
          'Remove the current visiting country before adding another.'
      ),
      { status: 400, code: 'COUNTRY_LIMIT' }
    );
  }

  return { ok: true, profile: proposed };
}

/**
 * Availability Engine — per feature, per country.
 * Never expose a feature just because an API exists.
 */
export function featureAvailability(countryCode, feature) {
  const c = country(countryCode);
  if (!c) return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Unknown country' };

  const rails = new Set(c.rails);
  const lic = c.licensing || {};
  const sig = c.signals || {};

  switch (feature) {
    case 'pay':
      if (rails.has('qr') || rails.has('payment-wallet') || rails.has('card-wallet')) {
        return { status: AVAILABILITY.AVAILABLE, reason: `${c.name} supports wallet/QR payments via ${sig.qrStandard || 'provider rails'}.` };
      }
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: `No connected payment rail is permitted in ${c.name}.` };

    case 'send':
    case 'send_local':
      return lic.send === 'licensed'
        ? { status: AVAILABILITY.AVAILABLE, reason: 'Domestic send through licensed providers.' }
        : { status: AVAILABILITY.REQUIRES_LICENSED_PARTNER, reason: 'Requires a licensed money-transfer partner.' };

    case 'send_global':
      if (lic.send === 'licensed') return { status: AVAILABILITY.AVAILABLE, reason: 'Cross-border remittance via licensed partner.' };
      if (lic.send === 'partner') return { status: AVAILABILITY.REQUIRES_LICENSED_PARTNER, reason: 'Cross-border send needs a licensed remittance partner.' };
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Cross-border send is not permitted here.' };

    case 'receive':
      return rails.has('payment-wallet') || rails.has('mfs') || rails.has('stablecoin')
        ? { status: AVAILABILITY.AVAILABLE, reason: 'Receiving interface available on at least one rail.' }
        : { status: AVAILABILITY.LIMITED, reason: 'Receiving limited to provider-native requests.' };

    case 'exchange':
    case 'convert':
      if (lic.exchange === 'licensed') return { status: AVAILABILITY.AVAILABLE, reason: 'Exchange through licensed venue.' };
      if (lic.exchange === 'partner') return { status: AVAILABILITY.REQUIRES_LICENSED_PARTNER, reason: 'Exchange requires a licensed partner.' };
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Exchange is not permitted here.' };

    case 'stablecoin':
      return rails.has('stablecoin')
        ? { status: AVAILABILITY.AVAILABLE, reason: 'Stablecoin transfer available.' }
        : { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Stablecoin rails unavailable.' };

    case 'crypto':
      if (sig.cryptoLegal === true) return { status: AVAILABILITY.AVAILABLE, reason: 'Crypto ownership permitted with KYC.' };
      if (sig.cryptoLegal === 'restricted') return { status: AVAILABILITY.LIMITED, reason: 'Crypto is restricted: disclosure and tax rules apply.' };
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Crypto activity is not permitted in this jurisdiction.' };

    case 'defi':
      if (sig.defiLegal === 'prohibited') return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'DeFi interfaces are not permitted here.' };
      if (sig.defiLegal === 'limited') return { status: AVAILABILITY.LIMITED, reason: 'DeFi limited to vetted, audited protocols.' };
      return { status: AVAILABILITY.AVAILABLE, reason: 'DeFi sandbox available.' };

    case 'qr':
      return rails.has('qr')
        ? { status: AVAILABILITY.AVAILABLE, reason: `${sig.qrStandard} QR scheme supported.` }
        : { status: AVAILABILITY.NOT_SUPPORTED, reason: 'No interoperable QR scheme is exposed here.' };

    case 'nfc':
      return { status: AVAILABILITY.LIMITED, reason: 'Tap-to-pay depends on OS secure element + tokenised credentials.' };

    case 'merchant':
      return rails.has('payment-wallet') || rails.has('qr')
        ? { status: AVAILABILITY.AVAILABLE, reason: 'Merchant acceptance through supported rails.' }
        : { status: AVAILABILITY.LIMITED, reason: 'Merchant mode limited to provider-native links.' };

    case 'custody':
      if (lic.custody === 'licensed-partner') return { status: AVAILABILITY.REQUIRES_LICENSED_PARTNER, reason: 'Custody only through a licensed partner.' };
      if (lic.custody === 'prohibited-unless-partner') return { status: AVAILABILITY.REQUIRES_LICENSED_PARTNER, reason: 'Zlet never holds custody; partner required.' };
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: 'Non-custodial by design.' };

    default:
      return { status: AVAILABILITY.NOT_SUPPORTED, reason: `Unknown feature “${feature}”` };
  }
}

/** Full matrix for the two in-scope countries — what the Availability view renders. */
export function availabilityMatrix(profile) {
  const features = [
    'pay', 'send_local', 'send_global', 'receive', 'convert', 'qr', 'nfc',
    'merchant', 'stablecoin', 'crypto', 'defi', 'custody'
  ];
  const countries = activeCountries(profile);
  return {
    scope: countries.map((c) => ({ code: c.code, name: c.name, flag: c.flag, currency: c.currency, role: c.code === profile.homeCountry ? 'home' : 'visiting' })),
    maxActiveCountries: MAX_ACTIVE_COUNTRIES,
    features: features.map((feature) => ({
      feature,
      label: feature.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
      countries: countries.map((c) => ({ code: c.code, ...featureAvailability(c.code, feature) }))
    }))
  };
}

/**
 * Routing filter helper: drop any route whose country is out of the 2-country
 * scope or whose feature is not at least "limited".
 */
export function routeAllowed(profile, { countryCode, feature }) {
  if (!inScope(profile, countryCode)) {
    return { allowed: false, reason: `${countryCode} is outside your ${MAX_ACTIVE_COUNTRIES}-country scope (home + visiting).` };
  }
  const availability = featureAvailability(countryCode, feature);
  const allowed = availability.status === AVAILABILITY.AVAILABLE || availability.status === AVAILABILITY.LIMITED;
  return { allowed, status: availability.status, reason: allowed ? availability.reason : `${availability.reason} (${AVAILABILITY_LABELS[availability.status]})` };
}
