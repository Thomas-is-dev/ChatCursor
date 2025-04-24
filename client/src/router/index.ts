import { createRouter, createWebHistory } from 'vue-router';

// Import views
import Login from '../views/Login.vue';
import Chat from '../views/Chat.vue';

// Define routes
const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/chat', name: 'chat', component: Chat, meta: { requiresAuth: true } },
  // Fallback route
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for auth
import store from '../store';

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!store.getUsername();

  // If route requires auth and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    console.log('Route requires authentication, redirecting to login');
    next('/');
  } else {
    next();
  }
});

export default router; 