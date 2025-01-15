import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ShortcutsModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onAddShortcut: (shortcut: { name: string; url: string; icon: string }) => void;
}

export default function ShortcutsModal({ onClose, onAddShortcut }: ShortcutsModalProps) {
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '', icon: '' });

  const handleAddShortcut = () => {
    const iconUrl = `https://www.google.com/s2/favicons?domain=${newShortcut.url}`;
    onAddShortcut({ ...newShortcut, icon: iconUrl });
    setNewShortcut({ name: '', url: '', icon: '' });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg shadow-2xl transition-all duration-300 animate-modalEntry"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Add Shortcut</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors duration-200 hover:bg-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-white font-medium block">Shortcut Name</label>
            <input 
              type="text" 
              value={newShortcut.name}
              onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter shortcut name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-white font-medium block">Shortcut URL</label>
            <input 
              type="text" 
              value={newShortcut.url}
              onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter shortcut URL"
            />
          </div>
          <button 
            onClick={handleAddShortcut}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Shortcut
          </button>
        </div>
      </div>
    </div>
  );
}
