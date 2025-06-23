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
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  Paper
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
    const [mobileNavValue, setMobileNavValue] = useState<number>(0);

    // Local storage backup functions
    const saveToLocalStorage = (tweets: TweetData[]) => {
        try {
            localStorage.setItem('orbitdb-tweets', JSON.stringify(tweets));
            console.log('Tweets backed up to localStorage');
        } catch (err) {
            console.warn('Could not save to localStorage:', err);
        }
    };

    const loadFromLocalStorage = (): TweetData[] => {
        try {
            const stored = localStorage.getItem('orbitdb-tweets');
            if (stored) {
                const tweets = JSON.parse(stored);
                console.log(`Loaded ${tweets.length} tweets from localStorage backup`);
                return tweets;
            }
        } catch (err) {
            console.warn('Could not load from localStorage:', err);
        }
        return [];
    };

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

                // Load existing entries from the database and localStorage
                try {
                    const allEntries: TweetData[] = [];
                    
                    // First, try to load from localStorage as backup
                    const localStorageData = loadFromLocalStorage();
                    
                    // Get all entries from the database
                    for await (const entry of database.iterator()) {
                        console.log('Loaded entry:', entry);
                        if (entry.value && typeof entry.value === 'object') {
                            const tweetData: TweetData = {
                                content: entry.value.content || '',
                                timestamp: entry.value.timestamp || Date.now(),
                                author: entry.value.author || 'Anonymous',
                                hash: entry.hash
                            };
                            allEntries.unshift(tweetData); // Add to beginning to show newest first
                        }
                    }
                    
                    // If no data from OrbitDB, use localStorage backup
                    const finalData = allEntries.length > 0 ? allEntries : localStorageData;
                    
                    console.log(`Loaded ${finalData.length} existing tweets (${allEntries.length} from OrbitDB, ${localStorageData.length} from localStorage backup)`);
                    setData(finalData);
                    
                    // Update localStorage with current data
                    if (finalData.length > 0) {
                        saveToLocalStorage(finalData);
                    }
                } catch (iteratorError) {
                    console.warn('Could not iterate over existing entries:', iteratorError);
                    // Fallback to localStorage
                    const localStorageData = loadFromLocalStorage();
                    setData(localStorageData);
                    console.log(`Fallback: loaded ${localStorageData.length} tweets from localStorage`);
                }

                // Also load data from localStorage as a backup
                const localStorageData = loadFromLocalStorage();
                if (localStorageData.length > 0) {
                    // Merge with existing data, avoiding duplicates
                    const mergedData = [...new Map([...localStorageData, ...data].map(item => [item.hash, item])).values()];
                    setData(mergedData);
                    console.log(`Merged localStorage data: ${localStorageData.length} items`);
                }

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
            // Ensure the tweet data has all required fields
            const completeData: TweetData = {
                content: tweetData.content,
                timestamp: tweetData.timestamp,
                author: tweetData.author
            };
            
            const hash = await db.add(completeData);
            console.log('Tweet added with hash:', hash);
            
            // Update the state with the hash included
            const tweetWithHash = { ...completeData, hash };
            setData(prevData => [tweetWithHash, ...prevData]);
            
            // Backup to localStorage
            saveToLocalStorage([tweetWithHash, ...data]);
            
            // Force a save/flush of the database if available
            if (typeof db.save === 'function') {
                await db.save();
                console.log('Database saved');
            }
        } catch (err) {
            console.error('Error adding tweet:', err);
            throw err;
        }
    };

    const refreshData = async () => {
        if (!db || isRefreshing) return;
        
        setIsRefreshing(true);
        try {
            // Reload all entries from the database
            const allEntries: TweetData[] = [];
            
            for await (const entry of db.iterator()) {
                console.log('Refreshed entry:', entry);
                if (entry.value && typeof entry.value === 'object') {
                    const tweetData: TweetData = {
                        content: entry.value.content || '',
                        timestamp: entry.value.timestamp || Date.now(),
                        author: entry.value.author || 'Anonymous',
                        hash: entry.hash
                    };
                    allEntries.unshift(tweetData); // Add to beginning to show newest first
                }
            }
            
            console.log(`Refreshed with ${allEntries.length} tweets from database`);
            setData(allEntries);
            
            // Backup refreshed data to localStorage
            if (allEntries.length > 0) {
                saveToLocalStorage(allEntries);
            }
        } catch (err) {
            console.error('Error refreshing data:', err);
            // Fallback to localStorage on refresh error
            const localStorageData = loadFromLocalStorage();
            if (localStorageData.length > 0) {
                setData(localStorageData);
                console.log('Refresh fallback: loaded data from localStorage');
            }
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
            {/* Mobile Top Header */}
            <Box sx={{ 
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 60,
                bgcolor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1000,
                px: 2,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    🌐 OrbitDB
                </Typography>
            </Box>

            {/* Left Sidebar - Desktop Navigation */}
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
                minHeight: '100vh',
                pt: { xs: '60px', md: 0 },
                pb: { xs: '70px', md: 0 }
            }}>
                {/* Top Header - Desktop only */}
                <Box sx={{ 
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    zIndex: 100,
                    display: { xs: 'none', md: 'block' }
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
                onClose={() => {
                    setModalOpen(false);
                    setMobileNavValue(0); // Reset to Home tab
                }}
                onSubmit={addTweet}
            />
            
            <AboutModal
                open={aboutModalOpen}
                onClose={() => {
                    setAboutModalOpen(false);
                    setMobileNavValue(0); // Reset to Home tab
                }}
            />

            {/* Mobile Floating Action Button */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 90,
                    right: 20,
                    display: { xs: 'flex', md: 'none' },
                    zIndex: 1000,
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 12px rgba(29, 155, 240, 0.3)',
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(29, 155, 240, 0.4)',
                        transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => setModalOpen(true)}
                disabled={!db}
            >
                <AddIcon />
            </Fab>

            {/* Mobile Bottom Navigation */}
            <Paper sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                display: { xs: 'block', md: 'none' },
                zIndex: 1000
            }}>
                <BottomNavigation
                    sx={{ 
                        bgcolor: 'background.paper',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        height: 70,
                        '& .MuiBottomNavigationAction-root': {
                            minWidth: 'auto',
                            padding: '6px 8px',
                            '&:hover': {
                                bgcolor: 'rgba(29, 155, 240, 0.1)'
                            },
                            '&.Mui-selected': {
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                }
                            }
                        }
                    }}
                    value={mobileNavValue}
                    onChange={(event, newValue) => {
                        setMobileNavValue(newValue);
                        // Handle specific navigation actions
                        if (newValue === 2) { // Compose button
                            setModalOpen(true);
                            // Don't change the selected value for compose button
                            return;
                        } else if (newValue === 4) { // Profile button
                            setAboutModalOpen(true);
                            // Don't change the selected value for profile button
                            return;
                        }
                    }}
                >
                    <BottomNavigationAction 
                        label="Home" 
                        icon={<HomeIcon />}
                        sx={{ 
                            color: 'text.primary',
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        }}
                    />
                    <BottomNavigationAction 
                        label="Search" 
                        icon={<SearchIcon />}
                        sx={{ 
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        }}
                    />
                    <BottomNavigationAction 
                        label="Compose" 
                        icon={<AddIcon />}
                        disabled={!db}
                        sx={{ 
                            color: 'primary.main',
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        }}
                    />
                    <BottomNavigationAction 
                        label="Notifications" 
                        icon={<NotificationsIcon />}
                        sx={{ 
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        }}
                    />
                    <BottomNavigationAction 
                        label="Profile" 
                        icon={<PersonIcon />}
                        sx={{ 
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        }}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default OrbitDBDemo;