import { createContext, useContext, useEffect, useState } from 'react';
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk';

interface NDKContextType {
  ndk: NDK | null;
  signer: NDKNip07Signer | null;
  connect: () => Promise<void>;
  error: Error | null;
  isConnecting: boolean;
  isInitialized: boolean;
}

const NDKContext = createContext<NDKContextType>({
  ndk: null,
  signer: null,
  connect: async () => {},
  error: null,
  isConnecting: false,
  isInitialized: false,
});

export function NDKProvider({ children }: { children: React.ReactNode }) {
  const [ndk, setNDK] = useState<NDK | null>(null);
  const [signer, setSigner] = useState<NDKNip07Signer | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const connect = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);

      // Add delay to ensure extension is loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check for window.nostr with retry
      let retries = 0;
      while (retries < 3) {
        if (typeof window !== 'undefined' && window.nostr) {
          break;
        }
        await new Promise(r => setTimeout(r, 1000));
        retries++;
      }

      if (typeof window === 'undefined' || !window.nostr) {
        throw new Error('Nostr extension not found. Please install a Nostr extension and refresh the page.');
      }

      // Initialize signer
      const newSigner = new NDKNip07Signer();
      
      // Test extension permissions with retry
      let publicKey = null;
      retries = 0;
      while (retries < 3) {
        try {
          publicKey = await window.nostr.getPublicKey();
          if (publicKey) break;
        } catch (e) {
          console.warn('Failed to get public key, retrying...', e);
          retries++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!publicKey) {
        throw new Error('Could not get public key. Please check your Nostr extension permissions.');
      }

      // Create NDK instance with multiple reliable relays
      const newNDK = new NDK({
        explicitRelayUrls: [
          'wss://relay.damus.io',
          'wss://nos.lol',
          'wss://relay.nostr.band',
          'wss://relay.snort.social',
        ],
        signer: newSigner
      });

      // Connect with retry logic
      let connected = false;
      for (let i = 0; i < 3; i++) {
        try {
          await newNDK.connect();
          connected = true;
          break;
        } catch (e) {
          console.warn(`Connection attempt ${i + 1} failed, retrying...`, e);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!connected) {
        throw new Error('Failed to connect to relays after multiple attempts');
      }

      setNDK(newNDK);
      setSigner(newSigner);
      setIsInitialized(true);

    } catch (err) {
      console.error('NDK Connection error:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setNDK(null);
      setSigner(null);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (ndk) {
        console.log('Cleaning up NDK connection...');
        ndk.pool.removeAllListeners();
        // Close all relay connections
        ndk.pool.relays.forEach(relay => relay.disconnect());
      }
    };
  }, []);

  return (
    <NDKContext.Provider value={{ 
      ndk, 
      signer, 
      connect, 
      error, 
      isConnecting,
      isInitialized 
    }}>
      {children}
    </NDKContext.Provider>
  );
}

export const useNDK = () => useContext(NDKContext);
