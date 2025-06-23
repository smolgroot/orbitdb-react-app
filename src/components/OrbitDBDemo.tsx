import React, { useEffect, useState } from 'react';
import { createOrbitDB, OrbitDB } from '@orbitdb/core';
import { createHelia } from 'helia';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';

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

const OrbitDBDemo: React.FC = () => {
    const [orbitdb, setOrbitdb] = useState<OrbitDB | null>(null);
    const [db, setDb] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const addEntry = async () => {
        if (db) {
            const message = `Hello World at ${new Date().toISOString()}`;
            await db.add(message);
            
            // Since we're in offline mode, manually update the state
            setData(prevData => [message, ...prevData]);
        }
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading OrbitDB...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>OrbitDB Hello World Demo</h2>
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={addEntry} 
                    disabled={!db}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Add Entry
                </button>
            </div>
            <div>
                <h3>Database Entries:</h3>
                {data.length === 0 ? (
                    <p style={{ color: '#666' }}>No entries yet. Click "Add Entry" to add some data!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.map((entry, index) => (
                            <li 
                                key={index} 
                                style={{
                                    background: '#f8f9fa',
                                    padding: '10px',
                                    margin: '5px 0',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '5px'
                                }}
                            >
                                {entry}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrbitDBDemo;