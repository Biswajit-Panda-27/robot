import { RocketIcon } from "@phosphor-icons/react"

const Footer = () => {
  return (
    <footer className="bg-secondary/30 py-12 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <RocketIcon size={32} weight="fill" className="text-primary" />
          <span className="text-xl font-black tracking-tighter">TOYWORLD</span>
        </div>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 font-medium">
          Creating magical moments for every child. Premium quality toys delivered with love.
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium mb-8 text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Support</a>
        </div>
        <p className="text-xs text-muted-foreground/50">
          © 2026 ToyWorld Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
