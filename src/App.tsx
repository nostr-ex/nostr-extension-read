import nostrexLogo from "./assets/nostrex.svg";
import "./App.css";
import Settings from "./components/Settings";
import Clock from "./components/Clock";
import SearchBox from "./components/SearchBox";
import Shortcuts from "./components/Shortcuts";
import ShortcutsModal from "./components/ShortcutsModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState } from 'react';

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
    shortcuts: [],
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleAddShortcut = (shortcut: { name: string; url: string; icon: string }) => {
    updateSettings({ shortcuts: [...settings.shortcuts, shortcut] });
  };

  return (
    <div className={settings.isDarkMode ? 'dark' : 'light'}>
      <div className={`min-h-screen min-w-full relative overflow-hidden flex flex-col items-center justify-center`}>
        {settings.showLogo && (
          <div className="top-5 mb-8">
            <img src={nostrexLogo} className="w-16 h-16 opacity-50 hover:opacity-100 transition-opacity" alt="NostrEx logo" />
          </div>
        )}
        
        {settings.showClock && <Clock show={settings.showClock} isDarkMode={settings.isDarkMode} />}
        
        {settings.showClock && <div className="h-8"></div>}
        
        {settings.showSearchBox && (
          <div className="w-full max-w-2xl px-4">
            <SearchBox isDarkMode={settings.isDarkMode} />
          </div>
        )}

        {settings.showShortcuts && (
          <div className="w-full max-w-2xl px-4 mt-4">
            <Shortcuts isDarkMode={settings.isDarkMode} shortcuts={settings.shortcuts} />
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Shortcut
            </button>
          </div>
        )}

        <Settings 
          settings={settings}
          onSettingsChange={updateSettings}
        />

        {isAddModalOpen && (
          <ShortcutsModal 
            isDarkMode={settings.isDarkMode} 
            onClose={() => setIsAddModalOpen(false)}
            onAddShortcut={handleAddShortcut}
          />
        )}
      </div>
    </div>
  );
}

export default App;