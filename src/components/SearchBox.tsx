import { FormEvent } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
          className={`w-full px-6 py-4 rounded-full ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-200 text-black placeholder-gray-600 border-gray-300'} outline-none focus:border-purple-500 transition-all`}
          placeholder="Search Google..."
        />
<button 
  type="submit"

  className="absolute right-[8px] top-1/2 -translate-y-1/2  bg-purple-500 hover:bg-purple-700 rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-purple-500/30" 

>
<MagnifyingGlassIcon className="h-5 w-5 text-white" />

</button>

      </div>
    </form>
  );
}
