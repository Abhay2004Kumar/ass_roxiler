import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // Forward all /api/* calls to the Express backend if hitting proxy
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
