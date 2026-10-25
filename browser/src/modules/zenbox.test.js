// ZenBox behavioral and security boundary unit tests
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const zenbox = require('./zenbox');

// Setup isolated temporary data dir for tests
const tmpDir = path.join(os.tmpdir(), `zenbox_test_${Date.now()}`);
fs.mkdirSync(tmpDir, { recursive: true });
zenbox.init(tmpDir);

test('zenbox: accounts and unified mailbox initialization', () => {
  const accounts = zenbox.getAccounts();
  assert.ok(Array.isArray(accounts));
  assert.ok(accounts.length >= 2, 'Default accounts should exist');
  assert.ok(accounts.some((a) => a.provider === 'google'));
  assert.ok(accounts.some((a) => a.provider === 'microsoft'));
  assert.ok(accounts.some((a) => a.provider === 'zenbox-secure'));
});

test('zenbox: listing and searching unified emails', () => {
  const emails = zenbox.listEmails();
  assert.ok(Array.isArray(emails));
  assert.ok(emails.length >= 5, 'Initial sample emails should be present');

  // Search by project keyword
  const samc = zenbox.listEmails({ search: 'SAMC' });
  assert.ok(samc.length >= 1);
  assert.match(samc[0].subject, /SAMC/i);

  // Search by invoice
  const inv = zenbox.listEmails({ search: 'invoice' });
  assert.ok(inv.length >= 1);
  assert.match(inv[0].subject, /invoice/i);
});

test('zenbox: sending email and folder manipulation', () => {
  const sent = zenbox.sendEmail({
    accountId: 'acc_varizen',
    to: 'partner@example.com',
    subject: 'Test ZenBox Dispatch',
    body: 'Automated test message content.',
    attachments: []
  });
  assert.equal(sent.folder, 'sent');
  assert.equal(sent.isRead, true);

  const found = zenbox.getEmail(sent.id);
  assert.ok(found);
  assert.equal(found.subject, 'Test ZenBox Dispatch');

  // Move to archive
  zenbox.moveFolder(sent.id, 'archive');
  const archived = zenbox.getEmail(sent.id);
  assert.equal(archived.folder, 'archive');
});

test('zenbox: AI Agent Mode mailbox analysis', () => {
  const analysis = zenbox.analyzeMailbox();
  assert.ok(analysis.needsMe.length > 0, 'Should identify items needing user attention');
  assert.ok(analysis.aiCanHandle.length > 0, 'Should identify items AI can handle');
  assert.ok(analysis.important.length > 0, 'Should identify high-priority items');

  const phishing = analysis.needsMe.find((n) => n.type === 'phishing_alert');
  assert.ok(phishing, 'Should detect phishing attack and flag to user');
});

test('zenbox: AI operations (summarize, commitments, phishing detection)', () => {
  const samcMsg = zenbox.listEmails({ search: 'SAMC' })[0];
  const summary = zenbox.executeAiAction('summarize', samcMsg.id);
  assert.equal(summary.ok, true);
  assert.match(summary.text, /SAMC/);

  const commitments = zenbox.executeAiAction('extractCommitments', samcMsg.id);
  assert.equal(commitments.ok, true);
  assert.ok(commitments.commitments.length > 0);

  const suspMsg = zenbox.listEmails({ search: 'URGENT: Verify' })[0];
  const phishing = zenbox.executeAiAction('detectPhishing', suspMsg.id);
  assert.equal(phishing.ok, true);
  assert.equal(phishing.isSuspicious, true);
});

test('zenbox: AI security boundary prevents unauthorized access to Secure Session', () => {
  const secureMsg = zenbox.listEmails({ search: 'ZenBox Secure Session' })[0];
  assert.ok(secureMsg.isSecureSession, 'Message should be marked as Secure Session');

  // Without explicit authorization, AI action is blocked by boundary
  const attempt = zenbox.executeAiAction('summarize', secureMsg.id, { explicitSecurePermission: false });
  assert.equal(attempt.ok, false);
  assert.equal(attempt.blockedByBoundary, true);
  assert.match(attempt.text, /AI Security Boundary/);
});

test('zenbox: establishing end-to-end encrypted Secure Session', () => {
  const secureMsg = zenbox.listEmails({ search: 'ZenBox Secure Session' })[0];
  const session = zenbox.establishSecureSession(secureMsg.id);
  assert.ok(session.sessionId.startsWith('zsess_'));
  assert.equal(session.cipher, 'aes-256-gcm');
  assert.match(session.content, /CONFIDENTIAL ZENBOX SECURE DISPATCH/);
  assert.equal(session.securityAudit.cloudLeakRisk, 'zero');

  // After session is established, message body is viewable in decrypted state
  const updated = zenbox.getEmail(secureMsg.id);
  assert.equal(updated.isDecrypted, true);
  assert.ok(updated.body.includes('CONFIDENTIAL ZENBOX SECURE DISPATCH'));
});
