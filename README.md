# MegaChat

A secure, real-time encrypted chat application using WebSockets with Vue.js frontend and Node.js backend.

## Features

- Secure end-to-end encryption
- User authentication with username
- Real-time messaging
- User online status tracking
- Join/leave notifications
- Responsive cyberpunk design
- Environment-based configuration
- Docker deployment support

## Project Structure

```
ChatCursor/
├── client/                # Vue.js frontend application
│   ├── public/            # Public static assets
│   │   ├── favicon.svg    # Vector favicon
│   │   └── index.html     # Static HTML for public directory
│   ├── src/               # Source code
│   │   ├── components/    # Vue components
│   │   │   ├── ChatHeader.vue       # Header with logout button
│   │   │   ├── MessageInput.vue     # Message input component
│   │   │   ├── MessageList.vue      # Chat messages display
│   │   │   └── UserSidebar.vue      # Online users sidebar
│   │   ├── utils/         # Utility functions
│   │   │   └── encryption.ts        # Encryption/decryption utilities
│   │   ├── views/         # Vue views
│   │   │   ├── Chat.vue             # Main chat interface
│   │   │   └── Login.vue            # Login screen
│   │   ├── App.vue        # Root Vue component
│   │   ├── main.ts        # Application entry point
│   │   ├── shims-vue.d.ts # Vue TypeScript declaration
│   │   └── store.ts       # Global state management
│   ├── .env.development   # Development environment variables
│   ├── .env.local         # Local environment variables
│   ├── .env.production    # Production environment variables (gitignored)
│   ├── .gitignore         # Git ignore rules
│   ├── Dockerfile         # Docker configuration for client
│   ├── README.md          # Client documentation
│   ├── index.html         # Main HTML entry point
│   ├── nginx.conf         # Nginx configuration for production
│   ├── package.json       # NPM dependencies and scripts
│   ├── tsconfig.json      # TypeScript configuration
│   ├── tsconfig.node.json # TypeScript configuration for Node
│   └── vite.config.ts     # Vite bundler configuration
│
├── server/                # Node.js backend server
│   ├── Dockerfile         # Docker configuration for server
│   ├── index.ts           # Server entry point and Socket.IO logic
│   ├── package.json       # NPM dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
│
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # Project documentation
```

## Installation

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment files:
   - Create `.env.development` for development settings
   - Create `.env.local` for local settings
   - Create `.env.production` for production settings (this will be gitignored)

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Docker Deployment

To deploy the application using Docker:

```
docker-compose up -d
```

This will build and start both the client and server containers.

## Usage

1. Start both the backend and frontend servers
2. Open the browser and navigate to http://localhost:5174
3. Enter a username to join the chat
4. Start chatting with other users in real-time

## WebSocket Events

### Client to Server
- `login`: Send username to log in
- `send_message`: Send a new encrypted chat message
- `reconnect_user`: Reconnect a user after page refresh
- `user_logout`: Explicitly log out a user

### Server to Client
- `login_success`: Confirm successful login
- `login_error`: Notify of login failure
- `user_joined`: Notify when a user joins
- `user_left`: Notify when a user leaves
- `receive_message`: Receive a new encrypted message
- `user_list`: Get the list of online users
- `encryption_key`: Receive encryption keys
- `reconnection_successful`: Confirm successful reconnection

## Security

The application implements several security measures:

- End-to-end message encryption using CryptoJS
- Secure environment variable handling
- Protected production configuration
- Username validation and length restrictions

## Technologies

### Frontend
- Vue 3 with Composition API
- TypeScript
- Socket.IO Client
- CryptoJS for encryption
- Vite for building
- Nginx for production serving

### Backend
- Node.js
- Express
- Socket.IO
- TypeScript
- Docker 