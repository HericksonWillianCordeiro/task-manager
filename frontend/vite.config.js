import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Base URL para GitHub Pages — ajuste para o nome do seu repositório
  base: '/task-manager/',

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    css: false,
  },
})
