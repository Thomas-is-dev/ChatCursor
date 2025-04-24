<template>
  <div class="chat-container">
    <UserSidebar 
      :users="users" 
      :username="username" 
      :isSocketConnected="isSocketConnected"
    />
    
    <div class="chat-main">
      <ChatHeader 
        :username="username" 
        @logout="logout" 
      />
      
      <MessageList 
        ref="messagesContainer"
        :messages="messages" 
        :username="username" 
      />
      
      <MessageInput 
        v-model="newMessage"
        :isSocketConnected="isSocketConnected"
        :isSending="isSending"
        @send="sendMessage" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Socket } from 'socket.io-client';
import store from '../store';

// Async component imports for better performance
const UserSidebar = defineAsyncComponent(() => import('../components/UserSidebar.vue'));
const ChatHeader = defineAsyncComponent(() => import('../components/ChatHeader.vue'));
const MessageList = defineAsyncComponent(() => import('../components/MessageList.vue'));
const MessageInput = defineAsyncComponent(() => import('../components/MessageInput.vue'));

interface Message {
  message: string;
  username: string;
  time: string;
  id?: string;
}

// Reactive state
const router = useRouter();
const username = ref('');
const users = ref<string[]>([]);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const messagesContainer = ref<{ scrollToBottom: () => void } | null>(null);
const isSending = ref(false);
const processedMessageIds = ref(new Set<string>());
const isSocketConnected = ref(false);

// Socket instance
let socket: Socket;

// Lifecycle hooks
onMounted(() => {
  console.log('Chat component mounted');
  initializeChat();
});

onUnmounted(() => {
  console.log('Chat component unmounted');
  cleanupEventListeners();
});

// Initialize chat connection and user session
const initializeChat = () => {
  // Check if user is logged in
  const storedUsername = store.getUsername();
  if (!storedUsername) {
    console.log('No username found, redirecting to login');
    router.push('/');
    return;
  }
  
  username.value = storedUsername;
  console.log('Logged in as:', username.value);
  
  // Get socket from store
  socket = store.getSocket();
  
  // Set initial connection status
  isSocketConnected.value = socket.connected;
  
  // Monitor socket connection status
  socket.on('connect', () => {
    console.log('Socket connected');
    isSocketConnected.value = true;
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    isSocketConnected.value = false;
  });
  
  // Clean up any existing listeners first to prevent duplicates
  cleanupEventListeners();
  
  // Reconnect the user - will reestablish their presence
  store.reconnect();
  
  // Setup event listeners
  setupSocketListeners();
}

// Clean up event listeners to prevent memory leaks
const cleanupEventListeners = () => {
  if (socket) {
    socket.off('receive_message');
    socket.off('user_list');
    socket.off('user_joined');
    socket.off('user_left');
    socket.off('reconnection_successful');
  }
};

// Setup socket event listeners
const setupSocketListeners = () => {
  // Listen for messages
  socket.on('receive_message', (messageData: { 
    encryptedContent: string, 
    iv: string,
    username: string, 
    time: string, 
    id?: string 
  }) => {
    handleIncomingMessage(messageData);
  });
  
  // Listen for user list updates
  socket.on('user_list', (userList: string[]) => {
    console.log('User list received:', userList);
    users.value = userList;
  });
  
  // Listen for new users joining
  socket.on('user_joined', (user: string) => {
    console.log('User joined:', user);
    if (!users.value.includes(user)) {
      users.value.push(user);
    }
    
    addSystemMessage(`${user} has joined the network`);
  });
  
  // Listen for users leaving
  socket.on('user_left', (user: string) => {
    console.log('User left:', user);
    users.value = users.value.filter(u => u !== user);
    
    addSystemMessage(`${user} has disconnected from the network`);
  });
  
  // Listen for successful reconnection
  socket.on('reconnection_successful', (user: string) => {
    console.log('Reconnection successful for:', user);
    if (!users.value.includes(user)) {
      users.value.push(user);
    }
  });
};

// Handle incoming encrypted messages
const handleIncomingMessage = (messageData: { 
  encryptedContent: string, 
  iv: string,
  username: string, 
  time: string, 
  id?: string 
}) => {
  console.log('Encrypted message received from server');
  
  // Generate message ID if not provided
  const messageId = messageData.id || 
    `${messageData.username}-${messageData.time}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Check if this message has already been processed
  if (processedMessageIds.value.has(messageId)) {
    console.log('Duplicate message detected, ignoring:', messageId);
    return;
  }
  
  // Add to processed messages
  processedMessageIds.value.add(messageId);
  
  // Attempt to decrypt the message
  let displayMessage: string;
  try {
    // If it's my own message, use the original text
    if (messageData.username === username.value) {
      // Try to find the original message in our local list
      const myMessage = messages.value.find(m => m.id === messageId);
      if (myMessage) {
        displayMessage = myMessage.message;
      } else {
        // Decrypt if not found locally
        displayMessage = store.decryptMessage(messageData.encryptedContent, messageData.iv);
      }
    } else {
      // Decrypt message from other users
      displayMessage = store.decryptMessage(messageData.encryptedContent, messageData.iv);
    }
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    displayMessage = '[Encrypted message - decryption failed]';
  }
  
  const message: Message = {
    message: displayMessage,
    username: messageData.username,
    time: messageData.time,
    id: messageId
  };
  
  // Only add if it's not our own message (which we've already added)
  const isMyMessage = messageData.username === username.value;
  const alreadyExists = messages.value.some(m => m.id === messageId);
  
  if (!isMyMessage || !alreadyExists) {
    messages.value.push(message);
    scrollToBottom();
  }
};

// Add a system message
const addSystemMessage = (text: string) => {
  messages.value.push({
    message: text,
    username: 'System',
    time: new Date().toLocaleTimeString()
  });
  scrollToBottom();
};

// Send a message
const sendMessage = () => {
  // Check for connection before sending and message length
  if (!newMessage.value.trim() || !isSocketConnected.value || newMessage.value.length > 2000) return;
  
  console.log('Preparing to send message:', newMessage.value);
  isSending.value = true;
  
  // Generate a unique message ID
  const messageId = `${username.value}-${new Date().toISOString()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Store the plaintext message locally
  const plainTextMessage = newMessage.value;

  try {
    // Encrypt the message on the client side
    const encryptedData = store.encryptMessage(plainTextMessage);
    
    // Create the message locally first (using plaintext) to improve user experience
    const localMessage: Message = {
      message: plainTextMessage,
      username: username.value,
      time: new Date().toLocaleTimeString(),
      id: messageId
    };
    
    // Add to processed messages to prevent duplication
    processedMessageIds.value.add(messageId);
    
    // Add to messages immediately for better UX
    messages.value.push(localMessage);
    
    // Set a timeout for acknowledgement
    const timeoutId = setTimeout(() => {
      console.log('Message acknowledgement timed out');
    }, 5000); // 5 seconds timeout
    
    // Send encrypted message to server
    socket.emit('send_message', encryptedData, messageId, (acknowledgement: boolean) => {
      clearTimeout(timeoutId);
      
      if (!acknowledgement) {
        console.warn('Server did not acknowledge message receipt');
      } else {
        console.log('Message successfully acknowledged by server');
      }
      
      // Reset sending status after a short delay
      setTimeout(() => {
        isSending.value = false;
      }, 500);
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    isSending.value = false;
  }
  
  // Clear input regardless of success
  newMessage.value = '';
  
  // Scroll to bottom to show the new message
  scrollToBottom();
};

// Scroll to bottom of message container
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollToBottom();
    }
  });
};

// Logout and redirect to login
const logout = () => {
  console.log('Logging out');
  
  // Emit specific logout event before clearing username
  if (socket && socket.connected) {
    socket.emit('user_logout', username.value);
  }
  
  store.clearUsername();
  router.push('/');
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  gap: 20px;
  position: relative;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-top: 2px solid var(--primary-color);
}

@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
}
</style> 