import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import { initializeSecurityChecks } from './utils/securityHeaders'
import './index.css'

// 🔒 BEZPIECZEŃSTWO: Inicjalizacja sprawdzeń bezpieczeństwa przy starcie
initializeSecurityChecks()

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // W produkcji można tutaj wysłać błąd do serwisu logowania
          if (import.meta.env.PROD) {
            // Przykład integracji z Sentry (odkomentuj gdy dodasz Sentry):
            // Sentry.captureException(error, { contexts: { react: errorInfo } });
            console.error('Production error:', error, errorInfo);
          }
        }}
      >
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
} else {
  console.error('Root element not found')
}