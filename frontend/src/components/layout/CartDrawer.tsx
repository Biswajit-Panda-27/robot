import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash, CreditCard, CheckCircle, ArrowRight, CaretLeft } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { toast } from "react-toastify"

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, totalPrice, totalItems } = useCart();
  const { addOrder } = useOrders();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (checkoutStep === 'cart') setCheckoutStep('shipping');
    else if (checkoutStep === 'shipping') setCheckoutStep('payment');
    else if (checkoutStep === 'payment') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        addOrder([...cart], totalPrice);
        toast.success("Order secured successfully!");
        setCheckoutStep('success');
      }, 2000);
    }
  };

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    toast.info(`${name} removed from cart`);
  };

  const closeAndReset = () => {
    setIsCartOpen(false);
    if (checkoutStep === 'success') {
      clearCart();
      setCheckoutStep('cart');
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border p-0 overflow-hidden flex flex-col font-sans">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase">
              {checkoutStep === 'cart' && "Your Cart"}
              {checkoutStep === 'shipping' && "Shipping"}
              {checkoutStep === 'payment' && "Payment"}
              {checkoutStep === 'success' && "Confirmed"}
            </SheetTitle>
            {checkoutStep !== 'cart' && checkoutStep !== 'success' && (
              <Button variant="ghost" size="sm" onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')} className="font-black text-[10px] uppercase tracking-widest gap-1 cursor-pointer">
                <CaretLeft size={14} weight="bold" /> Back
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6">
          {checkoutStep === 'cart' && (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-black text-xl tracking-tight">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm mt-2">Add some masterworks to your collection.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-secondary rounded-2xl overflow-hidden shrink-0 border border-border">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                      <div>
                        <h4 className="font-black tracking-tight text-lg">{item.name}</h4>
                        <div className="text-primary font-black mt-1">${item.price}.00</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-secondary rounded-full p-1 border border-border">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-background/50 hover:bg-background cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={10} weight="bold" />
                          </Button>
                          <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-background/50 hover:bg-background cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={10} weight="bold" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full cursor-pointer"
                          onClick={() => handleRemove(item.id, item.name)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {checkoutStep === 'shipping' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input placeholder="John Doe" className="h-12 rounded-2xl bg-secondary border-none px-6 font-black text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address</label>
                  <Input placeholder="123 Future Lane" className="h-12 rounded-2xl bg-secondary border-none px-6 font-black text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                    <Input placeholder="Neo Tokyo" className="h-12 rounded-2xl bg-secondary border-none px-6 font-black text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                    <Input placeholder="101-0001" className="h-12 rounded-2xl bg-secondary border-none px-6 font-black text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-primary text-primary-foreground rounded-[2rem] border-none shadow-2xl shadow-primary/20 relative overflow-hidden group p-8">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <CreditCard size={24} weight="fill" className="text-white" />
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white font-black uppercase tracking-widest text-[8px]">Secure Protocol</Badge>
                  </div>
                  <div className="text-xl font-black tracking-widest mb-6">**** **** **** 4242</div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60 block">Authorized Node</span>
                       <div className="font-black uppercase text-xs">JOHN DOE</div>
                    </div>
                    <div className="space-y-1 text-right">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60 block">Expiry</span>
                       <div className="font-black text-xs">12/29</div>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CVV Security Code</label>
                <Input type="password" placeholder="***" maxLength={3} className="h-12 rounded-2xl bg-secondary border-none px-6 font-black text-sm" />
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
                <CheckCircle size={48} weight="fill" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase">Order Secured</h3>
                <p className="text-muted-foreground text-sm">Your masterpiece is being prepared for transit. Expect a transmission soon.</p>
              </div>
              
              <Card className="w-full bg-secondary/50 rounded-[2.5rem] border-border overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="font-black text-xs uppercase">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                      <span className="font-black text-primary">${item.price * item.quantity}.00</span>
                    </div>
                  ))}
                  <Separator className="opacity-50" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Authorized</span>
                    <span className="text-2xl font-black text-primary">${totalPrice}.00</span>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={closeAndReset}
                className="w-full rounded-full h-16 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 cursor-pointer"
              >
                Return to Grid
              </Button>
            </div>
          )}
        </div>

        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="p-8 border-t border-border bg-background/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Credits</span>
              <span className="text-3xl font-black">${totalPrice}.00</span>
            </div>
            <Button 
              disabled={isProcessing}
              onClick={handleCheckout}
              className="w-full rounded-full h-16 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 relative cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <ArrowClockwiseIcon className="w-4 h-4 animate-spin" />
                  Synchronizing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {checkoutStep === 'cart' && "Proceed to Shipping"}
                  {checkoutStep === 'shipping' && "Proceed to Payment"}
                  {checkoutStep === 'payment' && "Confirm Purchase"}
                  <ArrowRight size={16} weight="bold" />
                </div>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Placeholder for missing icon
const ArrowClockwiseIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
    <path d="M224,128a96,96,0,0,1-160,71L48,216V160h56L84.4,180.4a80,80,0,1,0,0-104.8L104.4,96H48V40l20.4,20.4A96,96,0,0,1,224,128Z" />
  </svg>
)

export default CartDrawer;
