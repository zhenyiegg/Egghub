// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
  // 1) Dev server: uses '/'
  // 2) Production build: uses '/Egghub/'
  base: mode === 'production' ? '/Egghub/' : '/',

  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
