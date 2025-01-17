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
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface ShortcutsModalProps {
  onClose: () => void;
  onAddShortcut: (shortcut: { name: string; url: string; icon: string }) => void;
  editingShortcut?: { name: string; url: string; icon: string };
}

export default function ShortcutsModal({ onClose, onAddShortcut, editingShortcut }: ShortcutsModalProps) {
  const [name, setName] = useState(editingShortcut?.name || '');
  const [url, setUrl] = useState(editingShortcut?.url ? new URL(editingShortcut.url).href : 'https://');
  const [icon, setIcon] = useState(editingShortcut?.icon || '');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (editingShortcut) {
      const urlObj = new URL(editingShortcut.url);
      setName(editingShortcut.name);
      setUrl(urlObj.href);
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
      setIcon('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(setTimeout(() => {
      fetchSiteInfo(e.target.value);
    }, 1000));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    if (!icon) {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name.charAt(0).toUpperCase(), canvas.width / 2, canvas.height / 2);
        setIcon(canvas.toDataURL());
      }
    }
    onAddShortcut({ name, url: fullUrl, icon });
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
            label="Shortcut Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <Button onClick={onClose} startIcon={<CancelIcon />} color="secondary">
            Cancel
          </Button>
          <Button type="submit" startIcon={<SaveIcon />} variant="contained" color="primary">
            {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
