import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
  delay?: number
}

export const Tooltip = ({ children, content, className, delay = 0.2 }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, delay }}
            className={cn(
              "absolute top-full mt-2 z-[100] px-3 py-1.5 rounded-lg",
              "bg-black/80 dark:bg-white/90 backdrop-blur-md",
              "text-[10px] font-black uppercase tracking-widest",
              "text-white dark:text-black",
              "border border-white/10 dark:border-black/10",
              "shadow-xl pointer-events-none whitespace-nowrap",
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-inherit border-l border-t border-inherit" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
