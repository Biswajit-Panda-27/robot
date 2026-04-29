import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserIcon, PackageIcon, SignOutIcon, GearIcon, MapPinIcon, EnvelopeIcon, HouseIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useOrders } from "@/contexts/OrdersContext"
import { useNavigate, Link } from "react-router-dom"

const AccountPage = () => {
  const { user, logout, updateAddress } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Please log in to view your account.</h1>
        <Button asChild className="rounded-full px-8 py-6">
          <Link to="/auth">Login Now</Link>
        </Button>
      </div>
    )
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: HouseIcon },
    { id: "orders", label: "My Orders", icon: PackageIcon },
    { id: "address", label: "Shipping Address", icon: MapPinIcon },
    { id: "profile", label: "Profile Details", icon: UserIcon },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar: Navigation */}
        <div className="w-full lg:w-80 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[3rem] bg-secondary/20 border border-black/5 dark:border-white/5 sticky top-32"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <UserIcon size={24} weight="fill" />
              </div>
              <div>
                <h2 className="font-black tracking-tighter text-lg leading-tight">{user.name}</h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Premium Member</p>
              </div>
            </div>
            
            <div className="space-y-1">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeTab === item.id ? "bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 text-primary" : "hover:bg-white/50 dark:hover:bg-white/5 text-muted-foreground"}`}
                >
                  <item.icon size={20} weight={activeTab === item.id ? "fill" : "bold"} className="transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/10 text-destructive transition-all group"
                >
                  <SignOutIcon size={20} weight="bold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="p-8 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/20">
                    <PackageIcon size={32} weight="fill" className="mb-4 opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Orders</p>
                    <h3 className="text-4xl font-black tracking-tighter">{orders.length}</h3>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-black/5">
                    <HouseIcon size={32} weight="fill" className="mb-4 text-primary opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Saved Address</p>
                    <h3 className="text-xl font-black tracking-tight mt-2">{user.address?.city || "None Saved"}</h3>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-black/5">
                    <UserIcon size={32} weight="fill" className="mb-4 text-primary opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Member Since</p>
                    <h3 className="text-xl font-black tracking-tight mt-2">April 2026</h3>
                  </div>
                </div>

                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black tracking-tighter">Recent Orders.</h2>
                    <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-12 rounded-[3rem] border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center opacity-50">
                      <PackageIcon size={48} weight="thin" className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-6 rounded-3xl bg-secondary/10 border border-black/5 flex items-center justify-between group hover:bg-secondary/20 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-black/50 p-2 border border-black/5 flex items-center justify-center">
                              <PackageIcon size={24} weight="bold" className="text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{order.id}</p>
                              <h4 className="text-sm font-black tracking-tight">{order.date}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black tracking-tighter">${order.total.toFixed(2)}</p>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-neon-green/20 text-neon-green">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tighter">Order History.</h2>
                  </div>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-muted-foreground italic">You haven't placed any orders yet.</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="p-8 rounded-[2.5rem] bg-secondary/10 border border-black/5 hover:bg-secondary/20 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{order.id}</span>
                              <h3 className="text-xl font-black tracking-tight">{order.date}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-neon-green/20 text-neon-green mb-2 inline-block">{order.status}</span>
                              <p className="text-2xl font-black tracking-tighter">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="w-12 h-12 rounded-lg bg-white dark:bg-black/50 p-2 border border-black/5 shrink-0">
                                <img src={item.img} alt={item.name} className="w-full h-full object-contain" title={item.name} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
              </motion.div>
            )}

            {activeTab === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-3">
                  <MapPinIcon size={32} weight="bold" className="text-primary" />
                  Shipping Address.
                </h2>
                
                <div className="p-10 rounded-[3rem] bg-secondary/10 border border-black/5">
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Address / Street</label>
                        <input 
                          type="text" 
                          value={user.address?.fullAddress || ""} 
                          onChange={(e) => updateAddress({ ...user.address!, fullAddress: e.target.value, country: user.address?.country || "", state: user.address?.state || "", landmark: user.address?.landmark || "", pincode: user.address?.pincode || "" })}
                          placeholder="House No, Street, Area" 
                          className="w-full bg-white dark:bg-black/50 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Landmark</label>
                          <input 
                            type="text" 
                            value={user.address?.landmark || ""} 
                            onChange={(e) => updateAddress({ ...user.address!, landmark: e.target.value, fullAddress: user.address?.fullAddress || "", country: user.address?.country || "", state: user.address?.state || "", pincode: user.address?.pincode || "" })}
                            placeholder="Near Petrol Pump" 
                            className="w-full bg-white dark:bg-black/50 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Pincode</label>
                          <input 
                            type="text" 
                            value={user.address?.pincode || ""} 
                            onChange={(e) => updateAddress({ ...user.address!, pincode: e.target.value, fullAddress: user.address?.fullAddress || "", country: user.address?.country || "", state: user.address?.state || "", landmark: user.address?.landmark || "" })}
                            placeholder="6-digit code" 
                            className="w-full bg-white dark:bg-black/50 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">State</label>
                          <input 
                            type="text" 
                            value={user.address?.state || ""} 
                            onChange={(e) => updateAddress({ ...user.address!, state: e.target.value, fullAddress: user.address?.fullAddress || "", country: user.address?.country || "", landmark: user.address?.landmark || "", pincode: user.address?.pincode || "" })}
                            placeholder="Enter state" 
                            className="w-full bg-white dark:bg-black/50 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Country</label>
                          <input 
                            type="text" 
                            value={user.address?.country || ""} 
                            onChange={(e) => updateAddress({ ...user.address!, country: e.target.value, fullAddress: user.address?.fullAddress || "", state: user.address?.state || "", landmark: user.address?.landmark || "", pincode: user.address?.pincode || "" })}
                            placeholder="India" 
                            className="w-full bg-white dark:bg-black/50 border border-black/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-black text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-10 rounded-[2.5rem] bg-black text-white shadow-2xl shadow-black/20 relative overflow-hidden group border border-white/5">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                      
                      <div className="flex items-center gap-3 mb-8 opacity-40">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Delivery Preview</span>
                      </div>

                      {user.address?.pincode ? (
                        <div className="space-y-4 relative z-10">
                          <div>
                            <p className="text-3xl font-black tracking-tighter mb-1">{user.name}</p>
                            <p className="text-white/60 font-medium text-sm leading-relaxed">{user.address.fullAddress}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4">
                            <div>
                               <span className="text-[8px] font-black uppercase tracking-widest text-primary block mb-1">Landmark</span>
                               <p className="text-xs font-black">{user.address.landmark || "---"}</p>
                            </div>
                            <div>
                               <span className="text-[8px] font-black uppercase tracking-widest text-primary block mb-1">Location</span>
                               <p className="text-xs font-black">{user.address.state}, {user.address.country}</p>
                            </div>
                            <div>
                               <span className="text-[8px] font-black uppercase tracking-widest text-primary block mb-1">Pincode</span>
                               <p className="text-xs font-black font-mono">{user.address.pincode}</p>
                            </div>
                          </div>

                          <div className="pt-6">
                             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-[8px] font-black uppercase tracking-widest text-primary border border-primary/20">
                               <PackageIcon size={12} weight="bold" /> Standard Delivery Active
                             </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10 opacity-30">
                          <MapPinIcon size={40} weight="thin" className="mx-auto mb-4" />
                          <p className="text-xs font-black uppercase tracking-widest">Awaiting Shipping Details</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-3xl font-black tracking-tighter mb-8">Security Node.</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-10 rounded-[3rem] bg-secondary/10 border border-black/5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon size={20} weight="bold" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Public Profile Name</span>
                    </div>
                    <p className="text-2xl font-black tracking-tight">{user.name}</p>
                    <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Edit Name</button>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-secondary/10 border border-black/5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <EnvelopeIcon size={20} weight="bold" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Email Address</span>
                    </div>
                    <p className="text-2xl font-black tracking-tight break-all">{user.email}</p>
                    <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Change Email</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
