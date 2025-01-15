import { Dispatch, SetStateAction, useState } from 'react';

interface ShortcutsProps {
  isDarkMode: boolean;
  shortcuts?: { name: string; url: string; icon: string }[];
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  onEdit?: (shortcut: { name: string; url: string; icon: string }, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function Shortcuts({ isDarkMode, shortcuts = [], setIsAddModalOpen, onEdit, onDelete }: ShortcutsProps) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleClickOutside = () => setActiveMenu(null);

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="relative group">
              <a
                href={shortcut.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div 
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-sm font-medium
                    ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}
                    transition-transform duration-300 ease-in-out
                    hover:scale-105`}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {shortcut.name}
                </div>
              </a>
              <div
                className={`absolute top-1 right-1 p-1 rounded-full cursor-pointer
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveMenu(activeMenu === index ? null : index);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
              {activeMenu === index && (
                <>
                  <div className="fixed inset-0 z-10" onClick={handleClickOutside} />
                  <div 
                    className={`absolute right-0 mt-1 py-2 w-32 rounded-lg shadow-lg z-20
                      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                      backdrop-blur-sm bg-opacity-95`}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                  >
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer
                        ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-black'}
                        hover:bg-opacity-10 hover:bg-purple-500`}
                      onClick={() => {
                        setIsAddModalOpen(true);
                        onEdit?.(shortcut, index);
                        setActiveMenu(null);
                      }}
                    >
                      Edit
                    </div>
                    <div
                      className={`px-4 py-2 text-sm cursor-pointer
                        ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-black'}
                        hover:bg-opacity-10 hover:bg-red-500`}
                      onClick={() => {
                        setDeleteIndex(index);
                        setActiveMenu(null);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className={`w-20 h-20 rounded-lg cursor-pointer flex items-center justify-center
              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
              transition-transform duration-300 ease-in-out
              hover:scale-105`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h3 className="text-lg font-medium mb-4">Delete Shortcut?</h3>
            <p className="mb-4">Are you sure you want to delete this shortcut?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => setDeleteIndex(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  if (deleteIndex !== null && onDelete) {
                    onDelete(deleteIndex);
                  }
                  setDeleteIndex(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

