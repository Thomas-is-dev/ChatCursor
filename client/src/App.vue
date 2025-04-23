<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App component uses router-view only, no additional setup needed
</script>

<style>
:root {
  --primary-color: #00d0ff;
  --primary-dark: #0099cc;
  --accent-color: #7d42ff;
  --text-color: #e0e0e0;
  --dark-bg: #121212;
  --darker-bg: #0a0a0a;
  --card-bg: #1e1e1e;
  --card-hover: #252525;
  --border-color: #303030;
  --success-color: #00e676;
  --error-color: #ff1744;
  --gradient-start: #00d0ff;
  --gradient-end: #7d42ff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Rajdhani', 'Orbitron', 'Arial', sans-serif;
  transition: all 0.2s ease;
}

body {
  background-color: var(--dark-bg);
  color: var(--text-color);
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 208, 255, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(125, 66, 255, 0.05) 0%, transparent 20%);
  background-attachment: fixed;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
}

button {
  cursor: pointer;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-15deg);
  transition: all 0.5s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1);
}

button:hover::after {
  left: 100%;
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  background: #2a2a2a;
  color: #5a5a5a;
  box-shadow: none;
  cursor: not-allowed;
}

button:disabled::after {
  display: none;
}

input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  background-color: var(--darker-bg);
  color: var(--text-color);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 208, 255, 0.2);
}

@font-face {
  font-family: 'Rajdhani';
  src: url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
}

@font-face {
  font-family: 'Orbitron';
  src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--darker-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}
</style> 