import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/stockpiles/',
  build: {
    outDir: '../StockpileManagement.Api/wwwroot',
    emptyOutDir: true,
  },
  plugins: [react()],
  server: {
    proxy: {
      '/stockpiles/api': 'http://localhost:5286'
    },
  },
})
