import { useState } from "react"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { EnvelopeIcon, LockIcon, ArrowRightIcon, UserIcon, CaretLeftIcon, WarningCircleIcon, SparkleIcon, KeyIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useGoogleLogin } from "@react-oauth/google"
import GlassBot from "@/components/ui/GlassBot"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { login, register, verifyOTP, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      const res = await googleLogin(tokenResponse.access_token)
      setLoading(false)
      if (res.success) navigate('/account')
      else setError(res.message)
    },
    onError: () => setError("Google Login Failed.")
  })

  // High-Precision 3D Mouse Tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 120, damping: 25 })
  const mouseY = useSpring(y, { stiffness: 120, damping: 25 })
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15])
  const rotateY = useTransform(mouseX, [-500, 500], [-20, 20])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (showOTP) {
        // Step 2: Verify OTP
        const res = await verifyOTP(email, otp)
        if (res.success) navigate('/account')
        else setError(res.message)
      } else if (isLogin) {
        // Step 1: Login with Email/Password
        const res = await login(email, password)
        if (res.success && res.requiresOTP) {
          setShowOTP(true)
          setSuccess("Verification code sent to your email.")
        } else {
          setError(res.message)
        }
      } else {
        // Registration
        const res = await register(name, email)
        if (res.success) setSuccess(res.message)
        else setError(res.message)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - (rect.left + rect.width / 2))
        y.set(e.clientY - (rect.top + rect.height / 2))
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden perspective-[1500px] mt-[30px]"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <div className="w-full max-w-[1300px] grid lg:grid-cols-2 gap-12 p-8 relative z-10">
        <div className="hidden lg:flex items-center justify-center relative">
          <motion.div style={{ rotateX, rotateY, z: 100 }} className="relative z-10 scale-150 transform-gpu transition-transform">
            <GlassBot rotateX={rotateX} rotateY={rotateY} />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-4 lg:px-20">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/90 hover:text-primary transition-colors mb-4 group">
            <CaretLeftIcon size={14} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            Back To Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[320px] mx-auto lg:mx-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Orbital Authentication</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.9] mb-2">
                {showOTP ? "VERIFY" : (isLogin ? "LOG IN" : "SIGN UP")}
              </h1>

              {!showOTP && (
                <div className="inline-flex bg-secondary/30 dark:bg-white/[0.02] p-1 rounded-xl border border-black/5 dark:border-white/5 relative">
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-y-1 bg-white dark:bg-zinc-900 rounded-lg shadow-md z-0"
                    style={{ width: 'calc(50% - 0.25rem)', left: isLogin ? '0.25rem' : '50%' }}
                  />
                  <button onClick={() => { setIsLogin(true); setError(""); setShowOTP(false); }} className={`relative z-10 px-6 py-2 text-[9px] font-black uppercase tracking-widest ${isLogin ? "text-primary" : "text-muted-foreground"}`}>Sign In</button>
                  <button onClick={() => { setIsLogin(false); setError(""); setShowOTP(false); }} className={`relative z-10 px-6 py-2 text-[9px] font-black uppercase tracking-widest ${!isLogin ? "text-primary" : "text-muted-foreground"}`}>Register</button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
                  <WarningCircleIcon size={18} weight="fill" className="shrink-0 mt-0.5" />
                  <p className="text-[10px] font-black uppercase tracking-wider">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-start gap-3 text-neon-green">
                  <SparkleIcon size={18} weight="fill" className="shrink-0 mt-0.5" />
                  <p className="text-[10px] font-black uppercase tracking-wider">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <AnimatePresence mode="wait">
                  {showOTP ? (
                    <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="group">
                      <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                        <KeyIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                        <Input placeholder="Enter 6-digit Code" value={otp} onChange={(e) => setOtp(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black tracking-[0.5em] placeholder:tracking-normal focus-visible:ring-0" />
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {!isLogin && (
                        <div className="group">
                          <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                            <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black focus-visible:ring-0" />
                          </div>
                        </div>
                      )}
                      <div className="group">
                        <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                          <EnvelopeIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                          <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black focus-visible:ring-0" />
                        </div>
                      </div>
                      {isLogin && (
                        <div className="group">
                          <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                            <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black focus-visible:ring-0" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-2">
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                  {loading ? "PROCESSING..." : (showOTP ? "VERIFY CODE" : (isLogin ? "SIGN IN" : "SEND INVITE"))} <ArrowRightIcon size={14} weight="bold" className="ml-2" />
                </Button>
                {showOTP && (
                  <button type="button" onClick={() => setShowOTP(false)} className="w-full mt-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    Back to Login
                  </button>
                )}
              </div>

              {!showOTP && (
                <>
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5 dark:border-white/5"></div></div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-background px-4 text-muted-foreground/60">Orbital Sync</span></div>
                  </div>
                  <Button type="button" onClick={() => handleGoogleLogin()} variant="outline" className="w-full h-12 rounded-xl border-black/5 dark:border-white/5 bg-secondary/20 hover:bg-secondary/40 text-[9px] font-black uppercase tracking-[0.3em] transition-all group">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" alt="Google" />
                    Continue with Google
                  </Button>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
