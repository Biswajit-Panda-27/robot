import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/contexts/ThemeContext.tsx"
import { CartProvider } from "@/contexts/CartContext.tsx"
import { OrdersProvider } from "@/contexts/OrdersContext.tsx"
import { AuthProvider } from "@/contexts/AuthContext.tsx"

import { GoogleOAuthProvider } from "@react-oauth/google"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
