import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  // Optimisations build
  build: {
    // Tree shaking amélioré
    rollupOptions: {
      output: {
        manualChunks: {
          // Sépare les librairies lourdes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        }
      }
    },
    // Compression et minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Taille des chunks
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimisations dev
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  
  // Préchargement intelligent
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env']
  }
})