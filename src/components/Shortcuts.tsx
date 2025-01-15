import { Dispatch, SetStateAction } from 'react';

interface ShortcutsProps {
  isDarkMode: boolean;
  shortcuts?: { name: string; url: string; icon: string }[];
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Shortcuts({ isDarkMode, shortcuts = [], setIsAddModalOpen }: ShortcutsProps) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-5 gap-4">
        {shortcuts.map((shortcut, index) => (
          <a
            key={index}
            href={shortcut.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
          >
            <div 
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} transition-all duration-300 hover:bg-blue-500`} 
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {shortcut.name}
            </div>
          </a>
        ))}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-20 h-20 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}


