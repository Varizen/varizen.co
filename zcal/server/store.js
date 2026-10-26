/**
 * ZCal — local encrypted cache store. (was: ZenCalendar)
 *
 * Design principle (prompt §11 Native data principle): calendar data stays with
 * its provider. This store only keeps the *minimum* needed for synchronisation,
 * search, AI operation and sandbox proposals:
 *
 *   - provider references (account + calendar + remote event id)
 *   - a normalized snapshot of fields required to render/search
 *   - sync cursors and indexes
 *   - sandbox proposals and permission grants
 *   - an append-only audit log
 *
 * Everything is persisted to `.data/zcal.json.enc`, AES-256-GCM encrypted
 * with a key derived from a local secret. No provider passwords are ever stored.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ZENCAL_DATA_DIR
  ? path.resolve(process.env.ZENCAL_DATA_DIR)
  : path.join(__dirname, '..', '.data');
const STORE_FILE = path.join(DATA_DIR, 'zcal.json.enc');
const KEY_FILE = path.join(DATA_DIR, '.key');

/**
 * Test / ephemeral mode: never touch disk, so the suite can mutate freely.
 * Node's test runner sets NODE_TEST_CONTEXT in each child process.
 */
const EPHEMERAL = Boolean(process.env.NODE_TEST_CONTEXT) || process.env.ZENCAL_EPHEMERAL === '1';

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

function loadKey() {
  if (process.env.ZENCAL_MASTER_KEY) {
    return crypto.createHash('sha256').update(process.env.ZENCAL_MASTER_KEY).digest();
  }
  if (EPHEMERAL) return crypto.randomBytes(32);
  ensureDir();
  if (fs.existsSync(KEY_FILE)) {
    return Buffer.from(fs.readFileSync(KEY_FILE, 'utf8').trim(), 'base64');
  }
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

const emptyState = () => ({
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  settings: {
    timeZone: 'Asia/Karachi',
    homeTimeZone: 'Asia/Karachi',
    workingHours: { start: '09:00', end: '18:00', days: [1, 2, 3, 4, 5] },
    focusPreference: { enabled: true, minBlockMinutes: 90 },
    travelBufferMinutes: 15,
    theme: 'light',
    weekStartsOn: 1,
    agentMode: false,
    defaultDurationMinutes: 30
  },
  identities: [],
  accounts: [],
  calendars: [],
  events: [],
  syncState: {},
  proposals: [],
  permissionGrants: [],
  agentState: { consecutiveApprovals: {} },
  activityLog: [],
  aiProvider: { kind: 'deterministic', model: 'rule-based', allowRemote: false },
  browserSandbox: { enabled: false, isolatedSessions: [], allowLocalFiles: false, allowPasswords: false }
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
      const plain = decrypt(fs.readFileSync(STORE_FILE, 'utf8'), this.key);
      const parsed = JSON.parse(plain);
      return { ...emptyState(), ...parsed, settings: { ...emptyState().settings, ...(parsed.settings || {}) } };
    } catch {
      return emptyState();
    }
  }

  /** Debounced atomic persistence. */
  persist() {
    if (EPHEMERAL) return;
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      ensureDir();
      const tmp = `${STORE_FILE}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, encrypt(JSON.stringify(this.state), this.key), { mode: 0o600 });
      fs.renameSync(tmp, STORE_FILE);
    }, 40);
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

  /** Cache metadata for the privacy center. */
  stats() {
    const events = this.state.events;
    const bytes = !EPHEMERAL && fs.existsSync(STORE_FILE)
      ? fs.statSync(STORE_FILE).size
      : Buffer.byteLength(JSON.stringify(this.state), 'utf8');
    return {
      cacheFile: path.basename(STORE_FILE),
      cacheBytes: bytes,
      cachedEvents: events.length,
      cachedCalendars: this.state.calendars.length,
      encrypted: true,
      cipher: 'AES-256-GCM',
      oldestEvent: events.reduce((min, e) => (e.start < min ? e.start : min), events[0]?.start || null),
      newestEvent: events.reduce((max, e) => (e.end > max ? e.end : max), events[0]?.end || null)
    };
  }
}

export const store = new EncryptedStore();
export { emptyState };
