import { useState, useEffect, useCallback, useRef } from 'react';
import { usePublicKey } from './useLocalStorage';
import NostrClient from '../utils/NostrRelayPool';
import type { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { normalizePublicKey } from '../utils/NostrUtils';

export function useNostr() {
  const [profile, setProfile] = useState<NDKUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey] = usePublicKey();
  const profileCache = useRef<Record<string, NDKUserProfile>>({});
  const lastFetchTime = useRef<Record<string, number>>({});

  const fetchProfile = useCallback(async (force: boolean = false) => {
    if (!publicKey) {
      setProfile(null);
      setError(null);
      return null;
    }

    // Check cache first
    if (!force && profileCache.current[publicKey]) {
      const lastFetch = lastFetchTime.current[publicKey] || 0;
      const cacheAge = Date.now() - lastFetch;
      
      // Use cache if it's less than 5 minutes old
      if (cacheAge < 5 * 60 * 1000) {
        setProfile(profileCache.current[publicKey]);
        return profileCache.current[publicKey];
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      await NostrClient.initialize();
      const normalizedKey = normalizePublicKey(publicKey);
      const user = await NostrClient.getUserProfile(normalizedKey);
      
      if (user?.profile) {
        // Update cache
        profileCache.current[publicKey] = user.profile;
        lastFetchTime.current[publicKey] = Date.now();
        setProfile(user.profile);
        return user.profile;
      } else {
        setError('No profile found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [publicKey]);

  // Only fetch on mount or public key change
  useEffect(() => {
    if (publicKey) {
      fetchProfile();
    }
  }, [publicKey, fetchProfile]);

  return { 
    profile, 
    isLoading, 
    error,
    fetchProfile,
    refreshProfile: () => fetchProfile(true) // Force refresh method
  };
}
