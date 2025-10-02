// CRYPTOGRAPHY - ADVANCED ENCRYPTION (33% contribution)
// Uses Web Crypto API for AES-256-GCM encryption

interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

// Derive encryption key from password using PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// AES-256-GCM Encryption
export async function encryptAES(plaintext: string, password: string): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(password, salt);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt)
  };
}

// AES-256-GCM Decryption
export async function decryptAES(
  encrypted: EncryptedData,
  password: string
): Promise<string> {
  const salt = base64ToArrayBuffer(encrypted.salt);
  const iv = base64ToArrayBuffer(encrypted.iv);
  const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);
  
  const key = await deriveKey(password, new Uint8Array(salt));
  
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv)
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed - Invalid password or corrupted data');
  }
}

// SHA-256 Hashing for passwords
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64(hashBuffer);
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}

// Helper: ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Encrypt sensitive personal data
export async function encryptPersonalData(data: {
  aadhaar?: string;
  pan?: string;
  bankAccount?: string;
  [key: string]: string | undefined;
}, masterPassword: string) {
  const encrypted: { [key: string]: EncryptedData } = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      encrypted[key] = await encryptAES(value, masterPassword);
    }
  }
  
  return encrypted;
}

// Decrypt sensitive personal data
export async function decryptPersonalData(
  encrypted: { [key: string]: EncryptedData },
  masterPassword: string
) {
  const decrypted: { [key: string]: string } = {};
  
  for (const [key, value] of Object.entries(encrypted)) {
    try {
      decrypted[key] = await decryptAES(value, masterPassword);
    } catch (error) {
      decrypted[key] = '❌ Decryption Failed';
    }
  }
  
  return decrypted;
}