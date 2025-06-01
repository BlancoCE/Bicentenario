import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Bicentenario/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
  },
  build: {
    commonjsOptions: {
      include: [/i18next/, /node_modules/]
    }
  }
})