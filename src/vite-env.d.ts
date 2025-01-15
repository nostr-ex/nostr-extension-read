/// <reference types="vite/client" />

import type { NostrEvent, NostrRelays } from './types/nostr';

interface Window {
  nostr?: {
    getPublicKey(): Promise<string>;
    signEvent(event: NostrEvent): Promise<NostrEvent>;
    getRelays(): Promise<NostrRelays>;
  }
}
