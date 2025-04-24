# MegaChat Client

A secure, encrypted chat application with real-time messaging.

## Environment Setup

This project uses environment variables to configure different environments securely.

### Environment Files Structure

This project uses three environment files:

1. `.env.development` - Development configuration (safe to commit)
2. `.env.production` - Production configuration (safe to commit)
3. `.env.local` - **Local sensitive configuration** (automatically gitignored)

### Setting Up Environment Files

To set up your environment, create the necessary files manually:

1. `.env.development` - For development settings
2. `.env.production` - For production settings
3. `.env.local` - For your sensitive information like API keys and URLs

### Security Notes

- `.env.local` contains sensitive information and is automatically gitignored
- Put all your real API URLs and secrets in `.env.local`
- `.env.development` and `.env.production` should contain only non-sensitive defaults

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

- For real server URLs, edit these values in `.env.local`
- `.env.development` and `.env.production` contain non-sensitive defaults

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