import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3003',
        ws: true,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Proxy request:', req.url);
          });
          proxy.on('proxyRes', (_proxyRes, req, _res) => {
            console.log('Proxy response:', req.url);
          });
        }
      },
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: {
      protocol: 'ws',
      clientPort: 5174,
      port: 5174,
      timeout: 60000,
      overlay: false,
    }
  }
}); 