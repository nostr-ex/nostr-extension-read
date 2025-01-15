export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-sm">
          Built with ❤️ by the Nostr community
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/nostr-ex/nostr-extension" className="text-gray-400 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#docs" className="text-gray-400 hover:text-white transition-colors">
            Docs
          </a>
          <a href="#support" className="text-gray-400 hover:text-white transition-colors">
            Support
          </a>
        </div>
        <div className="text-gray-500 text-sm">
          Version 0.0.2
        </div>
      </div>
    </footer>
  );
}
