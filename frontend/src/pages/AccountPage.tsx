import { motion } from "framer-motion"
import { UserIcon, PackageIcon, SignOutIcon, GearIcon, MapPinIcon, EnvelopeIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useOrders } from "@/contexts/OrdersContext"
import { useNavigate, Link } from "react-router-dom"

const AccountPage = () => {
  const { user, logout } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black mb-4">Please log in to view your account.</h1>
        <Button asChild rounded-full px-8 py-6>
          <Link to="/auth">Login Now</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar: Profile Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[3rem] bg-secondary/20 border border-black/5 dark:border-white/5 sticky top-32"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
              <UserIcon size={40} weight="fill" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">{user.name}</h1>
            <p className="text-sm text-muted-foreground mb-8 break-all">{user.email}</p>
            
            <div className="space-y-2">
              {[
                { icon: PackageIcon, label: "My Orders", path: "/orders" },
                { icon: MapPinIcon, label: "Addresses", path: "#" },
                { icon: GearIcon, label: "Settings", path: "#" },
              ].map((item, i) => (
                <Link 
                  key={i} 
                  to={item.path}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-black/40 transition-all group"
                >
                  <item.icon size={20} weight="bold" className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/10 text-destructive transition-all group"
              >
                <SignOutIcon size={20} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content: Activity & Overview */}
        <div className="flex-grow space-y-12">
          
          {/* Recent Orders Preview */}
          <section data-aos="fade-up">
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

          {/* Account Details Card */}
          <section data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-2xl font-black tracking-tighter mb-8">Profile Details.</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-black/5">
                <div className="flex items-center gap-4 mb-4">
                  <UserIcon size={20} weight="bold" className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Display Name</span>
                </div>
                <p className="text-lg font-black tracking-tight">{user.name}</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-black/5">
                <div className="flex items-center gap-4 mb-4">
                  <EnvelopeIcon size={20} weight="bold" className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Primary Email</span>
                </div>
                <p className="text-lg font-black tracking-tight">{user.email}</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default AccountPage
