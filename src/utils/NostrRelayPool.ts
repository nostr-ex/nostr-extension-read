import NDK, { NDKEvent, NDKFilter, NDKUser } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { normalizePublicKey } from './NostrUtils';

class NostrClient {
    private static instance: NostrClient;
    private ndk: NDK;
    private initialized: boolean = false;

    private constructor() {
        const dexieAdapter = new NDKCacheAdapterDexie({ 
            dbName: 'nostrex-db',
            profileCacheSize: 1000
        });

        this.ndk = new NDK({
            explicitRelayUrls: [
                "wss://nos.lol",
                "wss://relay.damus.io",
                "wss://nostr.mom"
            ],
            cacheAdapter: dexieAdapter,
            enableOutboxModel: true
        });

        // Set debug mode if in development
        if (process.env.NODE_ENV === 'development') {
            localStorage.setItem('debug', 'ndk:*');
        }
    }

    public static getInstance(): NostrClient {
        if (!NostrClient.instance) {
            NostrClient.instance = new NostrClient();
        }
        return NostrClient.instance;
    }

    public async initialize(): Promise<void> {
        if (!this.initialized) {
            try {
                await this.ndk.connect();
                this.initialized = true;
                console.log('Connected to relays');
            } catch (error) {
                console.error('Failed to connect to relays:', error);
                throw error;
            }
        }
    }

    public async getUserProfile(pubkey: string): Promise<NDKUser | null> {
        try {
            const normalizedPubkey = normalizePublicKey(pubkey);
            if (!normalizedPubkey) {
                throw new Error('Invalid public key');
            }
            const user = this.ndk.getUser({ pubkey: normalizedPubkey });
            const profile = await user.fetchProfile();
            console.log('Fetched profile:', profile); // اضافه کردن لاگ برای بررسی
            return user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    public async fetchEvents(filter: NDKFilter): Promise<NDKEvent[]> {
        const events = await this.ndk.fetchEvents(filter);
        return Array.from(events);
    }

    public subscribe(filter: NDKFilter, opts = { closeOnEose: false }) {
        return this.ndk.subscribe(filter, opts);
    }

    public destroy(): void {
        if (this.ndk) {
            this.ndk.pool.relays.forEach((relay) => relay.disconnect());
        }
    }
}

export default NostrClient.getInstance();
