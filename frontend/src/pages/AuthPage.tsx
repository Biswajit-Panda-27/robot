import { useState } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { EnvelopeIcon, LockIcon, ArrowRightIcon, UserIcon, SparkleIcon, CaretLeftIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import GlassBot from "@/components/ui/GlassBot"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  // High-Precision 3D Mouse Tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 120, damping: 25 })
  const mouseY = useSpring(y, { stiffness: 120, damping: 25 })

  const rotateX = useTransform(mouseY, [-500, 500], [15, -15])
  const rotateY = useTransform(mouseX, [-500, 500], [-20, 20])

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden perspective-[1500px] selection:bg-primary/30 mt-[30px] "
    >
      {/* Background Layer: High-End Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <div className="w-full max-w-[1300px] grid lg:grid-cols-2 gap-12 p-8 relative z-10">

        {/* Left Side: Seamless 3D Showcase */}
        <div className="hidden lg:flex items-center justify-center relative">
          {/* Animated Glow behind the bot */}
          <motion.div
            style={{
              x: useTransform(mouseX, [-500, 500], [20, -20]),
              y: useTransform(mouseY, [-500, 500], [20, -20])
            }}
            className="absolute w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-50"
          />

          <motion.div
            style={{ rotateX, rotateY, z: 100 }}
            className="relative z-10 scale-150 transform-gpu transition-transform"
          >
            <GlassBot rotateX={rotateX} rotateY={rotateY} />
          </motion.div>

          {/* Minimal Brand Detail */}
          <div className="absolute bottom-10 flex flex-col items-center gap-4">
            <div className="h-20 w-px bg-linear-to-b from-primary/50 to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/30"></span>
          </div>
        </div>

        {/* Right Side: Compact Auth Panel */}
        <div className="flex flex-col justify-center px-4 lg:px-20">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/90 hover:text-primary transition-colors mb-4 group">
            <CaretLeftIcon size={14} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            Back To Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[320px] mx-auto lg:mx-0"
          >
            {/* Header Content */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Security Node</span>
              </div>
              <h1 className="text-5xl lg:text-5xl font-black tracking-tighter leading-[0.9] mb-2">
                {isLogin ? "LOG IN" : "SIGN UP"} <br />

              </h1>

              {/* Compact Tab Switcher */}
              <div className="inline-flex bg-secondary/30 dark:bg-white/[0.02] p-1 rounded-xl border border-black/5 dark:border-white/5 relative">
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-y-1 bg-white dark:bg-zinc-900 rounded-lg shadow-md z-0"
                  style={{ width: 'calc(50% - 0.25rem)', left: isLogin ? '0.25rem' : '50%' }}
                />
                <button
                  onClick={() => setIsLogin(true)}
                  className={`relative z-10 px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${isLogin ? "text-primary" : "text-muted-foreground"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`relative z-10 px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${!isLogin ? "text-primary" : "text-muted-foreground"}`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Form Section */}
            <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="group overflow-hidden"
                    >
                      <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                        <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-all ml-2" size={16} weight="bold" />
                        <Input
                          placeholder="Your name"
                          className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black placeholder:text-muted-foreground/60 focus-visible:ring-0"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="group">
                  <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                    <EnvelopeIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-all ml-2" size={16} weight="bold" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black placeholder:text-muted-foreground/60 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                    <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-all ml-2" size={16} weight="bold" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black placeholder:text-muted-foreground/60 focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                  SUBMIT <ArrowRightIcon size={14} weight="bold" className="ml-2" />
                </Button>
              </div>

              <div className=" flex items-center gap-3">
                <div className="h-px flex-1 bg-black/3 dark:bg-white/3" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">Continue with Google</span>
                <div className="h-px flex-1 bg-black/3 dark:bg-white/3" />
              </div>

              <div className="">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-black/10 dark:border-white/10 bg-black text-white hover:bg-white hover:text-black dark:bg-primary dark:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 gap-3 font-black text-[8px] uppercase tracking-widest shadow-sm hover:shadow-xl active:scale-95"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" className="w-4 h-4" />
                  Continue with Google
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
