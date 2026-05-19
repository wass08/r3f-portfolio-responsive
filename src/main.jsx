import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initSentry } from './config/sentry'

// Initialize Sentry for error tracking
try {
  initSentry();
} catch (error) {
  console.warn('Sentry initialization failed. Error tracking disabled.', error);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
