import { useState, useEffect } from 'react';
import { usePublicKey } from './useLocalStorage';
import NostrClient from '../utils/NostrRelayPool';
import type { NDKUser } from '@nostr-dev-kit/ndk';

 
export function useNostr() {
  const [profile, setProfile] = useState<NDKUser | null>(null);
  const [publicKey] = usePublicKey();

  useEffect(() => {
    async function fetchProfile() {
      if (!publicKey) {
        console.error('Public key is not set');
        return;
      }
      try {
        await NostrClient.initialize();
        const profileData = await NostrClient.getUserProfile(publicKey);
        if (profileData) {
          setProfile(profileData);
        } else {
          console.error('Profile data is null or undefined');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, [publicKey]);

  return { profile };
}
