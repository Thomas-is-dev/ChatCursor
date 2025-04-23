import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// Import views
import Login from './views/Login.vue';
import Chat from './views/Chat.vue';

// Define routes
const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/chat', name: 'chat', component: Chat },
  // Fallback route
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Create app
const app = createApp(App);

// Use router
app.use(router);

// Mount app
app.mount('#app'); 