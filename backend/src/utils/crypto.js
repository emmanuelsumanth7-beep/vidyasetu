const crypto = require('crypto');

// In a real production system, this key must be securely managed via AWS KMS, HashiCorp Vault, or similar.
// For this prototype, we'll derive a 256-bit key from an environment variable or use a fallback.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'base64')
  : crypto.randomBytes(32); // Fallback generates a volatile key per restart (will break persistent decryption, but works for prototyping)

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The resulting string contains the IV, ciphertext, and auth tag concatenated and base64 encoded.
 * Format: base64(iv + authTag + ciphertext)
 */
function encrypt(text) {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV, AuthTag, and Encrypted Data
    const combined = Buffer.concat([iv, authTag, encrypted]);
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypts a string previously encrypted with encrypt().
 */
function decrypt(cipherText) {
  if (!cipherText) return cipherText;
  try {
    const combined = Buffer.from(cipherText, 'base64');
    
    // Extract pieces
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    // Return a safe placeholder if decryption fails (e.g. key rotated/lost)
    return "[ENCRYPTED DATA UNREADABLE]";
  }
}

module.exports = {
  encrypt,
  decrypt
};
