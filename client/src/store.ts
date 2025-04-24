import { reactive } from 'vue';
import { Socket, io } from 'socket.io-client';
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
      console.log('Initializing socket connection');
      try {
        // Get socket URL and path from environment configuration
        // Using __APP_ENV__ which is defined in vite.config.ts
        const socketUrl = (window as any).__APP_ENV__?.SOCKET_URL || '/';
        const socketPath = (window as any).__APP_ENV__?.SOCKET_PATH || '/socket.io';
        
        // For security, don't log the full URL
        const maskedUrl = socketUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1');
        console.log(`Connecting to socket at ${maskedUrl}/**** with path ${socketPath}`);
        
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
          if (socket.connected === false) {
            console.log('Connection failed, attempting to reconnect');
            setTimeout(() => socket.connect(), 2000);
          }
        });
        
        socket.io.on('reconnect_attempt', (attempt) => {
          console.log(`Reconnection attempt ${attempt}`);
        });
        
        socket.io.on('reconnect_error', (error) => {
          console.error('Reconnection error:', error);
        });
        
        socket.io.on('reconnect_failed', () => {
          console.error('Reconnection failed after all attempts');
          this.connectionError = 'Failed to reconnect to server after multiple attempts';
        });
        
        socket.on('connect', () => {
          console.log('Socket connected successfully');
          this.connectionError = null;
          
          // If we have a username, reconnect with it
          const storedUsername = this.getUsername();
          if (storedUsername) {
            console.log('Reconnecting with stored username:', storedUsername);
            this.reconnect();
          }
        });
        
        socket.on('disconnect', (reason: string) => {
          console.log('Socket disconnected:', reason);
          
          // If the server disconnected us, try to reconnect
          if (reason === 'io server disconnect') {
            socket.connect();
          }
        });
        
        // Handle encryption key delivery
        socket.on('encryption_key', (keys: {key: string, masterKey: string}) => {
          console.log('Received encryption keys from server');
          this.setEncryptionKeys(keys);
        });
      } catch (err) {
        console.error('Failed to initialize socket:', err);
        this.connectionError = 'Failed to initialize socket connection';
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
    console.log('Encryption keys set successfully');
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
      
      console.log('Encrypting message with shared key');
      const result = encryptMessage(message, this.encryptionKey);
      console.log('Message encrypted successfully');
      return result;
    } catch (error: any) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt message: ' + (error.message || 'Unknown error'));
    }
  },
  
  /**
   * Decrypt a message with the shared key
   */
  decryptMessage(encryptedContent: string, iv: string): string {
    try {
      if (!encryptedContent || !iv) {
        console.warn('Missing encrypted content or IV');
        return '[Encrypted message - cannot decrypt]';
      }
      
      if (!this.encryptionKey) {
        console.warn('Missing encryption key');
        return '[Encrypted message - no decryption key]';
      }
      
      console.log('Decrypting message with shared key');
      const result = decryptMessage(encryptedContent, iv, this.encryptionKey);
      console.log('Message decrypted successfully');
      return result;
    } catch (error: any) {
      console.error('Failed to decrypt message:', error);
      return '[Encryption error: ' + (error.message || 'Unknown error') + ']';
    }
  },
  
  /**
   * Reconnect the user to the server
   */
  reconnect() {
    const username = this.getUsername();
    const socket = this.socket;
    if (username && socket && socket.connected) {
      socket.emit('reconnect_user', username);
    }
  }
});

export default store; 