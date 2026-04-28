import { useEffect, useState } from "react"
import { ArrowRightIcon, ShoppingCartIcon, SparkleIcon } from "@phosphor-icons/react"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="animate-in fade-in duration-700">
      <Hero />
      <Features />
      
      {/* Exclusive Spotlight Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <SparkleIcon size={14} weight="fill" />
              Limited First Edition
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.05]">
              The One & Only <br />
              <span className="text-muted-foreground/30">AeroRocket.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
              We focus on perfection. Our first-ever STEM kit is designed to inspire the next generation of space explorers. Experience unmatched quality in every part.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="rounded-full px-10 py-8 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30">
                <Link to="/shop">
                  Get Yours Now <ArrowRightIcon size={18} weight="bold" className="ml-2" />
                </Link>
              </Button>
              <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-black/5 bg-secondary/20">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest">Only 15 Units Left</span>
              </div>
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full animate-pulse" />
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl shadow-black/10">
              <img 
                src="/emo-high-res.png" 
                alt="EMO AI Robot High Res" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-12">Quality Built For Life</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale">
            {["Premium", "Hand-Crafted", "Sustainable", "Certified"].map((text) => (
              <div key={text} className="text-xl font-black tracking-tighter italic">{text}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
