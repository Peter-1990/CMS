import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import { Elements } from '@stripe/react-stripe-js' // Import Stripe Elements
import stripePromise from './utils/stripe' // Import stripe utility

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <Elements stripe={stripePromise}> {/* Wrap with Stripe Elements */}
          <App />
        </Elements>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
