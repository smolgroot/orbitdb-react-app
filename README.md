# OrbitDB React TypeScript Twitter Clone

A modern React + TypeScript application that replicates Twitter's interface and functionality using OrbitDB v2.5.0. This project showcases how to build decentralized social applications with peer-to-peer database functionality and an authentic Twitter-like dark theme UI.

## 🌟 Features

- **🐦 Authentic Twitter Interface** - Pixel-perfect Twitter UI with dark theme
- **📱 Responsive Design** - Mobile-first design with floating action buttons
- **🔄 Real-time Tweet Feed** - Left sidebar navigation, center feed, right sidebar
- **🎨 Material-UI Dark Theme** - Twitter's exact color scheme and typography
- **💬 Tweet Composition Modal** - Full-featured tweet composer with character limits
- **OrbitDB v2.5.0** - Latest version of the decentralized database
- **React 18** - Modern React with createRoot API  
- **TypeScript** - Full type safety and developer experience
- **IPFS/Helia** - Decentralized storage layer
- **Browser Compatible** - Runs entirely in the browser with proper polyfills
- **Offline Mode** - Works without network connectivity for local testing

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

### UI Components

- **TweetModal** - Modal dialog for composing tweets with character limit
- **TweetCard** - Card component for displaying tweets with author, timestamp, and content
- **Material-UI Icons** - Beautiful icons for the user interface

### Browser Compatibility

The project uses CRACO to configure webpack with proper Node.js polyfills for browser compatibility.

## 🎯 How It Works

1. **Initialization**: Creates a minimal libp2p instance in offline mode
2. **Database Setup**: Opens an OrbitDB events database for storing tweets
3. **Data Loading**: Loads existing tweets from OrbitDB + localStorage backup
4. **Twitter UI**: Three-column layout with left navigation, center feed, right sidebar
5. **Tweet Composition**: Full-screen modal composer with character limits and validation
6. **Tweet Display**: Twitter-style cards with avatars, usernames, and timestamps
7. **Data Persistence**: Dual-layer persistence with OrbitDB + localStorage backup

## 💾 Data Persistence

### How Tweets Persist After Page Refresh

The app implements a **dual-layer persistence system** to ensure tweets never get lost:

#### 1. **Primary Storage - OrbitDB**
- All tweets are stored in a decentralized OrbitDB database
- Uses IPFS content addressing for permanent storage
- Survives page refreshes, browser restarts, and even computer reboots
- Database files are stored locally in the browser's IndexedDB

#### 2. **Backup Storage - localStorage**
- Every tweet is automatically backed up to browser localStorage
- Provides instant fallback if OrbitDB has loading issues
- Ensures data availability even during OrbitDB initialization

#### 3. **Loading Strategy**
1. **On App Start**: Attempts to load tweets from OrbitDB database
2. **Fallback**: If OrbitDB fails, loads from localStorage backup
3. **Sync**: Keeps both storage layers synchronized

#### 4. **When You Add a Tweet**
1. Saves to OrbitDB database with cryptographic hash
2. Immediately backs up to localStorage
3. Updates UI with real-time display
4. All future page refreshes will show your tweets

## 🖼️ User Interface

### Desktop Layout
- **Left Sidebar**: Navigation menu with Home, Explore, Notifications, etc.
- **Center Feed**: Main tweet timeline with compose functionality
- **Right Sidebar**: "What's happening" and database statistics

### Mobile Layout  
- **Responsive Design**: Collapses sidebars for mobile viewing
- **Floating Action Button**: Quick access to tweet composer on mobile
- **Touch-friendly**: All interactions optimized for mobile devices

### Dark Theme
- **Twitter Black**: Authentic Twitter dark mode colors (#000000, #16181c)
- **Twitter Blue**: Primary accent color (#1d9bf0)  
- **Proper Typography**: Twitter's font stack and sizing

## 🔧 Troubleshooting

### If Tweets Disappear After Refresh

1. **Check Browser Console**: Look for OrbitDB initialization errors
2. **Clear Browser Data**: Sometimes helps reset corrupted database
3. **localStorage Backup**: Tweets should still be in localStorage as backup
4. **Refresh Button**: Use the refresh button in the app to reload from database

### Persistence Debugging

Open browser console to see persistence logs:
```
Loaded X existing tweets from database
Tweets backed up to localStorage  
Tweet added with hash: bafyre...
```

### Storage Locations

- **OrbitDB**: Stored in browser's IndexedDB (`/orbitdb/` namespace)
- **localStorage**: Key `orbitdb-tweets` contains JSON backup
- **Console Logs**: Shows real-time persistence operations

## 🔧 Key Fixes Applied

This implementation resolves common OrbitDB browser issues:

- ✅ **addEventListener errors** - Fixed with offline mode and proper polyfills
- ✅ **Node.js module errors** - Comprehensive webpack fallbacks  
- ✅ **React 18 warnings** - Updated to createRoot API
- ✅ **TypeScript errors** - Custom type definitions provided

## 📚 Learn More

- [OrbitDB Documentation](https://orbitdb.org/)
- [OrbitDB GitHub](https://github.com/orbitdb/orbitdb)
- [React Documentation](https://reactjs.org/)

---

**Happy coding with decentralized databases! 🌐**

   ```
   git clone https://github.com/yourusername/orbitdb-react-app.git
   ```

2. Navigate to the project directory:

   ```
   cd orbitdb-react-app
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

To start the application, run:

```
npm start
```

This will launch the app in your default web browser. You should see the "Hello World" message from OrbitDB.

### Usage

The application initializes an OrbitDB instance and allows you to interact with it through the `OrbitDBDemo` component. You can add and retrieve data from the database.

### Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

### License

This project is licensed under the MIT License. See the LICENSE file for details.