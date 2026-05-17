import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    server: {
      host: "127.0.0.1",
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3001",
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
