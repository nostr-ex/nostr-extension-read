import { FormEvent } from 'react';

interface SearchBoxProps {
  isDarkMode: boolean;
}

export default function SearchBox({ isDarkMode }: SearchBoxProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto mb-8">
      <div className="relative">
        <input
          type="search"
          name="q"
          className={`w-full px-6 py-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-200 text-black placeholder-gray-600 border-gray-300'} outline-none focus:border-blue-500 transition-all`}
          placeholder="Search Google..."
        />
        <button 
          type="submit"
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-lg transition-all duration-300 hover:bg-gray-400 hover:shadow-xl`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
