import React from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { Package, Clock, CheckCircle, Truck, ArrowLeft, ShoppingBag } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { orders } = useOrders();

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16" data-aos="fade-up">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4">
            <Package size={16} weight="bold" />
            Account Dashboard
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-primary uppercase">ORDER HISTORY</h1>
          <p className="text-muted-foreground text-lg">Track and manage your futuristic acquisitions.</p>
        </div>
        <Button asChild variant="outline" className="rounded-full border-black/10 dark:border-white/10 hover:bg-secondary transition-colors">
          <Link to="/shop">
            <ArrowLeft size={18} weight="bold" className="mr-2" />
            Back to Shop
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-secondary/10 rounded-[3rem] border border-dashed border-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-2">No Acquisitions Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-xs">Your collection is waiting for its first masterpiece.</p>
          <Button asChild className="rounded-full px-10 py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
            <Link to="/shop">Explore Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Order Header */}
              <div className="p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest opacity-50 uppercase">Order ID</span>
                    <span className="font-black text-primary">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock size={14} weight="bold" />
                    <span className="text-sm font-medium">{order.date}</span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <Badge className={`
                    rounded-full px-4 py-1 font-black uppercase tracking-widest text-[8px]
                    ${order.status === 'Processing' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}
                  `}>
                    {order.status === 'Processing' ? <Clock className="mr-1 inline" size={10} weight="bold" /> : <CheckCircle className="mr-1 inline" size={10} weight="bold" />}
                    {order.status}
                  </Badge>
                  <div className="text-2xl font-black">${order.total}.00</div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-secondary/10 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                      <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-black text-sm truncate uppercase tracking-tight">{item.name}</h4>
                        <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                          QTY: {item.quantity} • ${item.price}.00
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-8 py-6 bg-secondary/5 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  <Truck size={16} weight="bold" />
                  Estimated Delivery: Q3 2026
                </div>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full">
                  Order Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
