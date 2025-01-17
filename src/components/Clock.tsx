import { useState, useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getGreeting } from '../utils/system';
import { useNostr } from '../hooks/useNostr';
import type { Settings } from '../types/settings';

interface ClockProps {
  show: boolean;
  settings: Settings;
}

export default function Clock({ show, settings }: ClockProps) {
  const [time, setTime] = useState(new Date());
  const { profile, isLoading } = useNostr();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayName = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (!profile) return settings?.nostr?.publicKey?.slice(0, 8) || 'User';
    return profile.name || 
           profile.displayName || 
           profile.nip05 || 
           settings?.nostr?.publicKey?.slice(0, 8) || 
           'User';
  }, [profile, settings?.nostr?.publicKey, isLoading]);

  if (!show) return null;

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
