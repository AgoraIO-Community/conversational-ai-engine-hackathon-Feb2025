import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    },
    allowedHosts: [
      'highways-requires-stores-robert.trycloudflare.com',
      'mentalhealthcompanion.netlify.app',
      // Keep any existing allowed hosts
    ]

  }
});