<template>
    <div class="login-container">
        <div class="cyberpunk-glow"></div>
        <div class="login-card">
            <div class="card-header">
                <h1>> MEGA<span class="accent"> CHAT</span></h1>
                <div class="subtitle">SECURE ACCESS PROTOCOL</div>
            </div>

            <div v-if="connectionError" class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                {{ connectionError }}
            </div>
            <div v-else-if="errorMessage" class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                {{ errorMessage }}
            </div>

            <div class="input-group">
                <label for="username">IDENTITY_TOKEN</label>
                <div class="input-wrapper">
                    <i class="fas fa-user icon"></i>
                    <input key="uniqueKey" type="text" id="userName" v-model="username"
                        placeholder="Enter your username" @keyup.enter="login" 
                        minlength="3" maxlength="20" 
                        ref="usernameInput" autofocus />
                </div>
            </div>

            <button @click="login" :disabled="!username.trim() || store.hasConnectionError()">
                <span class="btn-text">INITIALIZE CONNECTION</span>
                <span class="btn-icon"><i class="fas fa-plug"></i></span>
            </button>

            <div class="scanner-line"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import { socket } from '../socket';

const router = useRouter();
const username = ref('');
const errorMessage = ref<string>('');
const isLoading = ref(false);
const usernameInput = ref<HTMLInputElement | null>(null);

const connectionError = computed(() => store.getConnectionError());

onMounted(() => {
    // Check if already logged in
    const storedUsername = store.getUsername();
    if (storedUsername) {
        router.push('/chat');
        return;
    }

    // Setup socket connection
    if (!socket.connected) {
        socket.connect();
    }
});

onUnmounted(() => {
    // Clean up event listeners
    socket.off('loginSuccess');
    socket.off('loginError');
});

// Socket event handlers
socket.on('loginSuccess', (name: string) => {
    store.setUsername(name);
    router.push('/chat');
});

socket.on('loginError', ({ message }: { message: string }) => {
    errorMessage.value = message;
    isLoading.value = false;
});

const login = async () => {
    const trimmedUsername = username.value.trim();
    
    if (!trimmedUsername) {
        errorMessage.value = 'Username is required';
        return;
    }
    
    isLoading.value = true;
    errorMessage.value = '';
    
    // Ensure socket is connected before attempting login
    if (!socket.connected) {
        socket.connect();
    }
    
    socket.emit('login', { username: trimmedUsername });
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
}

.cyberpunk-glow {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(0, 208, 255, 0.2), rgba(125, 66, 255, 0.2));
    filter: blur(70px);
    animation: glow 8s infinite alternate;
    z-index: 0;
}

@keyframes glow {
    0% {
        transform: scale(0.8);
        opacity: 0.7;
    }

    100% {
        transform: scale(1.2);
        opacity: 0.9;
    }
}

.login-card {
    background-color: var(--card-bg);
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 450px;
    position: relative;
    z-index: 1;
    border: 1px solid var(--border-color);
    border-top: 2px solid var(--primary-color);
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.card-header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
}

h1 {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 36px;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 5px;
    text-shadow: 0 0 10px rgba(0, 208, 255, 0.5);
}

.accent {
    color: var(--primary-color);
}

.subtitle {
    font-size: 14px;
    color: rgba(224, 224, 224, 0.7);
    letter-spacing: 2px;
}

.input-group {
    margin-bottom: 25px;
}

label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: var(--primary-color);
    letter-spacing: 1px;
    font-size: 14px;
    text-transform: uppercase;
}

.input-wrapper {
    position: relative;
}

.icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-color);
}

input {
    width: 100%;
    padding-left: 40px;
    margin-bottom: 0;
    border-color: var(--border-color);
}

input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(0, 208, 255, 0.15);
}

.error-message {
    background-color: rgba(255, 23, 68, 0.1);
    color: var(--error-color);
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 25px;
    text-align: center;
    border-left: 3px solid var(--error-color);
    font-size: 14px;
}

.error-message i {
    margin-right: 8px;
}

button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
}

.btn-text {
    margin-right: 10px;
}

.btn-icon {
    opacity: 0.8;
}

button:hover .btn-icon {
    opacity: 1;
    transform: rotate(90deg);
    transition: transform 0.3s ease;
}

.scanner-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    animation: scan 3s infinite;
}

@keyframes scan {
    0% {
        top: 0;
    }

    50% {
        top: 100%;
    }

    100% {
        top: 0;
    }
}
</style>