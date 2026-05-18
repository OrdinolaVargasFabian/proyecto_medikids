import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:8085'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/auth': { target: apiUrl, changeOrigin: true },
        '/usuario': { target: apiUrl, changeOrigin: true },
        '/cliente': { target: apiUrl, changeOrigin: true },
        '/paciente': { target: apiUrl, changeOrigin: true },
        '/pagos': { target: apiUrl, changeOrigin: true },
        '/medico': { target: apiUrl, changeOrigin: true },
        '/especialidad': { target: apiUrl, changeOrigin: true },
        '/actuator': { target: apiUrl, changeOrigin: true },
      }
    }
  }
})
