import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files based on mode
  // This will load .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd());

  console.log(`Running in ${mode} mode`);

  // Get socket configuration from environment variables
  const socketUrl = env.VITE_SOCKET_URL || "http://localhost:3003";
  const socketPath = env.VITE_SOCKET_PATH || "/socket.io";

  console.log(
    `Socket URL: ${socketUrl.replace(
      /^(https?:\/\/[^\/]+).*$/,
      "$1"
    )}/**** (masked for security)`
  );

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        [socketPath]: {
          target: socketUrl,
          ws: true,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("Proxy error:", err);
            });
            proxy.on("proxyReq", (_proxyReq, req, _res) => {
              console.log("Proxy request:", req.url);
            });
            proxy.on("proxyRes", (_proxyRes, req, _res) => {
              console.log("Proxy response:", req.url);
            });
          },
        },
        "/api": {
          target: socketUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      hmr: {
        protocol: "ws",
        clientPort: 5174,
        port: 5174,
        timeout: 60000,
        overlay: false,
      },
    },
    define: {
      // Expose environment variables to the client
      __APP_ENV__: {
        MODE: mode,
        SOCKET_URL: socketUrl,
        SOCKET_PATH: socketPath,
        DEBUG_MODE: env.VITE_DEBUG_MODE === "true",
        ENABLE_ANIMATIONS: env.VITE_ENABLE_ANIMATIONS === "true",
        ENABLE_VOICE_MESSAGES: env.VITE_ENABLE_VOICE_MESSAGES === "true",
      },
    },
  };
});
