import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getGreeting } from '../utils/system';
import type { Settings } from '../types/settings';

interface ClockProps {
  show: boolean;
  settings: Settings;
}

export default function Clock({ show, settings }: ClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!show) return null;

  // Directly use settings.userName instead of local state
  const displayName = settings.userName || 'User';

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 300 }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1, opacity: 0.8 }}>
        {getGreeting()}, {displayName}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.6 }}>
        {time.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Typography>
    </Box>
  );
}
