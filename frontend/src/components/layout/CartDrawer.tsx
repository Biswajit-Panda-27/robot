import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash, CreditCard, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';

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
        setCheckoutStep('success');
        // We don't clear cart yet so they can see what they bought in success screen
      }, 2000);
    }
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
      <SheetContent className="w-full sm:max-w-md bg-white dark:bg-black border-l border-black/5 dark:border-white/10 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-6 border-b border-black/5 dark:border-white/10">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-black tracking-tighter">
              {checkoutStep === 'cart' && "YOUR CART"}
              {checkoutStep === 'shipping' && "SHIPPING"}
              {checkoutStep === 'payment' && "PAYMENT"}
              {checkoutStep === 'success' && "CONFIRMED"}
            </SheetTitle>
            {checkoutStep !== 'cart' && checkoutStep !== 'success' && (
              <Button variant="ghost" size="sm" onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart')} className="font-bold text-[10px] uppercase tracking-widest">
                Back
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
                    <div className="w-24 h-24 bg-secondary/30 rounded-2xl overflow-hidden shrink-0 border border-black/5">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                      <div>
                        <h4 className="font-black tracking-tight text-lg">{item.name}</h4>
                        <div className="text-primary font-black mt-1">${item.price}.00</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1 border border-black/5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-white dark:hover:bg-black"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={12} weight="bold" />
                          </Button>
                          <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-white dark:hover:bg-black"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={12} weight="bold" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => removeFromCart(item.id)}
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
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-secondary/30 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Address</label>
                  <input type="text" placeholder="123 Future Lane" className="w-full bg-secondary/30 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">City</label>
                    <input type="text" placeholder="Neo Tokyo" className="w-full bg-secondary/30 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Postal Code</label>
                    <input type="text" placeholder="101-0001" className="w-full bg-secondary/30 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-primary/10 rounded-[2rem] p-6 border border-primary/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                      <CreditCard size={24} weight="fill" />
                    </div>
                    <Badge variant="outline" className="border-primary text-primary font-black uppercase tracking-widest text-[8px]">Dummy Card</Badge>
                  </div>
                  <div className="text-xl font-black tracking-widest mb-4">**** **** **** 4242</div>
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Card Holder</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Expires</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold uppercase">John Doe</div>
                    <div className="font-bold">12/29</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">CVV</label>
                <input type="password" placeholder="***" maxLength={3} className="w-full bg-secondary/30 border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <CheckCircle size={48} weight="fill" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tighter mb-2">ORDER SECURED</h3>
                <p className="text-muted-foreground">Your masterpiece is being prepared for transit. Expect a transmission soon.</p>
              </div>
              <div className="w-full bg-secondary/20 rounded-3xl p-6 border border-black/5 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-bold">{item.name} x {item.quantity}</span>
                    <span className="font-black">${item.price * item.quantity}.00</span>
                  </div>
                ))}
                <div className="border-t border-black/10 pt-4 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Paid</span>
                  <span className="text-xl font-black text-primary">${totalPrice}.00</span>
                </div>
              </div>
              <Button 
                onClick={closeAndReset}
                className="w-full rounded-full py-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
              >
                Return to Shop
              </Button>
            </div>
          )}
        </div>

        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="p-6 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Amount</span>
              <span className="text-2xl font-black">${totalPrice}.00</span>
            </div>
            <Button 
              disabled={isProcessing}
              onClick={handleCheckout}
              className="w-full rounded-full py-8 font-black uppercase tracking-widest text-xs bg-primary shadow-xl shadow-primary/20 relative overflow-hidden"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  {checkoutStep === 'cart' && "Proceed to Shipping"}
                  {checkoutStep === 'shipping' && "Proceed to Payment"}
                  {checkoutStep === 'payment' && "Confirm Purchase"}
                  <ArrowRight size={16} weight="bold" className="ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
