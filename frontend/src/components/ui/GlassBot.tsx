import { motion, MotionValue } from "framer-motion"

interface GlassBotProps {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  className?: string
  scale?: number
}

const GlassBot = ({ rotateX, rotateY, className = "", scale = 1 }: GlassBotProps) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ scale }}>
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-64 h-64"
      >
        {/* Robot Head - Glass Cube */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl shadow-neon-blue/20" style={{ transform: "translateZ(50px)" }}>
          {/* Screen Face */}
          <div className="absolute inset-4 bg-black/80 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center gap-4 border border-white/5">
            <div className="flex gap-8">
              <motion.div 
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-4 h-6 bg-neon-blue rounded-full glow-blue" 
              />
              <motion.div 
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-4 h-6 bg-neon-blue rounded-full glow-blue" 
              />
            </div>
            {/* Pulsing Mouth/Indicator */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-1 bg-neon-blue/30 rounded-full" 
            />
          </div>
        </div>

        {/* Headphones / Ears */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-20 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full blur-[1px] opacity-80" style={{ transform: "translateZ(80px) rotateY(-20deg)" }} />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-20 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full blur-[1px] opacity-80" style={{ transform: "translateZ(80px) rotateY(20deg)" }} />

        {/* Floating Body Part / Base */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full" style={{ transform: "translateZ(20px)" }} />
      </motion.div>
    </div>
  )
}

export default GlassBot
