import { useEffect, useState } from 'react';
import { createOrbitDB, OrbitDB } from '@orbitdb/core';
import { createHelia } from 'helia';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';

const useOrbitDB = (dbName: string) => {
    const [orbitdb, setOrbitdb] = useState<OrbitDB | null>(null);
    const [db, setDb] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initOrbitDB = async () => {
            try {
                setLoading(true);
                
                // Create libp2p instance
                const libp2p = await createLibp2p({
                    transports: [webSockets()],
                    connectionEncryption: [noise()],
                    streamMuxers: [yamux()],
                });

                // Create Helia instance
                const helia = await createHelia({ libp2p });
                
                // Create OrbitDB instance
                const orbitdbInstance = await createOrbitDB({ ipfs: helia });
                setOrbitdb(orbitdbInstance);

                // Create or open a log database
                const database = await orbitdbInstance.open(dbName, { type: 'events' });
                setDb(database);

                // Load existing entries
                const allEntries = [];
                for await (const entry of database.iterator()) {
                    allEntries.unshift(entry.value);
                }
                setData(allEntries);

                // Listen for new entries
                database.events.on('update', async () => {
                    const allEntries = [];
                    for await (const entry of database.iterator()) {
                        allEntries.unshift(entry.value);
                    }
                    setData(allEntries);
                });

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize OrbitDB');
                setLoading(false);
                console.error('Error initializing OrbitDB:', err);
            }
        };

        initOrbitDB();

        return () => {
            if (db) {
                db.close();
            }
            if (orbitdb) {
                orbitdb.stop();
            }
        };
    }, [dbName]);

    const addData = async (value: string) => {
        if (db) {
            await db.add(value);
        }
    };

    return { data, addData, loading, error };
};

export default useOrbitDB;