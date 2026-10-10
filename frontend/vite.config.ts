import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // During development, requests to /api go to the Spring Boot server.
  server: { proxy: { '/api': 'http://localhost:8080' } },
  preview: { proxy: { '/api': 'http://localhost:8080' } },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
