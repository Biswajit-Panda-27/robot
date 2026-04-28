import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { SparkleIcon, XIcon } from "@phosphor-icons/react"

const announcements = [
  "🎉 Free shipping on all orders over $75!",
  "🧸 New STEM toys just arrived! Explore now.",
  "🎁 Get a free mystery toy with every purchase today!"
]

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 relative overflow-hidden flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] z-[60]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <SparkleIcon size={14} weight="fill" className="text-neon-blue" />
          {announcements[index]}
        </motion.div>
      </AnimatePresence>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 hover:scale-110 transition-transform opacity-50 hover:opacity-100"
      >
        <XIcon size={14} weight="bold" />
      </button>
    </div>
  )
}

export default AnnouncementBar
