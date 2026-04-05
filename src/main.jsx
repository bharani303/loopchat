import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// 🔥 Elite Crypto Polyfill for production stability
if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = window.msCrypto || {};
}
if (typeof window !== 'undefined' && window.crypto && !window.crypto.subtle) {
  // Polyfill subtle if missing (common in non-secure contexts)
  window.crypto.subtle = window.crypto.webkitSubtle;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="936129454686-pinmb12ulahhfm6168su7n8tm9in1ps2.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)

