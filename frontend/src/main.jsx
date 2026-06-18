import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { LenisProvider } from './app/components/LenisProvider'
import { NotificationProvider } from './app/context/NotificationContext.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// ── Cambio de título al salir de la pestaña ──
const TITLE_DEFAULT = 'MediKids Pediatras';
const TITLE_AWAY    = '😢 Vuelva y agenda una cita';
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? TITLE_AWAY : TITLE_DEFAULT;
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
)