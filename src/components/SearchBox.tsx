import { FormEvent, useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

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

const STATIC_SUGGESTIONS = [
  'gmail',
  'google maps',
  'google translate',
  'youtube',
  'facebook',
  'weather',
  'netflix',
  'amazon',
  'twitter',
  'instagram',
  'linkedin',
  'github',
  'stackoverflow',
  'wikipedia',
  'news',
  'movies',
  'translate',
  'maps',
  'music',
  'shopping'
];

const getLocalSuggestions = (searchQuery: string): string[] => {
  if (!searchQuery) return [];
  const query = searchQuery.toLowerCase();
  return STATIC_SUGGESTIONS
    .filter(item => item.toLowerCase().includes(query))
    .concat([
      `${searchQuery} online`,
      `${searchQuery} tutorial`,
      `${searchQuery} guide`
    ])
    .slice(0, 8);
};

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const searchTypes = {
    all: 'https://www.google.com/search',
    images: 'https://www.google.com/images',
    news: 'https://news.google.com/search',
    videos: 'https://www.google.com/video'
  };

  useEffect(() => {
    // Load recent searches
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

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

  useEffect(() => {
    const getSuggestions = () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const localSuggestions = getLocalSuggestions(query);
      setSuggestions(localSuggestions);
      setShowSuggestions(true);
    };

    const debounce = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setQuery(''); // پاک کردن متن قبلی
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
    
    const newSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    
    setShowHistory(false);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSearch(query);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setRecentSearches([]);
      localStorage.removeItem('recentSearches');
      setShowHistory(false);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleHistoryItemClick = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
    setShowHistory(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
    handleSearch(suggestion, true); // true means open URL
    setShowSuggestions(false);
  };

  const removeHistoryItem = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const newSearches = recentSearches.filter((_, i) => i !== index);
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error removing history item:', error);
    }
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
        {(showHistory || showSuggestions) && (recentSearches.length > 0 || suggestions.length > 0) && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%', // Change from bottom: '100%' to top: '100%'
              left: 0,
              right: 0,
              mt: 1, // Change from mb: 1 to mt: 1
              width: '100%',
              borderRadius: 2,
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              bgcolor: (theme) => theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.9)
                : theme.palette.background.paper,
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'dark'
                ? alpha(theme.palette.divider, 0.1)
                : theme.palette.divider,
            }}
          >
            <List>
              {showHistory && recentSearches.length > 0 && (
                <>
                  <ListItem 
                    component="div"
                    disablePadding
                    dense
                    onClick={(e) => e.stopPropagation()}
                    sx={{ 
                      py: 1,
                      px: 2,
                      color: 'text.secondary',
                    }}
                  >
                    <ListItemIcon>
                      <HistoryIcon color="action" />
                    </ListItemIcon>
                    <ListItemText secondary="Recent Searches" />
                    <IconButton
                      onClick={(e) => clearHistory(e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      size="small"
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteSweepIcon />
                    </IconButton>
                  </ListItem>

                  <Divider />

                  {recentSearches.map((search, index) => (
                    <ListItem 
                      key={index}
                      component="button"
                      onClick={() => handleHistoryItemClick(search)}
                      sx={{
                        width: '100%',
                        textAlign: 'left',
                        py: 1,
                        bgcolor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.action.hover, 0.1)
                            : theme.palette.action.hover,
                        },
                      }}
                      secondaryAction={
                        <IconButton 
                          edge="end"
                          onClick={(e) => removeHistoryItem(index, e)}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText 
                        primary={search} 
                        sx={{
                          color: (theme) => theme.palette.text.primary,
                        }}
                      />
                    </ListItem>
                  ))}
                </>
              )}
              
              {showSuggestions && suggestions.map((suggestion, index) => (
                <ListItem 
                  key={index}
                  component="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    py: 1,
                    bgcolor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.action.hover, 0.1)
                        : theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon>
                    <TrendingUpIcon 
                      sx={{ 
                        color: (theme) => theme.palette.text.secondary 
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={suggestion}
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

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
            onFocus={() => {
              setShowHistory(true);
              if (query.length >= 2) {
                setShowSuggestions(true);
              }
            }}
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
