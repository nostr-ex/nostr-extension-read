import { useState, useEffect } from 'react';
import { useNDK } from '../context/NDKContext';
import type { NostrUser, NostrProfile } from '../types/nostr';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';

export default function LoginButton() {
  const { ndk, connect } = useNDK();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState<{
    user: NostrUser | null;
    profile: NostrProfile | null;
  }>({
    user: null,
    profile: null
  });

  // Load saved user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nostr_user');
    if (savedUser) {
      try {
        setUserData({
          user: JSON.parse(savedUser),
          profile: JSON.parse(localStorage.getItem('nostr_profile') || 'null')
        });
      } catch (e) {
        console.error('Failed to parse saved user data:', e);
        localStorage.removeItem('nostr_user');
        localStorage.removeItem('nostr_profile');
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add initial delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check for extension with retry
      let retries = 0;
      while (retries < 3) {
        if (window.nostr) {
          break;
        }
        await new Promise(r => setTimeout(r, 1000));
        retries++;
      }

      if (!window.nostr) {
        throw new Error('Nostr extension not found. Please install one and refresh the page.');
      }

      // Get public key with retry
      let publicKey = null;
      retries = 0;
      while (retries < 3) {
        try {
          publicKey = await window.nostr.getPublicKey();
          if (publicKey) break;
        } catch (e) {
          console.error('Failed to get public key:', e);
          retries++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!publicKey) {
        throw new Error('Could not get public key. Please check extension permissions.');
      }

      // Connect NDK if needed
      if (!ndk) {
        await connect();
      }

      // Get user data with retry
      let ndkUser = null;
      retries = 0;
      while (retries < 3) {
        try {
          ndkUser = await ndk?.getUser({ pubkey: publicKey });
          if (ndkUser) break;
        } catch (e) {
          console.error('Failed to get user data:', e);
          retries++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!ndkUser) {
        throw new Error('Could not get user data. Please try again.');
      }

      // Get profile with retry
      let profile = null;
      retries = 0;
      while (retries < 3) {
        try {
          profile = await ndkUser.fetchProfile();
          if (profile) break;
        } catch {
          retries++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      // Save and update user data
      const userData = {
        npub: ndkUser.npub,
        pubkey: publicKey,
      };

      localStorage.setItem('nostr_user', JSON.stringify(userData));
      if (profile) {
        localStorage.setItem('nostr_profile', JSON.stringify(profile));
      }

      setUserData({
        user: userData,
        profile: profile as NostrProfile
      });

      setModalOpen(false);

    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nostr_user');
    localStorage.removeItem('nostr_profile');
    setUserData({ user: null, profile: null });
  };

  if (userData.user) {
    return (
      <UserMenu 
        user={userData.user}
        metadata={userData.profile || {}}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full
                   transition-all duration-300 flex items-center gap-2
                   disabled:opacity-50"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        {isLoading ? 'Connecting...' : 'Connect'}
      </button>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onNip07Login={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
