import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: Shortcut) => void;
  editingShortcut?: Shortcut;
  isDarkMode: boolean;
}

export default function AddModal({ isOpen, onClose, onSave, editingShortcut }: AddModalProps) {
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
    onSave({ name, url: fullUrl, icon });
    setName('');
    setUrl('');
    setIcon('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="URL"
            value={url}
            onChange={handleUrlChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            fullWidth
            margin="normal"
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
          <DialogActions>
            <Button onClick={onClose} startIcon={<CancelIcon />} color="secondary">
              Cancel
            </Button>
            <Button type="submit" startIcon={<SaveIcon />} color="primary">
              {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
