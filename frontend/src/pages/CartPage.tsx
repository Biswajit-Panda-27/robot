import { motion, AnimatePresence } from "framer-motion"
import { TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon, BagIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useCart } from "@/contexts/CartContext"

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart()

  const subtotal = totalPrice
  const shipping = 10.00
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-8"
        >
          <BagIcon size={48} className="text-muted-foreground/30" />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter mb-4">Your cart is empty.</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-xs">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild className="rounded-full px-8 py-6 font-black uppercase tracking-widest text-xs">
          <Link to="/shop">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items List */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Your Bag.</h1>
            <span className="text-sm font-black uppercase tracking-widest text-primary">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col sm:flex-row gap-6 p-6 rounded-[2.5rem] bg-secondary/20 border border-black/5 dark:border-white/5 hover:bg-secondary/30 transition-all duration-500"
                >
                  <div className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-white/50 dark:bg-black/50 p-4 border border-black/5 dark:border-white/5">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div>
                      <h3 className="text-xl font-black tracking-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Collector's Edition</p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4 bg-white/50 dark:bg-black/50 rounded-full p-1 border border-black/5 dark:border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <MinusIcon size={14} weight="bold" />
                        </button>
                        <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <PlusIcon size={14} weight="bold" />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="text-lg font-black tracking-tight">${(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground/30 hover:text-destructive transition-colors"
                        >
                          <TrashIcon size={20} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-32 p-8 rounded-[3rem] bg-black text-white overflow-hidden shadow-2xl shadow-primary/20">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-2xl font-black tracking-tighter mb-8 relative z-10">Summary.</h2>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-white/40 font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-black font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40 font-black uppercase tracking-widest">Shipping</span>
                <span className="font-black font-mono">${shipping.toFixed(2)}</span>
              </div>
              <hr className="border-white/10" />
              <div className="flex justify-between text-xl pt-2">
                <span className="font-black tracking-tighter uppercase">Total</span>
                <span className="font-black font-mono text-neon-blue">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button asChild className="w-full rounded-full py-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 group relative z-10">
              <Link to="/purchase">
                Proceed to Checkout <ArrowRightIcon size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30 relative z-10">
              <div className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
