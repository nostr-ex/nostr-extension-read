import {
  Box,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  IconButton,
  TextField,
  Button,
  Modal,
} from '@mui/material';

// Icons
import {
  Palette,
  Language,
  Security,
  Storage,
  Speed,
  CloudSync,
  Delete,
  RestartAlt,
  Close,
  ViewModule,
  Timer,
  SearchRounded,
  AccountCircle,
  Image,
  VpnKey,
} from '@mui/icons-material';

import type { Settings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <Paper sx={{ mb: 3, p: 0 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        {title}
      </Typography>
      <List disablePadding>
        {children}
      </List>
    </Paper>
  );
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (updates: Partial<Settings>) => void;
}

const ScrollContent = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden',
  flex: 1,
  '&::-webkit-scrollbar': {
    width: '12px',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
    borderRadius: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '6px',
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.3)'
        : 'rgba(0, 0, 0, 0.3)',
    },
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
}));

export default function Settings({ open, onClose, settings, onSettingsChange }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: keyof Settings, value: Settings[keyof Settings]) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update theme handling
  const handleThemeChange = (value: Settings['theme']) => {
    handleChange('theme', value);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Settings
          </Typography>
          <IconButton onClick={() => onClose()}>
            <Close />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <ScrollContent sx={{ p: 3 }}>
          <SettingSection title="Appearance">
            <ListItem>
              <ListItemIcon><Palette /></ListItemIcon>
              <ListItemText 
                primary="Theme" 
                secondary={
                  `Currently using ${
                    localSettings.theme === 'system' 
                      ? 'system theme' 
                      : `${localSettings.theme} mode`
                  }`
                }
              />
              <ListItemSecondaryAction>
                <TextField
                  select
                  size="small"
                  value={localSettings.theme}
                  onChange={(e) => handleThemeChange(e.target.value as Settings['theme'])}
                  SelectProps={{ native: true }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </TextField>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><Language /></ListItemIcon>
              <ListItemText primary="Language" secondary="Select your language" />
              <ListItemSecondaryAction>
                <TextField
                  select
                  size="small"
                  value={localSettings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="en">English</option>
                 </TextField>
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>

          <SettingSection title="Personal">
            <ListItem>
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText 
                primary="Your Name" 
                secondary="Enter your name for greetings"
              />
              <ListItemSecondaryAction sx={{ width: 200 }}>
                <TextField
                  size="small"
                  value={localSettings.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                  placeholder="Enter your name"
                  fullWidth
                />
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>

          <SettingSection title="Privacy & Security">
            <ListItem>
              <ListItemIcon><Security /></ListItemIcon>
              <ListItemText 
                primary="Privacy Mode" 
                secondary="Enhanced privacy protection"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.privacyMode}
                  onChange={(e) => handleChange('privacyMode', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText 
                primary="Clear All Data" 
                secondary="Remove all stored data and reset settings"
                primaryTypographyProps={{ color: 'error' }}
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => {
                    localStorage.clear();
                    onSettingsChange(DEFAULT_SETTINGS);
                  }}
                >
                  Clear
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>

          <SettingSection title="Sync & Performance">
            <ListItem>
              <ListItemIcon><CloudSync /></ListItemIcon>
              <ListItemText 
                primary="Auto Sync" 
                secondary="Keep data synced across devices"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.autoSync}
                  onChange={(e) => handleChange('autoSync', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><Speed /></ListItemIcon>
              <ListItemText 
                primary="Compact Mode" 
                secondary="Optimize for better performance"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.compactMode}
                  onChange={(e) => handleChange('compactMode', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><Storage /></ListItemIcon>
              <ListItemText 
                primary="Storage" 
                secondary="Manage app data and cache"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RestartAlt />}
                  onClick={() => {/* Add cache clear logic */}}
                >
                  Clear Cache
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>

          <SettingSection title="UI Elements">
            <ListItem>
              <ListItemIcon><Timer /></ListItemIcon>
              <ListItemText 
                primary="Clock" 
                secondary="Show time and date"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.showClock}
                  onChange={(e) => handleChange('showClock', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><Image /></ListItemIcon>
              <ListItemText 
                primary="Logo" 
                secondary="Show application logo"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.showLogo}
                  onChange={(e) => handleChange('showLogo', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><SearchRounded /></ListItemIcon>
              <ListItemText 
                primary="Search Box" 
                secondary="Show search functionality"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.showSearchBox}
                  onChange={(e) => handleChange('showSearchBox', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><ViewModule /></ListItemIcon>
              <ListItemText 
                primary="Shortcuts" 
                secondary="Show quick access shortcuts"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.showShortcuts}
                  onChange={(e) => handleChange('showShortcuts', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><AccountCircle /></ListItemIcon>
              <ListItemText 
                primary="Profile" 
                secondary="Show user profile"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={localSettings.showProfile}
                  onChange={(e) => handleChange('showProfile', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>

          <SettingSection title="Nostr Keys">
            <ListItem>
              <ListItemIcon><VpnKey /></ListItemIcon>
              <ListItemText 
                primary="Public Key" 
                secondary="Your Nostr public key"
              />
              <ListItemSecondaryAction sx={{ width: 250 }}>
                <TextField
                  size="small"
                  value={localSettings.nostrPublicKey}
                  onChange={(e) => handleChange('nostrPublicKey', e.target.value)}
                  placeholder="npub..."
                  fullWidth
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon><VpnKey color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Private Key" 
                secondary="Keep this secret!"
                primaryTypographyProps={{ color: 'warning.main' }}
              />
              <ListItemSecondaryAction sx={{ width: 250 }}>
                <TextField
                  type="password"
                  size="small"
                  value={localSettings.nostrPrivateKey}
                  onChange={(e) => handleChange('nostrPrivateKey', e.target.value)}
                  placeholder="nsec..."
                  fullWidth
                />
              </ListItemSecondaryAction>
            </ListItem>
          </SettingSection>
        </ScrollContent>

        {/* Fixed Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setLocalSettings(settings);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSettingsChange(localSettings);
              onClose();
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

