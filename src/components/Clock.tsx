import { useState, useEffect } from 'react';

interface ClockProps {
  show: boolean;
  isDarkMode: boolean;
  profileName: string;
}

export default function Clock({ show, isDarkMode, profileName }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!show) return null;

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <div className="cursor-default select-none">
      <div className={`text-7xl font-light ${isDarkMode ? 'text-white' : 'text-black'} backdrop-blur-sm rounded-2xl p-4 hover:bg-black/10 transition-all duration-300`}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className={`text-xl text-center font-light ${isDarkMode ? 'text-white' : 'text-black'} mt-2`}>
        {getGreeting()}, {profileName || 'Guest'}!
      </div>
    </div>
  );
}
