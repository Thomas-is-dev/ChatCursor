/**
 * Main server file for the chat application
 */
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';

// Import socket handlers
import { 
  handleLogin, 
  handleReconnection, 
  handleLogout, 
  handleDisconnect 
} from './socket/userHandlers';
import { handleMessage, handleUnencryptedMessage } from './socket/messageHandlers';

// Setup Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Generate secure encryption keys
const MASTER_KEY = crypto.randomBytes(32).toString('hex');
const SHARED_KEY = crypto.randomBytes(32).toString('hex');

// Setup socket connection handler
io.on('connection', (socket) => {
  // Handle user login
  socket.on('login', (data: { username: string }) => {
    handleLogin(io, socket, data, SHARED_KEY, MASTER_KEY);
  });

  // Handle user reconnection
  socket.on('reconnect_user', (data: { username: string }) => {
    handleReconnection(io, socket, data, SHARED_KEY, MASTER_KEY);
  });

  // Handle encrypted chat messages (legacy)
  socket.on('send_message', (encryptedMessage: { content: string, iv: string }, messageId?: string, callback?: (success: boolean) => void) => {
    handleMessage(io, socket, encryptedMessage, messageId, callback);
  });
  
  // Handle unencrypted messages that need server-side filtering
  socket.on('send_unencrypted_message', (message: string, messageId?: string, callback?: (success: boolean) => void) => {
    handleUnencryptedMessage(io, socket, message, SHARED_KEY, messageId, callback);
  });

  // Handle explicit user logout
  socket.on('user_logout', (username: string) => {
    handleLogout(io, socket, username);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    handleDisconnect(io, socket);
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log("\n==================================================");
  console.log(`🚀 Server started successfully`);
  console.log(`🌐 Listening on port ${PORT}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log(`🔑 Master key: ${MASTER_KEY.substring(0, 10)}...`);
  console.log(`🔐 Shared key: ${SHARED_KEY.substring(0, 10)}...`);
  console.log("==================================================\n");
}); 
