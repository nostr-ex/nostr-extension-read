interface Window {
  nostr?: {
    getPublicKey(): Promise<string>;
    signEvent(event: NostrEvent): Promise<NostrEvent>;
    // Add other NIP-07 methods as needed
  };
  alby?: {
    enable(): Promise<void>;
    getPublicKey(): Promise<string>;
    signEvent(event: NostrEvent): Promise<NostrEvent>;
  };
  nos2x?: {
    getPublicKey(): Promise<string>;
    signEvent(event: NostrEvent): Promise<NostrEvent>;
  };
  getalby?: {
    enable(): Promise<void>;
    getPublicKey(): Promise<string>;
    signEvent(event: NostrEvent): Promise<NostrEvent>;
  };
}

interface NostrEvent {
  id?: string;
  pubkey?: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig?: string;
}
