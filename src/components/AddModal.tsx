import React, { useState, useEffect } from 'react';

interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: Shortcut) => void;
  editingShortcut?: Shortcut;
  isDarkMode: boolean;
}

export default function AddModal({ isOpen, onClose, onSave, editingShortcut, isDarkMode }: AddModalProps) {
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
    onSave({ name, url, icon });
    setName('');
    setUrl('');
    setIcon('');
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h3 className="text-lg font-medium mb-4">
          {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* ...existing form fields... */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
            >
              {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
            </button>
          </div>
        </form>
       </div>
    </div>
  );
}
