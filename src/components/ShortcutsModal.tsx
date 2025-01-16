import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

interface ShortcutsModalProps {
  onClose: () => void;
  onAddShortcut: (shortcut: { name: string; url: string; icon: string }) => void;
  editingShortcut?: { name: string; url: string; icon: string };
}

export default function ShortcutsModal({ onClose, onAddShortcut, editingShortcut }: ShortcutsModalProps) {
  const [name, setName] = useState(editingShortcut?.name || '');
  const [url, setUrl] = useState(editingShortcut?.url || '');
  const [icon, setIcon] = useState(editingShortcut?.icon || '');

  useEffect(() => {
    if (editingShortcut) {
      setName(editingShortcut.name);
      setUrl(editingShortcut.url);
      setIcon(editingShortcut.icon);
    }
  }, [editingShortcut]);

  const fetchSiteInfo = async (url: string) => {
    try {
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      const domain = new URL(cleanUrl).hostname;
      
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      const response = await fetch(cleanUrl);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      let title = doc.title || domain;
      
      title = title.split('|')[0].split('-')[0].trim();

      setName(title);
      setIcon(iconUrl);
    } catch (error) {
      console.error('Error fetching site info:', error);
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        setName(domain);
        setIcon(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
      } catch (e) {
        console.error('Error parsing URL:', e);
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (newUrl && !editingShortcut) {
      fetchSiteInfo(newUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddShortcut({ name, url, icon });
    onClose();
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shortcut Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={url}
            onChange={handleUrlChange}
            required
          />
          <TextField
            margin="dense"
            label="Icon URL (optional)"
            type="url"
            fullWidth
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          {icon && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={icon} 
                alt="Site Icon Preview" 
                style={{ width: 32, height: 32, borderRadius: 4 }}
                onError={() => setIcon('')}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
