import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = (typeof process !== 'undefined' && process.env.SECRET_KEY) || 'default-secret-key';
const SETTINGS_KEY = 'nostrex-settings';
const PUBLIC_KEY_KEY = 'publicKey';

function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function decrypt(ciphertext: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting:', error);
        return '';
    }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            
            const decrypted = decrypt(item);
            return decrypted ? JSON.parse(decrypted) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            if (storedValue) {
                const encrypted = encrypt(JSON.stringify(storedValue));
                window.localStorage.setItem(key, encrypted);
            } else {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}

// کامپوننت اختصاصی برای مدیریت پابلیک کی
export const usePublicKey = () => {
    const [publicKey, setPublicKeyState] = useState<string>(() => {
        try {
            // اول از تنظیمات چک می‌کنیم
            const settingsItem = window.localStorage.getItem(SETTINGS_KEY);
            if (settingsItem) {
                const decryptedSettings = decrypt(settingsItem);
                const settings = JSON.parse(decryptedSettings);
                if (settings.publicKey) {
                    console.log('Found public key in settings');
                    return settings.publicKey;
                }
            }

            // اگر در تنظیمات نبود، از storage مستقیم چک می‌کنیم
            const encryptedKey = window.localStorage.getItem(PUBLIC_KEY_KEY);
            if (encryptedKey) {
                const decryptedKey = decrypt(encryptedKey);
                try {
                    const parsedKey = JSON.parse(decryptedKey);
                    console.log('Found public key in direct storage');
                    return parsedKey;
                } catch {
                    console.log('Found raw public key in direct storage');
                    return decryptedKey; // اگر parse نشد، خود string را برمی‌گردانیم
                }
            }
        } catch (error) {
            console.error('Error reading public key:', error);
        }
        return '';
    });

    const setPublicKey = (newKey: string) => {
        try {
            // ذخیره در storage مستقیم
            const encrypted = encrypt(newKey);
            window.localStorage.setItem(PUBLIC_KEY_KEY, encrypted);

            // به‌روزرسانی در تنظیمات
            const settingsItem = window.localStorage.getItem(SETTINGS_KEY);
            if (settingsItem) {
                const decryptedSettings = decrypt(settingsItem);
                const settings = JSON.parse(decryptedSettings);
                settings.publicKey = newKey;
                const encryptedSettings = encrypt(JSON.stringify(settings));
                window.localStorage.setItem(SETTINGS_KEY, encryptedSettings);
            }

            setPublicKeyState(newKey);
            console.log('Public key saved successfully');
        } catch (error) {
            console.error('Error saving public key:', error);
        }
    };

    // لاگ کردن تغییرات پابلیک کی
    useEffect(() => {
        console.log('Current public key:', publicKey);
    }, [publicKey]);

    return [publicKey, setPublicKey] as const;
};

export const usePrivateKey = () => useLocalStorage<string>('privateKey', '');
