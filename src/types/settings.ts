export interface Settings {
    // User Settings
    userName: string;  // Add this field

    // UI Settings
    showClock: boolean;
    showLogo: boolean;
    showSearchBox: boolean;
    showShortcuts: boolean;
    showProfile: boolean;
    
    // Theme Settings
    theme: 'light' | 'dark' | 'system';
    isDarkMode: boolean;
    
    // App Settings
    language: string;
    privacyMode: boolean;
    autoSync: boolean;
    compactMode: boolean;
    notifications: boolean;
    profileName: string;
    
    // Nostr Keys
    nostrPublicKey: string;
    nostrPrivateKey: string;
    
    // Data
    shortcuts: { name: string; url: string; icon: string }[];
  }
  
  export const DEFAULT_SETTINGS: Settings = {
    userName: '',  // Add this field
    showClock: true,
    showLogo: true,
    showSearchBox: true,
    showShortcuts: true,
    showProfile: true,
    theme: 'system',
    isDarkMode: false,
    language: 'en',
    privacyMode: false,
    autoSync: true,
    compactMode: false,
    notifications: true,
    profileName: '',
    nostrPublicKey: '',
    nostrPrivateKey: '',
    shortcuts: []
  };