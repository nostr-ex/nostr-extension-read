import React, { useState, useRef, useEffect } from 'react';
import { CogIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal'; // You'll need to create this component

interface ProfileProps {
  image: string;
  name?: string;
  onSignOut?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ image, name, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
    setIsMenuOpen(false);
  };

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-[100]" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-purple-500 hover:scale-105 transition-all duration-200 focus:outline-none bg-gray-800 shadow-lg hover:shadow-purple-500/20"
        >
          <img 
            src={image} 
            alt="Profile" 
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/48';
            }}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-gray-800/95 backdrop-blur-sm ring-1 ring-white/10 border border-gray-700 z-[101] transform transition-all duration-200 animate-slideIn">
            <div className="py-2">
              {name && (
                <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700/50">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-medium truncate text-white">{name}</p>
                </div>
              )}
              <a href="#" className="group flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition-all duration-200">
                <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
                View Profile
              </a>
              <span role='button'
                onClick={handleSettingsClick}
                className="group flex w-full items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition-all duration-200"
              >
                <CogIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
                Settings
              </span>
              <div className="border-t border-gray-700/50 my-1"></div>
              <span role='button'
                onClick={handleSignOut}
                className="group flex w-full items-center px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700/50 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-400/70 group-hover:text-red-400 transition-colors" />
                Sign Out
              </span>
            </div>
          </div>
        )}
      </div>

      {isSettingsModalOpen && (
        <Modal onClose={() => setIsSettingsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Nostr Profile Settings</h2>
            {/* Add your Nostr profile settings form here */}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Profile;
