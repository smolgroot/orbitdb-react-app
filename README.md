# OrbitDB React TypeScript Hello World

A modern React + TypeScript application demonstrating OrbitDB v2.5.0 running in the browser. This project showcases how to build decentralized applications with peer-to-peer database functionality.

## 🌟 Features

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
- **typescript** - Type system

### Browser Compatibility

The project uses CRACO to configure webpack with proper Node.js polyfills for browser compatibility.

## 🎯 How It Works

1. **Initialization**: Creates a minimal libp2p instance in offline mode
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