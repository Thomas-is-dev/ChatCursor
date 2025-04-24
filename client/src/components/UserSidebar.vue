<template>
  <div class="chat-sidebar">
    <div class="sidebar-header">
      <h2>LIST<span class="accent">CHATTERS</span></h2>
      <div class="online-indicator">
        <div class="pulse"></div>
        <span>{{ users.length }} ONLINE</span>
      </div>
    </div>
    
    <div class="users-list">
      <div v-for="user in users" :key="user" class="user-item" :class="{ 'current-user': user === username }">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user }}</div>
          <div v-if="user === username" class="user-status">YOU</div>
        </div>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <div class="system-status">SYSTEM STATUS: 
        <span :class="isSocketConnected ? 'status-online' : 'status-offline'">
          {{ isSocketConnected ? 'ONLINE' : 'OFFLINE' }}
        </span>
      </div>
      <div class="encryption-status">ENCRYPTION: <span class="status-secure">SECURE <i class="fas fa-lock"></i></span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  users: string[];
  username: string;
  isSocketConnected: boolean;
}>();
</script>

<style scoped>
.chat-sidebar {
  width: 280px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-left: 2px solid var(--accent-color);
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.accent {
  color: var(--primary-color);
}

.online-indicator {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(224, 224, 224, 0.7);
  letter-spacing: 1px;
}

.pulse {
  width: 8px;
  height: 8px;
  background-color: var(--success-color);
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.pulse::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--success-color);
  border-radius: 50%;
  animation: pulse 2s infinite;
  opacity: 0.7;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background-color: rgba(255, 255, 255, 0.03);
}

.user-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--border-color);
}

.current-user {
  background-color: rgba(0, 208, 255, 0.1);
  border-color: rgba(0, 208, 255, 0.3);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: var(--darker-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: var(--primary-color);
  font-size: 18px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.user-status {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  padding: 15px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  letter-spacing: 1px;
}

.system-status, .encryption-status {
  margin-bottom: 5px;
  color: rgba(224, 224, 224, 0.7);
}

.status-online, .status-secure {
  color: var(--success-color);
  font-weight: 600;
}

.status-offline {
  color: var(--error-color);
  font-weight: 600;
}

@media (max-width: 768px) {
  .chat-sidebar {
    width: 100%;
    max-height: 200px;
  }
}
</style> 