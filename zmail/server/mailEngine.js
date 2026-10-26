/**
 * ZMail Mail Engine & Account Orchestration
 * (was: ZenBox Mail Engine & Account Orchestration)
 * Supports Multi-account: Gmail, Outlook, Yahoo, iCloud, IMAP/SMTP, Custom domains
 * Operates unified client views while keeping native data at origin providers.
 */

import crypto from 'crypto';
import { generateKeyPair, deriveSharedKey, encryptAESGCM, decryptAESGCM, createSecureSessionEnvelope, isZMailSecureEmail } from './crypto.js';
import { secureVault } from './secureVault.js';

export class MailEngine {
  constructor() {
    this.accounts = new Map();
    this.messages = [];
    this.drafts = [];
    this.signatures = [];
    this.identities = [];

    // Initialize with default demo accounts & rich email threads
    this._initializeDemoData();
  }

  _initializeDemoData() {
    // 1. User identities / accounts
    this.accounts.set('acc_1', {
      id: 'acc_1',
      name: 'Work (Google Workspace)',
      email: 'alex@varizen.co',
      provider: 'gmail',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      status: 'connected',
      keyPair: generateKeyPair(),
      isDefault: true
    });

    this.accounts.set('acc_2', {
      id: 'acc_2',
      name: 'Personal (Microsoft Outlook)',
      email: 'alex.dev@outlook.com',
      provider: 'outlook',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'connected',
      keyPair: generateKeyPair(),
      isDefault: false
    });

    this.accounts.set('acc_3', {
      id: 'acc_3',
      name: 'Consulting (Custom IMAP/SMTP)',
      email: 'alex@cloudzen.io',
      provider: 'imap',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      status: 'connected',
      keyPair: generateKeyPair(),
      isDefault: false
    });

    // 2. Initial sample messages across connected mailboxes
    const initialEmails = [
      {
        id: 'msg_101',
        accountId: 'acc_1',
        from: { name: 'Elena Rostova', email: 'elena@vanguard-ai.com' },
        to: [{ name: 'Alex', email: 'alex@varizen.co' }],
        cc: [{ name: 'David Kim', email: 'david@vanguard-ai.com' }],
        subject: 'SAMC Project Architecture & Milestone Review',
        body: 'Hi Alex,\n\nFollowing our review on the SAMC architecture, we have reached 90% completion on the edge ingestion layer. We require your sign-off on the final data pipeline before Friday 5 PM EST.\n\nPlease check the attached architecture spec and let David and me know if the deployment cadence works for your team.\n\nBest,\nElena',
        snippet: 'Following our review on the SAMC architecture, we have reached 90% completion...',
        date: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        folder: 'inbox',
        read: false,
        flagged: true,
        priority: 'high',
        hasAttachment: true,
        attachments: [
          { name: 'SAMC_Architecture_v2.pdf', size: '2.4 MB', type: 'application/pdf' }
        ],
        threadId: 'th_101',
        category: 'work'
      },
      {
        id: 'msg_102',
        accountId: 'acc_1',
        from: { name: 'Billing Dept - CloudOps', email: 'billing@cloudops-infra.net' },
        to: [{ name: 'Alex', email: 'alex@varizen.co' }],
        subject: 'Invoice #INV-2026-889 for October Compute Infrastructure',
        body: 'Hello Alex,\n\nYour monthly invoice for October 2026 compute clusters is now available. The total amount due is $1,420.50 with due date November 10, 2026.\n\nPlease find the attached breakdown invoice.',
        snippet: 'Your monthly invoice for October 2026 compute clusters is now available. Total due is $1,420.50...',
        date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        folder: 'inbox',
        read: true,
        flagged: false,
        priority: 'normal',
        hasAttachment: true,
        attachments: [
          { name: 'Invoice_INV_2026_889.pdf', size: '340 KB', type: 'application/pdf' }
        ],
        threadId: 'th_102',
        category: 'finance'
      },
      {
        id: 'msg_103',
        accountId: 'acc_2',
        from: { name: 'Sarah Jenkins', email: 'sarah.j@acme-ventures.org' },
        to: [{ name: 'Alex', email: 'alex.dev@outlook.com' }],
        subject: 'Catch up over coffee next Tuesday?',
        body: 'Hey Alex,\n\nHope your week is going great! Are you free next Tuesday around 2:00 PM for a quick catch up regarding the open research initiative?\n\nLet me know if that time works or suggest another slot.\n\nCheers,\nSarah',
        snippet: 'Are you free next Tuesday around 2:00 PM for a quick catch up regarding the open research initiative?...',
        date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        folder: 'inbox',
        read: false,
        flagged: false,
        priority: 'normal',
        hasAttachment: false,
        threadId: 'th_103',
        category: 'personal'
      },
      {
        id: 'msg_104',
        accountId: 'acc_3',
        from: { name: 'Security Alert - Gateway', email: 'noreply-security@suspicious-login-auth.xyz' },
        to: [{ name: 'Alex', email: 'alex@cloudzen.io' }],
        subject: 'URGENT: Password expired! Click immediately to verify identity',
        body: 'Dear customer,\n\nYour account has been suspended due to strange activities. Click here immediately http://bit.ly/fake-phish-login to avoid permanent deletion within 2 hours.',
        snippet: 'Your account has been suspended due to strange activities. Click here immediately...',
        date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        folder: 'inbox',
        read: false,
        flagged: false,
        priority: 'low',
        hasAttachment: false,
        threadId: 'th_104',
        category: 'suspicious',
        isSuspicious: true
      },
      {
        id: 'msg_105',
        accountId: 'acc_1',
        from: { name: 'Marcella Quinn', email: 'mquinn@apexpartners.com' },
        to: [{ name: 'Alex', email: 'alex@varizen.co' }],
        subject: 'ZMail Secure Session Invitation',
        body: `--- ZMAIL_SECURE_SESSION_V1 ---
{
  "protocol": "ZMAIL_SECURE_SESSION_V1",
  "sessionId": "zss_88a912-apex",
  "senderEmail": "mquinn@apexpartners.com",
  "recipientEmail": "alex@varizen.co",
  "hint": "Confidential partnership draft for Q1 2027",
  "note": "This is an end-to-end encrypted ZMail Secure Session. Ordinary mail servers cannot inspect this payload."
}`,
        snippet: '🔒 ZMail Secure Session Invitation — End-to-end encrypted session from Marcella Quinn...',
        date: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        folder: 'inbox',
        read: false,
        flagged: true,
        priority: 'high',
        hasAttachment: false,
        isSecureSession: true,
        secureSessionId: 'zss_88a912-apex',
        threadId: 'th_105',
        category: 'secure'
      }
    ];

    this.messages = initialEmails;

    // Create a mock active session in the secureVault for demo purposes
    const mockSession = secureVault.createOrGetSession({
      sessionId: 'zss_88a912-apex',
      sender: 'mquinn@apexpartners.com',
      recipient: 'alex@varizen.co'
    });
    mockSession.decryptedItems.push({
      id: 'sec_msg_1',
      sender: 'mquinn@apexpartners.com',
      subject: 'Strictly Confidential: Strategic Acquisition & AI Governance Term Sheet',
      body: 'Alex,\n\nHere are the confidential terms for the Q1 2027 cross-border partnership. The initial valuation agreement is locked at $24.5M. The zero-knowledge attestation details are enclosed.\n\nPlease reply through this encrypted session only.\n\nMarcella',
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      attachments: [{ name: 'Confidential_Term_Sheet_v1.pdf', size: '1.8 MB (AES Encrypted)' }]
    });

    // Default Signatures
    this.signatures = [
      { id: 'sig_1', name: 'Professional', text: 'Best regards,\nAlex Vance\nDirector of Intelligence, ZMail\nhttps://varizen.co' },
      { id: 'sig_2', name: 'Minimal', text: 'Sent from ZMail AI Mail.' }
    ];
  }

  // --- Account operations ---
  getAccounts() {
    return Array.from(this.accounts.values()).map(acc => ({
      id: acc.id,
      name: acc.name,
      email: acc.email,
      provider: acc.provider,
      avatar: acc.avatar,
      status: acc.status,
      isDefault: acc.isDefault
    }));
  }

  connectAccount({ name, email, provider, host, port, username, password }) {
    const id = `acc_${crypto.randomUUID().slice(0, 8)}`;
    const newAcc = {
      id,
      name: name || email,
      email,
      provider: provider || 'imap',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      status: 'connected',
      keyPair: generateKeyPair(),
      isDefault: false
    };
    this.accounts.set(id, newAcc);
    return newAcc;
  }

  disconnectAccount(accountId) {
    return this.accounts.delete(accountId);
  }

  // --- Message operations ---
  getMessages({ accountId = null, folder = 'inbox', search = '', category = null } = {}) {
    let list = this.messages;

    if (accountId && accountId !== 'all') {
      list = list.filter(m => m.accountId === accountId);
    }

    if (folder) {
      list = list.filter(m => m.folder === folder);
    }

    if (category) {
      list = list.filter(m => m.category === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => 
        m.subject.toLowerCase().includes(q) ||
        m.snippet.toLowerCase().includes(q) ||
        m.from.email.toLowerCase().includes(q) ||
        m.from.name.toLowerCase().includes(q) ||
        (m.body && m.body.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getMessageById(id) {
    return this.messages.find(m => m.id === id);
  }

  sendMessage({
    accountId,
    fromEmail,
    to,
    cc = [],
    bcc = [],
    subject,
    body,
    attachments = [],
    isSecure = false,
    replyToId = null
  }) {
    const acc = this.accounts.get(accountId) || Array.from(this.accounts.values())[0];
    const fromAddr = fromEmail || (acc ? acc.email : 'user@zmail.local');

    if (isSecure) {
      // Create ZMail Secure Session
      const sessionId = `zss_${crypto.randomUUID().slice(0, 8)}`;
      const keyPair = acc ? acc.keyPair : generateKeyPair();

      // Mock peer key or ephemeral symmetric encryption
      const peerKeyPair = generateKeyPair();
      const sharedKey = deriveSharedKey(keyPair.privateKey, peerKeyPair.publicKey);
      const encryptedBody = encryptAESGCM(body, sharedKey);

      const envelope = createSecureSessionEnvelope({
        senderEmail: fromAddr,
        recipientEmail: Array.isArray(to) ? to.join(', ') : to,
        senderPublicKey: keyPair.publicKey,
        encryptedBody,
        sessionId,
        passphraseHint: 'Encrypted with P-256 ECDH + AES-256-GCM'
      });

      // Save to secure vault
      const s = secureVault.createOrGetSession({
        sessionId,
        sender: fromAddr,
        recipient: Array.isArray(to) ? to.join(', ') : to,
        sharedKey
      });
      s.decryptedItems.push({
        id: `sec_msg_${Date.now()}`,
        sender: fromAddr,
        subject,
        body,
        timestamp: new Date().toISOString(),
        attachments
      });

      // Envelope sent through standard mail
      const secureNotice = `--- ZMAIL_SECURE_SESSION_V1 ---\n` +
        `This message contains a ZMail Secure Session. To read this confidential email, open it directly in ZMail Secure Client.\n` +
        JSON.stringify(envelope, null, 2);

      const msg = {
        id: `msg_${Date.now()}`,
        accountId: acc.id,
        from: { name: acc.name, email: fromAddr },
        to: Array.isArray(to) ? to.map(e => ({ email: e, name: e })) : [{ email: to, name: to }],
        subject: `[Secure] ${subject}`,
        body: secureNotice,
        snippet: `🔒 ZMail Secure Session from ${fromAddr}...`,
        date: new Date().toISOString(),
        folder: 'sent',
        read: true,
        flagged: false,
        priority: 'high',
        hasAttachment: attachments.length > 0,
        attachments,
        isSecureSession: true,
        secureSessionId: sessionId,
        threadId: replyToId ? `th_${replyToId}` : `th_${Date.now()}`,
        category: 'secure'
      };

      this.messages.unshift(msg);
      return { success: true, message: msg, secureSessionId: sessionId };
    }

    // Standard email
    const msg = {
      id: `msg_${Date.now()}`,
      accountId: acc.id,
      from: { name: acc.name, email: fromAddr },
      to: Array.isArray(to) ? to.map(e => ({ email: e, name: e })) : [{ email: to, name: to }],
      cc: Array.isArray(cc) ? cc.map(e => ({ email: e, name: e })) : [],
      bcc: Array.isArray(bcc) ? bcc.map(e => ({ email: e, name: e })) : [],
      subject,
      body,
      snippet: body.slice(0, 100),
      date: new Date().toISOString(),
      folder: 'sent',
      read: true,
      flagged: false,
      priority: 'normal',
      hasAttachment: attachments.length > 0,
      attachments,
      threadId: replyToId ? `th_${replyToId}` : `th_${Date.now()}`,
      category: 'work'
    };

    this.messages.unshift(msg);
    return { success: true, message: msg };
  }

  updateMessage(id, updates) {
    const msg = this.getMessageById(id);
    if (!msg) return null;
    Object.assign(msg, updates);
    return msg;
  }

  deleteMessage(id) {
    const msg = this.getMessageById(id);
    if (!msg) return false;
    if (msg.folder === 'trash') {
      this.messages = this.messages.filter(m => m.id !== id);
    } else {
      msg.folder = 'trash';
    }
    return true;
  }

  archiveMessage(id) {
    const msg = this.getMessageById(id);
    if (!msg) return false;
    msg.folder = 'archive';
    return true;
  }

  markAsSpam(id) {
    const msg = this.getMessageById(id);
    if (!msg) return false;
    msg.folder = 'spam';
    return true;
  }

  getFolderCounts() {
    const counts = {
      inbox: 0,
      unread: 0,
      starred: 0,
      sent: 0,
      archive: 0,
      trash: 0,
      spam: 0,
      secure: 0
    };

    for (const m of this.messages) {
      if (m.folder === 'inbox') {
        counts.inbox++;
        if (!m.read) counts.unread++;
      }
      if (m.flagged) counts.starred++;
      if (m.folder === 'sent') counts.sent++;
      if (m.folder === 'archive') counts.archive++;
      if (m.folder === 'trash') counts.trash++;
      if (m.folder === 'spam') counts.spam++;
      if (m.isSecureSession) counts.secure++;
    }

    return counts;
  }
}

export const mailEngine = new MailEngine();
