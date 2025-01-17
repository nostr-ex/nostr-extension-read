import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNostr } from '../hooks/useNostr';

interface ProfileProps {
  image: string;
  onSignOut?: () => void;
}

const Profile: React.FC<ProfileProps> = ({onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { profile, fetchProfile } = useNostr();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('Current profile:', profile); 

    fetchProfile();
  }, [fetchProfile, profile]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
    handleMenuClose();
  };

  const getInitials = (name: string = 'User') => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }} ref={menuRef}>
        <IconButton onClick={handleMenuClick}>
          {profile?.image ? (
            <Avatar 
              src={profile.image} 
              alt={profile.name || 'Profile'} 
              sx={{ width: 48, height: 48 }}
            />
          ) : (
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main'
              }}
            >
              {getInitials(profile?.name)}
            </Avatar>
          )}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem disabled>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" color="textSecondary">
                {profile?.name || 'Unknown User'}
              </Typography>
              {profile?.about && (
                <Typography variant="caption" color="textSecondary" noWrap>
                  {profile.about}
                </Typography>
              )}
            </Box>
          </MenuItem>
          {profile?.website && (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">Website</Typography>
              <Typography variant="body1" noWrap>{profile.website}</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={handleSettingsClick}>
            <SettingsIcon sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <LogoutIcon sx={{ mr: 1 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Box>

      <Dialog open={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
        <DialogTitle>Nostr Profile Settings</DialogTitle>
        <DialogContent>
          {/* Add your Nostr profile settings form here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSettingsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
