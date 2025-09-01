import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Dev proxy used when running `vite` locally. In production the front must call
      '/api': 'http://localhost:4000'
    }
  }
})
