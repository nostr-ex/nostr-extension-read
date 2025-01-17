// Interface for groups of settings
interface UISettings {
    theme: 'light' | 'dark' | 'system';
    isDarkMode: boolean;
    compactMode: boolean;
    showClock: boolean;
    showLogo: boolean;
    showSearchBox: boolean;
    showShortcuts: boolean;
    showProfile: boolean;
    language: string;
}

interface NostrSettings {
    publicKey: string;
    privateKey: string;
    defaultRelays: string[];
    profileName: string;
}

interface SecuritySettings {
    privacyMode: boolean;
    encryptData: boolean;
    autoLock: boolean;
    lockTimeout: number;
}

interface AppSettings {
    autoSync: boolean;
    notifications: boolean;
    notificationSound: boolean;
    shortcuts: ShortcutItem[];
}

interface ShortcutItem {
    name: string;
    url: string;
    icon: string;
}

export interface Settings {
    ui: UISettings;
    nostr: NostrSettings;
    security: SecuritySettings;
    app: AppSettings;
}

export const DEFAULT_SETTINGS: Settings = {
    ui: {
        theme: 'system',
        isDarkMode: false,
        compactMode: false,
        showClock: true,
        showLogo: true,
        showSearchBox: true,
        showShortcuts: true,
        showProfile: true,
        language: 'en'
    },
    nostr: {
        publicKey: '',
        privateKey: '',
        defaultRelays: [
            'wss://relay.damus.io',
            'wss://nos.lol',
            'wss://relay.nostr.band'
        ],
        profileName: ''
    },
    security: {
        privacyMode: false,
        encryptData: true,
        autoLock: true,
        lockTimeout: 30 // minutes
    },
    app: {
        autoSync: true,
        notifications: true,
        notificationSound: true,
        shortcuts: []
    }
};