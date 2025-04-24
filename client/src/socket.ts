/// <reference types="vite/client" />
import io from 'socket.io-client';

// Get environment variables with fallbacks
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/socket.io';

// Create and export socket instance
export const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling']
});

// Add reconnection event handlers
socket.on('connect', () => {
  const username = localStorage.getItem('username');
  if (username) {
    socket.emit('reconnect_user', { username });
  }
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect...');
});

socket.on('reconnect_failed', (error: string) => {
  console.error('Reconnection failed:', error);
});

socket.on('reconnection_successful', (username: string) => {
  console.log('Successfully reconnected as:', username);
});

export const initializeSocket = (username: string) => {
  localStorage.setItem('username', username);
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  localStorage.removeItem('username');
  socket.disconnect();
}; 