/**
 * ZMail Cryptographic Subsystem for ZMail Secure Sessions
 * (was: ZenBox Cryptographic Subsystem for ZenBox Secure Sessions)
 * Uses standard Node.js crypto primitives (AES-256-GCM, ECDH P-256, PBKDF2/HKDF, SHA-256)
 * Strictly follows the principle: Never invent custom cryptography.
 */

import crypto from 'crypto';

/**
 * Generate a new P-256 ECDH keypair for device/account secure sessions.
 */
export function generateKeyPair() {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  return {
    publicKey: ecdh.getPublicKey('base64'),
    privateKey: ecdh.getPrivateKey('base64')
  };
}

/**
 * Derive shared secret from peer public key and local private key using ECDH
 */
export function deriveSharedKey(localPrivateKeyBase64, peerPublicKeyBase64, salt = 'zmail-secure-salt') {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(Buffer.from(localPrivateKeyBase64, 'base64'));
  const secret = ecdh.computeSecret(Buffer.from(peerPublicKeyBase64, 'base64'));
  
  // HKDF to derive 256-bit symmetric key for AES-GCM
  const derivedKey = crypto.hkdfSync('sha256', secret, Buffer.from(salt), Buffer.from('zmail-aes-key'), 32);
  return Buffer.from(derivedKey);
}

/**
 * Encrypt arbitrary payload (string or buffer) with AES-256-GCM
 */
export function encryptAESGCM(plainBufferOrText, keyBuffer) {
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  
  const dataBuf = Buffer.isBuffer(plainBufferOrText) 
    ? plainBufferOrText 
    : Buffer.from(plainBufferOrText, 'utf8');

  const ciphertext = Buffer.concat([cipher.update(dataBuf), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

/**
 * Decrypt AES-256-GCM package
 */
export function decryptAESGCM(encryptedPkg, keyBuffer) {
  const iv = Buffer.from(encryptedPkg.iv, 'base64');
  const ciphertext = Buffer.from(encryptedPkg.ciphertext, 'base64');
  const authTag = Buffer.from(encryptedPkg.authTag, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted;
}

/**
 * Create a ZMail Secure Session Message envelope
 */
export function createSecureSessionEnvelope({
  senderEmail,
  recipientEmail,
  senderPublicKey,
  encryptedBody,
  encryptedAttachments = [],
  expiresAt = null,
  sessionId = null,
  passphraseHint = null
}) {
  return {
    protocol: 'ZMAIL_SECURE_SESSION_V1',
    sessionId: sessionId || `zss_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    expiresAt,
    senderEmail,
    recipientEmail,
    senderPublicKey,
    passphraseHint,
    encryptedPayload: encryptedBody,
    encryptedAttachments
  };
}

/**
 * Check if a raw email message is a ZMail Secure Session
 * (accepts the legacy ZenBox marker for backward compatibility)
 */
export function isZMailSecureEmail(contentOrHeader) {
  if (!contentOrHeader) return false;
  const str = typeof contentOrHeader === 'string' ? contentOrHeader : JSON.stringify(contentOrHeader);
  return str.includes('ZMAIL_SECURE_SESSION_V1') || str.includes('ZENBOX_SECURE_SESSION_V1');
}
