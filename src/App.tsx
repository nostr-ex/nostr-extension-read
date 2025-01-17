import nostrexLogo from "./assets/nostrex.svg";
import "./App.css";
import SettingsDialog from "./components/Settings";
import Clock from "./components/Clock";
import SearchBox from "./components/SearchBox";
import Shortcuts from "./components/Shortcuts";
import ShortcutsModal from "./components/ShortcutsModal";
import Profile from './components/Profile';
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState, useEffect, useRef } from 'react';
import { useNostr } from './hooks/useNostr';
import { Box, Container } from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Settings, DEFAULT_SETTINGS } from './types/settings';
import { usePublicKey } from './hooks/useLocalStorage';
import ErrorBoundary from './components/ErrorBoundary';

interface AppProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC<AppProps> = ({ isDarkMode, setIsDarkMode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize settings with proper structure
  const [settings, setSettings] = useLocalStorage<Settings>("nostrex-settings", DEFAULT_SETTINGS);

  // Sync settings on mount
  useEffect(() => {
    if (!settings?.ui) return; // Add null check

    setSettings(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        isDarkMode,
        theme: isDarkMode ? 'dark' : 'light'
      }
    }));
  }, []); // Run only on mount

  const updateSettings = (updates: Partial<Settings>) => {
    try {
      if (!settings) return; // Add null check

      // Handle theme changes
      if (updates.ui?.theme) {
        const newIsDarkMode = updates.ui.theme === 'dark' || 
          (updates.ui.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(newIsDarkMode);
      }

      // Handle nostr public key updates
      if (updates.nostr?.publicKey) {
        setPublicKey(updates.nostr.publicKey);
      }

      // Update settings with null checks
      setSettings(prev => ({
        ...prev,
        ...(updates.ui ? { ui: { ...prev.ui, ...updates.ui } } : {}),
        ...(updates.nostr ? { nostr: { ...prev.nostr, ...updates.nostr } } : {}),
        ...(updates.security ? { security: { ...prev.security, ...updates.security } } : {}),
        ...(updates.app ? { app: { ...prev.app, ...updates.app } } : {})
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Update theme effect
  useEffect(() => {
    if (!settings?.ui?.theme) return; // Add null check

    if (settings.ui.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        updateSettings({ ui: { ...settings.ui, isDarkMode: e.matches } });
      };

      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, [settings?.ui?.theme]); // Update dependency

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useNostr();
  const [editingShortcut, setEditingShortcut] = useState<{ data: { name: string; url: string; icon: string }, index: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [, setPublicKey] = usePublicKey();

  // Add this check for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Add modal check
      if (settingsOpen || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settingsOpen]);

  const handleAddShortcut = (shortcut: { name: string; url: string; icon: string }) => {
    if (!settings?.app?.shortcuts) {
      // Initialize shortcuts array if it doesn't exist
      updateSettings({ 
        app: {
          ...settings?.app,
          shortcuts: [shortcut]
        }
      });
      return;
    }

    if (editingShortcut) {
      // Update existing shortcut
      const updatedShortcuts = [...settings.app.shortcuts];
      updatedShortcuts[editingShortcut.index] = shortcut;
      updateSettings({ 
        app: {
          ...settings.app,
          shortcuts: updatedShortcuts
        }
      });
      setEditingShortcut(null);
    } else {
      // Add new shortcut
      updateSettings({ 
        app: {
          ...settings.app,
          shortcuts: [...settings.app.shortcuts, shortcut]
        }
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (index: number) => {
    if (!settings?.app?.shortcuts) return;
    
    const updatedShortcuts = settings.app.shortcuts.filter((_, i) => i !== index);
    updateSettings({ 
      app: {
        ...settings.app,
        shortcuts: updatedShortcuts
      }
    });
  };

  const handleEdit = (shortcut: { name: string; url: string; icon: string }, index: number) => {
    setEditingShortcut({ data: shortcut, index });
    setIsAddModalOpen(true);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', width: '100vw' }}>
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 3, md: 4 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Update settings button position */}
          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.06)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(0, 0, 0, 0.12)',
              },
              width: 48,
              height: 48,
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0,0,0,0.4)'
                : '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
          >
            <SettingsIcon fontSize="medium" />
          </IconButton>

          {settings?.ui?.showLogo && (
            <Box sx={{ 
              textAlign: 'center', 
              mb: { xs: 2, sm: 4 }
            }}>
              <img 
                src={nostrexLogo} 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  maxWidth: '100%' 
                }} 
                alt="NostrEx logo" 
              />
            </Box>
          )}
          
          {settings?.ui?.showClock && <Clock show={Boolean(settings?.ui?.showClock)} settings={settings} />}
          
          {settings?.ui?.showClock && <Box sx={{ height: '32px' }}></Box>}
          
          <Box sx={{ 
            width: '100%',
            maxWidth: '640px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4
          }}>
            {settings?.ui?.showSearchBox && <SearchBox />}
            {settings?.ui?.showShortcuts && settings?.app?.shortcuts && (
              <Shortcuts 
                isDarkMode={settings?.ui?.isDarkMode || false} 
                shortcuts={settings.app.shortcuts} 
                setIsAddModalOpen={setIsAddModalOpen} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            )}
          </Box>

          <SettingsDialog 
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            onSettingsChange={updateSettings}
          />

          {settings?.ui?.showProfile && profile && profile?.image && (
            <Profile 
              image={profile.image} 
            />
          )}

          {isAddModalOpen && (
            <ShortcutsModal 
              onClose={() => {
                setIsAddModalOpen(false);
                setEditingShortcut(null);
              }}
              onAddShortcut={handleAddShortcut}
              editingShortcut={editingShortcut?.data}
            />
          )}
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

export default App;