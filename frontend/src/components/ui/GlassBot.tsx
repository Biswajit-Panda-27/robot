import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform, MotionValue } from "framer-motion"

interface GlassBotProps {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  className?: string
  scale?: number
}

const GlassBot = ({ rotateX: propRotateX, rotateY: propRotateY, className = "", scale = 1 }: GlassBotProps) => {
  const [isTapped, setIsTapped] = useState(false)
  const [isDoubleTapped, setIsDoubleTapped] = useState(false)
  const [isAngry, setIsAngry] = useState(false)
  
  const tapCount = useRef(0)
  const lastTapTime = useRef(0)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const angryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Internal Drag Offsets
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const springDragX = useSpring(dragX, { stiffness: 100, damping: 30 })
  const springDragY = useSpring(dragY, { stiffness: 100, damping: 30 })

  // Combined Rotation
  const combinedRotateX = useTransform([propRotateX, springDragX], ([px, dx]) => (px as number) + (dx as number))
  const combinedRotateY = useTransform([propRotateY, springDragY], ([py, dy]) => (py as number) + (dy as number))

  const handleDrag = (_: any, info: any) => {
    dragX.set(dragX.get() - info.delta.y * 0.4)
    dragY.set(dragY.get() + info.delta.x * 0.4)
  }

  const handleInteraction = () => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapTime.current
    lastTapTime.current = now

    // 1. Check for Angry Mode (High frequency taps)
    tapCount.current += 1
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(() => { tapCount.current = 0 }, 1000)

    if (tapCount.current >= 6) {
      setIsAngry(true)
      if (angryTimeoutRef.current) clearTimeout(angryTimeoutRef.current)
      angryTimeoutRef.current = setTimeout(() => { setIsAngry(false); tapCount.current = 0 }, 4000)
      return
    }

    // 2. Check for Double Tap (Orb Mode)
    if (timeSinceLastTap < 300) {
      setIsDoubleTapped(true)
      setTimeout(() => setIsDoubleTapped(false), 3000)
    } else {
      // 3. Single Tap (Normal Interaction)
      setIsTapped(true)
      setTimeout(() => setIsTapped(false), 1500)
    }
  }

  const earFaceStyle = "absolute inset-0 rounded-full border border-white/20 transition-colors duration-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ scale }}>
      {/* --- BACKGROUND ORB RINGS (Double Tap) --- */}
      <AnimatePresence>
        {isDoubleTapped && (
          <>
            <motion.div
              initial={{ rotateX: 75, rotateZ: 0, opacity: 0, scale: 0.5 }}
              animate={{ rotateZ: 360, opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ rotateZ: { duration: 3, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } }}
              className="absolute w-[400px] h-[400px] border-[2px] border-primary/40 rounded-full pointer-events-none z-0 shadow-[0_0_30px_rgba(188,19,254,0.4)]"
            />
            <motion.div
              initial={{ rotateX: -75, rotateZ: 0, opacity: 0, scale: 0.5 }}
              animate={{ rotateZ: -360, opacity: 0.6, scale: 1.1 }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ rotateZ: { duration: 4, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } }}
              className="absolute w-[360px] h-[360px] border border-neon-blue/30 rounded-full pointer-events-none z-0 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            />
          </>
        )}
      </AnimatePresence>

      {/* Shockwave (Single Tap / Angry) */}
      <AnimatePresence>
        {(isTapped || isAngry) && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: isAngry ? 5 : 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute w-64 h-64 border-2 rounded-full pointer-events-none z-0 ${isAngry ? 'border-red-500 shadow-[0_0_25px_#ff0000]' : 'border-neon-blue/40'}`}
          />
        )}
      </AnimatePresence>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        onTap={handleInteraction}
        animate={isAngry ? { 
          x: [0, -1, 1, -1, 1, 0],
          y: [0, 1, -1, 1, -1, 0]
        } : {}}
        transition={isAngry ? { repeat: Infinity, duration: 0.08 } : {}}
        className="relative w-64 h-64 rounded-full cursor-grab active:cursor-grabbing"
      >
        {/* MAIN BODY SPHERE */}
        <div className={`absolute inset-0 rounded-full border border-white/10 shadow-2xl z-10 pointer-events-none overflow-hidden transition-all duration-500 ${isAngry ? 'bg-red-950/40 border-red-500/50' : isDoubleTapped ? 'border-primary/50 bg-primary/5 shadow-[0_0_40px_rgba(188,19,254,0.2)]' : 'bg-zinc-900/80 dark:bg-black/90'}`} 
             style={{ background: isAngry 
               ? 'radial-gradient(circle at 30% 30%, rgba(255,0,0,0.2) 0%, transparent 70%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.6) 0%, transparent 70%)'
               : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4) 0%, transparent 70%)' 
             }}>
           <div className={`absolute top-4 left-1/4 w-1/2 h-1/4 blur-xl rounded-full ${isAngry ? 'bg-red-500/20' : 'bg-white/10'}`} />
        </div>

        {/* 3D CONTENT CONTAINER */}
        <motion.div
          style={{ 
            rotateX: combinedRotateX, 
            rotateY: combinedRotateY, 
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%"
          }}
          className="relative z-20"
        >
          {/* FACE SECTION */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(100px)", backfaceVisibility: "hidden" }}>
            <div className={`w-40 h-40 rounded-full bg-black/90 border flex flex-col items-center justify-center gap-4 transition-all duration-500 ${isAngry ? 'border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.4)]' : isDoubleTapped ? 'border-primary shadow-[0_0_60px_rgba(188,19,254,0.4)]' : isTapped ? 'bg-neon-pink/10 border-neon-pink/30' : 'border-primary/20'}`}>
              <div className="flex gap-8">
                {/* Eyes */}
                <motion.div
                  animate={isAngry ? { 
                    scaleY: [1, 0.2, 1], skewX: [0, 20, -20, 0]
                  } : isDoubleTapped ? { 
                    scale: [1, 1.5, 1], rotate: [0, 45, 0], borderRadius: ["50%", "20%", "50%"]
                  } : isTapped ? { 
                    scale: [1, 1.3, 1] 
                  } : { 
                    scaleY: [1, 1, 0.1, 1, 1] 
                  }}
                  transition={{ repeat: Infinity, duration: isAngry ? 0.2 : 3 }}
                  className={`w-4 h-6 rounded-full transition-all duration-300 ${isAngry ? "bg-red-500 shadow-[0_0_15px_#ff0000]" : isDoubleTapped ? "bg-white glow-white scale-x-125" : isTapped ? "bg-neon-pink glow-pink" : "bg-neon-blue glow-blue"}`}
                />
                <motion.div
                  animate={isAngry ? { 
                    scaleY: [1, 0.2, 1], skewX: [0, -20, 20, 0]
                  } : isDoubleTapped ? { 
                    scale: [1, 1.5, 1], rotate: [0, -45, 0], borderRadius: ["50%", "20%", "50%"]
                  } : isTapped ? { 
                    scale: [1, 1.3, 1] 
                  } : { 
                    scaleY: [1, 1, 0.1, 1, 1] 
                  }}
                  transition={{ repeat: Infinity, duration: isAngry ? 0.2 : 3 }}
                  className={`w-4 h-6 rounded-full transition-all duration-300 ${isAngry ? "bg-red-500 shadow-[0_0_15px_#ff0000]" : isDoubleTapped ? "bg-white glow-white scale-x-125" : isTapped ? "bg-neon-pink glow-pink" : "bg-neon-blue glow-blue"}`}
                />
              </div>

              {/* Mouth */}
              <div className="relative">
                <motion.div 
                  animate={isAngry ? { width: [24, 48, 24], height: [2, 8, 2] } : isDoubleTapped ? { width: [64, 80, 64], height: [8, 12, 8] } : isTapped ? { width: [32, 64, 32], height: [2, 6, 2] } : { opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className={`w-12 h-1 rounded-full transition-colors duration-300 ${isAngry ? "bg-red-600" : isDoubleTapped ? "bg-white" : isTapped ? "bg-neon-pink" : "bg-neon-blue/30"}`} 
                />
                
                {/* Angry Speech */}
                <AnimatePresence>
                  {isAngry && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <motion.span key={i} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -60, x: (i % 2 === 0 ? 30 : -30), scale: 2 }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="absolute text-[14px] font-black text-red-500">#</motion.span>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* BACK DETAIL */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(-100px) rotateY(180deg)", backfaceVisibility: "hidden" }}>
             <div className="w-40 h-40 rounded-full border-4 border-dashed border-white/5 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                <span className="mt-4 text-[6px] font-black uppercase tracking-[1em] text-white/50">I am warning you do not touch me :(</span>
             </div>
          </div>

          {/* VOLUMETRIC EARS */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8" style={{ transform: "rotateY(-90deg) translateZ(45px)", transformStyle: "preserve-3d" }}>
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateY(0deg)" }} />
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateY(90deg)" }} />
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateX(90deg)" }} />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8" style={{ transform: "rotateY(90deg) translateZ(45px)", transformStyle: "preserve-3d" }}>
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateY(0deg)" }} />
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateY(90deg)" }} />
             <div className={`${earFaceStyle} ${isAngry ? 'bg-red-600 border-red-500 shadow-[0_0_10px_#ff0000]' : isDoubleTapped ? 'bg-white' : isTapped ? 'bg-neon-pink' : 'bg-neon-blue'}`} style={{ transform: "rotateX(90deg)" }} />
          </div>

          {/* Internal Glow Core */}
          <div className={`absolute inset-20 blur-[50px] rounded-full animate-pulse-slow transition-all duration-500 ${isAngry ? 'bg-red-600/40 blur-[90px]' : isDoubleTapped ? 'bg-white/40 blur-[80px]' : isTapped ? 'bg-neon-pink/30' : 'bg-primary/20'}`} style={{ transform: "translateZ(0px)" }} />
        </motion.div>
      </motion.div>

      {/* High-Contrast Interaction Command Strip (Project Highlight) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute -bottom-28 flex flex-col items-center gap-4 pointer-events-none"
      >
        <div className="h-6 w-px bg-primary/20" />
        
        <div className="w-[500px] py-3 rounded-xl bg-primary border-2 border-white/20 shadow-[0_0_30px_rgba(0,242,255,0.4)] flex items-center justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.6em] text-black">
            Drag • Single Tap • Double Tap • Multiple Tap
          </span>
        </div>

        <span className={`text-[9px] font-black uppercase tracking-[0.8em] transition-all duration-500 ${isAngry ? "text-red-500 animate-pulse" : isDoubleTapped ? "text-white animate-bounce" : isTapped ? "text-neon-pink" : "text-muted-foreground/30"}`}>
          {isAngry ? "STOP IT!" : isDoubleTapped ? "Orb Mode Active" : isTapped ? "System Overload" : "Please do not click me"}
        </span>
      </motion.div>
    </div>
  )
}

export default GlassBot
