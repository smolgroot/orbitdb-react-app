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
3. **Twitter UI**: Three-column layout with left navigation, center feed, right sidebar
4. **Tweet Composition**: Full-screen modal composer with character limits and validation
5. **Tweet Display**: Twitter-style cards with avatars, usernames, and timestamps
6. **Data Persistence**: All tweets are stored in the decentralized OrbitDB database

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
2. **Helia Setup**: Initializes IPFS layer without networking  
3. **OrbitDB Creation**: Creates a database instance with sync disabled
4. **Data Management**: Stores and retrieves data locally
5. **UI Updates**: React state management for real-time updates

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