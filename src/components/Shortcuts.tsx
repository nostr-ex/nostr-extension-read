import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Grid, IconButton, Menu, MenuItem, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

interface ShortcutsProps {
  isDarkMode: boolean;
  shortcuts?: { name: string; url: string; icon: string }[];
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  onEdit?: (shortcut: { name: string; url: string; icon: string }, index: number) => void;
  onDelete?: (index: number) => void;
}

export default function Shortcuts({ isDarkMode, shortcuts = [], setIsAddModalOpen, onEdit, onDelete }: ShortcutsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuIndex(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null && onDelete) {
      onDelete(deleteIndex);
    }
    setDeleteIndex(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
        {shortcuts.map((shortcut, index) => (
          <Grid item key={index}>
            <Box 
              sx={{ 
                width: { xs: 80, sm: 100 }, 
                height: { xs: 90, sm: 110 }, 
                bgcolor: 'background.paper',
                color: 'text.primary',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1,
                borderRadius: 2,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  bgcolor: 'action.hover',
                  boxShadow: 3,
                }
              }}
              onClick={() => window.open(shortcut.url, '_blank')}
            >
              {shortcut.icon ? (
                <img 
                  src={shortcut.icon} 
                  alt={shortcut.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Box 
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {shortcut.name.charAt(0).toUpperCase()}
                </Box>
              )}
              <Typography 
                noWrap 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: 1,
                  width: '100%',
                  textAlign: 'center',
                  opacity: 0.9
                }}
              >
                {shortcut.name}
              </Typography>
              <IconButton
                size="small"
                aria-label="more"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClick(e, index);
                }}
                sx={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4,
                  opacity: 0.6,
                  '&:hover': { opacity: 1 }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
        <Grid item>
          <Box 
            sx={{ 
              width: { xs: 80, sm: 100 }, 
              height: { xs: 90, sm: 110 }, 
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                boxShadow: 3,
              }
            }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <AddIcon sx={{ fontSize: 30, opacity: 0.7 }} />
            <Typography sx={{ mt: 1, fontSize: '0.75rem', opacity: 0.7 }}>Add New</Typography>
          </Box>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (activeMenuIndex !== null && onEdit) {
            onEdit(shortcuts[activeMenuIndex], activeMenuIndex);
          }
          handleMenuClose();
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          setDeleteIndex(activeMenuIndex);
          handleMenuClose();
        }}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
      >
        <DialogTitle>Delete Shortcut?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this shortcut?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

