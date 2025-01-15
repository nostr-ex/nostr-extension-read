import LoginButton from './LoginButton';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src="/nostrex.svg"
          className="w-12 h-12 transition-transform hover:scale-110" 
          alt="NostrEx logo" 
        />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Nostr Extension
        </h1>
      </div>
      <LoginButton />
    </header>
  );
}