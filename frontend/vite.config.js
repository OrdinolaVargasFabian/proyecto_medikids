import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://localhost:8085', changeOrigin: true },
      '/usuario': { target: 'http://localhost:8085', changeOrigin: true },
      '/cliente': { target: 'http://localhost:8085', changeOrigin: true },
      '/paciente': { target: 'http://localhost:8085', changeOrigin: true },
      '/pagos': { target: 'http://localhost:8085', changeOrigin: true },
      '/medico': { target: 'http://localhost:8085', changeOrigin: true },
      '/especialidad': { target: 'http://localhost:8085', changeOrigin: true },
      '/actuator': { target: 'http://localhost:8085', changeOrigin: true },
    }
  }
})
