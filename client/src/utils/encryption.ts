/**
 * Encryption utilities for the chat application
 */
import CryptoJS from 'crypto-js';

export interface EncryptionKeys {
  key: string;
  masterKey: string;
}

/**
 * Encrypts a message using the provided key
 * @param message - The plain text message to encrypt
 * @param key - The encryption key in hex format
 * @returns Object containing the encrypted content and initialization vector
 */
export const encryptMessage = (
  message: string, 
  key: string
): { content: string, iv: string } => {
  if (!message || !key) {
    throw new Error('Message and key are required for encryption');
  }

  try {
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Parse the key
    const parsedKey = CryptoJS.enc.Hex.parse(key);
    
    // Encrypt the message
    const encrypted = CryptoJS.AES.encrypt(message, parsedKey, { iv });
    
    return {
      content: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
      iv: iv.toString(CryptoJS.enc.Hex)
    };
  } catch (error: any) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Decrypts a message using the provided key and IV
 * @param encryptedContent - The encrypted content in hex format
 * @param iv - The initialization vector in hex format
 * @param key - The encryption key in hex format
 * @returns The decrypted plain text message
 */
export const decryptMessage = (
  encryptedContent: string, 
  iv: string, 
  key: string
): string => {
  if (!encryptedContent || !iv || !key) {
    throw new Error('Encrypted content, IV, and key are required for decryption');
  }

  try {
    // Parse the key, IV and encrypted content
    const parsedKey = CryptoJS.enc.Hex.parse(key);
    const ivParsed = CryptoJS.enc.Hex.parse(iv);
    const cipherTextParsed = CryptoJS.enc.Hex.parse(encryptedContent);
    
    // Create the cipher params object
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: cipherTextParsed
    });
    
    // Decrypt the message
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      parsedKey,
      { iv: ivParsed }
    );
    
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Decryption produced empty result');
    }
    
    return decryptedText;
  } catch (error: any) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message: ' + (error.message || 'Unknown error'));
  }
}; 