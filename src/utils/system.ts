export const getSystemUsername = (): string => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const savedName = localStorage.getItem('username');
    if (savedName) return savedName;

    try {
      // Try to get username from browser
      const userAgent = window.navigator.userAgent;
      if (userAgent.includes('Windows NT')) {
        // Get username from browser data
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const defaultName = timeZone.split('/')[1]?.replace('_', ' ') || 'User';
        
        // Save to localStorage for future use
        localStorage.setItem('username', defaultName);
        return defaultName;
      }
    } catch (error) {
      console.error('Error getting username:', error);
    }
  }
  
  return 'User';
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};
