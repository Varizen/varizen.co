import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, deriveSharedKey, encryptAESGCM, decryptAESGCM, isZMailSecureEmail } from '../server/crypto.js';
import { secureVault } from '../server/secureVault.js';
import { MailEngine } from '../server/mailEngine.js';
import { ZMailAIEngine } from '../server/aiEngine.js';

describe('ZMail Cryptography & Secure Session Engine', () => {
  test('generates valid P-256 ECDH keypairs and derives symmetric AES key', () => {
    const alice = generateKeyPair();
    const bob = generateKeyPair();

    assert.ok(alice.publicKey, 'Alice should have public key');
    assert.ok(alice.privateKey, 'Alice should have private key');

    const aliceShared = deriveSharedKey(alice.privateKey, bob.publicKey);
    const bobShared = deriveSharedKey(bob.privateKey, alice.publicKey);

    assert.deepEqual(aliceShared, bobShared, 'Alice and Bob should derive identical shared secret');
    assert.equal(aliceShared.length, 32, 'Shared key must be 256 bits (32 bytes)');
  });

  test('encrypts and decrypts payload using AES-256-GCM', () => {
    const key = Buffer.alloc(32, 7); // 256-bit test key
    const secretText = 'Confidential ZMail strategic intelligence payload';

    const encrypted = encryptAESGCM(secretText, key);
    assert.ok(encrypted.iv);
    assert.ok(encrypted.ciphertext);
    assert.ok(encrypted.authTag);

    const decryptedBuf = decryptAESGCM(encrypted, key);
    assert.equal(decryptedBuf.toString('utf8'), secretText);
  });

  test('detects ZMail Secure Session protocol signature', () => {
    const regular = 'Hello world ordinary email';
    const secure = '--- ZMAIL_SECURE_SESSION_V1 ---\n{"sessionId":"zss_123"}';

    assert.equal(isZMailSecureEmail(regular), false);
    assert.equal(isZMailSecureEmail(secure), true);
  });

  test('enforces AI security boundary on secure session vault', () => {
    const sessionId = 'zss_test_boundary';
    secureVault.createOrGetSession({
      sessionId,
      sender: 'alice@test.com',
      recipient: 'bob@test.com'
    });

    // Default: AI access is disabled
    assert.equal(secureVault.canAIAccess(sessionId), false);

    // Cannot grant without explicit user flag
    assert.throws(() => {
      secureVault.grantAIAccess(sessionId, false);
    });

    // Grant with explicit flag
    secureVault.grantAIAccess(sessionId, true);
    assert.equal(secureVault.canAIAccess(sessionId), true);

    // Revoke
    secureVault.revokeAIAccess(sessionId);
    assert.equal(secureVault.canAIAccess(sessionId), false);
  });
});

describe('ZMail Mail Engine & AI Agent Mode', () => {
  test('manages multiple connected email providers in unified mailbox', () => {
    const engine = new MailEngine();
    const accounts = engine.getAccounts();
    assert.ok(accounts.length >= 3, 'Default demo accounts should be pre-configured');

    const inbox = engine.getMessages({ folder: 'inbox' });
    assert.ok(inbox.length >= 4, 'Unified inbox should contain messages from all accounts');
  });

  test('sends standard and encrypted ZMail emails', () => {
    const engine = new MailEngine();

    // Send normal
    const normal = engine.sendMessage({
      accountId: 'acc_1',
      to: ['colleague@work.com'],
      subject: 'Weekly Status',
      body: 'Everything on schedule.'
    });
    assert.equal(normal.success, true);
    assert.equal(normal.message.folder, 'sent');

    // Send ZMail Secure Session
    const secure = engine.sendMessage({
      accountId: 'acc_1',
      to: ['client@corp.com'],
      subject: 'Private Acquisition NDA',
      body: 'Protected legal terms...',
      isSecure: true
    });
    assert.equal(secure.success, true);
    assert.ok(secure.secureSessionId);
    assert.equal(secure.message.isSecureSession, true);
  });

  test('AI engine triages mailbox with Agent Mode into four categorized buckets', async () => {
    const engine = new MailEngine();
    const ai = new ZMailAIEngine(engine);

    const triage = await ai.runAIAgentMode();
    assert.ok(triage.buckets);
    assert.ok(Array.isArray(triage.buckets.needsMe));
    assert.ok(Array.isArray(triage.buckets.aiCanHandle));
    assert.ok(Array.isArray(triage.buckets.waiting));
    assert.ok(Array.isArray(triage.buckets.important));

    // Verify phishing quarantine action is prepared in aiCanHandle
    const spamAction = triage.buckets.aiCanHandle.find(a => a.actionType === 'SPAM_ISOLATION');
    assert.ok(spamAction, 'AI should detect suspicious email and propose spam quarantine');

    // Verify secure session is placed in Needs Me
    const secureItem = triage.buckets.needsMe.find(n => n.reason.includes('Secure Session'));
    assert.ok(secureItem, 'Secure Session must be placed in Needs Me bucket');
  });

  test('AI engine executes batch actions accurately', async () => {
    const engine = new MailEngine();
    const ai = new ZMailAIEngine(engine);

    const targetMsg = engine.getMessages({ folder: 'inbox' })[0];
    const results = await ai.executeAIActions([
      { type: 'archive', messageId: targetMsg.id }
    ]);

    assert.equal(results[0].status, 'archived');
    assert.equal(engine.getMessageById(targetMsg.id).folder, 'archive');
  });

  test('AI engine responds to natural language commands', () => {
    const engine = new MailEngine();
    const ai = new ZMailAIEngine(engine);

    const samcQuery = ai.processNaturalLanguageQuery('Find everything related to SAMC project');
    assert.equal(samcQuery.intent, 'SEARCH_PROJECT');
    assert.ok(samcQuery.data.length > 0);

    const invoiceQuery = ai.processNaturalLanguageQuery('How much I owe in invoices?');
    assert.equal(invoiceQuery.intent, 'INVOICE_LOOKUP');
    assert.ok(invoiceQuery.message.includes('$1,420.50'));
  });
});
