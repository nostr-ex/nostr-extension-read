import { useState, useEffect, useCallback } from 'react';
import { usePublicKey } from './useLocalStorage';
import NostrClient from '../utils/NostrRelayPool';
import type { NDKUser } from '@nostr-dev-kit/ndk';
import { normalizePublicKey } from '../utils/NostrUtils';

export function useNostr() {
  const [profile, setProfile] = useState<NDKUser | null>(null);
  const [publicKey] = usePublicKey();

  const fetchProfile = useCallback(async (key: string) => {
    try {
      await NostrClient.initialize();
      const normalizedKey = normalizePublicKey(key);
      const profileData = await NostrClient.getUserProfile(normalizedKey);
      if (profileData) {
        setProfile(profileData);
        return profileData;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchProfile(publicKey);
    }
  }, [publicKey, fetchProfile]);

  return { profile, fetchProfile };
}
