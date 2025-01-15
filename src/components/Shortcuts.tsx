interface ShortcutsProps {
  isDarkMode: boolean;
  shortcuts?: { name: string; url: string }[]; // Make this optional
}

export default function Shortcuts({ isDarkMode, shortcuts = [] }: ShortcutsProps) { // Provide a default value
  return (
    <div className="grid grid-cols-2 gap-4">
      {shortcuts.map((shortcut, index) => (
        <a
          key={index}
          href={shortcut.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} transition-all duration-300 hover:bg-blue-500 hover:text-white`}
        >
          {shortcut.name}
        </a>
      ))}
    </div>
  );
}
