import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// User type map
type UserMap = Map<string, string>; // socket id -> username

// Store connected users
const users: UserMap = new Map();

// Store encryption keys
const userKeys: Map<string, string> = new Map(); // username -> encryption key

// Generate a secure encryption key for the app
// In production, this should be stored securely in environment variables
const MASTER_KEY = crypto.randomBytes(32).toString('hex');

// A shared key for all users - simpler approach for consistent encryption
const SHARED_KEY = crypto.randomBytes(32).toString('hex');

// Helper function to log user count
const logUserCount = (): void => {
  console.log(`Total users connected: ${users.size}`);
};

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  // Handle user login
  socket.on('login', (username: string) => {
    // Validate username length
    if (!username || username.length > 20) {
      socket.emit('login_error', 'Username must be 20 characters or less');
      return;
    }
    
    // Check if username is already taken by an active connection
    const usernameTaken = Array.from(users.values()).includes(username);
    
    if (usernameTaken) {
      socket.emit('login_error', 'Username already taken');
      return;
    }

    // Store the user - now using shared key
    users.set(socket.id, username);
    console.log(`User ${username} logged in with shared encryption key`);
    logUserCount();
    
    // Send the encryption key to the user
    socket.emit('encryption_key', {
      key: SHARED_KEY,
      masterKey: MASTER_KEY
    });
    
    // Notify the user of successful login
    socket.emit('login_success', username);
    
    // Notify all users about the new user
    io.emit('user_joined', username);
    
    // Send the current user list to the new user
    socket.emit('user_list', Array.from(users.values()));
    
    // Send the updated user list to everyone
    io.emit('user_list', Array.from(users.values()));
  });

  // Handle user reconnection (for page refreshes)
  socket.on('reconnect_user', (username: string) => {
    console.log(`User ${username} reconnecting...`);
    
    // Validate username length
    if (!username || username.length > 20) {
      console.log(`Reconnection rejected: invalid username length`);
      return;
    }
    
    // Check if this username is already in the list
    const existingSocketId = [...users.entries()]
      .find(([_, name]) => name === username)?.[0];
      
    // If the username exists with a different socket, update it
    if (existingSocketId && existingSocketId !== socket.id) {
      console.log(`Removing old socket ID ${existingSocketId} for ${username}`);
      users.delete(existingSocketId);
    }
    
    // Store/update the user with the new socket ID
    users.set(socket.id, username);
    
    // Send shared encryption key
    socket.emit('encryption_key', {
      key: SHARED_KEY,
      masterKey: MASTER_KEY
    });
    
    console.log(`User ${username} reconnected`);
    logUserCount();
    
    // Inform the user their reconnection was successful
    socket.emit('reconnection_successful', username);
    
    // Send the updated user list to everyone
    io.emit('user_list', Array.from(users.values()));
  });

  // Handle chat messages - server just relays encrypted content
  socket.on('send_message', (clientEncryptedMessage: {content: string, iv: string}, messageId?: string, callback?: (success: boolean) => void) => {
    const username = users.get(socket.id);
    
    // Always acknowledge the message even if we don't have a username
    const ackCallback = (success: boolean) => {
      if (typeof callback === 'function') {
        try {
          callback(success);
        } catch (error) {
          console.error('Error sending acknowledgement:', error);
        }
      }
    };
    
    try {
      if (!username) {
        // User not found, send error acknowledgement
        console.warn(`Message rejected: no username found for socket ${socket.id}`);
        ackCallback(false);
        return;
      }
      
      // Just relay the already-encrypted message
      console.log(`Encrypted message from ${username} relayed to other clients`);

      // Create the message object with the client-encrypted content
      const messageObject = {
        encryptedContent: clientEncryptedMessage.content,
        iv: clientEncryptedMessage.iv,
        username: username,
        time: new Date().toLocaleTimeString(),
        id: messageId || `${username}-${Date.now()}`
      };
      
      // Broadcast to all clients
      io.emit('receive_message', messageObject);
      
      // Send positive acknowledgement
      ackCallback(true);
    } catch (error) {
      console.error('Error processing message:', error);
      ackCallback(false);
    }
  });

  // Handle explicit user logout
  socket.on('user_logout', (username: string) => {
    console.log(`User ${username} explicitly logged out`);
    
    // Remove this user from the users map
    users.delete(socket.id);
    
    // Check if username exists in any other active connections
    const usernameStillExists = Array.from(users.values()).includes(username);
    if (!usernameStillExists) {
      // If no other connection has this username, notify all clients
      io.emit('user_left', username);
    }
    
    logUserCount();
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      
      // Remove username from all active connections
      const usernameStillExists = Array.from(users.values()).includes(username);
      if (!usernameStillExists) {
        // Only emit user_left if the username is not connected via another socket
        io.emit('user_left', username);
      }
      
      console.log(`User ${username} disconnected`);
      logUserCount();
    }
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log("================================================")
  console.log(`Server running on port ${PORT}`);
  console.log(`Master encryption key generated: ${MASTER_KEY.substring(0, 10)}...`);
  console.log("================================================")
}); 