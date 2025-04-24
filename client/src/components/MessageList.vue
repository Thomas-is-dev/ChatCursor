<template>
  <div class="messages-container" ref="containerRef">
    <div v-if="messages.length === 0" class="no-messages">
      <div class="no-messages-icon">
        <i class="fas fa-comment-slash"></i>
      </div>
      <div class="no-messages-text">Secure channel initialized. Awaiting data transmission.</div>
    </div>
    
    <div v-else>
      <div v-for="(message, index) in messages" :key="index" 
        class="message-item" 
        :class="{ 
          'my-message': message.username === username,
          'system-message': message.username === 'System'
        }">
        <div class="message-header">
          <span class="message-user">{{ message.username }}</span>
          <span class="message-time">{{ message.time }}</span>
        </div>
        <div class="message-content">{{ filterMessage(message.message) }}</div>
        <div class="message-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { filterMessage } from '../utils/messageFilter';

interface Message {
  message: string;
  username: string;
  time: string;
  id?: string;
}

defineProps<{
  messages: Message[];
  username: string;
}>();

const containerRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  }
};

// Expose methods to parent component
defineExpose({
  scrollToBottom
});
</script>

<style scoped>
.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--darker-bg);
  position: relative;
}

.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(224, 224, 224, 0.5);
  padding: 20px;
}

.no-messages-icon {
  font-size: 40px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-messages-text {
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
}

.message-item {
  margin-bottom: 20px;
  max-width: 70%;
  padding: 15px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  position: relative;
  clear: both;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.my-message {
  background-color: rgba(0, 208, 255, 0.1);
  float: right;
  border-color: rgba(0, 208, 255, 0.3);
}

.system-message {
  background-color: rgba(125, 66, 255, 0.1);
  border-color: rgba(125, 66, 255, 0.3);
  max-width: 85%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.message-header {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
  gap: 15px;
}

.message-user {
  font-weight: bold;
  color: var(--primary-color);
  margin-right: auto;
}

.my-message .message-user {
  color: var(--primary-color);
}

.system-message .message-user {
  color: var(--accent-color);
}

.message-time {
  color: rgba(224, 224, 224, 0.5);
}

.message-content {
  word-wrap: break-word;
  line-height: 1.5;
}

.message-glow {
  position: absolute;
  bottom: -5px;
  left: 10px;
  right: 10px;
  height: 10px;
  background: radial-gradient(ellipse at center, rgba(0, 208, 255, 0.15) 0%, transparent 70%);
  opacity: 0.5;
}

.my-message .message-glow {
  background: radial-gradient(ellipse at center, rgba(0, 208, 255, 0.2) 0%, transparent 70%);
}

.system-message .message-glow {
  background: radial-gradient(ellipse at center, rgba(125, 66, 255, 0.2) 0%, transparent 70%);
}

@media (max-width: 768px) {
  .message-item {
    max-width: 85%;
  }
}
</style> 