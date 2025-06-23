import React from 'react';
import OrbitDBDemo from './components/OrbitDBDemo';

const App: React.FC = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <header style={{ 
                backgroundColor: '#2c3e50', 
                color: 'white', 
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem' }}>
                    🌐 OrbitDB + React + TypeScript
                </h1>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
                    Decentralized Database Demo
                </p>
            </header>
            
            <main style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '2rem'
            }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ color: '#2c3e50', marginTop: 0 }}>About This Demo</h2>
                    <p style={{ color: '#666', lineHeight: 1.6 }}>
                        This demo showcases <strong>OrbitDB</strong> running in a React + TypeScript application. 
                        OrbitDB is a peer-to-peer database powered by IPFS that enables decentralized applications 
                        to store and sync data without centralized servers.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        flexWrap: 'wrap',
                        marginTop: '1rem'
                    }}>
                        <span style={{ 
                            backgroundColor: '#3498db', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            📊 OrbitDB v2.5.0
                        </span>
                        <span style={{ 
                            backgroundColor: '#e74c3c', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            ⚛️ React 18
                        </span>
                        <span style={{ 
                            backgroundColor: '#9b59b6', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            📘 TypeScript
                        </span>
                        <span style={{ 
                            backgroundColor: '#27ae60', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            🌍 IPFS/Helia
                        </span>
                    </div>
                </div>
                
                <OrbitDBDemo />
            </main>
            
            <footer style={{ 
                backgroundColor: '#34495e', 
                color: 'white', 
                textAlign: 'center', 
                padding: '1rem',
                marginTop: '2rem'
            }}>
                <p style={{ margin: 0, opacity: 0.8 }}>
                    Built with ❤️ using OrbitDB • Learn more at{' '}
                    <a 
                        href="https://github.com/orbitdb/orbitdb" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#3498db' }}
                    >
                        github.com/orbitdb/orbitdb
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default App;