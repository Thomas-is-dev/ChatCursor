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
        ref="messageInput"
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
import { useRouter, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import store from '../store';
import { socket } from '../socket.ts';

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
const username = ref(store.getUsername());
const users = ref<string[]>([]);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const messagesContainer = ref<{ scrollToBottom: () => void } | null>(null);
const messageInput = ref<{ focus: () => void } | null>(null);
const isSending = ref(false);
const processedMessageIds = ref(new Set<string>());
const isSocketConnected = ref(socket.connected);

// Lifecycle hooks
onMounted(() => {
  // Check if user is logged in
  if (!username.value) {
    router.push('/login');
    return;
  }

  // Initialize socket connection and event listeners
  setupSocketListeners();
  socket.connect();
  focusMessageInput();
});

// Use beforeRouteEnter navigation guard
router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.name === 'chat') {
    next(() => {
      focusMessageInput();
    });
  } else {
    next();
  }
});

onUnmounted(() => {
  cleanupEventListeners();
  socket.disconnect();
});

// Clean up event listeners to prevent memory leaks
const cleanupEventListeners = () => {
  socket.off('receive_message');
  socket.off('user_list');
  socket.off('user_joined');
  socket.off('user_left');
  socket.off('reconnection_successful');
  socket.off('connect');
  socket.off('disconnect');
};

// Setup socket event listeners
const setupSocketListeners = () => {
  // Connection status
  socket.on('connect', () => {
    isSocketConnected.value = true;
    if (username.value) {
      socket.emit('reconnect', { username: username.value });
    }
  });
  
  socket.on('disconnect', () => {
    isSocketConnected.value = false;
  });

  // Message handling
  socket.on('receive_message', async (messageData: { 
    encryptedContent: string, 
    iv: string,
    username: string, 
    time: string, 
    id?: string 
  }) => {
    handleIncomingMessage(messageData);
  });
  
  // User management
  socket.on('user_list', (userList: string[]) => {
    users.value = userList;
  });
  
  socket.on('user_joined', (user: string) => {
    if (!users.value.includes(user)) {
      users.value.push(user);
      addSystemMessage(`${user} has joined the network`);
    }
  });
  
  socket.on('user_left', (user: string) => {
    users.value = users.value.filter(u => u !== user);
    addSystemMessage(`${user} has disconnected from the network`);
  });
  
  socket.on('reconnection_successful', (user: string) => {
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
        // Server has already filtered the message, no need to filter again
      }
    } else {
      // Decrypt message from other users
      displayMessage = store.decryptMessage(messageData.encryptedContent, messageData.iv);
      // Server has already filtered the message, no need to filter again
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
  
  try {
    // Send the raw unfiltered message to the server for server-side filtering and encryption
    const rawMessage = newMessage.value;
    
    // Create a temporary local message (will be replaced when server sends back filtered version)
    const localMessage: Message = {
      message: rawMessage,
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
    
    // Send unencrypted message to server for filtering and broadcasting
    socket.emit('send_unencrypted_message', rawMessage, messageId, (acknowledgement: boolean) => {
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
  
  // Focus the input after sending
  focusMessageInput();
};

// Scroll to bottom of message container
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollToBottom();
    }
  });
};

// Focus the message input field
const focusMessageInput = () => {
  if (!messageInput.value) {
    const maxAttempts = 5;
    let attempts = 0;
    
    const tryFocus = () => {
      if (messageInput.value) {
        messageInput.value.focus();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryFocus, 100);
      }
    };
    
    tryFocus();
  } else {
    messageInput.value.focus();
  }
};

// Logout and redirect to login
const logout = () => {
  console.log('Logging out');
  
  // Emit specific logout event before clearing username
  if (socket && socket.connected) {
    socket.emit('user_logout', username.value);
  }
  
  store.clearUsername();
  router.push('/login');
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