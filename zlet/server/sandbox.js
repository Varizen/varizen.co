/**
 * Zlet — Permission Sandbox (prompt §27, §40, §41, §62).
 *
 * The AI can only do what has been explicitly granted. Every grant is a
 * capability with an optional scope (a provider, a country, a wallet). Nothing is
 * granted by default except read-only observation.
 *
 * The AI never receives credentials. It emits an *intent*; the secure execution
 * layer performs the operation and hands back a result.
 */

import crypto from 'crypto';
import { store } from './store.js';

export const CAPABILITIES = {
  'read:balances': 'View balances and positions',
  'read:transactions': 'View transaction history',
  analyze: 'Calculate routes and opportunities',
  prepare: 'Prepare unsigned payments and instructions',
  execute: 'Submit authorized transactions',
  manage: 'Perform permitted recurring operations',
  defi: 'Interact with approved DeFi protocols',
  'high:risk': 'Perform high-risk actions (extra confirmation)'
};

export const PERMISSION_LEVELS = {
  observe: ['read:balances', 'read:transactions'],
  analyze: ['read:balances', 'read:transactions', 'analyze'],
  prepare: ['read:balances', 'read:transactions', 'analyze', 'prepare'],
  execute: ['read:balances', 'read:transactions', 'analyze', 'prepare', 'execute'],
  manage: ['read:balances', 'read:transactions', 'analyze', 'prepare', 'execute', 'manage'],
  defi: ['read:balances', 'read:transactions', 'analyze', 'prepare', 'execute', 'defi'],
  'high:risk': Object.keys(CAPABILITIES)
};

/** Capabilities that always need an explicit, separate grant. */
export const SENSITIVE_CAPABILITIES = new Set(['execute', 'manage', 'defi', 'high:risk']);

export const LEVEL_ORDER = ['observe', 'analyze', 'prepare', 'execute', 'manage', 'defi', 'high:risk'];

function nowIso() {
  return new Date().toISOString();
}

class Sandbox {
  constructor() {
    if (!Array.isArray(store.state.permissionGrants)) store.state.permissionGrants = [];
    if (store.state.permissionGrants.length === 0) this.grant('observe', { actor: 'system' });
  }

  grants() {
    return store.state.permissionGrants;
  }

  /** Highest fully-granted level, for display. */
  currentLevel() {
    let level = 'none';
    for (const candidate of LEVEL_ORDER) {
      if (this.hasLevel(candidate)) level = candidate;
    }
    return level;
  }

  hasCapability(capability, scope = null) {
    return store.state.permissionGrants.some(
      (g) => g.capability === capability && g.granted && (!scope || g.scope === 'all' || g.scope === scope)
    );
  }

  hasLevel(level) {
    const caps = PERMISSION_LEVELS[level];
    if (!caps) return false;
    return caps.every((c) => this.hasCapability(c));
  }

  require(capability) {
    if (!this.hasCapability(capability)) {
      throw Object.assign(
        new Error(
          `Zlet Guard: permission required — ${CAPABILITIES[capability] || capability}. ` +
            'Grant it explicitly in the Sandbox panel before this action.'
        ),
        { status: 403, needsPermission: true, capability }
      );
    }
    return true;
  }

  requireLevel(level) {
    if (!this.hasLevel(level)) {
      throw Object.assign(
        new Error(`Zlet Guard: the “${level}” permission level is required. Grant it explicitly first.`),
        { status: 403, needsPermission: true, level }
      );
    }
    return true;
  }

  grant(levelOrCapability, { scope = 'all', actor = 'user', expiresInMinutes = null } = {}) {
    const caps = PERMISSION_LEVELS[levelOrCapability] || (CAPABILITIES[levelOrCapability] ? [levelOrCapability] : null);
    if (!caps) throw Object.assign(new Error(`Unknown capability or level “${levelOrCapability}”`), { status: 400 });

    for (const capability of caps) {
      const existing = store.state.permissionGrants.find((g) => g.capability === capability && g.scope === scope);
      const grant = {
        id: existing?.id || `grant_${crypto.randomUUID()}`,
        capability,
        scope,
        granted: true,
        level: PERMISSION_LEVELS[levelOrCapability] ? levelOrCapability : existing?.level || 'custom',
        sensitive: SENSITIVE_CAPABILITIES.has(capability),
        grantedAt: existing?.grantedAt || nowIso(),
        grantedBy: actor,
        expiresAt: expiresInMinutes ? new Date(Date.now() + expiresInMinutes * 60_000).toISOString() : null
      };
      if (existing) Object.assign(existing, grant);
      else store.state.permissionGrants.push(grant);
    }
    store.persist();
    logActivity(
      'PERMISSION_GRANTED',
      `Granted ${caps.length} capability(ies): ${caps.join(', ')}`,
      { actor, severity: caps.some((c) => SENSITIVE_CAPABILITIES.has(c)) ? 'high' : 'info' }
    );
    return store.state.permissionGrants;
  }

  revoke(capability, { actor = 'user' } = {}) {
    store.state.permissionGrants = store.state.permissionGrants.filter((g) => g.capability !== capability);
    store.persist();
    logActivity('PERMISSION_REVOKED', `Revoked ${capability}`, { actor });
    return store.state.permissionGrants;
  }

  revokeAll({ actor = 'user' } = {}) {
    store.state.permissionGrants = [];
    store.persist();
    logActivity('PERMISSION_REVOKED_ALL', 'All AI permissions revoked', { actor });
    return store.state.permissionGrants;
  }

  /** Emergency stop (prompt §62). */
  lockZlet({ actor = 'user' } = {}) {
    store.state.guard.frozen = true;
    store.state.settings.agentMode = false;
    store.state.proposals = [];
    this.revokeAll({ actor });
    logActivity('ZLET_LOCKED', 'Zlet locked: AI execution, payments and DeFi disabled', { actor, severity: 'high' });
    store.persist();
    return { frozen: true, grants: [] };
  }

  unlockZlet({ actor = 'user' } = {}) {
    store.state.guard.frozen = false;
    this.grant('observe', { actor });
    logActivity('ZLET_UNLOCKED', 'Zlet unlocked: observe-only permissions restored', { actor, severity: 'high' });
    store.persist();
    return { frozen: false };
  }

  snapshot() {
    return {
      level: this.currentLevel(),
      grants: this.grants(),
      capabilities: Object.entries(CAPABILITIES).map(([capability, label]) => ({
        capability,
        label,
        sensitive: SENSITIVE_CAPABILITIES.has(capability),
        granted: this.hasCapability(capability)
      })),
      levels: Object.entries(PERMISSION_LEVELS).map(([level, caps]) => ({
        level,
        capabilities: caps,
        granted: this.hasLevel(level),
        sensitive: caps.some((c) => SENSITIVE_CAPABILITIES.has(c))
      })),
      frozen: Boolean(store.state.guard.frozen),
      agentMode: Boolean(store.state.settings.agentMode)
    };
  }
}

/* ------------------------------ audit log ------------------------------ */

export function logActivity(type, message, meta = {}) {
  const entry = {
    id: `log_${crypto.randomUUID()}`,
    at: nowIso(),
    type,
    message,
    actor: meta.actor || 'system',
    severity: meta.severity || 'info',
    refs: meta.refs || {},
    detail: meta.detail || null
  };
  store.state.activityLog.unshift(entry);
  if (store.state.activityLog.length > 800) store.state.activityLog.length = 800;
  store.persist();
  return entry;
}

export function activityLog(limit = 60) {
  return store.state.activityLog.slice(0, limit);
}

export const sandbox = new Sandbox();
export default sandbox;
