# Database Sharing Demo

This document demonstrates how the OrbitDB database sharing feature works in the Twitter clone.

## 🔧 How Database Sharing Works

### 1. Database Information Modal
The application includes a comprehensive database information modal that shows:

- **Database Stats**: Number of tweets, database type, connected peers, replication status
- **Shareable Database Address**: The raw OrbitDB address that can be shared
- **Shareable Link**: A URL that automatically connects to the database
- **Technical Details**: Database name, identity ID, type, and peer information

### 2. Access Points

**Desktop:**
- Click "Database Info" button under the OrbitDB logo in the left sidebar

**Mobile:**
- Tap the info icon (ℹ️) in the top header

### 3. Sharing Process

1. **Open Database Info Modal**
2. **Copy Database Address or Shareable Link**
   - Database Address: Raw OrbitDB address (e.g., `/orbitdb/zdpuB1...`)
   - Shareable Link: URL with database parameter (e.g., `http://localhost:8081?db=...`)
3. **Share with Others**
   - Send via messaging apps, email, or any communication method
   - Recipients can click the link or manually enter the database address

### 4. Connecting to Shared Database

**Method 1: Shareable Link**
- Click the provided link
- Application automatically loads the shared database
- All existing tweets in that database will appear

**Method 2: Manual Database Address**
- Copy the database address
- Open the application normally
- Access Database Info modal
- Paste the address (this would require additional UI implementation)

### 5. Database Synchronization

Once connected to a shared database:
- All tweets are shared between users
- New tweets appear in real-time (when sync is enabled)
- Data persists locally with localStorage backup
- Each user maintains their own copy of the database

## 🚀 Example Usage

```
User A creates a database with some tweets
User A opens Database Info modal and copies shareable link:
http://localhost:8081?db=%2Forbitdb%2FzdpuB1ZjGmK8rG...

User A shares this link with User B
User B clicks the link and sees all of User A's tweets
User B can now add tweets to the same database
Both users see each other's tweets (when sync is enabled)
```

## 🔒 Security Considerations

- Database addresses are public identifiers
- Anyone with the address can read/write to the database
- For production use, implement proper access controls
- Consider using private databases for sensitive data

## 📋 Technical Implementation

The sharing feature includes:

1. **URL Parameter Parsing**: `new URLSearchParams(window.location.search).get('db')`
2. **Dynamic Database Opening**: Opens database with shared address instead of default
3. **Address Display**: Shows full database address in modal
4. **Copy Functionality**: Uses `navigator.clipboard.writeText()` for easy sharing
5. **Link Generation**: Creates shareable URLs with encoded database addresses

This implementation provides a seamless way to share decentralized databases and collaborate on content in a peer-to-peer manner.
