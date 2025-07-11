// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // ✅ Needed for correct paths in production
  base: "/",

  // ✅ Output settings
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  // ✅ Local dev proxy to backend
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      // These will forward requests from frontend to backend in dev mode
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/dashboard": "http://localhost:3000",
      "/api": "http://localhost:3000",
      "/uploads": "http://localhost:3000",
    },
  },
});
