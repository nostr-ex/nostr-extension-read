import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

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
  const [url, setUrl] = useState(editingShortcut?.url || '');
  const [icon, setIcon] = useState(editingShortcut?.icon || '');

  useEffect(() => {
    if (editingShortcut) {
      setName(editingShortcut.name);
      setUrl(editingShortcut.url);
      setIcon(editingShortcut.icon);
    }
  }, [editingShortcut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, url, icon });
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {editingShortcut ? 'Save Changes' : 'Add Shortcut'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
