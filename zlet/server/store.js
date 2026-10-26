/**
 * Zlet — encrypted local store.
 *
 * Native data principle (prompt §42): balances, wallets, credentials and
 * on-chain assets stay with their providers. This store keeps the *minimum*
 * operational metadata Zlet needs:
 *
 *   - provider connection descriptors (never passwords, keys or seed phrases)
 *   - a normalised balance/position snapshot with a synchronisedAt timestamp
 *   - quotes, simulations, proposals and the audit trail
 *   - the 2-country travel profile
 *
 * Everything is AES-256-GCM encrypted at rest. In tests the store is in-memory
 * so suites can mutate freely.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ZLET_DATA_DIR
  ? path.resolve(process.env.ZLET_DATA_DIR)
  : path.join(__dirname, '..', '.data');
const STORE_FILE = path.join(DATA_DIR, 'zlet.json.enc');
const KEY_FILE = path.join(DATA_DIR, '.key');

const EPHEMERAL = Boolean(process.env.NODE_TEST_CONTEXT) || process.env.ZLET_EPHEMERAL === '1';

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

function loadKey() {
  if (process.env.ZLET_MASTER_KEY) {
    return crypto.createHash('sha256').update(process.env.ZLET_MASTER_KEY).digest();
  }
  if (EPHEMERAL) return crypto.randomBytes(32);
  ensureDir();
  if (fs.existsSync(KEY_FILE)) return Buffer.from(fs.readFileSync(KEY_FILE, 'utf8').trim(), 'base64');
  const key = crypto.randomBytes(32);
  fs.writeFileSync(KEY_FILE, key.toString('base64'), { mode: 0o600 });
  return key;
}

function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return JSON.stringify({
    v: 1,
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: ciphertext.toString('base64')
  });
}

function decrypt(payload, key) {
  const { iv, tag, data } = JSON.parse(payload);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
}

export const emptyState = () => ({
  schemaVersion: 1,
  createdAt: new Date().toISOString(),

  profile: {
    name: 'Demo User',
    homeCountry: 'MY',
    visitingCountry: null,
    travelActive: false,
    currency: 'USD',
    kyc: 'verified',
    biometric: true,
    homeCurrency: 'MYR'
  },

  settings: {
    theme: 'light',
    agentMode: false,
    liveSync: true,
    defaultSlippageBps: 50,
    lastSyncAt: null
  },

  connections: [],
  balances: [],
  positions: [],
  transactions: [],
  quotes: [],
  proposals: [],
  permissionGrants: [],
  recipients: [],
  invoices: [],
  subscriptions: [],
  approvedContracts: [],
  activityLog: [],
  aiProvider: { kind: 'deterministic', model: 'rule-based', allowRemote: false },
  guard: {
    frozen: false,
    autoExecuteMaxMinor: 0,
    requireNewRecipientConfirm: true,
    requireBridgeApproval: true,
    requireBiometricAboveMinor: 50_000,
    blockUnknownContracts: true,
    blockSanctioned: true,
    recurringApproved: false
  },
  /** Idempotency ledger (prompt §47). */
  idempotency: {}
});

class EncryptedStore {
  constructor() {
    this.key = loadKey();
    this.state = this.read();
    this.flushTimer = null;
  }

  read() {
    try {
      if (EPHEMERAL || !fs.existsSync(STORE_FILE)) return emptyState();
      const parsed = JSON.parse(decrypt(fs.readFileSync(STORE_FILE, 'utf8'), this.key));
      const base = emptyState();
      return {
        ...base,
        ...parsed,
        profile: { ...base.profile, ...(parsed.profile || {}) },
        settings: { ...base.settings, ...(parsed.settings || {}) },
        guard: { ...base.guard, ...(parsed.guard || {}) }
      };
    } catch {
      return emptyState();
    }
  }

  persist() {
    if (EPHEMERAL) return;
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, 30);
    if (typeof this.flushTimer.unref === 'function') this.flushTimer.unref();
  }

  flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (EPHEMERAL) return;
    ensureDir();
    const tmp = `${STORE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, encrypt(JSON.stringify(this.state), this.key), { mode: 0o600 });
    fs.renameSync(tmp, STORE_FILE);
  }

  reset() {
    this.state = emptyState();
    this.persist();
  }

  get(pathStr, fallback = undefined) {
    return pathStr.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), this.state) ?? fallback;
  }

  set(pathStr, value) {
    const keys = pathStr.split('.');
    const last = keys.pop();
    let node = this.state;
    for (const k of keys) {
      if (typeof node[k] !== 'object' || node[k] === null) node[k] = {};
      node = node[k];
    }
    node[last] = value;
    this.persist();
    return value;
  }

  get dataDir() {
    return DATA_DIR;
  }

  stats() {
    const bytes = !EPHEMERAL && fs.existsSync(STORE_FILE)
      ? fs.statSync(STORE_FILE).size
      : Buffer.byteLength(JSON.stringify(this.state), 'utf8');
    return {
      cacheFile: path.basename(STORE_FILE),
      cacheBytes: bytes,
      connections: this.state.connections.length,
      balances: this.state.balances.length,
      transactions: this.state.transactions.length,
      encrypted: true,
      cipher: 'AES-256-GCM'
    };
  }
}

export const store = new EncryptedStore();
