//<reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/deepl': {
        target: 'https://api-free.deepl.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/deepl/, '')
      }
    }
  }
})
