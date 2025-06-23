# OrbitDB React TypeScript Twitter Clone

A modern React + TypeScript application that replicates Twitter's interface and functionality using OrbitDB v2.5.0. This project showcases how to build decentralized applications with peer-to-peer database functionality.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm start
```

The app will be available at `http://localhost:3000`

## 🛠 Technical Stack

### Core Dependencies

- **@orbitdb/core** - OrbitDB database library
- **helia** - Modern IPFS implementation  
- **libp2p** - Peer-to-peer networking
- **react** & **react-dom** - UI framework
- **@mui/material** - Material-UI components
- **@emotion/react** & **@emotion/styled** - CSS-in-JS styling
- **typescript** - Type system

### Browser Compatibility

The project uses CRACO to configure webpack with proper Node.js polyfills for browser compatibility.

## 🎯 How It Works

1. **Initialization**: Creates a minimal libp2p instance in offline mode
2. **Database Setup**: Opens an OrbitDB events database for storing tweets
3. **Data Loading**: Loads existing tweets from OrbitDB + localStorage backup
7. **Data Persistence**: Dual-layer persistence with OrbitDB + localStorage backup

### Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

### License

This project is licensed under the MIT License. See the LICENSE file for details.