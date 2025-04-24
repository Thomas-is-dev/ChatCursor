/**
 * Socket handlers for user authentication and connection management
 */
import { Socket, Server } from 'socket.io';
import { validateUsername } from '../utils/filters';
import 'colors';

const getTimestamp = () => `[${new Date().toLocaleString('fr-FR')}]`.gray;

// Store connected users
const users: Map<string, string> = new Map(); // socket id -> username

// Helper function to log user count
export const logUserCount = (): void => {
  console.log(`${getTimestamp()} ${'Total users:'.cyan} ${String(users.size).yellow}`);
};

// Get all users
export const getAllUsers = (): string[] => {
  return Array.from(users.values());
};

// Check if user exists
export const userExists = (username: string): boolean => {
  return Array.from(users.values()).includes(username);
};

// Get username by socket id
export const getUserBySocketId = (socketId: string): string | undefined => {
  return users.get(socketId);
};

// Add user
export const addUser = (socketId: string, username: string): void => {
  users.set(socketId, username);
};

// Remove user
export const removeUser = (socketId: string): string | undefined => {
  const username = users.get(socketId);
  if (username) {
    users.delete(socketId);
  }
  return username;
};

/**
 * Handle user login
 */
export const handleLogin = (
  io: Server,
  socket: Socket,
  data: { username: string },
  sharedKey: string,
  masterKey: string
): void => {
  const username = data.username;
  
  // Validate username
  const validation = validateUsername(username);
  if (!validation.isValid) {
    console.log(`${getTimestamp()} ${'Login failed:'.red} ${validation.errorMessage}`);
    socket.emit('loginError', { message: validation.errorMessage });
    return;
  }
  
  // Check if username is already taken by an active connection
  if (userExists(username)) {
    console.log(`${getTimestamp()} ${'Login failed:'.red} Username "${username}" already taken`);
    socket.emit('loginError', { message: 'Username already taken' });
    return;
  }

  // Store the user
  addUser(socket.id, username);
  console.log(`${getTimestamp()} User ${username.cyan} ${'connected'.green}`);
  logUserCount();
  
  // Send the encryption key to the user
  socket.emit('encryption_key', {
    key: sharedKey,
    masterKey: masterKey
  });
  
  // Notify the user of successful login
  socket.emit('loginSuccess', username);
  
  // Notify all users about the new user
  io.emit('user_joined', username);
  
  // Send the current user list to the new user
  socket.emit('user_list', getAllUsers());
  
  // Send the updated user list to everyone
  io.emit('user_list', getAllUsers());
};

/**
 * Handle user reconnection
 */
export const handleReconnection = (
  io: Server,
  socket: Socket,
  data: { username: string },
  sharedKey: string,
  masterKey: string
): void => {
  const username = data.username;
  console.log(`${getTimestamp()} ${'Reconnection attempt:'.yellow} User ${username.cyan}`);
  
  // Validate username
  const validation = validateUsername(username);
  if (!validation.isValid) {
    console.log(`${getTimestamp()} ${'Reconnection failed:'.red} ${validation.errorMessage}`);
    socket.emit('reconnection_failed', validation.errorMessage);
    return;
  }
  
  // Check if this username is already in the list
  const existingSocketId = [...users.entries()]
    .find(([_, name]) => name === username)?.[0];
    
  // If the username exists with a different socket, update it
  if (existingSocketId && existingSocketId !== socket.id) {
    console.log(`${getTimestamp()} ${'Updating socket:'.yellow} ${existingSocketId} -> ${socket.id} for user ${username.cyan}`);
    users.delete(existingSocketId);
  }
  
  // Store/update the user with the new socket ID
  addUser(socket.id, username);
  console.log(`${getTimestamp()} User ${username.cyan} ${'reconnected successfully'.green}`);
  
  // Send shared encryption key
  socket.emit('encryption_key', {
    key: sharedKey,
    masterKey: masterKey
  });
  
  // Inform the user their reconnection was successful
  socket.emit('reconnection_successful', username);
  
  // Send the current user list to the reconnected user
  socket.emit('user_list', getAllUsers());
  
  // Send the updated user list to everyone
  io.emit('user_list', getAllUsers());
  
  logUserCount();
};

/**
 * Handle user logout
 */
export const handleLogout = (
  io: Server,
  socket: Socket,
  username: string
): void => {
  removeUser(socket.id);
  
  // Check if username exists in any other active connections
  const usernameStillExists = userExists(username);
  if (!usernameStillExists) {
    console.log(`${getTimestamp()} User ${username.cyan} ${'logged out'.yellow}`);
    io.emit('user_left', username);
  }
  
  logUserCount();
};

/**
 * Handle user disconnection
 */
export const handleDisconnect = (
  io: Server,
  socket: Socket
): void => {
  const username = getUserBySocketId(socket.id);
  if (username) {
    removeUser(socket.id);
    
    // Check if username exists in any other active connections
    const usernameStillExists = userExists(username);
    if (!usernameStillExists) {
      console.log(`${getTimestamp()} User ${username.cyan} ${'disconnected'.yellow}`);
      io.emit('user_left', username);
    }
    
    logUserCount();
  }
}; 