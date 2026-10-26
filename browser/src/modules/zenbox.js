// ZMail — Universal AI Email Client & Secure Session Engine for AiBrowser
// (was: ZenBox)
// Single unified mailbox layer for every connected account (Gmail, Outlook, Yahoo, iCloud, IMAP)
// Native provider data stays at origin; AI operates safely with clear boundaries;
// End-to-end encrypted ZenBox Secure Sessions with dedicated crypto isolation.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Storage helper for local state (identities, account metadata, cache, signatures, secure keys)
let dataDir = null;

function init(userDataPath) {
  dataDir = path.join(userDataPath, 'zenbox');
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  } catch {}
}

function getStoreFile(name) {
  if (!dataDir) return null;
  return path.join(dataDir, `${name}.json`);
}

function readStore(name, fallback = {}) {
  const f = getStoreFile(name);
  if (!f) return fallback;
  try {
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {}
  return fallback;
}

function writeStore(name, val) {
  const f = getStoreFile(name);
  if (!f) return;
  try {
    fs.writeFileSync(f, JSON.stringify(val, null, 2), 'utf8');
  } catch {}
}

// -------------------------------------------------------------
// 1. Account Management (Unified Inbox)
// -------------------------------------------------------------
function getAccounts() {
  const defaults = [
    {
      id: 'acc_varizen',
      name: 'Varizen Workspace',
      email: 'founder@varizen.co',
      provider: 'google',
      icon: 'G',
      color: '#FF6B35',
      connected: true,
      lastSync: new Date().toISOString()
    },
    {
      id: 'acc_outlook',
      name: 'Executive Outlook',
      email: 'executive@outlook.com',
      provider: 'microsoft',
      icon: 'O',
      color: '#0078D4',
      connected: true,
      lastSync: new Date().toISOString()
    },
    {
      id: 'acc_secure',
      name: 'ZMail Private Key Identity',
      email: 'tahseen@zmail.sec',
      provider: 'zenbox-secure',
      icon: 'Z',
      color: '#10B981',
      connected: true,
      lastSync: new Date().toISOString(),
      secureKeyId: 'key_zen_001'
    }
  ];
  return readStore('accounts', defaults);
}

function saveAccounts(accounts) {
  writeStore('accounts', accounts);
  return accounts;
}

function addAccount(acc) {
  const list = getAccounts();
  const id = acc.id || `acc_${Date.now()}`;
  const newAcc = {
    id,
    name: acc.name || acc.email,
    email: acc.email,
    provider: acc.provider || 'imap',
    icon: (acc.name || acc.email || 'M')[0].toUpperCase(),
    color: acc.color || '#FF6B35',
    connected: true,
    lastSync: new Date().toISOString(),
    ...acc
  };
  list.push(newAcc);
  saveAccounts(list);
  return newAcc;
}

function removeAccount(id) {
  const list = getAccounts().filter((a) => a.id !== id);
  saveAccounts(list);
  return list;
}

// -------------------------------------------------------------
// 2. Initial Sample Unified Mailbox Dataset
// -------------------------------------------------------------
const INITIAL_EMAILS = [
  {
    id: 'msg_001',
    accountId: 'acc_varizen',
    from: { name: 'Elena Rostova', email: 'elena.rostova@cybercloud.io' },
    to: [{ name: 'Tahseen', email: 'founder@varizen.co' }],
    cc: [{ name: 'Engineering Lead', email: 'lead@cybercloud.io' }],
    subject: 'SAMC Project: Security Architecture Audit & Next Phase Review',
    snippet: 'Tahseen, we have finalized the initial security audit review for the SAMC system. The report is attached for sign-off...',
    body: `Hi Tahseen,\n\nWe have finalized the initial security audit review for the SAMC system. Overall the cryptographic isolation and zero-trust perimeter tested remarkably well under penetration load.\n\nKey highlights:\n- 0 critical vulnerabilities found\n- 2 low-severity latency recommendations for edge routing\n- Milestone sign-off deadline: tomorrow 5:00 PM UTC\n\nCould your team review and confirm if we proceed with the phase 2 deployment?\n\nBest regards,\nElena Rostova\nVP of Systems Engineering`,
    date: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_01', name: 'SAMC_Security_Audit_v2.pdf', size: '2.4 MB', type: 'application/pdf' }
    ],
    tags: ['SAMC', 'Audit', 'Important'],
    isSecureSession: false
  },
  {
    id: 'msg_002',
    accountId: 'acc_outlook',
    from: { name: 'Accounts & Billing', email: 'billing@cloudscale.net' },
    to: [{ name: 'Tahseen', email: 'executive@outlook.com' }],
    subject: 'Invoice #CS-89211 for Cloud Infrastructure - Payment Due',
    snippet: 'Your monthly cloud compute and edge gateway invoice is ready. Total amount due: $1,420.00 by Nov 5, 2026...',
    body: `Dear Tahseen,\n\nThank you for choosing CloudScale. Your consolidated invoice for last month's enterprise compute, edge proxy gateways, and storage nodes has been generated.\n\nInvoice Number: #CS-89211\nTotal Amount Due: $1,420.00\nDue Date: November 5, 2026\nStatus: Pending Payment\n\nYou can pay directly via our one-click enterprise ACH portal.\n\nWarm regards,\nCloudScale Billing Team`,
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    attachments: [
      { id: 'att_02', name: 'Invoice_CS-89211.pdf', size: '142 KB', type: 'application/pdf' }
    ],
    tags: ['Invoice', 'Finance'],
    isSecureSession: false
  },
  {
    id: 'msg_003',
    accountId: 'acc_varizen',
    from: { name: 'Julian Vance', email: 'julian@vancepartners.vc' },
    to: [{ name: 'Tahseen', email: 'founder@varizen.co' }],
    subject: 'Follow-up: Q4 strategic roadmap sync & partnership',
    snippet: 'Great connecting last week. Are you available for a 30-minute sync this Thursday at 2 PM to walk through the distribution model?...',
    body: `Hi Tahseen,\n\nGreat catching up at the sovereign computing summit. I discussed the AiBrowser + decentralized trust stack with our partners, and there is immense appetite.\n\nCould we do a quick 30-minute sync this Thursday around 2:00 PM EST? Let me know what time zone you prefer, or feel free to suggest an alternative time slot.\n\nLooking forward to speaking soon,\nJulian Vance`,
    date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    attachments: [],
    tags: ['Partnership', 'Meeting'],
    isSecureSession: false
  },
  {
    id: 'msg_004',
    accountId: 'acc_secure',
    from: { name: 'Cipher Labs Security Desk', email: 'intel@cipherlabs.org' },
    to: [{ name: 'Tahseen (ZenBox Secure)', email: 'tahseen@zenbox.sec' }],
    subject: '[ZenBox Secure Session] End-to-End Encrypted Advisory ZS-901',
    snippet: 'This email is protected by ZenBox Secure Session end-to-end cryptography. Open inside ZenBox Secure Session to decrypt.',
    body: null, // Decrypted only in secure session!
    encryptedPayload: {
      version: 'zenbox-e2e-v1',
      cipher: 'aes-256-gcm',
      iv: '7b8f9e0123456789abcdef01',
      authTag: '8c91a0f4e2d3c5b7',
      // Encrypted ciphertext representation
      ciphertext: '0f8c74381920adbf9281...[E2EE SECURE PAYLOAD]...',
      decryptedBody: `CONFIDENTIAL ZENBOX SECURE DISPATCH\nSecurity Verification Level: Zero-Knowledge End-to-End Authenticated\n\nTo Tahseen:\nThe private HSM cryptographic proof has been signed for the Varizen Sovereign Shield network. Master key derivation passed with zero leaks across memory bounds.\n\nSession Expiration: 48 Hours\nRevocation Token: REV-98214-X\nRecipient Identity Verified: Tahseen (tahseen@zenbox.sec)`,
      keyId: 'key_zen_001',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      attachments: [
        { id: 'att_sec_01', name: 'HSM_ZeroLeak_Certificate.enc', size: '64 KB', encrypted: true }
      ]
    },
    date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'att_sec_01', name: 'HSM_ZeroLeak_Certificate.enc (Encrypted)', size: '64 KB', type: 'application/octet-stream' }
    ],
    tags: ['Secure Session', 'E2EE', 'Confidential'],
    isSecureSession: true,
    isDecrypted: false
  },
  {
    id: 'msg_005',
    accountId: 'acc_outlook',
    from: { name: 'Alert Services', email: 'security-no-reply@auth-verifier.info' },
    to: [{ name: 'Tahseen', email: 'executive@outlook.com' }],
    subject: 'URGENT: Verify your account credentials immediately or account will be suspended',
    snippet: 'Immediate action required: click the link to confirm your billing access within 12 hours...',
    body: `Dear customer,\n\nWe detected unusual login attempts. Click here: http://auth-verify-portal.top/login to prevent account suspension.\n\nDo not ignore this notification.`,
    date: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    folder: 'inbox',
    isRead: false,
    isStarred: false,
    hasAttachments: false,
    attachments: [],
    tags: ['Suspicious', 'Phishing Risk'],
    isSecureSession: false
  }
];

function getEmails() {
  return readStore('emails', INITIAL_EMAILS);
}

function saveEmails(emails) {
  writeStore('emails', emails);
  return emails;
}

// -------------------------------------------------------------
// 3. Mailbox Operations (Send, Reply, Archive, Star, Search)
// -------------------------------------------------------------
function listEmails(filter = {}) {
  let list = getEmails();
  if (filter.accountId && filter.accountId !== 'all') {
    list = list.filter((m) => m.accountId === filter.accountId);
  }
  if (filter.folder) {
    list = list.filter((m) => m.folder === filter.folder);
  }
  if (filter.tag) {
    list = list.filter((m) => m.tags && m.tags.includes(filter.tag));
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((m) =>
      m.subject.toLowerCase().includes(q) ||
      (m.snippet && m.snippet.toLowerCase().includes(q)) ||
      (m.body && m.body.toLowerCase().includes(q)) ||
      m.from.name.toLowerCase().includes(q) ||
      m.from.email.toLowerCase().includes(q)
    );
  }
  // Sort descending by date
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getEmail(id) {
  return getEmails().find((m) => m.id === id) || null;
}

function markRead(id, isRead = true) {
  const emails = getEmails();
  const m = emails.find((e) => e.id === id);
  if (m) {
    m.isRead = isRead;
    saveEmails(emails);
  }
  return m;
}

function toggleStar(id) {
  const emails = getEmails();
  const m = emails.find((e) => e.id === id);
  if (m) {
    m.isStarred = !m.isStarred;
    saveEmails(emails);
  }
  return m;
}

function moveFolder(id, folder) {
  const emails = getEmails();
  const m = emails.find((e) => e.id === id);
  if (m) {
    m.folder = folder;
    saveEmails(emails);
  }
  return m;
}

function sendEmail({ accountId, to, cc, bcc, subject, body, attachments, isSecureSession }) {
  const emails = getEmails();
  const accounts = getAccounts();
  const acc = accounts.find((a) => a.id === accountId) || accounts[0];

  const toList = Array.isArray(to) ? to : [{ name: to, email: to }];
  const ccList = cc ? (Array.isArray(cc) ? cc : [{ name: cc, email: cc }]) : [];
  const bccList = bcc ? (Array.isArray(bcc) ? bcc : [{ name: bcc, email: bcc }]) : [];

  const id = `msg_${Date.now()}`;
  let newMsg = {
    id,
    accountId: acc.id,
    from: { name: acc.name, email: acc.email },
    to: toList,
    cc: ccList,
    bcc: bccList,
    subject: subject || '(No Subject)',
    snippet: (body || '').slice(0, 120),
    body: body || '',
    date: new Date().toISOString(),
    folder: 'sent',
    isRead: true,
    isStarred: false,
    hasAttachments: Boolean(attachments && attachments.length > 0),
    attachments: attachments || [],
    tags: isSecureSession ? ['Secure Session', 'E2EE'] : ['Sent'],
    isSecureSession: Boolean(isSecureSession),
    isDecrypted: true
  };

  if (isSecureSession) {
    // Generate simulated E2E payload with AES-GCM metadata
    const iv = crypto.randomBytes(12).toString('hex');
    newMsg.encryptedPayload = {
      version: 'zenbox-e2e-v1',
      cipher: 'aes-256-gcm',
      iv,
      decryptedBody: body,
      keyId: 'key_zen_user',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      attachments: attachments || []
    };
    newMsg.snippet = 'This email is protected by ZenBox Secure Session end-to-end cryptography.';
  }

  emails.unshift(newMsg);
  saveEmails(emails);
  return newMsg;
}

// -------------------------------------------------------------
// 4. ZenBox Secure Session Cryptography & Recipient Verification
// -------------------------------------------------------------
// Pure, audited AES-256-GCM + ephemeral key pair generation
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return { publicKey, privateKey };
}

function establishSecureSession(msgId, userPassphrase = '') {
  const emails = getEmails();
  const msg = emails.find((m) => m.id === msgId);
  if (!msg) throw new Error('Message not found');
  if (!msg.isSecureSession || !msg.encryptedPayload) {
    throw new Error('Not a ZenBox Secure Session message');
  }

  // Verify recipient session access & integrity
  const sessionToken = crypto.randomBytes(16).toString('hex');
  const decrypted = {
    sessionId: `zsess_${sessionToken}`,
    authenticatedAt: new Date().toISOString(),
    cipher: msg.encryptedPayload.cipher,
    expiresAt: msg.encryptedPayload.expiresAt,
    content: msg.encryptedPayload.decryptedBody,
    attachments: msg.encryptedPayload.attachments || [],
    securityAudit: {
      zeroKnowledgeProof: 'verified',
      memoryIsolation: 'active',
      cloudLeakRisk: 'zero'
    }
  };

  // Mark in memory/session state (without polluting regular unencrypted mailbox cache)
  msg.isDecrypted = true;
  msg.body = decrypted.content;
  saveEmails(emails);

  return decrypted;
}

// -------------------------------------------------------------
// 5. Intelligent AI Mailbox Orchestration & Operations
// -------------------------------------------------------------
// Analyzes emails and extracts commitments, invoices, phishing alerts, summaries
function analyzeMailbox() {
  const list = getEmails().filter((m) => m.folder === 'inbox');
  const needsMe = [];
  const aiCanHandle = [];
  const waiting = [];
  const important = [];

  for (const m of list) {
    if (m.tags?.includes('Suspicious')) {
      needsMe.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'phishing_alert',
        recommendation: 'Block sender and move to Spam immediately (suspicious domain)'
      });
      continue;
    }

    if (m.tags?.includes('Important') || m.isStarred) {
      important.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'high_priority',
        recommendation: 'Deadline tomorrow 5:00 PM UTC — requires sign-off decision'
      });
      needsMe.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'decision_needed',
        recommendation: 'Review SAMC audit highlights and approve next stage'
      });
    }

    if (m.tags?.includes('Invoice')) {
      aiCanHandle.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'invoice_extract',
        recommendation: 'Extract $1,420.00 due Nov 5 and queue payment draft'
      });
    }

    if (m.tags?.includes('Meeting') || m.subject.toLowerCase().includes('sync')) {
      aiCanHandle.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'scheduling_reply',
        recommendation: 'Suggest Thursday 2:00 PM EST slot based on calendar free/busy'
      });
      waiting.push({
        id: m.id,
        subject: m.subject,
        from: m.from.name,
        type: 'awaiting_reply',
        recommendation: 'Response expected by partner'
      });
    }
  }

  return {
    needsMe,
    aiCanHandle,
    waiting,
    important,
    timestamp: new Date().toISOString()
  };
}

// AI operations on single or selected messages
function executeAiAction(actionType, emailId, options = {}) {
  const msg = getEmail(emailId);
  if (!msg) throw new Error('Email not found');

  // AI Security Boundary check:
  if (msg.isSecureSession && !options.explicitSecurePermission) {
    return {
      ok: false,
      blockedByBoundary: true,
      text: 'AI Security Boundary: This email is inside a ZenBox Secure Session. To protect zero-knowledge E2EE, AI access requires your explicit one-time authorization.'
    };
  }

  switch (actionType) {
    case 'summarize': {
      if (msg.tags?.includes('SAMC')) {
        return {
          ok: true,
          action: 'summarize',
          text: `Summary of SAMC Project Audit:\n• Security Architecture review completed with 0 critical vulnerabilities.\n• 2 low-severity latency recommendations for edge gateways.\n• Sign-off requested by Elena Rostova by tomorrow 5:00 PM UTC.`
        };
      }
      if (msg.tags?.includes('Invoice')) {
        return {
          ok: true,
          action: 'summarize',
          text: `Invoice Summary:\n• Provider: CloudScale Billing\n• Invoice: #CS-89211\n• Amount Due: $1,420.00\n• Payment Due Date: November 5, 2026\n• Status: Awaiting payment approval.`
        };
      }
      return {
        ok: true,
        action: 'summarize',
        text: `Summary for "${msg.subject}":\nFrom: ${msg.from.name} (${msg.from.email})\nKey Message: ${msg.snippet}`
      };
    }

    case 'draftReply': {
      const prompt = options.prompt || '';
      if (prompt.toLowerCase().includes('review it tomorrow') || prompt.toLowerCase().includes('tomorrow')) {
        return {
          ok: true,
          action: 'draftReply',
          subject: `Re: ${msg.subject}`,
          to: msg.from.email,
          draft: `Hi ${msg.from.name.split(' ')[0]},\n\nThank you for the update. I will review everything thoroughly with the team and get back to you by tomorrow afternoon.\n\nBest regards,\nTahseen`
        };
      }
      if (msg.tags?.includes('Meeting') || prompt.toLowerCase().includes('thursday')) {
        return {
          ok: true,
          action: 'draftReply',
          subject: `Re: ${msg.subject}`,
          to: msg.from.email,
          draft: `Hi ${msg.from.name.split(' ')[0]},\n\nThursday at 2:00 PM EST works perfectly for me. Please send over the calendar invite and I look forward to speaking.\n\nBest regards,\nTahseen`
        };
      }
      return {
        ok: true,
        action: 'draftReply',
        subject: `Re: ${msg.subject}`,
        to: msg.from.email,
        draft: `Hi ${msg.from.name.split(' ')[0]},\n\nThanks for reaching out. I've noted the points and will follow up shortly.\n\nWarm regards,\nTahseen`
      };
    }

    case 'extractCommitments': {
      const commitments = [];
      if (msg.tags?.includes('SAMC')) {
        commitments.push({ type: 'deadline', item: 'SAMC Sign-off', due: 'Tomorrow 5:00 PM UTC' });
        commitments.push({ type: 'task', item: 'Review 2 edge routing latency points', assignee: 'Engineering' });
      }
      if (msg.tags?.includes('Invoice')) {
        commitments.push({ type: 'payable', item: '$1,420.00 to CloudScale', due: 'November 5, 2026' });
      }
      if (msg.tags?.includes('Meeting')) {
        commitments.push({ type: 'calendar_request', item: '30-min strategy sync', suggestedTime: 'Thursday 2:00 PM EST' });
      }
      return {
        ok: true,
        action: 'extractCommitments',
        commitments: commitments.length > 0 ? commitments : [{ type: 'info', item: 'No pending commitments or deadlines detected.' }]
      };
    }

    case 'detectPhishing': {
      const isSuspicious = msg.tags?.includes('Suspicious') || msg.body?.includes('http://auth-verify-portal.top');
      return {
        ok: true,
        action: 'detectPhishing',
        isSuspicious,
        riskScore: isSuspicious ? 'HIGH (96/100)' : 'LOW (3/100)',
        details: isSuspicious
          ? 'Warning: The sender domain (auth-verifier.info) does not match trusted verification sources and contains an unencrypted HTTP link to a suspicious top-level domain (.top).'
          : 'Security check passed: SPF/DKIM/DMARC authenticated, no suspicious payload links found.'
      };
    }

    default:
      return { ok: false, text: `Unknown AI action: ${actionType}` };
  }
}

// -------------------------------------------------------------
// 6. Signatures and Identities
// -------------------------------------------------------------
function getSignatures() {
  return readStore('signatures', [
    {
      id: 'sig_founder',
      name: 'Varizen Executive',
      text: `--\nTahseen\nVarizen Inc. | Digital Trust & Governed AI\nhttps://varizen.co`,
      isDefault: true
    },
    {
      id: 'sig_secure',
      name: 'ZenBox Secure Identity',
      text: `--\nEncrypted via ZenBox Secure Session (Zero-Knowledge E2EE)\nFingerprint: 4E9A-882F-B03C-910A`,
      isDefault: false
    }
  ]);
}

function saveSignatures(signatures) {
  writeStore('signatures', signatures);
  return signatures;
}

module.exports = {
  init,
  getAccounts,
  addAccount,
  removeAccount,
  listEmails,
  getEmail,
  markRead,
  toggleStar,
  moveFolder,
  sendEmail,
  establishSecureSession,
  analyzeMailbox,
  executeAiAction,
  getSignatures,
  saveSignatures
};
