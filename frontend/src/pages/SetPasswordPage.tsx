import { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { LockIcon, ArrowRightIcon, WarningCircleIcon, SparkleIcon, CaretLeftIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import GlassBot from "@/components/ui/GlassBot"

const SetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPasswordState] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { setPassword } = useAuth()
  const navigate = useNavigate()

  // 3D Mouse Tracking
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 120, damping: 25 })
  const mouseY = useSpring(y, { stiffness: 120, damping: 25 })
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15])
  const rotateY = useTransform(mouseX, [-500, 500], [-20, 20])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (!token) {
      setError("Invalid or missing verification token.")
      return
    }

    setLoading(true)
    const res = await setPassword(token, password)
    setLoading(false)

    if (res.success) {
      setSuccess("Account activated! Redirecting to login...")
      setTimeout(() => navigate("/auth"), 2000)
    } else {
      setError(res.message)
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
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden mt-[30px]"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-[1300px] grid lg:grid-cols-2 gap-12 p-8 relative z-10">
        <div className="hidden lg:flex items-center justify-center relative">
          <motion.div style={{ rotateX, rotateY, z: 100 }} className="relative z-10 scale-125 transform-gpu transition-transform">
            <GlassBot rotateX={rotateX} rotateY={rotateY} />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-4 lg:px-20">
          <Link to="/auth" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/90 hover:text-primary transition-colors mb-4 group">
            <CaretLeftIcon size={14} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            Back To Login
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[320px] mx-auto lg:mx-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Security Node</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.9] mb-2 uppercase">Set Password</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-4">Secure your orbital access</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
                <WarningCircleIcon size={18} weight="fill" className="shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-wider">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-start gap-3 text-neon-green">
                <SparkleIcon size={18} weight="fill" className="shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-wider">{success}</p>
              </div>
            )}

            <form onSubmit={handleSetPassword} className="grid gap-5">
              <div className="group">
                <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                  <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                  <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPasswordState(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black focus-visible:ring-0" />
                </div>
              </div>

              <div className="group">
                <div className="relative border-b border-black/5 dark:border-white/5 group-focus-within:border-primary transition-all duration-500">
                  <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary ml-2" size={16} weight="bold" />
                  <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 pl-10 rounded-none border-none bg-transparent text-base font-black focus-visible:ring-0" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? "SAVING..." : "ACTIVATE ACCOUNT"} <ArrowRightIcon size={14} weight="bold" className="ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SetPasswordPage
