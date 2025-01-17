import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    Switch,
    TextField,
    Typography,
    Stack,
    Paper,
    Tooltip,
    Avatar,
    Chip,
    LinearProgress,
    CircularProgress,
    Grid,
    Alert,
} from '@mui/material';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { useNostr } from '../hooks/useNostr';
import {
    Brightness4,
    Brightness7,
    Computer,
    Security,
    Notifications,
    Dashboard,
    KeyOutlined,
    Settings as SettingsIcon,
    Close as CloseIcon,
    Save as SaveIcon,
} from '@mui/icons-material';

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (updates: Partial<Settings>) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, settings, onSettingsChange }) => {
    const [activeTab, setActiveTab] = React.useState(0);
    const { fetchProfile, isLoading, error, profile } = useNostr();
    const previousPublicKey = React.useRef(settings?.nostr?.publicKey);

    // Ensure settings is properly initialized with defaults
    const safeSettings: Settings = {
        ...DEFAULT_SETTINGS,
        ...settings,
        ui: { ...DEFAULT_SETTINGS.ui, ...settings?.ui },
        nostr: { ...DEFAULT_SETTINGS.nostr, ...settings?.nostr },
        security: { ...DEFAULT_SETTINGS.security, ...settings?.security },
        app: { ...DEFAULT_SETTINGS.app, ...settings?.app }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSettingChange = <T extends keyof Settings>(section: T, updates: Partial<Settings[T]>) => {
        onSettingsChange({
            [section]: {
                ...safeSettings[section],
                ...updates
            }
        });
    };

    const handleNostrSettingsChange = async (updates: Partial<Settings['nostr']>) => {
        handleSettingChange('nostr', updates);
        
        // Only fetch if publicKey actually changed
        if (updates.publicKey && updates.publicKey !== previousPublicKey.current) {
            previousPublicKey.current = updates.publicKey;
            await fetchProfile(true); // Force refresh
        }
    };

    const handleSave = async () => {
        try {
            // اگر کلید عمومی تغییر کرده باشد، پروفایل را به‌روز می‌کنیم
            if (safeSettings.nostr.publicKey !== previousPublicKey.current) {
                await fetchProfile(true); // force update
            }
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '85vh',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                pb: 0
            }}>
                <DialogTitle sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    pb: 2
                }}>
                    <SettingsIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h5" component="span" sx={{ fontWeight: 500 }}>
                        Settings
                    </Typography>
                </DialogTitle>
                
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                        px: 2,
                        '& .MuiTab-root': {
                            minHeight: 48,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                        }
                    }}
                >
                    <Tab icon={<Dashboard sx={{ mb: 0.5 }} />} label="UI & Display" />
                    <Tab icon={<KeyOutlined sx={{ mb: 0.5 }} />} label="Nostr" />
                    <Tab icon={<Security sx={{ mb: 0.5 }} />} label="Security" />
                    <Tab icon={<Notifications sx={{ mb: 0.5 }} />} label="App" />
                </Tabs>
            </Box>

            {isLoading && <LinearProgress />}

            <DialogContent sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                px: 3,
                py: 2
            }}>
                <TabPanel value={activeTab} index={0}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Brightness4 color="primary" /> Theme & Layout
                            </Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {['light', 'dark', 'system'].map((theme) => (
                                        <Tooltip key={theme} title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}>
                                            <Paper
                                                elevation={safeSettings.ui.theme === theme ? 4 : 1}
                                                onClick={() => handleSettingChange('ui', { theme: theme as 'light' | 'dark' | 'system' })}
                                                sx={{
                                                    p: 2,
                                                    flex: 1,
                                                    cursor: 'pointer',
                                                    bgcolor: safeSettings.ui.theme === theme ? 'primary.main' : 'background.paper',
                                                    color: safeSettings.ui.theme === theme ? 'primary.contrastText' : 'text.primary',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center',
                                                    '&:hover': {
                                                        bgcolor: safeSettings.ui.theme === theme ? 'primary.dark' : 'action.hover'
                                                    }
                                                }}
                                            >
                                                {theme === 'light' && <Brightness7 />}
                                                {theme === 'dark' && <Brightness4 />}
                                                {theme === 'system' && <Computer />}
                                                <Typography sx={{ mt: 1 }}>
                                                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                                </Typography>
                                            </Paper>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Dashboard color="primary" /> Display Elements
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { key: 'showClock', label: 'Clock', icon: '🕒' },
                                    { key: 'showLogo', label: 'Logo', icon: '🎨' },
                                    { key: 'showSearchBox', label: 'Search', icon: '🔍' },
                                    { key: 'showShortcuts', label: 'Shortcuts', icon: '⚡' },
                                    { key: 'showProfile', label: 'Profile', icon: '👤' },
                                    { key: 'compactMode', label: 'Compact Mode', icon: '📏' },
                                ].map(({ key, label, icon }) => (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body1" component="span" sx={{ fontSize: '1.2rem' }}>
                                                    {icon}
                                                </Typography>
                                                <Typography>{label}</Typography>
                                            </Box>
                                            <Switch
                                                checked={safeSettings.ui[key as keyof typeof safeSettings.ui] as boolean}
                                                onChange={(e) => handleSettingChange('ui', { [key]: e.target.checked })}
                                            />
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Stack>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <KeyOutlined color="primary" /> Nostr Identity
                            </Typography>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {profile && (
                                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={profile.image}
                                        sx={{ width: 56, height: 56 }}
                                    >
                                        {profile.name?.charAt(0) || '?'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">
                                            {profile.name || profile.displayName || 'Unknown'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {profile.about}
                                        </Typography>
                                        <Chip 
                                            size="small" 
                                            label={`${safeSettings.nostr.publicKey.slice(0, 8)}...${safeSettings.nostr.publicKey.slice(-8)}`}
                                            color="primary" 
                                            variant="outlined"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Box>
                            )}
                            <TextField
                                fullWidth
                                label="Public Key"
                                value={safeSettings.nostr.publicKey}
                                onChange={(e) => handleNostrSettingsChange({ publicKey: e.target.value })}
                                margin="normal"
                                disabled={isLoading}
                                helperText={isLoading ? "Fetching profile..." : "Enter your Nostr public key"}
                                InputProps={{
                                    readOnly: isLoading,
                                    endAdornment: isLoading && (
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                    )
                                }}
                            />
                            {/* Continue with other Nostr settings... */}
                        </Paper>
                    </Stack>
                </TabPanel>

                {/* ... rest of the tabs ... */}
            </DialogContent>

            <DialogActions sx={{ 
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                px: 3,
                py: 2,
                gap: 1
            }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                >
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                    {isLoading ? "Updating..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TabPanel: React.FC<{ children?: React.ReactNode; value: number; index: number }> = ({ children, value, index }) => {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                pt: 3
            }}
        >
            {value === index && children}
        </Box>
    );
};

export default SettingsDialog;

