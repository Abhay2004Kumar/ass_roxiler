import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward all /api/* calls to the Express backend
      '/api': {
        target: 'https://ass-roxiler.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
