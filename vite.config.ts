import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Client dev server proxies /api to the Express server (server/index.ts).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5177',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
