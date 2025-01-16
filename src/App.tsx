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

interface AppProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC<AppProps> = ({ isDarkMode, setIsDarkMode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useLocalStorage<Settings>("nostrex-settings", {
    ...DEFAULT_SETTINGS,
    isDarkMode: isDarkMode, // sync with prop
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useNostr();
  const [editingShortcut, setEditingShortcut] = useState<{ data: { name: string; url: string; icon: string }, index: number } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateSettings = (updates: Partial<Settings>) => {
    if ('theme' in updates) {
      switch (updates.theme) {
        case 'dark':
          setIsDarkMode(true);
          break;
        case 'light':
          setIsDarkMode(false);
          break;
        case 'system': {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
          break;
        }
      }
    }

    setSettings(prev => ({
      ...prev,
      ...updates,
      isDarkMode: updates.theme === 'dark' || 
        (updates.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }));
  };

  // Add system theme change listener
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        setSettings(prev => ({ ...prev, isDarkMode: e.matches }));
      };

      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, [settings.theme]);

  // Initialize theme on mount
  useEffect(() => {
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      setSettings(prev => ({ ...prev, isDarkMode: prefersDark }));
    }
  }, []);

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
    if (editingShortcut) {
      // Update existing shortcut
      const updatedShortcuts = [...settings.shortcuts];
      updatedShortcuts[editingShortcut.index] = shortcut;
      updateSettings({ shortcuts: updatedShortcuts });
      setEditingShortcut(null);
    } else {
      // Add new shortcut
      const updatedShortcuts = settings.shortcuts ? [...settings.shortcuts, shortcut] : [shortcut];
      updateSettings({ shortcuts: updatedShortcuts });
    }
    setIsAddModalOpen(false);
  };

  const handleEdit = (shortcut: { name: string; url: string; icon: string }, index: number) => {
    setEditingShortcut({ data: shortcut, index });
    setIsAddModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedShortcuts = settings.shortcuts.filter((_, i) => i !== index);
    updateSettings({ shortcuts: updatedShortcuts });
  };

  return (
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

        {settings.showLogo && (
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
        
        {settings.showClock && <Clock show={settings.showClock} settings={settings} />}
        
        {settings.showClock && <Box sx={{ height: '32px' }}></Box>}
        
        <Box sx={{ 
          width: '100%',
          maxWidth: '640px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}>
          {settings.showSearchBox && <SearchBox />}
          {settings.showShortcuts && (
            <Shortcuts 
              isDarkMode={settings.isDarkMode} 
              shortcuts={settings.shortcuts} 
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

        {settings.showProfile && profile && profile.profile?.image && (
          <Profile 
            image={profile.profile.image} 
            name={profile.profile?.name || profile.profile?.displayName}
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
  );
}

export default App;