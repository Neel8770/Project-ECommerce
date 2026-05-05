import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// WHAT: Importing the Context Providers
// WHY: To broadcast the Cart and Auth data to every single component in your app
// HOW: These act as "Wrappers" that hold the global state
import { AuthProvider } from './context/AuthContext.jsx' 
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* WHAT: Nesting the Providers */}
      {/* WHY: The order matters! CartProvider often needs the User Token from AuthProvider */}
      {/* HOW: By wrapping App, even the deepest component can use useCart() */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)