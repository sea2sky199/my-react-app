import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/compounds': { target: 'http://localhost:8002', changeOrigin: true },
      '/utils': { target: 'http://localhost:8002', changeOrigin: true },
      '/userInfo': { target: 'http://localhost:8002', changeOrigin: true },
    },
    watch: {
      ignored: ['**/data_api/venv/**', '**/data_api/**/__pycache__/**'],
    },
  },
  optimizeDeps: {
    include: [
      'prop-types',
      'react-beautiful-dnd',
      'react-csv',
      'react-infinite-scroller',
      'react-icons-kit',
    ],
  },
})
