import { useState, useEffect } from 'react';

interface ClockProps {
  show: boolean;
  isDarkMode: boolean;
}

export default function Clock({ show, isDarkMode }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="cursor-default select-none">
      <div className={`text-7xl font-light ${isDarkMode ? 'text-white' : 'text-black'} backdrop-blur-sm rounded-2xl p-4 hover:bg-black/10 transition-all duration-300`}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
