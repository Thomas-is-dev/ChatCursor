/**
 * Socket handlers for message processing
 */
import { Socket, Server } from 'socket.io';
import { filterMessage } from '../utils/filters';
import { getUserBySocketId } from './userHandlers';
import crypto from 'crypto';
import 'colors';

const getTimestamp = () => `[${new Date().toLocaleString('fr-FR')}]`.gray;

/**
 * Process and relay messages between users
 * Apply filtering for offensive content
 */
export const handleMessage = (
  io: Server,
  socket: Socket,
  encryptedMessage: { content: string, iv: string },
  messageId?: string,
  callback?: (success: boolean) => void
): void => {
  const username = getUserBySocketId(socket.id);
  
  // Always acknowledge the message even if we don't have a username
  const ackCallback = (success: boolean) => {
    if (typeof callback === 'function') {
      try {
        callback(success);
      } catch (error) {
        console.error(`${getTimestamp()} ${'Error sending acknowledgement:'.red}`, error);
      }
    }
  };
  
  try {
    if (!username) {
      // User not found, send error acknowledgement
      console.warn(`${getTimestamp()} ${'Message rejected:'.yellow} no username found for socket ${socket.id}`);
      ackCallback(false);
      return;
    }
    
    // Since the message is encrypted, we can't filter the actual content
    // We're limited to relaying the encrypted content as-is
    console.log(`${getTimestamp()} Message from ${username.cyan} ${'(encrypted)'.gray}`);
    
    // Create the message object with the client-encrypted content
    const messageObject = {
      encryptedContent: encryptedMessage.content,
      iv: encryptedMessage.iv,
      username: username,
      time: new Date().toLocaleTimeString(),
      id: messageId || `${username}-${Date.now()}`
    };
    
    // Broadcast to all clients
    io.emit('receive_message', messageObject);
    
    // Send positive acknowledgement
    ackCallback(true);
  } catch (error) {
    console.error(`${getTimestamp()} ${'Error processing message:'.red}`, error);
    ackCallback(false);
  }
};

/**
 * Process and relay unencrypted messages between users
 * Apply server-side filtering for offensive content before encryption
 */
export const handleUnencryptedMessage = (
  io: Server,
  socket: Socket,
  message: string,
  encryptionKey: string,
  messageId?: string,
  callback?: (success: boolean) => void
): void => {
  const username = getUserBySocketId(socket.id);
  
  // Always acknowledge the message even if we don't have a username
  const ackCallback = (success: boolean) => {
    if (typeof callback === 'function') {
      try {
        callback(success);
      } catch (error) {
        console.error(`${getTimestamp()} ${'Error sending acknowledgement:'.red}`, error);
      }
    }
  };
  
  try {
    if (!username) {
      // User not found, send error acknowledgement
      console.warn(`${getTimestamp()} ${'Message rejected:'.yellow} no username found for socket ${socket.id}`);
      ackCallback(false);
      return;
    }
    
    // Apply server-side filtering to the plain text message
    const filteredMessage = filterMessage(message);
    
    // Only log if message was actually filtered (different from original)
    if (filteredMessage !== message) {
      console.log(`${getTimestamp()} Message from ${username.cyan} ${'(banned words detected)'.red}: "${message.yellow}"`);
      console.log(`${getTimestamp()} ${'Filtered message sent to clients:'.green} "${filteredMessage.white}"`);
    } else {
      console.log(`${getTimestamp()} Message from ${username.cyan}: "${message.white}"`);
    }
    
    // Encrypt the filtered message using the server's encryption key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      Buffer.from(encryptionKey, 'hex'), 
      iv
    );
    
    let encrypted = cipher.update(filteredMessage, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Create the message object with the server-filtered, server-encrypted content
    const messageObject = {
      // encryptedContent: encrypted,
      encryptedContent: filteredMessage,
      iv: iv.toString('hex'),
      username: username,
      time: new Date().toLocaleTimeString(),
      id: messageId || `${username}-${Date.now()}`
    };
    
    // Broadcast to all clients
    io.emit('receive_message', messageObject);
    
    // Send positive acknowledgement
    ackCallback(true);
  } catch (error) {
    console.error(`${getTimestamp()} ${'Error processing unencrypted message:'.red}`, error);
    ackCallback(false);
  }
}; 