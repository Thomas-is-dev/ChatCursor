<template>
  <div class="message-input">
    <div v-if="!isSocketConnected" class="connection-error">
      <i class="fas fa-exclamation-triangle"></i>
      DISCONNECTED FROM SERVER. RECONNECTING...
    </div>
    <div class="input-wrapper">
      <input
        ref="inputElement"
        type="text"
        :value="modelValue"
        @input="updateValue"
        placeholder="Type your message..."
        @keyup.enter="emitSend"
        maxlength="2000"
        autofocus
      />
      <button @click="emitSend" :disabled="!isInputValid || !isSocketConnected">
        <i class="fas fa-paper-plane"></i>
        <span>TRANSMIT</span>
      </button>
    </div>
    <div class="input-status">
      <span v-if="isSending">TRANSMITTING DATA...</span>
      <span v-else-if="!isSocketConnected">CONNECTION LOST</span>
      <span v-else-if="modelValue.length > 1800">
        <i class="fas fa-exclamation-triangle"></i> CHAR LIMIT:
        {{ modelValue.length }}/2000
      </span>
      <span v-else>DATA STREAM READY ({{ modelValue.length }}/2000)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  modelValue: string;
  isSocketConnected: boolean;
  isSending: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "send"): void;
}>();

const inputElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
  // Focus input element when component is mounted
  setTimeout(() => {
    if (inputElement.value) {
      inputElement.value.focus();
    }
  }, 100); // Small delay to ensure DOM is fully rendered
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const emitSend = () => {
  if (isInputValid.value) {
    emit("send");
  }
};

const isInputValid = computed(() => {
  return (
    props.modelValue.trim().length > 0 &&
    props.modelValue.length <= 2000 &&
    props.isSocketConnected
  );
});

// Focus method to be called from parent component
const focus = () => {
  if (inputElement.value) {
    inputElement.value.focus();
  }
};

// Expose the focus method to parent components
defineExpose({ focus });
</script>

<style scoped>
.message-input {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--card-bg);
}

.input-wrapper {
  display: flex;
  position: relative;
}

.input-wrapper input {
  flex: 1;
  margin-right: 10px;
  background-color: var(--darker-bg);
  border-color: var(--border-color);
  padding-right: 120px;
}

.input-wrapper button {
  width: auto;
  padding: 0 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity 0.2s;
}

.input-wrapper button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-wrapper button i {
  margin-right: 8px;
}

.input-status {
  font-size: 11px;
  margin-top: 8px;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 1px;
  text-align: right;
}

.connection-error {
  background-color: rgba(255, 23, 68, 0.1);
  color: var(--error-color);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-align: center;
  border-left: 3px solid var(--error-color);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.connection-error i {
  margin-right: 8px;
}
</style>
