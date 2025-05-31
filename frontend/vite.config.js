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

{/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // No marcar como externas dependencias necesarias en el bundle
    rollupOptions: {
      external: [], // Vacía el array o solo incluye lo realmente necesario
    }
  }
}) */}