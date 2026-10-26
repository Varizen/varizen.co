/**
 * ZMeet — local encrypted store. (was: ZenMeet)
 * (ZMeet; legacy product name retained in code identifiers)
 *
 * Native data principle (prompt §21): ZMeet keeps only the minimum metadata
 * needed to operate rooms, permissions, AI activity and search. Recordings,
 * transcripts and files live wherever the organizer chose to put them; this
 * store keeps pointers, never media.
 *
 * Everything is persisted to `.data/zmeet.json.enc`, AES-256-GCM encrypted
 * with a key derived from a local secret file (mode 0600) or ZENMEET_MASTER_KEY.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '.data');
const STORE_FILE = path.join(DATA_DIR, 'zmeet.json.enc');
const KEY_FILE = path.join(DATA_DIR, '.key');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

function loadKey() {
  ensureDir();
  if (process.env.ZENMEET_MASTER_KEY) {
    return crypto.createHash('sha256').update(process.env.ZENMEET_MASTER_KEY).digest();
  }
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
    theme: 'light',
    displayName: 'Tahseen',
    showPhotoId: false
  },
  identity: {
    id: 'person_host',
    name: 'Tahseen Ahmed',
    email: 'business@varizen.co',
    personal: { name: 'Tahseen Ahmed', email: 'tahseen.ahmed@gmail.com' },
    organization: {
      id: 'org_varizen',
      name: 'Varizen Inc.',
      plan: 'Business',
      domain: 'varizen.co',
      seats: 24,
      storagePolicy: 'organization'
    },
    teams: [
      { id: 'team_core', name: 'Core Platform', department: 'Engineering' },
      { id: 'team_growth', name: 'Growth', department: 'Go-to-market' }
    ]
  },
  rooms: [],
  aiActivity: [],
  permissionGrants: [],
  recordings: [],
  reports: [],
  sharedFiles: [],
  streams: { destinations: [], scenes: [] },
  meetingMemory: [],
  auditLog: [],
  aiProvider: {
    kind: 'deterministic',
    model: 'rule-based',
    allowRemote: false,
    note: 'Local deterministic engine. Switch providers in Settings when an organization policy allows it.'
  }
});

class EncryptedStore {
  constructor() {
    this.key = loadKey();
    this.state = this.read();
    this.flushTimer = null;
  }

  get dataDir() {
    return DATA_DIR;
  }

  read() {
    try {
      if (!fs.existsSync(STORE_FILE)) return emptyState();
      const plain = decrypt(fs.readFileSync(STORE_FILE, 'utf8'), this.key);
      const parsed = JSON.parse(plain);
      const base = emptyState();
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) },
        identity: { ...base.identity, ...(parsed.identity || {}) }
      };
    } catch {
      return emptyState();
    }
  }

  /** Debounced atomic persistence. */
  persist() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, 40);
    this.flushTimer.unref?.();
  }

  flush() {
    ensureDir();
    const tmp = `${STORE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, encrypt(JSON.stringify(this.state), this.key), { mode: 0o600 });
    fs.renameSync(tmp, STORE_FILE);
  }

  /** Append-only audit log, capped so it can't grow without bound. */
  log(type, message, meta = {}) {
    const entry = {
      id: `aud_${crypto.randomUUID()}`,
      type,
      message,
      at: new Date().toISOString(),
      actor: meta.actor || 'system',
      roomId: meta.roomId || null,
      detail: meta.detail || null
    };
    this.state.auditLog = [entry, ...(this.state.auditLog || [])].slice(0, 600);
    this.persist();
    return entry;
  }
}

export const store = new EncryptedStore();
export { emptyState };
