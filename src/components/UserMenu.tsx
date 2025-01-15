import { useState } from 'react';

interface UserMenuProps {
  user: { pubkey: string };
  metadata: {
    image?: string;
    name?: string;
  };
  onLogout: () => void;
}

export default function UserMenu({ user, metadata, onLogout }: UserMenuProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 bg-gray-800 rounded-full p-2 pr-4
                   hover:bg-gray-700 transition-colors duration-300"
      >
        <img 
          src={metadata?.image || '/default-avatar.png'}
          alt={metadata?.name || 'User'}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500"
        />
        <span className="text-sm font-medium">
          {metadata?.name || user.pubkey.slice(0, 8)}...
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl
                        shadow-lg ring-1 ring-black ring-opacity-5
                        animate-fadeIn">
          <div className="py-1">
            <MenuItem icon="⚙️" text="Settings" onClick={() => {}} />
            <MenuItem icon="✏️" text="Edit Profile" onClick={() => {}} />
            <MenuItem icon="🚪" text="Logout" onClick={onLogout} danger />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, text, onClick, danger = false }: {
  icon: string;
  text: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-sm text-left
                  flex items-center gap-2 hover:bg-gray-700
                  ${danger ? 'text-red-400' : 'text-gray-200'}`}
    >
      {icon} {text}
    </button>
  );
}
