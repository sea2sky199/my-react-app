import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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
