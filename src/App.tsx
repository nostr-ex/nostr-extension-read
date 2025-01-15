import nostrexLogo from "./assets/nostrex.svg";
import "./App.css";
import Settings from "./components/Settings";
import Clock from "./components/Clock";
import SearchBox from "./components/SearchBox";
import Shortcuts from "./components/Shortcuts";
import ShortcutsModal from "./components/ShortcutsModal";
import Profile from './components/Profile';
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState } from 'react';
import { useNostr } from './hooks/useNostr';

interface Settings {
  showClock: boolean;
  isDarkMode: boolean;
  notifications: boolean;
  profileName: string;
  showLogo: boolean;
  showSearchBox: boolean;
  showShortcuts: boolean;
  shortcuts: { name: string; url: string; icon: string }[];
}

function App() {
  const [settings, setSettings] = useLocalStorage<Settings>("nostrex-settings", {
    showClock: true,
    isDarkMode: true,
    notifications: false,
    profileName: "",
    showLogo: true,
    showSearchBox: true,
    showShortcuts: true,
    shortcuts: [], // Ensure this is initialized
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useNostr();
  const [editingShortcut, setEditingShortcut] = useState<{ data: { name: string; url: string; icon: string }, index: number } | null>(null);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

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
    <div className={settings.isDarkMode ? 'dark' : 'light'}>
      <div className={`min-h-screen min-w-full relative overflow-hidden flex flex-col items-center justify-center`}>
        {settings.showLogo && (
          <div className="top-5 mb-8">
            <img src={nostrexLogo} className="w-20 h-20  hover:opacity-70 transition-opacity" alt="NostrEx logo" />
          </div>
        )}
        
        {settings.showClock && <Clock show={settings.showClock} isDarkMode={settings.isDarkMode} profileName={settings.profileName} />}
        
        {settings.showClock && <div className="h-8"></div>}
        
        {settings.showSearchBox && (
          <div className="w-full max-w-2xl px-4">
            <SearchBox isDarkMode={settings.isDarkMode} />
          </div>
        )}

        {settings.showShortcuts && (
          <div className="w-full max-w-2xl px-4 mt-4">
            <Shortcuts isDarkMode={settings.isDarkMode} shortcuts={settings.shortcuts} setIsAddModalOpen={setIsAddModalOpen} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}

        <Settings 
          settings={settings}
          onSettingsChange={updateSettings}
        />

        {profile && profile.profile?.image && (
          <Profile 
            image={profile.profile.image} 
            name={profile.profile?.name || profile.profile?.displayName}
          />
        )}

        {isAddModalOpen && (
          <ShortcutsModal 
            isDarkMode={settings.isDarkMode} 
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingShortcut(null);
            }}
            onAddShortcut={handleAddShortcut}
            editingShortcut={editingShortcut?.data}
          />
        )}
      </div>
    </div>
  );
}

export default App;