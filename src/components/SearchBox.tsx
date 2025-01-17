import { FormEvent, useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MicIcon from '@mui/icons-material/Mic';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';


interface SpeechRecognitionEvent {
  results: {
    item(index: number): SpeechRecognitionResult;
    length: number;
    [index: number]: SpeechRecognitionResult;
  }
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}


export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);

  const searchTypes = {
    all: 'https://www.google.com/search',
    images: 'https://www.google.com/images',
    news: 'https://news.google.com/search',
    videos: 'https://www.google.com/video'
  };

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setQuery(''); 
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setQuery(transcript);
      };

      recognition.start();
    }
  };

  const handleSearch = (searchQuery: string, openUrl = true) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    
    if (openUrl) {
      const baseUrl = searchTypes[searchType as keyof typeof searchTypes];
      window.open(`${baseUrl}?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSearch(query);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      <Tabs
        value={searchType}
        onChange={(_, newValue) => setSearchType(newValue)}
        sx={{ mb: 2 }}
        centered
      >
        <Tab icon={<SearchIcon />} label="All" value="all" />
        <Tab icon={<ImageSearchIcon />} label="Images" value="images" />
        <Tab icon={<ArticleIcon />} label="News" value="news" />
        <Tab icon={<VideoLibraryIcon />} label="Videos" value="videos" />
      </Tabs>

      <Box sx={{ position: 'relative' }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '48px',
            borderRadius: '24px',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.divider, 0.1),
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            '&:hover, &:focus-within': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <SearchIcon sx={{ ml: 2, color: 'text.secondary' }} />
          <InputBase
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: '1rem',
            }}
            placeholder="Search Google or type a URL"
            inputProps={{ 'aria-label': 'search google' }}
          />
          
          {query && (
            <IconButton onClick={() => setQuery('')}>
              <ClearIcon />
            </IconButton>
          )}

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <IconButton 
            onClick={handleVoiceSearch}
            sx={{ 
              color: isListening ? 'error.main' : 'primary.main',
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            <MicIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}
