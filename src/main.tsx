import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import App from './App';

function Root() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const settings = localStorage.getItem('nostrex-settings');
      return settings ? JSON.parse(settings).isDarkMode : true; // default to dark mode
    } catch {
      return true;
    }
  });

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
     }
  });

  // Apply dark mode class to body
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
