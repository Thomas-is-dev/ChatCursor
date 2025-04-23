# WebSocket Chat Application

A real-time chat application using WebSockets with Vue.js frontend and Node.js backend.

## Features

- User authentication with username
- Real-time messaging
- User online status tracking
- Join/leave notifications
- Responsive design

## Project Structure

```
├── client/            # Vue.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── views/     
│   │   │   ├── Login.vue
│   │   │   └── Chat.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/            # Node.js backend
    ├── index.js       # WebSocket server
    └── package.json
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

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Usage

1. Start both the backend and frontend servers
2. Open the browser and navigate to http://localhost:5173
3. Enter a username to join the chat
4. Start chatting with other users in real-time

## WebSocket Events

### Client to Server
- `login`: Send username to log in
- `send_message`: Send a new chat message

### Server to Client
- `login_success`: Confirm successful login
- `login_error`: Notify of login failure
- `user_joined`: Notify when a user joins
- `user_left`: Notify when a user leaves
- `receive_message`: Receive a new message
- `user_list`: Get the list of online users 