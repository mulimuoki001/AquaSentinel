// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 Required for client-side routing in production
  build: {
    outDir: "dist", // 👈 Match where Express serves static files
    emptyOutDir: true, // Clean before build
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
