import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Alert,
    Paper,
    Snackbar
} from '@mui/material';
import {
    Close as CloseIcon,
    ContentCopy as CopyIcon,
    Share as ShareIcon,
    Storage as StorageIcon,
    Settings as SettingsIcon,
    Info as InfoIcon
} from '@mui/icons-material';

interface DatabaseInfoModalProps {
    open: boolean;
    onClose: () => void;
    db: any;
    orbitdb: any;
    tweetCount: number;
}

const DatabaseInfoModal: React.FC<DatabaseInfoModalProps> = ({ 
    open, 
    onClose, 
    db, 
    orbitdb, 
    tweetCount 
}) => {
    const [copySuccess, setCopySuccess] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(`${type} copied to clipboard!`);
            setSnackbarOpen(true);
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            setCopySuccess('Failed to copy to clipboard');
            setSnackbarOpen(true);
            console.error('Failed to copy:', err);
        });
    };

    const getDatabaseInfo = () => {
        if (!db || !orbitdb) return null;
        
        return {
            address: db.address,
            type: db.type,
            name: db.name,
            identity: orbitdb.identity?.id || 'Unknown',
            peers: db.peers?.length || 0,
            replicationStatus: db.replicationStatus || 'offline'
        };
    };

    const dbInfo = getDatabaseInfo();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'background.paper',
                    backgroundImage: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StorageIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Database Information
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {dbInfo ? (
                    <Box>
                        {/* Database Stats */}
                        <Paper sx={{ 
                            p: 2, 
                            mb: 3, 
                            bgcolor: 'rgba(29, 155, 240, 0.1)',
                            border: '1px solid',
                            borderColor: 'primary.main'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                📊 Database Stats
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip 
                                    label={`${tweetCount} Tweets`} 
                                    color="primary" 
                                    variant="filled"
                                />
                                <Chip 
                                    label={`Type: ${dbInfo.type}`} 
                                    color="secondary" 
                                    variant="outlined"
                                />
                                <Chip 
                                    label={`Peers: ${dbInfo.peers}`} 
                                    color="info" 
                                    variant="outlined"
                                />
                                <Chip 
                                    label={`Status: ${dbInfo.replicationStatus}`} 
                                    color={dbInfo.replicationStatus === 'online' ? 'success' : 'warning'} 
                                    variant="outlined"
                                />
                            </Box>
                        </Paper>

                        {/* Shareable Database Address */}
                        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ShareIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    🌐 Shareable Database Address
                                </Typography>
                            </Box>
                            
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    Share this address with others to let them connect to the same database and see your tweets!
                                </Typography>
                            </Alert>

                            <Box sx={{ 
                                bgcolor: 'background.paper', 
                                p: 2, 
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                mb: 2
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        color: 'primary.main',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {dbInfo.address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Copy database address">
                                    <Button
                                        startIcon={<CopyIcon />}
                                        onClick={() => copyToClipboard(dbInfo.address, 'Database address')}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Copy Address
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Copy shareable link">
                                    <Button
                                        startIcon={<ShareIcon />}
                                        onClick={() => copyToClipboard(`${window.location.origin}?db=${encodeURIComponent(dbInfo.address)}`, 'Shareable link')}
                                        variant="contained"
                                        size="small"
                                    >
                                        Copy Shareable Link
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Paper>

                        {/* Technical Details */}
                        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <SettingsIcon color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    🔧 Technical Details
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Database Name:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {dbInfo.name}
                                    </Typography>
                                </Box>
                                
                                <Divider />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Identity ID:
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        fontFamily: 'monospace',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {dbInfo.identity}
                                    </Typography>
                                </Box>
                                
                                <Divider />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Database Type:
                                    </Typography>
                                    <Typography variant="body2">
                                        {dbInfo.type}
                                    </Typography>
                                </Box>
                                
                                <Divider />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Connected Peers:
                                    </Typography>
                                    <Typography variant="body2">
                                        {dbInfo.peers}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* How to Use */}
                        <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💡 How to share this database:
                            </Typography>
                            <Typography variant="body2">
                                1. Copy the database address or shareable link above<br/>
                                2. Send it to your friends<br/>
                                3. They can open this app and use the address to connect to the same database<br/>
                                4. All tweets will be synchronized across all connected peers!
                            </Typography>
                        </Alert>
                    </Box>
                ) : (
                    <Alert severity="error">
                        <Typography>Database information is not available</Typography>
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={copySuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Dialog>
    );
};

export default DatabaseInfoModal;
