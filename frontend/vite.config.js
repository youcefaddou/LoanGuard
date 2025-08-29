import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/app/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
  // Dev proxy used when running `vite` locally. In production the front must call
  // the backend via the environment variable VITE_API_URL (configured at build time).
  '/api': 'http://localhost:4000'
    }
  }
})
