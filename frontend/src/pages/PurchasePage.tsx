import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircleIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, RocketIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useCart } from "@/contexts/CartContext"
import { useOrders } from "@/contexts/OrdersContext"

const PurchasePage = () => {
  const { cart, totalPrice, clearCart } = useCart()
  const { addOrder } = useOrders()
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = totalPrice
  const shipping = 10.00
  const total = subtotal + shipping

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    setTimeout(() => {
      // Save order to history
      addOrder(cart, total)
      
      setIsProcessing(false)
      setStep(3)
      clearCart()
    }, 2500)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-neon-green/20 flex items-center justify-center mb-8"
        >
          <CheckCircleIcon size={64} className="text-neon-green" weight="fill" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-center">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-12 text-center max-w-md">
          Your futuristic treasures are being prepared in our lab. We'll notify you when they're ready for takeoff.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="rounded-full px-10 py-6 font-black uppercase tracking-widest text-xs">
            <Link to="/orders">View My Orders</Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-10 py-6 font-black uppercase tracking-widest text-xs">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Checkout Forms */}
        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-12">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>1</div>
            <div className="h-px w-8 bg-black/10" />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>2</div>
            <h1 className="text-3xl font-black tracking-tighter ml-4">
              {step === 1 ? "Shipping Details" : "Payment Information"}
            </h1>
          </div>

          <div className="space-y-8">
            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid gap-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Shipping Address</label>
                  <input type="text" placeholder="123 Future Lane" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">City</label>
                    <input type="text" placeholder="Neo Tokyo" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">State</label>
                    <input type="text" placeholder="Sector 7" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Zip</label>
                    <input type="text" placeholder="888-00" className="w-full bg-secondary/20 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="rounded-full py-8 font-black uppercase tracking-widest text-xs mt-4">
                  Continue to Payment <ArrowRightIcon size={18} className="ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid gap-6"
              >
                <div className="p-8 rounded-[2rem] bg-black text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                      <div className="w-8 h-8 rounded-full bg-white/10 -ml-4" />
                    </div>
                    <CreditCardIcon size={32} weight="bold" className="text-white/20" />
                  </div>
                  <div className="space-y-6">
                    <input type="text" placeholder="Card Number" className="w-full bg-transparent border-b border-white/20 pb-2 outline-none text-xl font-mono tracking-widest" />
                    <div className="flex gap-12">
                      <input type="text" placeholder="MM/YY" className="w-24 bg-transparent border-b border-white/20 pb-2 outline-none text-sm font-mono" />
                      <input type="text" placeholder="CVC" className="w-24 bg-transparent border-b border-white/20 pb-2 outline-none text-sm font-mono" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full py-8 px-12 font-black uppercase tracking-widest text-xs border-black/5">
                    Go Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="flex-grow rounded-full py-8 font-black uppercase tracking-widest text-xs bg-primary relative overflow-hidden"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <RocketIcon size={20} className="animate-bounce" /> Processing...
                      </span>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mini Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="p-8 rounded-[3rem] bg-secondary/20 border border-black/5">
            <h2 className="text-xl font-black tracking-tighter mb-8">Order Overview.</h2>
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white/50 dark:bg-black/50 p-2 border border-black/5">
                    <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-black tracking-tight">{item.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black tracking-tighter pt-2">
                <span>TOTAL</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <TruckIcon size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <ShieldCheckIcon size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">Buyer Protection Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchasePage
