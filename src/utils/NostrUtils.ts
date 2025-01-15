import { nip19 } from 'nostr-tools';

export function normalizePublicKey(key: string): string {
    if (key.startsWith('npub')) {
        try {
            const { data } = nip19.decode(key);
            return data as string;
        } catch (error) {
            console.error('Error decoding npub:', error);
            return '';
        }
    }
    return key;
}
