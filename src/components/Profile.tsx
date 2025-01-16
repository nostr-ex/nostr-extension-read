import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
 import LogoutIcon from '@mui/icons-material/Logout';
 
interface ProfileProps {
  image: string;
  name?: string;
  onSignOut?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ image, name, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }} ref={menuRef}>
        <IconButton onClick={handleMenuClick}>
          <Avatar src={image} alt="Profile" sx={{ width: 48, height: 48 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          {name && (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">Signed in as</Typography>
              <Typography variant="body1" noWrap>{name}</Typography>
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
