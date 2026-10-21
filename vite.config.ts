
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = new URL(
    env.VITE_API_BASE_URL || 'https://api.mishikshak.quore-tex.com'
  )

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
