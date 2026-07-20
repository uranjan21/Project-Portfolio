import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const bePort = process.env.VITE_BE_PORT ?? '8001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${bePort}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
