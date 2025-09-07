import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': {
        target: 'https://user20431889-u4ihnuw2.tunnel.vk-apps.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
