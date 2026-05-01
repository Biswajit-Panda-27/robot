import { useState, useEffect } from "react"
import { PackageIcon, UserIcon, ListIcon, MoonIcon, SunIcon, RocketIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { useTheme } from "@/contexts/ThemeContext"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Support", path: "/support" }
  ]

  return (
    <TooltipProvider>
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl px-4 font-sans">
        <nav className={cn(
          "relative w-full px-6 py-3 flex justify-between items-center transition-all duration-500 rounded-[2.5rem] border border-transparent",
          scrolled && "bg-background/90 backdrop-blur-xl py-3 rounded-[2rem] border-border shadow-xl"
        )}>
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple text-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              <RocketIcon size={24} weight="fill" />
            </div>
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">TOYWORLD</span>
          </Link>

          {/* Center Navigation - Dock Style */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full w-9 h-9"
                >
                  {theme === "dark" ? <SunIcon size={18} weight="bold" /> : <MoonIcon size={18} weight="bold" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-[10px] font-black uppercase">Toggle Theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/orders">
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                    <PackageIcon size={18} weight="bold" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-[10px] font-black uppercase">My Orders</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 relative">
                    <ShoppingCartIcon size={18} weight="bold" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-black rounded-full flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="text-[10px] font-black uppercase">Shopping Cart</TooltipContent>
            </Tooltip>

            <Button asChild className="hidden lg:flex rounded-full px-6 font-black text-[10px] uppercase tracking-widest h-10 ml-2 shadow-lg shadow-primary/20">
              <Link to={isAuthenticated ? "/account" : "/auth"}>
                <UserIcon size={18} weight="bold" className="mr-2" />
                {isAuthenticated ? "My Account" : "Account"}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                  <ListIcon size={24} weight="bold" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full rounded-b-[2rem] border-none pt-20 bg-background/95 backdrop-blur-xl">
                <SheetHeader className="hidden">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 items-center py-10">
                  {navLinks.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path} 
                      className="text-2xl font-black tracking-tighter hover:text-primary transition-colors uppercase"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="w-1/2 border-border opacity-20" />
                  <Button asChild className="w-full max-w-xs rounded-full py-6 font-black uppercase tracking-widest text-xs">
                    <Link to={isAuthenticated ? "/account" : "/auth"}>
                      <UserIcon size={20} weight="bold" className="mr-2" />
                      {isAuthenticated ? "My Account" : "Login / Signup"}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  )
}

export default Navbar
