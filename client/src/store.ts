import { reactive } from 'vue';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { encryptMessage, decryptMessage } from './utils/encryption';

/**
 * Store interface for the application
 */
interface Store {
  socket: Socket | null;
  username: string;
  connectionError: string | null;
  encryptionKey: string;
  masterKey: string;
  initSocket(): Socket;
  getSocket(): Socket;
  setUsername(name: string): void;
  getUsername(): string;
  clearUsername(): void;
  hasConnectionError(): boolean;
  getConnectionError(): string | null;
  encryptMessage(message: string): {content: string, iv: string};
  decryptMessage(encryptedContent: string, iv: string): string;
  setEncryptionKeys(keys: {key: string, masterKey: string}): void;
  reconnect(): void;
}

/**
 * Create a reactive store object for the application
 */
const store = reactive<Store>({
  socket: null,
  username: '',
  connectionError: null,
  encryptionKey: '',
  masterKey: '',
  
  /**
   * Initialize the Socket.IO connection
   */
  initSocket() {
    if (!this.socket) {
      try {
        // Get socket URL and path from environment configuration
        const socketUrl = (window as any).__APP_ENV__?.SOCKET_URL || '/';
        const socketPath = (window as any).__APP_ENV__?.SOCKET_PATH || '/socket.io';
        
        const socket = io(socketUrl, {
          path: socketPath,
          transports: ['websocket', 'polling'],
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
          autoConnect: true,
          timeout: 20000,
          forceNew: true
        });
        
        this.socket = socket;
        
        // Set up error handling
        socket.on('connect_error', (err: Error) => {
          console.error('Socket connection error:', err.message);
          this.connectionError = 'Failed to connect to chat server: ' + err.message;
          
          // Try to reconnect with clean state
          if (!socket.connected) {
            setTimeout(() => {
              console.log('Attempting to reconnect after error...');
              socket.connect();
            }, 2000);
          }
        });
        
        socket.io.on('reconnect_error', (error: Error) => {
          console.error('Reconnection error:', error);
          this.connectionError = 'Failed to reconnect: ' + error.message;
        });
        
        socket.io.on('reconnect_failed', () => {
          console.error('Reconnection failed after all attempts');
          this.connectionError = 'Failed to reconnect to server after multiple attempts';
          this.clearUsername();
          window.location.href = '/';
        });
        
        socket.on('connect', () => {
          console.log('Socket connected, checking for stored username...');
          this.connectionError = null;
          
          // If we have a username, attempt to reconnect with it
          const storedUsername = this.getUsername();
          if (storedUsername) {
            console.log('Found stored username, attempting to reconnect:', storedUsername);
            socket.emit('reconnect_user', { username: storedUsername });
          } else {
            console.log('No stored username found');
          }
        });
        
        socket.on('disconnect', (reason: string) => {
          console.log('Socket disconnected:', reason);
          
          // Always try to reconnect after a short delay
          setTimeout(() => {
            if (!socket.connected) {
              console.log('Attempting to reconnect after disconnect...');
              socket.connect();
            }
          }, 1000);
        });
        
        // Handle reconnection response
        socket.on('reconnection_failed', (error: string) => {
          console.error('Reconnection failed:', error);
          this.connectionError = 'Reconnection failed: ' + error;
          this.clearUsername();
          window.location.href = '/';
        });
        
        socket.on('reconnection_successful', () => {
          console.log('Successfully reconnected to server');
          this.connectionError = null;
        });
        
        // Handle encryption key delivery
        socket.on('encryption_key', (keys: {key: string, masterKey: string}) => {
          console.log('Received new encryption keys');
          this.setEncryptionKeys(keys);
        });
      } catch (err) {
        console.error('Failed to initialize socket:', err);
        this.connectionError = 'Failed to initialize socket connection';
        this.clearUsername();
      }
    }
    
    if (!this.socket) {
      throw new Error('Failed to initialize socket');
    }
    return this.socket;
  },
  
  /**
   * Get the Socket instance, initializing if needed
   */
  getSocket() {
    return this.socket || this.initSocket();
  },
  
  /**
   * Set the current username
   */
  setUsername(name: string) {
    this.username = name;
    localStorage.setItem('username', name);
  },
  
  /**
   * Get the current username, from memory or localStorage
   */
  getUsername() {
    if (!this.username) {
      this.username = localStorage.getItem('username') || '';
    }
    return this.username;
  },
  
  /**
   * Clear the username (logout)
   */
  clearUsername() {
    this.username = '';
    localStorage.removeItem('username');
  },
  
  /**
   * Check if there is a connection error
   */
  hasConnectionError() {
    return this.connectionError !== null;
  },
  
  /**
   * Get the current connection error
   */
  getConnectionError() {
    return this.connectionError;
  },
  
  /**
   * Set the encryption keys from the server
   */
  setEncryptionKeys(keys: {key: string, masterKey: string}) {
    this.encryptionKey = keys.key;
    this.masterKey = keys.masterKey;
  },
  
  /**
   * Encrypt a message with the shared key
   */
  encryptMessage(message: string): {content: string, iv: string} {
    try {
      if (!this.encryptionKey) {
        console.warn('Missing encryption key');
        throw new Error('Missing encryption key');
      }
      
      return encryptMessage(message, this.encryptionKey);
    } catch (error: any) {
      console.error('Encryption error:', error);
      throw error;
    }
  },
  
  /**
   * Decrypt a message with the shared key
   */
  decryptMessage(encryptedContent: string, iv: string): string {
    try {
      if (!this.encryptionKey) {
        console.warn('Missing encryption key');
        throw new Error('Missing encryption key');
      }
      
      return decryptMessage(encryptedContent, iv, this.encryptionKey);
    } catch (error: any) {
      console.error('Decryption error:', error);
      throw error;
    }
  },
  
  /**
   * Reconnect the user to the server
   */
  reconnect() {
    const username = this.getUsername();
    const socket = this.socket;
    if (username && socket) {
      console.log('Attempting to reconnect with username:', username);
      // Make sure we send the username in the correct format
      socket.emit('reconnect_user', { username });
      
      // Set up a one-time listener for the response
      socket.once('reconnection_failed', (error: string) => {
        console.error('Reconnection failed:', error);
        this.clearUsername();
        window.location.href = '/';
      });
    } else {
      console.warn('Cannot reconnect: missing username or socket');
      this.clearUsername();
      window.location.href = '/';
    }
  }
});

export default store; 