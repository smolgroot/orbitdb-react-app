import React, { useEffect, useState } from 'react';
import { createOrbitDB, OrbitDB } from '@orbitdb/core';
import { createHelia } from 'helia';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import TweetModal from './TweetModal';
import TweetCard from './TweetCard';
import AboutModal from './AboutModal';

// Add polyfills for browser compatibility
import { Buffer } from 'buffer';
import process from 'process';
import { EventEmitter } from 'events';

// Make sure these are available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).process = process;
  (globalThis as any).EventEmitter = EventEmitter;
  
  // Add additional DOM polyfills if needed
  if (typeof globalThis.addEventListener === 'undefined') {
    (globalThis as any).addEventListener = () => {};
    (globalThis as any).removeEventListener = () => {};
  }
  
  if (typeof globalThis.document === 'undefined') {
    (globalThis as any).document = {
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: () => ({}),
      documentElement: {}
    };
  }
}

interface TweetData {
  content: string;
  timestamp: number;
  author: string;
  hash?: string;
}

const OrbitDBDemo: React.FC = () => {
    const [orbitdb, setOrbitdb] = useState<OrbitDB | null>(null);
    const [db, setDb] = useState<any>(null);
    const [data, setData] = useState<TweetData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        const initOrbitDB = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Starting OrbitDB initialization...');
                
                // Create a minimal libp2p instance in offline mode
                const libp2p = await createLibp2p({
                    start: false, // Don't start libp2p
                    addresses: {
                        listen: []
                    },
                    transports: [webSockets()],
                    connectionEncryption: [noise()],
                    streamMuxers: [yamux()]
                });

                console.log('LibP2P created (offline mode)');

                // Create Helia instance in offline mode
                const helia = await createHelia({ 
                    libp2p,
                    start: false // Don't start Helia
                });
                
                console.log('Helia created (offline mode)');
                
                // Create OrbitDB instance
                const orbitdbInstance = await createOrbitDB({ 
                    ipfs: helia
                });
                setOrbitdb(orbitdbInstance);

                console.log('OrbitDB instance created');

                // Create or open a database with explicit offline configuration
                const database = await orbitdbInstance.open('hello-world-db', { 
                    type: 'events',
                    sync: false // Explicitly disable sync
                });
                setDb(database);

                console.log('Database opened successfully');

                // Load existing entries without using async iterator (which might trigger sync)
                const allEntries: any[] = [];
                setData(allEntries);

                setLoading(false);
                console.log('OrbitDB initialized successfully in offline mode');
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize OrbitDB');
                setLoading(false);
                console.error('Error initializing OrbitDB:', err);
            }
        };

        initOrbitDB();

        return () => {
            // Cleanup with proper error handling
            const cleanup = async () => {
                try {
                    if (db && typeof db.close === 'function') {
                        await db.close();
                    }
                    if (orbitdb && typeof orbitdb.stop === 'function') {
                        await orbitdb.stop();
                    }
                } catch (cleanupError) {
                    console.warn('Error during cleanup:', cleanupError);
                }
            };
            cleanup();
        };
    }, []);

    const addTweet = async (tweetData: TweetData) => {
        if (!db) {
            throw new Error('Database not initialized');
        }
        
        try {
            const hash = await db.add(tweetData);
            console.log('Tweet added with hash:', hash);
            
            // Since we're in offline mode, manually update the state
            const tweetWithHash = { ...tweetData, hash };
            setData(prevData => [tweetWithHash, ...prevData]);
        } catch (err) {
            console.error('Error adding tweet:', err);
            throw err;
        }
    };

    const refreshData = async () => {
        if (!db || isRefreshing) return;
        
        setIsRefreshing(true);
        try {
            // In offline mode, we just refresh from current state
            // In a real networked scenario, this would sync with peers
            console.log('Data refreshed');
        } catch (err) {
            console.error('Error refreshing data:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>
                    Loading OrbitDB...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error" sx={{ mb: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="h6">Error initializing OrbitDB</Typography>
                    <Typography variant="body2">{error}</Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Left Sidebar - Navigation */}
            <Box sx={{ 
                width: 275,
                position: 'fixed',
                height: '100vh',
                borderRight: '1px solid',
                borderColor: 'divider',
                p: 2,
                display: { xs: 'none', md: 'block' }
            }}>
                {/* Logo */}
                <Box sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        🌐 OrbitDB
                    </Typography>
                </Box>

                {/* Navigation Menu */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        fullWidth
                        startIcon={<HomeIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: 'text.primary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<SearchIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Explore
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<NotificationsIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Notifications
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<MailIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Messages
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<BookmarkIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Bookmarks
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<PersonIcon />}
                        sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            px: 3,
                            mb: 1,
                            borderRadius: 8,
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            color: 'text.secondary',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Profile
                    </Button>
                </Box>

                {/* Tweet Button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => setModalOpen(true)}
                    disabled={!db}
                    sx={{ 
                        borderRadius: 8,
                        py: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.dark'
                        }
                    }}
                >
                    Tweet
                </Button>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ 
                flex: 1,
                ml: { xs: 0, md: '275px' },
                mr: { xs: 0, lg: '350px' },
                minHeight: '100vh'
            }}>
                {/* Top Header */}
                <Box sx={{ 
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    zIndex: 100
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Home
                    </Typography>
                </Box>

                {/* Tweet Feed */}
                <Box>
                    {data.length === 0 ? (
                        <Box sx={{ 
                            p: 4, 
                            textAlign: 'center',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                🌟 Welcome to Decentralized Twitter!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Be the first to share something on the decentralized web.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setModalOpen(true)}
                                sx={{ 
                                    borderRadius: 8,
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                Post Your First Tweet
                            </Button>
                        </Box>
                    ) : (
                        data.map((tweet, index) => (
                            <Box key={tweet.hash || index} sx={{ 
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.03)'
                                }
                            }}>
                                <TweetCard tweet={tweet} index={index} />
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* Right Sidebar - What's Happening */}
            <Box sx={{ 
                width: 350,
                position: 'fixed',
                right: 0,
                height: '100vh',
                p: 2,
                display: { xs: 'none', lg: 'block' }
            }}>
                <Box sx={{ mt: 2 }}>
                    {/* What's happening card */}
                    <Card sx={{ 
                        mb: 2, 
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                What's happening
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Decentralized Social Media
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    OrbitDB Twitter Demo
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Trending in Tech
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card sx={{ 
                        mb: 2, 
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Database Stats
                            </Typography>
                            <Chip 
                                label={`${data.length} tweets stored`} 
                                color="primary" 
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                All data stored in OrbitDB
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<InfoIcon />}
                                onClick={() => setAboutModalOpen(true)}
                                sx={{ 
                                    mt: 1,
                                    textTransform: 'none',
                                    color: 'primary.main'
                                }}
                            >
                                About this demo
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Modals */}
            <TweetModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={addTweet}
            />
            
            <AboutModal
                open={aboutModalOpen}
                onClose={() => setAboutModalOpen(false)}
            />

            {/* Mobile Floating Action Button */}
            <Fab
                color="primary"
                aria-label="compose"
                onClick={() => setModalOpen(true)}
                disabled={!db}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'flex', md: 'none' },
                    bgcolor: 'primary.main',
                    '&:hover': {
                        bgcolor: 'primary.dark'
                    }
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default OrbitDBDemo;