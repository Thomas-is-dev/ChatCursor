# MegaChat Client

A secure, encrypted chat application with real-time messaging.

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
│   ├── .env.development   # Development environment variables (committed)
│   ├── .env.local         # Local environment variables (committed)
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

## Environment Setup

This project uses environment variables to configure different environments securely.

### Environment Files Structure

This project uses the following environment files:

1. `.env.development` - Development configuration (safe to commit)
2. `.env.local` - Local configuration (safe to commit)
3. `.env.production` - **Production configuration** (gitignored for security)

### Setting Up Environment Files

To set up your environment:

1. `.env.development` - Create this file for development settings (will be committed)
2. `.env.local` - Create this file for local overrides (will be committed)
3. `.env.production` - Create this file locally for production settings (will NOT be committed)

### Security Notes

- `.env.production` contains sensitive production URLs and is automatically gitignored
- Your development and local environment files will be committed to the repository
- **IMPORTANT**: Never put production API keys or sensitive information in `.env.development` or `.env.local`

## Available Scripts

- `npm run dev` - Start the development server (uses .env.development + .env.local)
- `npm run dev:prod` - Start with production config (uses .env.production + .env.local)
- `npm run build` - Build for production (uses .env.production + .env.local)
- `npm run preview` - Preview the production build
- `npm run type-check` - Run TypeScript type checking

## Configuration Guide

### Socket.IO Configuration

The Socket.IO connection is configured using these environment variables:

```
VITE_SOCKET_URL=http://localhost:3003
VITE_SOCKET_PATH=/socket.io
```

- For development, use these values in `.env.development` or `.env.local`
- For production, use your real server URLs in `.env.production` (which will not be committed)

### Debug Mode

```
VITE_DEBUG_MODE=true
```

Set this to `false` in production to disable debug logging.

### Feature Flags

```
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_VOICE_MESSAGES=false
```

These control various features in the application.

## Key Technologies

- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: Type-safe JavaScript
- **Socket.IO-Client**: Real-time bidirectional communication
- **Vite**: Next-generation frontend tooling
- **CryptoJS**: Message encryption/decryption

## Security Features

- End-to-end message encryption
- Secure environment variable handling
- Protected production configuration 