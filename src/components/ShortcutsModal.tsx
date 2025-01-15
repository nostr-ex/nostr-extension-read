import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ShortcutsModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onAddShortcut: (shortcut: { name: string; url: string; icon: string }) => void;
  editingShortcut?: { name: string; url: string; icon: string };
}

export default function ShortcutsModal({ isDarkMode, onClose, onAddShortcut, editingShortcut }: ShortcutsModalProps) {
  const [name, setName] = useState(editingShortcut?.name || '');
  const [url, setUrl] = useState(editingShortcut?.url || '');
  const [icon, setIcon] = useState(editingShortcut?.icon || '');

  useEffect(() => {
    if (editingShortcut) {
      setName(editingShortcut.name);
      setUrl(editingShortcut.url);
      setIcon(editingShortcut.icon);
    }
  }, [editingShortcut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddShortcut({ name, url, icon });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`${
          isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        } rounded-2xl p-6 w-11/12 max-w-lg shadow-2xl transform transition-all duration-300 scale-100`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700">
          <h2 className="text-xl font-bold tracking-wide">
            {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors duration-200 hover:bg-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Shortcut Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200
                ${isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 border-gray-300'
                } border focus:border-purple-500`}
              placeholder="Enter shortcut name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              URL
            </label>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200
                ${isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 border-gray-300'
                } border focus:border-purple-500`}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Icon URL (optional)
            </label>
            <input 
              type="url" 
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-200
                ${isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 border-gray-300'
                } border focus:border-purple-500`}
              placeholder="https://example.com/icon.png"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-lg transition-all duration-200
                ${isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
