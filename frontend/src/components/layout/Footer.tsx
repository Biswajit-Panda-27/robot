import { Cpu } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Cpu size={24} />
          <span className="text-xl font-bold tracking-tight">ROBOT</span>
        </div>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
          The next evolution in robotic e-commerce. Built for the future, delivered today.
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium mb-8 text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Support</a>
        </div>
        <p className="text-xs text-muted-foreground/50">
          © 2026 Robot E-commerce Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
