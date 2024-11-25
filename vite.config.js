import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Percorso relativo per Netlify
  build: {
    outDir: 'dist' // Percorso di output della build
  }
})
