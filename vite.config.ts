import { defineConfig } from 'vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = new URL(env.VITE_API_BASE_URL || 'http://127.0.0.1:3001')

  if (apiTarget.hostname === 'localhost') {
    apiTarget.hostname = '127.0.0.1'
  }

  return {
    plugins: [react()],
    base: '/',
    server: {
      proxy: {
        '/api': {
          target: apiTarget.origin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
