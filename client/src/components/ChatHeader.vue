<template>
  <div class="chat-header">
    <div class="header-title">
      <h2>MAIN<span class="accent">FRAME</span></h2>
      <div class="subtitle">GLOBAL COMMUNICATIONS NETWORK</div>
    </div>
    
    <div class="header-user-info">
      <span class="user-label">IDENTITY:</span>
      <strong class="user-value">{{ username }}</strong>
      <button class="logout-btn" @click="emitLogout">
        <i class="fas fa-power-off"></i>
        <span>DISCONNECT</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  username: string;
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const emitLogout = () => {
  emit('logout');
};
</script>

<style scoped>
.chat-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h2 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.accent {
  color: var(--primary-color);
}

.subtitle {
  font-size: 12px;
  color: rgba(224, 224, 224, 0.7);
  letter-spacing: 1px;
}

.header-user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.user-label {
  font-size: 12px;
  color: rgba(224, 224, 224, 0.7);
  margin-right: 5px;
}

.user-value {
  color: var(--primary-color);
  margin-right: 15px;
}

.logout-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  font-size: 12px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
}

.logout-btn i {
  margin-right: 8px;
}
</style> 