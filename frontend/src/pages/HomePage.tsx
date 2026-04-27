import { useEffect, useState } from "react"
import { ArrowRight, ShoppingCart } from "lucide-react"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import SkeletonCard from "@/components/ui/SkeletonCard"

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
      
      {/* Product Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Hardware</h2>
            <p className="text-muted-foreground">Ready to ship components for your next build.</p>
          </div>
          <button className="text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            [1, 2, 3, 4].map((p) => (
              <div 
                key={p} 
                data-aos="fade-up" 
                className="group border rounded-2xl p-4 flex flex-col gap-4 hover:border-accent transition-colors bg-card"
              >
                <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop`} 
                    alt="Hardware" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div>
                  <h3 className="font-bold">RoboCore v{p}.0</h3>
                  <p className="text-sm text-muted-foreground">High-performance actuator</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold">$499.00</span>
                  <button className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
