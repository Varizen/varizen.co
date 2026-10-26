/**
 * ZenChat — local encrypted store.
 * (ZTalk; legacy product name retained in code identifiers)
 *
 * Native data principle: ZTalk keeps *pointers and metadata*, never the
 * original message bodies owned by another provider. When a platform is truly
 * connected, messages are proxied; the demo sandbox keeps its seed data local.
 *
 * Persistence: AES-256-GCM at `.data/ztalk.json.enc`, key from
 * `ZENCHAT_MASTER_KEY` or a 0600 key file. Set `ZENCHAT_EPHEMERAL=1` for a
 * memory-only store (used by the test suite — no disk writes, no keys).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { id, nowIso } from './util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '.data');
const STORE_FILE = path.join(DATA_DIR, 'ztalk.json.enc');
const KEY_FILE = path.join(DATA_DIR, '.key');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
}

function loadKey() {
  if (process.env.ZENCHAT_MASTER_KEY) {
    return crypto.createHash('sha256').update(process.env.ZENCHAT_MASTER_KEY).digest();
  }
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

export function emptyState() {
  return {
    schemaVersion: 1,
    createdAt: nowIso(),
    settings: {
      timeZone: config.timeZone,
      theme: 'light',
      displayName: 'Tahseen',
      language: config.language,
      aiMode: config.aiDefaultMode,
      density: 'comfortable',
      showTranslationByDefault: false
    },
    identity: {
      id: 'person_owner',
      name: 'Tahseen Ahmed',
      email: 'business@varizen.co',
      personal: { name: 'Tahseen Ahmed', email: 'tahseen.ahmed@gmail.com' },
      organization: {
        id: 'org_varizen',
        name: 'Varizen Inc.',
        domain: 'varizen.co',
        plan: 'Business',
        seats: 24
      }
    },
    /** One entry per connected platform handle. Secrets are NEVER stored. */
    accounts: [],
    conversations: [],
    messages: [],
    tasks: [],
    detections: [],
    broadcasts: [],
    aiActivity: [],
    auditLog: [],
    aiProvider: {
      kind: config.ai.provider,
      model: config.ai.model,
      allowRemote: config.ai.allowRemote,
      note: 'Local deterministic engine. Translation and summaries are produced on this machine unless an operator explicitly configures a remote provider.'
    }
  };
}

class Store {
  constructor({ ephemeral = process.env.ZENCHAT_EPHEMERAL === '1' } = {}) {
    this.ephemeral = ephemeral;
    this.key = ephemeral ? null : loadKey();
    this.state = this.read();
    this.flushTimer = null;
    this.listeners = new Set();
  }

  get dataDir() {
    return DATA_DIR;
  }

  read() {
    const base = emptyState();
    if (this.ephemeral) return base;
    try {
      if (!fs.existsSync(STORE_FILE)) return base;
      const parsed = JSON.parse(decrypt(fs.readFileSync(STORE_FILE, 'utf8'), this.key));
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) },
        identity: { ...base.identity, ...(parsed.identity || {}) },
        aiProvider: { ...base.aiProvider, ...(parsed.aiProvider || {}) }
      };
    } catch {
      // A corrupt or foreign-key store must never take the app down.
      return base;
    }
  }

  persist() {
    if (this.ephemeral) return;
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, 40);
    this.flushTimer.unref?.();
  }

  flush() {
    if (this.ephemeral) return;
    ensureDir();
    const tmp = `${STORE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, encrypt(JSON.stringify(this.state), this.key), { mode: 0o600 });
    fs.renameSync(tmp, STORE_FILE);
  }

  /** Append-only audit log, capped. Every consequential action lands here. */
  log(type, message, meta = {}) {
    const entry = {
      id: id('aud', 6),
      type,
      message,
      at: nowIso(),
      actor: meta.actor || 'system',
      conversationId: meta.conversationId || null,
      detail: meta.detail || null
    };
    this.state.auditLog = [entry, ...(this.state.auditLog || [])].slice(0, 800);
    this.persist();
    return entry;
  }

  /** AI activity trail (prompt-mandated: every AI action is inspectable). */
  activity(kind, message, meta = {}) {
    const entry = {
      id: id('act', 6),
      kind,
      message,
      at: nowIso(),
      conversationId: meta.conversationId || null,
      conversationName: meta.conversationName || null,
      actor: meta.actor || 'ai',
      reversible: meta.reversible ?? true
    };
    this.state.aiActivity = [entry, ...(this.state.aiActivity || [])].slice(0, 500);
    this.persist();
    return entry;
  }

  /* --------------------------- event fan-out --------------------------- */
  /** SSE subscribers. The store is the only writer, so this is the single hub. */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(type, payload) {
    const event = { type, at: nowIso(), ...payload };
    for (const fn of this.listeners) {
      try {
        fn(event);
      } catch {
        /* a broken subscriber must not break the writer */
      }
    }
  }

  /* ---------------------------- conversations --------------------------- */

  conversation(cid) {
    return this.state.conversations.find((c) => c.id === cid || c.code === cid) || null;
  }

  messagesFor(cid) {
    // Accept a conversation id *or* a join code so callers never have to
    // pre-resolve — the id stays canonical for filtering.
    const conv = this.conversation(cid);
    const key = conv ? conv.id : cid;
    return this.state.messages
      .filter((m) => m.conversationId === key)
      .sort((a, b) => new Date(a.at) - new Date(b.at));
  }

  lastMessage(cid) {
    const list = this.messagesFor(cid);
    return list.length ? list[list.length - 1] : null;
  }

  touch(cid) {
    const conv = this.conversation(cid);
    if (!conv) return null;
    const last = this.messagesFor(conv.id).at(-1);
    conv.lastMessageAt = last ? last.at : conv.lastMessageAt;
    conv.lastPreview = last ? last.preview || last.body.slice(0, 120) : conv.lastPreview;
    this.persist();
    return conv;
  }
}

export const store = new Store();

export { Store, DATA_DIR };
