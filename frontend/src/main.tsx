import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/contexts/ThemeContext.tsx"
import { CartProvider } from "@/contexts/CartContext.tsx"
import { OrdersProvider } from "@/contexts/OrdersContext.tsx"
import { AuthProvider } from "@/contexts/AuthContext.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
