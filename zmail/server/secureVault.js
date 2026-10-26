/**
 * ZMail In-Memory Ephemeral Storage for ZMail Secure Sessions
 * (was: ZenBox In-Memory Ephemeral Storage for ZenBox Secure Sessions)
 * Principle: Decrypted content is strictly stored in memory only with expiration and zero disk retention.
 * AI boundary: AI access is blocked by default unless explicitly granted by token.
 */

import crypto from 'crypto';

class SecureSessionVault {
  constructor() {
    // Map of sessionId => { id, sender, recipient, key, messages: [], expiresAt, aiAccessAllowed: false, auditLog: [] }
    this.sessions = new Map();
  }

  createOrGetSession({ sessionId, sender, recipient, sharedKey, expiresAt = null }) {
    if (!sessionId) {
      sessionId = `zss_${crypto.randomUUID()}`;
    }

    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        sender,
        recipient,
        sharedKey,
        expiresAt: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h default
        aiAccessAllowed: false,
        decryptedItems: [],
        auditLog: [
          {
            timestamp: new Date().toISOString(),
            action: 'SESSION_INITIALIZED',
            details: `Secure session opened between ${sender} and ${recipient}`
          }
        ]
      });
    }

    return this.sessions.get(sessionId);
  }

  addDecryptedItem(sessionId, item) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found or expired');

    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionId);
      throw new Error('Secure Session has expired');
    }

    session.decryptedItems.push({
      id: `sec_${crypto.randomUUID()}`,
      receivedAt: new Date().toISOString(),
      ...item
    });

    session.auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'DECRYPTED_ITEM_VIEWED',
      details: 'Secure message viewed in-memory'
    });

    return session;
  }

  grantAIAccess(sessionId, authorizedByUser = false) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    if (!authorizedByUser) {
      throw new Error('Explicit user permission required to bridge AI with secure session');
    }

    session.aiAccessAllowed = true;
    session.auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'AI_ACCESS_GRANTED',
      details: 'Explicit permission granted to AI for this session'
    });
    return session;
  }

  revokeAIAccess(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    session.aiAccessAllowed = false;
    session.auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'AI_ACCESS_REVOKED',
      details: 'AI access revoked by user'
    });
  }

  canAIAccess(sessionId) {
    const session = this.sessions.get(sessionId);
    return session ? !!session.aiAccessAllowed : false;
  }

  purgeExpired() {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        this.sessions.delete(id);
      }
    }
  }

  destroySession(sessionId) {
    return this.sessions.delete(sessionId);
  }
}

export const secureVault = new SecureSessionVault();
