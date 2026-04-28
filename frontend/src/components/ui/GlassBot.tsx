import { useState } from "react"
import { motion, MotionValue, AnimatePresence } from "framer-motion"

interface GlassBotProps {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  className?: string
  scale?: number
}

const GlassBot = ({ rotateX, rotateY, className = "", scale = 1 }: GlassBotProps) => {
  const [isTapped, setIsTapped] = useState(false)
  const [rotation, setRotation] = useState(0)

  const handleTap = () => {
    setIsTapped(true)
    setRotation(prev => prev + 360) // Add a full spin
    setTimeout(() => setIsTapped(false), 2000)
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ scale }}>
      {/* Shockwave Rings */}
      <AnimatePresence>
        {isTapped && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-64 h-64 border-2 border-neon-blue rounded-full pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ rotateY: rotation }} // Apply the extra spin
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-64 h-64 cursor-pointer active:cursor-grabbing"
        whileTap={{ scale: 0.8 }}
        onClick={handleTap}
      >
        {/* Robot Head - Glass Sphere */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[1000px] shadow-2xl shadow-neon-blue/20" style={{ transform: "translateZ(50px)" }}>
          {/* Screen Face */}
          <div className="absolute inset-4 bg-black/80 rounded-[100px] overflow-hidden flex flex-col items-center justify-center gap-4 border border-white/5 transition-colors duration-500"
            style={{ backgroundColor: isTapped ? 'rgba(0, 242, 255, 0.1)' : 'rgba(0, 0, 0, 0.8)' }}
          >
            {/* Holographic Scan Line */}
            <AnimatePresence>
              {isTapped && (
                <motion.div 
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-neon-blue shadow-[0_0_15px_#00f2ff] z-20 opacity-50"
                />
              )}
            </AnimatePresence>

            <div className="flex gap-8 relative z-10">
              {/* Eyes */}
              <motion.div
                animate={isTapped ? { 
                  scale: [1, 1.3, 1],
                  borderRadius: ["50%", "20%", "50%"],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                } : { 
                  scaleY: [1, 1, 0.1, 1, 1] 
                }}
                transition={isTapped ? { duration: 0.4, repeat: Infinity } : { repeat: Infinity, duration: 3 }}
                className={`w-4 h-6 rounded-full transition-colors duration-300 ${isTapped ? "bg-neon-pink glow-pink" : "bg-neon-blue glow-blue"}`}
              />
              <motion.div
                animate={isTapped ? { 
                  scale: [1, 1.3, 1],
                  borderRadius: ["50%", "20%", "50%"],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                } : { 
                  scaleY: [1, 1, 0.1, 1, 1] 
                }}
                transition={isTapped ? { duration: 0.4, repeat: Infinity } : { repeat: Infinity, duration: 3 }}
                className={`w-4 h-6 rounded-full transition-colors duration-300 ${isTapped ? "bg-neon-pink glow-pink" : "bg-neon-blue glow-blue"}`}
              />
            </div>

            {/* Mouth / Indicator */}
            <motion.div
              animate={isTapped ? {
                width: [32, 64, 32],
                height: [4, 12, 4],
                backgroundColor: ["#bc13fe", "#ff00de", "#bc13fe"]
              } : {
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-12 h-1 bg-neon-blue/30 rounded-full relative z-10"
            />

            {/* Micro-particles */}
            {isTapped && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 40, opacity: 0, x: (i - 4) * 15 }}
                    animate={{ y: -80, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                    className="absolute bottom-0 left-1/2 w-1 h-1 bg-neon-pink rounded-full blur-[1px]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Headphones / Ears */}
        <div className={`absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-20 rounded-full blur-[1px] transition-all duration-700 opacity-80 ${isTapped ? "bg-linear-to-b from-neon-pink to-neon-purple scale-125 rotate-12 shadow-[0_0_30px_#ff00de]" : "bg-linear-to-b from-neon-purple to-neon-blue"}`} style={{ transform: "translateZ(80px) rotateY(-20deg)" }} />
        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-20 rounded-full blur-[1px] transition-all duration-700 opacity-80 ${isTapped ? "bg-linear-to-b from-neon-pink to-neon-purple scale-125 -rotate-12 shadow-[0_0_30px_#ff00de]" : "bg-linear-to-b from-neon-purple to-neon-blue"}`} style={{ transform: "translateZ(80px) rotateY(20deg)" }} />

        {/* Floating Base */}
        <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full transition-all duration-1000 ${isTapped ? "opacity-0 scale-50" : "opacity-100"}`} style={{ transform: "translateZ(20px)" }} />
      </motion.div>

      {/* Playful Warning Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-16 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="h-4 w-px bg-primary/20" />
        <span className={`text-[8px] font-black uppercase tracking-[0.8em] transition-all duration-500 ${isTapped ? "text-neon-pink animate-pulse" : "text-muted-foreground/40"}`}>
          {isTapped ? "System Overload" : "Please do not click me"}
        </span>
      </motion.div>
    </div>
  )
}

export default GlassBot
