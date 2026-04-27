import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HomePage from "@/pages/HomePage"
import ShopPage from "@/pages/ShopPage"

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
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
