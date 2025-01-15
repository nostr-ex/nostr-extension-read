import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = (typeof process !== 'undefined' && process.env.SECRET_KEY) || 'default-secret-key';

function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(decrypt(item)) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, encrypt(JSON.stringify(storedValue)));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// New hooks for public and private keys
export const usePublicKey = () => useLocalStorage<string>('publicKey', '');
export const usePrivateKey = () => useLocalStorage<string>('privateKey', '');
