import { ArrowRight, Play } from "@phosphor-icons/react"
import { motion } from "framer-motion"

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20 mesh-gradient dark:mesh-gradient-dark">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-blue/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8 glow-blue"
        >
          <span className="w-2 h-2 bg-neon-blue rounded-full animate-ping" />
          The New Standard in AI
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-12"
        >
          FUTURE<br />
          <span className="text-muted-foreground/20 italic">INTELLIGENT.</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <div className="max-w-md text-sm md:text-lg text-muted-foreground font-medium leading-relaxed md:text-left border-l-2 pl-6">
            Meet the next generation of robotic companionship. Designed to empower, built to last, and programmed to understand.
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-accent hover:text-white transition-all duration-500 shadow-xl shadow-black/10 active:scale-95">
              Get Started <ArrowRight size={18} weight="bold" />
            </button>
            <button className="group flex items-center gap-4 bg-secondary/80 hover:bg-secondary px-8 py-5 rounded-full font-bold text-xs uppercase tracking-widest transition-all">
              <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Play size={16} weight="fill" className="ml-0.5" />
              </div>
              Watch Film
            </button>
          </div>
        </motion.div>
      </div>

    </section>
  )
}

export default Hero
