import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import AnnouncementBar from "@/components/layout/AnnouncementBar"
import HomePage from "@/pages/HomePage"
import ShopPage from "@/pages/ShopPage"
import AuthPage from "@/pages/AuthPage"
import CartPage from "@/pages/CartPage"
import OrdersPage from "@/pages/OrdersPage"
import PurchasePage from "@/pages/PurchasePage"
import AccountPage from "@/pages/AccountPage"
import SetPasswordPage from "@/pages/SetPasswordPage"

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: "ease-out-cubic"
    })
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="font-sans"
        />
      </div>
    </Router>
  )
}

export default App
