import { ArrowRightIcon } from "@phosphor-icons/react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import GlassBot from "@/components/ui/GlassBot"

const Hero = () => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 })
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 })

  const rotateX = useTransform(mouseY, [-300, 300], [20, -20])
  const rotateY = useTransform(mouseX, [-300, 300], [-30, 30])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - (rect.left + rect.width / 2))
    y.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20 mesh-gradient dark:mesh-gradient-dark perspective-[2000px]"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-20 max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-auto"
        >
          <motion.h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-none mb-12 text-primary">
            PLAY.<br />
            <span className="text-muted-foreground/20 italic">FUTURE.</span>
          </motion.h1>

          <div className="flex flex-col gap-8">
            <div className="max-w-md text-sm md:text-lg text-muted-foreground font-medium leading-relaxed border-l-2 pl-6">
              The world's most advanced AI companions are here. Interactive, intelligent, and beautifully crafted in 3D.
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild className="rounded-full px-10 py-8 font-black text-xs uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                <Link to="/shop">
                  Get Started <ArrowRightIcon size={18} weight="bold" className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="relative h-[500px] w-full flex items-center justify-center pointer-events-auto">
          <GlassBot rotateX={rotateX} rotateY={rotateY} />
        </div>
      </div>
    </section>
  )
}

export default Hero
