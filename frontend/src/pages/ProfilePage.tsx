import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  UserIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  IdentificationCardIcon, 
  SparkleIcon, 
  CheckCircleIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import GlassBot from "@/components/ui/GlassBot";

const ProfilePage = () => {
  const { user, updateProfile, fetchMe } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState({
    state: user?.address?.state || '',
    city: user?.address?.city || '',
    landmark: user?.address?.landmark || '',
    pincode: user?.address?.pincode || ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 3D Mouse Tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 120, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 25 });
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-500, 500], [-20, 20]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAddress({
        state: user.address?.state || '',
        city: user.address?.city || '',
        landmark: user.address?.landmark || '',
        pincode: user.address?.pincode || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const res = await updateProfile({ name, address });
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile synced with the grid successfully!' });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
    setLoading(false);
  };

  return (
    <div 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      className="min-h-screen pt-32 pb-20 px-4 bg-background relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_400px] gap-8 relative z-10">
        
        {/* Left Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <UserIcon size={32} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Identity Core</h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground mt-2">Personal Authentication Parameters</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid gap-8">
            {/* General Section */}
            <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <IdentificationCardIcon size={20} className="text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest">Personal Data</h2>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input 
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 bg-white/5 border-white/10 rounded-xl font-bold focus:ring-primary"
                  />
                </div>
                <div className="space-y-2 opacity-50">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Immutable)</label>
                  <Input 
                    value={user?.email || ''}
                    disabled
                    className="h-14 bg-white/5 border-white/5 rounded-xl font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <MapPinIcon size={20} className="text-primary" />
                <h2 className="text-xs font-black uppercase tracking-widest">Geographical Node</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                  <Input 
                    value={address.city || ''}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    placeholder="City"
                    className="h-14 bg-white/5 border-white/10 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                  <Input 
                    value={address.state || ''}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    placeholder="State"
                    className="h-14 bg-white/5 border-white/10 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Landmark / Street</label>
                  <Input 
                    value={address.landmark || ''}
                    onChange={(e) => setAddress({...address, landmark: e.target.value})}
                    placeholder="Street or Building"
                    className="h-14 bg-white/5 border-white/10 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pincode</label>
                  <Input 
                    value={address.pincode || ''}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    placeholder="000000"
                    className="h-14 bg-white/5 border-white/10 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>

            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-destructive/10 text-destructive border-destructive/20'
                } border`}
              >
                {message.type === 'success' ? <CheckCircleIcon size={20} /> : <WarningCircleIcon size={20} />}
                <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full lg:w-fit px-12 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <ArrowClockwiseIcon className="animate-spin" /> SYNCING...
                </div>
              ) : "Update Identity"}
            </Button>
          </form>
        </motion.div>

        {/* Right Side: Bot & Stats */}
        <div className="hidden lg:flex flex-col gap-8">
          <motion.div 
            style={{ rotateX, rotateY, z: 100 }}
            className="aspect-square rounded-[3rem] bg-primary/5 border border-primary/10 flex items-center justify-center relative group transform-gpu"
          >
            <div className="scale-110">
              <GlassBot rotateX={rotateX} rotateY={rotateY} />
            </div>
            
            <div className="absolute bottom-10 left-10 right-10 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Core Integrity</span>
                <SparkleIcon size={14} className="text-primary animate-pulse" />
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: user?.address ? '100%' : '40%' }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>

          <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Security Level</h3>
             <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_10px_rgba(0,255,100,0.5)]" />
               <span className="text-xs font-black uppercase italic">Verified Access</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
