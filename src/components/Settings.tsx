import { useState } from 'react';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePublicKey, usePrivateKey } from '../hooks/useLocalStorage';
import { useNostr } from '../hooks/useNostr';

interface SettingsProps {
  settings: {
    showClock: boolean;
    isDarkMode: boolean;
    notifications: boolean;
    profileName: string;
    showLogo: boolean;
    showSearchBox: boolean;
    showShortcuts: boolean;
  };
  onSettingsChange: (updates: Partial<SettingsProps['settings']>) => void;
}

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [publicKey, setPublicKey] = usePublicKey();
  const [privateKey, setPrivateKey] = usePrivateKey();
  const { fetchProfile } = useNostr();

  const handleSave = () => {
    setIsOpen(false);
  };

  const handlePublicKeyChange = async (value: string) => {
    setPublicKey(value);
    if (value) {
      await fetchProfile(value);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/30"
      >
        <Cog6ToothIcon className="h-8 w-8 text-white" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg max-h-[80vh] shadow-2xl transition-all duration-300 animate-modalEntry"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white tracking-wide">Settings</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors duration-200 hover:bg-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="modal-body space-y-6 overflow-y-auto max-h-[60vh] p-4">
              <div className="space-y-4">
                
                <div className="space-y-4 py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Profile Name</label>
                    <input 
                      type="text" 
                      value={settings.profileName}
                      onChange={(e) => onSettingsChange({ profileName: e.target.value })}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
               
                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Show Clock</label>
                    <span className="text-gray-400 text-sm">Display local time in center</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ showClock: !settings.showClock })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.showClock}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.showClock ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.showClock ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Show Logo</label>
                    <span className="text-gray-400 text-sm">Display NostrEx logo</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ showLogo: !settings.showLogo })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.showLogo}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.showLogo ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.showLogo ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Notifications</label>
                    <span className="text-gray-400 text-sm">Enable push notifications</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ notifications: !settings.notifications })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.notifications}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Show Search Box</label>
                    <span className="text-gray-400 text-sm">Display search box</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ showSearchBox: !settings.showSearchBox })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.showSearchBox}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.showSearchBox ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.showSearchBox ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Show Shortcuts</label>
                    <span className="text-gray-400 text-sm">Display shortcuts modal</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ showShortcuts: !settings.showShortcuts })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.showShortcuts}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.showShortcuts ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.showShortcuts ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Dark Mode</label>
                    <span className="text-gray-400 text-sm">Choose your preferred theme</span>
                  </div>
                  <div 
                    className="h-6 w-11 rounded-full relative bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSettingsChange({ isDarkMode: !settings.isDarkMode })}
                  >
                    <input 
                      type="checkbox" 
                      checked={settings.isDarkMode}
                      onChange={() => {}}
                      className="sr-only peer" 
                    />
                    <span className={`absolute inset-0 rounded-full transition-colors ${settings.isDarkMode ? 'bg-blue-600' : ''}`}></span>
                    <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.isDarkMode ? 'translate-x-5' : ''}`}></span>
                  </div>
                </div>

                <div className="space-y-4 py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Public Key</label>
                    <input 
                      type="text" 
                      value={publicKey}
                      onChange={(e) => handlePublicKeyChange(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Enter your public key"
                    />
                  </div>
                </div>

                <div className="space-y-4 py-3 hover:bg-gray-700/30 px-3 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <label className="text-white font-medium block">Private Key</label>
                    <input 
                      type="text" 
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Enter your private key"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-gray-700 flex justify-end space-x-3 sticky bottom-0 bg-gray-800 z-10">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
