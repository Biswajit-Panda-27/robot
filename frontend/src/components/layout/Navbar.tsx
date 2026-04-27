import { useState, useEffect } from "react"
import { ShoppingCart, User, List, X, Moon, Sun, Cpu } from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl px-4">
      <nav className={`
        relative w-full px-6 py-3 flex justify-between items-center transition-all duration-500
        ${scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-2xl py-3 rounded-[2rem] border shadow-2xl shadow-black/5" : "bg-transparent py-5 rounded-[2.5rem] border-transparent"}
      `}>
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 glow-blue">
            <Cpu size={24} weight="fill" />
          </div>
          <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">ROBOT</span>
        </Link>

        {/* Center Navigation - Dock Style */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border">
          {[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Support", path: "/support" }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`
                px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                ${location.pathname === item.path ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors relative">
            <ShoppingCart size={20} weight="bold" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] text-white rounded-full flex items-center justify-center font-black">0</span>
          </button>

          <button className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
            <User size={18} weight="bold" />
            Account
          </button>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>

        {/* Mobile Flyout Menu */}
        {isOpen && (
          <div className="absolute top-[110%] left-0 w-full bg-white dark:bg-black border rounded-3xl p-6 md:hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold">Home</Link>
              <Link to="/shop" onClick={() => setIsOpen(false)} className="text-lg font-bold text-muted-foreground">Shop</Link>
              <Link to="/support" onClick={() => setIsOpen(false)} className="text-lg font-bold text-muted-foreground">Support</Link>
              <hr className="my-2" />
              <button className="flex items-center gap-3 bg-primary text-primary-foreground p-4 rounded-2xl justify-center font-bold">
                <User size={20} weight="bold" />
                LOGIN / SIGNUP
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar
