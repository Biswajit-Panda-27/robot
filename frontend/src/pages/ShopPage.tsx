import { useState, useEffect } from "react"
import { ShoppingCartIcon, FunnelIcon, MagnifyingGlassIcon, ArrowRightIcon, StarIcon, ClockIcon } from "@phosphor-icons/react"
import SkeletonCard from "@/components/ui/SkeletonCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const ShopPage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const featuredProduct = { 
    id: 1, 
    name: "AeroRocket STEM Kit", 
    category: "STEM", 
    price: 120, 
    rating: 5.0, 
    desc: "A smart desktop companion inspired by the future. express your world with AI.",
    img: "/emo-high-res.png" 
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16" data-aos="fade-up">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-primary">THE COLLECTION</h1>
          <p className="text-muted-foreground text-lg">Quality over quantity. Discover our curated masterworks.</p>
        </div>
      </div>

      {/* Single Product Highlight */}
      <div className="grid lg:grid-cols-2 gap-12 mb-24 items-center bg-secondary/20 rounded-[3rem] p-8 lg:p-12 border border-black/5" data-aos="zoom-in">
        <div className="aspect-square bg-muted rounded-[2.5rem] overflow-hidden relative group">
          {isLoading ? (
            <div className="w-full h-full skeleton-shimmer" />
          ) : (
            <img 
              src={featuredProduct.img} 
              alt={featuredProduct.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          )}
          <Badge className="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
            Featured Masterpiece
          </Badge>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-neon-blue">
            <StarIcon size={20} weight="fill" />
            <StarIcon size={20} weight="fill" />
            <StarIcon size={20} weight="fill" />
            <StarIcon size={20} weight="fill" />
            <StarIcon size={20} weight="fill" />
            <span className="ml-2 font-bold text-sm">5.0 (250+ Reviews)</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{featuredProduct.name}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {featuredProduct.desc}
          </p>
          <div className="text-3xl font-black text-primary">${featuredProduct.price}.00</div>
          <div className="flex gap-4">
            <Button className="flex-grow rounded-full py-8 font-black uppercase tracking-widest text-xs bg-primary shadow-xl shadow-primary/20">
              Add to Bag <ShoppingCartIcon size={20} weight="bold" className="ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-black/10 shrink-0">
              <ArrowRightIcon size={24} weight="bold" />
            </Button>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div data-aos="fade-up">
        <h3 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-3">
          <ClockIcon size={24} weight="bold" className="text-neon-pink" />
          UPCOMING RELEASES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dashed border-black/20 dark:border-white/20 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-4 group hover:bg-secondary/10 transition-colors">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse">
                <ClockIcon size={32} weight="bold" className="text-muted-foreground" />
              </div>
              <h4 className="font-black tracking-tight text-lg opacity-50 uppercase tracking-widest">Project 0{i+1}</h4>
              <p className="text-muted-foreground text-sm max-w-[200px]">
                Currently in the engineering lab. Estimated release: Q3 2026.
              </p>
              <Button variant="ghost" className="mt-4 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                Notify Me
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopPage
