import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Bicentenario/', // IMPORTANTE: Reemplaza con el nombre de tu repositorio
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['react-big-calendar', 'date-fns', 'react-i18next'],
      
    },
    emptyOutDir: true
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