interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNip07Login: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onNip07Login, 
  isLoading = false,
  error 
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm
                    flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Connect with Nostr
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={onNip07Login}
            disabled={isLoading}
            className="w-full p-4 bg-purple-600 hover:bg-purple-700
                       rounded-lg transition-all duration-300
                       flex items-center justify-center gap-2
                       disabled:opacity-50"
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>Connect with Extension</span>
                <span className="text-xs opacity-75">(NIP-07)</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full p-3 bg-gray-700 hover:bg-gray-600
                       rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
