import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API requests to the Express backend during development.
    // In production, configure your hosting (Vercel/Nginx) to proxy /api to the backend.
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
