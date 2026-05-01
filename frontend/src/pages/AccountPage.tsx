import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UserIcon, 
  PackageIcon, 
  SignOutIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  HouseIcon,
  CheckCircleIcon,
  TrashIcon,
  PlusIcon,
  PhoneIcon,
  PencilSimpleIcon,
  StarIcon,
  ArrowClockwise,
  UserCircleIcon,
  Calendar,
  CameraIcon
} from "@phosphor-icons/react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { useAuth } from "@/contexts/AuthContext"
import { useOrders } from "@/contexts/OrdersContext"
import GlassBot from "@/components/ui/GlassBot"
import { cn } from "@/lib/utils"

const AccountPage = () => {
  const { user, logout, updateProfile, addAddress, updateAddress, deleteAddress } = useAuth()
  const { orders } = useOrders()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("overview")
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    secondary_mobile: user?.secondary_mobile || "",
    dob: user?.dob || "",
    avatar: user?.avatar || ""
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    state: "",
    city: "",
    landmark: "",
    pincode: "",
    is_default: false
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        mobile: user.mobile || "",
        secondary_mobile: user.secondary_mobile || "",
        dob: user.dob || "",
        avatar: user.avatar || ""
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    toast.info("Logged out successfully")
    navigate('/')
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateProfile(profileForm)
    if (res.success) {
      toast.success("Identity updated successfully!")
    } else {
      toast.error(res.message || "Failed to update identity")
    }
    setLoading(false)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let res;
    if (editingAddressId) {
      res = await updateAddress(editingAddressId, addressForm)
    } else {
      res = await addAddress(addressForm)
    }

    if (res.success) {
      toast.success(editingAddressId ? 'Geographical node updated!' : 'New node authorized!')
      setShowAddForm(false)
      setEditingAddressId(null)
      setAddressForm({ label: "Home", state: "", city: "", landmark: "", pincode: "", is_default: false })
    } else {
      toast.error(res.message || "Operation failed")
    }
    setLoading(false)
  }

  const startEditAddress = (addr: any) => {
    setEditingAddressId(addr.id)
    setAddressForm({
      label: addr.label,
      state: addr.state,
      city: addr.city,
      landmark: addr.landmark,
      pincode: addr.pincode,
      is_default: addr.is_default
    })
    setShowAddForm(true)
  }

  const handleSetDefault = async (id: string) => {
    setLoading(true)
    const res = await updateAddress(id, { is_default: true })
    if (res.success) toast.success("Primary node updated")
    setLoading(false)
  }

  const handleDeleteAddress = async (id: string) => {
     if (window.confirm("Are you sure you want to delete this node?")) {
        const res = await deleteAddress(id)
        if (res.success) toast.success("Node removed from grid")
        else toast.error("Failed to remove node")
     }
  }

  if (!user) return null

  const defaultAddress = user.addresses?.find(a => a.is_default) || user.addresses?.[0]

  const navItems = [
    { id: "overview", label: "Overview", icon: HouseIcon },
    { id: "orders", label: "My Orders", icon: PackageIcon },
    { id: "address", label: "Shipping Address", icon: MapPinIcon },
    { id: "profile", label: "Profile Details", icon: UserIcon },
  ]

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Processing...";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <Card className="rounded-[3rem] border-border bg-secondary/30 backdrop-blur-xl sticky top-32 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/10">
                   <AvatarImage src={user.avatar} className="object-cover" />
                   <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                      {user.name.charAt(0)}
                   </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <CardTitle className="text-lg uppercase tracking-tighter truncate font-black">{user.name}</CardTitle>
                  <CardDescription className="text-[10px] text-primary font-black uppercase tracking-widest">Active Node</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                    activeTab === item.id 
                      ? "bg-card shadow-xl text-primary border border-border" 
                      : "hover:bg-card/50 text-muted-foreground"
                  )}
                >
                  <item.icon size={20} weight={activeTab === item.id ? "fill" : "bold"} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
              <Separator className="my-4 opacity-50" />
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/10 text-destructive transition-all">
                <SignOutIcon size={20} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-grow min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                <div className="grid sm:grid-cols-3 gap-6">
                  <Card className="rounded-[2rem] bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <CardContent className="p-5 flex flex-col justify-between h-full">
                       <PackageIcon size={24} weight="fill" className="opacity-40 mb-2" />
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary-foreground/70 mb-0.5">Orders</p>
                          <h3 className="text-3xl font-black tracking-tighter leading-none">{orders.length}</h3>
                       </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] bg-card border-border shadow-sm group hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                       <div className="flex justify-between items-start mb-3">
                          <MapPinIcon size={24} weight="fill" className="text-primary opacity-50" />
                          <Button 
                            variant="ghost" 
                            onClick={() => setActiveTab("address")} 
                            className="h-6 px-3 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-secondary transition-all cursor-pointer"
                          >
                            Manage
                          </Button>
                       </div>
                       <div className="space-y-0.5 min-h-[50px]">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Shipping Node</p>
                          {defaultAddress ? (
                             <>
                                <h4 className="text-xs font-black tracking-tight truncate leading-tight">{defaultAddress.landmark}</h4>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}</p>
                             </>
                          ) : (
                             <p className="text-[10px] italic text-muted-foreground">No node synced.</p>
                          )}
                       </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] bg-card border-border shadow-sm group hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                       <div className="flex justify-between items-start mb-3">
                          <Avatar className="w-10 h-10 rounded-xl border border-primary/20">
                             <AvatarImage src={user.avatar} className="object-cover" />
                             <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                {user.name.charAt(0)}
                             </AvatarFallback>
                          </Avatar>
                          <Button 
                            variant="ghost" 
                            onClick={() => setActiveTab("profile")} 
                            className="h-6 px-3 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-secondary transition-all cursor-pointer"
                          >
                            Edit
                          </Button>
                       </div>
                       <div className="space-y-0.5 min-h-[50px]">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Identity Node</p>
                          <h4 className="text-xs font-black tracking-tight truncate leading-tight">{user.name}</h4>
                          <p className="text-[9px] font-bold text-muted-foreground truncate leading-tight lowercase">{user.email}</p>
                          <p className="text-[8px] font-black uppercase text-primary mt-1.5 flex items-center gap-1">
                             <Calendar size={10} weight="bold" />
                             Since {user.created_at ? new Date(user.created_at).getFullYear() : 'Recent'}
                          </p>
                       </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-12 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden flex items-center justify-between border border-white/5 shadow-2xl">
                   <div className="relative z-10 max-w-md">
                      <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase italic">System Operations.</h2>
                      <p className="text-sm text-white/50 leading-relaxed mb-8">All your account parameters are synced across the grid. Update your contact info or shipping locations using the management console.</p>
                      <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-12 px-8">
                         <Link to="/shop">Explore Collection</Link>
                      </Button>
                   </div>
                   <div className="hidden md:block scale-125 -translate-y-4">
                      <GlassBot />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <h2 className="text-3xl font-black tracking-tighter uppercase mb-8">Order History.</h2>
                 <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="p-20 text-center opacity-30 border-2 border-dashed border-border rounded-[3rem]">
                         <PackageIcon size={64} weight="thin" className="mx-auto mb-6" />
                         <p className="text-xs font-black uppercase tracking-widest">No order data found in system</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card key={order.id} className="rounded-[2.5rem] bg-card border-border overflow-hidden hover:shadow-xl transition-all">
                          <CardHeader className="flex flex-row justify-between items-center bg-secondary/30">
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{order.id}</p>
                               <h3 className="text-xl font-black tracking-tight">{order.date}</h3>
                            </div>
                            <div className="text-right">
                               <Badge variant="outline" className="text-primary border-primary text-[8px] font-black uppercase mb-1">{order.status}</Badge>
                               <p className="text-2xl font-black tracking-tighter">${order.total.toFixed(2)}</p>
                            </div>
                          </CardHeader>
                        </Card>
                      ))
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === "address" && (
              <motion.div key="address" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Shipping Nodes.</h2>
                  {!showAddForm && (
                    <Button onClick={() => { setShowAddForm(true); setEditingAddressId(null); }} className="rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                      <PlusIcon size={18} className="mr-2" /> Add New Node
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {user.addresses?.map((addr) => (
                    <Card key={addr.id} className={cn(
                      "rounded-[2.5rem] border transition-all relative group overflow-hidden",
                      addr.is_default ? "bg-primary/5 border-primary shadow-xl shadow-primary/5" : "bg-card border-border"
                    )}>
                       <CardHeader className="flex flex-row justify-between items-start">
                          <div className="flex items-center gap-2 pt-1">
                             <Badge variant={addr.is_default ? "default" : "secondary"} className="text-[8px] font-black uppercase px-4 py-1">
                                {addr.label}
                             </Badge>
                             {addr.is_default && <StarIcon weight="fill" className="text-yellow-500" size={14} />}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             {!addr.is_default && (
                               <button onClick={() => handleSetDefault(addr.id)} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"><CheckCircleIcon size={16} /></button>
                             )}
                             <button onClick={() => startEditAddress(addr)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-all"><PencilSimpleIcon size={16} /></button>
                             <button onClick={() => handleDeleteAddress(addr.id)} className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all"><TrashIcon size={16} /></button>
                          </div>
                       </CardHeader>
                       <CardContent className="pb-8">
                          <h3 className="text-lg font-black tracking-tight mb-1">{addr.landmark}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{addr.city}, {addr.state}</p>
                          <p className="text-xs font-mono font-black text-primary mt-3">{addr.pincode}</p>
                       </CardContent>
                    </Card>
                  ))}

                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="md:col-span-2">
                         <Card className="rounded-[3rem] border-2 border-primary shadow-2xl overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 px-10 py-8">
                               <CardTitle className="text-xl uppercase tracking-tighter font-black">
                                  {editingAddressId ? 'Edit Geographical Node' : 'Initialize New Node'}
                               </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                               <form onSubmit={handleAddressSubmit} className="grid md:grid-cols-2 gap-8">
                                  {[
                                    { id: 'label', label: 'Node Label', placeholder: 'Home, Office...' },
                                    { id: 'landmark', label: 'Landmark / Street', placeholder: 'Building, Area' },
                                    { id: 'city', label: 'City', placeholder: 'City Name' },
                                    { id: 'state', label: 'State', placeholder: 'State Name' },
                                    { id: 'pincode', label: 'Pincode', placeholder: '000000' }
                                  ].map((f) => (
                                    <div key={f.id} className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{f.label}</label>
                                       <Input 
                                          required 
                                          value={(addressForm as any)[f.id]} 
                                          onChange={e => setAddressForm({...addressForm, [f.id]: e.target.value})} 
                                          placeholder={f.placeholder}
                                          className="h-14 rounded-2xl bg-secondary/50 border-none px-6 font-black text-sm focus:ring-2 focus:ring-primary/20"
                                       />
                                    </div>
                                  ))}
                                  <div className="flex gap-4 items-end pt-4 md:col-span-2">
                                     <Button type="submit" disabled={loading} className="flex-grow h-16 rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-primary/20">
                                       {loading && <ArrowClockwise className="animate-spin mr-2" />}
                                       {editingAddressId ? 'Sync Updates' : 'Authorize Node'}
                                     </Button>
                                     <Button type="button" variant="ghost" onClick={() => { setShowAddForm(false); setEditingAddressId(null); }} className="h-16 rounded-2xl px-10 font-black uppercase text-[11px]">Abort</Button>
                                  </div>
                               </form>
                            </CardContent>
                         </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-8">Identity Parameters.</h2>
                <Card className="rounded-[3rem] bg-secondary/20 border border-border shadow-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 px-10 py-8 border-b border-primary/10">
                     <CardTitle className="text-xl uppercase tracking-tighter font-black">Edit User Identity</CardTitle>
                     <CardDescription className="text-xs font-medium">Update your global contact and identification nodes.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <form onSubmit={handleUpdateProfile} className="space-y-10">
                      
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center gap-6 mb-10">
                         <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <Avatar className="w-32 h-32 rounded-[2.5rem] border-4 border-primary/20 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                               <AvatarImage src={profileForm.avatar} className="object-cover" />
                               <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl">
                                  {user.name.charAt(0)}
                               </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500">
                               <CameraIcon size={32} className="text-white" weight="fill" />
                            </div>
                         </div>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Click to update Identity Visual</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10" size={20} />
                            <Input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="h-14 rounded-2xl bg-card border-border pl-14 pr-6 font-black text-sm shadow-inner" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Birth Date Node</label>
                          <div className="relative">
                             <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10" size={20} />
                             <Input type="date" value={profileForm.dob} onChange={e => setProfileForm({...profileForm, dob: e.target.value})} className="h-14 rounded-2xl bg-card border-border pl-14 pr-6 font-black text-sm shadow-inner" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Mobile Node</label>
                          <div className="relative">
                             <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10" size={20} />
                             <Input type="tel" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} className="h-14 rounded-2xl bg-card border-border pl-14 pr-6 font-black text-sm shadow-inner" placeholder="+91 XXXXX XXXXX" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secondary Mobile Node</label>
                          <div className="relative">
                             <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10" size={20} />
                             <Input type="tel" value={profileForm.secondary_mobile} onChange={e => setProfileForm({...profileForm, secondary_mobile: e.target.value})} className="h-14 rounded-2xl bg-card border-border pl-14 pr-6 font-black text-sm shadow-inner" placeholder="Emergency Contact" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-6">
                         <Separator className="opacity-20" />
                         <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl uppercase font-black tracking-widest text-[11px] shadow-2xl shadow-primary/30">
                            {loading ? <ArrowClockwise className="animate-spin mr-2" /> : <CheckCircleIcon size={20} className="mr-2" />}
                            Commit Identity Changes
                         </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
